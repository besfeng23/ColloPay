export class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class IdempotencyConflictError extends DomainError {
  constructor(message = 'In-flight request with same idempotency key already exists') {
    super(message, 'IDEMPOTENCY_CONFLICT');
    this.name = 'IdempotencyConflictError';
  }
}

export class InvalidStatusTransitionError extends DomainError {
  constructor(from: string, to: string) {
    super(`Invalid transaction status transition from ${from} to ${to}`, 'INVALID_STATUS_TRANSITION');
    this.name = 'InvalidStatusTransitionError';
  }
}
