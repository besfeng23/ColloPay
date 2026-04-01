import { DomainError } from './errors';
import type { TransactionStatus } from './types';

const transitionMap: Record<TransactionStatus, ReadonlySet<TransactionStatus>> = {
  INITIATED: new Set(['PENDING_PROCESSOR', 'FAILED', 'CANCELLED']),
  PENDING_PROCESSOR: new Set(['AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED']),
  AUTHORIZED: new Set(['CAPTURED', 'FAILED', 'CANCELLED']),
  CAPTURED: new Set(['SETTLED', 'PARTIALLY_REFUNDED', 'REFUNDED']),
  SETTLED: new Set(['PARTIALLY_REFUNDED', 'REFUNDED']),
  FAILED: new Set(),
  CANCELLED: new Set(),
  REFUNDED: new Set(),
  PARTIALLY_REFUNDED: new Set(['REFUNDED']),
};

export function assertValidStatusTransition(from: TransactionStatus, to: TransactionStatus): void {
  if (from === to) {
    return;
  }

  if (!transitionMap[from]?.has(to)) {
    throw new DomainError(`Invalid transaction transition from ${from} to ${to}.`, 'STATE_TRANSITION_ERROR', {
      from,
      to,
    });
  }
}
