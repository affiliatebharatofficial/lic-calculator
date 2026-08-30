# Production Deployment & Launch Readiness Checklist

## Platform: LIC Calculator (`https://lic-calculators.com/`)

---

### Pre-Deployment Verification:
- [ ] **Environment Separation**: Local/Staging/Production configurations verified. Zero dev secrets in production.
- [ ] **Secrets Management**: `GEMINI_API_KEY`, `ADMIN_SESSION_SECRET`, and `TURNSTILE_SECRET_KEY` set via `wrangler secret put`.
- [ ] **Cloudflare D1 Production Binding**: `DB` binding linked to production D1 database.
- [ ] **D1 Migrations Applied**:
  - `0001_initial_schema.sql`
  - `0002_verified_rule_system.sql`
  - `0003_production_admin_cms.sql`
- [ ] **TypeScript Strict Diagnostics**: `npm run check` passes with 0 errors and 0 warnings.
- [ ] **Automated Test Suites**: `npm test` passes with 100% success rate across all suites.
- [ ] **Production Build**: `npm run build` succeeds cleanly.

---

### Security & Compliance Controls:
- [ ] **Strict-Transport-Security (HSTS)**: `max-age=63072000; includeSubDomains; preload` enabled.
- [ ] **Content Security Policy (CSP)**: Strict origin whitelisting configured in `getSecurityHeaders()`.
- [ ] **Anti-Clickjacking**: `X-Frame-Options: DENY` on `/admin/*` and `frame-ancestors 'none'`.
- [ ] **Public Boundary Invariant**: Draft/unverified/expired rules strictly isolated from public calculators.
- [ ] **E-E-A-T Authenticity**: Real author profiles, verified sources, and editorial policy active.
- [ ] **Independent Platform Disclaimer**: Prominently displayed across headers, footers, calculators, and legal pages.

---

### Post-Deployment Smoke Tests:
- [ ] Homepage loads (`200 OK`).
- [ ] Calculator engines execute deterministically (`/lic-surrender-value-calculator`, `/lic-premium-calculator`, `/lic-maturity-calculator`, `/lic-loan-calculator`, `/lic-bonus-calculator`, `/lic-surrender-loss-calculator`).
- [ ] Multilingual routes render across all 7 languages (`/hi/`, `/mr/`, `/gu/`, `/bn/`, `/ta/`, `/te/`).
- [ ] Health endpoint returns status healthy (`/api/health`).
- [ ] Admin login requires authenticated RBAC session (`/admin/login`).
- [ ] Public sitemap is reachable (`/sitemap-index.xml`) and excludes `/admin/*`.
