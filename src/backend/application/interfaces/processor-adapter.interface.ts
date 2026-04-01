import type { Money, TransactionStatus } from '../../domain/types/transaction.types';

export interface ProcessorCreateTransactionRequest {
  transactionId: string;
  amount: Money;
  paymentMethodToken: string;
  idempotencyKey: string;
  metadata: Record<string, string>;
}

export interface ProcessorCreateTransactionResponse {
  processorTransactionId: string;
  status: Extract<TransactionStatus, 'pending_processor' | 'authorized' | 'captured' | 'failed'>;
  rawResponse: unknown;
}

export interface ProcessorWebhookEvent {
  processor: string;
  eventId: string;
  eventType: string;
  processorTransactionId: string;
  statusHint?: TransactionStatus;
  payload: unknown;
  signature?: string;
  receivedAt: string;
}

export interface ProcessorAdapter {
  readonly processorName: string;

  createTransaction(request: ProcessorCreateTransactionRequest): Promise<ProcessorCreateTransactionResponse>;
  verifyWebhookSignature(payload: string, signature: string): Promise<boolean>;
  parseWebhookEvent(payload: unknown, signature?: string): Promise<ProcessorWebhookEvent>;
}
