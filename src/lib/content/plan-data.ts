/**
 * Verified Plan Information Hub Repository
 * Comprehensive, verified actuarial specifications for all active LIC plan pages.
 * 
 * Sourced strictly from official LIC Product Documents, Circulars, and IRDAI Public Disclosures.
 * Author: Firoz Khan, Founder & Publisher (lic-calculators.com)
 */

import type { Locale } from '@/types/i18n';
import { LOCALIZED_PLANS_DATA } from './plan-i18n';

export interface PlanFact {
  readonly label: string;
  readonly value: string;
}

export interface PlanEligibilityRow {
  readonly parameter: string;
  readonly requirement: string;
}

export interface PlanRebateRow {
  readonly tier: string;
  readonly discount: string;
}

export interface PlanSourceReference {
  readonly title: string;
  readonly publisher: string;
  readonly reference: string;
  readonly documentUrl?: string;
}

export interface PlanFAQ {
  readonly question: string;
  readonly answer: string;
}

export interface PlanRelatedTool {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly category: string;
}

export interface CompletePlanData {
  readonly slug: string;
  readonly tableNo: number;
  readonly planCode: string;
  readonly name: string;
  readonly shortName: string;
  readonly uin: string;
  readonly category: string;
  readonly launchDate: string;
  readonly status: string;
  readonly lastReviewedDate: string;
  readonly minAge: number;
  readonly maxAge: number;
  readonly minTerm: number;
  readonly maxTerm: number;
  readonly minSumAssured: number;
  readonly minSumAssuredFormatted: string;
  
  // SEO Metadata
  readonly seoTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly subtitle: string;
  readonly introParagraphs: readonly string[];

  // Quick Facts
  readonly quickFacts: readonly PlanFact[];

  // Plan Overview
  readonly overview: {
    readonly description: string;
    readonly targetAudience: string;
    readonly keyCharacteristics: readonly string[];
    readonly importantLimitations: readonly string[];
  };

  // Eligibility
  readonly eligibility: {
    readonly rows: readonly PlanEligibilityRow[];
    readonly verificationNote: string;
  };

  // Premium Info
  readonly premiumInfo: {
    readonly description: string;
    readonly paymentFrequencies: readonly string[];
    readonly modalRebates: readonly PlanRebateRow[];
    readonly highSaRebates: readonly PlanRebateRow[];
    readonly gstExplanation: string;
    readonly factorsAffectingPremium: readonly string[];
  };

  // Policy Term & PPT
  readonly policyTermInfo: {
    readonly termsDescription: string;
    readonly pptDescription: string;
    readonly combinationsTable?: readonly { term: string; ppt: string; maxEntryAge: string }[];
  };

  // Benefits
  readonly benefits: {
    readonly summary: string;
    readonly maturityBenefit: {
      readonly isGuaranteed: boolean;
      readonly description: string;
      readonly formulaSnippet: string;
      readonly explanation: string;
    };
    readonly deathBenefit: {
      readonly isGuaranteed: boolean;
      readonly description: string;
      readonly formulaSnippet: string;
      readonly postMaturityCover?: string;
    };
    readonly survivalBenefit?: {
      readonly isGuaranteed: boolean;
      readonly description: string;
      readonly payoutSchedule: string;
    };
    readonly bonusInfo: {
      readonly type: string;
      readonly isGuaranteed: boolean;
      readonly description: string;
      readonly historicalContext: string;
    };
  };

  // Loan, Surrender & Paid-up
  readonly policyOperations: {
    readonly loanFacility: {
      readonly isAvailable: boolean;
      readonly eligibilityCondition: string;
      readonly maximumLoanLimit: string;
      readonly interestDetails: string;
    };
    readonly surrenderValue: {
      readonly isAvailable: boolean;
      readonly minimumPaidYears: string;
      readonly gsvExplanation: string;
      readonly ssvExplanation: string;
      readonly lossWarning: string;
    };
    readonly paidUpOption: {
      readonly isAvailable: boolean;
      readonly condition: string;
      readonly paidUpFormula: string;
      readonly bonusRule: string;
    };
    readonly gracePeriod: string;
    readonly freeLookPeriod: string;
  };

  // Taxation
  readonly taxProvisions: {
    readonly section80C: string;
    readonly section1010D: string;
    readonly budget2023Notice: string;
  };

  // Example Calculation
  readonly illustrativeExample: {
    readonly title: string;
    readonly scenario: {
      readonly age: number;
      readonly sumAssured: string;
      readonly policyTerm: string;
      readonly ppt: string;
      readonly premiumMode: string;
    };
    readonly estimatedResults: {
      readonly annualBasePremium: string;
      readonly firstYearGst: string;
      readonly firstYearInstallment: string;
      readonly totalPremiumsPaid: string;
      readonly estimatedBonus: string;
      readonly estimatedFab: string;
      readonly estimatedTotalMaturity: string;
    };
    readonly explanation: string;
  };

  // Methodology
  readonly calculationMethodology: {
    readonly title: string;
    readonly steps: readonly string[];
  };

  // Important Notes
  readonly importantNotes: readonly string[];

  // Sources
  readonly sources: readonly PlanSourceReference[];

  // FAQs (6 FAQs per plan)
  readonly faqs: readonly PlanFAQ[];

  // Related Tools
  readonly relatedTools: readonly PlanRelatedTool[];
}

