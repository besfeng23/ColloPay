export type CurrencyCode = 'USD' | 'KES' | 'EUR';

export type ProcessorType = 'SPEEDYPAY';

export type TransactionStatus =
  | 'INITIATED'
  | 'PENDING_PROCESSOR'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'SETTLED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface Money {
  amountMinor: number;
  currency: CurrencyCode;
}

export interface MerchantReference {
  merchantId: string;
  partnerId: string;
}

export interface FeeBreakdown {
  processorFeeMinor: number;
  platformFeeMinor: number;
  partnerFeeMinor: number;
  totalFeeMinor: number;
}

export interface Transaction {
  id: string;
  externalReference: string;
  processorTransactionId?: string;
  processor: ProcessorType;
  merchant: MerchantReference;
  amount: Money;
  netAmountMinor: number;
  feeBreakdown: FeeBreakdown;
  status: TransactionStatus;
  statusReason?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionStatusChange {
  transactionId: string;
  from: TransactionStatus;
  to: TransactionStatus;
  reason: string;
  actor: string;
  at: string;
}

export interface CreateTransactionRequest {
  idempotencyKey: string;
  externalReference: string;
  merchant: MerchantReference;
  amount: Money;
  processor: ProcessorType;
  metadata?: Record<string, string>;
}

export interface ProcessorCreatePaymentResult {
  processorTransactionId: string;
  status: Extract<TransactionStatus, 'PENDING_PROCESSOR' | 'AUTHORIZED' | 'FAILED'>;
  rawResponse: unknown;
}

export interface ProcessorWebhookEvent {
  processor: ProcessorType;
  eventId: string;
  eventType: string;
  occurredAt: string;
  signature?: string;
  payload: unknown;
}

export interface ProcessWebhookResult {
  acknowledged: boolean;
  transactionId?: string;
  ignoredReason?: string;
}

export interface IdempotencyRecord {
  key: string;
  scope: string;
  requestHash: string;
  responseSnapshot: string;
  createdAt: string;
}

export interface AuditLogEntry {
  action: string;
  actor: string;
  resourceType: 'TRANSACTION' | 'WEBHOOK' | 'IDEMPOTENCY';
  resourceId: string;
  occurredAt: string;
  details: Record<string, unknown>;
}
