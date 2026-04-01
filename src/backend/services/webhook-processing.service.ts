import type { ProcessorAdapterRegistry } from '../adapters/processor-adapter';
import { DomainError } from '../domain/errors';
import type { ProcessWebhookCommand, ProcessWebhookResult, ProcessorWebhookEvent } from '../domain/types';
import { assertWebhookEventFreshness, validateProcessorWebhookEvent } from '../domain/validation';
import type { TransactionRepository, WebhookEventRepository } from '../ports/repositories';
import { AuditLogService } from './audit-log.service';
import { TransactionOrchestrationService } from './transaction-orchestrator.service';

export class WebhookProcessingService {
  private static readonly MAX_WEBHOOK_AGE_SECONDS = 60 * 15;
  private static readonly MAX_WEBHOOK_FUTURE_SKEW_SECONDS = 60;

  constructor(
    private readonly adapterRegistry: ProcessorAdapterRegistry,
    private readonly webhookEventRepo: WebhookEventRepository,
    private readonly transactionRepo: TransactionRepository,
    private readonly transactionOrchestrationService: TransactionOrchestrationService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async process(command: ProcessWebhookCommand | ProcessorWebhookEvent): Promise<ProcessWebhookResult> {
    const normalized = this.normalizeCommand(command);
    const validEvent = validateProcessorWebhookEvent(normalized.event);
    assertWebhookEventFreshness(validEvent.occurredAt, {
      maxAgeSeconds: WebhookProcessingService.MAX_WEBHOOK_AGE_SECONDS,
      maxFutureSkewSeconds: WebhookProcessingService.MAX_WEBHOOK_FUTURE_SKEW_SECONDS,
    });
    const processingKey = this.toProcessingKey(validEvent.eventId, validEvent.processor);

    let eventRecord = await this.webhookEventRepo.findByEventId(validEvent.eventId, validEvent.processor);
    if (!eventRecord) {
      eventRecord = await this.webhookEventRepo.createReceived({
        event: validEvent,
        processingKey,
        receivedAt: normalized.receivedAt,
      });
    } else {
      const attempt = await this.webhookEventRepo.incrementAttempt(validEvent.eventId, validEvent.processor);
      if (eventRecord.status === 'PROCESSED' || eventRecord.status === 'DUPLICATE') {
        await this.webhookEventRepo.markStatus({
          eventId: validEvent.eventId,
          processor: validEvent.processor,
          status: 'DUPLICATE',
          processedAt: new Date().toISOString(),
          outcomeCode: 'duplicate_event',
          correlationStatus: eventRecord.correlationStatus,
        });
        return {
          acknowledged: true,
          status: 'DUPLICATE',
          ignoredReason: 'duplicate_event',
          attemptCount: attempt,
        };
      }
    }

    const adapter = this.adapterRegistry.getAdapter(validEvent.processor);
    const verified = await adapter.verifyWebhookSignature(validEvent);
    if (!verified) {
      await this.webhookEventRepo.markStatus({
        eventId: validEvent.eventId,
        processor: validEvent.processor,
        status: 'FAILED',
        processedAt: new Date().toISOString(),
        outcomeCode: 'signature_verification_failed',
        processingError: 'Signature verification failed.',
      });
      throw new DomainError('Webhook signature verification failed.', 'VALIDATION_ERROR', {
        eventId: validEvent.eventId,
      });
    }
    await this.webhookEventRepo.markStatus({
      eventId: validEvent.eventId,
      processor: validEvent.processor,
      status: 'SIGNATURE_VERIFIED',
      outcomeCode: 'signature_verified',
    });

    const update = await adapter.resolveWebhookUpdate(validEvent);
    if (!update) {
      await this.webhookEventRepo.markStatus({
        eventId: validEvent.eventId,
        processor: validEvent.processor,
        status: 'MANUAL_REVIEW',
        processedAt: new Date().toISOString(),
        outcomeCode: 'unmapped_webhook_status',
      });
      return { acknowledged: true, status: 'MANUAL_REVIEW', ignoredReason: 'unmapped_webhook_status' };
    }

    await this.webhookEventRepo.markStatus({
      eventId: validEvent.eventId,
      processor: validEvent.processor,
      status: 'PROCESSING',
      outcomeCode: 'processing_started',
    });

    const transaction = await this.transactionRepo.getByProcessorTransactionId(update.processorTransactionId);
    if (!transaction) {
      const deadLetterReason = 'missing_internal_transaction_correlation';
      await this.webhookEventRepo.markStatus({
        eventId: validEvent.eventId,
        processor: validEvent.processor,
        status: normalized.allowRetry ? 'RETRY_PENDING' : 'DEAD_LETTER',
        processedAt: new Date().toISOString(),
        outcomeCode: normalized.allowRetry ? 'correlation_retry_pending' : 'correlation_failed_dead_letter',
        correlationStatus: 'CORRELATION_FAILED',
        retryable: normalized.allowRetry,
        nextRetryAt: normalized.allowRetry ? this.computeNextRetryAt(1) : undefined,
        deadLetterReason: normalized.allowRetry ? undefined : deadLetterReason,
        processingError: deadLetterReason,
      });

      return {
        acknowledged: true,
        status: normalized.allowRetry ? 'RETRY_PENDING' : 'DEAD_LETTER',
        correlationStatus: 'CORRELATION_FAILED',
        retryable: normalized.allowRetry,
        ignoredReason: deadLetterReason,
      };
    }

    try {
      await this.transactionOrchestrationService.applyStatusUpdate(
        transaction.id,
        update.nextStatus,
        update.reason,
        `webhook:${validEvent.processor}`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'unknown_webhook_status_update_error';
      const retryable = this.isRetryableProcessingError(error);
      await this.webhookEventRepo.markStatus({
        eventId: validEvent.eventId,
        processor: validEvent.processor,
        status: retryable ? 'RETRY_PENDING' : 'FAILED',
        processedAt: new Date().toISOString(),
        transactionId: transaction.id,
        outcomeCode: retryable ? 'retry_pending_transaction_update' : 'transaction_status_update_failed',
        correlationStatus: 'CORRELATED',
        retryable,
        nextRetryAt: retryable ? this.computeNextRetryAt(2) : undefined,
        processingError: message,
      });
      return {
        acknowledged: true,
        transactionId: transaction.id,
        status: retryable ? 'RETRY_PENDING' : 'FAILED',
        correlationStatus: 'CORRELATED',
        retryable,
        ignoredReason: message,
      };
    }

    await this.webhookEventRepo.markStatus({
      eventId: validEvent.eventId,
      processor: validEvent.processor,
      status: 'PROCESSED',
      processedAt: new Date().toISOString(),
      transactionId: transaction.id,
      outcomeCode: 'processed',
      correlationStatus: 'CORRELATED',
      retryable: false,
    });

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
      status: 'PROCESSED',
      correlationStatus: 'CORRELATED',
      retryable: false,
    };
  }

  private normalizeCommand(command: ProcessWebhookCommand | ProcessorWebhookEvent): Required<ProcessWebhookCommand> {
    if ('event' in command) {
      return {
        event: command.event,
        receivedAt: command.receivedAt ?? new Date().toISOString(),
        allowRetry: command.allowRetry ?? true,
      };
    }

    return {
      event: command,
      receivedAt: new Date().toISOString(),
      allowRetry: true,
    };
  }

  private toProcessingKey(eventId: string, processor: string): string {
    return `${processor}:${eventId}`;
  }

  private computeNextRetryAt(attempt: number): string {
    const delaySeconds = Math.min(300, Math.max(10, attempt * 15));
    return new Date(Date.now() + delaySeconds * 1_000).toISOString();
  }

  private isRetryableProcessingError(error: unknown): boolean {
    return !(error instanceof DomainError && error.code === 'STATE_TRANSITION_ERROR');
  }
}
