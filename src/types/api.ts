/**
 * Standard API Response Structures for LIC Calculator
 */

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'RULE_NOT_FOUND'
  | 'NOT_IMPLEMENTED'
  | 'INTERNAL_SERVER_ERROR';

export interface ApiFieldError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiErrorPayload {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
  fieldErrors?: ApiFieldError[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    version?: string;
    requestId?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
