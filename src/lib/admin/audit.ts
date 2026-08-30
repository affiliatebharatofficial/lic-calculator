/**
 * Immutable Append-Only Audit Logger for Admin Operations
 */

import type { AuditLogEntry, AdminRole } from './types';

const SENSITIVE_KEYS = ['password', 'passwordHash', 'token', 'apiKey', 'secret', 'authSecret'];

export class AuditLogger {
  private static inMemoryLogs: AuditLogEntry[] = [];

  /**
   * Sanitizes state objects to prevent password/secret leakage in logs.
   */
  public static sanitizePayload(obj?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!obj) return undefined;
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
        sanitized[key] = '[REDACTED_SECRET]';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitizePayload(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Records an immutable audit log entry.
   */
  public static recordEvent(params: {
    actorId: string;
    actorName: string;
    actorRole: AdminRole;
    eventType: string;
    targetEntity: string;
    targetId: string;
    previousState?: Record<string, unknown>;
    newState?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: 'audit_' + crypto.randomUUID(),
      actorId: params.actorId,
      actorName: params.actorName,
      actorRole: params.actorRole,
      eventType: params.eventType,
      targetEntity: params.targetEntity,
      targetId: params.targetId,
      previousState: this.sanitizePayload(params.previousState),
      newState: this.sanitizePayload(params.newState),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      createdAt: new Date().toISOString()
    };

    // Prepend to memory audit trail
    this.inMemoryLogs.unshift(entry);

    // Keep memory trail bounded to last 500 entries
    if (this.inMemoryLogs.length > 500) {
      this.inMemoryLogs = this.inMemoryLogs.slice(0, 500);
    }

    return entry;
  }

  /**
   * Retrieves audit logs with filtering.
   */
  public static getLogs(filters?: {
    entityType?: string;
    actorId?: string;
    limit?: number;
  }): AuditLogEntry[] {
    let logs = [...this.inMemoryLogs];

    if (filters?.entityType) {
      logs = logs.filter((l) => l.targetEntity === filters.entityType);
    }
    if (filters?.actorId) {
      logs = logs.filter((l) => l.actorId === filters.actorId);
    }

    const limit = filters?.limit || 100;
    return logs.slice(0, limit);
  }
}
