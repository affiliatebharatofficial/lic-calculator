import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/calculators/loan';

describe('POST /api/calculators/loan Endpoint', () => {
  it('calculates policy loan capacity and interest for in-force policy on Table 914', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/loan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 914,
        surrenderValue: 200000,
        isPolicyInForce: true
      })
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.calculatorId).toBe('lic-loan-calculator');
    expect(json.data.primaryAmount.paise).toBe(18000000); // ₹1,80,000 (90%)
    expect(json.data.result.annualInterestAmount.paise).toBe(1710000); // 9.5%
    expect(json.data.result.semiAnnualInterestAmount.paise).toBe(855000);
  });
});
