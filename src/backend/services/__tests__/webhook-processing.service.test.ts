import test from 'node:test';
import assert from 'node:assert/strict';

import type { ProcessorAdapter } from '../../adapters/processor-adapter';
import { InMemoryProcessorAdapterRegistry } from '../../adapters/processor-adapter-registry';
import { DomainError } from '../../domain/errors';
import type {
  AuditLogEntry,
  ProcessorCreatePaymentResult,
  ProcessorWebhookEvent,
  Transaction,
  TransactionStatus,
  WebhookEvent,
} from '../../domain/types';
import type { AuditLogRepository, TransactionRepository, WebhookEventRepository } from '../../ports/repositories';
import { AuditLogService } from '../audit-log.service';
import { WebhookProcessingService } from '../webhook-processing.service';

class InMemoryWebhookEventRepo implements WebhookEventRepository {
  private readonly rows = new Map<string, WebhookEvent>();

  async findByEventId(eventId: string, processor: WebhookEvent['processor']): Promise<WebhookEvent | null> {
    return this.rows.get(`${processor}:${eventId}`) ?? null;
  }

  async createReceived(input: { event: ProcessorWebhookEvent; processingKey: string; receivedAt: string }): Promise<WebhookEvent> {
    const row: WebhookEvent = {
      id: input.processingKey,
      processor: input.event.processor,
      eventId: input.event.eventId,
      processingKey: input.processingKey,
      eventType: input.event.eventType,
      status: 'RECEIVED',
      correlationStatus: 'UNRESOLVED',
      attemptCount: 1,
      occurredAt: input.event.occurredAt,
      receivedAt: input.receivedAt,
      signature: input.event.signature,
      payload: input.event.payload,
    };

    this.rows.set(input.processingKey, row);
    return row;
  }

  async markStatus(input: {
    eventId: string;
    processor: WebhookEvent['processor'];
    status: WebhookEvent['status'];
    processedAt?: string;
    transactionId?: string;
    outcomeCode?: string;
    correlationStatus?: WebhookEvent['correlationStatus'];
    retryable?: boolean;
    nextRetryAt?: string;
    deadLetterReason?: string;
    processingError?: string;
  }): Promise<void> {
    const key = `${input.processor}:${input.eventId}`;
    const existing = this.rows.get(key);
    if (!existing) {
      throw new Error('missing webhook event');
    }

    this.rows.set(key, {
      ...existing,
      status: input.status,
      processedAt: input.processedAt ?? existing.processedAt,
      transactionId: input.transactionId ?? existing.transactionId,
      outcomeCode: input.outcomeCode ?? existing.outcomeCode,
      correlationStatus: input.correlationStatus ?? existing.correlationStatus,
      nextRetryAt: input.nextRetryAt ?? existing.nextRetryAt,
      deadLetterReason: input.deadLetterReason ?? existing.deadLetterReason,
      processingError: input.processingError ?? existing.processingError,
    });
  }

  async incrementAttempt(eventId: string, processor: WebhookEvent['processor']): Promise<number> {
    const key = `${processor}:${eventId}`;
    const existing = this.rows.get(key);
    if (!existing) {
      throw new Error('missing webhook event');
    }

    const attemptCount = existing.attemptCount + 1;
    this.rows.set(key, { ...existing, attemptCount });
    return attemptCount;
  }

  get(eventId: string, processor: WebhookEvent['processor']): WebhookEvent {
    const row = this.rows.get(`${processor}:${eventId}`);
    if (!row) {
      throw new Error('missing webhook event');
    }

    return row;
  }
}

class InMemoryTransactionRepo implements TransactionRepository {
  constructor(private readonly rows: Map<string, Transaction>) {}

  async create(transaction: Transaction): Promise<void> {
    this.rows.set(transaction.id, transaction);
  }

  async getById(id: string): Promise<Transaction | null> {
    return this.rows.get(id) ?? null;
  }

  async getByExternalReference(externalReference: string): Promise<Transaction | null> {
    return [...this.rows.values()].find((record) => record.externalReference === externalReference) ?? null;
  }

  async getByProcessorTransactionId(processorTransactionId: string): Promise<Transaction | null> {
    return [...this.rows.values()].find((record) => record.processorTransactionId === processorTransactionId) ?? null;
  }

  async updateStatus(transactionId: string, status: TransactionStatus, reason: string, updatedAt: string): Promise<void> {
    const existing = this.rows.get(transactionId);
    if (!existing) {
      throw new Error('missing transaction');
    }

    this.rows.set(transactionId, {
      ...existing,
      status,
      statusReason: reason,
      updatedAt,
    });
  }

  async updateProcessorReference(transactionId: string, processorTransactionId: string, updatedAt: string): Promise<void> {
    const existing = this.rows.get(transactionId);
    if (!existing) {
      throw new Error('missing transaction');
    }

    this.rows.set(transactionId, { ...existing, processorTransactionId, updatedAt });
  }
}

