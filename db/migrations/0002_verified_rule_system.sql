-- Cloudflare D1 SQLite Migration 0002: Verified Rule System & Traceability
-- Implements normalized rule sets, condition scoping, verification lifecycle, and audit logs.

-- 1. Enhanced Calculator Types
CREATE TABLE IF NOT EXISTS calculator_types (
    id TEXT PRIMARY KEY,
    calculator_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK(category IN ('general', 'surrender', 'protection', 'retirement')),
    status TEXT NOT NULL CHECK(status IN ('active', 'inactive', 'deprecated')) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enhanced LIC Plans Columns (ALTER for compatibility)
ALTER TABLE lic_plans ADD COLUMN plan_code TEXT;
ALTER TABLE lic_plans ADD COLUMN plan_type TEXT;
ALTER TABLE lic_plans ADD COLUMN source_title TEXT;
ALTER TABLE lic_plans ADD COLUMN source_type TEXT;
ALTER TABLE lic_plans ADD COLUMN verification_status TEXT DEFAULT 'verified';
ALTER TABLE lic_plans ADD COLUMN verified_at DATETIME;
ALTER TABLE lic_plans ADD COLUMN verification_notes TEXT;

-- 3. Plan Variants Columns
ALTER TABLE plan_variants ADD COLUMN variant_name TEXT;
ALTER TABLE plan_variants ADD COLUMN effective_from DATE;
ALTER TABLE plan_variants ADD COLUMN effective_to DATE;
ALTER TABLE plan_variants ADD COLUMN source_reference TEXT;
ALTER TABLE plan_variants ADD COLUMN verification_status TEXT DEFAULT 'verified';
ALTER TABLE plan_variants ADD COLUMN verified_at DATETIME;
ALTER TABLE plan_variants ADD COLUMN verification_notes TEXT;

-- 4. Normalized Rule Sets with Scope & Verification Lifecycle
CREATE TABLE IF NOT EXISTS rule_sets (
    id TEXT PRIMARY KEY,
    plan_id TEXT NOT NULL REFERENCES lic_plans(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES plan_variants(id) ON DELETE SET NULL,
    calculator_type_id TEXT NOT NULL REFERENCES calculator_types(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('draft', 'active', 'inactive', 'archived')) DEFAULT 'draft',
    effective_from DATE NOT NULL,
    effective_to DATE,
    policy_year_from INTEGER DEFAULT 1,
    policy_year_to INTEGER,
    source_reference TEXT NOT NULL,
    source_title TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK(source_type IN ('official_brochure', 'official_policy_doc', 'circular', 'statutory_notice', 'test_fixture')),
    verification_status TEXT NOT NULL CHECK(verification_status IN ('pending', 'verified', 'rejected', 'expired')) DEFAULT 'pending',
    verified_at DATETIME,
    verification_notes TEXT,
    rule_scope_json TEXT,
    rule_payload_json TEXT NOT NULL,
    checksum TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_id, calculator_type_id, version, effective_from)
);

-- 5. Structured Rule Eligibility & Constraints
CREATE TABLE IF NOT EXISTS rule_conditions (
    id TEXT PRIMARY KEY,
    rule_set_id TEXT NOT NULL REFERENCES rule_sets(id) ON DELETE CASCADE,
    condition_type TEXT NOT NULL CHECK(condition_type IN ('age_range', 'term_range', 'sum_assured_range', 'ppt_range', 'frequency', 'gender', 'smoker_status')),
    min_value REAL,
    max_value REAL,
    operator TEXT NOT NULL CHECK(operator IN ('BETWEEN', 'EQ', 'GTE', 'LTE', 'IN')) DEFAULT 'BETWEEN',
    value_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Comprehensive Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL CHECK(action IN ('CREATE', 'UPDATE', 'ACTIVATE', 'DEACTIVATE', 'VERIFY', 'REJECT', 'ARCHIVE')),
    entity_type TEXT NOT NULL CHECK(entity_type IN ('lic_plans', 'plan_variants', 'rule_sets', 'rule_conditions', 'calculator_types')),
    entity_id TEXT NOT NULL,
    old_value_json TEXT,
    new_value_json TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. High-Performance Covering Indexes for Edge Lookups
CREATE INDEX IF NOT EXISTS idx_lic_plans_table ON lic_plans(table_no, status);
CREATE INDEX IF NOT EXISTS idx_rule_sets_lookup ON rule_sets(plan_id, calculator_type_id, status, verification_status, effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_rule_sets_policy_years ON rule_sets(policy_year_from, policy_year_to);
CREATE INDEX IF NOT EXISTS idx_rule_conditions_ruleset ON rule_conditions(rule_set_id, condition_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at);