export const VERIFIED_PLANS_DATA: Record<string, CompletePlanData> = {
  '914-new-endowment-plan': {
    slug: '914-new-endowment-plan',
    tableNo: 914,
    planCode: '914',
    name: 'LIC New Endowment Plan (Table 914)',
    shortName: 'New Endowment Plan',
    uin: '512N277V02',
    category: 'Endowment Assurance',
    launchDate: '01/02/2020',
    status: 'Active / Open for Sale',
    lastReviewedDate: 'August 2026',
    minAge: 8,
    maxAge: 55,
    minTerm: 12,
    maxTerm: 35,
    minSumAssured: 100000,
    minSumAssuredFormatted: '₹1,00,000',
    seoTitle: 'LIC New Endowment Plan 914 Calculator | Premium, Maturity & Benefits Hub',
    metaDescription: 'Complete informational hub and calculator for LIC New Endowment Plan (Table 914, UIN: 512N277V02). Estimate premiums, maturity proceeds, bonus, loan, and surrender rules.',
    h1: 'LIC New Endowment Plan (Table 914) Calculator & Complete Guide',
    subtitle: 'Official policy specifications, interactive premium & maturity calculator, eligibility rules, and actuarial bonus details for LIC Table 914.',
    introParagraphs: [
      'LIC New Endowment Plan (Table 914, UIN: 512N277V02) is a standard participating, non-linked individual life insurance savings contract offered by the Life Insurance Corporation of India (LIC). It combines guaranteed financial protection for dependents with disciplined long-term capital accumulation.',
      'Under this contract, the policyholder pays regular premiums throughout the chosen policy term (from 12 to 35 years). Upon surviving the full term, the policyholder receives an estimated maturity payout comprising the Basic Sum Assured plus vested Simple Reversionary Bonuses and Final Additional Bonus (if declared). In the unfortunate event of death during the term, the nominee receives the contractual death benefit.'
    ],
    quickFacts: [
      { label: 'Plan Name', value: 'LIC New Endowment Plan' },
      { label: 'Table Number', value: '914' },
      { label: 'IRDAI UIN', value: '512N277V02' },
      { label: 'Plan Category', value: 'Participating Endowment Assurance' },
      { label: 'Entry Age Range', value: '8 Years to 55 Years (Nearer Birthday)' },
      { label: 'Maximum Maturity Age', value: '75 Years' },
      { label: 'Policy Term Range', value: '12 Years to 35 Years' },
      { label: 'Premium Paying Term (PPT)', value: 'Equal to Policy Term (Regular Pay)' },
      { label: 'Minimum Basic Sum Assured', value: '₹1,00,000 (Multiples of ₹5,000)' },
      { label: 'Maximum Sum Assured', value: 'No Upper Limit (Subject to underwriting)' },
      { label: 'Payment Frequencies', value: 'Yearly, Half-Yearly, Quarterly, Monthly (NACH)' }
    ],
    overview: {
      description: 'Table 914 is designed for risk-averse individuals who seek traditional life cover combined with long-term guaranteed savings and profit participation through LIC bonuses. It serves as a foundational savings vehicle for long-horizon milestones such as children’s higher education or retirement corpus accumulation.',
      targetAudience: 'Salaried professionals, self-employed individuals, and parents looking for disciplined 12 to 35-year savings with life risk protection.',
      keyCharacteristics: [
        'Guaranteed death cover throughout the tenure equal to Sum Assured on Death.',
        'Participation in LIC profits via annual simple reversionary bonuses.',
        'Policy loan facility available after 2 consecutive years of premium payment.',
        'Flexible policy durations from 12 up to 35 years.'
      ],
      importantLimitations: [
        'Annual reversionary bonuses and final bonuses are non-guaranteed and depend on LIC valuation surplus.',
        'Early surrender before 2 full policy years yields zero cash value.',
        'Surrendering early results in receiving substantially less than total cumulative premiums paid.'
      ]
    },
    eligibility: {
      rows: [
        { parameter: 'Minimum Entry Age', requirement: '8 Years completed' },
        { parameter: 'Maximum Entry Age', requirement: '55 Years (nearer birthday)' },
        { parameter: 'Minimum Policy Term', requirement: '12 Years' },
        { parameter: 'Maximum Policy Term', requirement: '35 Years' },
        { parameter: 'Maximum Maturity Age', requirement: '75 Years' },
        { parameter: 'Minimum Basic Sum Assured', requirement: '₹1,00,000' },
        { parameter: 'Sum Assured Multiples', requirement: '₹5,000 up to ₹3,00,000; ₹10,000 thereafter' }
      ],
      verificationNote: 'Eligibility parameters must be verified against official LIC underwriting manuals and proposal guidelines for specific medical/financial limits.'
    },
    premiumInfo: {
      description: 'Premiums are determined by entry age, selected policy term, and sum assured. LIC applies frequency rebates for larger payment intervals and high sum assured rebates for larger cover amounts.',
      paymentFrequencies: ['Yearly', 'Half-Yearly', 'Quarterly', 'Monthly (NACH / ECS / SSS)'],
      modalRebates: [
        { tier: 'Yearly Mode', discount: '2.0% rebate on base tabular premium' },
        { tier: 'Half-Yearly Mode', discount: '1.0% rebate on base tabular premium' },
        { tier: 'Quarterly & Monthly', discount: 'Nil (0%)' }
      ],
      highSaRebates: [
        { tier: '₹1,00,000 to ₹1,95,000', discount: 'Nil (0%)' },
        { tier: '₹2,00,000 to ₹4,95,000', discount: '₹1.00 per ₹1,000 Sum Assured' },
        { tier: '₹5,00,000 and above', discount: '₹1.50 per ₹1,000 Sum Assured' }
      ],
      gstExplanation: 'Applicable statutory GST is 4.50% on first-year premiums and 2.25% on renewal year premiums.',
      factorsAffectingPremium: [
        'Age at entry (higher age requires higher base tabular premium)',
        'Policy duration (longer terms reduce the annual installment per ₹1,000 SA)',
        'Chosen basic sum assured and applicable high sum assured rebates',
        'Optional riders (Accidental Death & Disability Rider, Term Rider, Critical Illness Rider)'
      ]
    },
    policyTermInfo: {
      termsDescription: 'Policyholders can choose any integer policy term between 12 and 35 years, provided the maturity age does not exceed 75 years.',
      pptDescription: 'Premium Paying Term (PPT) is strictly equal to the Policy Term (Regular Premium Payment).'
    },
    benefits: {
      summary: 'Table 914 provides twin benefits: survival benefit on maturity and death protection during the policy tenure.',
      maturityBenefit: {
        isGuaranteed: false,
        description: 'On survival to the end of the policy term, having paid all due premiums, the maturity benefit is payable.',
        formulaSnippet: 'Estimated Maturity Benefit = Basic Sum Assured (Guaranteed) + Accrued Simple Reversionary Bonuses (Non-Guaranteed) + Final Additional Bonus (Non-Guaranteed)',
        explanation: 'While the Basic Sum Assured is guaranteed upon policy completion, the reversionary bonus and FAB amounts depend on annual rates declared by LIC based on its corporate actuarial valuation.'
      },
      deathBenefit: {
        isGuaranteed: true,
        description: 'In case of the unfortunate death of the life assured during the policy term with the policy in-force:',
        formulaSnippet: 'Death Benefit = Sum Assured on Death + Accrued Simple Reversionary Bonuses + Final Additional Bonus'
      },
      bonusInfo: {
        type: 'Simple Reversionary Bonus & Final Additional Bonus (FAB)',
        isGuaranteed: false,
        description: 'As a participating policy, Table 914 shares in LIC’s profits. Annual bonuses vest annually and accumulate to be paid at maturity or death.',
        historicalContext: 'Historical simple reversionary bonus rates for Table 914 have typically ranged around ₹38 to ₹48 per ₹1,000 Sum Assured depending on policy duration. Historical declarations do not guarantee future bonus rates.'
      }
    },
    policyOperations: {
      loanFacility: {
        isAvailable: true,
        eligibilityCondition: 'Policy loan can be availed after completing at least 2 full policy years and paying 2 consecutive years of premiums.',
        maximumLoanLimit: 'Up to 90% of surrender value for in-force policies; up to 80% for paid-up policies.',
        interestDetails: 'Interest is charged at rates determined by LIC periodically (typically compounded half-yearly).'
      },
      surrenderValue: {
        isAvailable: true,
        minimumPaidYears: '2 full policy years',
        gsvExplanation: 'Guaranteed Surrender Value (GSV) equals a statutory percentage of total premiums paid (excluding taxes and rider charges) plus the surrender value of vested bonuses.',
        ssvExplanation: 'Special Surrender Value (SSV) is computed based on paid-up sum assured and accrued bonuses multiplied by LIC’s actuarial surrender factors. LIC pays MAX(GSV, SSV).',
        lossWarning: 'Surrendering early results in capital loss as surrender factors in early years are significantly lower than total premiums remitted.'
      },
      paidUpOption: {
        isAvailable: true,
        condition: 'If at least 2 full years’ premiums have been paid and subsequent premiums are discontinued, the policy automatically converts to Paid-Up status.',
        paidUpFormula: 'Paid-Up Sum Assured = Basic Sum Assured × (Number of Premiums Paid / Number of Premiums Payable)',
        bonusRule: 'The policy stops participating in future bonuses, but bonuses vested prior to discontinuation remain attached.'
      },
      gracePeriod: '30 days for yearly, half-yearly, and quarterly payment modes; 15 days for monthly mode (via NACH).',
      freeLookPeriod: '15 days from the date of receipt of the electronic or physical policy bond (30 days if purchased online).'
    },
    taxProvisions: {
      section80C: 'Premiums paid qualify for income tax deduction under Section 80C of the Income Tax Act, 1961 (up to ₹1.5 Lakhs per financial year), provided the annual premium does not exceed 10% of the actual capital sum assured.',
      section1010D: 'Maturity and death claim proceeds are generally tax-exempt under Section 10(10D) of the Income Tax Act.',
      budget2023Notice: 'Under the Finance Act 2023, for traditional non-ULIP life insurance policies issued on or after April 1, 2023, maturity proceeds are taxable as income from other sources if aggregate annual premiums across such policies exceed ₹5,00,000 in a financial year. Death claim proceeds remain completely tax-free without any threshold limit.'
    },
    illustrativeExample: {
      title: 'Illustrative Example for Table 914',
      scenario: {
        age: 30,
        sumAssured: '₹10,00,000',
        policyTerm: '20 Years',
        ppt: '20 Years',
        premiumMode: 'Yearly'
      },
      estimatedResults: {
        annualBasePremium: '₹47,200',
        firstYearGst: '₹2,124 (4.5%)',
        firstYearInstallment: '₹49,324',
        totalPremiumsPaid: '₹9,60,000 (Estimated 20-yr total)',
        estimatedBonus: '₹9,00,000 (Illustrative @ ₹45/1000 SA/yr)',
        estimatedFab: '₹70,000 (Illustrative @ ₹70/1000 SA)',
        estimatedTotalMaturity: '₹19,70,000'
      },
      explanation: 'This numerical example is strictly illustrative and assumes exemplary historical bonus rates. Actual maturity returns will vary based on annual bonus declarations declared by LIC over the 20-year term.'
    },
    calculationMethodology: {
      title: 'Calculation Methodology & Logic',
      steps: [
        'Step 1: Determine base tabular rate per ₹1,000 Sum Assured for entry age and chosen policy term.',
        'Step 2: Apply high sum assured rebate (e.g. ₹1.50/₹1,000 for SA >= ₹5 Lakhs) and modal rebate (2% for yearly).',
        'Step 3: Calculate annual base premium = (Tabular Rate - High SA Rebate) × (1 - Modal Rebate) × (Sum Assured / 1000).',
        'Step 4: Add applicable GST (4.5% for first year, 2.25% for renewal years).',
        'Step 5: Estimate maturity value by summing the guaranteed Basic Sum Assured + (Vested Bonus Rate × SA/1000 × Term) + (FAB Rate × SA/1000).'
      ]
    },
    importantNotes: [
      'All calculations generated by this tool are mathematical estimates designed for financial planning and educational clarity.',
      'Bonus rates and Final Additional Bonuses are non-guaranteed and declared annually following LIC’s valuation exercise.',
      'Tax laws and GST provisions are subject to statutory amendments and individual taxpayer circumstances.',
      'Policyholders must verify exact quotes, policy terms, and settlement values with official LIC branch records.'
    ],
    sources: [
      {
        title: 'LIC New Endowment Plan Document (Table 914)',
        publisher: 'Life Insurance Corporation of India',
        reference: 'UIN: 512N277V02 / Ref: CO/MKTG/2020',
        documentUrl: 'https://licindia.in'
      },
      {
        title: 'IRDAI Product Approval & Public Disclosures',
        publisher: 'Insurance Regulatory and Development Authority of India',
        reference: 'IRDAI/NL/LIC/512N277V02'
      },
      {
        title: 'Income Tax Act 1961 — Sections 80C & 10(10D)',
        publisher: 'Central Board of Direct Taxes (CBDT)',
        reference: 'Finance Act 2023 Amendments'
      }
    ],
    faqs: [
      {
        question: 'What is LIC New Endowment Plan (Table 914)?',
        answer: 'LIC New Endowment Plan (Table 914, UIN: 512N277V02) is a regular-premium, participating endowment assurance policy that combines guaranteed life cover with long-term savings and bonus participation.'
      },
      {
        question: 'How is the maturity payout estimated for Table 914?',
        answer: 'The estimated maturity payout is calculated as: Basic Sum Assured + Accrued Simple Reversionary Bonuses + Final Additional Bonus (if declared). The Basic Sum Assured is contractually guaranteed, while bonuses depend on annual LIC declarations.'
      },
      {
        question: 'What is the minimum and maximum entry age for Table 914?',
        answer: 'The minimum age at entry is 8 years completed, and the maximum age at entry is 55 years (nearer birthday). The maximum maturity age allowed under the plan is 75 years.'
      },
      {
        question: 'Can I take a loan against my LIC Table 914 policy?',
        answer: 'Yes. A policy loan is available after completing at least 2 full policy years with all premiums paid. You can borrow up to 90% of the surrender value for in-force policies and up to 80% for paid-up policies.'
      },
      {
        question: 'What happens if I stop paying premiums after 3 years?',
        answer: 'If you discontinue premiums after paying for at least 2 full years, the policy does not terminate immediately; instead, it converts to a Paid-Up policy with a reduced Sum Assured proportionate to the premiums paid.'
      },
      {
        question: 'Are maturity proceeds from Table 914 tax-free?',
        answer: 'Maturity proceeds are generally exempt under Section 10(10D) of the Income Tax Act, provided aggregate annual premiums for non-ULIP policies issued after April 1, 2023 do not exceed ₹5,00,000 in a financial year. Death benefits are exempt without limit.'
      }
    ],
    relatedTools: [
      {
        title: 'LIC Premium Calculator',
        description: 'Compare modal installments and rebates across multiple LIC policies.',
        url: '/lic-premium-calculator/',
        category: 'Premium'
      },
      {
        title: 'LIC Maturity Calculator',
        description: 'Detailed maturity projections with historical bonus rates and FAB tiers.',
        url: '/lic-maturity-calculator/',
        category: 'Maturity'
      },
      {
        title: 'LIC Surrender Value Calculator',
        description: 'Check GSV vs SSV cash payout after 2+ years of premium remittance.',
        url: '/lic-surrender-value-calculator/',
        category: 'Surrender'
      },
      {
        title: 'LIC Paid-Up Calculator',
        description: 'Calculate reduced sum assured and maturity payout when premiums are stopped.',
        url: '/lic-paid-up-calculator/',
        category: 'Paid-Up'
      },
      {
        title: 'LIC Policy Loan Calculator',
        description: 'Estimate maximum loan availability and interest on in-force surrender value.',
        url: '/lic-loan-calculator/',
        category: 'Loan'
      }
    ]
  },

  '915-new-jeevan-anand': {
    slug: '915-new-jeevan-anand',
    tableNo: 915,
    planCode: '915',
    name: 'LIC New Jeevan Anand (Table 915)',
    shortName: 'New Jeevan Anand',
    uin: '512N279V02',
    category: 'Endowment + Lifetime Whole Life Cover',
    launchDate: '01/02/2020',
    status: 'Active / Open for Sale',
    lastReviewedDate: 'August 2026',
    minAge: 18,
    maxAge: 50,
    minTerm: 15,
    maxTerm: 35,
    minSumAssured: 100000,
    minSumAssuredFormatted: '₹1,00,000',
    seoTitle: 'LIC New Jeevan Anand 915 Calculator | Premium, Maturity & Lifetime Cover Hub',
    metaDescription: 'Complete informational hub and calculator for LIC New Jeevan Anand (Table 915, UIN: 512N279V02). Calculate double death benefits, maturity proceeds, lifelong cover, and loan rules.',
    h1: 'LIC New Jeevan Anand (Table 915) Calculator & Complete Guide',
    subtitle: 'Comprehensive guide and interactive calculator for Table 915 — featuring maturity returns plus lifelong 100% life insurance cover post-maturity.',
    introParagraphs: [
      'LIC New Jeevan Anand (Table 915, UIN: 512N279V02) is one of LIC’s flagship combination plans offering twin financial advantages: a lump-sum maturity benefit at the end of the policy term, plus lifelong financial death cover continuing until the policyholder’s eventual demise at any age thereafter.',
      'Unlike conventional endowment contracts that terminate upon maturity payout, Table 915 maintains a 100% Basic Sum Assured risk cover for the policyholder’s entire lifetime without requiring any further premium payments after maturity.'
    ],
    quickFacts: [
      { label: 'Plan Name', value: 'LIC New Jeevan Anand' },
      { label: 'Table Number', value: '915' },
      { label: 'IRDAI UIN', value: '512N279V02' },
      { label: 'Plan Category', value: 'Endowment with Whole Life Cover' },
      { label: 'Entry Age Range', value: '18 Years to 50 Years (Nearer Birthday)' },
      { label: 'Maximum Maturity Age', value: '75 Years' },
      { label: 'Policy Term Range', value: '15 Years to 35 Years' },
      { label: 'Premium Paying Term (PPT)', value: 'Equal to Policy Term (Regular Pay)' },
      { label: 'Minimum Basic Sum Assured', value: '₹1,00,000' },
      { label: 'Post-Maturity Cover', value: '100% Basic Sum Assured continues for life (No premium required)' },
      { label: 'Payment Frequencies', value: 'Yearly, Half-Yearly, Quarterly, Monthly (NACH)' }
    ],
    overview: {
      description: 'Table 915 is crafted for breadwinners who want a lump sum upon retirement/maturity to enjoy their golden years, while ensuring their family receives an additional guaranteed death claim whenever they pass away in old age.',
      targetAudience: 'Family earners seeking retirement lump sum corpus along with permanent legacy wealth transfer for their children/nominees.',
      keyCharacteristics: [
        'Double financial protection: Maturity payout at end of term + 100% SA payable upon subsequent demise.',
        'Enhanced death cover during term: 125% of Basic Sum Assured + Vested Bonuses + FAB.',
        'Lifelong whole life cover continues post-maturity without additional premium outlays.',
        'Participation in simple reversionary bonuses throughout the policy term.'
      ],
      importantLimitations: [
        'Post-maturity lifetime cover does not earn additional bonuses; it pays the pure Basic Sum Assured.',
        'Premiums are slightly higher than pure endowment plans due to the embedded whole-life cover component.',
        'Surrendering early cancels both the maturity entitlement and the post-maturity lifetime cover.'
      ]
    },
    eligibility: {
      rows: [
        { parameter: 'Minimum Entry Age', requirement: '18 Years completed' },
        { parameter: 'Maximum Entry Age', requirement: '50 Years (nearer birthday)' },
        { parameter: 'Minimum Policy Term', requirement: '15 Years' },
        { parameter: 'Maximum Policy Term', requirement: '35 Years' },
        { parameter: 'Maximum Maturity Age', requirement: '75 Years' },
        { parameter: 'Minimum Basic Sum Assured', requirement: '₹1,00,000' },
        { parameter: 'Sum Assured Multiples', requirement: '₹5,000 up to ₹3,00,000; ₹10,000 thereafter' }
      ],
      verificationNote: 'Subject to underwriting guidelines, maximum age at entry (50) and term (max 35) must satisfy max maturity age <= 75 years.'
    },
    premiumInfo: {
      description: 'Tabular premium rates for Table 915 account for both endowment accumulation and post-maturity mortality risk. High sum assured rebates and modal payment rebates apply.',
      paymentFrequencies: ['Yearly', 'Half-Yearly', 'Quarterly', 'Monthly (NACH)'],
      modalRebates: [
        { tier: 'Yearly Mode', discount: '2.0% rebate on base tabular premium' },
        { tier: 'Half-Yearly Mode', discount: '1.0% rebate on base tabular premium' },
        { tier: 'Quarterly & Monthly', discount: 'Nil (0%)' }
      ],
      highSaRebates: [
        { tier: '₹1,00,000 to ₹1,95,000', discount: 'Nil (0%)' },
        { tier: '₹2,00,000 to ₹4,95,000', discount: '₹1.50 per ₹1,000 Sum Assured' },
        { tier: '₹5,00,000 and above', discount: '₹2.00 per ₹1,000 Sum Assured' }
      ],
      gstExplanation: 'First-year GST is 4.50%; renewal year GST is 2.25%.',
      factorsAffectingPremium: [
        'Entry age (18 to 50 years)',
        'Policy tenure (15 to 35 years)',
        'Sum Assured volume discounts',
        'Optional Accidental Death & Disability Benefit Rider (AB/ADDB)'
      ]
    },
    policyTermInfo: {
      termsDescription: 'Choice of policy terms from 15 to 35 years. The policyholder pays premiums throughout this term.',
      pptDescription: 'Regular premium payment equal to policy term. Once the policy matures and the maturity amount is paid, no further premiums are ever payable.'
    },
    benefits: {
      summary: 'Table 915 offers exceptional dual-stage benefits: term benefits and post-term lifelong benefits.',
      maturityBenefit: {
        isGuaranteed: false,
        description: 'Payable at the end of the policy term if the policyholder survives and all premiums are fully paid.',
        formulaSnippet: 'Maturity Payout = Basic Sum Assured + Accrued Simple Reversionary Bonuses + Final Additional Bonus (FAB)',
        explanation: 'The policyholder receives this entire lump sum. Crucially, the policy does NOT terminate here; it enters whole-life cover status.'
      },
      deathBenefit: {
        isGuaranteed: true,
        description: 'Two-stage death benefit structure:',
        formulaSnippet: 'Death during Policy Term: 125% of Basic Sum Assured + Vested Bonuses + FAB; Death after Policy Term: 100% of Basic Sum Assured to nominee.',
        postMaturityCover: 'Whenever the life assured dies after policy maturity (even at age 80, 90, or 100), the nominee receives an additional 100% Basic Sum Assured.'
      },
      bonusInfo: {
        type: 'Simple Reversionary Bonus during policy term',
        isGuaranteed: false,
        description: 'Bonuses accrue annually throughout the policy paying term and are paid out with the maturity claim. Bonuses do not accrue post-maturity.',
        historicalContext: 'Table 915 has historically declared reversionary bonuses in the range of ₹40 to ₹49 per ₹1,000 Sum Assured depending on duration.'
      }
    },
    policyOperations: {
      loanFacility: {
        isAvailable: true,
        eligibilityCondition: 'Loan is available during the policy term after 2 full policy years of premium payment.',
        maximumLoanLimit: 'Up to 90% of surrender value for in-force policies; 80% for paid-up policies.',
        interestDetails: 'Interest is charged at prevailing LIC rates compounded half-yearly.'
      },
      surrenderValue: {
        isAvailable: true,
        minimumPaidYears: '2 full policy years',
        gsvExplanation: 'GSV percentage of premiums paid excluding rider/tax charges plus surrender value of vested bonuses.',
        ssvExplanation: 'SSV based on paid-up value and bonus factor tables. Note: Surrendering terminates the lifetime post-maturity cover.',
        lossWarning: 'Early surrender incurs capital shortfall and forfeits the lifelong whole-life death benefit.'
      },
      paidUpOption: {
        isAvailable: true,
        condition: 'Acquires paid-up status after 2 full years’ premiums. Paid-up sum assured is reduced proportionately.',
        paidUpFormula: 'Paid-Up Sum Assured = Basic Sum Assured × (Premiums Paid / Premiums Payable)',
        bonusRule: 'Post-maturity cover also reduces to the proportionate Paid-Up Sum Assured.'
      },
      gracePeriod: '30 days for yearly, half-yearly, and quarterly modes; 15 days for monthly mode.',
      freeLookPeriod: '15 days for offline physical purchases; 30 days for electronic/online policies.'
    },
    taxProvisions: {
      section80C: 'Premiums eligible for tax deduction under Section 80C up to ₹1,50,000 annually.',
      section1010D: 'Maturity proceeds and death claim payouts are exempt under Section 10(10D) subject to statutory conditions.',
      budget2023Notice: 'Non-ULIP policies with aggregate annual premiums above ₹5 Lakhs (issued on or after April 1, 2023) have taxable maturity gains. Both during-term and post-maturity death claim payouts remain 100% tax-free.'
    },
    illustrativeExample: {
      title: 'Illustrative Example for Table 915',
      scenario: {
        age: 30,
        sumAssured: '₹10,00,000',
        policyTerm: '20 Years',
        ppt: '20 Years',
        premiumMode: 'Yearly'
      },
      estimatedResults: {
        annualBasePremium: '₹56,400',
        firstYearGst: '₹2,538 (4.5%)',
        firstYearInstallment: '₹58,938',
        totalPremiumsPaid: '₹11,50,000 (Estimated 20-yr total)',
        estimatedBonus: '₹9,20,000 (Illustrative @ ₹46/1000 SA/yr)',
        estimatedFab: '₹70,000 (Illustrative @ ₹70/1000 SA)',
        estimatedTotalMaturity: '₹19,90,000 + ₹10,00,000 Lifelong Cover'
      },
      explanation: 'At age 50 (maturity), the policyholder receives an estimated ₹19.90 Lakhs. Additionally, a ₹10 Lakhs life cover continues with zero future premiums, payable to nominees whenever death occurs.'
    },
    calculationMethodology: {
      title: 'Calculation Methodology & Logic',
      steps: [
        'Step 1: Fetch tabular rate per ₹1,000 SA for age 30, term 20 years for Table 915.',
        'Step 2: Deduct high sum assured rebate (₹2.00/₹1,000 for SA >= ₹5 Lakhs) and modal rebate (2% for yearly).',
        'Step 3: Compute gross installment premium adding 4.5% first-year GST or 2.25% renewal GST.',
        'Step 4: Compute estimated maturity = Basic Sum Assured + (Vested Bonus Rate × SA/1000 × 20) + FAB.',
        'Step 5: Record post-maturity lifelong death cover = 100% Basic Sum Assured.'
      ]
    },
    importantNotes: [
      'The post-maturity life cover of 100% Sum Assured is guaranteed and does not require premium payments after the policy term.',
      'Reversionary bonuses are declared annually and depend on LIC’s overall corporate financial performance.',
      'Always refer to the official policy bond for precise terms, conditions, and exclusion clauses.'
    ],
    sources: [
      {
        title: 'LIC New Jeevan Anand Policy Document (Table 915)',
        publisher: 'Life Insurance Corporation of India',
        reference: 'UIN: 512N279V02 / Ref: CO/MKTG/2020',
        documentUrl: 'https://licindia.in'
      },
      {
        title: 'IRDAI Public Disclosures on Whole Life Products',
        publisher: 'IRDAI',
        reference: 'IRDAI/NL/LIC/512N279V02'
      }
    ],
    faqs: [
      {
        question: 'What makes LIC New Jeevan Anand (Table 915) unique?',
        answer: 'Table 915 is unique because it provides a complete maturity payout (Sum Assured + Bonus + FAB) at the end of the term, AND continues to provide a 100% Basic Sum Assured life cover for the life assured’s entire lifetime without any further premium payments.'
      },
      {
        question: 'What is the death benefit during the policy term for Table 915?',
        answer: 'During the policy term, the death benefit is 125% of the Basic Sum Assured (or 7 times annualised premium) plus all accrued Simple Reversionary Bonuses and Final Additional Bonus.'
      },
      {
        question: 'Do I have to pay any premiums after the policy matures?',
        answer: 'No. After the policy term ends and you receive your maturity proceeds, no further premiums are payable. The 100% Basic Sum Assured whole-life cover continues automatically until death.'
      },
      {
        question: 'Can I surrender the policy after maturity to get more cash?',
        answer: 'No. The maturity proceeds paid at the end of the term represent the full cash surrender value. The remaining post-maturity cover is payable only upon the death of the life assured to the registered nominee.'
      },
      {
        question: 'What is the maximum entry age for Table 915?',
        answer: 'The maximum age at entry is 50 years (nearer birthday), and the maximum maturity age is 75 years.'
      },
      {
        question: 'Is a policy loan available under Table 915?',
        answer: 'Yes, a policy loan can be availed after completing 2 full policy years with paid premiums, up to 90% of the surrender value for active in-force policies.'
      }
    ],
    relatedTools: [
      {
        title: 'LIC Premium Calculator',
        description: 'Calculate exact premium installments for Table 915 with frequency rebates.',
        url: '/lic-premium-calculator/',
        category: 'Premium'
      },
      {
        title: 'LIC Maturity Calculator',
        description: 'Simulate maturity amounts and lifelong cover milestones for Table 915.',
        url: '/lic-maturity-calculator/',
        category: 'Maturity'
      },
      {
        title: 'LIC Surrender Value Calculator',
        description: 'Understand surrender implications before terminating Table 915 early.',
        url: '/lic-surrender-value-calculator/',
        category: 'Surrender'
      },
      {
        title: 'LIC Paid-Up Calculator',
        description: 'Calculate reduced maturity and reduced post-maturity cover if premiums cease.',
        url: '/lic-paid-up-calculator/',
        category: 'Paid-Up'
      },
      {
        title: 'LIC Death Benefit Calculator',
        description: 'Estimate total nominee payout during term and post-maturity periods.',
        url: '/lic-death-benefit-calculator/',
        category: 'Death Benefit'
      }
    ]
  },

  '936-jeevan-labh': {
    slug: '936-jeevan-labh',
    tableNo: 936,
    planCode: '936',
    name: 'LIC Jeevan Labh (Table 936)',
    shortName: 'Jeevan Labh',
    uin: '512N304V02',
    category: 'Limited Premium Paying Endowment',
    launchDate: '01/02/2020',
    status: 'Active / Open for Sale',
    lastReviewedDate: 'August 2026',
    minAge: 8,
    maxAge: 59,
    minTerm: 16,
    maxTerm: 25,
    minSumAssured: 200000,
    minSumAssuredFormatted: '₹2,00,000',
    seoTitle: 'LIC Jeevan Labh 936 Calculator | Limited Premium, Maturity & Bonus Hub',
    metaDescription: 'Complete informational hub and calculator for LIC Jeevan Labh (Table 936, UIN: 512N304V02). Calculate limited premium terms (10/15/16 yrs), high bonus maturity, and loan rules.',
    h1: 'LIC Jeevan Labh (Table 936) Calculator & Complete Guide',
    subtitle: 'Official limited premium paying endowment specifications, interactive calculator, and bonus projections for LIC Table 936.',
    introParagraphs: [
      'LIC Jeevan Labh (Table 936, UIN: 512N304V02) is a popular limited premium paying, non-linked, participating endowment plan. It provides substantial financial protection and attractive bonus participation while requiring premium payments for only a limited fraction of the total policy term.',
      'Under Table 936, policyholders choose from three fixed combinations: 16-year term (pay 10 years), 21-year term (pay 15 years), or 25-year term (pay 16 years). Full life insurance protection and bonus accumulation continue for the entire policy term, even after premium payments have ceased.'
    ],
    quickFacts: [
      { label: 'Plan Name', value: 'LIC Jeevan Labh' },
      { label: 'Table Number', value: '936' },
      { label: 'IRDAI UIN', value: '512N304V02' },
      { label: 'Plan Category', value: 'Limited Premium Endowment Assurance' },
      { label: 'Term / PPT Options', value: '16/10, 21/15, and 25/16 (Term / PPT in Years)' },
      { label: 'Entry Age Range', value: '8 Years to 59 Years (Depending on term chosen)' },
      { label: 'Maximum Maturity Age', value: '75 Years' },
      { label: 'Minimum Basic Sum Assured', value: '₹2,00,000' },
      { label: 'Premium Paying Type', value: 'Limited Premium Payment' },
      { label: 'Payment Frequencies', value: 'Yearly, Half-Yearly, Quarterly, Monthly (NACH)' }
    ],
    overview: {
      description: 'Jeevan Labh is widely favored for its limited premium paying structure. Policyholders complete their premium liability early during their active earning years, while their investment continues to accrue annual bonuses until final maturity.',
      targetAudience: 'Parents funding future education/marriage milestones (16 to 25 years away) and professionals wanting to wrap up premium obligations quickly.',
      keyCharacteristics: [
        'Limited premium liability: Stop paying premiums 6 to 9 years before policy maturity.',
        'High historical bonus rate profile due to favorable actuarial fund pooling.',
        'Continuous life risk coverage for the entire policy term.',
        'Option to attach Accidental Death, Disability, and Term Riders.'
      ],
      importantLimitations: [
        'Restricted to three predefined Term/PPT combinations (16/10, 21/15, 25/16).',
        'Minimum Basic Sum Assured starts at ₹2,00,000 (higher than standard endowment plans).',
        'Early surrender before completing the PPT results in severe loss of paid premiums.'
      ]
    },
    eligibility: {
      rows: [
        { parameter: 'Policy Term: 16 Years', requirement: 'PPT: 10 Years | Min Age: 8 Yrs | Max Age: 59 Yrs' },
        { parameter: 'Policy Term: 21 Years', requirement: 'PPT: 15 Years | Min Age: 8 Yrs | Max Age: 54 Yrs' },
        { parameter: 'Policy Term: 25 Years', requirement: 'PPT: 16 Years | Min Age: 8 Yrs | Max Age: 50 Yrs' },
        { parameter: 'Maximum Maturity Age', requirement: '75 Years across all options' },
        { parameter: 'Minimum Basic Sum Assured', requirement: '₹2,00,000' },
        { parameter: 'Sum Assured Multiples', requirement: '₹10,000 up to ₹5,00,000; ₹25,000 thereafter' }
      ],
      verificationNote: 'Maximum entry age is strictly calibrated so that entry age + policy term <= 75 years.'
    },
    premiumInfo: {
      description: 'Because premiums are concentrated into 10, 15, or 16 years, the annual installment is higher than a regular pay plan, but the total cumulative outlay is significantly lower.',
      paymentFrequencies: ['Yearly', 'Half-Yearly', 'Quarterly', 'Monthly (NACH)'],
      modalRebates: [
        { tier: 'Yearly Mode', discount: '2.0% rebate on base tabular premium' },
        { tier: 'Half-Yearly Mode', discount: '1.0% rebate on base tabular premium' },
        { tier: 'Quarterly & Monthly', discount: 'Nil (0%)' }
      ],
      highSaRebates: [
        { tier: '₹2,00,000 to ₹4,90,000', discount: 'Nil (0%)' },
        { tier: '₹5,00,000 to ₹14,90,000', discount: '₹1.50 per ₹1,000 Sum Assured' },
        { tier: '₹15,00,000 and above', discount: '₹2.00 per ₹1,000 Sum Assured' }
      ],
      gstExplanation: 'First year GST is 4.50%; renewal years GST is 2.25%.',
      factorsAffectingPremium: [
        'Chosen combination (16/10 has highest annual premium; 25/16 has lowest annual premium)',
        'Age at entry',
        'Sum Assured volume rebate tiers'
      ]
    },
    policyTermInfo: {
      termsDescription: 'Fixed choices of 16, 21, or 25 years.',
      pptDescription: '10 years (for 16-yr term), 15 years (for 21-yr term), or 16 years (for 25-yr term). After the PPT, zero premiums are due while coverage continues.'
    },
    benefits: {
      summary: 'Table 936 provides comprehensive death coverage throughout the full policy term and a substantial maturity lump sum at the end.',
      maturityBenefit: {
        isGuaranteed: false,
        description: 'Payable at the end of the 16, 21, or 25-year policy term upon surviving the tenure with all PPT premiums cleared.',
        formulaSnippet: 'Maturity Payout = Basic Sum Assured (Guaranteed) + Accrued Simple Reversionary Bonuses (Non-Guaranteed) + Final Additional Bonus (Non-Guaranteed)',
        explanation: 'The full Basic Sum Assured is guaranteed. Bonuses accumulate across all policy years (e.g. all 25 years), not just during the premium paying years.'
      },
      deathBenefit: {
        isGuaranteed: true,
        description: 'Payable on death of the life assured during the policy term (even during the non-paying gap years):',
        formulaSnippet: 'Death Benefit = Sum Assured on Death (Higher of 7× annualised premium or Basic SA) + Vested Bonuses + FAB'
      },
      bonusInfo: {
        type: 'Simple Reversionary Bonus + Final Additional Bonus',
        isGuaranteed: false,
        description: 'Table 936 has historically commanded high bonus declarations due to the limited premium endowment structure.',
        historicalContext: 'Historical bonus declarations have typically ranged around ₹44 to ₹54 per ₹1,000 Sum Assured depending on whether the 16, 21, or 25-year term was chosen.'
      }
    },
    policyOperations: {
      loanFacility: {
        isAvailable: true,
        eligibilityCondition: 'Policy loan can be availed after completing at least 2 full policy years with paid premiums.',
        maximumLoanLimit: 'Up to 90% of surrender value for in-force policies; 80% for paid-up policies.',
        interestDetails: 'Interest is charged at standard LIC semi-annual compounding rates.'
      },
      surrenderValue: {
        isAvailable: true,
        minimumPaidYears: '2 full policy years',
        gsvExplanation: 'Statutory GSV percentage applied on cumulative base premiums paid plus bonus surrender value.',
        ssvExplanation: 'Special Surrender Value based on proportionate paid-up sum assured and accrued bonus factors.',
        lossWarning: 'Surrendering before completing the PPT results in major capital loss.'
      },
      paidUpOption: {
        isAvailable: true,
        condition: 'If at least 2 full years of premiums are paid and subsequent premiums lapse, the policy converts to Paid-Up status.',
        paidUpFormula: 'Paid-Up Sum Assured = Basic Sum Assured × (Premiums Paid / PPT)',
        bonusRule: 'Bonuses stop accruing after premium lapse, but prior vested bonuses remain payable at maturity or death.'
      },
      gracePeriod: '30 days for yearly, half-yearly, and quarterly modes; 15 days for monthly NACH mode.',
      freeLookPeriod: '15 days for offline physical policies; 30 days for policies sourced electronically.'
    },
    taxProvisions: {
      section80C: 'Premiums eligible for annual tax deductions up to ₹1,50,000 under Section 80C.',
      section1010D: 'Maturity proceeds exempt under Section 10(10D) subject to statutory conditions and the ₹5 Lakh annual premium limit (Budget 2023).',
      budget2023Notice: 'Non-ULIP policies with aggregate annual premiums above ₹5 Lakhs (issued after April 1, 2023) have taxable maturity returns. Death benefits remain 100% tax-free.'
    },
    illustrativeExample: {
      title: 'Illustrative Example for Table 936 (25-Year Term / 16-Year PPT)',
      scenario: {
        age: 30,
        sumAssured: '₹10,00,000',
        policyTerm: '25 Years',
        ppt: '16 Years',
        premiumMode: 'Yearly'
      },
      estimatedResults: {
        annualBasePremium: '₹46,800',
        firstYearGst: '₹2,106 (4.5%)',
        firstYearInstallment: '₹48,906',
        totalPremiumsPaid: '₹7,65,000 (16-yr total outlay)',
        estimatedBonus: '₹13,00,000 (Illustrative @ ₹52/1000 SA × 25 yrs)',
        estimatedFab: '₹2,50,000 (Illustrative @ ₹250/1000 SA for 25 yrs)',
        estimatedTotalMaturity: '₹25,50,000'
      },
      explanation: 'The policyholder pays premiums for only 16 years (approx ₹7.65 Lakhs total outlay), but bonus accumulates for the full 25 years, resulting in an illustrative estimated maturity payout of ₹25.50 Lakhs at Year 25.'
    },
    calculationMethodology: {
      title: 'Calculation Methodology & Logic',
      steps: [
        'Step 1: Identify selected Term/PPT combination (16/10, 21/15, or 25/16).',
        'Step 2: Obtain base tabular rate for age and combination, applying high sum assured rebate (₹2.00/₹1,000 for SA >= ₹15L).',
        'Step 3: Apply 2% yearly or 1% half-yearly mode rebate and compute annual installment.',
        'Step 4: Total outlay = Annual base premium × PPT (e.g. 16 years).',
        'Step 5: Compute estimated maturity = Basic Sum Assured + (Vested Bonus Rate × SA/1000 × Policy Term) + (FAB Rate × SA/1000).'
      ]
    },
    importantNotes: [
      'Bonuses accumulate for the full policy term (16, 21, or 25 years), not just during the premium paying years.',
      'Historical bonus declarations are subject to variation depending on annual LIC actuarial surplus.',
      'Always refer to the official LIC policy circular Table 936 for exact terms.'
    ],
    sources: [
      {
        title: 'LIC Jeevan Labh Policy Document (Table 936)',
        publisher: 'Life Insurance Corporation of India',
        reference: 'UIN: 512N304V02 / Ref: CO/MKTG/2020',
        documentUrl: 'https://licindia.in'
      },
      {
        title: 'IRDAI Product Filing for Limited Premium Endowment Plans',
        publisher: 'IRDAI',
        reference: 'IRDAI/NL/LIC/512N304V02'
      }
    ],
    faqs: [
      {
        question: 'What is the key advantage of LIC Jeevan Labh (Table 936)?',
        answer: 'The primary advantage is limited premium payment. You pay premiums for only 10, 15, or 16 years while enjoying complete life insurance coverage and earning bonuses for the full 16, 21, or 25-year policy term.'
      },
      {
        question: 'Do bonuses continue to accumulate after I finish paying premiums?',
        answer: 'Yes. Even during the gap years (after the PPT finishes until maturity), your policy continues to participate in LIC’s annual bonus declarations for the full policy term.'
      },
      {
        question: 'What are the three Term / PPT combinations in Table 936?',
        answer: 'The three available combinations are: 16-year term with 10-year PPT, 21-year term with 15-year PPT, and 25-year term with 16-year PPT.'
      },
      {
        question: 'What is the minimum Sum Assured required for Table 936?',
        answer: 'The minimum Basic Sum Assured for Table 936 is ₹2,00,000, with no upper limit subject to financial underwriting.'
      },
      {
        question: 'What happens if the policyholder dies after the PPT but before maturity?',
        answer: 'The nominee receives the full Death Benefit: Sum Assured on Death + all bonuses accrued up to the year of death + Final Additional Bonus.'
      },
      {
        question: 'Can I take a loan on my Jeevan Labh policy?',
        answer: 'Yes, a loan facility is available after paying 2 full years of premiums, up to 90% of the surrender value for active policies.'
      }
    ],
    relatedTools: [
      {
        title: 'LIC Premium Calculator',
        description: 'Calculate limited premium installments for Table 936 combinations.',
        url: '/lic-premium-calculator/',
        category: 'Premium'
      },
      {
        title: 'LIC Maturity Calculator',
        description: 'Project high bonus returns across 16, 21, and 25-year terms.',
        url: '/lic-maturity-calculator/',
        category: 'Maturity'
      },
      {
        title: 'LIC Surrender Value Calculator',
        description: 'Check guaranteed vs special surrender values for Table 936.',
        url: '/lic-surrender-value-calculator/',
        category: 'Surrender'
      },
      {
        title: 'LIC Paid-Up Calculator',
        description: 'See reduced paid-up values if premiums stop before PPT completion.',
        url: '/lic-paid-up-calculator/',
        category: 'Paid-Up'
      },
      {
        title: 'LIC Policy Loan Calculator',
        description: 'Estimate maximum loan eligibility and repayment interest on Table 936.',
        url: '/lic-loan-calculator/',
        category: 'Loan'
      }
    ]
  },

  '945-jeevan-umang': {
    slug: '945-jeevan-umang',
    tableNo: 945,
    planCode: '945',
    name: 'LIC Jeevan Umang (Table 945)',
    shortName: 'Jeevan Umang',
    uin: '512N312V02',
    category: 'Whole Life 8% Guaranteed Survival Income',
    launchDate: '01/02/2020',
    status: 'Active / Open for Sale',
    lastReviewedDate: 'August 2026',
    minAge: 0,
    maxAge: 55,
    minTerm: 15,
    maxTerm: 30,
    minSumAssured: 200000,
    minSumAssuredFormatted: '₹2,00,000',
    seoTitle: 'LIC Jeevan Umang 945 Calculator | 8% Guaranteed Income, Maturity & Bonus Hub',
    metaDescription: 'Complete informational hub and calculator for LIC Jeevan Umang (Table 945, UIN: 512N312V02). Calculate 8% guaranteed annual survival income, maturity at age 100, and loan rules.',
    h1: 'LIC Jeevan Umang (Table 945) Calculator & Complete Guide',
    subtitle: 'Comprehensive guide and interactive calculator for Table 945 — featuring guaranteed annual survival income of 8% of Sum Assured from end of PPT until age 99, plus maturity at age 100.',
    introParagraphs: [
      'LIC Jeevan Umang (Table 945, UIN: 512N312V02) is an individual, participating whole-life assurance plan that offers a combination of lifelong guaranteed annual survival income and life risk protection for the policyholder up to 100 years of age.',
      'Following completion of the chosen Premium Paying Term (15, 20, 25, or 30 years), the plan pays a contractually guaranteed annual survival benefit equal to exactly 8% of the Basic Sum Assured every year until age 99 or prior demise. Upon reaching age 100, the policyholder receives a lump-sum maturity payout of the Basic Sum Assured plus all accrued bonuses.'
    ],
    quickFacts: [
      { label: 'Plan Name', value: 'LIC Jeevan Umang' },
      { label: 'Table Number', value: '945' },
      { label: 'IRDAI UIN', value: '512N312V02' },
      { label: 'Plan Category', value: 'Whole Life Income Assurance' },
      { label: 'Premium Paying Terms (PPT)', value: '15, 20, 25, 30 Years' },
      { label: 'Guaranteed Survival Income', value: '8% of Basic Sum Assured per year (Guaranteed)' },
      { label: 'Income Duration', value: 'From end of PPT until Age 99 (or prior death)' },
      { label: 'Maturity Age', value: '100 Years (Lump Sum Sum Assured + Bonus + FAB)' },
      { label: 'Entry Age Range', value: '90 Days (0 Years) to 55 Years' },
      { label: 'Minimum Basic Sum Assured', value: '₹2,00,000' },
      { label: 'Payment Frequencies', value: 'Yearly, Half-Yearly, Quarterly, Monthly (NACH)' }
    ],
    overview: {
      description: 'Jeevan Umang is designed as a lifelong pension and wealth replacement instrument. It is ideal for individuals seeking a guaranteed regular pension-like cash flow in retirement while preserving a massive generational inheritance for their heirs.',
      targetAudience: 'Retirees desiring guaranteed 8% annual cash flow, parents investing for newborn children’s lifetime income, and wealth builders planning generational legacies.',
      keyCharacteristics: [
        'Guaranteed annual cash flow: 8% of Basic Sum Assured paid every year post-PPT until age 99.',
        'Lifelong insurance protection covering up to 100 years of age.',
        'Lump-sum maturity at age 100: Basic Sum Assured + Vested Bonuses + FAB.',
        'Accrues simple reversionary bonuses throughout the premium paying term.'
      ],
      importantLimitations: [
        'Annual 8% survival benefits start only after completing the full Premium Paying Term.',
        'Bonus accrual stops at the end of the PPT; post-PPT years do not earn additional reversionary bonuses.',
        'Surrendering early terminates the lifelong 8% annual income entitlement.'
      ]
    },
    eligibility: {
      rows: [
        { parameter: 'PPT: 15 Years', requirement: 'Min Age: 90 Days | Max Age: 55 Years' },
        { parameter: 'PPT: 20 Years', requirement: 'Min Age: 90 Days | Max Age: 50 Years' },
        { parameter: 'PPT: 25 Years', requirement: 'Min Age: 90 Days | Max Age: 45 Years' },
        { parameter: 'PPT: 30 Years', requirement: 'Min Age: 90 Days | Max Age: 40 Years' },
        { parameter: 'Policy Term', requirement: '100 minus Entry Age (Years)' },
        { parameter: 'Minimum Basic Sum Assured', requirement: '₹2,00,000' },
        { parameter: 'Sum Assured Multiples', requirement: '₹25,000 multiples' }
      ],
      verificationNote: 'Entry age must satisfy: Entry Age + PPT <= 70 years.'
    },
    premiumInfo: {
      description: 'Premiums are payable for the chosen PPT (15, 20, 25, or 30 years). Long-term payment modes qualify for standard modal and high sum assured rebates.',
      paymentFrequencies: ['Yearly', 'Half-Yearly', 'Quarterly', 'Monthly (NACH)'],
      modalRebates: [
        { tier: 'Yearly Mode', discount: '2.0% rebate on base tabular premium' },
        { tier: 'Half-Yearly Mode', discount: '1.0% rebate on base tabular premium' },
        { tier: 'Quarterly & Monthly', discount: 'Nil (0%)' }
      ],
      highSaRebates: [
        { tier: '₹2,00,000 to ₹4,75,000', discount: 'Nil (0%)' },
        { tier: '₹5,00,000 to ₹9,75,000', discount: '₹1.25 per ₹1,000 Sum Assured' },
        { tier: '₹10,00,000 to ₹24,75,000', discount: '₹1.75 per ₹1,000 Sum Assured' },
        { tier: '₹25,00,000 and above', discount: '₹2.00 per ₹1,000 Sum Assured' }
      ],
      gstExplanation: 'First year GST is 4.50%; renewal years GST is 2.25%.',
      factorsAffectingPremium: [
        'PPT length (15-year PPT has higher annual premium; 30-year PPT has lower annual premium)',
        'Entry age of life assured',
        'Sum Assured rebate tiers'
      ]
    },
    policyTermInfo: {
      termsDescription: 'Policy Term is mathematically fixed at (100 - Entry Age) years, guaranteeing coverage until age 100.',
      pptDescription: 'Premium paying term choices: 15, 20, 25, or 30 years.'
    },
    benefits: {
      summary: 'Table 945 combines guaranteed survival income, whole life death cover, and maturity lump sum at age 100.',
      survivalBenefit: {
        isGuaranteed: true,
        description: '8% of Basic Sum Assured payable annually at the end of each policy year starting from the end of the PPT until age 99 or prior death.',
        payoutSchedule: 'Contractually guaranteed cash payout into bank account via NEFT every year.'
      },
      maturityBenefit: {
        isGuaranteed: false,
        description: 'Payable if the policyholder survives to 100 years of age:',
        formulaSnippet: 'Maturity Payout at Age 100 = Basic Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus',
        explanation: 'Basic Sum Assured is guaranteed; bonus amounts represent accumulated bonuses from the PPT.'
      },
      deathBenefit: {
        isGuaranteed: true,
        description: 'Payable on death of life assured at any point before age 100:',
        formulaSnippet: 'Death during PPT: Sum Assured on Death + Accrued Bonuses + FAB; Death after PPT: Basic Sum Assured + FAB to nominee (Survival benefits already paid are not deducted).'
      },
      bonusInfo: {
        type: 'Simple Reversionary Bonus during PPT only',
        isGuaranteed: false,
        description: 'Bonuses accrue annually throughout the PPT and vest to be paid at death or age 100 maturity.',
        historicalContext: 'Table 945 historical bonus rates have typically ranged around ₹45 to ₹52 per ₹1,000 Sum Assured during the premium paying term.'
      }
    },
    policyOperations: {
      loanFacility: {
        isAvailable: true,
        eligibilityCondition: 'Policy loan is available after paying 2 full years of premiums. Even after the PPT during the income phase, policy loan remains accessible.',
        maximumLoanLimit: 'Up to 90% of surrender value for in-force policies; 80% for paid-up policies.',
        interestDetails: 'During the survival income phase, loan interest may be adjusted against annual 8% survival benefit payouts.'
      },
      surrenderValue: {
        isAvailable: true,
        minimumPaidYears: '2 full policy years',
        gsvExplanation: 'GSV percentage of premiums paid plus surrender value of vested bonuses minus survival benefits already paid.',
        ssvExplanation: 'Special Surrender Value factor calculation. Surrendering terminates future 8% annual survival payments.',
        lossWarning: 'Surrendering early terminates the lifelong guaranteed 8% annual income stream.'
      },
      paidUpOption: {
        isAvailable: true,
        condition: 'Acquires paid-up status after 2 full years of premiums.',
        paidUpFormula: 'Paid-Up Survival Benefit = 8% × Paid-Up Sum Assured per year post-PPT.',
        bonusRule: 'Paid-up policy pays reduced survival benefit proportionate to premiums paid.'
      },
      gracePeriod: '30 days for yearly, half-yearly, and quarterly modes; 15 days for monthly mode.',
      freeLookPeriod: '15 days for physical policies; 30 days for online policies.'
    },
    taxProvisions: {
      section80C: 'Premiums eligible for annual tax deduction up to ₹1,50,000 under Section 80C.',
      section1010D: 'Annual 8% survival income payouts and maturity proceeds are exempt under Section 10(10D) subject to statutory conditions and the ₹5 Lakh annual premium limit (Budget 2023).',
      budget2023Notice: 'For non-ULIP policies with aggregate annual premiums above ₹5 Lakhs, annual survival income is taxable as income. Death claim payouts remain 100% tax-free.'
    },
    illustrativeExample: {
      title: 'Illustrative Example for Table 945 (Age 30, 20-Yr PPT, SA ₹10 Lakhs)',
      scenario: {
        age: 30,
        sumAssured: '₹10,00,000',
        policyTerm: '70 Years (Till Age 100)',
        ppt: '20 Years',
        premiumMode: 'Yearly'
      },
      estimatedResults: {
        annualBasePremium: '₹51,000',
        firstYearGst: '₹2,295 (4.5%)',
        firstYearInstallment: '₹53,295',
        totalPremiumsPaid: '₹10,40,000 (20-yr total outlay)',
        estimatedBonus: '₹10,00,000 (Illustrative @ ₹50/1000 SA × 20 yrs)',
        estimatedFab: '₹4,50,000 (Illustrative @ age 100)',
        estimatedTotalMaturity: '₹80,000 Guaranteed Every Year (Ages 50 to 99) + ₹24,50,000 at Age 100'
      },
      explanation: 'From age 50 to 99 (50 years), the policyholder receives a guaranteed ₹80,000 every single year (total ₹40,00,000 in guaranteed income). At age 100, an additional estimated lump sum of ₹24.50 Lakhs is paid.'
    },
    calculationMethodology: {
      title: 'Calculation Methodology & Logic',
      steps: [
        'Step 1: Determine policy term = 100 - Entry Age (e.g. 100 - 30 = 70 years).',
        'Step 2: Obtain base tabular rate for entry age and chosen PPT (15, 20, 25, or 30).',
        'Step 3: Apply high sum assured rebate (₹1.75/₹1,000 for SA >= ₹10L) and 2% yearly mode rebate.',
        'Step 4: Compute guaranteed annual survival income = 8% × Basic Sum Assured (e.g. ₹80,000/yr).',
        'Step 5: Compute estimated lump sum at age 100 = Basic Sum Assured + (Vested Bonus Rate × SA/1000 × PPT) + FAB.'
      ]
    },
    importantNotes: [
      'The 8% annual survival income is guaranteed by LIC and begins immediately after the PPT completes.',
      'Survival income continues every year until the policyholder turns 99 or dies earlier.',
      'In case of death after the PPT, the nominee receives the full Basic Sum Assured + FAB, with zero deductions for survival benefits already paid.',
      'Consult official LIC policy circular Table 945 for full policy terms.'
    ],
    sources: [
      {
        title: 'LIC Jeevan Umang Policy Document (Table 945)',
        publisher: 'Life Insurance Corporation of India',
        reference: 'UIN: 512N312V02 / Ref: CO/MKTG/2020',
        documentUrl: 'https://licindia.in'
      },
      {
        title: 'IRDAI Whole Life Guaranteed Income Regulations',
        publisher: 'IRDAI',
        reference: 'IRDAI/NL/LIC/512N312V02'
      }
    ],
    faqs: [
      {
        question: 'What is the guaranteed survival benefit under LIC Jeevan Umang (Table 945)?',
        answer: 'Table 945 guarantees an annual survival payout of exactly 8% of the Basic Sum Assured every year starting from the end of the Premium Paying Term (PPT) until the policyholder reaches age 99 or dies earlier.'
      },
      {
        question: 'What happens to the policy at age 100?',
        answer: 'Upon surviving to age 100, the policyholder receives a lump-sum maturity benefit equal to the Basic Sum Assured plus all accrued Simple Reversionary Bonuses and Final Additional Bonus.'
      },
      {
        question: 'What is the death benefit if the policyholder dies after the PPT?',
        answer: 'If death occurs after the PPT, the nominee receives the full Basic Sum Assured plus Final Additional Bonus. The 8% annual survival benefits already paid during the policyholder’s lifetime are NOT deducted from the death claim.'
      },
      {
        question: 'What are the available Premium Paying Terms in Table 945?',
        answer: 'You can choose from four Premium Paying Terms: 15 years, 20 years, 25 years, or 30 years.'
      },
      {
        question: 'Can I take a policy loan while receiving the 8% annual income?',
        answer: 'Yes. Policy loans remain available even during the survival income phase. The annual interest can be easily serviced or adjusted against the annual 8% survival payout.'
      },
      {
        question: 'Is the 8% annual survival income tax-free?',
        answer: 'Annual survival benefits are generally exempt under Section 10(10D) of the Income Tax Act, provided aggregate annual premiums across non-ULIP policies issued on or after April 1, 2023 do not exceed ₹5,00,000.'
      }
    ],
    relatedTools: [
      {
        title: 'LIC Pension Calculator',
        description: 'Compare Table 945 guaranteed survival income with standard immediate annuities.',
        url: '/lic-pension-calculator/',
        category: 'Pension'
      },
      {
        title: 'LIC Annuity Calculator',
        description: 'Explore lifetime annuity options and return of purchase price.',
        url: '/lic-annuity-calculator/',
        category: 'Annuity'
      },
      {
        title: 'LIC Premium Calculator',
        description: 'Calculate installment premiums for Table 945 across 15, 20, 25, and 30 PPTs.',
        url: '/lic-premium-calculator/',
        category: 'Premium'
      },
      {
        title: 'LIC Surrender Value Calculator',
        description: 'Estimate cash value before and after the survival income phase.',
        url: '/lic-surrender-value-calculator/',
        category: 'Surrender'
      },
      {
        title: 'LIC Paid-Up Calculator',
        description: 'Calculate proportionate reduced 8% annual income if premiums lapse early.',
        url: '/lic-paid-up-calculator/',
        category: 'Paid-Up'
      }
    ]
  }
};

export function getLocalizedPlanData(slug: string, locale: Locale = 'en'): CompletePlanData {
  const baseData = VERIFIED_PLANS_DATA[slug];
  if (!baseData) {
    throw new Error(`Plan data not found for slug: ${slug}`);
  }

  if (locale === 'en' || !LOCALIZED_PLANS_DATA[locale]?.[slug]) {
    return baseData;
  }

  const overlay = LOCALIZED_PLANS_DATA[locale]![slug]!;

  return {
    ...baseData,
    seoTitle: overlay.seoTitle || baseData.seoTitle,
    metaDescription: overlay.metaDescription || baseData.metaDescription,
    h1: overlay.h1 || baseData.h1,
    subtitle: overlay.subtitle || baseData.subtitle,
    introParagraphs: overlay.introParagraphs || baseData.introParagraphs,
    overview: overlay.overview ? { ...baseData.overview, ...overlay.overview } : baseData.overview,
    faqs: overlay.faqs || baseData.faqs
  };
}
