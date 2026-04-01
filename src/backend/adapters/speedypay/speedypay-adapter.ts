import { DomainError } from '../../domain/errors';
import type {
  CreateTransactionRequest,
  ProcessorCreatePaymentResult,
  ProcessorWebhookEvent,
} from '../../domain/types';
import type {
  ProcessorAdapter,
  ProcessorPaymentStatusResult,
  ProcessorStatusQuery,
  ProcessorWebhookResolution,
} from '../processor-adapter';
import { mapCreateTransactionToSpeedyPay, mapSpeedyPayStatusToInternal } from './speedypay-mapper';
import type {
  SpeedyPayConfig,
  SpeedyPayCreatePaymentRequest,
  SpeedyPayCreatePaymentResponse,
  SpeedyPayPaymentStatusResponse,
  SpeedyPayWebhookPayload,
} from './speedypay-types';

export interface AdapterLogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  debug?(message: string, context?: Record<string, unknown>): void;
}

export interface SpeedyPayClient {
  createPayment(payload: SpeedyPayCreatePaymentRequest): Promise<SpeedyPayCreatePaymentResponse>;
  queryStatus(transactionId: string): Promise<SpeedyPayPaymentStatusResponse>;
  verifyWebhookSignature(signature: string | undefined, rawPayload: unknown): Promise<boolean>;
}

export class SpeedyPayAdapter implements ProcessorAdapter {
  readonly processor = 'SPEEDYPAY' as const;

  constructor(
    private readonly client: SpeedyPayClient,
    private readonly config: SpeedyPayConfig,
    private readonly logger: AdapterLogger,
  ) {}

  async createPayment(input: CreateTransactionRequest): Promise<ProcessorCreatePaymentResult> {
    try {
      const payload = mapCreateTransactionToSpeedyPay(input);
      this.logger.info('processor.create_payment.request', {
        processor: this.processor,
        externalReference: input.externalReference,
        mode: this.config.mode,
      });

      const raw = await this.client.createPayment(payload);
      return this.normalizeProcessorResponse(raw, 'create_payment') as ProcessorCreatePaymentResult;
    } catch (error: unknown) {
      throw this.normalizeError('create_payment', error, {
        externalReference: input.externalReference,
      });
    }
  }

  async queryPaymentStatus(input: ProcessorStatusQuery): Promise<ProcessorPaymentStatusResult> {
    try {
      this.logger.info('processor.query_status.request', {
        processor: this.processor,
        processorTransactionId: input.processorTransactionId,
      });

      const raw = await this.client.queryStatus(input.processorTransactionId);
      return this.normalizeProcessorResponse(raw, 'query_status') as ProcessorPaymentStatusResult;
    } catch (error: unknown) {
      throw this.normalizeError('query_status', error, {
        processorTransactionId: input.processorTransactionId,
      });
    }
  }

  async processWebhook(event: ProcessorWebhookEvent): Promise<ProcessorWebhookResolution> {
    const verified = await this.client.verifyWebhookSignature(event.signature, event.payload);
    if (!verified) {
      this.logger.warn('processor.webhook.signature_invalid', {
        processor: this.processor,
        eventId: event.eventId,
      });
      return { verified: false };
    }

    const normalized = this.normalizeProcessorResponse(event.payload, 'webhook') as ProcessorWebhookResolution;
    this.logger.info('processor.webhook.processed', {
      processor: this.processor,
      eventId: event.eventId,
      nextStatus: normalized.nextStatus,
    });

    return {
      ...normalized,
      verified: true,
    };
  }

  normalizeProcessorResponse(
    raw: unknown,
    context: 'create_payment' | 'query_status' | 'webhook',
  ): ProcessorCreatePaymentResult | ProcessorPaymentStatusResult | ProcessorWebhookResolution {
    if (context === 'create_payment') {
      const parsed = this.assertCreateResponse(raw);
      return {
        processorTransactionId: parsed.transactionId,
        status: mapSpeedyPayStatusToInternal(parsed.status),
        rawResponse: raw,
      };
    }

    if (context === 'query_status') {
      const parsed = this.assertStatusResponse(raw);
      return {
        processorTransactionId: parsed.transactionId,
        status: mapSpeedyPayStatusToInternal(parsed.status),
        rawResponse: raw,
      };
    }

    const webhook = this.assertWebhookPayload(raw);
    const mappedStatus = mapSpeedyPayStatusToInternal(webhook.status) as ProcessorWebhookResolution['nextStatus'];
    return {
      verified: true,
      processorTransactionId: webhook.transactionId,
      nextStatus: mappedStatus,
      reason: `webhook:${webhook.eventType}`,
      rawResponse: raw,
    };
  }

  private normalizeError(operation: 'create_payment' | 'query_status', error: unknown, context: Record<string, unknown>): DomainError {
    const message = error instanceof Error ? error.message : String(error);
    this.logger.error('processor.request.failed', {
      processor: this.processor,
      operation,
      message,
      ...context,
    });

    return new DomainError(`SpeedyPay ${operation} failed.`, 'INTEGRATION_ERROR', {
      processor: this.processor,
      operation,
      message,
      ...context,
    });
  }

  private assertCreateResponse(raw: unknown): SpeedyPayCreatePaymentResponse {
    if (!raw || typeof raw !== 'object') {
      throw new DomainError('SpeedyPay create payment response shape is invalid.', 'INTEGRATION_ERROR');
    }

    const candidate = raw as Partial<SpeedyPayCreatePaymentResponse>;
    if (typeof candidate.transactionId !== 'string' || typeof candidate.status !== 'string') {
      throw new DomainError('SpeedyPay create payment response shape is invalid.', 'INTEGRATION_ERROR');
    }

    return candidate as SpeedyPayCreatePaymentResponse;
  }

  private assertStatusResponse(raw: unknown): SpeedyPayPaymentStatusResponse {
    if (!raw || typeof raw !== 'object') {
      throw new DomainError('SpeedyPay payment status response shape is invalid.', 'INTEGRATION_ERROR');
    }

    const candidate = raw as Partial<SpeedyPayPaymentStatusResponse>;
    if (typeof candidate.transactionId !== 'string' || typeof candidate.status !== 'string') {
      throw new DomainError('SpeedyPay payment status response shape is invalid.', 'INTEGRATION_ERROR');
    }

    return candidate as SpeedyPayPaymentStatusResponse;
  }

  private assertWebhookPayload(raw: unknown): SpeedyPayWebhookPayload {
    if (!raw || typeof raw !== 'object') {
      throw new DomainError('SpeedyPay webhook payload shape is invalid.', 'VALIDATION_ERROR');
    }

    const candidate = raw as Partial<SpeedyPayWebhookPayload>;
    if (typeof candidate.transactionId !== 'string' || typeof candidate.status !== 'string' || typeof candidate.eventType !== 'string') {
      throw new DomainError('SpeedyPay webhook payload shape is invalid.', 'VALIDATION_ERROR');
    }

    return candidate as SpeedyPayWebhookPayload;
  }
}
