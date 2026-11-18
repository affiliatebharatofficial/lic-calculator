import { describe, it, expect } from 'vitest';
import { getHreflangList, getEnglishCanonicalUrl, isEnglishOnlyPath, LOCALE_CODES } from '@/lib/i18n';

describe('i18n SEO Hreflang & Canonical URL Generation', () => {
  it('generates complete hreflang list for all 7 languages plus x-default', () => {
    const currentPath = '/lic-surrender-analysis';
    const hreflangs = getHreflangList(currentPath);

    // 7 languages + 1 x-default = 8 entries
    expect(hreflangs.length).toBe(8);

    for (const loc of LOCALE_CODES) {
      const entry = hreflangs.find((h) => h.hreflang === loc);
      expect(entry).toBeDefined();
      if (loc === 'en') {
        expect(entry?.href).toBe('https://lic-calculators.com/lic-surrender-analysis');
      } else {
        expect(entry?.href).toBe(`https://lic-calculators.com/${loc}/lic-surrender-analysis`);
      }
    }

    const xDefault = hreflangs.find((h) => h.hreflang === 'x-default');
    expect(xDefault).toBeDefined();
    expect(xDefault?.href).toBe('https://lic-calculators.com/lic-surrender-analysis');
  });

  it('correctly strips existing locale prefix when generating hreflangs from a localized page', () => {
    const hindiPath = '/hi/lic-maturity-calculator';
    const hreflangs = getHreflangList(hindiPath);

    const mrEntry = hreflangs.find((h) => h.hreflang === 'mr');
    expect(mrEntry?.href).toBe('https://lic-calculators.com/mr/lic-maturity-calculator');

    const enEntry = hreflangs.find((h) => h.hreflang === 'en');
    expect(enEntry?.href).toBe('https://lic-calculators.com/lic-maturity-calculator');
  });

  it('restricts hreflang to en + x-default for English-only pages', () => {
    for (const p of ['/faq/', '/hi/faq/', '/plans/', '/mr/plans/', '/guides/', '/te/guides/', '/author/firoz-khan/', '/bn/author/firoz-khan/', '/contact/', '/gu/contact/correction/', '/editorial-policy/', '/hi/guides/lic-riders-decoded-accidental-vs-term/']) {
      const hreflangs = getHreflangList(p);
      expect(hreflangs.map((h) => h.hreflang).sort()).toEqual(['en', 'x-default']);
    }
  });

  it('keeps full hreflang for genuinely translated pages', () => {
    for (const p of ['/hi/lic-surrender-value-calculator/', '/mr/', '/ta/about/', '/gu/lic-plans/914-new-endowment-plan/']) {
      expect(getHreflangList(p).length).toBe(8);
    }
  });

  it('returns the English canonical only for localized copies of English-only pages', () => {
    expect(getEnglishCanonicalUrl('/hi/faq/')).toBe('https://lic-calculators.com/faq/');
    expect(getEnglishCanonicalUrl('/te/guides/lic-riders-decoded-accidental-vs-term/')).toBe(
      'https://lic-calculators.com/guides/lic-riders-decoded-accidental-vs-term/'
    );
    expect(getEnglishCanonicalUrl('/mr/contact/correction/')).toBe(
      'https://lic-calculators.com/contact/correction/'
    );
    expect(getEnglishCanonicalUrl('/faq/')).toBeNull();
    expect(getEnglishCanonicalUrl('/hi/lic-premium-calculator/')).toBeNull();
    expect(getEnglishCanonicalUrl('/hi/')).toBeNull();
    expect(getEnglishCanonicalUrl('/bn/lic-plans/914-new-endowment-plan/')).toBeNull();
  });

  it('classifies English-only paths on their de-localized form', () => {
    expect(isEnglishOnlyPath('/guides/lic-80c-old-vs-new-regime/')).toBe(true);
    expect(isEnglishOnlyPath('/hi/guides/')).toBe(true);
    expect(isEnglishOnlyPath('/guides/')).toBe(true);
    expect(isEnglishOnlyPath('/calculators/')).toBe(false);
    expect(isEnglishOnlyPath('/hi/calculators/')).toBe(false);
    expect(isEnglishOnlyPath('/glossary/')).toBe(false);
  });
});
