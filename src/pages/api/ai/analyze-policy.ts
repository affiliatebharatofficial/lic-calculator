import type { APIRoute } from 'astro';
import { createErrorResponse } from '@/lib/api/response';

export const prerender = false;

export const POST: APIRoute = async () => {
  return createErrorResponse(
    'NOT_IMPLEMENTED',
    'AI Policy/PDF document analysis will be integrated in Phase 2 using secure server-side processing.',
    501
  );
};
