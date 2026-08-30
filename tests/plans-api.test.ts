import { describe, it, expect } from 'vitest';
import { GET } from '@/pages/api/plans';

describe('GET /api/plans Endpoint', () => {
  it('returns list of active plans with verified calculator capabilities', async () => {
    const request = new Request('https://lic-calculators.com/api/plans', {
      method: 'GET'
    });

    const response = await GET({ request, locals: {} } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeInstanceOf(Array);
    expect(json.data.length).toBeGreaterThanOrEqual(4);

    const plan914 = json.data.find((p: any) => p.planCode === '914');
    expect(plan914).toBeDefined();
    expect(plan914.hasVerifiedRules).toBe(true);
    expect(plan914.supportedCalculators).toContain('premium');
    expect(plan914.supportedCalculators).toContain('maturity');
    expect(plan914.supportedCalculators).toContain('surrender');
  });
});
