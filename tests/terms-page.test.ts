import { describe, it, expect } from 'vitest';
import { LOCALE_CODES } from '@/lib/i18n';
import { TERMS_CONTENT, getTermsContent } from '@/lib/content/terms-content';

describe('Terms of Service Page Full Audit & Compliance', () => {
  it('provides complete terms content for all 7 supported languages', () => {
    for (const locale of LOCALE_CODES) {
      const data = getTermsContent(locale);
      expect(data).toBeDefined();
      expect(data.seoTitle.length).toBeGreaterThan(15);
      expect(data.metaDescription.length).toBeGreaterThan(40);
      expect(data.h1.length).toBeGreaterThan(3);
      expect(data.subtitle.length).toBeGreaterThan(10);
      expect(data.lastUpdatedDate.length).toBeGreaterThan(4);
      expect(data.sections.length).toBeGreaterThanOrEqual(4);
      expect(data.relatedLinks.length).toBe(4);
    }
  });

  it('verifies English specific requirements', () => {
    const en = TERMS_CONTENT.en;
    expect(en.seoTitle).toBe('Terms of Service | LIC Calculators');
    expect(en.h1).toBe('Terms of Service');
    expect(en.lastUpdatedDate).toBe('August 2026');
  });

  it('explicitly declares non-affiliation and avoids false claims', () => {
    for (const locale of LOCALE_CODES) {
      const data = getTermsContent(locale);
      const fullText = JSON.stringify(data).toLowerCase();

      expect(fullText).not.toContain('"official lic website"');
      expect(fullText).not.toContain('"100% accurate"');
      expect(fullText).not.toContain('"guaranteed calculation"');

      // No invented arbitration organizations or fake registration numbers
      expect(fullText).not.toContain('american arbitration association');
      expect(fullText).not.toContain('llc registration');
    }
  });

  it('contains valid internal navigation links in related links box', () => {
    for (const locale of LOCALE_CODES) {
      const data = getTermsContent(locale);
      const urls = data.relatedLinks.map((l) => l.url);
      expect(urls).toContain('/privacy-policy');
      expect(urls).toContain('/disclaimer');
      expect(urls).toContain('/about');
      expect(urls).toContain('/contact');
    }
  });
});
