/**
 * Cloudflare D1 Schema Types & Database Interfaces
 */

export type PlanStatus = 'draft' | 'active' | 'withdrawn' | 'archived';

export type PlanType =
  | 'endowment'
  | 'money-back'
  | 'whole-life'
  | 'term-assurance'
  | 'pension-annuity'
  | 'unit-linked'
  | 'micro-insurance'
  | 'health';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export type RuleSetStatus = 'draft' | 'active' | 'inactive' | 'archived';

export type SourceType =
  | 'official_brochure'
  | 'official_policy_doc'
  | 'circular'
  | 'statutory_notice'
  | 'test_fixture';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'ACTIVATE'
  | 'DEACTIVATE'
  | 'VERIFY'
  | 'REJECT'
  | 'ARCHIVE';

export interface LicPlanRow {
  readonly id: string;
  readonly plan_code: string;
  readonly table_no: number;
  readonly uin?: string | null;
  readonly plan_name: string;
  readonly slug: string;
  readonly plan_type: PlanType;
  readonly description?: string | null;
  readonly launch_date?: string | null;
  readonly withdrawal_date?: string | null;
  readonly status: PlanStatus;
  readonly is_with_profits: number;
  readonly source_reference?: string | null;
  readonly source_title?: string | null;
  readonly source_type?: SourceType | null;
  readonly verification_status: VerificationStatus;
  readonly verified_at?: string | null;
  readonly verification_notes?: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface PlanVariantRow {
  readonly id: string;
  readonly plan_id: string;
  readonly variant_code: string;
  readonly variant_name: string;
  readonly status: PlanStatus;
  readonly effective_from: string;
  readonly effective_to?: string | null;
  readonly source_reference?: string | null;
  readonly verification_status: VerificationStatus;
  readonly verified_at?: string | null;
  readonly verification_notes?: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CalculatorTypeRow {
  readonly id: string;
  readonly calculator_code: string;
  readonly name: string;
  readonly description?: string | null;
  readonly category: 'general' | 'surrender' | 'protection' | 'retirement';
  readonly status: 'active' | 'inactive' | 'deprecated';
  readonly created_at: string;
  readonly updated_at: string;
}

export interface RuleSetRow {
  readonly id: string;
  readonly plan_id: string;
  readonly variant_id?: string | null;
  readonly calculator_type_id: string;
  readonly version: string;
  readonly status: RuleSetStatus;
  readonly effective_from: string;
  readonly effective_to?: string | null;
  readonly policy_year_from?: number | null;
  readonly policy_year_to?: number | null;
  readonly source_reference: string;
  readonly source_title: string;
  readonly source_type: SourceType;
  readonly verification_status: VerificationStatus;
  readonly verified_at?: string | null;
  readonly verification_notes?: string | null;
  readonly rule_scope_json?: string | null;
  readonly rule_payload_json: string;
  readonly checksum?: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface RuleConditionRow {
  readonly id: string;
  readonly rule_set_id: string;
  readonly condition_type: string;
  readonly min_value?: number | null;
  readonly max_value?: number | null;
  readonly operator: 'BETWEEN' | 'EQ' | 'GTE' | 'LTE' | 'IN';
  readonly value_text?: string | null;
  readonly created_at: string;
}

export interface AuditLogRow {
  readonly id: string;
  readonly actor: string;
  readonly action: AuditAction;
  readonly entity_type: string;
  readonly entity_id: string;
  readonly old_value_json?: string | null;
  readonly new_value_json?: string | null;
  readonly timestamp: string;
}

export interface RuleResolutionQuery {
  readonly planCode: string;
  readonly variantCode?: string;
  readonly calculatorCode: string;
  readonly calculationDate?: string; // ISO date "YYYY-MM-DD"
  readonly policyYear?: number;
  readonly explicitVersion?: string;
}
