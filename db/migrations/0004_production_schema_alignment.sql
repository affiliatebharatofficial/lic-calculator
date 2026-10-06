-- ============================================================================
-- 0004: Production Schema Alignment
-- ============================================================================
-- Problem: migration 0001 created `calculator_types` with (slug, is_active)
-- while the application code (src/lib/db/types.ts + D1RuleProvider) expects
-- (calculator_code, description, status). Migration 0002 used
-- CREATE TABLE IF NOT EXISTS, so the code-shaped table never replaced the
-- 0001 shape. Every production query joining on ct.calculator_code throws,
-- which surfaced as HTTP 500 on /api/plans and all /api/calculators/*.
--
-- Also: code reads `lic_plans.plan_name`, which 0002 never added
-- (0001 only has `name`).
--
-- Both tables are empty in production, so rebuilding is data-safe.
-- ============================================================================

-- 1. Rebuild calculator_types in the shape the code expects
CREATE TABLE IF NOT EXISTS calculator_types_new (
    id TEXT PRIMARY KEY,
    calculator_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general' CHECK(category IN ('general', 'surrender', 'protection', 'retirement')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'deprecated')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS calculator_types;
ALTER TABLE calculator_types_new RENAME TO calculator_types;

-- 2. lic_plans: add plan_name used by LicPlanRow / API responses
ALTER TABLE lic_plans ADD COLUMN plan_name TEXT;
UPDATE lic_plans SET plan_name = name WHERE plan_name IS NULL OR plan_name = '';
