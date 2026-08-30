import { describe, it, expect } from 'vitest';
import { RequestInputValidator } from '@/lib/security';

describe('Strict API Input & Protocol Validation', () => {
  it('validates HTTP method and rejects unauthorized verbs', () => {
    const postReq = new Request('https://lic-calculators.com/api/calculators/surrender', { method: 'POST' });
    const getReq = new Request('https://lic-calculators.com/api/calculators/surrender', { method: 'GET' });

    expect(RequestInputValidator.validateMethod(postReq, 'POST').valid).toBe(true);

    const getRes = RequestInputValidator.validateMethod(getReq, 'POST');
    expect(getRes.valid).toBe(false);
    expect(getRes.statusCode).toBe(405);
  });

  it('validates JSON Content-Type header', () => {
    const validReq = new Request('https://lic-calculators.com/api/calculators/premium', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });

    const invalidReq = new Request('https://lic-calculators.com/api/calculators/premium', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' }
    });

    expect(RequestInputValidator.validateJsonContentType(validReq).valid).toBe(true);

    const invalidRes = RequestInputValidator.validateJsonContentType(invalidReq);
    expect(invalidRes.valid).toBe(false);
    expect(invalidRes.statusCode).toBe(415);
  });
});
