import { describe, it, expect } from 'vitest';
import { AuthorManager } from '@/lib/editorial';

describe('Editorial Security: Social URL Validation & Sanitization', () => {
  it('accepts valid https and http URLs', () => {
    expect(AuthorManager.isValidSocialUrl('https://linkedin.com/in/actuary')).toBe(true);
    expect(AuthorManager.isValidSocialUrl('http://x.com/actuary')).toBe(true);
  });

  it('strictly rejects dangerous schemes (javascript:, data:, vbscript:)', () => {
    expect(AuthorManager.isValidSocialUrl('javascript:alert("hacked")')).toBe(false);
    expect(AuthorManager.isValidSocialUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(AuthorManager.isValidSocialUrl('vbscript:msgbox("hello")')).toBe(false);
    expect(AuthorManager.isValidSocialUrl('relative/path/link')).toBe(false);
    expect(AuthorManager.isValidSocialUrl('')).toBe(false);
  });

  it('sanitizes author social links map stripping unsafe keys', () => {
    const maliciousLinks = {
      linkedin: 'https://linkedin.com/in/legit',
      x: 'javascript:alert(1)',
      website: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='
    };

    const sanitized = AuthorManager.sanitizeSocialLinks(maliciousLinks);
    expect(sanitized.linkedin).toBe('https://linkedin.com/in/legit');
    expect(sanitized.x).toBeUndefined();
    expect(sanitized.website).toBeUndefined();
  });
});
