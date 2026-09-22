import { describe, it, expect } from 'vitest';
import { VERIFIED_AUTHORS, AuthorManager } from '@/lib/editorial';

describe('E-E-A-T Editorial Profiles & Author Directory', () => {
  it('contains genuine verified author profile for Firoz Khan', () => {
    expect(VERIFIED_AUTHORS.length).toBe(1);

    const author = VERIFIED_AUTHORS[0]!;
    expect(author.slug).toBe('firoz-khan');
    expect(author.name).toBe('Firoz Khan');
    expect(author.title).toBe('Founder & Publisher');
    expect(author.role).toBe('Founder & Publisher');
    expect(author.biography).toContain('Firoz Khan is the founder and publisher');
    expect(author.socialLinks.linkedin).toBe('https://www.linkedin.com/in/firoz-khan-1153358a/');
    expect(author.socialLinks.instagram).toBe('https://www.instagram.com/rtibyfiroz/');
  });

  it('retrieves author by slug and provides default fallback', () => {
    const author = AuthorManager.getAuthorBySlug('firoz-khan');
    expect(author).toBeDefined();
    expect(author?.name).toBe('Firoz Khan');

    const defaultAuthor = AuthorManager.getDefaultAuthor();
    expect(defaultAuthor).toBeDefined();
    expect(defaultAuthor.name).toBe('Firoz Khan');

    const defaultReviewer = AuthorManager.getDefaultReviewer();
    expect(defaultReviewer).toBeUndefined();
  });
});
