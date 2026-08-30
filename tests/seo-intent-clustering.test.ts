import { describe, it, expect } from 'vitest';
import { SEARCH_INTENT_MAP, SearchIntentManager } from '@/lib/seo';

describe('SEO Search Intent Mapping & Cannibalization Protection', () => {
  it('contains verified intent entries with canonical paths', () => {
    expect(SEARCH_INTENT_MAP.length).toBeGreaterThan(0);

    for (const entry of SEARCH_INTENT_MAP) {
      expect(entry.clusterId).toBeDefined();
      expect(entry.primaryKeyword).toBeDefined();
      expect(entry.canonicalPath.startsWith('/')).toBe(true);
    }
  });

  it('guarantees only one pillar per search cluster (anti-cannibalization)', () => {
    const clusterMap = new Map<string, number>();

    for (const entry of SEARCH_INTENT_MAP) {
      if (entry.isPillar) {
        const count = clusterMap.get(entry.clusterId) || 0;
        clusterMap.set(entry.clusterId, count + 1);
      }
    }

    for (const [clusterId, pillarCount] of clusterMap.entries()) {
      expect(pillarCount, `Cluster ${clusterId} must have exactly 1 pillar`).toBe(1);
    }
  });

  it('finds intent by canonical path and cluster', () => {
    const surrenderIntent = SearchIntentManager.findByPath('/lic-surrender-value-calculator');
    expect(surrenderIntent).toBeDefined();
    expect(surrenderIntent?.clusterId).toBe('cluster_surrender');
    expect(surrenderIntent?.isPillar).toBe(true);

    const pillar = SearchIntentManager.getClusterPillar('cluster_surrender');
    expect(pillar?.canonicalPath).toBe('/lic-surrender-value-calculator');

    const supporting = SearchIntentManager.getClusterSupporting('cluster_surrender');
    expect(supporting.length).toBeGreaterThan(0);
  });
});
