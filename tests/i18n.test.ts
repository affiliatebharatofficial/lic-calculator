import { describe, it, expect } from 'vitest';
import { t, getLocalizedPath, detectLocaleFromPath, LOCALE_CODES } from '../src/lib/i18n';

describe('i18n Utilities', () => {
  it('translates known keys in default locale (English)', () => {
    expect(t('en', 'site.name')).toBe('LIC Calculator');
    expect(t('en', 'nav.calculators')).toBe('Calculators');
  });

  it('translates known keys in Hindi, Marathi, Gujarati, etc.', () => {
    expect(t('hi', 'site.name')).toBe('एलआईसी कैलकुलेटर');
    expect(t('mr', 'site.name')).toBe('एलआयसी कॅल्क्युलेटर');
    expect(t('gu', 'site.name')).toBe('LIC કેલ્ક્યુલેટર');
    expect(t('bn', 'site.name')).toBe('LIC ক্যালকুলেটর');
    expect(t('ta', 'site.name')).toBe('LIC கால்குலேட்டர்');
    expect(t('te', 'site.name')).toBe('LIC కాలిక్యులేటర్');
  });

  it('falls back to default English when key is missing in localized dict', () => {
    expect(t('hi', 'site.tagline')).toBeDefined();
  });

  it('generates localized paths correctly', () => {
    expect(getLocalizedPath('/calculators', 'en')).toBe('/calculators');
    expect(getLocalizedPath('/calculators', 'hi')).toBe('/hi/calculators');
    expect(getLocalizedPath('/hi/calculators', 'mr')).toBe('/mr/calculators');
    expect(getLocalizedPath('/hi/calculators', 'en')).toBe('/calculators');
    expect(getLocalizedPath('/', 'gu')).toBe('/gu');
  });

  it('detects locale from URL pathname', () => {
    expect(detectLocaleFromPath('/hi/calculators')).toBe('hi');
    expect(detectLocaleFromPath('/mr/lic-premium-calculator')).toBe('mr');
    expect(detectLocaleFromPath('/calculators')).toBe('en');
    expect(detectLocaleFromPath('/')).toBe('en');
  });

  it('supports all 7 required locales', () => {
    expect(LOCALE_CODES).toEqual(['en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te']);
  });
});
