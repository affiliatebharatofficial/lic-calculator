/**
 * Contextual Internal Linking Engine & Topic Cluster Relationships
 */

export interface InternalLinkItem {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly category: string;
  readonly type: 'calculator' | 'guide' | 'plan' | 'glossary';
}

export const TOPICAL_RELATIONSHIPS: Record<string, InternalLinkItem[]> = {
  // Surrender Pillar
  '/lic-surrender-value-calculator': [
    {
      title: 'Surrender Loss Calculator',
      description: 'Quantify exact monetary shortfall and loss percentage before canceling.',
      url: '/lic-surrender-loss-calculator',
      category: 'Surrender Loss',
      type: 'calculator'
    },
    {
      title: 'Advanced Surrender Decision Analysis',
      description: '3-way numerical comparison: Surrender Now vs. Make Paid-Up vs. Continue.',
      url: '/lic-surrender-analysis',
      category: 'Decision Analysis',
      type: 'calculator'
    },
    {
      title: 'What is LIC Surrender Value? Complete Guide',
      description: 'Understand GSV vs SSV formulas, 2-year acquisition rules, and bonus treatment.',
      url: '/guides/what-is-lic-surrender-value',
      category: 'Educational Guide',
      type: 'guide'
    },
    {
      title: 'Paid-Up vs. Surrender: Which is Better?',
      description: 'Learn why converting to paid-up retains life cover and avoids capital forfeiture.',
      url: '/guides/lic-paid-up-vs-surrender',
      category: 'Decision Guide',
      type: 'guide'
    },
    {
      title: 'Policy Loan Calculator',
      description: 'Borrow up to 90% against your surrender value without losing maturity benefits.',
      url: '/lic-loan-calculator',
      category: 'Liquidity',
      type: 'calculator'
    }
  ],

  // Premium Pillar
  '/lic-premium-calculator': [
    {
      title: 'Maturity Calculator',
      description: 'Estimate expected returns upon policy completion based on sum assured and bonuses.',
      url: '/lic-maturity-calculator',
      category: 'Maturity',
      type: 'calculator'
    },
    {
      title: 'LIC Plans Reference Catalog',
      description: 'Explore table numbers, age criteria, and tenure limits for major LIC plans.',
      url: '/plans',
      category: 'Catalog',
      type: 'plan'
    },
    {
      title: 'How LIC Declares Bonuses',
      description: 'Understand simple reversionary bonus and final additional bonus mechanics.',
      url: '/guides/how-lic-bonus-is-calculated',
      category: 'Guide',
      type: 'guide'
    }
  ],

  // Maturity Pillar
  '/lic-maturity-calculator': [
    {
      title: 'Bonus Calculator',
      description: 'Calculate accrued reversionary bonus and terminal FAB across tenures.',
      url: '/lic-bonus-calculator',
      category: 'Bonus Valuation',
      type: 'calculator'
    },
    {
      title: 'Premium Calculator',
      description: 'Calculate installment costs and explore frequency rebate discounts.',
      url: '/lic-premium-calculator',
      category: 'Premium',
      type: 'calculator'
    }
  ],

  // Loan Pillar
  '/lic-loan-calculator': [
    {
      title: 'Surrender Value Calculator',
      description: 'Verify cash collateral value to determine maximum borrowing limit.',
      url: '/lic-surrender-value-calculator',
      category: 'Surrender',
      type: 'calculator'
    },
    {
      title: 'LIC Policy Loan Rules & Interest Guide',
      description: 'Learn about 9.5% interest, flexible repayment, and death claim settlement.',
      url: '/guides/lic-policy-loan-rules',
      category: 'Loan Guide',
      type: 'guide'
    }
  ]
};

export class InternalLinkingEngine {
  public static getRelatedLinks(currentPath: string): InternalLinkItem[] {
    const clean = currentPath.replace(/\/$/, '');
    return TOPICAL_RELATIONSHIPS[clean] || [
      {
        title: 'LIC Premium Calculator',
        description: 'Calculate policy installment costs with GST rebates.',
        url: '/lic-premium-calculator',
        category: 'General',
        type: 'calculator'
      },
      {
        title: 'LIC Surrender Value Calculator',
        description: 'Check acquired cash value before surrendering.',
        url: '/lic-surrender-value-calculator',
        category: 'Surrender',
        type: 'calculator'
      }
    ];
  }
}
