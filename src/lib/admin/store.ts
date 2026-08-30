/**
 * Admin Centralized Data Store & Lifecycle State Controller
 * Bridges D1 database operations and in-memory caches.
 */

import type {
  AdminUser,
  AdminSession,
  ManagedRuleSet,
  RuleSource,
  RegressionFixture,
  AdminDashboardStats
} from './types';
import { AuditLogger } from './audit';
import { RuleValidator } from './rule-validator';
import { RegressionGate } from './regression-gate';

// In-Memory Seeded State
const SEED_USERS: AdminUser[] = [
  {
    id: 'user_super_1',
    email: 'admin@lic-calculators.com',
    name: 'Chief Actuary & Architect',
    role: 'super_admin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user_editor_1',
    email: 'editor@lic-calculators.com',
    name: 'Content & Rule Editor',
    role: 'editor',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user_reviewer_1',
    email: 'reviewer@lic-calculators.com',
    name: 'Actuarial Reviewer',
    role: 'reviewer',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

const SEED_SOURCES: RuleSource[] = [
  {
    id: 'src_lic_914_doc',
    sourceTitle: 'LIC New Endowment Plan 914 Official Policy Document',
    sourceType: 'policy_document',
    publisher: 'Life Insurance Corporation of India (Actuarial Dept)',
    publicationDate: '2020-02-01',
    effectiveDate: '2020-02-01',
    sourceReference: 'CO/ACT/2020/914',
    sourceUrl: 'https://licindia.in',
    verificationStatus: 'verified',
    verifiedBy: 'Chief Actuary',
    verifiedAt: '2026-01-10T12:00:00Z',
    notes: 'Official surrender factor tables and GSV/SSV schedule.',
    createdBy: 'admin@lic-calculators.com',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'src_lic_bonus_2024',
    sourceTitle: 'LIC Annual Valuation Bonus Rates Circular 2024-25',
    sourceType: 'circular',
    publisher: 'LIC Marketing & Actuarial Valuation Wing',
    publicationDate: '2024-04-01',
    effectiveDate: '2024-04-01',
    sourceReference: 'VAL/2024/CIRC_09',
    verificationStatus: 'verified',
    verifiedBy: 'Actuarial Reviewer',
    verifiedAt: '2026-01-15T00:00:00Z',
    notes: 'Simple reversionary bonus and FAB rate matrices.',
    createdBy: 'admin@lic-calculators.com',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z'
  }
];

const SEED_RULES: ManagedRuleSet[] = [
  {
    id: 'rule_914_surrender_v1',
    planCode: '914',
    tableNo: 914,
    calculatorCode: 'surrender',
    version: 'v1',
    status: 'published',
    isPublished: true,
    calculationStrategy: 'surrender_special_v1',
    effectiveFrom: '2020-02-01',
    sourceId: 'src_lic_914_doc',
    sourceTitle: 'LIC New Endowment Plan 914 Official Policy Document',
    rulePayload: {
      gsvFactor: 0.50,
      ssvFactor: 0.55,
      minPaidYears: 2
    },
    notes: 'Verified production rule for Table 914 Surrender Value.',
    createdBy: 'admin@lic-calculators.com',
    reviewedBy: 'reviewer@lic-calculators.com',
    reviewedAt: '2026-01-10T10:00:00Z',
    verifiedBy: 'admin@lic-calculators.com',
    verifiedAt: '2026-01-10T12:00:00Z',
    publishedBy: 'admin@lic-calculators.com',
    publishedAt: '2026-01-10T14:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-10T14:00:00Z'
  },
  {
    id: 'rule_914_premium_v1',
    planCode: '914',
    tableNo: 914,
    calculatorCode: 'premium',
    version: 'v1',
    status: 'published',
    isPublished: true,
    calculationStrategy: 'premium_tabular_v1',
    effectiveFrom: '2020-02-01',
    sourceId: 'src_lic_914_doc',
    sourceTitle: 'LIC New Endowment Plan 914 Official Policy Document',
    rulePayload: {
      baseTabularRate: 49.60,
      yearlyModeRebatePercent: 2,
      highSaRebatePerThousand: 1.50
    },
    notes: 'Verified production rule for Table 914 Premium calculation.',
    createdBy: 'admin@lic-calculators.com',
    reviewedBy: 'reviewer@lic-calculators.com',
    reviewedAt: '2026-01-10T10:00:00Z',
    verifiedBy: 'admin@lic-calculators.com',
    verifiedAt: '2026-01-10T12:00:00Z',
    publishedBy: 'admin@lic-calculators.com',
    publishedAt: '2026-01-10T14:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-10T14:00:00Z'
  }
];

const SEED_FIXTURES: RegressionFixture[] = [
  {
    id: 'fix_914_surrender_1',
    ruleSetId: 'rule_914_surrender_v1',
    calculatorCode: 'surrender',
    fixtureName: 'Table 914 - 5 Year Surrender Benchmark',
    testInput: {
      sumAssured: 500000,
      policyTerm: 20,
      completedYears: 5,
      totalPremiumsPaid: 125000,
      accruedBonus: 0
    },
    expectedOutput: {
      payableSurrenderValue: 68750
    },
    lastTestStatus: 'passed',
    lastRunAt: '2026-01-10T12:00:00Z'
  }
];

export class AdminStore {
  private static users: AdminUser[] = [...SEED_USERS];
  private static sources: RuleSource[] = [...SEED_SOURCES];
  private static rules: ManagedRuleSet[] = [...SEED_RULES];
  private static fixtures: RegressionFixture[] = [...SEED_FIXTURES];
  private static sessions: Map<string, AdminSession> = new Map();

  // --- Auth & Sessions ---
  public static getUserByEmail(email: string): AdminUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public static getUserById(id: string): AdminUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  public static saveSession(session: AdminSession): void {
    this.sessions.set(session.id, session);
  }

  public static getSession(tokenId: string): AdminSession | undefined {
    return this.sessions.get(tokenId);
  }

  public static deleteSession(tokenId: string): boolean {
    return this.sessions.delete(tokenId);
  }

  // --- Dashboard Stats ---
  public static getDashboardStats(): AdminDashboardStats {
    const totalRules = this.rules.length;
    const draftRules = this.rules.filter((r) => r.status === 'draft').length;
    const pendingReviewRules = this.rules.filter((r) => r.status === 'review').length;
    const verifiedRules = this.rules.filter((r) => r.status === 'verified').length;
    const publishedRules = this.rules.filter((r) => r.isPublished).length;
    const totalSources = this.sources.length;
    const pendingSources = this.sources.filter((s) => s.verificationStatus === 'pending').length;

    return {
      totalPlans: 6,
      activePlans: 6,
      totalRules,
      draftRules,
      pendingReviewRules,
      verifiedRules,
      publishedRules,
      totalSources,
      pendingSources,
      pendingTranslations: 0,
      recentAuditLogs: AuditLogger.getLogs({ limit: 10 })
    };
  }

  // --- Sources CRUD ---
  public static listSources(): RuleSource[] {
    return [...this.sources];
  }

  public static getSourceById(id: string): RuleSource | undefined {
    return this.sources.find((s) => s.id === id);
  }

  public static createSource(source: Omit<RuleSource, 'id' | 'createdAt' | 'updatedAt'>): RuleSource {
    const newSource: RuleSource = {
      ...source,
      id: 'src_' + crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.sources.unshift(newSource);
    return newSource;
  }

  public static verifySource(sourceId: string, verifiedBy: string): RuleSource | null {
    const src = this.sources.find((s) => s.id === sourceId);
    if (!src) return null;

    src.verificationStatus = 'verified';
    src.verifiedBy = verifiedBy;
    src.verifiedAt = new Date().toISOString();
    src.updatedAt = new Date().toISOString();

    return src;
  }

  // --- Rules Lifecycle & Verification ---
  public static listRules(filters?: { planCode?: string; calculatorCode?: string; status?: string }): ManagedRuleSet[] {
    let list = [...this.rules];
    if (filters?.planCode) {
      list = list.filter((r) => r.planCode === filters.planCode);
    }
    if (filters?.calculatorCode) {
      list = list.filter((r) => r.calculatorCode === filters.calculatorCode);
    }
    if (filters?.status) {
      list = list.filter((r) => r.status === filters.status);
    }
    return list;
  }

  public static getRuleById(id: string): ManagedRuleSet | undefined {
    return this.rules.find((r) => r.id === id);
  }

  /**
   * Public Boundary Query: Only verified + published + active rules.
   */
  public static getPublicActiveRule(planCode: string, calculatorCode: string): ManagedRuleSet | undefined {
    const today = new Date().toISOString().split('T')[0] ?? '';
    return this.rules.find((r) =>
      r.planCode === planCode &&
      r.calculatorCode === calculatorCode &&
      r.isPublished === true &&
      r.status === 'published' &&
      r.effectiveFrom <= today &&
      (!r.effectiveTo || r.effectiveTo >= today)
    );
  }

  public static createRule(
    ruleData: Omit<ManagedRuleSet, 'id' | 'status' | 'isPublished' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; rule?: ManagedRuleSet; error?: string } {
    // 1. Schema Validation
    const validation = RuleValidator.validateRule(ruleData);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(' ') };
    }

    // 2. Conflict & Date Overlap Check
    const conflict = RuleValidator.detectDateConflict(ruleData, this.rules);
    if (conflict.hasConflict) {
      return { success: false, error: conflict.message };
    }

    const newRule: ManagedRuleSet = {
      ...ruleData,
      id: 'rule_' + crypto.randomUUID(),
      status: 'draft',
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.rules.unshift(newRule);
    return { success: true, rule: newRule };
  }

  public static submitForReview(ruleId: string, actor: string): ManagedRuleSet | null {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule || rule.status !== 'draft') return null;

    rule.status = 'review';
    rule.reviewedBy = actor;
    rule.reviewedAt = new Date().toISOString();
    rule.updatedAt = new Date().toISOString();
    return rule;
  }

  public static verifyRule(ruleId: string, actor: string): { success: boolean; rule?: ManagedRuleSet; error?: string } {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule) return { success: false, error: 'Rule not found.' };

    // Regression gate check before verification
    const testResult = RegressionGate.runTests(rule, this.fixtures);
    if (!testResult.passed) {
      return {
        success: false,
        error: `Regression Gate Blocked: ${testResult.failedFixtures} test fixture(s) failed.`
      };
    }

    rule.status = 'verified';
    rule.verifiedBy = actor;
    rule.verifiedAt = new Date().toISOString();
    rule.updatedAt = new Date().toISOString();

    return { success: true, rule };
  }

  public static publishRule(ruleId: string, actor: string): { success: boolean; rule?: ManagedRuleSet; error?: string } {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule) return { success: false, error: 'Rule not found.' };
    if (rule.status !== 'verified') {
      return { success: false, error: 'Cannot publish rule: Rule must be verified by an authorized reviewer first.' };
    }

    // Deactivate previous published versions for the same plan & calculator
    for (const oldRule of this.rules) {
      if (oldRule.id !== rule.id && oldRule.planCode === rule.planCode && oldRule.calculatorCode === rule.calculatorCode && oldRule.isPublished) {
        oldRule.isPublished = false;
        oldRule.status = 'archived';
        oldRule.updatedAt = new Date().toISOString();
      }
    }

    rule.status = 'published';
    rule.isPublished = true;
    rule.publishedBy = actor;
    rule.publishedAt = new Date().toISOString();
    rule.updatedAt = new Date().toISOString();

    return { success: true, rule };
  }

  public static disableRule(ruleId: string, actor: string): ManagedRuleSet | null {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule) return null;

    rule.status = 'disabled';
    rule.isPublished = false;
    rule.disabledBy = actor;
    rule.disabledAt = new Date().toISOString();
    rule.updatedAt = new Date().toISOString();

    return rule;
  }

  public static rollbackRule(planCode: string, calculatorCode: string, targetVersion: string, actor: string): { success: boolean; rule?: ManagedRuleSet; error?: string } {
    const target = this.rules.find(
      (r) => r.planCode === planCode && r.calculatorCode === calculatorCode && r.version === targetVersion
    );
    if (!target) {
      return { success: false, error: `Rollback target version '${targetVersion}' not found.` };
    }

    // Unpublish current active rule
    for (const r of this.rules) {
      if (r.planCode === planCode && r.calculatorCode === calculatorCode && r.isPublished) {
        r.isPublished = false;
        r.status = 'archived';
        r.updatedAt = new Date().toISOString();
      }
    }

    target.status = 'published';
    target.isPublished = true;
    target.publishedBy = actor;
    target.publishedAt = new Date().toISOString();
    target.updatedAt = new Date().toISOString();

    return { success: true, rule: target };
  }
}
