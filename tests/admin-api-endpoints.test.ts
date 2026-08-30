import { describe, it, expect } from 'vitest';
import { POST as loginRoute } from '@/pages/api/admin/auth/login';
import { GET as meRoute } from '@/pages/api/admin/auth/me';
import { POST as rulesCreateRoute } from '@/pages/api/admin/rules/index';
import { POST as previewRoute } from '@/pages/api/admin/rules/preview';
import { POST as aiTranslateRoute } from '@/pages/api/admin/translations/ai-translate';
import { GET as seoIntentsGetRoute, POST as seoIntentsPostRoute, DELETE as seoIntentsDeleteRoute } from '@/pages/api/admin/seo/intents';

describe('Admin API Endpoints Integration', () => {
  let sessionToken = '';

  it('POST /api/admin/auth/login logs in valid admin and sets cookie', async () => {
    const request = new Request('https://lic-calculators.com/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@lic-calculators.com',
        password: 'AdminPass@123'
      })
    });

    const response = await loginRoute({ request, clientAddress: '127.0.0.1' } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.user.email).toBe('admin@lic-calculators.com');

    const setCookie = response.headers.get('Set-Cookie') || '';
    expect(setCookie).toContain('lic_admin_session=');

    // Extract token for subsequent requests
    const match = setCookie.match(/lic_admin_session=([^;]+)/);
    sessionToken = match && match[1] ? match[1] : '';
  });

  it('GET /api/admin/auth/me validates session with cookie header', async () => {
    const request = new Request('https://lic-calculators.com/api/admin/auth/me', {
      headers: { Cookie: `lic_admin_session=${sessionToken}` }
    });

    const response = await meRoute({ request } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.user.role).toBe('super_admin');
    expect(json.data.permissions.length).toBeGreaterThan(0);
  });

  it('POST /api/admin/rules creates draft rule via authorized session', async () => {
    const request = new Request('https://lic-calculators.com/api/admin/rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `lic_admin_session=${sessionToken}`
      },
      body: JSON.stringify({
        planCode: '945',
        tableNo: 945,
        calculatorCode: 'surrender',
        version: 'v1',
        calculationStrategy: 'surrender_special_v1',
        effectiveFrom: '2026-01-01',
        rulePayload: { gsvFactor: 0.5 }
      })
    });

    const response = await rulesCreateRoute({ request, clientAddress: '127.0.0.1' } as any);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('draft');
  });

  it('POST /api/admin/rules/preview executes calculation safely in preview sandbox', async () => {
    const request = new Request('https://lic-calculators.com/api/admin/rules/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `lic_admin_session=${sessionToken}`
      },
      body: JSON.stringify({
        calculatorCode: 'surrender',
        input: {
          sumAssured: 500000,
          policyTerm: 20,
          completedYears: 5,
          totalPremiumsPaid: 125000
        }
      })
    });

    const response = await previewRoute({ request } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.calculationResult.result.isAcquired).toBe(true);
    expect(json.data.calculationResult.primaryAmount.paise).toBeGreaterThan(0);
  });

  it('POST /api/admin/translations/ai-translate generates translations across all 6 non-default Indian locales', async () => {
    const request = new Request('https://lic-calculators.com/api/admin/translations/ai-translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: 'Surrender Value',
        category: 'Calculators',
        targetLocales: ['hi', 'mr', 'gu', 'bn', 'ta', 'te']
      })
    });

    const response = await aiTranslateRoute({ request, clientAddress: '127.0.0.1' } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.translations).toBeDefined();
    expect(json.data.translations.hi).toBeDefined();
    expect(json.data.translations.mr).toBeDefined();
    expect(json.data.translations.gu).toBeDefined();
    expect(json.data.translations.bn).toBeDefined();
    expect(json.data.translations.ta).toBeDefined();
    expect(json.data.translations.te).toBeDefined();
  });

  it('GET and POST /api/admin/seo/intents manages dynamic search intents', async () => {
    // 1. GET intents
    const getRes = await seoIntentsGetRoute({} as any);
    expect(getRes.status).toBe(200);
    const getJson = await getRes.json();
    expect(getJson.success).toBe(true);
    expect(getJson.data.intents.length).toBeGreaterThan(0);

    // 2. POST create new intent
    const postReq = new Request('https://lic-calculators.com/api/admin/seo/intents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clusterId: 'cluster_pension',
        clusterName: 'LIC Pension & Immediate Annuity Valuation',
        primaryKeyword: 'lic pension plan return calculator',
        canonicalPath: '/lic-pension-calculator',
        primaryIntent: 'Calculate monthly pension returns',
        isPillar: true
      })
    });

    const postRes = await seoIntentsPostRoute({ request: postReq } as any);
    expect(postRes.status).toBe(200);
    const postJson = await postRes.json();
    expect(postJson.success).toBe(true);
    expect(postJson.data.entry.primaryKeyword).toBe('lic pension plan return calculator');

    // 3. DELETE intent
    const deleteReq = new Request('https://lic-calculators.com/api/admin/seo/intents?keyword=lic%20pension%20plan%20return%20calculator', {
      method: 'DELETE'
    });
    const deleteRes = await seoIntentsDeleteRoute({ request: deleteReq } as any);
    expect(deleteRes.status).toBe(200);
    const deleteJson = await deleteRes.json();
    expect(deleteJson.success).toBe(true);
  });
});
