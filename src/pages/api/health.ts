import type { APIRoute } from 'astro';
import { MetricsRegistry } from '@/lib/observability';
import { CacheControlManager, getSecurityHeaders } from '@/lib/security';

export const GET: APIRoute = async () => {
  const snapshot = MetricsRegistry.getSnapshot();

  const healthData = {
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: snapshot.uptimeSeconds,
    services: {
      database: 'connected',
      calculators: 'deterministic_ready',
      ai_assistant: 'ready'
    },
    metrics: {
      totalRequests: snapshot.totalRequests,
      averageLatencyMs: snapshot.averageLatencyMs
    }
  };

  const headers = {
    'content-type': 'application/json; charset=utf-8',
    ...CacheControlManager.getPrivateNoCacheHeaders(),
    ...getSecurityHeaders()
  };

  return new Response(JSON.stringify(healthData, null, 2), {
    status: 200,
    headers
  });
};
