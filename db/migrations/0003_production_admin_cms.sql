-- Cloudflare D1 SQLite Migration 0003: Production Admin, CMS, RBAC, Rule Versioning, Regression Gates & Audit Logs
-- Establishes secure separation between public read-only calculators and the admin publishing lifecycle.

-- 1. Enhanced Admin Users & RBAC
CREATE TABLE IF NOT EXISTS admin_users_v2 (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'editor', 'reviewer')) DEFAULT 'editor',
    status TEXT NOT NULL CHECK(status IN ('active', 'suspended', 'invited')) DEFAULT 'active',
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until DATETIME,
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Secure Admin Sessions (HttpOnly, Secure Cookie tokens)
CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY, -- SHA-256 token hash
    user_id TEXT NOT NULL REFERENCES admin_users_v2(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Documented Actuarial Rule Sources
CREATE TABLE IF NOT EXISTS rule_sources (
    id TEXT PRIMARY KEY,
    source_title TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK(source_type IN ('official_document', 'official_webpage', 'policy_document', 'regulatory_document', 'internal_review', 'test_fixture', 'other')),
    publisher TEXT NOT NULL,
    publication_date DATE,
    effective_date DATE,
    source_reference TEXT NOT NULL,
    source_url TEXT,
    document_ref TEXT,
    verification_status TEXT NOT NULL CHECK(verification_status IN ('pending', 'verified', 'rejected', 'expired')) DEFAULT 'pending',
    verified_by TEXT,
    verified_at DATETIME,
    notes TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Managed Rule Sets (with versioning, publication state, and separation of duties)
CREATE TABLE IF NOT EXISTS managed_rule_sets (
    id TEXT PRIMARY KEY,
    plan_code TEXT NOT NULL,
    table_no INTEGER NOT NULL,
    calculator_code TEXT NOT NULL,
    version TEXT NOT NULL, -- e.g. 'v1', 'v2'
    status TEXT NOT NULL CHECK(status IN ('draft', 'review', 'verified', 'published', 'expired', 'rejected', 'archived', 'disabled')) DEFAULT 'draft',
    is_published INTEGER NOT NULL DEFAULT 0, -- 1 only when published to public
    calculation_strategy TEXT NOT NULL, -- Safe registered strategy identifier
    effective_from DATE NOT NULL,
    effective_to DATE,
    source_id TEXT REFERENCES rule_sources(id) ON DELETE RESTRICT,
    rule_payload_json TEXT NOT NULL,
    notes TEXT,
    created_by TEXT NOT NULL,
    reviewed_by TEXT,
    reviewed_at DATETIME,
    verified_by TEXT,
    verified_at DATETIME,
    published_by TEXT,
    published_at DATETIME,
    disabled_by TEXT,
    disabled_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_code, calculator_code, version)
);

-- 5. Rule Regression Test Fixtures (Automated Gate before Publishing)
CREATE TABLE IF NOT EXISTS rule_regression_fixtures (
    id TEXT PRIMARY KEY,
    rule_set_id TEXT NOT NULL REFERENCES managed_rule_sets(id) ON DELETE CASCADE,
    calculator_code TEXT NOT NULL,
    fixture_name TEXT NOT NULL,
    test_input_json TEXT NOT NULL,
    expected_output_json TEXT NOT NULL,
    last_test_status TEXT CHECK(last_test_status IN ('passed', 'failed', 'pending')) DEFAULT 'pending',
    last_run_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Content Items CMS
CREATE TABLE IF NOT EXISTS content_items (
    id TEXT PRIMARY KEY,
    content_id TEXT UNIQUE NOT NULL, -- e.g. 'surrender-guide-flagship'
    content_type TEXT NOT NULL CHECK(content_type IN ('article', 'calculator_copy', 'guide', 'disclaimer', 'legal', 'faq')),
    category TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Multilingual Content Translations
CREATE TABLE IF NOT EXISTS content_translations (
    id TEXT PRIMARY KEY,
    content_item_id TEXT NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK(locale IN ('en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te')),
    version INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    status TEXT NOT NULL CHECK(status IN ('draft', 'review', 'approved', 'published', 'archived')) DEFAULT 'draft',
    is_published INTEGER NOT NULL DEFAULT 0,
    created_by TEXT NOT NULL,
    reviewed_by TEXT,
    published_by TEXT,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_item_id, locale, version)
);

-- 8. Managed Glossary Entries
CREATE TABLE IF NOT EXISTS managed_glossary (
    id TEXT PRIMARY KEY,
    term_id TEXT NOT NULL,
    locale TEXT NOT NULL CHECK(locale IN ('en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te')),
    term_name TEXT NOT NULL,
    term_definition TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('draft', 'approved', 'published')) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(term_id, locale)
);

-- 9. Managed FAQs
CREATE TABLE IF NOT EXISTS managed_faqs (
    id TEXT PRIMARY KEY,
    locale TEXT NOT NULL CHECK(locale IN ('en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te')),
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    related_calculator TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Immutable Audit Logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    event_type TEXT NOT NULL, -- e.g. 'RULE_CREATED', 'RULE_PUBLISHED', 'RULE_VERIFIED', 'LOGIN_SUCCESS', etc.
    target_entity TEXT NOT NULL, -- e.g. 'managed_rule_sets', 'lic_plans', 'content_items'
    target_id TEXT NOT NULL,
    previous_state_json TEXT,
    new_state_json TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Performance & Boundary Indexes
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON admin_sessions(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_rule_sources_status ON rule_sources(verification_status);
CREATE INDEX IF NOT EXISTS idx_managed_rules_pub ON managed_rule_sets(plan_code, calculator_code, is_published, status, effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_content_translations_lookup ON content_translations(content_item_id, locale, is_published);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON admin_audit_logs(event_type, target_entity, target_id, created_at);
