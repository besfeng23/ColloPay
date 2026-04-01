export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'VALIDATION_ERROR'
      | 'CONFLICT_ERROR'
      | 'NOT_FOUND_ERROR'
      | 'INTEGRATION_ERROR'
      | 'STATE_TRANSITION_ERROR',
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
