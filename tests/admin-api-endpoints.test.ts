import { describe, it, expect } from 'vitest';
import { POST as loginRoute } from '@/pages/api/admin/auth/login';
import { GET as meRoute } from '@/pages/api/admin/auth/me';
import { POST as rulesCreateRoute } from '@/pages/api/admin/rules/index';
import { POST as previewRoute } from '@/pages/api/admin/rules/preview';
import { POST as aiTranslateRoute } from '@/pages/api/admin/translations/ai-translate';

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
});
