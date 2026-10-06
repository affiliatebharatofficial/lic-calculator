import type { APIRoute } from 'astro';
import { MetricsRegistry } from '@/lib/observability';
import { CacheControlManager, getSecurityHeaders } from '@/lib/security';

// Dynamic health check — must never be prerendered, otherwise it serves a
// frozen build-time snapshot instead of the live runtime state.
export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const snapshot = MetricsRegistry.getSnapshot();
  const env = ((locals as any)?.runtime?.env ?? {}) as Record<string, unknown>;

  // Real D1 reachability check (cheap no-op query).
  let database: 'connected' | 'unavailable' | 'not_configured' = 'not_configured';
  const db = env.DB as { prepare?: (sql: string) => any } | undefined;
  if (db && typeof db.prepare === 'function') {
    try {
      await db.prepare('SELECT 1').first();
      database = 'connected';
    } catch {
      database = 'unavailable';
    }
  }

  const aiConfigured = Boolean(env.DEEPSEEK_API_KEY || env.OPENAI_API_KEY || env.GEMINI_API_KEY || env.AI_API_KEY);

  const healthData = {
    status: database === 'unavailable' ? 'degraded' : 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: snapshot.uptimeSeconds,
    services: {
      database,
      calculators: 'deterministic_ready',
      ai_assistant: aiConfigured ? 'ready' : 'mock'
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
    status: healthData.status === 'healthy' ? 200 : 503,
    headers
  });
};
