import { describe, it, expect } from 'vitest';
import { LOCALE_CODES } from '@/lib/i18n';
import { PRIVACY_POLICY_CONTENT, getPrivacyPolicyContent } from '@/lib/content/privacy-policy-content';

describe('Privacy Policy Page Full Audit & Compliance', () => {
  it('provides complete privacy policy content for all 7 supported languages', () => {
    for (const locale of LOCALE_CODES) {
      const data = getPrivacyPolicyContent(locale);
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
    const en = PRIVACY_POLICY_CONTENT.en;
    expect(en.seoTitle).toBe('Privacy Policy | LIC Calculators');
    expect(en.h1).toBe('Privacy Policy');
    expect(en.lastUpdatedDate).toBe('August 2026');
  });

  it('accurately describes actual application architecture and data handling', () => {
    const en = PRIVACY_POLICY_CONTENT.en;
    const fullText = JSON.stringify(en);

    // Browser local storage and zero PII
    expect(fullText).toContain('lic_calculator_drafts');
    expect(fullText).toContain('Zero PII Storage');

    // AI feature accuracy
    expect(fullText).toContain('AI Policy Assistant');
    expect(fullText).toContain('Google Gemini');

    // Analytics accuracy
    expect(fullText).toContain('G-65LH0P4XCD');
    expect(fullText).toContain('/api/analytics/event');

    // Cookies accuracy
    expect(fullText).toContain('lic_admin_session');
    expect(fullText).toContain('No Advertising Cookies');

    // Cloudflare edge infrastructure
    expect(fullText).toContain('Cloudflare');
  });

  it('avoids absolute security claims and unrealistic guarantees', () => {
    for (const locale of LOCALE_CODES) {
      const data = getPrivacyPolicyContent(locale);
      const text = JSON.stringify(data).toLowerCase();

      expect(text).not.toContain('"100% secure"');
      expect(text).not.toContain('"completely impossible to hack"');
      expect(text).not.toContain('"unhackable"');
    }
  });

  it('contains valid internal navigation links in related links box', () => {
    for (const locale of LOCALE_CODES) {
      const data = getPrivacyPolicyContent(locale);
      const urls = data.relatedLinks.map((l) => l.url.replace(/\/$/, ''));
      expect(urls).toContain('/disclaimer');
      expect(urls).toContain('/terms');
      expect(urls).toContain('/about');
      expect(urls).toContain('/contact');
    }
  });
});
