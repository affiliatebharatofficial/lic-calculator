/**
 * Rule Schema Validator, Calculation Strategy Registry & Conflict Detector
 */

import type { ManagedRuleSet } from './types';

// Registered approved calculation strategies (strictly preventing dynamic eval)
export const APPROVED_CALCULATION_STRATEGIES = [
  'surrender_guaranteed_v1',
  'surrender_special_v1',
  'premium_tabular_v1',
  'maturity_endowment_v1',
  'bonus_reversionary_v1',
  'loan_surrender_ltv_v1'
] as const;

export type ApprovedCalculationStrategy = typeof APPROVED_CALCULATION_STRATEGIES[number];

export interface RuleValidationResult {
  isValid: boolean;
  errors: string[];
}

export class RuleValidator {
  /**
   * Validates a rule set payload against strict schema constraints.
   */
  public static validateRule(rule: Partial<ManagedRuleSet>): RuleValidationResult {
    const errors: string[] = [];

    if (!rule.planCode || typeof rule.planCode !== 'string') {
      errors.push('Plan code is required.');
    }
    if (!rule.tableNo || typeof rule.tableNo !== 'number' || rule.tableNo <= 0) {
      errors.push('Valid plan table number is required.');
    }
    if (!rule.calculatorCode || typeof rule.calculatorCode !== 'string') {
      errors.push('Calculator code is required.');
    }
    if (!rule.version || !/^v\d+(\.\d+)?$/i.test(rule.version)) {
      errors.push('Version must follow semantic format (e.g. v1, v1.0, v2).');
    }
    if (!rule.calculationStrategy || !APPROVED_CALCULATION_STRATEGIES.includes(rule.calculationStrategy as any)) {
      errors.push(`Invalid calculation strategy '${rule.calculationStrategy}'. Must be one of: ${APPROVED_CALCULATION_STRATEGIES.join(', ')}.`);
    }
    if (!rule.effectiveFrom || !/^\d{4}-\d{2}-\d{2}$/.test(rule.effectiveFrom)) {
      errors.push('Effective from date must be in ISO format (YYYY-MM-DD).');
    }
    if (rule.effectiveTo && !/^\d{4}-\d{2}-\d{2}$/.test(rule.effectiveTo)) {
      errors.push('Effective to date must be in ISO format (YYYY-MM-DD).');
    }
    if (rule.effectiveFrom && rule.effectiveTo && rule.effectiveFrom > rule.effectiveTo) {
      errors.push('Effective from date cannot be later than effective to date.');
    }
    if (!rule.rulePayload || typeof rule.rulePayload !== 'object' || Object.keys(rule.rulePayload).length === 0) {
      errors.push('Structured rule payload cannot be empty.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Detects date overlap conflicts between rules for the same plan & calculator.
   */
  public static detectDateConflict(
    targetRule: Partial<ManagedRuleSet>,
    existingRules: ManagedRuleSet[]
  ): { hasConflict: boolean; conflictingRuleId?: string; message?: string } {
    const targetFrom = targetRule.effectiveFrom || '1970-01-01';
    const targetTo = targetRule.effectiveTo || '9999-12-31';

    for (const existing of existingRules) {
      if (existing.id === targetRule.id) continue;
      if (existing.planCode !== targetRule.planCode || existing.calculatorCode !== targetRule.calculatorCode) {
        continue;
      }
      // Only check active or published rules
      if (!['active', 'published', 'verified'].includes(existing.status)) {
        continue;
      }

      const existingFrom = existing.effectiveFrom;
      const existingTo = existing.effectiveTo || '9999-12-31';

      // Check date interval overlap: max(fromA, fromB) <= min(toA, toB)
      const maxFrom = targetFrom > existingFrom ? targetFrom : existingFrom;
      const minTo = targetTo < existingTo ? targetTo : existingTo;

      if (maxFrom <= minTo) {
        return {
          hasConflict: true,
          conflictingRuleId: existing.id,
          message: `Date range conflict: Existing ${existing.version} (${existingFrom} to ${existing.effectiveTo || 'present'}) overlaps with new rule period (${targetFrom} to ${targetRule.effectiveTo || 'present'}).`
        };
      }
    }

    return { hasConflict: false };
  }
}
