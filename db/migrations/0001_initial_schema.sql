-- Cloudflare D1 SQLite Migration 0001: Initial Schema
-- Architectural Foundation for LIC Calculator Platform

-- 1. Admin Users & Security
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('superadmin', 'editor', 'viewer')) DEFAULT 'viewer',
    status TEXT NOT NULL CHECK(status IN ('active', 'suspended', 'invited')) DEFAULT 'active',
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    phone_number TEXT,
    full_name TEXT,
    preferred_locale TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. LIC Plans & Classification
CREATE TABLE IF NOT EXISTS lic_plans (
    id TEXT PRIMARY KEY,
    table_no INTEGER UNIQUE NOT NULL,
    uin TEXT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('endowment', 'money-back', 'whole-life', 'term-assurance', 'pension-annuity', 'unit-linked', 'micro-insurance', 'health')),
    description TEXT,
    launch_date DATE,
    withdrawal_date DATE,
    status TEXT NOT NULL CHECK(status IN ('active', 'withdrawn', 'draft')) DEFAULT 'active',
    is_with_profits INTEGER NOT NULL DEFAULT 1,
    min_age INTEGER NOT NULL DEFAULT 0,
    max_age INTEGER NOT NULL DEFAULT 70,
    min_term INTEGER NOT NULL DEFAULT 5,
    max_term INTEGER NOT NULL DEFAULT 40,
    min_sum_assured INTEGER NOT NULL DEFAULT 50000,
    max_sum_assured INTEGER,
    allowed_frequencies TEXT NOT NULL DEFAULT '["yearly","half-yearly","quarterly","monthly"]',
    source_reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plan_variants (
    id TEXT PRIMARY KEY,
    plan_id TEXT NOT NULL REFERENCES lic_plans(id) ON DELETE CASCADE,
    variant_code TEXT NOT NULL,
    name TEXT NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    min_term INTEGER NOT NULL,
    max_term INTEGER NOT NULL,
    min_sum_assured INTEGER NOT NULL,
    max_sum_assured INTEGER,
    status TEXT NOT NULL CHECK(status IN ('active', 'withdrawn')) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_id, variant_code)
);

-- 3. Calculator Definitions & Generic Rule Engine
CREATE TABLE IF NOT EXISTS calculator_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calculator_rules (
    id TEXT PRIMARY KEY,
    plan_table_no INTEGER NOT NULL,
    rule_type TEXT NOT NULL,
    version TEXT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    status TEXT NOT NULL CHECK(status IN ('active', 'deprecated', 'draft')) DEFAULT 'active',
    rule_payload JSON NOT NULL,
    source_reference TEXT,
    created_by TEXT REFERENCES admin_users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_table_no, rule_type, version, effective_from)
);

