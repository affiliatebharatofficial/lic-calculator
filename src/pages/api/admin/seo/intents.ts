import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { SEARCH_INTENT_MAP, type SearchIntentEntry } from '@/lib/seo/intent-map';
import { VERIFIED_AUTHORS } from '@/lib/editorial';

export const prerender = false;

// In-memory runtime cache that persists during worker lifetime
let mutableIntentMap: SearchIntentEntry[] = [...SEARCH_INTENT_MAP];

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    intents: mutableIntentMap,
    totalClusters: new Set(mutableIntentMap.map(i => i.clusterId)).size,
    totalIntents: mutableIntentMap.length,
    authors: VERIFIED_AUTHORS
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
    }

    if (!body?.primaryKeyword || !body?.canonicalPath || !body?.clusterId) {
      return createErrorResponse('VALIDATION_ERROR', 'clusterId, primaryKeyword, and canonicalPath are required.', 422);
    }

    const newEntry: SearchIntentEntry = {
      clusterId: String(body.clusterId).trim(),
      clusterName: String(body.clusterName || body.clusterId).trim(),
      primaryIntent: String(body.primaryIntent || `Target search intent for ${body.primaryKeyword}`).trim(),
      primaryKeyword: String(body.primaryKeyword).trim(),
      secondaryKeywords: Array.isArray(body.secondaryKeywords) ? body.secondaryKeywords : [],
      canonicalPath: String(body.canonicalPath).trim(),
      isPillar: Boolean(body.isPillar),
      supportingPaths: Array.isArray(body.supportingPaths) ? body.supportingPaths : []
    };

    // Check if updating existing or adding new
    const existingIndex = mutableIntentMap.findIndex(i => i.primaryKeyword.toLowerCase() === newEntry.primaryKeyword.toLowerCase());
    if (existingIndex >= 0) {
      mutableIntentMap[existingIndex] = newEntry;
    } else {
      mutableIntentMap.unshift(newEntry);
    }

    return createSuccessResponse({
      message: 'Search intent successfully saved.',
      entry: newEntry,
      totalIntents: mutableIntentMap.length
    });
  } catch (err: any) {
    return createErrorResponse('INTERNAL_SERVER_ERROR', `Failed to save search intent: ${err?.message || err}`, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');

    if (!keyword) {
      return createErrorResponse('VALIDATION_ERROR', 'Keyword parameter is required.', 422);
    }

    const initialLength = mutableIntentMap.length;
    mutableIntentMap = mutableIntentMap.filter(i => i.primaryKeyword.toLowerCase() !== keyword.toLowerCase());

    if (mutableIntentMap.length === initialLength) {
      return createErrorResponse('NOT_FOUND', `Search intent with keyword "${keyword}" not found.`, 404);
    }

    return createSuccessResponse({
      message: `Search intent "${keyword}" removed successfully.`,
      totalIntents: mutableIntentMap.length
    });
  } catch (err: any) {
    return createErrorResponse('INTERNAL_SERVER_ERROR', `Failed to delete search intent: ${err?.message || err}`, 500);
  }
};
