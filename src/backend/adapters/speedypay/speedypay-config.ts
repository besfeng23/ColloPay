import type { SpeedyPayConfig } from './speedypay-types';

export function buildSpeedyPayConfigFromEnv(env: NodeJS.ProcessEnv = process.env): SpeedyPayConfig {
  return {
    mode: (env.SPEEDYPAY_MODE as SpeedyPayConfig['mode']) ?? 'mock',
    credentials: {
      apiKey: env.SPEEDYPAY_API_KEY ?? '',
      apiSecret: env.SPEEDYPAY_API_SECRET ?? '',
      webhookSecret: env.SPEEDYPAY_WEBHOOK_SECRET ?? '',
    },
    endpoints: {
      createPaymentUrl: env.SPEEDYPAY_CREATE_PAYMENT_URL ?? 'https://api.speedypay.local/payments',
      queryPaymentStatusUrl: env.SPEEDYPAY_QUERY_STATUS_URL ?? 'https://api.speedypay.local/payments/{transactionId}',
    },
    timeoutMs: Number(env.SPEEDYPAY_TIMEOUT_MS ?? 10_000),
  };
}
