import { describe, it, expect } from 'vitest';
import { StructuredDataGenerator } from '@/lib/seo';
import { AuthorManager } from '@/lib/editorial';

describe('Schema.org JSON-LD Structured Data Generators', () => {
  it('generates WebApplication schema for calculators', () => {
    const schema = StructuredDataGenerator.generateWebApplication({
      name: 'LIC Surrender Value Calculator',
      description: 'Calculate your policy cash surrender value.',
      url: 'https://lic-calculators.com/lic-surrender-value-calculator'
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebApplication');
    expect(schema.name).toBe('LIC Surrender Value Calculator');
    expect(schema.applicationCategory).toBe('FinanceApplication');
    expect((schema.offers as any).priceCurrency).toBe('INR');
  });

  it('generates Article schema with Author data', () => {
    const author = AuthorManager.getDefaultAuthor();

    const schema = StructuredDataGenerator.generateArticle({
      headline: 'What is LIC Surrender Value? Complete Guide',
      description: 'Understanding GSV and SSV factor calculation.',
      url: 'https://lic-calculators.com/guides/what-is-lic-surrender-value',
      publishedDate: '2026-01-05T00:00:00Z',
      modifiedDate: '2026-01-20T00:00:00Z',
      author
    });

    expect(schema['@type']).toBe('Article');
    expect((schema.author as any).name).toBe('Firoz Khan');
    expect((schema.author as any).jobTitle).toBe('Founder & Publisher');
    expect((schema.author as any).sameAs).toContain('https://www.linkedin.com/in/firoz-khan-1153358a/');
    expect((schema.author as any).sameAs).toContain('https://www.instagram.com/rtibyfiroz/');
  });

  it('generates Person schema for author profile pages', () => {
    const author = AuthorManager.getDefaultAuthor();
    const schema = StructuredDataGenerator.generatePerson(author);

    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('Firoz Khan');
    expect(schema.jobTitle).toBe('Founder & Publisher');
    expect(schema.sameAs).toContain('https://www.linkedin.com/in/firoz-khan-1153358a/');
    expect(schema.sameAs).toContain('https://www.instagram.com/rtibyfiroz/');
  });

  it('generates BreadcrumbList schema matching site hierarchy', () => {
    const crumbs = [
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/calculators' },
      { name: 'Surrender Calculator', url: '/lic-surrender-value-calculator' }
    ];

    const schema = StructuredDataGenerator.generateBreadcrumbList(crumbs);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect((schema.itemListElement as any[]).length).toBe(3);
    expect((schema.itemListElement as any[])[0].position).toBe(1);
    expect((schema.itemListElement as any[])[2].item).toBe('https://lic-calculators.com/lic-surrender-value-calculator');
  });

  it('generates FAQPage schema for verified FAQs', () => {
    const faqs = [
      { question: 'When does an LIC policy acquire cash surrender value?', answer: 'After 2 consecutive years of premium payments.' }
    ];

    const schema = StructuredDataGenerator.generateFAQPage(faqs);
    expect(schema['@type']).toBe('FAQPage');
    expect((schema.mainEntity as any[]).length).toBe(1);
    expect((schema.mainEntity as any[])[0].name).toBe('When does an LIC policy acquire cash surrender value?');
  });
});
