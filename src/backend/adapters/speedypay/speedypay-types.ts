export type SpeedyPayMode = 'mock' | 'staging' | 'production';

export interface SpeedyPayConfig {
  mode: SpeedyPayMode;
  credentials: {
    apiKey: string;
    apiSecret: string;
    webhookSecret: string;
  };
  endpoints: {
    createPaymentUrl: string;
    queryPaymentStatusUrl: string;
  };
  timeoutMs: number;
}

export interface SpeedyPayCreatePaymentRequest {
  amountMinor: number;
  currency: string;
  partnerReference: string;
  metadata?: Record<string, string>;
}

export interface SpeedyPayCreatePaymentResponse {
  transactionId: string;
  status: 'PENDING' | 'AUTHORIZED' | 'FAILED';
  processorCode?: string;
  processorMessage?: string;
}

export interface SpeedyPayPaymentStatusResponse {
  transactionId: string;
  status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'SETTLED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  processorCode?: string;
  processorMessage?: string;
}

export interface SpeedyPayWebhookPayload {
  transactionId: string;
  eventType: string;
  status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'SETTLED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
}
