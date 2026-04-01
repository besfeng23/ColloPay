import type {
  AuditLogEntry,
  IdempotencyRecord,
  ProcessorType,
  ProcessorWebhookEvent,
  Transaction,
  TransactionStatus,
  TransactionStatusChange,
  WebhookEvent,
  WebhookStatus,
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
  findByEventId(eventId: string, processor: ProcessorType): Promise<WebhookEvent | null>;
  createReceived(input: {
    event: ProcessorWebhookEvent;
    processingKey: string;
    receivedAt: string;
  }): Promise<WebhookEvent>;
  markStatus(input: {
    eventId: string;
    processor: ProcessorType;
    status: WebhookStatus;
    processedAt?: string;
    transactionId?: string;
    outcomeCode?: string;
    correlationStatus?: WebhookEvent['correlationStatus'];
    retryable?: boolean;
    nextRetryAt?: string;
    deadLetterReason?: string;
    processingError?: string;
  }): Promise<void>;
  incrementAttempt(eventId: string, processor: ProcessorType): Promise<number>;
}

export interface AuditLogRepository {
  write(entry: AuditLogEntry): Promise<void>;
}

export interface MerchantMappingRepository {
  isProcessorMapped(input: { merchantId: string; partnerId: string; processor: ProcessorType }): Promise<boolean>;
}
