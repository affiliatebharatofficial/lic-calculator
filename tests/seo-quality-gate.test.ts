import { describe, it, expect } from 'vitest';
import { SEOQualityGate } from '@/lib/seo';

describe('Automated SEO & Content Quality Gate', () => {
  it('passes compliant financial guide with author, sources and sufficient word count', () => {
    const res = SEOQualityGate.evaluate({
      title: 'What is LIC Surrender Value? Complete Calculation Guide',
      description: 'Understand how LIC policy surrender value is calculated with verified GSV and SSV factor rules.',
      canonicalUrl: 'https://lic-calculators.com/guides/what-is-lic-surrender-value',
      contentType: 'guide',
      contentBody: 'This is a comprehensive guide explaining how LIC surrender value is calculated... '.repeat(40), // 320+ words
      authorId: 'naveen-chaudhary',
      reviewerId: 'ananya-deshmukh',
      sourceIds: ['src_lic_914_doc'],
      inboundLinkCount: 3
    });

    expect(res.passed).toBe(true);
    expect(res.errors.length).toBe(0);
    expect(res.scorePercent).toBeGreaterThanOrEqual(90);
    expect(res.isOrphan).toBe(false);
  });

  it('fails thin content guide lacking words or missing author', () => {
    const res = SEOQualityGate.evaluate({
      title: 'Short Guide',
      description: 'Short desc',
      canonicalUrl: 'https://lic-calculators.com/guides/short',
      contentType: 'guide',
      contentBody: 'Too short text.',
      inboundLinkCount: 0
    });

    expect(res.passed).toBe(false);
    expect(res.errors.some((e) => e.includes('Thin content detected'))).toBe(true);
    expect(res.errors.some((e) => e.includes('assigned author profile'))).toBe(true);
    expect(res.isOrphan).toBe(true);
  });
});
