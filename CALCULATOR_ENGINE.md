# LIC Calculator — Deterministic Financial Calculator Engine Guide

**Primary Domain:** `https://lic-calculators.com/`  
**Architecture Layer:** Reusable, Deterministic TypeScript Financial Calculation Engine

---

## 1. Engine Product Vision & Architectural Boundary

The calculation engine is a **pure, side-effect-free TypeScript software layer**. It contains zero dependencies on:
- Astro.js components / JSX
- Tailwind CSS / UI styles
- Browser DOM / window / document
- Artificial Intelligence (LLMs)
- Direct database / Cloudflare D1 drivers
- HTTP request / response parsing

### Critical Financial Boundary:
```text
User Input
    ↓
Validation Engine
    ↓
Structured Input
    ↓
Deterministic Calculator (Pure TypeScript)
    ↓
Verified Rules (via IRuleProvider)
    ↓
Authoritative Calculation Result & Itemized Breakdown
    ↓
Optional Future AI Natural Language Summary (Read-Only)
```

> [!CAUTION]
> **AI Must Never Calculate Financial Numbers**:
> All monetary calculations are strictly computed by deterministic TypeScript code. Future AI assistants may only consume sanitized calculation outputs to explain results to users in plain language.

---

## 2. Folder Structure

```text
src/lib/calculators/
├── core/
│   ├── money.ts             # Deterministic integer paise (minor units) arithmetic
│   ├── rounding.ts          # Centralized financial rounding (half-up, half-even, floor, ceil)
│   ├── percentage.ts        # Basis-points percentage arithmetic (1% = 100 bps)
│   ├── dates.ts             # Timezone-neutral ISO date arithmetic & anniversary calculations
│   ├── age.ts               # Age calculations (last-birthday, nearest-birthday, next-birthday)
│   ├── errors.ts            # Typed calculation error classes and error factories
│   ├── warnings.ts          # Non-fatal calculation warning collector
│   └── result.ts            # Standardized calculation result and breakdown builder
├── types/
│   ├── money.ts             # Money, CurrencyCode, RoundMode types
│   ├── frequency.ts         # PremiumFrequency, FrequencyMultiplier
│   ├── rules.ts             # RuleVersion, RuleQuery, RuleStatus
│   └── calculator.ts        # ICalculator, CalculatorInput, CalculatorResult, Breakdown
├── rules/
│   ├── provider.ts          # IRuleProvider interface & InMemoryRuleProvider
│   └── fixtures/
│       └── synthetic-rules.ts # Clearly labeled synthetic test fixtures (NOT REAL LIC DATA)
├── validation/
│   ├── errors.ts            # ValidationError and ValidationResult types
│   └── validator.ts         # Centralized fluent ValidationBuilder
├── engines/
│   ├── premium.ts           # Premium calculation engine (modal rebates, high SA, riders, GST)
│   ├── maturity.ts          # Maturity lump-sum return engine (SA + Bonus + FAB)
│   ├── bonus.ts             # Simple reversionary bonus & FAB valuation engine
│   ├── surrender.ts         # Surrender value engine (GSV vs. SSV factor selection)
│   ├── surrender-loss.ts    # Surrender loss & difference percentage engine
│   ├── comparison.ts        # 3-way Surrender vs. Paid-Up vs. Continue projection engine
│   ├── loan.ts              # Policy loan borrowing limit & interest engine
│   ├── insurance.ts         # Pure term insurance protection cost engine
│   └── pension.ts           # Immediate/deferred annuity lifelong pension payout engine
├── adapters/
│   ├── api-adapter.ts       # Cloudflare Worker / API route execution pipeline
│   └── ai-adapter.ts        # Safe AI context sanitizer and prompt formatter
├── registry.ts              # Central typed registry of calculator metadata & singletons
└── index.ts                 # Clean public export barrel
```

---

## 3. Money & Precision Arithmetic Strategy

To prevent floating-point calculation errors (`0.1 + 0.2 !== 0.3`):
- All currency is stored internally as **integer minor units (paise)**:
  $$\text{paise} = \text{round}(\text{rupees} \times 100)$$
- Calculations utilize safe pure functions: `addMoney`, `subtractMoney`, `multiplyMoney`, `divideMoney`, `maxMoney`, `minMoney`.

```typescript
import { moneyFromRupees, addMoney, formatMoneyINR } from '@/lib/calculators';

const basePremium = moneyFromRupees(24850.50); // 2485050 paise
const riderCost = moneyFromRupees(500.00);      // 50000 paise
const total = addMoney(basePremium, riderCost); // 2535050 paise

console.log(formatMoneyINR(total)); // "₹25,351"
```

---

## 4. Centralized Rounding Policy

No arbitrary `Math.round()` calls are allowed in financial logic. All rounding must specify an explicit `RoundMode`:

| Round Mode | Behavior | Use Case |
| :--- | :--- | :--- |
| `half-up` | Round $\ge 0.5$ away from zero | Standard Indian financial quotation & GST calculation |
| `half-even` | Banker's rounding (nearest even integer) | Actuarial statistical aggregates |
| `floor` | Round toward negative infinity | Conservative customer benefit estimates |
| `ceil` | Round toward positive infinity | Conservative customer obligation / penalty estimates |

---

## 5. Percentage Handling

Percentages are represented internally as **integer basis points** ($1\% = 100\text{ bps}$, $0.01\% = 1\text{ bps}$):
```typescript
import { fromPercentage, applyPercentageToMoney } from '@/lib/calculators';

const gstRate = fromPercentage(4.5); // 450 bps
const amount = moneyFromRupees(10000);
const gstAmount = applyPercentageToMoney(amount, gstRate); // ₹450 (45000 paise)
```

