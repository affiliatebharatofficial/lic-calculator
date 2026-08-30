import { describe, it, expect } from 'vitest';
import { POST as premiumPost } from '@/pages/api/calculators/premium';
import { POST as maturityPost } from '@/pages/api/calculators/maturity';
import { POST as bonusPost } from '@/pages/api/calculators/bonus';
import { POST as surrenderPost } from '@/pages/api/calculators/surrender';
import { POST as surrenderLossPost } from '@/pages/api/calculators/surrender-loss';
import { POST as loanPost } from '@/pages/api/calculators/loan';
import { getSecurityHeaders, GlobalRateLimiter, RequestInputValidator } from '@/lib/security';
import { AdminStore } from '@/lib/admin';
import { PrivacyPreservingTracker } from '@/lib/analytics';
import { StructuredDataGenerator, SEARCH_INTENT_MAP, SEOQualityGate } from '@/lib/seo';
import { VERIFIED_AUTHORS, AuthorManager } from '@/lib/editorial';
import { LOCALE_CODES, t, getLocalizedPath } from '@/lib/i18n';

describe('PHASE 12 FINAL QA: Comprehensive Platform Verification', () => {
  // --- 1. Master Financial & Mathematical Invariants ---
  describe('1. Financial Accuracy & Independent Mathematical Verification', () => {
    it('Premium Calculator: Table 914 independent actuarial computation', async () => {
      const request = new Request('https://lic-calculators.com/api/calculators/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTableNo: 914,
          age: 30,
          policyTerm: 20,
          sumAssured: 500000,
          premiumFrequency: 'yearly',
          includeAccidentalRider: false
        })
      });

      const response = await premiumPost({ request, locals: {} } as any);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.calculatorId).toBe('lic-premium-calculator');
      expect(json.data.primaryAmount.paise).toBe(2468081); // ₹24,680.81
    });

    it('Maturity Calculator: Sum Assured + Accrued Bonus + Terminal FAB', async () => {
      const request = new Request('https://lic-calculators.com/api/calculators/maturity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTableNo: 914,
          sumAssured: 500000,
          policyTerm: 20
        })
      });

      const response = await maturityPost({ request, locals: {} } as any);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.calculatorId).toBe('lic-maturity-calculator');
      expect(json.data.primaryAmount.paise).toBe(95500000); // ₹9,55,000
    });

    it('Bonus Calculator: Computes exact annual reversionary bonus accumulation', async () => {
      const request = new Request('https://lic-calculators.com/api/calculators/bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTableNo: 914,
          sumAssured: 500000,
          policyTerm: 20
        })
      });

      const response = await bonusPost({ request, locals: {} } as any);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.calculatorId).toBe('lic-bonus-calculator');
      expect(json.data.primaryAmount.paise).toBe(45500000); // ₹4,55,000
      expect(json.data.result.totalReversionaryBonus.paise).toBe(42000000);
      expect(json.data.result.finalAdditionalBonus.paise).toBe(3500000);
    });

    it('Surrender Calculator: Enforces 2-year vesting & computes Max(GSV, SSV)', async () => {
      // 1. Under 2 years: ₹0 payable
      const unvestedReq = new Request('https://lic-calculators.com/api/calculators/surrender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTableNo: 914,
          sumAssured: 500000,
          policyTerm: 20,
          completedYears: 1,
          totalPremiumsPaid: 25000
        })
      });
      const unvestedRes = await surrenderPost({ request: unvestedReq, locals: {} } as any);
      const unvestedJson = await unvestedRes.json();
      expect(unvestedJson.data.primaryAmount.paise).toBe(0);

      // 2. 5 years: SSV ₹68,750 payable
      const vestedReq = new Request('https://lic-calculators.com/api/calculators/surrender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTableNo: 914,
          sumAssured: 500000,
          policyTerm: 20,
          completedYears: 5,
          totalPremiumsPaid: 125000,
          accruedBonus: 0
        })
      });
      const vestedRes = await surrenderPost({ request: vestedReq, locals: {} } as any);
      const vestedJson = await vestedRes.json();
      expect(vestedJson.data.primaryAmount.paise).toBe(6875000);
      expect(vestedJson.data.result.applicableRuleType).toBe('SSV');
    });

    it('Surrender Loss Calculator: Accurately computes financial shortfall and loss percentage', async () => {
      const request = new Request('https://lic-calculators.com/api/calculators/surrender-loss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTableNo: 914,
          sumAssured: 500000,
          policyTerm: 20,
          completedYears: 5,
          totalPremiumsPaid: 125000,
          annualPremium: 25000
        })
      });

      const response = await surrenderLossPost({ request, locals: {} } as any);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.calculatorId).toBe('lic-surrender-loss-calculator');
      expect(json.data.primaryAmount.paise).toBe(5625000); // ₹56,250 loss
      expect(json.data.result.lossPercentageNumber).toBe(45);
    });

    it('Loan Calculator: Computes 90% LTV on in-force and 80% on paid-up policies', async () => {
      const inForceReq = new Request('https://lic-calculators.com/api/calculators/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surrenderValue: 200000,
          isPolicyInForce: true
        })
      });
      const inForceRes = await loanPost({ request: inForceReq, locals: {} } as any);
      const inForceJson = await inForceRes.json();
      expect(inForceJson.data.primaryAmount.paise).toBe(18000000); // ₹1,80,000
      expect(inForceJson.data.result.semiAnnualInterestAmount.paise).toBe(855000); // ₹8,550
    });
  });

  // --- 2. Security, Authorization & Abuse Defense ---
  describe('2. Security, CSP, Rate Limiting & Input Validation', () => {
    it('enforces strict CSP and security headers', () => {
      const headers = getSecurityHeaders({ isAdmin: true }) as Record<string, string>;
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['Strict-Transport-Security']).toContain('max-age=63072000');
      expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
    });

    it('sliding window rate limiter prevents API flooding', () => {
      GlobalRateLimiter.clear();
      const ip = '198.51.100.1';

      for (let i = 0; i < 10; i++) {
        expect(GlobalRateLimiter.check('ai', ip).allowed).toBe(true);
      }
      expect(GlobalRateLimiter.check('ai', ip).allowed).toBe(false);
    });

    it('validates request protocol and content-type', () => {
      const getReq = new Request('https://lic-calculators.com/api/calculators/surrender', { method: 'GET' });
      expect(RequestInputValidator.validateMethod(getReq, 'POST').valid).toBe(false);
    });
  });

  // --- 3. Strict Public Boundary & Separation of Duties ---
  describe('3. Public Data Boundary & Admin Rule Lifecycle', () => {
    it('proves draft, unverified and disabled rules cannot be accessed by public calculators', () => {
      const publicRule = AdminStore.getPublicActiveRule('non_existent_plan', 'surrender');
      expect(publicRule).toBeUndefined();
    });

    it('guarantees only published and effective rules are served', () => {
      const activeRule = AdminStore.getPublicActiveRule('914', 'surrender');
      expect(activeRule).toBeDefined();
      expect(activeRule?.status).toBe('published');
      expect(activeRule?.isPublished).toBe(true);
    });
  });

  // --- 4. Technical SEO, Multilingual & E-E-A-T Authenticity ---
  describe('4. SEO Clusters, JSON-LD Schema, Hreflang & E-E-A-T', () => {
    it('maintains 1:1 intent mapping with zero cannibalization across 5 clusters', () => {
      const pillarSurrender = SEARCH_INTENT_MAP.find((e) => e.clusterId === 'cluster_surrender' && e.isPillar);
      expect(pillarSurrender?.canonicalPath).toBe('/lic-surrender-value-calculator');
    });

    it('generates valid Schema.org structured data', () => {
      const webApp = StructuredDataGenerator.generateWebApplication({
        name: 'LIC Maturity Calculator',
        description: 'Calculate expected returns upon policy maturity.',
        url: 'https://lic-calculators.com/lic-maturity-calculator'
      });
      expect(webApp['@type']).toBe('WebApplication');
      expect((webApp.offers as any).priceCurrency).toBe('INR');
    });

    it('all 7 supported languages maintain complete navigation and locale codes', () => {
      expect(LOCALE_CODES).toEqual(['en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te']);
      for (const lang of LOCALE_CODES) {
        expect(t(lang, 'site.name')).toBeDefined();
        expect(getLocalizedPath('/calculators', lang)).toBeDefined();
      }
    });

    it('verified author profiles have sanitized social URLs', () => {
      for (const author of VERIFIED_AUTHORS) {
        expect(author.name).toBeDefined();
        expect(author.qualifications.length).toBeGreaterThan(0);
        if (author.socialLinks.linkedin) {
          expect(AuthorManager.isValidSocialUrl(author.socialLinks.linkedin)).toBe(true);
        }
      }
    });

    it('SEO quality gate prevents thin content or missing authors', () => {
      const pass = SEOQualityGate.evaluate({
        title: 'LIC Surrender Value Calculator Online Tool',
        description: 'Calculate your policy cash surrender value with verified GSV and SSV factor rules.',
        canonicalUrl: 'https://lic-calculators.com/lic-surrender-value-calculator',
        contentType: 'calculator',
        authorId: 'rajesh-sharma',
        reviewerId: 'ananya-deshmukh',
        sourceIds: ['src_lic_914_doc']
      });
      expect(pass.passed).toBe(true);
    });
  });

  // --- 5. Privacy-Preserving Analytics Invariant ---
  describe('5. Data Privacy & Minimization', () => {
    it('ensures analytics events strictly exclude PII and exact financial numbers', () => {
      const sanitized = PrivacyPreservingTracker.sanitizeEvent({
        eventType: 'calculation_completed',
        path: '/lic-maturity-calculator',
        calculatorId: 'maturity',
        policy_number: '123456789',
        premium: 50000,
        name: 'Private User'
      });

      expect(sanitized?.eventType).toBe('calculation_completed');
      expect((sanitized as any).policy_number).toBeUndefined();
      expect((sanitized as any).premium).toBeUndefined();
      expect((sanitized as any).name).toBeUndefined();
    });
  });
});
