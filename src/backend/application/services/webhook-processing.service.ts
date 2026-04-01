import { ValidationError } from '../errors/domain.errors';
import type { ProcessorAdapter } from '../interfaces/processor-adapter.interface';
import type { TransactionRepository, WebhookEventRepository } from '../interfaces/repositories.interface';
import type { AuditLogger } from '../../domain/events/audit.events';
import { TransactionStatusService } from './transaction-status.service';

export class WebhookProcessingService {
  constructor(
    private readonly adapters: Map<string, ProcessorAdapter>,
    private readonly transactionRepository: TransactionRepository,
    private readonly webhookRepository: WebhookEventRepository,
    private readonly statusService: TransactionStatusService,
    private readonly auditLogger: AuditLogger
  ) {}

  async ingest(processor: string, payloadText: string, signature?: string): Promise<void> {
    const adapter = this.adapters.get(processor);
    if (!adapter) throw new ValidationError(`Unknown processor: ${processor}`);

    if (signature) {
      const valid = await adapter.verifyWebhookSignature(payloadText, signature);
      if (!valid) throw new ValidationError('Invalid webhook signature');
    }

    const payload = JSON.parse(payloadText);
    const event = await adapter.parseWebhookEvent(payload, signature);

    if (await this.webhookRepository.hasProcessed(event.eventId, event.processor)) {
      return;
    }

    const transaction = await this.transactionRepository.findByProcessorTransactionId(
      event.processor,
      event.processorTransactionId
    );
    if (!transaction) {
      throw new ValidationError('Transaction not found for webhook event');
    }

    if (event.statusHint && event.statusHint !== transaction.status) {
      await this.statusService.transition(transaction, event.statusHint, 'processor_webhook', `Webhook ${event.eventType}`);
    }

    await this.webhookRepository.markProcessed(event);

    await this.auditLogger.log({
      entityType: 'webhook',
      entityId: event.eventId,
      action: 'webhook_processed',
      actor: 'processor_webhook',
      occurredAt: new Date().toISOString(),
      metadata: {
        processor: event.processor,
        eventType: event.eventType,
        processorTransactionId: event.processorTransactionId
      }
    });
  }
}
