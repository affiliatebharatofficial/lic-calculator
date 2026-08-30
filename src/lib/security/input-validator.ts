/**
 * Strict API Request Input & Protocol Validator
 */

export interface ValidationCheckResult {
  valid: boolean;
  error?: string;
  statusCode?: number;
}

export class RequestInputValidator {
  /**
   * Validates that the request method matches the expected HTTP method.
   */
  public static validateMethod(request: Request, expectedMethod: string = 'POST'): ValidationCheckResult {
    if (request.method.toUpperCase() !== expectedMethod.toUpperCase()) {
      return {
        valid: false,
        error: `Method ${request.method} not allowed. Expected ${expectedMethod}.`,
        statusCode: 405
      };
    }
    return { valid: true };
  }

  /**
   * Validates that Content-Type is application/json for payload requests.
   */
  public static validateJsonContentType(request: Request): ValidationCheckResult {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return {
        valid: false,
        error: 'Invalid Content-Type header. Expected application/json.',
        statusCode: 415
      };
    }
    return { valid: true };
  }

  /**
   * Safely parses JSON body with size ceiling to prevent payload DOS attacks.
   */
  public static async parseJsonBody<T>(request: Request, maxBytes: number = 65536): Promise<{ data?: T; error?: string }> {
    try {
      const text = await request.text();
      if (text.length > maxBytes) {
        return { error: `Payload too large. Exceeds limit of ${maxBytes} bytes.` };
      }
      const data = JSON.parse(text) as T;
      return { data };
    } catch {
      return { error: 'Malformed JSON payload in request body.' };
    }
  }
}
