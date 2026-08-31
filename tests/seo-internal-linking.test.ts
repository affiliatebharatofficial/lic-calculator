import { describe, it, expect } from 'vitest';
import { InternalLinkingEngine } from '@/lib/seo';

describe('Contextual Internal Linking Engine', () => {
  it('returns structured relevant links for pillar calculator paths', () => {
    const surrenderLinks = InternalLinkingEngine.getRelatedLinks('/lic-surrender-value-calculator');
    expect(surrenderLinks.length).toBeGreaterThanOrEqual(2);

    expect(surrenderLinks.some((l) => l.url.includes('/lic-surrender-loss-calculator'))).toBe(true);
    expect(surrenderLinks.some((l) => l.url.includes('/lic-surrender-analysis'))).toBe(true);
    expect(surrenderLinks.some((l) => l.url.includes('/guides/what-is-lic-surrender-value'))).toBe(true);
  });

  it('provides safe fallback links for unmapped routes', () => {
    const fallbackLinks = InternalLinkingEngine.getRelatedLinks('/some-random-unmapped-page');
    expect(fallbackLinks.length).toBeGreaterThan(0);
    expect(fallbackLinks[0]?.url.replace(/\/$/, '')).toBe('/lic-premium-calculator');
  });
});
