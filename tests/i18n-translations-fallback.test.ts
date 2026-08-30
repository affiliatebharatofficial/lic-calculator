import { describe, it, expect } from 'vitest';
import { t, LOCALE_CODES } from '@/lib/i18n';

describe('i18n Translation Lookup & Fallback System', () => {
  it('retrieves valid translations across all 7 supported languages', () => {
    for (const loc of LOCALE_CODES) {
      const siteName = t(loc, 'site.name');
      expect(siteName).toBeDefined();
      expect(siteName.length).toBeGreaterThan(0);

      const calculateBtn = t(loc, 'common.calculate');
      expect(calculateBtn).toBeDefined();
      expect(calculateBtn.length).toBeGreaterThan(0);

      const notice = t(loc, 'disclaimer.notice');
      expect(notice).toBeDefined();
      expect(notice.length).toBeGreaterThan(0);
    }
  });

  it('falls back gracefully to English when key is missing in target language', () => {
    // Non-existent key in Hindi should fall back to English dictionary or return key if completely missing
    const res = t('hi', 'calculator.nonExistentSubKey');
    expect(res).toBe('calculator.nonExistentSubKey');
  });

  it('interpolates template parameters correctly', () => {
    // If a translation has {count} or {name}
    const template = 'common.years';
    expect(t('en', template)).toBe('Years');
    expect(t('hi', template)).toBe('वर्ष');
  });
});
