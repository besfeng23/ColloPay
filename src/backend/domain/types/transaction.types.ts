export type Currency = 'USD' | 'EUR' | 'GBP';

export type TransactionStatus =
  | 'created'
  | 'pending_processor'
  | 'authorized'
  | 'captured'
  | 'settled'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethodType = 'card' | 'bank_transfer' | 'wallet';

export interface Money {
  amount: number;
  currency: Currency;
}

export interface FeeBreakdown {
  percentageFee: number;
  fixedFee: number;
  processorFee: number;
  platformFee: number;
  totalFee: number;
  netAmount: number;
}
