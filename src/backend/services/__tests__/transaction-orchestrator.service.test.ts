import test from 'node:test';
import assert from 'node:assert/strict';
import type { ProcessorAdapter } from '../../adapters/processor-adapter';
import { InMemoryProcessorAdapterRegistry } from '../../adapters/processor-adapter-registry';
import type {
  AuditLogEntry,
  IdempotencyRecord,
  ProcessorCreatePaymentResult,
  Transaction,
  TransactionStatus,
  TransactionStatusChange,
} from '../../domain/types';
import type {
  AuditLogRepository,
  IdempotencyRepository,
  TransactionRepository,
  TransactionStatusHistoryRepository,
} from '../../ports/repositories';
import { AuditLogService } from '../audit-log.service';
import { FeeEngineService } from '../fee-engine.service';
import { IdempotencyService } from '../idempotency.service';
import { TransactionOrchestrationService } from '../transaction-orchestrator.service';

class InMemoryTransactionRepo implements TransactionRepository {
  private readonly records = new Map<string, Transaction>();

  async create(transaction: Transaction): Promise<void> {
    this.records.set(transaction.id, transaction);
  }

  async getById(id: string): Promise<Transaction | null> {
    return this.records.get(id) ?? null;
  }

  async getByExternalReference(externalReference: string): Promise<Transaction | null> {
    return [...this.records.values()].find((value) => value.externalReference === externalReference) ?? null;
  }

  async getByProcessorTransactionId(processorTransactionId: string): Promise<Transaction | null> {
    return [...this.records.values()].find((value) => value.processorTransactionId === processorTransactionId) ?? null;
  }

  async updateStatus(transactionId: string, status: TransactionStatus, reason: string, updatedAt: string): Promise<void> {
    const existing = this.records.get(transactionId);
    if (!existing) {
      throw new Error('missing');
    }

    this.records.set(transactionId, { ...existing, status, statusReason: reason, updatedAt });
  }

  async updateProcessorReference(transactionId: string, processorTransactionId: string, updatedAt: string): Promise<void> {
    const existing = this.records.get(transactionId);
    if (!existing) {
      throw new Error('missing');
    }

    this.records.set(transactionId, { ...existing, processorTransactionId, updatedAt });
  }
}

class InMemoryStatusHistoryRepo implements TransactionStatusHistoryRepository {
  public readonly entries: TransactionStatusChange[] = [];

  async append(change: TransactionStatusChange): Promise<void> {
    this.entries.push(change);
  }
}

class InMemoryIdempotencyRepo implements IdempotencyRepository {
  private readonly rows = new Map<string, IdempotencyRecord>();

  async getByKey(scope: string, key: string): Promise<IdempotencyRecord | null> {
    return this.rows.get(`${scope}:${key}`) ?? null;
  }

  async create(record: IdempotencyRecord): Promise<void> {
    this.rows.set(`${record.scope}:${record.key}`, record);
  }
}

class InMemoryAuditRepo implements AuditLogRepository {
  public readonly logs: AuditLogEntry[] = [];

  async write(entry: AuditLogEntry): Promise<void> {
    this.logs.push(entry);
  }
}

class FakeSpeedyPayAdapter implements ProcessorAdapter {
  readonly processor = 'SPEEDYPAY' as const;

  async createPayment(): Promise<ProcessorCreatePaymentResult> {
    return {
      processorTransactionId: 'spd_001',
      status: 'AUTHORIZED',
      rawResponse: { ok: true },
    };
  }

  async verifyWebhookSignature(): Promise<boolean> {
    return true;
  }

  async resolveWebhookUpdate() {
    return null;
  }
}

test('TransactionOrchestrationService creates transaction with fee and status history', async () => {
  const transactionRepo = new InMemoryTransactionRepo();
  const historyRepo = new InMemoryStatusHistoryRepo();
  const idempotencyRepo = new InMemoryIdempotencyRepo();
  const auditRepo = new InMemoryAuditRepo();

  const service = new TransactionOrchestrationService(
    transactionRepo,
    historyRepo,
    new FeeEngineService({
      getPolicy: () => ({ processorBasisPoints: 200, platformBasisPoints: 100, flatFeeMinor: 10 }),
    }),
    new InMemoryProcessorAdapterRegistry([new FakeSpeedyPayAdapter()]),
    new IdempotencyService(idempotencyRepo),
    new AuditLogService(auditRepo),
  );

  const created = await service.createTransaction({
    idempotencyKey: 'idem-key-123',
    externalReference: 'order-123',
    merchant: { merchantId: 'm1', partnerId: 'p1' },
    amount: { amountMinor: 10_000, currency: 'USD' },
    processor: 'SPEEDYPAY',
  });

  assert.equal(created.status, 'AUTHORIZED');
  assert.equal(created.feeBreakdown.totalFeeMinor, 310);
  assert.equal(created.processorTransactionId, 'spd_001');
  assert.equal(historyRepo.entries.length, 2);
  assert.equal(auditRepo.logs.length, 1);
});
