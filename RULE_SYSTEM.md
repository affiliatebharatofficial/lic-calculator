# LIC Calculator — Verified Rule System Guide

**Primary Domain:** `https://lic-calculators.com/`  
**Core Policy:** Zero Unverified Production Rules

---

## 1. The Zero-Unverified Data Policy

Production financial calculators on `lic-calculators.com` **must never use guessed or unverified financial figures**. 

Every calculation rule requires:
1. An official, traceable source reference (e.g. LIC circular, policy sales brochure, statutory gazette notice).
2. Explicit verification status (`verified`).
3. An active lifecycle state (`active`).

If an applicable rule is not verified, the engine fails safely and emits a typed `RULE_NOT_FOUND` / `RULE_NOT_VERIFIED` error. It **never** falls back to an invented guess.

---

## 2. Rule Lifecycle State Machine

```text
    +---------------------------------------------------------+
    |                         Draft                           |
    |  - Newly created by data extraction                     |
    |  - status: 'draft', verification_status: 'pending'      |
    +---------------------------------------------------------+
                                 |
                                 | Actuarial Source Review
                                 v
    +---------------------------------------------------------+
    |                        Verified                         |
    |  - Checked against official LIC circular / document     |
    |  - status: 'draft', verification_status: 'verified'     |
    +---------------------------------------------------------+
                                 |
                                 | Conflict Validation Passed
                                 v
    +---------------------------------------------------------+
    |                         Active                          |
    |  - Production-eligible for calculator engine lookups   |
    |  - status: 'active', verification_status: 'verified'    |
    +---------------------------------------------------------+
                                 |
                                 | Expiry / Superseded / Withdrawn
                                 v
    +---------------------------------------------------------+
    |                   Inactive / Archived                   |
    |  - Preserved for historical calculations                |
    |  - status: 'inactive' / 'archived'                      |
    +---------------------------------------------------------+
```

---

## 3. Deterministic Rule Selection Algorithm

Rule selection is deterministic and supports historical policies based on policy commencement date and policy year:

$$\text{Plan} + \text{Variant} + \text{Calculator Type} + \text{Calculation Date} + \text{Policy Year} + \text{Verification Status ('verified')} + \text{Status ('active')}$$

### Selection Logic:
```sql
SELECT rs.*, ct.calculator_code, lp.plan_code
FROM rule_sets rs
JOIN calculator_types ct ON rs.calculator_type_id = ct.id
JOIN lic_plans lp ON rs.plan_id = lp.id
WHERE lp.plan_code = :planCode
  AND ct.calculator_code = :calculatorCode
  AND rs.status = 'active'
  AND rs.verification_status = 'verified'
  AND rs.effective_from <= :calculationDate
  AND (rs.effective_to IS NULL OR rs.effective_to >= :calculationDate)
  AND (rs.policy_year_from IS NULL OR rs.policy_year_from <= :policyYear)
  AND (rs.policy_year_to IS NULL OR rs.policy_year_to >= :policyYear)
ORDER BY rs.effective_from DESC, rs.version DESC
LIMIT 1;
```

---

## 4. Conflict Detection & Safety Validation

Before any rule is activated, the validation engine checks:

1. **Overlapping Effective Dates**: Two active rules for the same Plan, Variant, Calculator Type, and Policy Year cannot have overlapping `[effective_from, effective_to]` periods.
2. **Duplicate Versions**: Version strings (e.g. `"2024.1"`) must be unique per plan and calculator type.
3. **Mandatory Source Reference**: Source citation cannot be blank or shorter than 3 characters.
4. **Valid JSON Payload**: The `rule_payload_json` must deserialize into valid JSON conforming to the target engine schema.

---

## 5. Step-by-Step Operational Workflows

### Workflow A: Adding a New LIC Plan
```typescript
import { PlanService } from '@/lib/db';

const plan = {
  id: 'plan_945',
  plan_code: '945',
  table_no: 945,
  uin: '512N312V02',
  plan_name: 'LIC Jeevan Umang',
  slug: 'lic-jeevan-umang-945',
  plan_type: 'whole-life',
  description: 'Whole life assurance with annual survival benefits',
  status: 'active',
  is_with_profits: 1,
  source_reference: 'LIC Sales Brochure Table 945',
  source_title: 'LIC Jeevan Umang Product Document',
  source_type: 'official_brochure',
  verification_status: 'pending'
};
```

### Workflow B: Creating a Rule Draft
```typescript
import { RuleService } from '@/lib/db';

const ruleService = new RuleService(db);

const { ruleId, errors } = await ruleService.createRuleDraft({
  planId: 'plan_914',
  calculatorTypeId: 'calc_premium',
  version: '2024.1',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2099-12-31',
  sourceReference: 'LIC Circular Ref 2024/01',
  sourceTitle: 'New Endowment Official Rule Sheet',
  sourceType: 'circular',
  rulePayload: {
    baseRatePerThousand: 49.70,
    minAge: 8,
    maxAge: 55,
    minTerm: 12,
    maxTerm: 35,
    minSumAssured: 100000,
    modeRebates: { yearly: 2.0, 'half-yearly': 1.0, quarterly: 0.0, monthly: 0.0, single: 0.0 },
    highSaRebates: [{ minSa: 500000, rebatePerThousand: 1.5 }],
    gstRateFirstYear: 4.5,
    gstRateRenewal: 2.25
  },
  actor: 'actuary_admin'
});
```

### Workflow C: Verifying & Activating a Rule
```typescript
// 1. Actuary reviews official circular and signs off
await ruleService.verifyRule({
  ruleId,
  verifiedBy: 'senior_actuary_rahul',
  verificationNotes: 'Cross-checked against LIC Gazette Circular No. 2024/01 dated 2024-01-01.',
  status: 'verified'
});

// 2. System activates rule for production use
const activation = await ruleService.activateRule({
  ruleId,
  actor: 'system_admin'
});

if (activation.success) {
  console.log('Rule successfully activated for production calculation!');
}
```

---

## 6. Audit Trail & Traceability

Every operational mutation (Create, Update, Verify, Activate, Deactivate) is logged automatically in the `audit_logs` table with:
- `actor`: User ID or system service account.
- `action`: `CREATE`, `UPDATE`, `VERIFY`, `ACTIVATE`, `DEACTIVATE`.
- `entity_type`: `rule_sets` / `lic_plans`.
- `entity_id`: Target primary key.
- `old_value_json`: State before operation.
- `new_value_json`: State after operation.
- `timestamp`: ISO UTC timestamp.
