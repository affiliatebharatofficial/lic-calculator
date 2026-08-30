# LIC Calculator (`lic-calculators.com`)

> **IMPORTANT LEGAL NOTICE:**
> **lic-calculators.com** is an **INDEPENDENT** informational and financial calculation platform. It is **NOT** owned, operated, endorsed, or affiliated with the **Life Insurance Corporation of India (LIC)** or any government authority. It does NOT use official LIC logos, trademarks, or proprietary visual identities.

---

## 1. Project Overview & Product Vision

**LIC Calculator** is a modern, high-performance, mobile-first, multilingual financial calculator platform designed to help Indian policyholders understand and maximize their life insurance investments.

### Core Product Capabilities
- **LIC Premium Calculator** (New Endowment, Jeevan Anand, Jeevan Labh, Jeevan Umang, etc.)
- **LIC Surrender Value Calculator** (GSV vs. SSV factor analysis)
- **LIC Surrender Loss Calculator** (Quantify monetary loss vs. Paid-Up / Policy Continuation)
- **LIC Maturity Benefit Calculator** (Sum Assured + Reversionary Bonus + FAB)
- **LIC Bonus Calculator** (Valuation year bonus additions)
- **LIC Policy Loan Calculator** (Loan eligibility against surrender value)
- **LIC Term Insurance Calculator** (Pure risk cover estimation)
- **LIC Pension & Annuity Calculator** (Guaranteed monthly pension payouts)

### Key Architectural Principle
**Deterministic Calculations:** All financial calculations are executed by a pure TypeScript engine based on versioned actuarial rules. AI is never used to invent or compute authoritative monetary results; AI integration is designated solely for natural language parsing and result explanation in future phases.

---

## 2. Technology Stack

