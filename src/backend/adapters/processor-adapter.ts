import type {
  CreateTransactionRequest,
  ProcessWebhookResult,
  ProcessorCreatePaymentResult,
  ProcessorType,
  ProcessorWebhookEvent,
} from '../domain/types';

export interface ProcessorAdapter {
  readonly processor: ProcessorType;
  createPayment(input: CreateTransactionRequest): Promise<ProcessorCreatePaymentResult>;
  verifyWebhookSignature(event: ProcessorWebhookEvent): Promise<boolean>;
  resolveWebhookUpdate(event: ProcessorWebhookEvent): Promise<{
    processorTransactionId: string;
    nextStatus: ProcessorCreatePaymentResult['status'] | 'CAPTURED' | 'SETTLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
    reason: string;
  } | null>;
}

export interface ProcessorAdapterRegistry {
  getAdapter(processor: ProcessorType): ProcessorAdapter;
}

export interface WebhookHandler {
  process(event: ProcessorWebhookEvent): Promise<ProcessWebhookResult>;
}
