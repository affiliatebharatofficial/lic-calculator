/**
 * E-E-A-T, Editorial & Author System Type Definitions
 */

export interface AuthorSocialLinks {
  readonly linkedin?: string;
  readonly x?: string;
  readonly facebook?: string;
  readonly instagram?: string;
  readonly youtube?: string;
  readonly website?: string;
}

export interface AuthorProfile {
  readonly slug: string;
  readonly name: string;
  readonly title: string;
  readonly role: 'Chief Actuary & Author' | 'Senior Financial Planner & Reviewer' | 'Insurance Claims & Policy Reviewer';
  readonly biography: string;
  readonly qualifications: readonly string[];
  readonly experienceYears: number;
  readonly expertiseAreas: readonly string[];
  readonly photoUrl: string;
  readonly socialLinks: AuthorSocialLinks;
  readonly isReviewer: boolean;
  readonly isFactChecker: boolean;
  readonly updatedAt: string;
}

export interface CorrectionReport {
  readonly id: string;
  readonly pageUrl: string;
  readonly issueType: 'calculation_error' | 'outdated_rate' | 'broken_source' | 'translation_typo' | 'other';
  readonly description: string;
  readonly userEmail?: string;
  readonly submittedAt: string;
  readonly status: 'pending' | 'investigating' | 'resolved' | 'rejected';
}
