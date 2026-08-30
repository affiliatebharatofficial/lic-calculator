import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/calculators/bonus';

describe('POST /api/calculators/bonus Endpoint', () => {
  it('calculates bonus accruals for verified Table 914', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20
      })
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.calculatorId).toBe('lic-bonus-calculator');
    expect(json.data.primaryAmount.paise).toBe(45500000); // ₹4,55,000
    expect(json.data.result.totalReversionaryBonus.paise).toBe(42000000);
    expect(json.data.result.finalAdditionalBonus.paise).toBe(3500000);
  });
});
