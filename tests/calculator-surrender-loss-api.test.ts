import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/calculators/surrender-loss';

describe('POST /api/calculators/surrender-loss Endpoint', () => {
  it('calculates surrender loss difference and includes 3-way decision comparison', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/surrender-loss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 914,
        sumAssured: 500000,
        policyTerm: 20,
        completedYears: 5,
        totalPremiumsPaid: 125000,
        annualPremium: 25000
      })
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.calculatorId).toBe('lic-surrender-loss-calculator');
    expect(json.data.primaryAmount.paise).toBe(5625000); // ₹56,250
    expect(json.data.result.lossPercentageNumber).toBe(45);

    // Assert 3-way decision comparison projection is returned
    expect(json.data.comparison).toBeDefined();
    expect(json.data.comparison.surrender.immediateCashPayout.paise).toBe(6875000);
    expect(json.data.comparison.paidUp.reducedLifeCover.paise).toBe(12500000);
    expect(json.data.comparison.continuePolicy.totalProjectedMaturity.paise).toBe(95500000);
  });
});