---

## 6. Date & Age Calculation Strategy

- Dates are handled as timezone-neutral ISO `YYYY-MM-DD` strings.
- **Completed Policy Years**: Exact completed anniversaries elapsed between commencement and calculation date.
- **Age Calculation Methods**:
  - `last-birthday`: Completed age on last birthday (modern industry standard).
  - `nearest-birthday`: Rounds up by 1 year if $\ge 6$ months past last birthday (traditional LIC actuarial practice).
  - `next-birthday`: Age on upcoming birthday.

---

## 7. Rule Provider & Versioning Architecture

The engine is decoupled from database storage via the `IRuleProvider` interface:

```typescript
export interface IRuleProvider {
  getRule<TData>(query: RuleQuery): Promise<RuleEntry<TData> | null>;
  getRuleSync<TData>(query: RuleQuery): RuleEntry<TData> | null;
}
```

Every rule entry contains version metadata:
```typescript
export interface RuleVersion {
  readonly version: string;            // e.g. "2024.1"
  readonly planCode: string;           // e.g. "914"
  readonly ruleType: string;           // e.g. "premium_rules"
  readonly effectiveFrom: string;      // "2020-01-01"
  readonly effectiveTo?: string;       // "2099-12-31"
  readonly status: 'active' | 'draft' | 'deprecated';
  readonly sourceReference: string;    // "LIC Circular Ref No. ..."
}
```

---

## 8. Calculator Contract (`ICalculator`)

Every calculator engine implements:

```typescript
export interface ICalculator<TInput, TRules, TData> {
  readonly calculatorId: string;
  readonly name: string;
  readonly description: string;
  readonly requiredRuleTypes: readonly string[];

  validate(input: unknown): ValidationResult;
  calculate(input: TInput, rules: TRules, context?: Partial<CalculatorContext>): CalculatorResult<TData>;
}
```

---

## 9. How to Add a New Calculator

To add a new calculator (e.g. `ChildEducationCalculator`):

### Step 1: Define Input & Result Data Types
Create `src/lib/calculators/engines/child-education.ts`:
```typescript
export interface ChildEducationInput {
  readonly currentAge: number;
  readonly targetAge: number;
  readonly targetCorpus: number;
}

export interface ChildEducationResultData {
  readonly yearsToGoal: number;
  readonly targetCorpus: Money;
  readonly requiredAnnualSavings: Money;
}
```

### Step 2: Implement `ICalculator`
```typescript
export class ChildEducationCalculator implements ICalculator<ChildEducationInput, RuleEntry<any>, ChildEducationResultData> {
  public readonly calculatorId = 'lic-child-education-calculator';
  public readonly name = 'Child Education Calculator';
  public readonly description = 'Estimates required annual savings to accumulate child higher education corpus.';
  public readonly requiredRuleTypes = ['education_rules'];

  public validate(input: unknown) {
    const raw = input as Partial<ChildEducationInput>;
    return new ValidationBuilder()
      .require('currentAge', raw.currentAge)
      .range('currentAge', raw.currentAge, 0, 17)
      .require('targetAge', raw.targetAge)
      .range('targetAge', raw.targetAge, 18, 25)
      .require('targetCorpus', raw.targetCorpus)
      .positiveNumber('targetCorpus', raw.targetCorpus)
      .build();
  }

  public calculate(input: ChildEducationInput, ruleEntry: RuleEntry<any>) {
    // Pure deterministic calculation logic...
  }
}
```

### Step 3: Register in `registry.ts` and `index.ts`
Add the new calculator to `CALCULATOR_REGISTRY` and `ENGINES`.

### Step 4: Write Unit Tests in `tests/`
Create `tests/engine-child-education.test.ts` to test valid inputs, boundary limits, and invariants.

---

## 10. How Future Cloudflare D1 Rules Will Connect (Phase 4)

In Phase 4, a `D1RuleProvider` implementing `IRuleProvider` will be introduced:

```typescript
export class D1RuleProvider implements IRuleProvider {
  constructor(private readonly db: D1Database) {}

  public async getRule<TData>(query: RuleQuery): Promise<RuleEntry<TData> | null> {
    const row = await this.db.prepare(`
      SELECT version, plan_code, rule_type, effective_from, effective_to, status, source_reference, rule_data
      FROM calculator_rules
      WHERE plan_code = ? AND rule_type = ? AND status = 'active'
        AND effective_from <= ? AND (effective_to IS NULL OR effective_to >= ?)
      ORDER BY effective_from DESC LIMIT 1
    `).bind(query.planCode, query.ruleType, query.asOfDate, query.asOfDate).first();

    if (!row) return null;
    return {
      version: { ...row },
      data: JSON.parse(row.rule_data)
    };
  }
}
```
**No calculation engine code needs to change when D1 is connected.**

---

## 11. How Future AI Will Consume Results

The `sanitizeResultForAi` adapter safely extracts user-facing figures while enforcing prompt boundaries:

```typescript
import { sanitizeResultForAi } from '@/lib/calculators';

const aiPayload = sanitizeResultForAi(calculationResult);
// Injected into LLM context:
// - primaryCalculatedAmount: "₹24,681"
// - lineItems: [ { label: "Basic Tabular Premium", amount: "₹24,850" }, ... ]
// - systemPromptInstruction: "CRITICAL FINANCIAL BOUNDARY: Figures are authoritative. Do NOT alter or recalculate."
```
