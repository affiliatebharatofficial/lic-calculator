import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/calculators/surrender';

describe('POST /api/calculators/surrender Endpoint', () => {
  it('calculates surrender value (GSV vs SSV) for verified Table 914', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/surrender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 5,
        totalPremiumsPaid: 125000,
        accruedBonus: 0
      })
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.calculatorId).toBe('lic-surrender-value-calculator');
    expect(json.data.primaryAmount.paise).toBe(6875000); // ₹68,750 (SSV)
    expect(json.data.result.applicableRuleType).toBe('SSV');
  });

  it('returns ₹0 and warning for policy under 2 completed years', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/surrender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 1, // < 2 years
        totalPremiumsPaid: 25000
      })
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.primaryAmount.paise).toBe(0);
    expect(json.data.warnings.some((w: any) => w.code === 'INSUFFICIENT_DURATION')).toBe(true);
  });
});
