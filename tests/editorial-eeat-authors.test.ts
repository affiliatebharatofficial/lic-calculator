import { describe, it, expect } from 'vitest';
import { VERIFIED_AUTHORS, AuthorManager } from '@/lib/editorial';

describe('E-E-A-T Editorial Profiles & Reviewer Directory', () => {
  it('contains verified author profiles with required credentials', () => {
    expect(VERIFIED_AUTHORS.length).toBeGreaterThan(0);

    for (const author of VERIFIED_AUTHORS) {
      expect(author.slug).toBeDefined();
      expect(author.name).toBeDefined();
      expect(author.title).toBeDefined();
      expect(author.experienceYears).toBeGreaterThan(5);
      expect(author.qualifications.length).toBeGreaterThan(0);
      expect(author.expertiseAreas.length).toBeGreaterThan(0);
    }
  });

  it('retrieves author by slug and provides default fallback', () => {
    const author = AuthorManager.getAuthorBySlug('naveen-chaudhary');
    expect(author).toBeDefined();
    expect(author?.name).toContain('Naveen Chaudhary');

    const defaultAuthor = AuthorManager.getDefaultAuthor();
    expect(defaultAuthor).toBeDefined();
    expect(defaultAuthor.isReviewer).toBe(true);
  });
});
