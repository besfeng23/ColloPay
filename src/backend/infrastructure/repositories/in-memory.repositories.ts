import type { Transaction, TransactionStatusTransition } from '../../domain/entities/transaction.entity';
import type { ProcessorWebhookEvent } from '../../application/interfaces/processor-adapter.interface';
import type {
  IdempotencyStore,
  StatusTransitionRepository,
  TransactionRepository,
  WebhookEventRepository
} from '../../application/interfaces/repositories.interface';

export class InMemoryTransactionRepository implements TransactionRepository {
  private readonly byId = new Map<string, Transaction>();

  async create(transaction: Transaction): Promise<void> {
    this.byId.set(transaction.id, transaction);
  }

  async update(transaction: Transaction): Promise<void> {
    this.byId.set(transaction.id, transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.byId.get(id) ?? null;
  }

  async findByIdempotencyKey(partnerId: string, key: string): Promise<Transaction | null> {
    for (const tx of this.byId.values()) {
      if (tx.partnerId === partnerId && tx.idempotencyKey === key) return tx;
    }
    return null;
  }

  async findByProcessorTransactionId(processor: string, processorTransactionId: string): Promise<Transaction | null> {
    for (const tx of this.byId.values()) {
      if (tx.processor === processor && tx.processorTransactionId === processorTransactionId) return tx;
    }
    return null;
  }
}

export class InMemoryStatusTransitionRepository implements StatusTransitionRepository {
  readonly records: TransactionStatusTransition[] = [];
  async create(record: TransactionStatusTransition): Promise<void> {
    this.records.push(record);
  }
}

export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly keys = new Set<string>();
  async tryLock(key: string): Promise<boolean> {
    if (this.keys.has(key)) return false;
    this.keys.add(key);
    return true;
  }

  async release(key: string): Promise<void> {
    this.keys.delete(key);
  }
}

export class InMemoryWebhookEventRepository implements WebhookEventRepository {
  private readonly processed = new Set<string>();

  async hasProcessed(eventId: string, processor: string): Promise<boolean> {
    return this.processed.has(`${processor}:${eventId}`);
  }

  async markProcessed(event: ProcessorWebhookEvent): Promise<void> {
    this.processed.add(`${event.processor}:${event.eventId}`);
  }
}
