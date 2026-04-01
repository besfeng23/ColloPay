import type { AuditLogEntry } from '../domain/types';
import type { AuditLogRepository } from '../ports/repositories';

export class AuditLogService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async log(entry: AuditLogEntry): Promise<void> {
    await this.auditLogRepository.write(entry);
  }
}
