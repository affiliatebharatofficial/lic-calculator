# Production Disaster Recovery & Incident Response Runbook

## Platform: LIC Calculator (`https://lic-calculators.com/`)

---

## 1. Severity Levels

- **SEV-1 (Critical)**: Public calculators generating incorrect financial figures, D1 database unreachable, or security/secret breach.
- **SEV-2 (High)**: AI assistant offline or language localization route failures.
- **SEV-3 (Moderate)**: Analytics event ingestion degradation or minor typo in guide content.

---

## 2. Emergency Rule Rollback & Fast Disable

If a newly published financial rule causes calculation inaccuracies or is disputed:

### Step 1: Emergency Disable (Instant Mitigation)
There is no admin panel; rules live in the Cloudflare D1 `rule_sets` table. Disable the problematic rule set directly in D1 by setting its `status` to `disabled` (the public rule provider only serves `status = 'active'`, `verification_status = 'verified'` rows):
```sql
UPDATE rule_sets SET status = 'disabled' WHERE id = '[RULE_SET_ID]';
```
*Effect*: The public calculator immediately returns `Calculation Unavailable` for that specific table/parameter combination rather than serving corrupted or estimated figures.

### Step 2: Rollback to Previous Verified Version
Set the previous verified version's row back to `status = 'active'` in the D1 `rule_sets` table.

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
---

## 5. Public Calculator Availability Invariant

The public deterministic calculator platform is decoupled from AI providers and optional analytics. If the AI service or analytics collector fails, the core calculation engine continues to serve deterministic mathematical outputs without interruption.
