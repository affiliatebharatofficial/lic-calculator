/**
 * Centralized Search Intent Mapping & Keyword Cannibalization Defense
 */

export interface SearchIntentEntry {
  readonly clusterId: string;
  readonly clusterName: string;
  readonly primaryIntent: string;
  readonly primaryKeyword: string;
  readonly secondaryKeywords: readonly string[];
  readonly canonicalPath: string;
  readonly isPillar: boolean;
  readonly supportingPaths?: readonly string[];
}

export const SEARCH_INTENT_MAP: readonly SearchIntentEntry[] = [
  // 1. Surrender Cluster
  {
    clusterId: 'cluster_surrender',
    clusterName: 'LIC Policy Surrender Valuation & Loss Analysis',
    primaryIntent: 'Calculate exact cash surrender value (GSV & SSV) of an LIC policy',
    primaryKeyword: 'lic surrender value calculator',
    secondaryKeywords: [
      'lic surrender value calculation formula',
      'how to calculate lic surrender value',
      'lic policy surrender value online',
      'lic gsv vs ssv calculation'
    ],
    canonicalPath: '/lic-surrender-value-calculator',
    isPillar: true,
    supportingPaths: [
      '/lic-surrender-analysis',
      '/lic-surrender-loss-calculator',
      '/guides/what-is-lic-surrender-value',
      '/guides/lic-paid-up-vs-surrender'
    ]
  },
  {
    clusterId: 'cluster_surrender',
    clusterName: 'LIC Policy Surrender Valuation & Loss Analysis',
    primaryIntent: 'Comprehensive 3-way decision comparison: Surrender vs Paid-Up vs Continue',
    primaryKeyword: 'lic surrender analysis',
    secondaryKeywords: [
      'should i surrender my lic policy',
      'lic surrender vs continue policy',
      'lic surrender alternatives'
    ],
    canonicalPath: '/lic-surrender-analysis',
    isPillar: false
  },
  {
    clusterId: 'cluster_surrender',
    clusterName: 'LIC Policy Surrender Valuation & Loss Analysis',
    primaryIntent: 'Quantify financial shortfall and capital loss percentage before surrendering',
    primaryKeyword: 'lic surrender loss calculator',
    secondaryKeywords: [
      'lic policy surrender loss calculation',
      'how much loss on lic surrender',
      'lic surrender penalty calculator'
    ],
    canonicalPath: '/lic-surrender-loss-calculator',
    isPillar: false
  },

  // 2. Premium Cluster
  {
    clusterId: 'cluster_premium',
    clusterName: 'LIC Policy Premium & Rebate Calculation',
    primaryIntent: 'Calculate installment premium with GST and mode/SA rebates',
    primaryKeyword: 'lic premium calculator',
    secondaryKeywords: [
      'lic policy premium calculation',
      'lic premium chart with gst',
      'calculate lic installment premium online'
    ],
    canonicalPath: '/lic-premium-calculator',
    isPillar: true,
    supportingPaths: ['/lic-plans', '/plans']
  },

  // 3. Maturity Cluster
  {
    clusterId: 'cluster_maturity',
    clusterName: 'LIC Maturity & Returns Projection',
    primaryIntent: 'Calculate final maturity proceeds including bonus and FAB',
    primaryKeyword: 'lic maturity calculator',
    secondaryKeywords: [
      'lic policy maturity amount calculation',
      'lic maturity return calculator',
      'lic maturity bonus computation'
    ],
    canonicalPath: '/lic-maturity-calculator',
    isPillar: true,
    supportingPaths: ['/lic-bonus-calculator', '/guides/how-lic-bonus-is-calculated']
  },

  // 4. Bonus Cluster
  {
    clusterId: 'cluster_bonus',
    clusterName: 'LIC Bonus & Actuarial Valuation',
    primaryIntent: 'Estimate annual Simple Reversionary Bonus and Final Additional Bonus',
    primaryKeyword: 'lic bonus calculator',
    secondaryKeywords: [
      'lic bonus rates valuation',
      'lic fab rates chart',
      'how lic declares bonus'
    ],
    canonicalPath: '/lic-bonus-calculator',
    isPillar: true,
    supportingPaths: ['/guides/how-lic-bonus-is-calculated']
  },

  // 5. Loan Cluster
  {
    clusterId: 'cluster_loan',
    clusterName: 'LIC Policy Loan & Liquidity',
    primaryIntent: 'Calculate maximum loan borrowing capacity and semi-annual interest',
    primaryKeyword: 'lic policy loan calculator',
    secondaryKeywords: [
      'how much loan can i get on lic policy',
      'lic policy loan interest rate',
      'lic loan eligibility calculator'
    ],
    canonicalPath: '/lic-loan-calculator',
    isPillar: true,
    supportingPaths: ['/guides/lic-policy-loan-rules']
  }
];

export class SearchIntentManager {
  public static findByPath(path: string): SearchIntentEntry | undefined {
    const clean = path.replace(/\/$/, '');
    return SEARCH_INTENT_MAP.find((entry) => entry.canonicalPath === clean);
  }

  public static getClusterPillar(clusterId: string): SearchIntentEntry | undefined {
    return SEARCH_INTENT_MAP.find((entry) => entry.clusterId === clusterId && entry.isPillar);
  }

  public static getClusterSupporting(clusterId: string): SearchIntentEntry[] {
    return SEARCH_INTENT_MAP.filter((entry) => entry.clusterId === clusterId && !entry.isPillar);
  }
}