- **Frontend Framework:** [Astro.js](https://astro.build/) (Hybrid SSR + Static Generation)
- **Language:** TypeScript 5 (Strict Mode enabled with 0 implicit `any`)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Financial/utility design system, WCAG accessible)
- **Backend / Edge Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/) (`@astrojs/cloudflare` adapter)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQL with migrations & versioning)
- **Validation:** Type-safe pure validators (Server-side & client-side)
- **Testing:** [Vitest](https://vitest.dev/) (Unit testing for formatting, math precision, validators, and rule provider)

---

## 3. Project Architecture

```text
├── db/
│   ├── migrations/
│   │   └── 0001_initial_schema.sql    # Complete D1 SQLite schema
│   └── seeds/
│       └── initial_types.sql          # Seed data for calculator types & metadata
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layout/                    # Header, Footer, Breadcrumbs, LanguageSelector, DisclaimerBanner
│   │   ├── seo/                       # BaseHead, JsonLd structured data
│   │   └── ui/                        # Button, Input, Select, Card, ResultCard, Badge, Alert, Table, States
│   ├── layouts/
│   │   ├── BaseLayout.astro           # Global base layout with compliance banners & SEO
│   │   ├── CalculatorLayout.astro     # Standard 2-column responsive calculator layout
│   │   └── ContentLayout.astro        # Article and legal pages layout
│   ├── lib/
│   │   ├── api/                       # Standardized JSON response helpers
│   │   ├── calculators/               # Deterministic engine interfaces, registry & rule provider
│   │   ├── formatting/                # Indian Rupee (INR), Lakh/Crore compact, words & date helpers
│   │   ├── i18n/                      # 7-language dictionary & localized routing helpers
│   │   ├── security/                  # XSS sanitization, HTTP security headers & Turnstile hooks
│   │   └── validation/                # Age, Sum Assured, PPT, Frequency & range validators
│   ├── pages/
│   │   ├── api/                       # Cloudflare Worker API endpoints (POST /api/calculators/*)
│   │   ├── [lang]/                    # Localized dynamic routes (/hi, /mr, /gu, /bn, /ta, /te)
│   │   ├── calculators.astro          # All Calculators Directory
│   │   ├── lic-premium-calculator.astro
│   │   ├── lic-surrender-value-calculator.astro
│   │   ├── lic-surrender-loss-calculator.astro
│   │   ├── lic-maturity-calculator.astro
│   │   ├── lic-bonus-calculator.astro
│   │   ├── lic-loan-calculator.astro
│   │   ├── lic-term-insurance-calculator.astro
│   │   ├── lic-pension-calculator.astro
│   │   ├── plans.astro                # Plan reference catalog
│   │   ├── guides.astro               # Educational guides
│   │   ├── faq.astro                  # Common FAQs
│   │   ├── glossary.astro             # Insurance terminology glossary
│   │   ├── about.astro                # About platform
│   │   ├── contact.astro              # Contact form
│   │   ├── privacy-policy.astro       # Privacy policy
│   │   ├── terms.astro                # Terms of service
│   │   └── disclaimer.astro           # Mandatory non-affiliation disclaimer
│   ├── styles/
│   │   └── global.css                 # Base Tailwind styling & focus rings
│   └── types/                         # TypeScript interfaces (API, Calculator, DB, i18n, SEO, Plans)
├── tests/                             # Vitest unit test suites
├── astro.config.mjs                   # Astro configuration with Cloudflare adapter
├── tailwind.config.mjs                # Design tokens & color palette
├── tsconfig.json                      # Strict TypeScript compiler options
└── wrangler.toml                      # Cloudflare Workers & D1 bindings
```

---

## 4. Rule Versioning Concept

Policy rules and factors change over time according to insurance circulars. The calculation engine resolves rules via:

$$\text{Plan} + \text{Rule Type} + \text{Effective Date} + \text{Version} = \text{Applicable Rule}$$

Database tables include `effective_from`, `effective_to`, `version`, `status`, and `source_reference`.

---

## 5. Supported Languages (i18n)

The platform supports 7 major Indian languages out of the box:
- `en` — English (Default)
- `hi` — Hindi (हिन्दी)
- `mr` — Marathi (मराठी)
- `gu` — Gujarati (ગુજરાતી)
- `bn` — Bengali (বাংলা)
- `ta` — Tamil (தமிழ்)
- `te` — Telugu (తెలుగు)

---

## 6. Local Development & Setup

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `10+`

### Installation
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:4321` in your browser.

### Run Tests
```bash
npm test
```

### Type Checking
```bash
npm run check
```

### Production Build
```bash
npm run build
```

---

## 7. Cloudflare Deployment & D1 Setup

### Local D1 Database Execution
```bash
# Apply migrations to local D1 database
npx wrangler d1 migrations apply DB --local

# Apply seed data to local D1 database
npx wrangler d1 execute DB --local --file=./db/seeds/initial_types.sql
```

### Remote Cloudflare Deployment
```bash
# 1. Create remote D1 database
npx wrangler d1 create lic_calculators_db

# 2. Update database_id in wrangler.toml

# 3. Apply migrations remotely
npx wrangler d1 migrations apply DB --remote

# 4. Deploy to Cloudflare Pages / Workers
npm run build
npx wrangler pages deploy dist
```

---

## 8. API Endpoints

All API requests return a consistent JSON payload:

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "calculatorType": "premium",
    "calculatedAt": "2026-08-30T04:00:00.000Z",
    "ruleVersionApplied": "1.0.0",
    "primaryResult": {
      "label": "Estimated Annual Premium",
      "amount": 24500,
      "formattedAmount": "₹24,500"
    }
  },
  "meta": {
    "timestamp": "2026-08-30T04:00:00.000Z",
    "version": "1.0.0"
  }
}
```

### Error Response (`400` / `422` / `500`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "fieldErrors": [
      {
        "field": "age",
        "message": "Age cannot be less than 8"
      }
    ]
  }
}
```

---

## 9. Next Steps (Phase 2 Roadmap)
- [ ] Ingest verified tabular premium rate tables for top 5 LIC endowment plans.
- [ ] Connect Special Surrender Value (SSV) factor matrices.
- [ ] Implement client-side interactive sliders with live result updates.
- [ ] Integrate server-side LLM explanation endpoint for surrender analysis.
