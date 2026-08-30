import type {
  ApiErrorCode,
  ApiErrorResponse,
  ApiFieldError,
  ApiSuccessResponse
} from '@/types/api';
import { getSecurityHeaders } from '@/lib/security';

export function createSuccessResponse<T>(data: T, status: number = 200): Response {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  };

  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getSecurityHeaders()
    }
  });
}

export function createErrorResponse(
  code: ApiErrorCode,
  message: string,
  status: number = 400,
  fieldErrors?: ApiFieldError[],
  details?: Record<string, unknown>
): Response {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(fieldErrors && fieldErrors.length > 0 ? { fieldErrors } : {}),
      ...(details ? { details } : {})
    }
  };

  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getSecurityHeaders()
    }
  });
}
