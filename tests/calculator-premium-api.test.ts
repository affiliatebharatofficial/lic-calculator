import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/calculators/premium';

describe('POST /api/calculators/premium Endpoint', () => {
  it('calculates premium for valid input on verified Table 914', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 914,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly',
        includeAccidentalRider: false
      })
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.calculatorId).toBe('lic-premium-calculator');
    expect(json.data.primaryAmount.paise).toBe(2468081); // ₹24,680.81
    expect(json.data.breakdown.items.length).toBeGreaterThan(2);
    expect(json.data.ruleVersion.version).toBe('SYNTHETIC_2024.1');
  });

  it('safely rejects unverified plan (e.g. Table 915 pending verification)', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 915,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly'
      })
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.message).toContain("We don't currently have a verified rule set");
  });

  it('rejects invalid inputs with 422 and structured field errors', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 914,
        age: 75, // Outside age boundary
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly'
      })
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(422);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.fieldErrors?.length).toBeGreaterThan(0);
  });
});
