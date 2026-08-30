import { describe, it, expect } from 'vitest';
import { getLocalizedPath, detectLocaleFromPath, LOCALE_CODES, DEFAULT_LOCALE } from '@/lib/i18n';

describe('i18n Routing & URL Mapping', () => {
  it('preserves English as default without locale prefix', () => {
    expect(getLocalizedPath('/lic-surrender-analysis', 'en')).toBe('/lic-surrender-analysis');
    expect(getLocalizedPath('/', 'en')).toBe('/');
    expect(getLocalizedPath('/calculators', 'en')).toBe('/calculators');
  });

  it('generates correct prefixed path for all non-English languages', () => {
    const nonEnglish = LOCALE_CODES.filter((l) => l !== DEFAULT_LOCALE);
    expect(nonEnglish).toEqual(['hi', 'mr', 'gu', 'bn', 'ta', 'te']);

    for (const loc of nonEnglish) {
      expect(getLocalizedPath('/lic-surrender-analysis', loc)).toBe(`/${loc}/lic-surrender-analysis`);
      expect(getLocalizedPath('/lic-premium-calculator', loc)).toBe(`/${loc}/lic-premium-calculator`);
      expect(getLocalizedPath('/', loc)).toBe(`/${loc}`);
    }
  });

  it('switches seamlessly between localized equivalent paths without duplicate prefixes', () => {
    // Switching from Hindi to Tamil
    expect(getLocalizedPath('/hi/lic-surrender-analysis', 'ta')).toBe('/ta/lic-surrender-analysis');

    // Switching from Marathi to English
    expect(getLocalizedPath('/mr/lic-maturity-calculator', 'en')).toBe('/lic-maturity-calculator');

    // Switching from English to Bengali
    expect(getLocalizedPath('/lic-loan-calculator', 'bn')).toBe('/bn/lic-loan-calculator');
  });

  it('detects active locale accurately from pathname', () => {
    expect(detectLocaleFromPath('/')).toBe('en');
    expect(detectLocaleFromPath('/lic-surrender-analysis')).toBe('en');
    expect(detectLocaleFromPath('/hi/lic-surrender-analysis')).toBe('hi');
    expect(detectLocaleFromPath('/mr/calculators')).toBe('mr');
    expect(detectLocaleFromPath('/gu/plans')).toBe('gu');
    expect(detectLocaleFromPath('/bn')).toBe('bn');
    expect(detectLocaleFromPath('/ta/faq')).toBe('ta');
    expect(detectLocaleFromPath('/te/lic-bonus-calculator')).toBe('te');
  });
});
