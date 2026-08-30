import { describe, it, expect } from 'vitest';
import { POST as explainResultRoute } from '@/pages/api/ai/explain-result';
import { POST as chatRoute } from '@/pages/api/ai/chat';
import { POST as explainFieldRoute } from '@/pages/api/ai/explain-field';

describe('AI API Endpoints Integration', () => {
  describe('POST /api/ai/explain-result', () => {
    it('returns structured explanation for valid calculation context', async () => {
      const request = new Request('https://lic-calculators.com/api/ai/explain-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorId: 'lic-surrender-value-calculator',
          planName: 'Endowment Plan (Table 914)',
          planCode: '914',
          primaryResult: '₹68,750',
          breakdownItems: [
            { label: 'Total Paid So Far', amount: '₹1,25,000' },
            { label: 'Special Surrender Value', amount: '₹68,750' }
          ],
          assumptions: ['Standard in-force policy.'],
          warnings: ['Minimum 2 years duration required.']
        })
      });

      const response = await explainResultRoute({ request, locals: {}, clientAddress: '10.0.0.1' } as any);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.summary).toContain('₹68,750');
      expect(json.data.whatNumbersMean.length).toBe(2);
      expect(json.data.howCalculated).toBeDefined();
    });

    it('rejects payload missing primaryResult with 422', async () => {
      const request = new Request('https://lic-calculators.com/api/ai/explain-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorId: 'lic-premium-calculator'
          // primaryResult missing
        })
      });

      const response = await explainResultRoute({ request, locals: {}, clientAddress: '10.0.0.2' } as any);
      expect(response.status).toBe(422);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/ai/chat', () => {
    it('answers natural language policy questions with structured reply', async () => {
      const request = new Request('https://lic-calculators.com/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'What is the difference between surrender and paid up?'
        })
      });

      const response = await chatRoute({ request, locals: {}, clientAddress: '10.0.0.3' } as any);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.answer).toBeDefined();
      expect(json.data.keyPoints.length).toBeGreaterThan(0);
      expect(json.data.suggestedFollowUps.length).toBeGreaterThan(0);
    });

    it('rejects empty message with 422', async () => {
      const request = new Request('https://lic-calculators.com/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '   '
        })
      });

      const response = await chatRoute({ request, locals: {}, clientAddress: '10.0.0.4' } as any);
      expect(response.status).toBe(422);
    });
  });

  describe('POST /api/ai/explain-field', () => {
    it('explains requested insurance form field', async () => {
      const request = new Request('https://lic-calculators.com/api/ai/explain-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldName: 'policyTerm'
        })
      });

      const response = await explainFieldRoute({ request, locals: {}, clientAddress: '10.0.0.5' } as any);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.explanation).toContain('Policy Term is the total number of years');
    });
  });
});
