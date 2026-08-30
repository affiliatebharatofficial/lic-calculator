import { describe, it, expect } from 'vitest';
import { getHreflangList, LOCALE_CODES } from '@/lib/i18n';

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
});
