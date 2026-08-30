import { describe, it, expect } from 'vitest';
import {
  CALCULATOR_REGISTRY,
  ENGINES,
  InMemoryRuleProvider,
  SYNTHETIC_PREMIUM_RULE_914
} from '@/lib/calculators';

describe('Calculator Engine & Architecture', () => {
  it('registers all standard calculator definitions', () => {
    expect(CALCULATOR_REGISTRY['premium']).toBeDefined();
    expect(CALCULATOR_REGISTRY['maturity']).toBeDefined();
    expect(CALCULATOR_REGISTRY['bonus']).toBeDefined();
    expect(CALCULATOR_REGISTRY['surrender-value']).toBeDefined();
    expect(CALCULATOR_REGISTRY['surrender-loss']).toBeDefined();
    expect(CALCULATOR_REGISTRY['loan']).toBeDefined();
  });

  it('validates input in PremiumCalculator', () => {
    const engine = ENGINES.premium;
    const valid = engine.validate({
      planTableNo: 914,
      age: 30,
      policyTerm: 20,
      sumAssured: 500000,
      premiumFrequency: 'yearly'
    });
    expect(valid.isValid).toBe(true);

    const invalid = engine.validate({
      age: 'not-a-number'
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  it('retrieves versioned rules via RuleProvider abstraction', async () => {
    const provider = new InMemoryRuleProvider();
    provider.registerRule(SYNTHETIC_PREMIUM_RULE_914);

    const rule = await provider.getRule({
      planCode: '914',
      ruleType: 'premium_rules',
      asOfDate: '2024-06-01'
    });

    expect(rule).toBeDefined();
    expect(rule?.version.version).toBe('SYNTHETIC_2024.1');
  });

  it('executes deterministic calculation following strict interface', async () => {
    const engine = ENGINES.premium;
    const provider = new InMemoryRuleProvider();
    provider.registerRule(SYNTHETIC_PREMIUM_RULE_914);

    const rule = await provider.getRule({
      planCode: '914',
      ruleType: 'premium_rules',
      asOfDate: '2024-06-01'
    });

    expect(rule).not.toBeNull();
    if (!rule) return;

    const result = engine.calculate(
      {
        planTableNo: 914,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly'
      },
      rule as any
    );

    expect(result.calculatorId).toBe('lic-premium-calculator');
    expect(result.currency).toBe('INR');
    expect(result.primaryAmount.paise).toBeGreaterThan(0);
    expect(result.breakdown.items.length).toBeGreaterThan(0);
  });
});
