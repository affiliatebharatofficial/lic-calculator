/**
 * Server Observability Metrics Registry
 */

export interface SystemHealthSnapshot {
  readonly uptimeSeconds: number;
  readonly totalRequests: number;
  readonly successCount: number;
  readonly errorCount: number;
  readonly calculatorInvocations: number;
  readonly aiInvocations: number;
  readonly averageLatencyMs: number;
}

export class MetricsRegistry {
  private static startTime: number = Date.now();
  private static totalRequests: number = 0;
  private static successCount: number = 0;
  private static errorCount: number = 0;
  private static calculatorInvocations: number = 0;
  private static aiInvocations: number = 0;
  private static totalLatencyMs: number = 0;

  public static recordRequest(durationMs: number, statusCode: number, isCalculator: boolean = false, isAI: boolean = false): void {
    this.totalRequests++;
    this.totalLatencyMs += durationMs;

    if (statusCode >= 200 && statusCode < 400) {
      this.successCount++;
    } else {
      this.errorCount++;
    }

    if (isCalculator) {
      this.calculatorInvocations++;
    }
    if (isAI) {
      this.aiInvocations++;
    }
  }

  public static getSnapshot(): SystemHealthSnapshot {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const averageLatencyMs = this.totalRequests > 0 ? Math.round(this.totalLatencyMs / this.totalRequests) : 0;

    return {
      uptimeSeconds,
      totalRequests: this.totalRequests,
      successCount: this.successCount,
      errorCount: this.errorCount,
      calculatorInvocations: this.calculatorInvocations,
      aiInvocations: this.aiInvocations,
      averageLatencyMs
    };
  }

  public static reset(): void {
    this.startTime = Date.now();
    this.totalRequests = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.calculatorInvocations = 0;
    this.aiInvocations = 0;
    this.totalLatencyMs = 0;
  }
}
