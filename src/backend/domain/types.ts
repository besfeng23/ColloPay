export type ISODateString = string;
export type CurrencyCode = 'USD' | 'KES' | 'EUR' | 'PHP';

export const TRANSACTION_STATUSES = [
  'INITIATED',
  'PENDING_PROCESSOR',
  'AUTHORIZED',
  'CAPTURED',
  'SETTLED',
  'FAILED',
  'CANCELLED',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
  'CHARGEBACK_PENDING',
  'CHARGEBACK_WON',
  'CHARGEBACK_LOST',
  'REVERSED',
] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const SETTLEMENT_STATUSES = ['PENDING', 'IN_PROGRESS', 'SETTLED', 'FAILED', 'ON_HOLD', 'REVERSED'] as const;
export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

export const RECONCILIATION_STATUSES = ['UNMATCHED', 'MATCHED', 'PARTIALLY_MATCHED', 'EXCEPTION', 'RESOLVED'] as const;
export type ReconciliationStatus = (typeof RECONCILIATION_STATUSES)[number];

export const WEBHOOK_STATUSES = [
  'RECEIVED',
  'SIGNATURE_VERIFIED',
  'PROCESSING',
  'PROCESSED',
  'DUPLICATE',
  'RETRY_PENDING',
  'DEAD_LETTER',
  'MANUAL_REVIEW',
  'FAILED',
] as const;
export type WebhookStatus = (typeof WEBHOOK_STATUSES)[number];

export const WEBHOOK_CORRELATION_STATUSES = ['UNRESOLVED', 'CORRELATED', 'CORRELATION_FAILED'] as const;
export type WebhookCorrelationStatus = (typeof WEBHOOK_CORRELATION_STATUSES)[number];

export const FEE_TYPES = ['PERCENTAGE_BPS', 'FLAT', 'TIERED', 'HYBRID'] as const;
export type FeeType = (typeof FEE_TYPES)[number];

export const PROCESSOR_TYPES = ['SPEEDYPAY', 'STRIPE', 'ADYEN', 'MPESA'] as const;
export type ProcessorType = (typeof PROCESSOR_TYPES)[number];

