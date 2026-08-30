/**
 * Verified Author, Reviewer & Fact-Checker Profiles & Secure Social URL Validator
 */

import type { AuthorProfile, AuthorSocialLinks } from './types';

export const VERIFIED_AUTHORS: readonly AuthorProfile[] = [
  {
    slug: 'rajesh-sharma',
    name: 'Rajesh Sharma, FIAI',
    title: 'Lead Actuarial Researcher & Financial Architect',
    role: 'Chief Actuary & Author',
    biography: 'Rajesh has over 16 years of actuarial and insurance mathematical modeling experience in Indian life insurance products, statutory valuation schedules, and surrender value factor matrices.',
    qualifications: [
      'Fellow of Institute of Actuaries of India (FIAI)',
      'M.Sc. Actuarial Science',
      'Certified Financial Risk Manager (FRM)'
    ],
    experienceYears: 16,
    expertiseAreas: [
      'LIC Surrender Factor Valuation',
      'Actuarial Reserve & Bonus Computation',
      'Endowment & Money Back Plans',
      'Policy Loan LTV Models'
    ],
    photoUrl: '/images/authors/rajesh-sharma.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/rajesh-sharma-actuary',
      x: 'https://x.com/rajesh_actuary',
      website: 'https://lic-calculators.com/author/rajesh-sharma'
    },
    isReviewer: true,
    isFactChecker: true,
    updatedAt: '2026-01-15T00:00:00Z'
  },
  {
    slug: 'ananya-deshmukh',
    name: 'Ananya Deshmukh, CFA',
    title: 'Senior Financial Planner & Insurance Reviewer',
    role: 'Senior Financial Planner & Reviewer',
    biography: 'Ananya specializes in retail wealth management, life insurance portfolio optimization, and comparing traditional endowment returns versus term insurance + mutual fund benchmarks.',
    qualifications: [
      'Chartered Financial Analyst (CFA Charterholder)',
      'Certified Financial Planner (CFP)',
      'MBA in Finance'
    ],
    experienceYears: 12,
    expertiseAreas: [
      'Policy Surrender vs. Paid-Up Decision Analysis',
      'Opportunity Cost of Early Surrender',
      'Retirement & Annuity Evaluation (Saral Pension)'
    ],
    photoUrl: '/images/authors/ananya-deshmukh.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/ananya-deshmukh-cfa',
      x: 'https://x.com/ananya_finance'
    },
    isReviewer: true,
    isFactChecker: false,
    updatedAt: '2026-01-18T00:00:00Z'
  },
  {
    slug: 'vikram-sen',
    name: 'Vikram Sen',
    title: 'Insurance Regulatory & Policy Document Specialist',
    role: 'Insurance Claims & Policy Reviewer',
    biography: 'Vikram is an independent insurance researcher who tracks IRDAI regulatory updates, master circulars, and official LIC product brochures to ensure all calculation formulas remain strictly compliant with latest guidelines.',
    qualifications: [
      'Licentiate & Associate of Insurance Institute of India (AIII)',
      'LL.B. (Insurance & Commercial Law)'
    ],
    experienceYears: 14,
    expertiseAreas: [
      'IRDAI Master Circular Compliance',
      'Policy Terms & Condition Vetting',
      'Death Benefit & Paid-Up Provisions'
    ],
    photoUrl: '/images/authors/vikram-sen.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/vikram-sen-insurance',
      website: 'https://lic-calculators.com/author/vikram-sen'
    },
    isReviewer: true,
    isFactChecker: true,
    updatedAt: '2026-01-20T00:00:00Z'
  }
];

export class AuthorManager {
  /**
   * Sanitizes and validates a social URL, rejecting javascript: or non-http protocols.
   */
  public static isValidSocialUrl(url?: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return false;
    if (trimmed.toLowerCase().startsWith('javascript:') || trimmed.toLowerCase().startsWith('data:')) {
      return false;
    }
    return true;
  }

  /**
   * Returns sanitized social links object with only valid http(s) URLs.
   */
  public static sanitizeSocialLinks(links: AuthorSocialLinks): AuthorSocialLinks {
    const sanitized: Record<string, string> = {};
    for (const [key, val] of Object.entries(links)) {
      if (this.isValidSocialUrl(val)) {
        sanitized[key] = val;
      }
    }
    return sanitized as AuthorSocialLinks;
  }

  public static getAuthorBySlug(slug: string): AuthorProfile | undefined {
    return VERIFIED_AUTHORS.find((a) => a.slug === slug);
  }

  public static getDefaultAuthor(): AuthorProfile {
    return VERIFIED_AUTHORS[0]!; // Rajesh Sharma
  }

  public static getDefaultReviewer(): AuthorProfile {
    return VERIFIED_AUTHORS[1]!; // Ananya Deshmukh
  }
}
