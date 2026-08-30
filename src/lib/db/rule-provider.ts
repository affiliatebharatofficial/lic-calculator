/**
 * D1-Backed Rule Provider Implementation
 * Implements IRuleProvider to supply verified, versioned rule sets from Cloudflare D1
 * to the deterministic Phase 3 calculation engines.
 */

import type { IRuleProvider, RuleEntry } from '../calculators/rules/provider';
import type { RuleQuery, RuleVersion } from '../calculators/types/rules';
import type { D1DatabaseLike } from './client';
import type { RuleSetRow } from './types';

export class D1RuleProvider implements IRuleProvider {
  private syncCache: Map<string, RuleEntry<any>> = new Map();

  constructor(private readonly db: D1DatabaseLike) {}

  /**
   * Asynchronously retrieves active, verified rule set from Cloudflare D1.
   */
  public async getRule<TData = unknown>(query: RuleQuery): Promise<RuleEntry<TData> | null> {
    const calculationDate = query.asOfDate || new Date().toISOString().split('T')[0] || '2024-01-01';
    const calculatorCode = this.mapRuleTypeToCalculatorCode(query.ruleType);
    const policyYear = 1; // Base default

    // Deterministic selection query
    const sql = `
      SELECT rs.*, ct.calculator_code, lp.plan_code
      FROM rule_sets rs
      JOIN calculator_types ct ON rs.calculator_type_id = ct.id
      JOIN lic_plans lp ON rs.plan_id = lp.id
      WHERE lp.plan_code = ?
        AND ct.calculator_code = ?
        AND rs.status = 'active'
        AND rs.verification_status = 'verified'
        AND rs.effective_from <= ?
        AND (rs.effective_to IS NULL OR rs.effective_to >= ?)
        AND (rs.policy_year_from IS NULL OR rs.policy_year_from <= ?)
        AND (rs.policy_year_to IS NULL OR rs.policy_year_to >= ?)
      ORDER BY rs.effective_from DESC, rs.version DESC
      LIMIT 1
    `;

    const stmt = this.db.prepare<RuleSetRow & { plan_code: string; calculator_code: string }>(sql);
    stmt.bind(query.planCode, calculatorCode, calculationDate, calculationDate, policyYear, policyYear);

    const row = await stmt.first();
    if (!row) {
      return null;
    }

    // If explicit version requested and doesn't match, return null
    if (query.version && row.version !== query.version) {
      return null;
    }

    try {
      const data = JSON.parse(row.rule_payload_json) as TData;
      const version: RuleVersion = {
        version: row.version,
        planCode: row.plan_code,
        ruleType: query.ruleType,
        effectiveFrom: row.effective_from,
        effectiveTo: row.effective_to || undefined,
        status: row.status === 'active' ? 'active' : 'draft',
        sourceReference: `${row.source_title} (${row.source_reference}) [${row.verification_status.toUpperCase()}]`
      };

      const entry: RuleEntry<TData> = {
        version,
        data
      };

      // Cache for synchronous access
      const cacheKey = this.getCacheKey(query);
      this.syncCache.set(cacheKey, entry);

      return entry;
    } catch {
      return null;
    }
  }

  /**
   * Synchronously retrieves a pre-cached or local rule entry.
   */
  public getRuleSync<TData = unknown>(query: RuleQuery): RuleEntry<TData> | null {
    const cacheKey = this.getCacheKey(query);
    const cached = this.syncCache.get(cacheKey);
    if (cached) {
      return cached as RuleEntry<TData>;
    }
    return null;
  }

  /**
   * Pre-populates the synchronous cache with a verified rule entry.
   */
  public preloadRule<TData>(query: RuleQuery, entry: RuleEntry<TData>): void {
    const cacheKey = this.getCacheKey(query);
    this.syncCache.set(cacheKey, entry);
  }

  private mapRuleTypeToCalculatorCode(ruleType: string): string {
    switch (ruleType) {
      case 'premium_rules':
        return 'premium';
      case 'maturity_rules':
        return 'maturity';
      case 'bonus_rules':
        return 'bonus';
      case 'surrender_rules':
        return 'surrender';
      case 'surrender_loss_rules':
        return 'surrender-loss';
      case 'loan_rules':
        return 'loan';
      case 'pension_rules':
        return 'pension';
      default:
        return ruleType.replace(/_rules$/, '');
    }
  }

  private getCacheKey(query: RuleQuery): string {
    return `${query.planCode}:${query.ruleType}:${query.asOfDate || 'current'}:${query.version || 'latest'}`;
  }
}