export const USER_ROLES = ['SUPER_ADMIN', 'PARTNER_ADMIN', 'MERCHANT_ADMIN', 'MERCHANT_OPERATOR', 'AUDITOR'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface Money {
  amountMinor: number;
  currency: CurrencyCode;
}

export interface Partner {
  id: string;
  name: string;
  legalEntityName: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  settlementAccountId?: string;
  metadata?: Record<string, string>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Merchant {
  id: string;
  partnerId: string;
  name: string;
  externalReference: string;
  categoryCode?: string;
  defaultCurrency: CurrencyCode;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  merchantOfRecord: boolean; // Added for client request
  metadata?: Record<string, string>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Processor {
  id: string;
  type: ProcessorType;
  displayName: string;
  status: 'ACTIVE' | 'DISABLED';
  capabilities: Array<'AUTHORIZE' | 'CAPTURE' | 'SETTLE' | 'REFUND' | 'WEBHOOKS'>;
  configVersion: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ProcessorMapping {
  id: string;
  merchantId: string;
  processorId: string;
  priority: number;
  enabled: boolean;
  routeRules?: Record<string, string>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface FeeRule {
  id: string;
  partnerId?: string;
  merchantId?: string;
  processorType?: ProcessorType;
  feeType: FeeType;
  basisPoints?: number;
  flatAmountMinor?: number;
  minFeeMinor?: number;
  maxFeeMinor?: number;
  effectiveFrom: ISODateString;
  effectiveTo?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface MerchantReference {
  merchantId: string;
  partnerId: string;
}

export interface PaymentRequest {
  idempotencyKey: string;
  externalReference: string;
  merchant: MerchantReference;
  amount: Money;
  processor: ProcessorType;
  captureMode?: 'AUTOMATIC' | 'MANUAL';
  splitConfig?: {
    type: 'PLATFORM_FEE' | 'MULTI_MERCHANT';
    beneficiaries: Array<{
      id: string;
      type: 'MERCHANT' | 'PLATFORM';
      shareBps: number;
    }>;
  };
  customer?: {
    customerId?: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, string>;
}

export interface FeeBreakdown {
  processorFeeMinor: number;
  platformFeeMinor: number;
  partnerFeeMinor: number;
  totalFeeMinor: number;
}

export interface TransactionSplit {
  id: string;
  transactionId: string;
  beneficiaryType: 'PLATFORM' | 'PARTNER' | 'MERCHANT' | 'PROCESSOR';
  beneficiaryId: string;
  amountMinor: number;
  currency: CurrencyCode;
  description?: string;
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
  splits: TransactionSplit[]; // Added for visibility
  status: TransactionStatus;
  reconciliationStatus?: ReconciliationStatus;
  statusReason?: string;
  metadata?: Record<string, string>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SettlementRecord {
  id: string;
  transactionId: string;
  processorType: ProcessorType;
  settlementBatchId?: string;
  grossAmountMinor: number;
  feeAmountMinor: number;
  netAmountMinor: number;
  currency: CurrencyCode;
  status: SettlementStatus;
  settledAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface WebhookEvent {
  id: string;
  processor: ProcessorType;
  eventId: string;
  processingKey: string;
  eventType: string;
  status: WebhookStatus;
  correlationStatus: WebhookCorrelationStatus;
  transactionId?: string;
  attemptCount: number;
  occurredAt: ISODateString;
  receivedAt: ISODateString;
  signature?: string;
  payload: unknown;
  processedAt?: ISODateString;
  nextRetryAt?: ISODateString;
  outcomeCode?: string;
  deadLetterReason?: string;
  lastErrorAt?: ISODateString;
  processingError?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorRole?: UserRole;
  resourceType: 'TRANSACTION' | 'WEBHOOK' | 'IDEMPOTENCY' | 'MERCHANT' | 'FEE_RULE' | 'PROCESSOR_MAPPING';
  resourceId: string;
  occurredAt: ISODateString;
  details: Record<string, unknown>;
}

export interface APIKey {
  id: string;
  partnerId?: string;
  merchantId?: string;
  label: string;
  keyPrefix: string;
  hashedSecret: string;
  status: 'ACTIVE' | 'REVOKED';
  scopes: string[];
  createdBy: string;
  expiresAt?: ISODateString;
  lastUsedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface IdempotencyRecord {
  key: string;
  scope: string;
  requestHash: string;
  responseSnapshot: string;
  createdAt: ISODateString;
}

export interface TransactionStatusChange {
  transactionId: string;
  from: TransactionStatus;
  to: TransactionStatus;
  reason: string;
  actor: string;
  at: ISODateString;
}

export type CreateTransactionRequest = PaymentRequest;
export type ProcessorWebhookEvent = Omit<
  WebhookEvent,
  | 'id'
  | 'processingKey'
  | 'status'
  | 'correlationStatus'
  | 'transactionId'
  | 'attemptCount'
  | 'receivedAt'
  | 'processedAt'
  | 'nextRetryAt'
  | 'outcomeCode'
  | 'deadLetterReason'
  | 'lastErrorAt'
  | 'processingError'
>;

export interface ProcessorCreatePaymentResult {
  processorTransactionId: string;
  status: Extract<TransactionStatus, 'PENDING_PROCESSOR' | 'AUTHORIZED' | 'FAILED'>;
  rawResponse: unknown;
}

export interface ProcessWebhookResult {
  acknowledged: boolean;
  transactionId?: string;
  status?: WebhookStatus;
  correlationStatus?: WebhookCorrelationStatus;
  retryable?: boolean;
  attemptCount?: number;
  ignoredReason?: string;
}

export interface ProcessWebhookCommand {
  event: ProcessorWebhookEvent;
  receivedAt?: ISODateString;
  allowRetry?: boolean;
}

export interface PartnerPaymentResponse {
  transactionId: string;
  externalReference: string;
  status: TransactionStatus;
  processor: ProcessorType;
  processorReference?: string;
  amount: Money;
  netAmountMinor: number;
  feeBreakdown: FeeBreakdown;
  idempotency: {
    key: string;
    replayed: boolean;
  };
  auditTrail: {
    createdAt: ISODateString;
    updatedAt: ISODateString;
  };
}

export interface AuditLogEntry {
  action: string;
  actor: string;
  actorRole?: UserRole;
  resourceType: AuditLog['resourceType'];
  resourceId: string;
  occurredAt: ISODateString;
  details: Record<string, unknown>;
}