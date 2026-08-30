import { describe, it, expect } from 'vitest';
import { AdminStore } from '@/lib/admin';

describe('Public vs. Admin Data Boundary Invariant Tests', () => {
  it('strictly blocks DRAFT rules from public calculators', () => {
    AdminStore.createRule({
      planCode: 'BOUNDARY_DRAFT',
      tableNo: 991,
      calculatorCode: 'surrender',
      version: 'v1',
      calculationStrategy: 'surrender_special_v1',
      effectiveFrom: '2026-01-01',
      rulePayload: { test: 1 },
      createdBy: 'editor@lic-calculators.com'
    });

    const publicRule = AdminStore.getPublicActiveRule('BOUNDARY_DRAFT', 'surrender');
    expect(publicRule).toBeUndefined();
  });

  it('strictly blocks REVIEW rules from public calculators', () => {
    const res = AdminStore.createRule({
      planCode: 'BOUNDARY_REVIEW',
      tableNo: 992,
      calculatorCode: 'surrender',
      version: 'v1',
      calculationStrategy: 'surrender_special_v1',
      effectiveFrom: '2026-01-01',
      rulePayload: { test: 1 },
      createdBy: 'editor@lic-calculators.com'
    });
    AdminStore.submitForReview(res.rule!.id, 'editor@lic-calculators.com');

    const publicRule = AdminStore.getPublicActiveRule('BOUNDARY_REVIEW', 'surrender');
    expect(publicRule).toBeUndefined();
  });

  it('strictly blocks VERIFIED but UNPUBLISHED rules from public calculators', () => {
    const res = AdminStore.createRule({
      planCode: 'BOUNDARY_UNPUBLISHED',
      tableNo: 993,
      calculatorCode: 'surrender',
      version: 'v1',
      calculationStrategy: 'surrender_special_v1',
      effectiveFrom: '2026-01-01',
      rulePayload: { test: 1 },
      createdBy: 'editor@lic-calculators.com'
    });
    AdminStore.submitForReview(res.rule!.id, 'editor@lic-calculators.com');
    AdminStore.verifyRule(res.rule!.id, 'reviewer@lic-calculators.com');

    const publicRule = AdminStore.getPublicActiveRule('BOUNDARY_UNPUBLISHED', 'surrender');
    expect(publicRule).toBeUndefined();
  });

  it('strictly blocks EMERGENCY DISABLED rules from public calculators', () => {
    const res = AdminStore.createRule({
      planCode: 'BOUNDARY_DISABLED',
      tableNo: 994,
      calculatorCode: 'surrender',
      version: 'v1',
      calculationStrategy: 'surrender_special_v1',
      effectiveFrom: '2026-01-01',
      rulePayload: { test: 1 },
      createdBy: 'editor@lic-calculators.com'
    });
    AdminStore.submitForReview(res.rule!.id, 'editor@lic-calculators.com');
    AdminStore.verifyRule(res.rule!.id, 'reviewer@lic-calculators.com');
    AdminStore.publishRule(res.rule!.id, 'admin@lic-calculators.com');

    // Was public
    expect(AdminStore.getPublicActiveRule('BOUNDARY_DISABLED', 'surrender')).toBeDefined();

    // Disable emergency
    AdminStore.disableRule(res.rule!.id, 'admin@lic-calculators.com');

    // Must now be blocked from public calculator
    expect(AdminStore.getPublicActiveRule('BOUNDARY_DISABLED', 'surrender')).toBeUndefined();
  });

  it('grants access ONLY to VERIFIED + PUBLISHED + ACTIVE rules within effective date', () => {
    const publicRule = AdminStore.getPublicActiveRule('914', 'surrender');
    expect(publicRule).toBeDefined();
    expect(publicRule?.status).toBe('published');
    expect(publicRule?.isPublished).toBe(true);
  });
});
