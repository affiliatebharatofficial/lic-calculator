import { describe, it, expect } from 'vitest';
import { SUPPORTED_LOCALES, LOCALE_CODES, translations, t, getLocalizedPath } from '@/lib/i18n';
import { GLOSSARY_TERMS } from '@/lib/i18n/glossary';
import { CALCULATOR_SEO_DATA, getCalculatorSeoData, type CalculatorId } from '@/lib/seo/calculator-content';
import type { Locale } from '@/types/i18n';

describe('Multilingual Translation & Localization Audit', () => {
  const allCalculators: CalculatorId[] = [
    'lic-surrender-value-calculator',
    'lic-surrender-analysis',
    'lic-surrender-loss-calculator',
    'lic-premium-calculator',
    'lic-maturity-calculator',
    'lic-bonus-calculator',
    'lic-loan-calculator',
    'lic-pension-calculator',
    'lic-term-insurance-calculator'
  ];

  it('should support all 7 required Indian languages with LTR configuration', () => {
    const requiredLocales: Locale[] = ['en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te'];
    expect(LOCALE_CODES).toEqual(requiredLocales);

    for (const code of requiredLocales) {
      expect(SUPPORTED_LOCALES[code]).toBeDefined();
      expect(SUPPORTED_LOCALES[code].dir).toBe('ltr');
      expect(SUPPORTED_LOCALES[code].nativeName.length).toBeGreaterThan(0);
    }
  });

  it('should have 100% translation key completeness for all 7 languages without missing keys', () => {
    const requiredSections = [
      'site.name',
      'site.tagline',
      'site.description',
      'nav.calculators',
      'nav.plans',
      'nav.guides',
      'nav.surrenderCalculator',
      'nav.surrenderAnalysis',
      'nav.surrenderLoss',
      'nav.premiumCalculator',
      'nav.maturityCalculator',
      'nav.bonusCalculator',
      'nav.loanCalculator',
      'nav.pensionCalculator',
      'nav.termCalculator',
      'home.heroTitle',
      'home.heroSubtitle',
      'home.exploreCalculators',
      'home.calculateSurrender',
      'home.faqTitle',
      'disclaimer.notice',
      'disclaimer.shortText',
      'disclaimer.fullText',
      'disclaimer.readFull',
      'common.calculate',
      'common.reset',
      'common.results',
      'common.breakdown',
      'common.assumptions',
      'common.age',
      'common.sumAssured',
      'common.policyTerm',
      'common.years',
      'common.rupees',
      'common.explainAiBtn',
      'common.verifiedDataBadge',
      'frequency.yearly',
      'frequency.halfYearly',
      'frequency.quarterly',
      'frequency.monthly',
      'editorial.writtenBy',
      'editorial.reviewedBy',
      'editorial.lastReviewed',
      'editorial.sourcesAndReferences',
      'ai.title',
      'ai.placeholder',
      'ai.askBtn',
      'footer.aboutTitle',
      'footer.aboutText',
      'footer.legalTitle',
      'footer.copyright',
      'footer.privacyPolicy',
      'footer.termsOfService',
      'footer.disclaimerPage',
      'errors.generic',
      'errors.validationFailed',
      'errors.invalidAge'
    ];

    for (const locale of LOCALE_CODES) {
      for (const sectionKey of requiredSections) {
        const translated = t(locale, sectionKey);
        expect(translated).toBeDefined();
        expect(translated).not.toBe(sectionKey);
        expect(translated.length).toBeGreaterThan(0);
      }
    }
  });

  it('should deliver localized SEO metadata, H1s, subtitles, and FAQs for all 9 calculators across all 7 languages', () => {
    for (const locale of LOCALE_CODES) {
      for (const calcId of allCalculators) {
        const seo = getCalculatorSeoData(calcId, locale);
        expect(seo).toBeDefined();
        expect(seo.h1.length).toBeGreaterThan(3);
        expect(seo.seoTitle.length).toBeGreaterThan(5);
        expect(seo.metaDescription.length).toBeGreaterThan(10);
        expect(seo.subtitle.length).toBeGreaterThan(5);
        expect(seo.faqs.length).toBeGreaterThanOrEqual(5);

        // Verify FAQs are valid strings
        seo.faqs.forEach((faq) => {
          expect(faq.question.length).toBeGreaterThan(3);
          expect(faq.answer.length).toBeGreaterThan(10);
        });
      }
    }
  });

  it('should generate correct localized paths for all routes', () => {
    expect(getLocalizedPath('/lic-premium-calculator', 'en')).toBe('/lic-premium-calculator');
    expect(getLocalizedPath('/lic-premium-calculator', 'hi')).toBe('/hi/lic-premium-calculator');
    expect(getLocalizedPath('/lic-maturity-calculator', 'ta')).toBe('/ta/lic-maturity-calculator');
    expect(getLocalizedPath('/lic-loan-calculator', 'te')).toBe('/te/lic-loan-calculator');
    expect(getLocalizedPath('/lic-bonus-calculator', 'mr')).toBe('/mr/lic-bonus-calculator');
    expect(getLocalizedPath('/lic-surrender-analysis', 'gu')).toBe('/gu/lic-surrender-analysis');
    expect(getLocalizedPath('/lic-surrender-loss-calculator', 'bn')).toBe('/bn/lic-surrender-loss-calculator');
  });

  it('should maintain verified financial glossary terms consistently across all 7 languages', () => {
    expect(GLOSSARY_TERMS.length).toBeGreaterThan(5);

    GLOSSARY_TERMS.forEach((term) => {
      expect(term.englishTerm).toBeDefined();
      for (const locale of LOCALE_CODES) {
        expect(term.localizedTerms[locale]).toBeDefined();
        expect(term.localizedTerms[locale].length).toBeGreaterThan(0);
        expect(term.descriptions[locale]).toBeDefined();
        expect(term.descriptions[locale].length).toBeGreaterThan(5);
      }
    });
  });
});
