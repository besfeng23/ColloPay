import type { Transaction, TransactionStatusTransition } from '../../domain/entities/transaction.entity';
import type { ProcessorWebhookEvent } from './processor-adapter.interface';

export interface TransactionRepository {
  create(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByIdempotencyKey(partnerId: string, key: string): Promise<Transaction | null>;
  findByProcessorTransactionId(processor: string, processorTransactionId: string): Promise<Transaction | null>;
}

export interface StatusTransitionRepository {
  create(record: TransactionStatusTransition): Promise<void>;
}

export interface IdempotencyStore {
  tryLock(key: string, ttlSeconds: number): Promise<boolean>;
  release(key: string): Promise<void>;
}

export interface WebhookEventRepository {
  hasProcessed(eventId: string, processor: string): Promise<boolean>;
  markProcessed(event: ProcessorWebhookEvent): Promise<void>;
}
