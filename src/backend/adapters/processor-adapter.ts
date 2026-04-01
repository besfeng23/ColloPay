import type {
  CreateTransactionRequest,
  ProcessWebhookResult,
  ProcessorCreatePaymentResult,
  ProcessorType,
  ProcessorWebhookEvent,
  TransactionStatus,
} from '../domain/types';

export interface ProcessorStatusQuery {
  processorTransactionId: string;
  externalReference?: string;
}

export interface ProcessorPaymentStatusResult {
  processorTransactionId: string;
  status: TransactionStatus;
  rawResponse: unknown;
}

export interface ProcessorWebhookResolution {
  verified: boolean;
  processorTransactionId?: string;
  nextStatus?: ProcessorCreatePaymentResult['status'] | 'CAPTURED' | 'SETTLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  reason?: string;
  rawResponse?: unknown;
}

export interface ProcessorAdapter {
  readonly processor: ProcessorType;
  createPayment(input: CreateTransactionRequest): Promise<ProcessorCreatePaymentResult>;
  queryPaymentStatus(input: ProcessorStatusQuery): Promise<ProcessorPaymentStatusResult>;
  processWebhook(event: ProcessorWebhookEvent): Promise<ProcessorWebhookResolution>;
  normalizeProcessorResponse(raw: unknown, context: 'create_payment' | 'query_status' | 'webhook'): ProcessorCreatePaymentResult | ProcessorPaymentStatusResult | ProcessorWebhookResolution;
}

export interface ProcessorAdapterRegistry {
  getAdapter(processor: ProcessorType): ProcessorAdapter;
}

export interface WebhookHandler {
  process(event: ProcessorWebhookEvent): Promise<ProcessWebhookResult>;
}
