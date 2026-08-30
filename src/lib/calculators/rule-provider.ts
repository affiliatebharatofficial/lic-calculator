import type { BaseCalculatorRule, RuleSelectorCriteria } from '@/types/calculator';

export interface IRuleProvider {
  getApplicableRule(criteria: RuleSelectorCriteria): Promise<BaseCalculatorRule | null>;
  getAllRulesForPlan(planTableNo: string | number): Promise<BaseCalculatorRule[]>;
}

/**
 * Local Fallback Rule Provider
 * In Phase 1, provides mock rules for structural verification without fake financial assertions.
 */
export class LocalRuleProvider implements IRuleProvider {
  private rules: BaseCalculatorRule[] = [
    {
      id: 'rule-914-premium-v1',
      planTableNo: 914,
      ruleType: 'premium',
      version: '1.0.0',
      effectiveFrom: '2020-02-01',
      status: 'active',
      sourceReference: 'LIC Circular Table No. 914 (Phase 1 Baseline)',
      config: {
        minAge: 8,
        maxAge: 55,
        minTerm: 12,
        maxTerm: 35,
        minSumAssured: 100000
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'rule-914-surrender-v1',
      planTableNo: 914,
      ruleType: 'surrender-value',
      version: '1.0.0',
      effectiveFrom: '2020-02-01',
      status: 'active',
      sourceReference: 'LIC Special Surrender Value Guidelines',
      config: {
        minPaidYears: 2,
        guaranteedSurrenderDiscountRatio: 0.3
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  async getApplicableRule(criteria: RuleSelectorCriteria): Promise<BaseCalculatorRule | null> {
    const tableNo = Number(criteria.planTableNo);
    const rule = this.rules.find((r) => {
      const matchPlan = Number(r.planTableNo) === tableNo;
      const matchType = r.ruleType === criteria.ruleType;
      const matchStatus = r.status === 'active';
      return matchPlan && matchType && matchStatus;
    });

    return rule || null;
  }

  async getAllRulesForPlan(planTableNo: string | number): Promise<BaseCalculatorRule[]> {
    const tableNo = Number(planTableNo);
    return this.rules.filter((r) => Number(r.planTableNo) === tableNo);
  }
}
