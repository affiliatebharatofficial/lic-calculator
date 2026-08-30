/**
 * Audit Logging Service
 */

import type { D1DatabaseLike } from '../client';
import type { AuditAction, AuditLogRow } from '../types';

export class AuditService {
  constructor(private readonly db: D1DatabaseLike) {}

  public async logEvent(params: {
    actor: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    oldValue?: Record<string, unknown> | null;
    newValue?: Record<string, unknown> | null;
  }): Promise<void> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const oldJson = params.oldValue ? JSON.stringify(params.oldValue) : null;
    const newJson = params.newValue ? JSON.stringify(params.newValue) : null;

    const stmt = this.db.prepare(`
      INSERT INTO audit_logs (id, actor, action, entity_type, entity_id, old_value_json, new_value_json, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    stmt.bind(
      id,
      params.actor,
      params.action,
      params.entityType,
      params.entityId,
      oldJson,
      newJson
    );

    await stmt.run();
  }

  public async getAuditHistory(entityType: string, entityId: string): Promise<AuditLogRow[]> {
    const stmt = this.db.prepare<AuditLogRow>(`
      SELECT * FROM audit_logs
      WHERE entity_type = ? AND entity_id = ?
      ORDER BY timestamp DESC
    `);
    stmt.bind(entityType, entityId);
    const res = await stmt.all();
    return res.results;
  }
}
