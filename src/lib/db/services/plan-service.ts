/**
 * LIC Plan and Variant Service
 */

import type { D1DatabaseLike } from '../client';
import type { LicPlanRow, PlanVariantRow } from '../types';

export class PlanService {
  constructor(private readonly db: D1DatabaseLike) {}

  public async getPlanByCode(planCode: string): Promise<LicPlanRow | null> {
    const stmt = this.db.prepare<LicPlanRow>(`
      SELECT * FROM lic_plans WHERE plan_code = ? LIMIT 1
    `);
    stmt.bind(planCode);
    return stmt.first();
  }

  public async getPlanByTableNo(tableNo: number): Promise<LicPlanRow | null> {
    const stmt = this.db.prepare<LicPlanRow>(`
      SELECT * FROM lic_plans WHERE table_no = ? LIMIT 1
    `);
    stmt.bind(tableNo);
    return stmt.first();
  }

  public async listActivePlans(): Promise<LicPlanRow[]> {
    const stmt = this.db.prepare<LicPlanRow>(`
      SELECT * FROM lic_plans WHERE status = 'active' ORDER BY table_no ASC
    `);
    const res = await stmt.all();
    return res.results;
  }

  public async getVariantsByPlanId(planId: string): Promise<PlanVariantRow[]> {
    const stmt = this.db.prepare<PlanVariantRow>(`
      SELECT * FROM plan_variants WHERE plan_id = ? AND status = 'active'
    `);
    stmt.bind(planId);
    const res = await stmt.all();
    return res.results;
  }
}
