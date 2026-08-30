# Production Disaster Recovery & Incident Response Runbook

## Platform: LIC Calculator (`https://lic-calculators.com/`)

---

## 1. Severity Levels

- **SEV-1 (Critical)**: Public calculators generating incorrect financial figures, D1 database unreachable, or security/secret breach.
- **SEV-2 (High)**: AI assistant offline, language localization route failures, or admin panel login failures.
- **SEV-3 (Moderate)**: Analytics event ingestion degradation or minor typo in guide content.

---

## 2. Emergency Rule Rollback & Fast Disable

If a newly published financial rule causes calculation inaccuracies or is disputed:

### Step 1: Emergency Disable (Instant Mitigation)
Execute authenticated POST to disable the problematic rule immediately:
```bash
curl -X POST https://lic-calculators.com/api/admin/rules/[RULE_ID]/disable \
  -H "Cookie: lic_admin_session=[ADMIN_SESSION_TOKEN]"
```
*Effect*: The rule is instantly transitioned to `disabled`. The public calculator immediately returns `Calculation Unavailable` for that specific table/parameter combination rather than serving corrupted or estimated figures.

### Step 2: Rollback to Previous Verified Version
Transition the previous verified version back to active published state in Admin CMS (`/admin/rules`).

---

## 3. Database (Cloudflare D1) Outage & Backup Restoration

### Backup Retention Schedule:
- Daily automated point-in-time snapshots via Cloudflare D1.
- Retention: 30 days rolling.

### Disaster Recovery Restore Procedure:
1. Identify last known good snapshot timestamp.
2. Execute D1 restoration via Cloudflare CLI (`wrangler`):
   ```bash
   npx wrangler d1 export lic-db --output backup.sql
   npx wrangler d1 execute lic-db --file backup.sql
   ```
3. Run automated regression gate test suite:
   ```bash
   npm test
   ```

---

## 4. Secret Revocation & Rotation Procedures

In the event of an API key or session secret compromise:

1. **AI API Key Revocation**:
   - Rotate the secret key in the AI provider dashboard.
   - Update Cloudflare Worker Secret:
     ```bash
     npx wrangler secret put GEMINI_API_KEY
     ```
2. **Admin Session Token Flush**:
   - Truncate all rows in the `admin_sessions` table in D1 to force all administrators to re-authenticate with PBKDF2/SHA-256 credentials.
   ```sql
   DELETE FROM admin_sessions;
   ```
3. **Session Cookie Signing Key**:
   - Rotate `ADMIN_SESSION_SECRET` in Cloudflare Worker Secrets.

---

## 5. Public Calculator Availability Invariant

The public deterministic calculator platform is decoupled from AI providers and optional analytics. If the AI service or analytics collector fails, the core calculation engine continues to serve deterministic mathematical outputs without interruption.
