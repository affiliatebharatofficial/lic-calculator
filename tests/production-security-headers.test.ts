import { describe, it, expect } from 'vitest';
import { getSecurityHeaders, CacheControlManager } from '@/lib/security';

describe('Production Security Headers & Edge Cache Control', () => {
  it('generates strict security headers with HSTS and CSP', () => {
    const headers = getSecurityHeaders() as Record<string, string>;

    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Strict-Transport-Security']).toContain('max-age=63072000');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
  });

  it('enforces DENY framing on admin namespace', () => {
    const adminHeaders = getSecurityHeaders({ isAdmin: true }) as Record<string, string>;
    expect(adminHeaders['X-Frame-Options']).toBe('DENY');
    expect(adminHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  });

  it('generates public edge caching headers for deterministic calculations', () => {
    const etag = CacheControlManager.generateETag({ tableNo: 914, premium: 25000 });
    const cacheHeaders = CacheControlManager.getPublicCalculatorCacheHeaders(etag);

    expect(cacheHeaders['Cache-Control']).toContain('public');
    expect(cacheHeaders['Cache-Control']).toContain('s-maxage=86400');
    expect(cacheHeaders['ETag']).toBe(`"${etag}"`);
  });

  it('generates private non-cacheable headers for admin and AI', () => {
    const noCacheHeaders = CacheControlManager.getPrivateNoCacheHeaders();
    expect(noCacheHeaders['Cache-Control']).toBe('no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    expect(noCacheHeaders['Pragma']).toBe('no-cache');
  });
});
