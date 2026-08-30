import { describe, it, expect } from 'vitest';
import { AdminStore, RuleValidator } from '@/lib/admin';

describe('Admin Rule Lifecycle, Versioning & Conflict Detection', () => {
  it('creates draft rule with schema validation', () => {
    const res = AdminStore.createRule({
      planCode: '915',
      tableNo: 915,
      calculatorCode: 'surrender',
      version: 'v1',
      calculationStrategy: 'surrender_special_v1',
      effectiveFrom: '2026-01-01',
      rulePayload: { gsvFactor: 0.5, ssvFactor: 0.55 },
      createdBy: 'editor@lic-calculators.com'
    });

    expect(res.success).toBe(true);
    expect(res.rule?.status).toBe('draft');
    expect(res.rule?.isPublished).toBe(false);
  });

  it('rejects invalid calculation strategy preventing eval/dynamic injection', () => {
    const validation = RuleValidator.validateRule({
      planCode: '914',
      tableNo: 914,
      calculatorCode: 'premium',
      version: 'v1',
      calculationStrategy: 'eval(alert("hacked"))',
      effectiveFrom: '2026-01-01',
      rulePayload: { rate: 50 }
    });

    expect(validation.isValid).toBe(false);
    expect(validation.errors.some((e) => e.includes('Invalid calculation strategy'))).toBe(true);
  });

  it('detects date overlap conflicts for the same plan & calculator', () => {
    const existingRules = [
      {
        id: 'rule_1',
        planCode: '914',
        tableNo: 914,
        calculatorCode: 'surrender',
        version: 'v1',
        status: 'published' as const,
        isPublished: true,
        calculationStrategy: 'surrender_special_v1',
        effectiveFrom: '2025-01-01',
        effectiveTo: '2026-12-31',
        rulePayload: {},
        createdBy: 'admin@lic-calculators.com',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01'
      }
    ];

    const conflictResult = RuleValidator.detectDateConflict(
      {
        id: 'rule_2',
        planCode: '914',
        calculatorCode: 'surrender',
        effectiveFrom: '2026-06-01',
        effectiveTo: '2027-06-01'
      },
      existingRules
    );

    expect(conflictResult.hasConflict).toBe(true);
    expect(conflictResult.message).toContain('Date range conflict');
  });

  it('progresses through Review -> Verification -> Publishing pipeline', () => {
    const createRes = AdminStore.createRule({
      planCode: '936',
      tableNo: 936,
      calculatorCode: 'maturity',
      version: 'v1',
      calculationStrategy: 'maturity_endowment_v1',
      effectiveFrom: '2026-01-01',
      rulePayload: { bonusRate: 42 },
      createdBy: 'editor@lic-calculators.com'
    });
    const ruleId = createRes.rule!.id;

    // 1. Submit for review
    const reviewed = AdminStore.submitForReview(ruleId, 'editor@lic-calculators.com');
    expect(reviewed?.status).toBe('review');

    // 2. Cannot publish unverified rule
    const prematurePub = AdminStore.publishRule(ruleId, 'admin@lic-calculators.com');
    expect(prematurePub.success).toBe(false);

    // 3. Verify
    const verified = AdminStore.verifyRule(ruleId, 'reviewer@lic-calculators.com');
    expect(verified.success).toBe(true);
    expect(verified.rule?.status).toBe('verified');

    // 4. Publish
    const published = AdminStore.publishRule(ruleId, 'admin@lic-calculators.com');
    expect(published.success).toBe(true);
    expect(published.rule?.status).toBe('published');
    expect(published.rule?.isPublished).toBe(true);
  });
});
