/**
 * Rule Versioning and Rule Provider Types
 */

export type RuleStatus = 'draft' | 'active' | 'deprecated' | 'archived';

export interface RuleVersion {
  readonly version: string;            // e.g. "2024.1", "1.0.0"
  readonly planCode: string;           // e.g. "914", "915", "GENERAL"
  readonly ruleType: string;           // e.g. "premium_rate", "gsv_factor", "bonus_rate"
  readonly effectiveFrom: string;      // ISO Date "YYYY-MM-DD"
  readonly effectiveTo?: string;       // ISO Date "YYYY-MM-DD" or undefined for currently active
  readonly status: RuleStatus;
  readonly sourceReference: string;    // e.g. "LIC Circular Ref No. CO/Actl/...", "TEST_FIXTURE"
  readonly checksum?: string;
}

export interface RuleQuery {
  readonly planCode: string;
  readonly ruleType: string;
  readonly asOfDate?: string;          // ISO Date "YYYY-MM-DD", defaults to current date
  readonly version?: string;           // Optional explicit version override
}
