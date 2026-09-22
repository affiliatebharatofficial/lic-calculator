/**
 * Verified Author, Reviewer & Fact-Checker Profiles & Secure Social URL Validator
 */

import type { AuthorProfile, AuthorSocialLinks } from './types';

export const VERIFIED_AUTHORS: readonly AuthorProfile[] = [
  {
    slug: 'firoz-khan',
    name: 'Firoz Khan',
    title: 'Founder & Publisher',
    role: 'Founder & Publisher',
    biography: 'Firoz Khan is the founder and publisher of LIC Calculators, an independent platform that develops online financial and policy-related calculator tools designed to help users understand calculations more easily.',
    photoUrl: '/images/authors/firoz-khan.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/firoz-khan-1153358a/',
      instagram: 'https://www.instagram.com/rtibyfiroz/'
    },
    isReviewer: false,
    isFactChecker: false,
    updatedAt: '2026-02-01T00:00:00Z'
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
      if (val && this.isValidSocialUrl(val)) {
        sanitized[key] = val;
      }
    }
    return sanitized as AuthorSocialLinks;
  }

  public static getAuthorBySlug(slug: string): AuthorProfile | undefined {
    return VERIFIED_AUTHORS.find((a) => a.slug === slug);
  }

  public static getDefaultAuthor(): AuthorProfile {
    return VERIFIED_AUTHORS[0]!; // Firoz Khan
  }

  public static getDefaultReviewer(): AuthorProfile | undefined {
    return undefined; // No fictional reviewer
  }
}
