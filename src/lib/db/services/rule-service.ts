/**
 * Rule Lifecycle & Management Service
 */

import type { D1DatabaseLike } from '../client';
import type { RuleSetRow, VerificationStatus, SourceType } from '../types';
import { validateRuleSetConflict, type RuleConflictError } from '../validation/rule-validator';
import { AuditService } from './audit-service';

export interface CreateRuleDraftParams {
  readonly planId: string;
  readonly variantId?: string | null;
  readonly calculatorTypeId: string;
  readonly version: string;
  readonly effectiveFrom: string;
  readonly effectiveTo?: string | null;
  readonly policyYearFrom?: number | null;
  readonly policyYearTo?: number | null;
  readonly sourceReference: string;
  readonly sourceTitle: string;
  readonly sourceType: SourceType;
  readonly rulePayload: Record<string, unknown>;
  readonly actor: string;
}

export class RuleService {
  private readonly auditService: AuditService;

  constructor(private readonly db: D1DatabaseLike) {
    this.auditService = new AuditService(db);
  }

  /**
   * Retrieves all rules for a given plan and calculator type.
   */
  public async getRulesByPlanAndCalculator(planId: string, calculatorTypeId: string): Promise<RuleSetRow[]> {
    const stmt = this.db.prepare<RuleSetRow>(`
      SELECT * FROM rule_sets
      WHERE plan_id = ? AND calculator_type_id = ?
      ORDER BY effective_from DESC
    `);
    stmt.bind(planId, calculatorTypeId);
    const res = await stmt.all();
    return res.results;
  }

  /**
   * Creates a new rule in 'draft' status with 'pending' verification.
   */
  public async createRuleDraft(params: CreateRuleDraftParams): Promise<{ ruleId: string; errors: RuleConflictError[] }> {
    const id = `ruleset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const rulePayloadJson = JSON.stringify(params.rulePayload);

    const existingRules = await this.getRulesByPlanAndCalculator(params.planId, params.calculatorTypeId);

    const draftCandidate: Partial<RuleSetRow> = {
      id,
      plan_id: params.planId,
      variant_id: params.variantId,
      calculator_type_id: params.calculatorTypeId,
      version: params.version,
      status: 'draft',
      effective_from: params.effectiveFrom,
      effective_to: params.effectiveTo,
      policy_year_from: params.policyYearFrom ?? 1,
      policy_year_to: params.policyYearTo,
      source_reference: params.sourceReference,
      source_title: params.sourceTitle,
      source_type: params.sourceType,
      verification_status: 'pending',
      rule_payload_json: rulePayloadJson
    };

    const conflictErrors = validateRuleSetConflict(draftCandidate, existingRules);
    if (conflictErrors.length > 0) {
      return { ruleId: id, errors: conflictErrors };
    }

    const stmt = this.db.prepare(`
      INSERT INTO rule_sets (
        id, plan_id, variant_id, calculator_type_id, version, status,
        effective_from, effective_to, policy_year_from, policy_year_to,
        source_reference, source_title, source_type, verification_status,
        rule_payload_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    stmt.bind(
      id,
      params.planId,
      params.variantId ?? null,
      params.calculatorTypeId,
      params.version,
      params.effectiveFrom,
      params.effectiveTo ?? null,
      params.policyYearFrom ?? 1,
      params.policyYearTo ?? null,
      params.sourceReference,
      params.sourceTitle,
      params.sourceType,
      rulePayloadJson
    );

    await stmt.run();

    await this.auditService.logEvent({
      actor: params.actor,
      action: 'CREATE',
      entityType: 'rule_sets',
      entityId: id,
      newValue: draftCandidate as Record<string, unknown>
    });

    return { ruleId: id, errors: [] };
  }

  /**
   * Verifies a draft rule set after actuarial source review.
   */
  public async verifyRule(params: {
    ruleId: string;
    verifiedBy: string;
    verificationNotes: string;
    status: VerificationStatus;
  }): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE rule_sets
      SET verification_status = ?, verified_at = CURRENT_TIMESTAMP, verification_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.bind(params.status, params.verificationNotes, params.ruleId);
    await stmt.run();

    await this.auditService.logEvent({
      actor: params.verifiedBy,
      action: 'VERIFY',
      entityType: 'rule_sets',
      entityId: params.ruleId,
      newValue: {
        verification_status: params.status,
        verification_notes: params.verificationNotes
      }
    });
  }

  /**
   * Activates a verified rule set after conflict validation.
   */
  public async activateRule(params: {
    ruleId: string;
    actor: string;
  }): Promise<{ success: boolean; errors: RuleConflictError[] }> {
    const findStmt = this.db.prepare<RuleSetRow>(`SELECT * FROM rule_sets WHERE id = ?`);
    findStmt.bind(params.ruleId);
    const rule = await findStmt.first();

    if (!rule) {
      return { success: false, errors: [{ code: 'INVALID_JSON', message: 'Rule set not found' }] };
    }

    if (rule.verification_status !== 'verified') {
      return {
        success: false,
        errors: [{ code: 'MISSING_SOURCE', message: 'Only verified rules can be activated for production use.' }]
      };
    }

    const existingRules = await this.getRulesByPlanAndCalculator(rule.plan_id, rule.calculator_type_id);
    const candidate: RuleSetRow = { ...rule, status: 'active' };
    const conflicts = validateRuleSetConflict(candidate, existingRules);

    if (conflicts.length > 0) {
      return { success: false, errors: conflicts };
    }

    const updateStmt = this.db.prepare(`
      UPDATE rule_sets SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    updateStmt.bind(params.ruleId);
    await updateStmt.run();

    await this.auditService.logEvent({
      actor: params.actor,
      action: 'ACTIVATE',
      entityType: 'rule_sets',
      entityId: params.ruleId,
      oldValue: { status: rule.status },
      newValue: { status: 'active' }
    });

    return { success: true, errors: [] };
  }
}
