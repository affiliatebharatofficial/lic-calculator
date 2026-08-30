import { describe, it, expect } from 'vitest';
import { AuditLogger } from '@/lib/admin';

describe('Admin Immutable Audit Trail', () => {
  it('records audit events and sanitizes sensitive secrets', () => {
    const entry = AuditLogger.recordEvent({
      actorId: 'usr_1',
      actorName: 'Super Admin',
      actorRole: 'super_admin',
      eventType: 'RULE_UPDATED',
      targetEntity: 'managed_rule_sets',
      targetId: 'rule_914_surrender_v1',
      previousState: { status: 'draft', passwordHash: 'secret_12345' },
      newState: { status: 'review', token: 'token_abcde' }
    });

    expect(entry.id).toBeDefined();
    expect(entry.eventType).toBe('RULE_UPDATED');
    expect(entry.previousState?.status).toBe('draft');
    expect(entry.previousState?.passwordHash).toBe('[REDACTED_SECRET]');
    expect(entry.newState?.token).toBe('[REDACTED_SECRET]');
  });

  it('retrieves recorded audit logs with filters', () => {
    const logs = AuditLogger.getLogs({ entityType: 'managed_rule_sets' });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]?.targetEntity).toBe('managed_rule_sets');
  });
});
