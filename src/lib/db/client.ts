/**
 * Cloudflare D1 Client Wrapper & In-Memory Test Database
 */

export interface D1PreparedStatement<T = unknown> {
  bind(...values: unknown[]): D1PreparedStatement<T>;
  first<R = T>(colName?: string): Promise<R | null>;
  all<R = T>(): Promise<{ results: R[]; success: boolean }>;
  run(): Promise<{ success: boolean; meta: Record<string, unknown> }>;
}

export interface D1DatabaseLike {
  prepare<T = unknown>(query: string): D1PreparedStatement<T>;
  batch<T = unknown>(statements: D1PreparedStatement<T>[]): Promise<{ results: T[]; success: boolean }[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

/**
 * In-Memory SQLite Table Simulator for Vitest Testing
 */
export class MockD1Database implements D1DatabaseLike {
  public readonly tables: Map<string, Array<any>> = new Map();

  constructor() {
    this.tables.set('lic_plans', []);
    this.tables.set('plan_variants', []);
    this.tables.set('calculator_types', []);
    this.tables.set('rule_sets', []);
    this.tables.set('rule_conditions', []);
    this.tables.set('audit_logs', []);
  }

  public prepare<T = unknown>(query: string): D1PreparedStatement<T> {
    return new MockPreparedStatement<T>(query, this);
  }

  public async batch<T = unknown>(statements: D1PreparedStatement<T>[]): Promise<{ results: T[]; success: boolean }[]> {
    const results: { results: T[]; success: boolean }[] = [];
    for (const stmt of statements) {
      const res = await stmt.all<T>();
      results.push(res);
    }
    return results;
  }

  public async exec(_query: string): Promise<{ count: number; duration: number }> {
    return { count: 1, duration: 0.1 };
  }

  public insertRow(tableName: string, row: object): void {
    const table = this.tables.get(tableName);
    if (!table) {
      this.tables.set(tableName, [row as any]);
    } else {
      table.push(row as any);
    }
  }

  public clear(): void {
    for (const key of this.tables.keys()) {
      this.tables.set(key, []);
    }
  }
}

class MockPreparedStatement<T = unknown> implements D1PreparedStatement<T> {
  private boundValues: unknown[] = [];

  constructor(
    private readonly query: string,
    private readonly db: MockD1Database
  ) {}

  public bind(...values: unknown[]): D1PreparedStatement<T> {
    this.boundValues = values;
    return this;
  }

  public async first<R = T>(colName?: string): Promise<R | null> {
    const all = await this.all<R>();
    if (!all.results || all.results.length === 0) return null;
    const firstRow = all.results[0];
    if (!firstRow) return null;
    if (colName && typeof firstRow === 'object') {
      return (firstRow as Record<string, unknown>)[colName] as R;
    }
    return firstRow;
  }

  public async all<R = T>(): Promise<{ results: R[]; success: boolean }> {
    return this.executeMockQuery<R>();
  }

  public async run(): Promise<{ success: boolean; meta: Record<string, unknown> }> {
    const norm = this.query.trim().toUpperCase().replace(/\s+/g, ' ');

    if (norm.startsWith('INSERT INTO AUDIT_LOGS')) {
      const row = {
        id: this.boundValues[0],
        actor: this.boundValues[1],
        action: this.boundValues[2],
        entity_type: this.boundValues[3],
        entity_id: this.boundValues[4],
        old_value_json: this.boundValues[5],
        new_value_json: this.boundValues[6],
        timestamp: new Date().toISOString()
      };
      this.db.insertRow('audit_logs', row);
      return { success: true, meta: {} };
    }

    if (norm.startsWith('INSERT INTO RULE_SETS')) {
      const row = {
        id: this.boundValues[0],
        plan_id: this.boundValues[1],
        variant_id: this.boundValues[2],
        calculator_type_id: this.boundValues[3],
        version: this.boundValues[4],
        status: 'draft',
        effective_from: this.boundValues[5],
        effective_to: this.boundValues[6],
        policy_year_from: this.boundValues[7],
        policy_year_to: this.boundValues[8],
        source_reference: this.boundValues[9],
        source_title: this.boundValues[10],
        source_type: this.boundValues[11],
        verification_status: 'pending',
        rule_payload_json: this.boundValues[12],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.db.insertRow('rule_sets', row);
      return { success: true, meta: {} };
    }

    if (norm.startsWith('UPDATE RULE_SETS SET VERIFICATION_STATUS')) {
      const status = this.boundValues[0];
      const notes = this.boundValues[1];
      const id = this.boundValues[2];
      const ruleSets = (this.db.tables.get('rule_sets') || []) as any[];
      const found = ruleSets.find((r) => r.id === id);
      if (found) {
        found.verification_status = status;
        found.verification_notes = notes;
        found.verified_at = new Date().toISOString();
        found.updated_at = new Date().toISOString();
      }
      return { success: true, meta: {} };
    }

    if (norm.startsWith('UPDATE RULE_SETS SET STATUS')) {
      const id = this.boundValues[0];
      const ruleSets = (this.db.tables.get('rule_sets') || []) as any[];
      const found = ruleSets.find((r) => r.id === id);
      if (found) {
        found.status = 'active';
        found.updated_at = new Date().toISOString();
      }
      return { success: true, meta: {} };
    }

    return { success: true, meta: {} };
  }

  private executeMockQuery<R>(): { results: R[]; success: boolean } {
    const norm = this.query.trim().toUpperCase().replace(/\s+/g, ' ');

    if (norm.includes('FROM RULE_SETS RS') && norm.includes('JOIN CALCULATOR_TYPES CT')) {
      const plans = (this.db.tables.get('lic_plans') || []) as any[];
      const ruleSets = (this.db.tables.get('rule_sets') || []) as any[];
      const calcTypes = (this.db.tables.get('calculator_types') || []) as any[];

      const joined = ruleSets.map((rs) => {
        const plan = plans.find((p) => p.id === rs.plan_id || p.plan_code === rs.plan_id);
        const ct = calcTypes.find((c) => c.id === rs.calculator_type_id || c.calculator_code === rs.calculator_type_id);
        return {
          ...rs,
          plan_code: plan?.plan_code || rs.plan_id,
          calculator_code: ct?.calculator_code || rs.calculator_type_id
        };
      });

      // If filtering parameters provided in bind
      if (this.boundValues.length >= 2) {
        const planCode = String(this.boundValues[0] ?? '');
        const calcCode = String(this.boundValues[1] ?? '');
        const asOfDate = String(this.boundValues[2] ?? '9999-12-31');
        const policyYear = Number(this.boundValues[4] ?? 1);

        const filtered = joined
          .filter((rs) => {
            if (rs.plan_code !== planCode) return false;
            if (rs.calculator_code !== calcCode) return false;
            if (rs.status !== 'active') return false;
            if (rs.verification_status !== 'verified') return false;
            if (rs.effective_from > asOfDate) return false;
            if (rs.effective_to && rs.effective_to < asOfDate) return false;
            if (rs.policy_year_from && rs.policy_year_from > policyYear) return false;
            if (rs.policy_year_to && rs.policy_year_to < policyYear) return false;
            return true;
          })
          .sort((a, b) => b.effective_from.localeCompare(a.effective_from));

        return { results: filtered as unknown as R[], success: true };
      }

      return { results: joined as unknown as R[], success: true };
    }

    if (norm.includes('FROM LIC_PLANS')) {
      const plans = this.db.tables.get('lic_plans') || [];
      if (this.boundValues.length > 0) {
        const val = this.boundValues[0];
        const filtered = plans.filter((p: any) => p.plan_code === val || p.table_no === val || p.id === val);
        return { results: filtered as unknown as R[], success: true };
      }
      return { results: plans as unknown as R[], success: true };
    }

    if (norm.includes('FROM CALCULATOR_TYPES')) {
      const types = this.db.tables.get('calculator_types') || [];
      return { results: types as unknown as R[], success: true };
    }

    if (norm.includes('FROM AUDIT_LOGS')) {
      const logs = this.db.tables.get('audit_logs') || [];
      return { results: logs as unknown as R[], success: true };
    }

    if (norm.includes('FROM RULE_SETS')) {
      const rules = (this.db.tables.get('rule_sets') || []) as any[];
      if (this.boundValues.length === 1) {
        const val = this.boundValues[0];
        const filtered = rules.filter((r) => r.id === val);
        return { results: filtered as unknown as R[], success: true };
      }
      if (this.boundValues.length === 2) {
        const planId = this.boundValues[0];
        const calcTypeId = this.boundValues[1];
        const filtered = rules.filter((r) => r.plan_id === planId && r.calculator_type_id === calcTypeId);
        return { results: filtered as unknown as R[], success: true };
      }
      return { results: rules as unknown as R[], success: true };
    }

    return { results: [], success: true };
  }
}
