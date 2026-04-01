import type { AuditEvent, AuditLogger } from '../../domain/events/audit.events';

export class ConsoleAuditLogger implements AuditLogger {
  async log(event: AuditEvent): Promise<void> {
    // Replace with Cloud Logging or SIEM sink in production.
    console.info('[AUDIT]', JSON.stringify(event));
  }
}
