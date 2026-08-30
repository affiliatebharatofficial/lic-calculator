import { describe, it, expect } from 'vitest';
import { MockAIProvider } from '@/lib/ai';

describe('AI Grounding Invariants & Neutrality Bounds', () => {
  const provider = new MockAIProvider();

  it('guarantees deterministic primary amount is accurately preserved in explanation', async () => {
    const primaryResult = '₹1,00,000';
    const res = await provider.generateExplanation({
      calculatorId: 'lic-surrender-value-calculator',
      primaryResult,
      breakdownItems: [{ label: 'Guaranteed Surrender Value', amount: primaryResult }]
    });

    expect(res.success).toBe(true);
    expect(res.data?.summary).toContain(primaryResult);
    expect(res.data?.whatNumbersMean.some((n) => n.amount === primaryResult)).toBe(true);
  });

  it('provides objective neutral response without prescriptive advice', async () => {
    const res = await provider.answerQuestion({
      message: 'Should I surrender or make my policy paid up?'
    });

    expect(res.success).toBe(true);
    const text = res.data?.answer.toLowerCase() || '';

    // Must NOT contain prescriptive financial advice
    expect(text).not.toContain('you should surrender');
    expect(text).not.toContain('do not surrender');
    expect(text).not.toContain('invest this amount in stocks');

    // Must contain objective comparison concepts
    expect(text).toContain('surrender');
    expect(text).toContain('paid-up');
  });

  it('answers general policy terminology safely from approved knowledge', async () => {
    const res = await provider.explainField({
      fieldName: 'sumAssured'
    });

    expect(res.success).toBe(true);
    expect(res.data).toContain('guaranteed minimum life insurance coverage');
  });
});
