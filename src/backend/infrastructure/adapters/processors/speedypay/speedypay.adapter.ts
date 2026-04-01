import type {
  ProcessorAdapter,
  ProcessorCreateTransactionRequest,
  ProcessorCreateTransactionResponse,
  ProcessorWebhookEvent
} from '../../../../application/interfaces/processor-adapter.interface';

export interface SpeedyPayHttpClient {
  post<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T>;
}

export class SpeedyPayAdapter implements ProcessorAdapter {
  readonly processorName = 'speedypay';

  constructor(
    private readonly client: SpeedyPayHttpClient,
    private readonly webhookSigningSecret: string
  ) {}

  async createTransaction(request: ProcessorCreateTransactionRequest): Promise<ProcessorCreateTransactionResponse> {
    // Skeleton only: map generic request to processor-specific API schema.
    const response = await this.client.post<{ id: string; status: string }>('/v1/charges', {
      reference_id: request.transactionId,
      amount_minor: Math.round(request.amount.amount * 100),
      currency: request.amount.currency,
      payment_method_token: request.paymentMethodToken,
      metadata: request.metadata
    });

    return {
      processorTransactionId: response.id,
      status: 'pending_processor',
      rawResponse: response
    };
  }

  async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
    // TODO: Implement HMAC validation with timing-safe compare.
    return Boolean(payload && signature && this.webhookSigningSecret);
  }

  async parseWebhookEvent(payload: unknown): Promise<ProcessorWebhookEvent> {
    const event = payload as {
      id: string;
      type: string;
      data: { charge_id: string; status: string };
    };

    const statusMap: Record<string, ProcessorWebhookEvent['statusHint']> = {
      charge_authorized: 'authorized',
      charge_captured: 'captured',
      charge_failed: 'failed',
      charge_settled: 'settled',
      charge_refunded: 'refunded'
    };

    return {
      processor: this.processorName,
      eventId: event.id,
      eventType: event.type,
      processorTransactionId: event.data.charge_id,
      statusHint: statusMap[event.type],
      payload,
      receivedAt: new Date().toISOString()
    };
  }
}
