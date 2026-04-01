import type {
  AuditLogEntry,
  IdempotencyRecord,
  Transaction,
  TransactionStatus,
  TransactionStatusChange,
} from '../domain/types';

export interface TransactionRepository {
  create(transaction: Transaction): Promise<void>;
  getById(id: string): Promise<Transaction | null>;
  getByExternalReference(externalReference: string): Promise<Transaction | null>;
  getByProcessorTransactionId(processorTransactionId: string): Promise<Transaction | null>;
  updateStatus(transactionId: string, status: TransactionStatus, reason: string, updatedAt: string): Promise<void>;
  updateProcessorReference(transactionId: string, processorTransactionId: string, updatedAt: string): Promise<void>;
}

export interface TransactionStatusHistoryRepository {
  append(change: TransactionStatusChange): Promise<void>;
}

export interface IdempotencyRepository {
  getByKey(scope: string, key: string): Promise<IdempotencyRecord | null>;
  create(record: IdempotencyRecord): Promise<void>;
}

export interface WebhookEventRepository {
  hasProcessed(eventId: string, processor: string): Promise<boolean>;
  markProcessed(eventId: string, processor: string, processedAt: string): Promise<void>;
}

export interface AuditLogRepository {
  write(entry: AuditLogEntry): Promise<void>;
}
