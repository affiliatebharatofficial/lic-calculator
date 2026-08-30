# Cloudflare D1 Database Architecture — LIC Calculator

**Primary Domain:** `https://lic-calculators.com/`  
**Database Engine:** Cloudflare D1 (Distributed SQLite on Cloudflare Global Edge)

---

## 1. Architectural Overview & Normalized Schema

Cloudflare D1 serves as the authoritative, versioned persistence repository for LIC plan definitions, calculator metadata, verified calculation rule sets, structured conditions, and immutable audit trails.

```text
                               +-------------------+
                               | calculator_types  |
                               +-------------------+
                                         | 1
                                         |
                                         | N
+-------------------+ 1       N +-------------------+ N       1 +-------------------+
|     lic_plans     |-----------|     rule_sets     |-----------|   plan_variants   |
+-------------------+           +-------------------+           +-------------------+
          |                               | 1                             |
          | 1                             |                               |
          |                               | N                             |
          | N                             +-------------------+           |
+-------------------+                     |  rule_conditions  |           |
|    audit_logs     |                     +-------------------+           |
+-------------------+                                                     |
          ^                                                               |
          +---------------------------------------------------------------+
```

---

## 2. Table Specifications & Constraints

### 1. `lic_plans`
Stores canonical plan definitions, regulatory identifiers, and top-level verification state.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Unique ID (e.g. `plan_914`) |
| `plan_code` | `TEXT` | `UNIQUE NOT NULL` | Text code (e.g. `"914"`) |
| `table_no` | `INTEGER` | `UNIQUE NOT NULL` | Numeric plan table number (e.g. `914`) |
| `uin` | `TEXT` | Nullable | IRDAI Unique Identification Number |
| `plan_name` | `TEXT` | `NOT NULL` | Official name (e.g. "LIC New Endowment Plan") |
| `slug` | `TEXT` | `UNIQUE NOT NULL` | SEO-friendly URL slug |
| `plan_type` | `TEXT` | `NOT NULL CHECK(...)` | `endowment`, `money-back`, `whole-life`, `term-assurance`, `pension-annuity`, `unit-linked`, `micro-insurance`, `health` |
| `status` | `TEXT` | `NOT NULL CHECK(...)` | `draft`, `active`, `withdrawn`, `archived` |
| `is_with_profits` | `INTEGER` | `NOT NULL DEFAULT 1` | `1` if participating with profits, `0` if non-par |
| `source_reference` | `TEXT` | Nullable | Official publication citation |
| `source_title` | `TEXT` | Nullable | Document title |
| `source_type` | `TEXT` | `CHECK(...)` | `official_brochure`, `official_policy_doc`, `circular`, `statutory_notice`, `test_fixture` |
| `verification_status` | `TEXT` | `NOT NULL CHECK(...)` | `pending`, `verified`, `rejected`, `expired` |
| `verified_at` | `DATETIME` | Nullable | Timestamp of actuarial verification |
| `verification_notes` | `TEXT` | Nullable | Detailed verification log |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Row creation timestamp |
| `updated_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Row update timestamp |

---

### 2. `plan_variants`
Stores option-specific variants (e.g. Single vs Regular premium, Option I vs Option II).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Unique variant ID |
| `plan_id` | `TEXT` | `NOT NULL REFERENCES lic_plans(id)` | Parent plan foreign key |
| `variant_code` | `TEXT` | `NOT NULL` | Unique per plan (e.g. `"STANDARD"`, `"OPTION_1"`) |
| `variant_name` | `TEXT` | `NOT NULL` | Display name |
| `status` | `TEXT` | `NOT NULL CHECK(...)` | `draft`, `active`, `withdrawn`, `archived` |
| `effective_from` | `DATE` | `NOT NULL` | ISO start date |
| `effective_to` | `DATE` | Nullable | ISO expiry date (null = unbounded) |
| `verification_status` | `TEXT` | `NOT NULL CHECK(...)` | `pending`, `verified`, `rejected`, `expired` |
| `created_at` / `updated_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Timestamps |

---

### 3. `calculator_types`
Registry of supported calculation modules.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Unique ID (e.g. `calc_premium`) |
| `calculator_code` | `TEXT` | `UNIQUE NOT NULL` | Code (e.g. `premium`, `maturity`, `surrender`, `loan`, `pension`) |
| `name` | `TEXT` | `NOT NULL` | Display name |
| `category` | `TEXT` | `NOT NULL CHECK(...)` | `general`, `surrender`, `protection`, `retirement` |
| `status` | `TEXT` | `NOT NULL CHECK(...)` | `active`, `inactive`, `deprecated` |

