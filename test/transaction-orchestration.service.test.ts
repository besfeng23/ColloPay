import { describe, expect, it } from 'vitest';
import { TransactionOrchestrationService } from '../src/backend/application/services/transaction-orchestration.service';
import { FeeEngineService } from '../src/backend/application/services/fee-engine.service';
import { IdempotencyService } from '../src/backend/application/services/idempotency.service';
import { TransactionStatusService } from '../src/backend/application/services/transaction-status.service';
import type { ProcessorAdapter } from '../src/backend/application/interfaces/processor-adapter.interface';
import {
  InMemoryIdempotencyStore,
  InMemoryStatusTransitionRepository,
  InMemoryTransactionRepository
} from '../src/backend/infrastructure/repositories/in-memory.repositories';

const noopAudit = { log: async () => {} };

describe('TransactionOrchestrationService', () => {
  it('creates transaction and advances to pending_processor', async () => {
    const txRepo = new InMemoryTransactionRepository();
    const statusRepo = new InMemoryStatusTransitionRepository();
    const statusService = new TransactionStatusService(txRepo, statusRepo, noopAudit);

    const processor: ProcessorAdapter = {
      processorName: 'speedypay',
      createTransaction: async () => ({
        processorTransactionId: 'spd_123',
        status: 'pending_processor',
        rawResponse: {}
      }),
      verifyWebhookSignature: async () => true,
      parseWebhookEvent: async () => {
        throw new Error('not used in test');
      }
    };

    const service = new TransactionOrchestrationService(
      txRepo,
      new Map([['speedypay', processor]]),
      new FeeEngineService({
        percentageByPaymentMethod: { card: 0.03, bank_transfer: 0.01, wallet: 0.02 },
        fixedFeeByCurrency: { USD: 0.3, EUR: 0.3, GBP: 0.2 },
        processorMarkupPercentage: 0.7
      }),
      new IdempotencyService(new InMemoryIdempotencyStore()),
      statusService,
      noopAudit
    );

    const tx = await service.createTransaction({
      partnerId: 'partner_1',
      idempotencyKey: 'idem_12345678',
      externalReference: 'order_1',
      processor: 'speedypay',
      paymentMethodType: 'card',
      paymentMethodToken: 'tok_1',
      amount: { amount: 50, currency: 'USD' },
      metadata: { cartId: 'cart_1' }
    });

    expect(tx.status).toBe('pending_processor');
    expect(tx.processorTransactionId).toBe('spd_123');
    expect(statusRepo.records).toHaveLength(1);
  });
});
