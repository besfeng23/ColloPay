
export type UserRole = 'SUPER_ADMIN' | 'OPERATIONS_ADMIN' | 'PARTNER_ADMIN' | 'MERCHANT_VIEWER';

export interface Partner {
  id: string;
  name: string;
  contactEmail: string;
  status: 'active' | 'suspended' | 'onboarding';
  createdAt: string;
  logoUrl?: string;
  apiKeyHash?: string;
}

export interface Merchant {
  id: string;
  partnerId: string;
  name: string;
  industry: string;
  status: 'active' | 'under_review' | 'disabled';
  createdAt: string;
}

export interface Processor {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'crypto';
  adapterKey: string;
  status: 'active' | 'maintenance' | 'inactive';
}

export type TransactionStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'reversed' | 'refunded';
export type ReconStatus = 'matched' | 'mismatch' | 'pending' | 'manual_review';

export interface TransactionTimelineEvent {
  id: string;
  status: TransactionStatus;
  timestamp: string;
  note?: string;
  metadata?: Record<string, any>;
}

export interface Transaction {
  id: string;
  internalId: string; // ColloPay internal
  partnerTransactionId?: string; // Client-supplied
  processorTransactionId?: string; // Upstream supplied
  idempotencyKey?: string;
  correlationId?: string; // Webhook/Trace ID
  partnerId: string;
  merchantId: string;
  processorId: string;
  amount: number; // Stored in cents
  currency: string;
  status: TransactionStatus;
  reconStatus: ReconStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  computedFees: {
    platformFixed: number;
    platformBps: number;
    partnerCut: number;
    processorFee: number;
    merchantNet: number;
  };
  timeline?: TransactionTimelineEvent[];
}

export interface FeeRule {
  id: string;
  partnerId: string;
  merchantId?: string; // If present, this rule overrides the partner rule
  fixedFee: number; // cents
  percentageFee: number; // basis points (290 = 2.9%)
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'active' | 'archived';
}

export interface WebhookEvent {
  id: string;
  correlationId: string;
  processorId: string;
  payload: any;
  receivedAt: string;
  processingStatus: 'pending' | 'completed' | 'failed';
  retryCount: number;
  lastError?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resourceType: 'Transaction' | 'Partner' | 'Merchant' | 'FeeRule' | 'Processor';
  resourceId: string;
  previousValue?: any;
  newValue?: any;
  timestamp: string;
  ipAddress: string;
}

export interface Settlement {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  initiatedAt: string;
  completedAt?: string;
  transactionCount: number;
  varianceDetected: boolean;
  reconNote?: string;
}
