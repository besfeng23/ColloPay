import test from 'node:test';
import assert from 'node:assert/strict';

import { SpeedyPayAdapter, type AdapterLogger } from '../speedypay-adapter';
import { buildSpeedyPayConfigFromEnv } from '../speedypay-config';
import { MockSpeedyPayClient } from '../speedypay-mock-client';

const logger: AdapterLogger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

test('SpeedyPayAdapter mock mode can create + query + process webhook in normalized shape', async () => {
  const adapter = new SpeedyPayAdapter(
    new MockSpeedyPayClient(),
    buildSpeedyPayConfigFromEnv({ ...process.env, SPEEDYPAY_MODE: 'mock' }),
    logger,
  );

  const created = await adapter.createPayment({
    idempotencyKey: 'idem-1',
    externalReference: 'order-1',
    merchant: { merchantId: 'm1', partnerId: 'p1' },
    amount: { amountMinor: 1000, currency: 'USD' },
    processor: 'SPEEDYPAY',
  });

  assert.equal(created.status, 'AUTHORIZED');

  const queried = await adapter.queryPaymentStatus({
    processorTransactionId: created.processorTransactionId,
  });
  assert.equal(queried.status, 'AUTHORIZED');

  const webhookResult = await adapter.processWebhook({
    processor: 'SPEEDYPAY',
    eventId: 'evt_1',
    eventType: 'payment.authorized',
    occurredAt: new Date().toISOString(),
    signature: 'mock-valid-signature',
    payload: {
      transactionId: created.processorTransactionId,
      eventType: 'payment.authorized',
      status: 'AUTHORIZED',
    },
  });

  assert.equal(webhookResult.verified, true);
  assert.equal(webhookResult.nextStatus, 'AUTHORIZED');
});