---

### 4. `rule_sets`
The normalized repository of versioned, effective-dated financial rules.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Unique rule set ID |
| `plan_id` | `TEXT` | `NOT NULL REFERENCES lic_plans(id)` | Parent plan |
| `variant_id` | `TEXT` | `REFERENCES plan_variants(id)` | Optional variant |
| `calculator_type_id` | `TEXT` | `NOT NULL REFERENCES calculator_types(id)` | Target calculator |
| `version` | `TEXT` | `NOT NULL` | Semantic version (e.g. `"2024.1"`) |
| `status` | `TEXT` | `NOT NULL CHECK(...)` | `draft`, `active`, `inactive`, `archived` |
| `effective_from` | `DATE` | `NOT NULL` | ISO start date |
| `effective_to` | `DATE` | Nullable | ISO end date |
| `policy_year_from` | `INTEGER` | `DEFAULT 1` | Starting policy year scope |
| `policy_year_to` | `INTEGER` | Nullable | Ending policy year scope (null = all future) |
| `source_reference` | `TEXT` | `NOT NULL` | Source citation (e.g. circular number) |
| `source_title` | `TEXT` | `NOT NULL` | Source document title |
| `source_type` | `TEXT` | `NOT NULL CHECK(...)` | Source classification |
| `verification_status` | `TEXT` | `NOT NULL CHECK(...)` | `pending`, `verified`, `rejected`, `expired` |
| `verified_at` | `DATETIME` | Nullable | Verification timestamp |
| `verification_notes` | `TEXT` | Nullable | Actuarial signoff notes |
| `rule_payload_json` | `TEXT` | `NOT NULL` | Structured rule values (JSON) |
| `created_at` / `updated_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Timestamps |

---

### 5. `audit_logs`
Immutable audit trail recording every change to plans and rules.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Unique audit event ID |
| `actor` | `TEXT` | `NOT NULL` | Operator / admin identifier |
| `action` | `TEXT` | `NOT NULL CHECK(...)` | `CREATE`, `UPDATE`, `ACTIVATE`, `DEACTIVATE`, `VERIFY`, `REJECT`, `ARCHIVE` |
| `entity_type` | `TEXT` | `NOT NULL` | `lic_plans`, `rule_sets`, `plan_variants`, etc. |
| `entity_id` | `TEXT` | `NOT NULL` | Target entity primary key |
| `old_value_json` | `TEXT` | Nullable | State before modification |
| `new_value_json` | `TEXT` | Nullable | State after modification |
| `timestamp` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Event timestamp |

---

## 3. High-Performance Edge Indexes

Covering indexes optimized for sub-millisecond lookups on Cloudflare Workers edge:

```sql
CREATE INDEX idx_lic_plans_code ON lic_plans(plan_code, status, verification_status);
CREATE INDEX idx_lic_plans_table ON lic_plans(table_no, status);
CREATE INDEX idx_plan_variants_lookup ON plan_variants(plan_id, variant_code, status);
CREATE INDEX idx_rule_sets_lookup ON rule_sets(plan_id, calculator_type_id, status, verification_status, effective_from, effective_to);
CREATE INDEX idx_rule_sets_policy_years ON rule_sets(policy_year_from, policy_year_to);
CREATE INDEX idx_rule_conditions_ruleset ON rule_conditions(rule_set_id, condition_type);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, timestamp);
```

---

## 4. D1 Migration Management

Migrations are stored chronologically in `db/migrations/`:
- `0001_initial_schema.sql` (Foundational setup)
- `0002_verified_rule_system.sql` (Phase 4 normalized rule system & audit logs)

### Running Migrations via Wrangler

#### Local Development:
```bash
npx wrangler d1 migrations apply DB --local
```

#### Staging:
```bash
npx wrangler d1 migrations apply DB --env staging
```

#### Production:
```bash
npx wrangler d1 migrations apply DB --remote
```

---

## 5. Environment Separation Strategy

| Environment | Database Binding | Purpose |
| :--- | :--- | :--- |
| **Local / Test** | `MockD1Database` / SQLite local | Automated Vitest test suites and local dev server without network calls |
| **Staging** | `lic-calc-d1-staging` | Pre-production validation and actuarial review of pending rules |
| **Production** | `lic-calc-d1-prod` | Authoritative verified rule store accessed by Cloudflare Workers |
