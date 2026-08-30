/**
 * Rule Conflict & Integrity Validation Utilities
 */

import type { RuleSetRow } from '../types';

export interface RuleConflictError {
  readonly code: 'OVERLAPPING_EFFECTIVE_DATES' | 'OVERLAPPING_POLICY_YEARS' | 'DUPLICATE_VERSION' | 'MISSING_SOURCE' | 'INVALID_JSON';
  readonly message: string;
  readonly conflictingRuleId?: string;
}

/**
 * Checks if two date ranges [startA, endA] and [startB, endB] overlap.
 * Null endDate denotes unbounded future ("infinity").
 */
export function doDateRangesOverlap(
  startA: string,
  endA: string | null | undefined,
  startB: string,
  endB: string | null | undefined
): boolean {
  const aEnd = endA || '9999-12-31';
  const bEnd = endB || '9999-12-31';

  return startA <= bEnd && startB <= aEnd;
}

/**
 * Checks if two policy-year scopes [fromA, toA] and [fromB, toB] overlap.
 */
export function doPolicyYearRangesOverlap(
  fromA: number | null | undefined,
  toA: number | null | undefined,
  fromB: number | null | undefined,
  toB: number | null | undefined
): boolean {
  const aStart = fromA ?? 1;
  const aEnd = toA ?? 999;
  const bStart = fromB ?? 1;
  const bEnd = toB ?? 999;

  return aStart <= bEnd && bStart <= aEnd;
}

/**
 * Validates a candidate rule set against existing active rule sets for conflicts.
 */
export function validateRuleSetConflict(
  candidate: Partial<RuleSetRow>,
  existingRules: readonly RuleSetRow[]
): RuleConflictError[] {
  const errors: RuleConflictError[] = [];

  // 1. Mandatory Source Reference
  if (!candidate.source_reference || candidate.source_reference.trim().length < 3) {
    errors.push({
      code: 'MISSING_SOURCE',
      message: 'Rule set must contain a valid, non-empty source reference or circular citation.'
    });
  }

  // 2. Validate JSON Payload
  if (candidate.rule_payload_json) {
    try {
      JSON.parse(candidate.rule_payload_json);
    } catch {
      errors.push({
        code: 'INVALID_JSON',
        message: 'Rule payload must be a valid JSON string.'
      });
    }
  }

  // 3. Check for Version and Overlap conflicts
  for (const existing of existingRules) {
    // Only compare rules for identical plan, variant, and calculator_type
    if (
      existing.plan_id === candidate.plan_id &&
      existing.calculator_type_id === candidate.calculator_type_id &&
      (existing.variant_id ?? null) === (candidate.variant_id ?? null)
    ) {
      // Duplicate version check
      if (existing.version === candidate.version && existing.id !== candidate.id) {
        errors.push({
          code: 'DUPLICATE_VERSION',
          message: `Rule version "${candidate.version}" already exists for this plan and calculator type.`,
          conflictingRuleId: existing.id
        });
      }

      // Overlapping active effective date and policy year check
      if (
        candidate.status === 'active' &&
        existing.status === 'active' &&
        existing.id !== candidate.id
      ) {
        const datesOverlap = doDateRangesOverlap(
          candidate.effective_from || '2024-01-01',
          candidate.effective_to,
          existing.effective_from,
          existing.effective_to
        );

        const policyYearsOverlap = doPolicyYearRangesOverlap(
          candidate.policy_year_from,
          candidate.policy_year_to,
          existing.policy_year_from,
          existing.policy_year_to
        );

        if (datesOverlap && policyYearsOverlap) {
          errors.push({
            code: 'OVERLAPPING_EFFECTIVE_DATES',
            message: `Active rule overlaps with existing rule ID ${existing.id} between ${existing.effective_from} and ${existing.effective_to || 'unbounded'}.`,
            conflictingRuleId: existing.id
          });
        }
      }
    }
  }

  return errors;
}
