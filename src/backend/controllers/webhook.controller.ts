import type { ProcessWebhookResult, ProcessorType, ProcessorWebhookEvent } from '../domain/types';
import { DomainError } from '../domain/errors';
import { validateProcessorWebhookEvent } from '../domain/validation';
import { WebhookProcessingService } from '../services/webhook-processing.service';

export interface IncomingWebhookHttpRequest {
  headers: Record<string, string | undefined>;
  body: unknown;
}

export interface IncomingWebhookHttpResponse {
  statusCode: number;
  body: {
    acknowledged: boolean;
    eventId?: string;
    transactionId?: string;
    status?: ProcessWebhookResult['status'];
    reason?: string;
  };
}

/**
 * Framework-agnostic webhook controller.
 * Can be used from Next.js route handlers, Express, Fastify, or serverless handlers.
 */
export class WebhookController {
  constructor(private readonly webhookProcessingService: WebhookProcessingService) {}

  async receive(request: IncomingWebhookHttpRequest): Promise<IncomingWebhookHttpResponse> {
    const event = this.buildProcessorWebhookEvent(request);

    try {
      const result = await this.webhookProcessingService.process({
        event,
        receivedAt: new Date().toISOString(),
        allowRetry: true,
      });

      return {
        statusCode: 202,
        body: {
          acknowledged: true,
          eventId: event.eventId,
          transactionId: result.transactionId,
          status: result.status,
          reason: result.ignoredReason,
        },
      };
    } catch (error: unknown) {
      const domainError = error instanceof DomainError ? error : null;
      const statusCode = domainError?.code === 'VALIDATION_ERROR' ? 401 : 400;

      return {
        statusCode,
        body: {
          acknowledged: false,
          eventId: event.eventId,
          reason: domainError?.message ?? 'Webhook rejected.',
        },
      };
    }
  }

  private buildProcessorWebhookEvent(request: IncomingWebhookHttpRequest): ProcessorWebhookEvent {
    const payload = request.body as Partial<ProcessorWebhookEvent>;

    const event: ProcessorWebhookEvent = {
      processor: payload.processor as ProcessorType,
      eventId: String(payload.eventId ?? ''),
      eventType: String(payload.eventType ?? ''),
      occurredAt: String(payload.occurredAt ?? new Date().toISOString()),
      signature: request.headers['x-webhook-signature'] ?? payload.signature,
      payload: payload.payload,
    };

    return validateProcessorWebhookEvent(event);
  }
}
