export type UserRole = 'SUPER_ADMIN' | 'OPERATIONS_ADMIN' | 'PARTNER_ADMIN' | 'MERCHANT_VIEWER';

export interface Partner {
  id: string;
  name: string;
  contactEmail: string;
  status: 'active' | 'suspended' | 'onboarding';
  createdAt: string;
  logoUrl?: string;
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

export interface ProcessorMapping {
  id: string;
  merchantId: string;
  processorId: string;
  priority: number;
  config: Record<string, any>;
}

export type TransactionStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'reversed' | 'refunded';

export interface Transaction {
  id: string;
  internalId: string;
  externalRef?: string;
  partnerId: string;
  merchantId: string;
  processorId: string;
  amount: number; // Stored in cents/smallest unit
  currency: string;
  status: TransactionStatus;
  statusMessage?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  computedFees: {
    platformFee: number;
    processorFee: number;
    partnerCut: number;
    merchantNet: number;
  };
  metadata?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resourceType: string;
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
}
