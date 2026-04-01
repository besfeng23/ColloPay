import type { ProcessorAdapterRegistry } from '../adapters/processor-adapter';
import { DomainError } from '../domain/errors';
import type { ProcessWebhookResult, ProcessorWebhookEvent } from '../domain/types';
import { validateProcessorWebhookEvent } from '../domain/validation';
import type { TransactionRepository, WebhookEventRepository } from '../ports/repositories';
import { AuditLogService } from './audit-log.service';
import { TransactionOrchestrationService } from './transaction-orchestrator.service';

export class WebhookProcessingService {
  constructor(
    private readonly adapterRegistry: ProcessorAdapterRegistry,
    private readonly webhookEventRepo: WebhookEventRepository,
    private readonly transactionRepo: TransactionRepository,
    private readonly transactionOrchestrationService: TransactionOrchestrationService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async process(event: ProcessorWebhookEvent): Promise<ProcessWebhookResult> {
    const validEvent = validateProcessorWebhookEvent(event);

    const alreadyProcessed = await this.webhookEventRepo.hasProcessed(validEvent.eventId, validEvent.processor);
    if (alreadyProcessed) {
      return { acknowledged: true, ignoredReason: 'duplicate_event' };
    }

    const adapter = this.adapterRegistry.getAdapter(validEvent.processor);
    const verified = await adapter.verifyWebhookSignature(validEvent);
    if (!verified) {
      throw new DomainError('Webhook signature verification failed.', 'VALIDATION_ERROR', {
        eventId: validEvent.eventId,
      });
    }

    const update = await adapter.resolveWebhookUpdate(validEvent);
    if (!update) {
      await this.webhookEventRepo.markProcessed(validEvent.eventId, validEvent.processor, new Date().toISOString());
      return { acknowledged: true, ignoredReason: 'unmapped_webhook_status' };
    }

    const transaction = await this.transactionRepo.getByProcessorTransactionId(update.processorTransactionId);
    if (!transaction) {
      throw new DomainError('Transaction not found for webhook processor reference.', 'NOT_FOUND_ERROR', {
        processorTransactionId: update.processorTransactionId,
      });
    }

    await this.transactionOrchestrationService.applyStatusUpdate(
      transaction.id,
      update.nextStatus,
      update.reason,
      `webhook:${validEvent.processor}`,
    );

    await this.webhookEventRepo.markProcessed(validEvent.eventId, validEvent.processor, new Date().toISOString());

    await this.auditLogService.log({
      action: 'WEBHOOK_PROCESSED',
      actor: `webhook:${validEvent.processor}`,
      resourceType: 'WEBHOOK',
      resourceId: validEvent.eventId,
      occurredAt: new Date().toISOString(),
      details: {
        transactionId: transaction.id,
        nextStatus: update.nextStatus,
        eventType: validEvent.eventType,
      },
    });

    return {
      acknowledged: true,
      transactionId: transaction.id,
    };
  }
}
