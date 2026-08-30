/**
 * Database Entity Types matching D1 Schema
 */

export interface DbAdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'editor' | 'viewer';
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface DbLicPlan {
  id: string;
  table_no: number;
  uin: string | null;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  status: 'active' | 'withdrawn';
  is_with_profits: number; // 0 or 1
  min_age: number;
  max_age: number;
  min_term: number;
  max_term: number;
  min_sum_assured: number;
  max_sum_assured: number | null;
  allowed_frequencies: string; // JSON array
  source_reference: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCalculatorRule {
  id: string;
  plan_table_no: number;
  rule_type: string;
  version: string;
  effective_from: string;
  effective_to: string | null;
  status: 'active' | 'deprecated' | 'draft';
  rule_payload: string; // JSON
  source_reference: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCalculationRecord {
  id: string;
  calculator_type: string;
  plan_table_no: number | null;
  inputs_hash: string;
  input_payload: string; // JSON
  output_summary: string; // JSON
  rule_version_applied: string;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface DbAuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  changes_payload: string | null; // JSON
  ip_address: string | null;
  created_at: string;
}
