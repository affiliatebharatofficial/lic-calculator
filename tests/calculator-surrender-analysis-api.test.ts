import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/calculators/surrender-analysis';

describe('POST /api/calculators/surrender-analysis Endpoint', () => {
  it('executes full surrender analysis with D1 integration for Table 914', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/surrender-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 5,
        totalPremiumsPaid: 125000,
        annualPremium: 25000,
        accruedBonus: 0
      })
    });

    const response = await POST({ request, locals: {} } as any);
    const json = await response.json();
    if (response.status !== 200) {
      console.error('API Error Response:', JSON.stringify(json));
    }
    expect(response.status).toBe(200);

    expect(json.success).toBe(true);
    expect(json.data.calculatorId).toBe('lic-surrender-analysis');
    expect(json.data.result.eligibility.isEligible).toBe(true);
    expect(json.data.result.surrenderCalculation.payableSurrenderValue.paise).toBe(6875000);
    expect(json.data.result.decisionComparison.surrenderNow).toBeDefined();
    expect(json.data.result.decisionComparison.makePaidUp).toBeDefined();
    expect(json.data.result.decisionComparison.continuePolicy).toBeDefined();
    expect(json.data.result.timelineMilestones.length).toBe(4);
  });

  it('safely rejects unverified plans with 404 and clear explanation', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/surrender-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 915, // Unverified
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 5,
        totalPremiumsPaid: 125000
      })
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.message).toContain("We don't currently have a verified rule set");
  });
});
