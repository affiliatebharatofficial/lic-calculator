import type { CalculatorDefinition, CalculatorType } from '@/types/calculator';
import { PremiumCalculator } from './engines/premium';
import { MaturityCalculator } from './engines/maturity';
import { BonusCalculator } from './engines/bonus';
import { SurrenderCalculator } from './engines/surrender';
import { SurrenderLossCalculator } from './engines/surrender-loss';
import { LoanCalculator } from './engines/loan';
import { TermInsuranceCalculator } from './engines/insurance';
import { PensionCalculator } from './engines/pension';
import { PolicyComparisonEngine } from './engines/comparison';
import { SurrenderAnalysisCalculator } from './engines/surrender-analysis';
import { AnnuityCalculator } from './engines/annuity';
import { DeathBenefitCalculator } from './engines/death-benefit';

export const CALCULATOR_REGISTRY: Record<CalculatorType, CalculatorDefinition> = {
  'surrender-value': {
    id: 'surrender-value',
    slug: 'lic-surrender-value-calculator',
    titleKey: 'nav.surrenderCalculator',
    descriptionKey: 'tools.surrenderDesc',
    iconName: 'shield-alert',
    category: 'surrender',
    isAvailable: true,
    fields: [
      {
        name: 'planTableNo',
        label: 'Plan Table Number',
        type: 'select',
        required: true
      },
      {
        name: 'sumAssured',
        label: 'Sum Assured',
        type: 'number',
        required: true,
        min: 50000,
        unit: '₹'
      },
      {
        name: 'policyTerm',
        label: 'Policy Term',
        type: 'number',
        required: true,
        min: 5,
        max: 40,
        unit: 'Years'
      },
      {
        name: 'premiumsPaidCount',
        label: 'Completed Years of Premium Paid',
        type: 'number',
        required: true,
        min: 1,
        max: 40,
        unit: 'Years'
      },
      {
        name: 'totalPremiumsPaid',
        label: 'Total Premium Paid So Far (Excl. GST)',
        type: 'number',
        required: true,
        min: 1000,
        unit: '₹'
      }
    ]
  },

  'surrender-analysis': {
    id: 'surrender-analysis',
    slug: 'lic-surrender-analysis',
    titleKey: 'nav.surrenderAnalysis',
    descriptionKey: 'tools.surrenderAnalysisDesc',
    iconName: 'arrows-split',
    category: 'surrender',
    isAvailable: true,
    fields: [
      {
        name: 'planTableNo',
        label: 'Plan Table Number',
        type: 'select',
        required: true
      },
      {
        name: 'sumAssured',
        label: 'Sum Assured',
        type: 'number',
        required: true,
        min: 50000,
        unit: '₹'
      },
      {
        name: 'policyTerm',
        label: 'Policy Term',
        type: 'number',
        required: true,
        min: 5,
        max: 40,
        unit: 'Years'
      },
      {
        name: 'premiumsPaidCount',
        label: 'Years Paid',
        type: 'number',
        required: true,
        min: 1,
        max: 40,
        unit: 'Years'
      }
    ]
  },

  'surrender-loss': {
    id: 'surrender-loss',
    slug: 'lic-surrender-loss-calculator',
    titleKey: 'nav.surrenderLoss',
    descriptionKey: 'tools.surrenderLossDesc',
    iconName: 'trending-down',
    category: 'surrender',
    isAvailable: true,
    fields: [
      {
        name: 'planTableNo',
        label: 'Plan Table Number',
        type: 'select',
        required: true
      },
      {
        name: 'totalPremiumsPaid',
        label: 'Total Premium Paid',
        type: 'number',
        required: true,
        min: 1000,
        unit: '₹'
      },
      {
        name: 'premiumsPaidCount',
        label: 'Policy Year of Surrender',
        type: 'number',
        required: true,
        min: 1,
        max: 40,
        unit: 'Years'
      }
    ]
  },

  'premium': {
    id: 'premium',
    slug: 'lic-premium-calculator',
    titleKey: 'nav.premiumCalculator',
    descriptionKey: 'tools.premiumDesc',
    iconName: 'calculator',
    category: 'general',
    isAvailable: true,
    fields: [
      {
        name: 'planTableNo',
        label: 'Plan Table Number',
        type: 'select',
        required: true,
        helpText: 'Select the LIC plan number (e.g., 914 for New Endowment)'
      },
      {
        name: 'age',
        label: 'Current Age',
        type: 'number',
        required: true,
        min: 0,
        max: 75,
        unit: 'Years',
        placeholder: 'e.g. 30'
      },
      {
        name: 'policyTerm',
        label: 'Policy Term',
        type: 'number',
        required: true,
        min: 5,
        max: 40,
        unit: 'Years',
        placeholder: 'e.g. 20'
      },
      {
        name: 'sumAssured',
        label: 'Sum Assured (Life Cover)',
        type: 'number',
        required: true,
        min: 50000,
        max: 100000000,
        unit: '₹',
        placeholder: 'e.g. 500000'
      },
      {
        name: 'premiumFrequency',
        label: 'Premium Payment Mode',
        type: 'select',
        required: true,
        defaultValue: 'yearly',
        options: [
          { label: 'Yearly', value: 'yearly' },
          { label: 'Half-Yearly', value: 'half-yearly' },
          { label: 'Quarterly', value: 'quarterly' },
          { label: 'Monthly (NACH)', value: 'monthly' }
        ]
      }
    ]
  },

  'maturity': {
    id: 'maturity',
    slug: 'lic-maturity-calculator',
    titleKey: 'nav.maturityCalculator',
    descriptionKey: 'tools.maturityDesc',
    iconName: 'chart-bar',
    category: 'general',
    isAvailable: true,
    fields: [
      {
        name: 'planTableNo',
        label: 'Plan Table Number',
        type: 'select',
        required: true
      },
      {
        name: 'sumAssured',
        label: 'Sum Assured',
        type: 'number',
        required: true,
        min: 50000,
        max: 100000000,
        unit: '₹'
      },
      {
        name: 'policyTerm',
        label: 'Policy Term',
        type: 'number',
        required: true,
        min: 5,
        max: 40,
        unit: 'Years'
      },
      {
        name: 'age',
        label: 'Entry Age',
        type: 'number',
        required: true,
        min: 0,
        max: 75,
        unit: 'Years'
      }
    ]
  },

  'bonus': {
    id: 'bonus',
    slug: 'lic-bonus-calculator',
    titleKey: 'nav.bonusCalculator',
    descriptionKey: 'tools.bonusDesc',
    iconName: 'gift',
    category: 'general',
    isAvailable: true,
    fields: [
      {
        name: 'planTableNo',
        label: 'Plan Table Number',
        type: 'select',
        required: true
      },
      {
        name: 'sumAssured',
        label: 'Sum Assured',
        type: 'number',
        required: true,
        min: 50000,
        max: 100000000,
        unit: '₹'
      },
      {
        name: 'policyTerm',
        label: 'Policy Term',
        type: 'number',
        required: true,
        min: 5,
        max: 40,
        unit: 'Years'
      }
    ]
  },

  'loan': {
    id: 'loan',
    slug: 'lic-loan-calculator',
    titleKey: 'nav.loanCalculator',
    descriptionKey: 'tools.loanDesc',
    iconName: 'banknotes',
    category: 'general',
    isAvailable: true,
    fields: [
      {
        name: 'surrenderValue',
        label: 'Current Estimated Surrender Value',
        type: 'number',
        required: true,
        min: 10000,
        unit: '₹'
      }
    ]
  },

  'term-insurance': {
    id: 'term-insurance',
    slug: 'lic-term-insurance-calculator',
    titleKey: 'nav.termCalculator',
    descriptionKey: 'tools.termDesc',
    iconName: 'shield-check',
    category: 'protection',
    isAvailable: true,
    fields: [
      {
        name: 'age',
        label: 'Current Age',
        type: 'number',
        required: true,
        min: 18,
        max: 65,
        unit: 'Years'
      },
      {
        name: 'sumAssured',
        label: 'Life Cover Required',
        type: 'number',
        required: true,
        min: 2500000,
        unit: '₹'
      },
      {
        name: 'policyTerm',
        label: 'Coverage Duration',
        type: 'number',
        required: true,
        min: 10,
        max: 50,
        unit: 'Years'
      }
    ]
  },

  'death-benefit': {
    id: 'death-benefit',
    slug: 'lic-death-benefit-calculator',
    titleKey: 'nav.deathBenefitCalculator',
    descriptionKey: 'tools.deathBenefitDesc',
    iconName: 'heart',
    category: 'protection',
    isAvailable: true,
    fields: [
      {
        name: 'planTableNo',
        label: 'Plan Table Number',
        type: 'select',
        required: true
      },
      {
        name: 'sumAssured',
        label: 'Basic Sum Assured',
        type: 'number',
        required: true,
        min: 50000,
        unit: '₹'
      },
      {
        name: 'policyTerm',
        label: 'Policy Term',
        type: 'number',
        required: true,
        min: 5,
        max: 40,
        unit: 'Years'
      },
      {
        name: 'completedYears',
        label: 'Policy Years Completed',
        type: 'number',
        required: true,
        min: 1,
        max: 40,
        unit: 'Years'
      }
    ]
  },

  'pension': {
    id: 'pension',
    slug: 'lic-pension-calculator',
    titleKey: 'nav.pensionCalculator',
    descriptionKey: 'tools.pensionDesc',
    iconName: 'user-group',
    category: 'retirement',
    isAvailable: true,
    fields: [
      {
        name: 'purchasePrice',
        label: 'Purchase Price / Corpus',
        type: 'number',
        required: true,
        min: 100000,
        unit: '₹'
      },
      {
        name: 'age',
        label: 'Annuitant Age',
        type: 'number',
        required: true,
        min: 30,
        max: 85,
        unit: 'Years'
      }
    ]
  },

  'annuity': {
    id: 'annuity',
    slug: 'lic-annuity-calculator',
    titleKey: 'nav.annuityCalculator',
    descriptionKey: 'tools.annuityDesc',
    iconName: 'cash',
    category: 'retirement',
    isAvailable: true,
    fields: [
      {
        name: 'purchasePrice',
        label: 'Purchase Price / Corpus',
        type: 'number',
        required: true,
        min: 100000,
        unit: '₹'
      },
      {
        name: 'age',
        label: 'Annuitant Age',
        type: 'number',
        required: true,
        min: 30,
        max: 85,
        unit: 'Years'
      }
    ]
  }
};

export const ALL_CALCULATORS = Object.values(CALCULATOR_REGISTRY);

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  const cleanSlug = slug.replace(/^\//, '');
  return ALL_CALCULATORS.find((calc) => calc.slug === cleanSlug || calc.id === cleanSlug);
}

// Engine instances singleton registry
export const ENGINES = {
  premium: new PremiumCalculator(),
  maturity: new MaturityCalculator(),
  bonus: new BonusCalculator(),
  surrender: new SurrenderCalculator(),
  surrenderLoss: new SurrenderLossCalculator(),
  surrenderAnalysis: new SurrenderAnalysisCalculator(),
  loan: new LoanCalculator(),
  termInsurance: new TermInsuranceCalculator(),
  pension: new PensionCalculator(),
  annuity: new AnnuityCalculator(),
  deathBenefit: new DeathBenefitCalculator(),
  comparison: new PolicyComparisonEngine()
} as const;
