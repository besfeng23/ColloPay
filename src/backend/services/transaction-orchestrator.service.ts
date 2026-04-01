import { randomUUID } from 'crypto';
import { assertValidStatusTransition } from '../domain/status-machine';
import {
  type CreateTransactionRequest,
  type PartnerPaymentResponse,
  type Transaction,
  type TransactionStatus,
} from '../domain/types';
import { validateCreateTransactionRequest } from '../domain/validation';
import type { ProcessorAdapterRegistry } from '../adapters/processor-adapter';
import { DomainError } from '../domain/errors';
import type {
  MerchantMappingRepository,
  TransactionRepository,
  TransactionStatusHistoryRepository,
} from '../ports/repositories';
import { AuditLogService } from './audit-log.service';
import { FeeEngineService } from './fee-engine.service';
import { IdempotencyService } from './idempotency.service';

export class TransactionOrchestrationService {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly historyRepo: TransactionStatusHistoryRepository,
    private readonly feeEngine: FeeEngineService,
    private readonly adapterRegistry: ProcessorAdapterRegistry,
    private readonly merchantMappingRepo: MerchantMappingRepository,
    private readonly idempotencyService: IdempotencyService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    const response = await this.createPartnerPayment(request);
    const created = await this.transactionRepo.getById(response.transactionId);
    if (!created) {
      throw new DomainError('Transaction created but could not be reloaded.', 'INTEGRATION_ERROR', {
        transactionId: response.transactionId,
      });
    }

    return created;
  }

  async createPartnerPayment(request: CreateTransactionRequest): Promise<PartnerPaymentResponse> {
    const validRequest = validateCreateTransactionRequest(request);
    await this.validateMerchantMapping(validRequest);

    const result = await this.idempotencyService.enforceWithMetadata(
      `transaction:create:${validRequest.merchant.merchantId}`,
      validRequest.idempotencyKey,
      validRequest,
      async (): Promise<PartnerPaymentResponse> => {
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
        await this.logOrchestrationEvent('TRANSACTION_RECORD_CREATED', transaction.id, {
          externalReference: transaction.externalReference,
          idempotencyKey: validRequest.idempotencyKey,
        });

        await this.transitionTransactionStatus(transaction, 'PENDING_PROCESSOR', 'processor_request_queued', 'system:orchestrator');
        await this.logOrchestrationEvent('TRANSACTION_STATUS_UPDATED', transaction.id, {
          from: 'INITIATED',
          to: 'PENDING_PROCESSOR',
        });

        const adapter = this.adapterRegistry.getAdapter(validRequest.processor);
        const processorResult = await adapter.createPayment(validRequest).catch((error: unknown) => {
          throw new DomainError('Processor adapter createPayment failed.', 'INTEGRATION_ERROR', {
            processor: validRequest.processor,
            cause: error instanceof Error ? error.message : String(error),
          });
        });

        await this.transactionRepo.updateProcessorReference(transaction.id, processorResult.processorTransactionId, new Date().toISOString());
        await this.logOrchestrationEvent('PROCESSOR_REFERENCE_STORED', transaction.id, {
          processor: validRequest.processor,
          processorTransactionId: processorResult.processorTransactionId,
        });

        const finalStatus = processorResult.status;
        await this.transitionTransactionStatus(
          { ...transaction, status: 'PENDING_PROCESSOR' },
          finalStatus,
          'processor_create_response',
          'system:orchestrator',
        );
        await this.logOrchestrationEvent('TRANSACTION_STATUS_UPDATED', transaction.id, {
          from: 'PENDING_PROCESSOR',
          to: finalStatus,
        });

        const created = await this.transactionRepo.getById(transaction.id);
        if (!created) {
          throw new DomainError('Failed to load transaction after create flow.', 'INTEGRATION_ERROR', {
            transactionId: transaction.id,
          });
        }

        return this.toPartnerResponse(created, validRequest.idempotencyKey, false);
      },
    );

    if (result.replayed) {
      await this.logOrchestrationEvent('IDEMPOTENCY_REPLAY_RETURNED', result.response.transactionId, {
        idempotencyKey: validRequest.idempotencyKey,
      });
    }

    return {
      ...result.response,
      idempotency: {
        key: validRequest.idempotencyKey,
        replayed: result.replayed,
      },
    };
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

  private async validateMerchantMapping(request: CreateTransactionRequest): Promise<void> {
    const isMapped = await this.merchantMappingRepo.isProcessorMapped({
      merchantId: request.merchant.merchantId,
      partnerId: request.merchant.partnerId,
      processor: request.processor,
    });

    if (!isMapped) {
      throw new DomainError('Merchant is not mapped to the requested processor.', 'VALIDATION_ERROR', {
        merchantId: request.merchant.merchantId,
        partnerId: request.merchant.partnerId,
        processor: request.processor,
      });
    }
  }

  private toPartnerResponse(
    transaction: Transaction,
    idempotencyKey: string,
    replayed: boolean,
  ): PartnerPaymentResponse {
    return {
      transactionId: transaction.id,
      externalReference: transaction.externalReference,
      status: transaction.status,
      processor: transaction.processor,
      processorReference: transaction.processorTransactionId,
      amount: transaction.amount,
      netAmountMinor: transaction.netAmountMinor,
      feeBreakdown: transaction.feeBreakdown,
      idempotency: { key: idempotencyKey, replayed },
      auditTrail: {
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    };
  }

  private async logOrchestrationEvent(action: string, transactionId: string, details: Record<string, unknown>): Promise<void> {
    await this.auditLogService.log({
      action,
      actor: 'system:orchestrator',
      resourceType: 'TRANSACTION',
      resourceId: transactionId,
      occurredAt: new Date().toISOString(),
      details,
    });
  }
}
