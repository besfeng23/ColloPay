import { DomainError } from '../../domain/errors';
import type {
  CreateTransactionRequest,
  ProcessorCreatePaymentResult,
  ProcessorWebhookEvent,
} from '../../domain/types';
import type { ProcessorAdapter } from '../processor-adapter';

export interface SpeedyPayClient {
  createCharge(payload: {
    amountMinor: number;
    currency: string;
    reference: string;
  }): Promise<{ transactionId: string; status: 'PENDING' | 'AUTHORIZED' | 'FAILED' }>;
  verifySignature(signature: string | undefined, rawPayload: unknown): Promise<boolean>;
}

export class SpeedyPayAdapter implements ProcessorAdapter {
  readonly processor = 'SPEEDYPAY' as const;

  constructor(private readonly client: SpeedyPayClient) {}

  async createPayment(input: CreateTransactionRequest): Promise<ProcessorCreatePaymentResult> {
    const result = await this.client.createCharge({
      amountMinor: input.amount.amountMinor,
      currency: input.amount.currency,
      reference: input.externalReference,
    });

    return {
      processorTransactionId: result.transactionId,
      status: this.mapCreateStatus(result.status),
      rawResponse: result,
    };
  }

  async verifyWebhookSignature(event: ProcessorWebhookEvent): Promise<boolean> {
    return this.client.verifySignature(event.signature, event.payload);
  }

  async resolveWebhookUpdate(event: ProcessorWebhookEvent) {
    if (!isSpeedyPayWebhookPayload(event.payload)) {
      throw new DomainError('SpeedyPay webhook payload shape is invalid.', 'VALIDATION_ERROR');
    }

    const mappedStatus = this.mapWebhookStatus(event.payload.status);
    if (!mappedStatus) {
      return null;
    }

    return {
      processorTransactionId: event.payload.transactionId,
      nextStatus: mappedStatus,
      reason: `webhook:${event.eventType}`,
    };
  }

  private mapCreateStatus(status: 'PENDING' | 'AUTHORIZED' | 'FAILED'): ProcessorCreatePaymentResult['status'] {
    if (status === 'PENDING') {
      return 'PENDING_PROCESSOR';
    }

    return status;
  }

  private mapWebhookStatus(
    status: SpeedyPayWebhookPayload['status'],
  ): ProcessorCreatePaymentResult['status'] | 'CAPTURED' | 'SETTLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | null {
    switch (status) {
      case 'pending':
        return 'PENDING_PROCESSOR';
      case 'authorized':
        return 'AUTHORIZED';
      case 'captured':
        return 'CAPTURED';
      case 'settled':
        return 'SETTLED';
      case 'refunded':
        return 'REFUNDED';
      case 'partially_refunded':
        return 'PARTIALLY_REFUNDED';
      case 'failed':
        return 'FAILED';
      default:
        return null;
    }
  }
}

interface SpeedyPayWebhookPayload {
  transactionId: string;
  status: 'pending' | 'authorized' | 'captured' | 'settled' | 'failed' | 'refunded' | 'partially_refunded';
}

function isSpeedyPayWebhookPayload(payload: unknown): payload is SpeedyPayWebhookPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Partial<SpeedyPayWebhookPayload>;
  return typeof candidate.transactionId === 'string' && typeof candidate.status === 'string';
}
