import { describe, it, expect } from 'vitest';
import { LOCALE_CODES } from '@/lib/i18n';
import { ABOUT_CONTENT, getAboutContent } from '@/lib/content/about-content';
import { VERIFIED_AUTHORS } from '@/lib/editorial/authors';

describe('About Page Full Audit & E-E-A-T Compliance', () => {
  it('provides complete about content for all 7 supported languages', () => {
    for (const locale of LOCALE_CODES) {
      const data = getAboutContent(locale);
      expect(data).toBeDefined();
      expect(data.seoTitle.length).toBeGreaterThan(15);
      expect(data.metaDescription.length).toBeGreaterThan(40);
      expect(data.h1.length).toBeGreaterThan(3);
      expect(data.subtitle.length).toBeGreaterThan(10);
      expect(data.pillars.length).toBe(4);
      expect(data.sections.length).toBeGreaterThanOrEqual(2);
      expect(data.relatedLinks.length).toBe(4);
    }
  });

  it('verifies English specific requirements', () => {
    const en = ABOUT_CONTENT.en;
    expect(en.seoTitle).toBe('About LIC Calculators | Independent Financial Tools');
    expect(en.h1).toBe('About LIC Calculators');
  });

  it('accurately distinguishes deterministic calculations from AI educational layer', () => {
    const en = ABOUT_CONTENT.en;
    const fullText = JSON.stringify(en);

    expect(fullText).toContain('Deterministic Calculation Engine');
    expect(fullText).toContain('AI is NOT the calculation engine');
    expect(fullText).toContain('IRDAI Master Circulars');
  });

  it('verifies verified real authors are properly defined and valid', () => {
    expect(VERIFIED_AUTHORS.length).toBeGreaterThanOrEqual(3);
    const leadActuary = VERIFIED_AUTHORS.find((a) => a.slug === 'naveen-chaudhary');
    expect(leadActuary).toBeDefined();
    expect(leadActuary?.name).toBe('Naveen Chaudhary');
    expect(leadActuary?.qualifications).toContain('Fellow of Institute of Actuaries of India (FIAI)');
  });

  it('contains valid internal navigation links in related links box', () => {
    for (const locale of LOCALE_CODES) {
      const data = getAboutContent(locale);
      const urls = data.relatedLinks.map((l) => l.url.replace(/\/$/, ''));
      expect(urls).toContain('/calculators');
      expect(urls).toContain('/disclaimer');
      expect(urls).toContain('/privacy-policy');
      expect(urls).toContain('/terms');
    }
  });
});
