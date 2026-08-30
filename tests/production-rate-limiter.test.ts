import { describe, it, expect, beforeEach } from 'vitest';
import { GlobalRateLimiter } from '@/lib/security';

describe('Production Global Sliding Window Rate Limiter', () => {
  beforeEach(() => {
    GlobalRateLimiter.clear();
  });

  it('allows requests within AI quota and blocks when quota is exceeded', () => {
    const clientKey = '192.168.1.50';

    // AI limit is 10 requests / 60s
    for (let i = 0; i < 10; i++) {
      const res = GlobalRateLimiter.check('ai', clientKey);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(9 - i);
    }

    // 11th request should be blocked
    const blockedRes = GlobalRateLimiter.check('ai', clientKey);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.retryAfter).toBeGreaterThan(0);
  });

  it('enforces separate rate limit quotas for different clients', () => {
    const clientA = '10.0.0.1';
    const clientB = '10.0.0.2';

    // Exhaust client A's admin login attempts (5 limit)
    for (let i = 0; i < 5; i++) {
      GlobalRateLimiter.check('admin_login', clientA);
    }
    expect(GlobalRateLimiter.check('admin_login', clientA).allowed).toBe(false);

    // Client B must still have quota
    expect(GlobalRateLimiter.check('admin_login', clientB).allowed).toBe(true);
  });
});
