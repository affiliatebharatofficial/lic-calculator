import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/calculators/maturity';

describe('POST /api/calculators/maturity Endpoint', () => {
  it('calculates maturity proceeds for verified Table 914', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/maturity', {
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
    expect(json.data.calculatorId).toBe('lic-maturity-calculator');
    expect(json.data.primaryAmount.paise).toBe(95500000); // ₹9,55,000
    expect(json.data.breakdown.items.length).toBe(3);
  });
});
