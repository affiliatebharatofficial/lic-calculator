import { describe, it, expect } from 'vitest';
import { CALCULATOR_SEO_DATA } from '../src/lib/seo/calculator-content';
import type { CalculatorId } from '../src/lib/seo/calculator-content';
import { StructuredDataGenerator } from '../src/lib/seo/structured-data';

describe('Production SEO & Content Audit for All Calculators', () => {
  const calculatorKeys = Object.keys(CALCULATOR_SEO_DATA) as CalculatorId[];

  it('should have complete SEO data for all 9 primary calculators', () => {
    expect(calculatorKeys.length).toBe(9);
    const expectedCalculators = [
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

    for (const key of expectedCalculators) {
      expect(calculatorKeys).toContain(key);
    }
  });

  it('should guarantee unique SEO titles and meta descriptions with no duplicates', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    const h1s = new Set<string>();

    for (const key of calculatorKeys) {
      const data = CALCULATOR_SEO_DATA[key];
      expect(data.seoTitle).toBeDefined();
      expect(data.seoTitle.length).toBeGreaterThan(20);
      expect(data.seoTitle.length).toBeLessThan(75);
      expect(titles.has(data.seoTitle)).toBe(false);
      titles.add(data.seoTitle);

      expect(data.metaDescription).toBeDefined();
      expect(data.metaDescription.length).toBeGreaterThan(80);
      expect(data.metaDescription.length).toBeLessThan(170);
      expect(descriptions.has(data.metaDescription)).toBe(false);
      descriptions.add(data.metaDescription);

      expect(data.h1).toBeDefined();
      expect(h1s.has(data.h1)).toBe(false);
      h1s.add(data.h1);
    }
  });

  it('should have at least 300 to 500+ words of rich informational content per calculator (excluding boilerplate)', () => {
    for (const key of calculatorKeys) {
      const data = CALCULATOR_SEO_DATA[key];
      
      const introWords = data.introParagraphs.join(' ').trim().split(/\s+/).length;
      const methodologyWords = data.howItWorks.steps.map(s => `${s.title} ${s.description} ${s.formulaSnippet || ''}`).join(' ').trim().split(/\s+/).length;
      const inputsWords = data.inputsGuide.items.map(i => `${i.label} ${i.explanation}`).join(' ').trim().split(/\s+/).length;
      const resultsWords = data.resultsGuide.metrics.map(r => `${r.name} ${r.meaning}`).join(' ').trim().split(/\s+/).length;
      const assumptionsWords = data.assumptionsAndLimitations.notes.join(' ').trim().split(/\s+/).length;
      const faqWords = data.faqs.map(f => `${f.question} ${f.answer}`).join(' ').trim().split(/\s+/).length;

      const totalContentWords = introWords + methodologyWords + inputsWords + resultsWords + assumptionsWords + faqWords;

      // Every calculator must satisfy the requirement: AT LEAST 300-500 WORDS of genuinely useful content
      expect(totalContentWords).toBeGreaterThanOrEqual(300);
      expect(totalContentWords).toBeGreaterThanOrEqual(450); // Comprehensive informational copy
    }
  });

  it('should have 5 to 8 unique, high-quality FAQs per calculator (6 FAQs configured)', () => {
    for (const key of calculatorKeys) {
      const data = CALCULATOR_SEO_DATA[key];
      expect(data.faqs.length).toBeGreaterThanOrEqual(5);
      expect(data.faqs.length).toBeLessThanOrEqual(8);
      expect(data.faqs.length).toBe(6);

      for (const faq of data.faqs) {
        expect(faq.question).toBeDefined();
        expect(faq.question.endsWith('?')).toBe(true);
        expect(faq.answer).toBeDefined();
        expect(faq.answer.length).toBeGreaterThan(40);
      }
    }
  });

  it('should generate valid FAQPage JSON-LD schema matching visible FAQs 1-to-1', () => {
    for (const key of calculatorKeys) {
      const data = CALCULATOR_SEO_DATA[key];
      const faqSchema = StructuredDataGenerator.generateFAQPage(data.faqs) as {
        '@context': string;
        '@type': string;
        mainEntity: Array<{
          '@type': string;
          name: string;
          acceptedAnswer: {
            '@type': string;
            text: string;
          };
        }>;
      };

      expect(faqSchema['@context']).toBe('https://schema.org');
      expect(faqSchema['@type']).toBe('FAQPage');
      expect(faqSchema.mainEntity.length).toBe(data.faqs.length);

      data.faqs.forEach((faq, index) => {
        const entity = faqSchema.mainEntity[index];
        expect(entity).toBeDefined();
        if (entity) {
          expect(entity['@type']).toBe('Question');
          expect(entity.name).toBe(faq.question);
          expect(entity.acceptedAnswer['@type']).toBe('Answer');
          expect(entity.acceptedAnswer.text).toBe(faq.answer);
        }
      });
    }
  });

  it('should contain verified last reviewed date and regulatory sources for all calculators', () => {
    for (const key of calculatorKeys) {
      const data = CALCULATOR_SEO_DATA[key];
      expect(data.lastReviewedDate).toBeDefined();
      expect(data.lastReviewedDate.length).toBeGreaterThan(5);
      expect(data.sources.length).toBeGreaterThanOrEqual(2);

      for (const src of data.sources) {
        expect(src.title).toBeDefined();
        expect(src.publisher).toBeDefined();
        expect(src.reference).toBeDefined();
      }
    }
  });
});
