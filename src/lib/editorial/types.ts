/**
 * E-E-A-T, Editorial & Author System Type Definitions
 */

export interface AuthorSocialLinks {
  readonly linkedin?: string;
  readonly instagram?: string;
  readonly website?: string;
  readonly x?: string;
  readonly facebook?: string;
  readonly youtube?: string;
}

export interface AuthorProfile {
  readonly slug: string;
  readonly name: string;
  readonly title: string;
  readonly role: string;
  readonly biography: string;
  readonly photoUrl?: string;
  readonly socialLinks: AuthorSocialLinks;
  readonly isReviewer?: boolean;
  readonly isFactChecker?: boolean;
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
