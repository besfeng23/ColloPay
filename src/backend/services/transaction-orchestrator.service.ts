import { randomUUID } from 'crypto';
import { assertValidStatusTransition } from '../domain/status-machine';
import {
  type CreateTransactionRequest,
  type Transaction,
  type TransactionStatus,
} from '../domain/types';
import { validateCreateTransactionRequest } from '../domain/validation';
import type { ProcessorAdapterRegistry } from '../adapters/processor-adapter';
import type { TransactionRepository, TransactionStatusHistoryRepository } from '../ports/repositories';
import { AuditLogService } from './audit-log.service';
import { FeeEngineService } from './fee-engine.service';
import { IdempotencyService } from './idempotency.service';

export class TransactionOrchestrationService {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly historyRepo: TransactionStatusHistoryRepository,
    private readonly feeEngine: FeeEngineService,
    private readonly adapterRegistry: ProcessorAdapterRegistry,
    private readonly idempotencyService: IdempotencyService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    const validRequest = validateCreateTransactionRequest(request);

    return this.idempotencyService.enforce(
      `transaction:create:${validRequest.merchant.merchantId}`,
      validRequest.idempotencyKey,
      validRequest,
      async () => {
        const now = new Date().toISOString();
        const feeBreakdown = this.feeEngine.calculate(validRequest.amount);
        const transaction: Transaction = {
          id: randomUUID(),
          externalReference: validRequest.externalReference,
          processor: validRequest.processor,
          merchant: validRequest.merchant,
          amount: validRequest.amount,
          netAmountMinor: validRequest.amount.amountMinor - feeBreakdown.totalFeeMinor,
          feeBreakdown,
          status: 'INITIATED',
          metadata: validRequest.metadata,
          createdAt: now,
          updatedAt: now,
        };

        await this.transactionRepo.create(transaction);

        await this.transitionTransactionStatus(transaction, 'PENDING_PROCESSOR', 'processor_request_queued', 'system:orchestrator');

        const adapter = this.adapterRegistry.getAdapter(validRequest.processor);
        const processorResult = await adapter.createPayment(validRequest);

        await this.transactionRepo.updateProcessorReference(transaction.id, processorResult.processorTransactionId, new Date().toISOString());

        const finalStatus = processorResult.status;
        await this.transitionTransactionStatus(
          { ...transaction, status: 'PENDING_PROCESSOR' },
          finalStatus,
          'processor_create_response',
          'system:orchestrator',
        );

        const created = await this.transactionRepo.getById(transaction.id);
        if (!created) {
          throw new Error('Failed to load transaction after create flow.');
        }

        await this.auditLogService.log({
          action: 'TRANSACTION_CREATED',
          actor: 'system:orchestrator',
          resourceType: 'TRANSACTION',
          resourceId: created.id,
          occurredAt: new Date().toISOString(),
          details: {
            status: created.status,
            processor: created.processor,
            amountMinor: created.amount.amountMinor,
          },
        });

        return created;
      },
    );
  }

  async applyStatusUpdate(transactionId: string, nextStatus: TransactionStatus, reason: string, actor: string): Promise<void> {
    const existing = await this.transactionRepo.getById(transactionId);
    if (!existing) {
      throw new Error(`Transaction ${transactionId} not found.`);
    }

    await this.transitionTransactionStatus(existing, nextStatus, reason, actor);
  }

  private async transitionTransactionStatus(
    transaction: Transaction,
    nextStatus: TransactionStatus,
    reason: string,
    actor: string,
  ): Promise<void> {
    assertValidStatusTransition(transaction.status, nextStatus);

    const changedAt = new Date().toISOString();
    await this.transactionRepo.updateStatus(transaction.id, nextStatus, reason, changedAt);

    await this.historyRepo.append({
      transactionId: transaction.id,
      from: transaction.status,
      to: nextStatus,
      reason,
      actor,
      at: changedAt,
    });
  }
}
