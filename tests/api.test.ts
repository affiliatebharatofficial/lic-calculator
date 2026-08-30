import { describe, it, expect } from 'vitest';
import { createSuccessResponse, createErrorResponse } from '../src/lib/api/response';

describe('API Standard Response Helpers', () => {
  it('creates standardized success response', async () => {
    const res = createSuccessResponse({ result: 12345 });
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/json');
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.result).toBe(12345);
    expect(body.meta.version).toBe('1.0.0');
  });

  it('creates standardized error response with field errors', async () => {
    const res = createErrorResponse(
      'VALIDATION_ERROR',
      'Input validation failed',
      422,
      [{ field: 'age', message: 'Age is required' }]
    );
    expect(res.status).toBe(422);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.fieldErrors).toHaveLength(1);
    expect(body.error.fieldErrors[0].field).toBe('age');
  });
});