-- 4. Specific Rule Type Versioned Tables
CREATE TABLE IF NOT EXISTS premium_rules (
    id TEXT PRIMARY KEY,
    plan_table_no INTEGER NOT NULL,
    version TEXT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    status TEXT NOT NULL CHECK(status IN ('active', 'deprecated', 'draft')) DEFAULT 'active',
    tabular_rates_payload JSON NOT NULL,
    rebate_rates_payload JSON,
    rider_rates_payload JSON,
    source_reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maturity_rules (
    id TEXT PRIMARY KEY,
    plan_table_no INTEGER NOT NULL,
    version TEXT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    status TEXT NOT NULL CHECK(status IN ('active', 'deprecated', 'draft')) DEFAULT 'active',
    survival_benefit_schedule JSON,
    maturity_benefit_formula JSON NOT NULL,
    source_reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bonus_rules (
    id TEXT PRIMARY KEY,
    plan_table_no INTEGER NOT NULL,
    valuation_year INTEGER NOT NULL,
    version TEXT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    status TEXT NOT NULL CHECK(status IN ('active', 'deprecated', 'draft')) DEFAULT 'active',
    simple_reversionary_bonus_rate REAL NOT NULL, -- per thousand sum assured
    final_additional_bonus_schedule JSON,
    loyalty_addition_schedule JSON,
    source_reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_table_no, valuation_year)
);

CREATE TABLE IF NOT EXISTS surrender_rules (
    id TEXT PRIMARY KEY,
    plan_table_no INTEGER NOT NULL,
    version TEXT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    status TEXT NOT NULL CHECK(status IN ('active', 'deprecated', 'draft')) DEFAULT 'active',
    gsv_factors_payload JSON NOT NULL, -- Guaranteed Surrender Value factors table
    ssv_factors_payload JSON,         -- Special Surrender Value factors table
    min_paid_years_required INTEGER NOT NULL DEFAULT 2,
    source_reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loan_rules (
    id TEXT PRIMARY KEY,
    plan_table_no INTEGER NOT NULL,
    version TEXT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    status TEXT NOT NULL CHECK(status IN ('active', 'deprecated', 'draft')) DEFAULT 'active',
    max_loan_percentage_surrender_inforce REAL NOT NULL DEFAULT 0.90, -- 90% of surrender value
    max_loan_percentage_surrender_paidup REAL NOT NULL DEFAULT 0.80,  -- 80% of surrender value
    current_interest_rate REAL NOT NULL DEFAULT 0.095,               -- 9.5% p.a.
    source_reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Calculation Telemetry & Audit
CREATE TABLE IF NOT EXISTS calculations (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    calculator_type TEXT NOT NULL,
    plan_table_no INTEGER,
    inputs_hash TEXT NOT NULL,
    input_payload JSON NOT NULL,
    rule_version_applied TEXT NOT NULL,
    ip_hash TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calculation_results (
    id TEXT PRIMARY KEY,
    calculation_id TEXT NOT NULL REFERENCES calculations(id) ON DELETE CASCADE,
    primary_amount REAL NOT NULL,
    breakdown_payload JSON NOT NULL,
    projections_payload JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Content, Articles, FAQs, Glossary
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content_markdown TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('published', 'draft', 'archived')) DEFAULT 'draft',
    locale TEXT NOT NULL DEFAULT 'en',
    author_id TEXT REFERENCES admin_users(id),
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'en',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS glossary (
    id TEXT PRIMARY KEY,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'en',
    slug TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Translations & Versioning
CREATE TABLE IF NOT EXISTS translations (
    id TEXT PRIMARY KEY,
    namespace TEXT NOT NULL,
    translation_key TEXT NOT NULL,
    locale TEXT NOT NULL,
    content_value TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(namespace, translation_key, locale)
);

CREATE TABLE IF NOT EXISTS translation_versions (
    id TEXT PRIMARY KEY,
    translation_id TEXT NOT NULL REFERENCES translations(id) ON DELETE CASCADE,
    content_value TEXT NOT NULL,
    changed_by TEXT REFERENCES admin_users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Future AI Conversations & Usage Logs
CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    session_id TEXT NOT NULL,
    context_type TEXT CHECK(context_type IN ('policy_explanation', 'surrender_analysis', 'general_query')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_usage (
    id TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES ai_conversations(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    latency_ms INTEGER,
    status TEXT NOT NULL DEFAULT 'success',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS uploaded_documents (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    storage_r2_key TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    extraction_status TEXT NOT NULL CHECK(extraction_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    extracted_data_payload JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT REFERENCES admin_users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    changes_payload JSON,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for Fast Lookups
CREATE INDEX IF NOT EXISTS idx_lic_plans_table_no ON lic_plans(table_no);
CREATE INDEX IF NOT EXISTS idx_lic_plans_category ON lic_plans(category);
CREATE INDEX IF NOT EXISTS idx_calculator_rules_lookup ON calculator_rules(plan_table_no, rule_type, status, effective_from);
CREATE INDEX IF NOT EXISTS idx_premium_rules_lookup ON premium_rules(plan_table_no, status, effective_from);
CREATE INDEX IF NOT EXISTS idx_surrender_rules_lookup ON surrender_rules(plan_table_no, status, effective_from);
CREATE INDEX IF NOT EXISTS idx_bonus_rules_lookup ON bonus_rules(plan_table_no, valuation_year);
CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON calculations(created_at);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug, locale);
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(locale, namespace, translation_key);
