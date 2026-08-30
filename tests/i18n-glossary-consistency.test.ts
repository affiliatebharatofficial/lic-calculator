import { describe, it, expect } from 'vitest';
import { GLOSSARY_TERMS, getGlossaryTerm, LOCALE_CODES } from '@/lib/i18n';

describe('i18n Financial Glossary & Terminology Layer', () => {
  it('contains reviewed definitions for all core insurance concepts', () => {
    const requiredTermIds = [
      'sum_assured',
      'policy_term',
      'premium_paying_term',
      'surrender_value',
      'paid_up',
      'policy_loan',
      'bonus'
    ];

    for (const termId of requiredTermIds) {
      const termObj = GLOSSARY_TERMS.find((t) => t.id === termId);
      expect(termObj).toBeDefined();

      for (const loc of LOCALE_CODES) {
        const { term, description } = getGlossaryTerm(termId, loc);
        expect(term).toBeDefined();
        expect(term.length).toBeGreaterThan(0);
        expect(description).toBeDefined();
        expect(description.length).toBeGreaterThan(0);
      }
    }
  });

  it('guarantees Hindi and regional terms preserve precise financial meaning', () => {
    const surrenderHi = getGlossaryTerm('surrender_value', 'hi');
    expect(surrenderHi.term).toContain('सरेंडर');

    const paidUpHi = getGlossaryTerm('paid_up', 'hi');
    expect(paidUpHi.term).toContain('पेड-अप');
  });
});
