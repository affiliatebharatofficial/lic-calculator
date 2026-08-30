import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter } from '@/lib/ai';

describe('AI Server-Side Rate Limiter', () => {
  const testIp = '192.168.1.100';

  beforeEach(() => {
    RateLimiter.reset(testIp);
  });

  it('allows requests within configured threshold', () => {
    const config = { maxRequests: 3, windowMs: 10000 };

    const first = RateLimiter.check(testIp, config);
    expect(first.isAllowed).toBe(true);
    expect(first.remaining).toBe(2);

    const second = RateLimiter.check(testIp, config);
    expect(second.isAllowed).toBe(true);
    expect(second.remaining).toBe(1);

    const third = RateLimiter.check(testIp, config);
    expect(third.isAllowed).toBe(true);
    expect(third.remaining).toBe(0);

    const fourth = RateLimiter.check(testIp, config);
    expect(fourth.isAllowed).toBe(false);
    expect(fourth.remaining).toBe(0);
    expect(fourth.resetInMs).toBeGreaterThan(0);
  });

  it('isolates rate limits between distinct client identifiers', () => {
    const config = { maxRequests: 1, windowMs: 10000 };

    const clientA = RateLimiter.check('ip_a', config);
    expect(clientA.isAllowed).toBe(true);

    const clientA_second = RateLimiter.check('ip_a', config);
    expect(clientA_second.isAllowed).toBe(false);

    // Client B must still be allowed
    const clientB = RateLimiter.check('ip_b', config);
    expect(clientB.isAllowed).toBe(true);
  });
});
