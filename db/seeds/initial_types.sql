-- Canonical Calculator Types Seed Data
INSERT OR IGNORE INTO calculator_types (id, calculator_code, name, description, category, status) VALUES
('calc_premium', 'premium', 'LIC Premium Calculator', 'Calculates annual, half-yearly, and monthly installments with rebates and GST', 'general', 'active'),
('calc_maturity', 'maturity', 'LIC Maturity Calculator', 'Estimates lump-sum maturity proceeds including bonuses and FAB', 'general', 'active'),
('calc_bonus', 'bonus', 'LIC Bonus Calculator', 'Calculates Simple Reversionary Bonus and Final Additional Bonus accruals', 'general', 'active'),
('calc_surrender', 'surrender', 'LIC Surrender Value Calculator', 'Calculates Guaranteed (GSV) vs Special Surrender Value (SSV)', 'surrender', 'active'),
('calc_surrender_loss', 'surrender-loss', 'LIC Surrender Loss Calculator', 'Quantifies net monetary capital difference and loss percentage', 'surrender', 'active'),
('calc_loan', 'loan', 'LIC Policy Loan Calculator', 'Calculates maximum eligible loan borrowing limit and interest costs', 'general', 'active'),
('calc_term', 'term-insurance', 'LIC Term Insurance Calculator', 'Estimates pure term insurance coverage costs and mortality charges', 'protection', 'active'),
('calc_pension', 'pension', 'LIC Pension & Annuity Calculator', 'Calculates lifelong guaranteed monthly pension payouts from purchase corpus', 'retirement', 'active'),
('calc_comparison', 'comparison', 'LIC 3-Way Policy Decision Engine', 'Compares Surrender vs Paid-Up vs Continue quantitative projections', 'surrender', 'active');

-- Baseline LIC Plans (Metadata only — NO unverified financial rates)
INSERT OR IGNORE INTO lic_plans (id, plan_code, table_no, uin, plan_name, slug, plan_type, description, status, is_with_profits, source_reference, source_title, source_type, verification_status) VALUES
('plan_914', '914', 914, '512N277V02', 'LIC New Endowment Plan', 'lic-new-endowment-plan-914', 'endowment', 'Standard with-profits endowment assurance savings plan', 'active', 1, 'LIC Sales Brochure Table 914', 'LIC New Endowment Plan Product Document', 'official_brochure', 'pending'),
('plan_915', '915', 915, '512N278V02', 'LIC New Jeevan Anand', 'lic-new-jeevan-anand-915', 'whole-life', 'Endowment assurance with lifelong whole life risk cover', 'active', 1, 'LIC Sales Brochure Table 915', 'LIC New Jeevan Anand Product Document', 'official_brochure', 'pending'),
('plan_936', '936', 936, '512N304V02', 'LIC Jeevan Labh', 'lic-jeevan-labh-936', 'endowment', 'Limited premium paying endowment assurance plan', 'active', 1, 'LIC Sales Brochure Table 936', 'LIC Jeevan Labh Product Document', 'official_brochure', 'pending'),
('plan_945', '945', 945, '512N312V02', 'LIC Jeevan Umang', 'lic-jeevan-umang-945', 'whole-life', 'Whole life assurance with 8% annual survival benefits', 'active', 1, 'LIC Sales Brochure Table 945', 'LIC Jeevan Umang Product Document', 'official_brochure', 'pending'),
('plan_855', '855', 855, '512N329V01', 'LIC Tech Term', 'lic-tech-term-855', 'term-assurance', 'Pure term risk protection plan', 'active', 0, 'LIC Sales Brochure Table 855', 'LIC Tech Term Product Document', 'official_brochure', 'pending'),
('plan_857', '857', 857, '512N340V01', 'LIC Saral Pension', 'lic-saral-pension-857', 'pension-annuity', 'Standard immediate annuity pension plan', 'active', 0, 'LIC Sales Brochure Table 857', 'LIC Saral Pension Product Document', 'official_brochure', 'pending');
