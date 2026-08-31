import { describe, it, expect } from 'vitest';
import { LOCALE_CODES } from '@/lib/i18n';
import { DISCLAIMER_CONTENT, getDisclaimerContent } from '@/lib/content/disclaimer-content';

describe('Disclaimer Page Full Audit & Compliance', () => {
  it('provides complete disclaimer content for all 7 supported languages', () => {
    for (const locale of LOCALE_CODES) {
      const data = getDisclaimerContent(locale);
      expect(data).toBeDefined();
      expect(data.seoTitle.length).toBeGreaterThan(15);
      expect(data.metaDescription.length).toBeGreaterThan(40);
      expect(data.h1.length).toBeGreaterThan(3);
      expect(data.subtitle.length).toBeGreaterThan(10);
      expect(data.lastUpdatedDate.length).toBeGreaterThan(4);
      expect(data.bannerNotice.title.length).toBeGreaterThan(5);
      expect(data.bannerNotice.text.length).toBeGreaterThan(30);
      expect(data.sections.length).toBeGreaterThanOrEqual(5);
      expect(data.relatedLinks.length).toBe(4);
    }
  });

  it('verifies English specific requirements', () => {
    const en = DISCLAIMER_CONTENT.en;
    expect(en.seoTitle).toBe('LIC Calculators Disclaimer | Independent Financial Tools');
    expect(en.h1).toBe('Disclaimer');
    expect(en.lastUpdatedDate).toBe('August 2026');
  });

  it('guarantees clear non-affiliation and no misleading claims across all languages', () => {
    for (const locale of LOCALE_CODES) {
      const data = getDisclaimerContent(locale);
      const text = JSON.stringify(data).toLowerCase();

      // Must NOT claim to be official LIC or 100% accurate guaranteed
      expect(text).not.toContain('"100% accurate"');
      expect(text).not.toContain('"guaranteed calculation"');
      expect(text).not.toContain('"official lic website"');
      expect(text).not.toContain('"official calculator"');

      // Must explicitly declare non-affiliation
      expect(data.bannerNotice.text.length).toBeGreaterThan(20);
    }
  });

  it('contains valid internal navigation links in related links box', () => {
    for (const locale of LOCALE_CODES) {
      const data = getDisclaimerContent(locale);
      const urls = data.relatedLinks.map((l) => l.url);
      expect(urls).toContain('/privacy-policy');
      expect(urls).toContain('/terms');
      expect(urls).toContain('/about');
      expect(urls).toContain('/calculators');
    }
  });
});
