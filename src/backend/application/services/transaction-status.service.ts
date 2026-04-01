import { InvalidStatusTransitionError } from '../errors/domain.errors';
import type { StatusTransitionRepository, TransactionRepository } from '../interfaces/repositories.interface';
import type { AuditLogger } from '../../domain/events/audit.events';
import { canTransition } from '../../domain/rules/transaction-status.rules';
import type { Transaction, TransactionStatusTransition } from '../../domain/entities/transaction.entity';
import type { TransactionStatus } from '../../domain/types/transaction.types';

export class TransactionStatusService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transitionRepository: StatusTransitionRepository,
    private readonly auditLogger: AuditLogger
  ) {}

  async transition(
    transaction: Transaction,
    toStatus: TransactionStatus,
    actor: TransactionStatusTransition['actor'],
    reason: string
  ): Promise<Transaction> {
    if (!canTransition(transaction.status, toStatus)) {
      throw new InvalidStatusTransitionError(transaction.status, toStatus);
    }

    const now = new Date().toISOString();
    const updated: Transaction = { ...transaction, status: toStatus, updatedAt: now };

    await this.transactionRepository.update(updated);
    await this.transitionRepository.create({
      transactionId: transaction.id,
      fromStatus: transaction.status,
      toStatus,
      reason,
      actor,
      at: now
    });

    await this.auditLogger.log({
      entityType: 'transaction',
      entityId: transaction.id,
      action: 'status_transition',
      actor,
      occurredAt: now,
      metadata: {
        fromStatus: transaction.status,
        toStatus,
        reason
      }
    });

    return updated;
  }
}
