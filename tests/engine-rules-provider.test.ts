import { describe, it, expect } from 'vitest';
import {
  InMemoryRuleProvider,
  SYNTHETIC_PREMIUM_RULE_914,
  SYNTHETIC_SURRENDER_RULE_914,
  type SyntheticPremiumRuleData
} from '@/lib/calculators';

describe('Rule Provider Abstraction & Versioning Engine', () => {
  it('retrieves active rules by planCode and ruleType', () => {
    const provider = new InMemoryRuleProvider();
    provider.registerRule(SYNTHETIC_PREMIUM_RULE_914);

    const rule = provider.getRuleSync<SyntheticPremiumRuleData>({
      planCode: '914',
      ruleType: 'premium_rules',
      asOfDate: '2024-05-15'
    });

    expect(rule).not.toBeNull();
    expect(rule?.version.planCode).toBe('914');
    expect(rule?.data.baseRatePerThousand).toBe(49.70);
  });

  it('returns null when rule is not found or expired', () => {
    const provider = new InMemoryRuleProvider();
    provider.registerRule(SYNTHETIC_SURRENDER_RULE_914);

    // Unknown plan
    expect(
      provider.getRuleSync({
        planCode: '999',
        ruleType: 'surrender_rules',
        asOfDate: '2024-05-15'
      })
    ).toBeNull();

    // Date before effectiveFrom (2020-01-01)
    expect(
      provider.getRuleSync({
        planCode: '914',
        ruleType: 'surrender_rules',
        asOfDate: '2015-01-01'
      })
    ).toBeNull();
  });

  it('supports explicit version override', () => {
    const provider = new InMemoryRuleProvider();
    provider.registerRule(SYNTHETIC_PREMIUM_RULE_914);

    const match = provider.getRuleSync({
      planCode: '914',
      ruleType: 'premium_rules',
      version: 'SYNTHETIC_2024.1'
    });

    expect(match?.version.version).toBe('SYNTHETIC_2024.1');
  });
});
