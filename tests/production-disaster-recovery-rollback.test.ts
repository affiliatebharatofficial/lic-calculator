import { describe, it, expect } from 'vitest';
import { AdminStore } from '@/lib/admin';

describe('Production Disaster Recovery & Rule Rollback Lifecycle', () => {
  it('allows emergency disabling of a problematic live rule', () => {
    // 1. Create a draft rule
    const createRes = AdminStore.createRule({
      planCode: '999',
      tableNo: 999,
      calculatorCode: 'surrender',
      version: 'v1',
      calculationStrategy: 'surrender_special_v1',
      effectiveFrom: '2026-01-01',
      sourceId: 'src_lic_914_doc',
      rulePayload: { gsvFactor: 0.5, ssvFactor: 0.55, minPaidYears: 2 },
      notes: 'Test rollback rule',
      createdBy: 'editor@lic-calculators.com'
    });
    expect(createRes.success).toBe(true);
    const rule = createRes.rule!;

    // 2. Transition through review, verification & publication
    AdminStore.submitForReview(rule.id, 'usr_editor_1');
    const verifyRes = AdminStore.verifyRule(rule.id, 'usr_reviewer_1');
    expect(verifyRes.success).toBe(true);

    const publishRes = AdminStore.publishRule(rule.id, 'usr_admin_1');
    expect(publishRes.success).toBe(true);
    expect(publishRes.rule?.status).toBe('published');
    expect(publishRes.rule?.isPublished).toBe(true);

    // 3. Simulate emergency incident: disable live rule
    const disabledRule = AdminStore.disableRule(rule.id, 'usr_admin_1');
    expect(disabledRule).toBeDefined();
    expect(disabledRule?.status).toBe('disabled');
    expect(disabledRule?.isPublished).toBe(false);

    // 4. Verify public calculator query cannot access disabled rule
    const publicRule = AdminStore.getPublicActiveRule('999', 'surrender');
    expect(publicRule).toBeUndefined();
  });
});
