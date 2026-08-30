/**
 * Calculation Warning Collector Engine
 */

import type { CalculationWarning } from '../types/calculator';

export class WarningCollector {
  private readonly warnings: CalculationWarning[] = [];

  public add(
    code: string,
    message: string,
    field?: string,
    severity: 'info' | 'warning' = 'warning'
  ): void {
    this.warnings.push({
      code,
      message,
      field,
      severity
    });
  }

  public addWarning(warning: CalculationWarning): void {
    this.warnings.push(warning);
  }

  public getWarnings(): readonly CalculationWarning[] {
    return Object.freeze([...this.warnings]);
  }

  public hasWarnings(): boolean {
    return this.warnings.length > 0;
  }
}
