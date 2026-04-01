import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/domain.errors';
import type { ProcessorAdapter } from '../interfaces/processor-adapter.interface';
import type { TransactionRepository } from '../interfaces/repositories.interface';
import type { AuditLogger } from '../../domain/events/audit.events';
import type { Transaction } from '../../domain/entities/transaction.entity';
import { createTransactionSchema, type CreateTransactionInput } from '../validators/create-transaction.validator';
import { FeeEngineService } from './fee-engine.service';
import { IdempotencyService } from './idempotency.service';
import { TransactionStatusService } from './transaction-status.service';

export class TransactionOrchestrationService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly adapters: Map<string, ProcessorAdapter>,
    private readonly feeEngine: FeeEngineService,
    private readonly idempotency: IdempotencyService,
    private readonly statusService: TransactionStatusService,
    private readonly auditLogger: AuditLogger
  ) {}

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const parsed = createTransactionSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }

    const scopedKey = `${input.partnerId}:${input.idempotencyKey}`;

    return this.idempotency.withLock(scopedKey, async () => {
      const existing = await this.transactionRepository.findByIdempotencyKey(input.partnerId, input.idempotencyKey);
      if (existing) return existing;

      const adapter = this.adapters.get(input.processor);
      if (!adapter) {
        throw new ValidationError(`Processor ${input.processor} is not configured`);
      }

      const now = new Date().toISOString();
      const transaction: Transaction = {
        id: randomUUID(),
        partnerId: input.partnerId,
        idempotencyKey: input.idempotencyKey,
        externalReference: input.externalReference,
        paymentMethodType: input.paymentMethodType,
        amount: input.amount,
        fees: this.feeEngine.calculate(input.amount, input.paymentMethodType),
        status: 'created',
        processor: input.processor,
        metadata: input.metadata,
        createdAt: now,
        updatedAt: now
      };

      await this.transactionRepository.create(transaction);

      const processorResponse = await adapter.createTransaction({
        transactionId: transaction.id,
        amount: transaction.amount,
        paymentMethodToken: input.paymentMethodToken,
        idempotencyKey: input.idempotencyKey,
        metadata: transaction.metadata
      });

      let updated: Transaction = {
        ...transaction,
        processorTransactionId: processorResponse.processorTransactionId,
        updatedAt: new Date().toISOString()
      };
      await this.transactionRepository.update(updated);

      updated = await this.statusService.transition(
        updated,
        processorResponse.status,
        'system',
        'Initial processor acknowledgement'
      );

      await this.auditLogger.log({
        entityType: 'transaction',
        entityId: updated.id,
        action: 'transaction_created',
        actor: 'partner_api',
        occurredAt: new Date().toISOString(),
        metadata: {
          processor: updated.processor,
          processorTransactionId: updated.processorTransactionId ?? null
        }
      });

      return updated;
    });
  }
}
