import { describe, it, expect } from 'vitest';
import { POST as premiumPost } from '@/pages/api/calculators/premium';
import { POST as loanPost } from '@/pages/api/calculators/loan';

describe('Calculator API Security & Boundary Defenses', () => {
  it('handles malformed JSON payload without unhandled server exception', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ malformed json ::'
    });

    const response = await premiumPost({ request, locals: {} } as any);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('BAD_REQUEST');
  });

  it('resists SQL injection attempts in plan parameter safely', async () => {
    const sqlInjectionPayload = "914' OR '1'='1";
    const request = new Request('https://lic-calculators.com/api/calculators/premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: sqlInjectionPayload,
        age: 30,
        policyTerm: 20,
        sumAssured: 500000,
        premiumFrequency: 'yearly'
      })
    });

    const response = await premiumPost({ request, locals: {} } as any);
    // Should fail cleanly with 404/422 without SQL errors or leakage
    expect(response.status).toBeGreaterThanOrEqual(400);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.message).not.toContain('SQL');
    expect(json.error.message).not.toContain('syntax');
  });

  it('rejects oversized and negative numeric inputs cleanly', async () => {
    const request = new Request('https://lic-calculators.com/api/calculators/loan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTableNo: 914,
        surrenderValue: -50000 // Negative value
      })
    });

    const response = await loanPost({ request, locals: {} } as any);
    expect(response.status).toBe(422);

    const json = await response.json();
    expect(json.success).toBe(false);
  });
});
