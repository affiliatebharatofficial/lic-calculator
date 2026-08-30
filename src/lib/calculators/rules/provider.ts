/**
 * Rule Provider Abstraction Engine
 * Decouples calculation engine from D1 database, memory caches, and API providers.
 */

import type { RuleVersion, RuleQuery } from '../types/rules';
import { compareISODates } from '../core/dates';

export interface RuleEntry<TData = unknown> {
  readonly version: RuleVersion;
  readonly data: TData;
}

export interface IRuleProvider {
  getRule<TData>(query: RuleQuery): Promise<RuleEntry<TData> | null>;
  getRuleSync<TData>(query: RuleQuery): RuleEntry<TData> | null;
}

export class InMemoryRuleProvider implements IRuleProvider {
  private readonly rules: Map<string, RuleEntry[]> = new Map();

  /**
   * Registers a rule entry into the in-memory provider.
   */
  public registerRule<TData>(entry: RuleEntry<TData>): void {
    const key = `${entry.version.planCode}::${entry.version.ruleType}`;
    const existing = this.rules.get(key) || [];
    existing.push(entry as RuleEntry);
    this.rules.set(key, existing);
  }

  /**
   * Synchronously queries for a matching rule entry by planCode, ruleType, and effective date / version.
   */
  public getRuleSync<TData>(query: RuleQuery): RuleEntry<TData> | null {
    const key = `${query.planCode}::${query.ruleType}`;
    const candidates = this.rules.get(key);
    if (!candidates || candidates.length === 0) {
      return null;
    }

    // 1. If explicit version is requested, match by version string
    if (query.version) {
      const match = candidates.find((c) => c.version.version === query.version);
      return (match as RuleEntry<TData>) || null;
    }

    // 2. Filter by calculation effective date (asOfDate)
    const asOf = query.asOfDate || new Date().toISOString().slice(0, 10);

    const activeRules = candidates.filter((c) => {
      if (c.version.status !== 'active') return false;

      // Must be >= effectiveFrom
      if (compareISODates(asOf, c.version.effectiveFrom) < 0) return false;

      // If effectiveTo is defined, must be <= effectiveTo
      if (c.version.effectiveTo && compareISODates(asOf, c.version.effectiveTo) > 0) return false;

      return true;
    });

    if (activeRules.length === 0) {
      return null;
    }

    // Return newest effectiveFrom
    activeRules.sort((a, b) => compareISODates(b.version.effectiveFrom, a.version.effectiveFrom));
    return activeRules[0] as RuleEntry<TData>;
  }

  /**
   * Asynchronous lookup conforming to IRuleProvider contract.
   */
  public async getRule<TData>(query: RuleQuery): Promise<RuleEntry<TData> | null> {
    return this.getRuleSync<TData>(query);
  }
}
