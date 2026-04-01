import type { TransactionStatus } from '../types/transaction.types';

const allowedTransitions: Record<TransactionStatus, TransactionStatus[]> = {
  created: ['pending_processor', 'cancelled', 'failed'],
  pending_processor: ['authorized', 'captured', 'failed', 'cancelled'],
  authorized: ['captured', 'cancelled', 'failed'],
  captured: ['settled', 'refunded', 'failed'],
  settled: ['refunded'],
  failed: [],
  cancelled: [],
  refunded: []
};

export const canTransition = (from: TransactionStatus, to: TransactionStatus): boolean => {
  return allowedTransitions[from].includes(to);
};
