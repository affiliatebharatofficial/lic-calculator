/**
 * User Correction Reporting Repository
 */

import type { CorrectionReport } from './types';

export class CorrectionRepository {
  private static reports: CorrectionReport[] = [];

  public static submitReport(params: {
    pageUrl: string;
    issueType: CorrectionReport['issueType'];
    description: string;
    userEmail?: string;
  }): CorrectionReport {
    const report: CorrectionReport = {
      id: 'cor_' + crypto.randomUUID(),
      pageUrl: params.pageUrl,
      issueType: params.issueType,
      description: params.description,
      userEmail: params.userEmail,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    this.reports.unshift(report);
    return report;
  }

  public static listReports(): CorrectionReport[] {
    return [...this.reports];
  }
}
