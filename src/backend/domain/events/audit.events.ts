export interface AuditEvent {
  entityType: 'transaction' | 'webhook' | 'idempotency';
  entityId: string;
  action: string;
  actor: string;
  occurredAt: string;
  metadata: Record<string, string | number | boolean | null>;
}

export interface AuditLogger {
  log(event: AuditEvent): Promise<void>;
}
