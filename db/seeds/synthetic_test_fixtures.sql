-- ============================================================================
-- SYNTHETIC D1 TEST FIXTURES — NOT REAL LIC POLICY DATA
-- ============================================================================
-- Used exclusively for automated test suites and end-to-end integration tests.
-- These fixtures test D1 database lookup, versioning, date scoping, and verification status.
-- ============================================================================

-- Synthetic Test Plan
INSERT OR IGNORE INTO lic_plans (id, plan_code, table_no, uin, plan_name, slug, plan_type, description, status, is_with_profits, source_reference, source_title, source_type, verification_status, verified_at, verification_notes) VALUES
('plan_test_914', 'TEST_914', 99914, 'SYNTHETIC_UIN_914', 'Synthetic Endowment Test Plan', 'synthetic-test-plan-914', 'endowment', 'Synthetic plan for automated D1 integration testing', 'active', 1, 'TEST FIXTURE REF 001', 'Synthetic Test Fixture Document', 'test_fixture', 'verified', '2024-01-01 00:00:00', 'Automated test suite verified fixture');

-- Synthetic Test Variant
INSERT OR IGNORE INTO plan_variants (id, plan_id, variant_code, variant_name, status, effective_from, effective_to, source_reference, verification_status, verified_at) VALUES
('variant_test_std', 'plan_test_914', 'STANDARD', 'Standard Option', 'active', '2020-01-01', '2099-12-31', 'TEST FIXTURE REF 001', 'verified', '2024-01-01 00:00:00');

-- Synthetic Premium Rule Set (Verified & Active)
INSERT OR IGNORE INTO rule_sets (
    id, plan_id, variant_id, calculator_type_id, version, status,
    effective_from, effective_to, policy_year_from, policy_year_to,
    source_reference, source_title, source_type, verification_status, verified_at, verification_notes,
    rule_payload_json
) VALUES (
    'ruleset_test_premium_914',
    'plan_test_914',
    'variant_test_std',
    'calc_premium',
    'SYNTHETIC_2024.1',
    'active',
    '2020-01-01',
    '2099-12-31',
    1,
    NULL,
    'TEST DATA — NOT REAL LIC POLICY DATA',
    'Synthetic Premium Rule Document',
    'test_fixture',
    'verified',
    '2024-01-01 00:00:00',
    'Verified for automated test suite execution',
    '{"baseRatePerThousand":49.70,"minAge":8,"maxAge":55,"minTerm":12,"maxTerm":35,"minSumAssured":100000,"modeRebates":{"yearly":2.0,"half-yearly":1.0,"quarterly":0.0,"monthly":0.0,"single":0.0},"highSaRebates":[{"minSa":200000,"maxSa":499999,"rebatePerThousand":1.0},{"minSa":500000,"rebatePerThousand":1.5}],"gstRateFirstYear":4.5,"gstRateRenewal":2.25,"riderRatePerThousand":1.0}'
);

-- Synthetic Surrender Rule Set (Verified & Active)
INSERT OR IGNORE INTO rule_sets (
    id, plan_id, variant_id, calculator_type_id, version, status,
    effective_from, effective_to, policy_year_from, policy_year_to,
    source_reference, source_title, source_type, verification_status, verified_at, verification_notes,
    rule_payload_json
) VALUES (
    'ruleset_test_surrender_914',
    'plan_test_914',
    'variant_test_std',
    'calc_surrender',
    'SYNTHETIC_2024.1',
    'active',
    '2020-01-01',
    '2099-12-31',
    1,
    NULL,
    'TEST DATA — NOT REAL LIC POLICY DATA',
    'Synthetic Surrender Rule Document',
    'test_fixture',
    'verified',
    '2024-01-01 00:00:00',
    'Verified for automated test suite execution',
    '{"minPaidYearsToAcquireValue":2,"gsvFactors":[{"completedYears":2,"policyTerm":20,"factor":0.30},{"completedYears":3,"policyTerm":20,"factor":0.35},{"completedYears":5,"policyTerm":20,"factor":0.50},{"completedYears":10,"policyTerm":20,"factor":0.55},{"completedYears":20,"policyTerm":20,"factor":0.90}],"gsvBonusFactors":[{"completedYears":2,"policyTerm":20,"factor":0.00},{"completedYears":3,"policyTerm":20,"factor":0.15},{"completedYears":5,"policyTerm":20,"factor":0.17},{"completedYears":20,"policyTerm":20,"factor":0.30}],"ssvFactors":[{"completedYears":2,"policyTerm":20,"factor":0.40},{"completedYears":3,"policyTerm":20,"factor":0.45},{"completedYears":5,"policyTerm":20,"factor":0.55},{"completedYears":10,"policyTerm":20,"factor":0.70},{"completedYears":20,"policyTerm":20,"factor":1.00}],"ssvBonusFactor":1.0}'
);

-- Synthetic Unverified Draft Rule (To test safe rejection of unverified rules)
INSERT OR IGNORE INTO rule_sets (
    id, plan_id, variant_id, calculator_type_id, version, status,
    effective_from, effective_to, policy_year_from, policy_year_to,
    source_reference, source_title, source_type, verification_status, verified_at, verification_notes,
    rule_payload_json
) VALUES (
    'ruleset_test_unverified_draft',
    'plan_test_914',
    'variant_test_std',
    'calc_premium',
    'DRAFT_UNVERIFIED_2025',
    'draft',
    '2025-01-01',
    NULL,
    1,
    NULL,
    'TEST DATA — NOT REAL LIC POLICY DATA',
    'Draft Unverified Rate Sheet',
    'test_fixture',
    'pending',
    NULL,
    'Pending actuarial review',
    '{"baseRatePerThousand":99.99,"minAge":0,"maxAge":100,"minTerm":1,"maxTerm":100,"minSumAssured":1000,"modeRebates":{},"highSaRebates":[],"gstRateFirstYear":0,"gstRateRenewal":0}'
);
