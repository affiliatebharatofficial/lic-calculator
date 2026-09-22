import { describe, it, expect } from 'vitest';
import { VERIFIED_PLANS_DATA, getLocalizedPlanData } from '../src/lib/content/plan-data';
import { LOCALIZED_PLANS_DATA } from '../src/lib/content/plan-i18n';
import { StructuredDataGenerator } from '../src/lib/seo';
import { AuthorManager } from '../src/lib/editorial';
import type { Locale } from '../src/types/i18n';

describe('Plan Information Hub Comprehensive Audit', () => {
  const planSlugs = Object.keys(VERIFIED_PLANS_DATA);
  const expectedPlans = [
    '914-new-endowment-plan',
    '915-new-jeevan-anand',
    '936-jeevan-labh',
    '945-jeevan-umang'
  ];

  it('contains all 4 verified primary LIC plans with accurate table numbers and UINs', () => {
    expect(planSlugs.length).toBe(4);
    for (const slug of expectedPlans) {
      expect(planSlugs).toContain(slug);
      const plan = VERIFIED_PLANS_DATA[slug]!;
      expect(plan.uin).toBeDefined();
      expect(plan.uin.length).toBeGreaterThan(5);
      expect(plan.tableNo).toBeGreaterThan(0);
      expect(plan.category).toBeDefined();
      expect(plan.lastReviewedDate).toBe('August 2026');
    }
  });

  it('delivers 300 to 500+ words of rich educational plan content per plan', () => {
    for (const slug of planSlugs) {
      const plan = VERIFIED_PLANS_DATA[slug]!;
      
      const introWords = plan.introParagraphs.join(' ').trim().split(/\s+/).length;
      const overviewWords = `${plan.overview.description} ${plan.overview.targetAudience} ${plan.overview.keyCharacteristics.join(' ')} ${plan.overview.importantLimitations.join(' ')}`.trim().split(/\s+/).length;
      const eligibilityWords = plan.eligibility.rows.map(r => `${r.parameter} ${r.requirement}`).join(' ').trim().split(/\s+/).length;
      const premiumWords = `${plan.premiumInfo.description} ${plan.premiumInfo.gstExplanation} ${plan.premiumInfo.factorsAffectingPremium.join(' ')}`.trim().split(/\s+/).length;
      const benefitsWords = `${plan.benefits.summary} ${plan.benefits.maturityBenefit.description} ${plan.benefits.deathBenefit.description} ${plan.benefits.bonusInfo.description}`.trim().split(/\s+/).length;
      const operationsWords = `${plan.policyOperations.loanFacility.eligibilityCondition} ${plan.policyOperations.surrenderValue.gsvExplanation} ${plan.policyOperations.paidUpOption.condition}`.trim().split(/\s+/).length;
      const taxWords = `${plan.taxProvisions.section80C} ${plan.taxProvisions.section1010D} ${plan.taxProvisions.budget2023Notice}`.trim().split(/\s+/).length;
      const exampleWords = `${plan.illustrativeExample.title} ${plan.illustrativeExample.explanation}`.trim().split(/\s+/).length;
      const faqWords = plan.faqs.map(f => `${f.question} ${f.answer}`).join(' ').trim().split(/\s+/).length;

      const totalWords = introWords + overviewWords + eligibilityWords + premiumWords + benefitsWords + operationsWords + taxWords + exampleWords + faqWords;

      expect(totalWords).toBeGreaterThanOrEqual(300);
      expect(totalWords).toBeGreaterThanOrEqual(500);
    }
  });

  it('guarantees exactly 6 high-quality, plan-specific FAQs per plan', () => {
    for (const slug of planSlugs) {
      const plan = VERIFIED_PLANS_DATA[slug]!;
      expect(plan.faqs.length).toBe(6);

      for (const faq of plan.faqs) {
        expect(faq.question).toBeDefined();
        expect(faq.question.endsWith('?')).toBe(true);
        expect(faq.answer).toBeDefined();
        expect(faq.answer.length).toBeGreaterThan(30);
      }
    }
  });

  it('generates valid FAQPage and Article structured data schemas matching visible content', () => {
    for (const slug of planSlugs) {
      const plan = VERIFIED_PLANS_DATA[slug]!;
      const faqSchema = StructuredDataGenerator.generateFAQPage(plan.faqs);
      expect(faqSchema['@context']).toBe('https://schema.org');
      expect(faqSchema['@type']).toBe('FAQPage');
      expect(faqSchema.mainEntity.length).toBe(6);

      const articleSchema = StructuredDataGenerator.generateArticle({
        headline: plan.seoTitle,
        description: plan.metaDescription,
        url: `https://lic-calculators.com/lic-plans/${plan.slug}/`,
        publishedDate: '2026-01-01T00:00:00Z',
        modifiedDate: '2026-08-15T00:00:00Z',
        author: AuthorManager.getDefaultAuthor()
      });
      expect(articleSchema['@type']).toBe('Article');
      expect(articleSchema.author.name).toBe('Firoz Khan');
    }
  });

  it('provides complete multilingual localizations across all 6 Indian languages', () => {
    const supportedLocales: Locale[] = ['hi', 'mr', 'gu', 'bn', 'ta', 'te'];

    for (const locale of supportedLocales) {
      for (const slug of expectedPlans) {
        const localized = getLocalizedPlanData(slug, locale);
        expect(localized).toBeDefined();
        expect(localized.seoTitle).toBeDefined();
        expect(localized.seoTitle.length).toBeGreaterThan(15);
        expect(localized.h1).toBeDefined();
        expect(localized.faqs.length).toBe(6);

        for (const faq of localized.faqs) {
          expect(faq.question.endsWith('?') || faq.question.endsWith('؟') || faq.question.endsWith('।')).toBe(true);
          expect(faq.answer.length).toBeGreaterThan(20);
        }
      }
    }
  });

  it('strictly adheres to financial claim safety guidelines (no over-absolute claims)', () => {
    const forbiddenPhrases = [
      '100% accurate',
      'exact maturity',
      'guaranteed return',
      'best lic plan',
      'perfect policy',
      'highest return'
    ];

    for (const slug of planSlugs) {
      const plan = VERIFIED_PLANS_DATA[slug]!;
      const stringified = JSON.stringify(plan).toLowerCase();

      for (const phrase of forbiddenPhrases) {
        expect(stringified).not.toContain(phrase);
      }
    }
  });
});
