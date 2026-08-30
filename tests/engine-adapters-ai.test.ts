import { describe, it, expect } from 'vitest';
import {
  ENGINES,
  InMemoryRuleProvider,
  SYNTHETIC_PREMIUM_RULE_914,
  executeCalculatorApi,
  sanitizeResultForAi
} from '@/lib/calculators';

describe('Safe API & AI Adapter Boundaries', () => {
  const provider = new InMemoryRuleProvider();
  provider.registerRule(SYNTHETIC_PREMIUM_RULE_914);

  it('executes calculator via API adapter pipeline successfully', async () => {
    const response = await executeCalculatorApi(
      ENGINES.premium,
      provider,
      {
        planTableNo: 914,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly'
      },
      {
        planCode: '914',
        ruleType: 'premium_rules'
      }
    );

    expect(response.success).toBe(true);
    expect(response.data?.calculatorId).toBe('lic-premium-calculator');
  });

  it('returns structured validation errors without crashing', async () => {
    const response = await executeCalculatorApi(
      ENGINES.premium,
      provider,
      {
        planTableNo: 914,
        age: -5, // invalid
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly'
      },
      {
        planCode: '914',
        ruleType: 'premium_rules'
      }
    );

    expect(response.success).toBe(false);
    expect(response.errors).toBeDefined();
    expect(response.errors?.length).toBeGreaterThan(0);
  });

  it('sanitizes calculation result and enforces AI boundary prompt instruction', () => {
    const result = ENGINES.premium.calculate(
      {
        planTableNo: 914,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly'
      },
      SYNTHETIC_PREMIUM_RULE_914
    );

    const aiPayload = sanitizeResultForAi(result);

    expect(aiPayload.calculatorId).toBe('lic-premium-calculator');
    expect(aiPayload.primaryCalculatedAmount).toBe('₹24,681');
    expect(aiPayload.lineItems.length).toBeGreaterThan(0);
    expect(aiPayload.systemPromptInstruction).toContain('CRITICAL FINANCIAL BOUNDARY');
    expect(aiPayload.systemPromptInstruction).toContain('MUST NOT alter, recalculate, or contradict');
  });
});
