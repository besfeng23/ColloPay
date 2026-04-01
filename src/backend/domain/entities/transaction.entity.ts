import type { FeeBreakdown, Money, PaymentMethodType, TransactionStatus } from '../types/transaction.types';

export interface Transaction {
  id: string;
  partnerId: string;
  idempotencyKey: string;
  externalReference: string;
  paymentMethodType: PaymentMethodType;
  amount: Money;
  fees: FeeBreakdown;
  status: TransactionStatus;
  processor: string;
  processorTransactionId?: string;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionStatusTransition {
  transactionId: string;
  fromStatus: TransactionStatus;
  toStatus: TransactionStatus;
  reason: string;
  actor: 'system' | 'partner_api' | 'processor_webhook' | 'admin';
  at: string;
}