class InMemoryAuditRepo implements AuditLogRepository {
  readonly entries: AuditLogEntry[] = [];

  async write(entry: AuditLogEntry): Promise<void> {
    this.entries.push(entry);
  }
}

class FakeAdapter implements ProcessorAdapter {
  readonly processor = 'SPEEDYPAY' as const;

  async createPayment(): Promise<ProcessorCreatePaymentResult> {
    throw new Error('unused');
  }

  async verifyWebhookSignature(): Promise<boolean> {
    return true;
  }

  async resolveWebhookUpdate(): Promise<{ processorTransactionId: string; nextStatus: 'AUTHORIZED'; reason: string }> {
    return { processorTransactionId: 'proc_tx_1', nextStatus: 'AUTHORIZED', reason: 'webhook_authorized' };
  }
}

class FakeTransactionOrchestrationService {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async applyStatusUpdate(transactionId: string, nextStatus: TransactionStatus, reason: string): Promise<void> {
    const existing = await this.transactionRepo.getById(transactionId);
    if (!existing) {
      throw new Error('missing transaction');
    }

    if (existing.status === 'CAPTURED' && nextStatus === 'AUTHORIZED') {
      throw new DomainError('Invalid transaction transition from CAPTURED to AUTHORIZED.', 'STATE_TRANSITION_ERROR');
    }

    await this.transactionRepo.updateStatus(transactionId, nextStatus, reason, new Date().toISOString());
  }
}

function buildWebhookEvent(overrides: Partial<ProcessorWebhookEvent> = {}): ProcessorWebhookEvent {
  return {
    processor: 'SPEEDYPAY',
    eventId: 'evt_001',
    eventType: 'payment.authorized',
    occurredAt: new Date().toISOString(),
    signature: 'sig-1',
    payload: { status: 'AUTHORIZED', transactionId: 'proc_tx_1' },
    ...overrides,
  };
}

test('WebhookProcessingService enforces duplicate idempotency by returning DUPLICATE on re-delivery', async () => {
  const transactionMap = new Map<string, Transaction>([
    [
      'tx_1',
      {
        id: 'tx_1',
        externalReference: 'order-1',
        processorTransactionId: 'proc_tx_1',
        processor: 'SPEEDYPAY',
        merchant: { merchantId: 'm1', partnerId: 'p1' },
        amount: { amountMinor: 1000, currency: 'USD' },
        netAmountMinor: 950,
        feeBreakdown: { processorFeeMinor: 30, platformFeeMinor: 20, partnerFeeMinor: 0, totalFeeMinor: 50 },
        status: 'PENDING_PROCESSOR',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  const webhookRepo = new InMemoryWebhookEventRepo();
  const transactionRepo = new InMemoryTransactionRepo(transactionMap);
  const service = new WebhookProcessingService(
    new InMemoryProcessorAdapterRegistry([new FakeAdapter()]),
    webhookRepo,
    transactionRepo,
    new FakeTransactionOrchestrationService(transactionRepo) as never,
    new AuditLogService(new InMemoryAuditRepo()),
  );

  const first = await service.process(buildWebhookEvent());
  const second = await service.process(buildWebhookEvent());

  assert.equal(first.status, 'PROCESSED');
  assert.equal(second.status, 'DUPLICATE');
  assert.equal(second.ignoredReason, 'duplicate_event');
  assert.equal(webhookRepo.get('evt_001', 'SPEEDYPAY').attemptCount, 2);
});

test('WebhookProcessingService marks out-of-order updates as FAILED without retry scheduling', async () => {
  const transactionMap = new Map<string, Transaction>([
    [
      'tx_1',
      {
        id: 'tx_1',
        externalReference: 'order-1',
        processorTransactionId: 'proc_tx_1',
        processor: 'SPEEDYPAY',
        merchant: { merchantId: 'm1', partnerId: 'p1' },
        amount: { amountMinor: 1000, currency: 'USD' },
        netAmountMinor: 950,
        feeBreakdown: { processorFeeMinor: 30, platformFeeMinor: 20, partnerFeeMinor: 0, totalFeeMinor: 50 },
        status: 'CAPTURED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  const webhookRepo = new InMemoryWebhookEventRepo();
  const transactionRepo = new InMemoryTransactionRepo(transactionMap);
  const service = new WebhookProcessingService(
    new InMemoryProcessorAdapterRegistry([new FakeAdapter()]),
    webhookRepo,
    transactionRepo,
    new FakeTransactionOrchestrationService(transactionRepo) as never,
    new AuditLogService(new InMemoryAuditRepo()),
  );

  const result = await service.process(buildWebhookEvent({ eventId: 'evt_002' }));

  assert.equal(result.status, 'FAILED');
  assert.equal(result.retryable, false);
  const stored = webhookRepo.get('evt_002', 'SPEEDYPAY');
  assert.equal(stored.status, 'FAILED');
  assert.equal(stored.correlationStatus, 'CORRELATED');
  assert.match(stored.processingError ?? '', /Invalid transaction transition/);
});
