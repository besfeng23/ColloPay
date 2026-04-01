import { DomainError } from './errors';
import type { TransactionStatus } from './types';

export interface AuditRequirement {
  requiredFields: string[];
  minimumActorType: 'SYSTEM' | 'USER' | 'PROCESSOR';
  note: string;
}

export interface TransitionDefinition {
  from: TransactionStatus;
  to: TransactionStatus;
  category: 'NORMAL' | 'REVERSAL' | 'REFUND' | 'CHARGEBACK';
  description: string;
  audit: AuditRequirement;
}

export const ALLOWED_STATUS_TRANSITIONS: ReadonlyArray<TransitionDefinition> = [
  transition('INITIATED', 'PENDING_PROCESSOR', 'NORMAL', 'Request accepted and forwarded to processor.'),
  transition('INITIATED', 'FAILED', 'NORMAL', 'Validation or processor submission failed.'),
  transition('INITIATED', 'CANCELLED', 'NORMAL', 'Request cancelled before processor handoff.'),

  transition('PENDING_PROCESSOR', 'AUTHORIZED', 'NORMAL', 'Processor authorized funds.'),
  transition('PENDING_PROCESSOR', 'CAPTURED', 'NORMAL', 'Processor authorized and captured in one step.'),
  transition('PENDING_PROCESSOR', 'FAILED', 'NORMAL', 'Processor declined or timed out.'),
  transition('PENDING_PROCESSOR', 'CANCELLED', 'NORMAL', 'Merchant or system cancellation before capture.'),

  transition('AUTHORIZED', 'CAPTURED', 'NORMAL', 'Authorized funds were captured.'),
  transition('AUTHORIZED', 'FAILED', 'NORMAL', 'Authorization later marked invalid.'),
  transition('AUTHORIZED', 'CANCELLED', 'REVERSAL', 'Void issued before capture.'),
  transition('AUTHORIZED', 'REVERSED', 'REVERSAL', 'Full auth reversal requested.'),

  transition('CAPTURED', 'SETTLED', 'NORMAL', 'Funds included in settlement file.'),
  transition('CAPTURED', 'PARTIALLY_REFUNDED', 'REFUND', 'Partial refund after capture.'),
  transition('CAPTURED', 'REFUNDED', 'REFUND', 'Full refund after capture.'),
  transition('CAPTURED', 'CHARGEBACK_PENDING', 'CHARGEBACK', 'Dispute opened before settlement.'),

  transition('SETTLED', 'PARTIALLY_REFUNDED', 'REFUND', 'Post-settlement partial refund.'),
  transition('SETTLED', 'REFUNDED', 'REFUND', 'Post-settlement full refund.'),
  transition('SETTLED', 'CHARGEBACK_PENDING', 'CHARGEBACK', 'Dispute opened after settlement.'),

  transition('PARTIALLY_REFUNDED', 'REFUNDED', 'REFUND', 'Remaining amount refunded.'),
  transition('CHARGEBACK_PENDING', 'CHARGEBACK_WON', 'CHARGEBACK', 'Chargeback adjudicated in favor of merchant.'),
  transition('CHARGEBACK_PENDING', 'CHARGEBACK_LOST', 'CHARGEBACK', 'Chargeback adjudicated against merchant.'),
];

const transitionMap: Record<TransactionStatus, ReadonlySet<TransactionStatus>> = {
  INITIATED: new Set(['PENDING_PROCESSOR', 'FAILED', 'CANCELLED']),
  PENDING_PROCESSOR: new Set(['AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED']),
  AUTHORIZED: new Set(['CAPTURED', 'FAILED', 'CANCELLED', 'REVERSED']),
  CAPTURED: new Set(['SETTLED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'CHARGEBACK_PENDING']),
  SETTLED: new Set(['PARTIALLY_REFUNDED', 'REFUNDED', 'CHARGEBACK_PENDING']),
  PARTIALLY_REFUNDED: new Set(['REFUNDED']),
  CHARGEBACK_PENDING: new Set(['CHARGEBACK_WON', 'CHARGEBACK_LOST']),
  FAILED: new Set(),
  CANCELLED: new Set(),
  REFUNDED: new Set(),
  CHARGEBACK_WON: new Set(),
  CHARGEBACK_LOST: new Set(),
  REVERSED: new Set(),
};

export function assertValidStatusTransition(from: TransactionStatus, to: TransactionStatus): void {
  if (from === to) {
    return;
  }

  if (!transitionMap[from]?.has(to)) {
    throw new DomainError(`Invalid transaction transition from ${from} to ${to}.`, 'STATE_TRANSITION_ERROR', {
      from,
      to,
      illegalTransition: true,
    });
  }
}

export function isIllegalTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  if (from === to) {
    return false;
  }

  return !transitionMap[from]?.has(to);
}

export function getTransitionAuditRequirements(from: TransactionStatus, to: TransactionStatus): AuditRequirement {
  const definition = ALLOWED_STATUS_TRANSITIONS.find((item) => item.from === from && item.to === to);
  if (!definition) {
    throw new DomainError(`No audit requirement found for transition ${from} -> ${to}.`, 'STATE_TRANSITION_ERROR', {
      from,
      to,
    });
  }

  return definition.audit;
}

function transition(
  from: TransactionStatus,
  to: TransactionStatus,
  category: TransitionDefinition['category'],
  description: string,
): TransitionDefinition {
  return {
    from,
    to,
    category,
    description,
    audit: {
      requiredFields: ['transactionId', 'from', 'to', 'reason', 'actor', 'at'],
      minimumActorType: category === 'NORMAL' ? 'SYSTEM' : 'USER',
      note:
        category === 'REFUND'
          ? 'Refund reference and financial impact details are mandatory in audit metadata.'
          : category === 'REVERSAL'
            ? 'Reversal/void request identifier is mandatory in audit metadata.'
            : category === 'CHARGEBACK'
              ? 'Case identifier, evidence status, and liable party must be recorded.'
              : 'Record internal decision details and source event identifier.',
    },
  };
}
