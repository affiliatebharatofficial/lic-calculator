import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { AuthorManager } from '../src/lib/editorial';

describe('Author / Reviewer E-E-A-T Calculator Visibility Audit', () => {
  const rootDir = process.cwd();

  const publicCalculatorFiles = [
    'src/pages/lic-surrender-value-calculator.astro',
    'src/pages/lic-surrender-analysis.astro',
    'src/pages/lic-surrender-loss-calculator.astro',
    'src/pages/lic-premium-calculator.astro',
    'src/pages/lic-maturity-calculator.astro',
    'src/pages/lic-bonus-calculator.astro',
    'src/pages/lic-loan-calculator.astro',
    'src/pages/lic-pension-calculator.astro',
    'src/pages/lic-term-insurance-calculator.astro',
    // Localized routes
    'src/pages/[lang]/lic-surrender-value-calculator.astro',
    'src/pages/[lang]/lic-surrender-analysis.astro',
    'src/pages/[lang]/lic-surrender-loss-calculator.astro',
    'src/pages/[lang]/lic-premium-calculator.astro',
    'src/pages/[lang]/lic-maturity-calculator.astro',
    'src/pages/[lang]/lic-bonus-calculator.astro',
    'src/pages/[lang]/lic-loan-calculator.astro'
  ];

  // 1. CalculatorShell Architecture
  describe('1. Shared CalculatorShell E-E-A-T Architecture', () => {
    const shellPath = resolve(rootDir, 'src/components/calculator/CalculatorShell.astro');
    const shellContent = readFileSync(shellPath, 'utf-8');

    it('imports and renders AuthorReviewerCard inside CalculatorShell', () => {
      expect(shellContent).toContain('AuthorReviewerCard');
      expect(shellContent).toContain('AuthorManager');
      expect(shellContent).toContain('<AuthorReviewerCard');
    });

    it('provides defaults for author, reviewer, lastReviewedDate, and sources', () => {
      expect(shellContent).toContain('AuthorManager.getDefaultAuthor()');
      expect(shellContent).toContain('AuthorManager.getDefaultReviewer()');
      expect(shellContent).toContain('effectiveLastReviewed');
    });

    it('exposes slot for author customization while guaranteeing default visibility', () => {
      expect(shellContent).toContain('<slot name="author">');
      expect(shellContent).toContain('showAuthorCard');
    });
  });

  // 2. AuthorReviewerCard Implementation
  describe('2. AuthorReviewerCard Component Integrity', () => {
    const cardPath = resolve(rootDir, 'src/components/editorial/AuthorReviewerCard.astro');
    const cardContent = readFileSync(cardPath, 'utf-8');

    it('renders Editorial Transparency header with Verified Publisher badge', () => {
      expect(cardContent).toContain('Editorial Transparency & Author');
      expect(cardContent).toContain('Verified Publisher');
      expect(cardContent).toContain('Last reviewed:');
    });

    it('supports author avatar/photo and initial fallback with meaningful alt text', () => {
      expect(cardContent).toContain('alt={`Photo of ${author.name}`}');
      expect(cardContent).toContain('loading="lazy"');
    });

    it('links author name to author profile page', () => {
      expect(cardContent).toContain('author.slug');
    });

    it('renders verified sources and regulatory reference items', () => {
      expect(cardContent).toContain('Primary Sources & Regulatory References');
      expect(cardContent).toContain('src.reference');
    });

    it('renders correction report link and editorial policy route', () => {
      expect(cardContent).toContain('/contact/correction');
      expect(cardContent).toContain('/editorial-policy');
    });
  });

  // 3. Public Calculator Files Verification
  describe('3. Calculator-by-Calculator Audit', () => {
    publicCalculatorFiles.forEach((fileRelPath) => {
      const fullPath = resolve(rootDir, fileRelPath);

      it(`verifies ${fileRelPath} uses CalculatorShell ensuring author visibility`, () => {
        expect(existsSync(fullPath)).toBe(true);
        const content = readFileSync(fullPath, 'utf-8');
        expect(content).toContain('CalculatorShell');
      });
    });
  });

  // 4. Author and Reviewer Data Integrity
  describe('4. Author and Reviewer Data & Social Validation', () => {
    it('has configured default author (Firoz Khan) with genuine role', () => {
      const defaultAuthor = AuthorManager.getDefaultAuthor();
      expect(defaultAuthor.name).toBe('Firoz Khan');
      expect(defaultAuthor.role).toBe('Founder & Publisher');
      expect(defaultAuthor.socialLinks.linkedin).toBe('https://www.linkedin.com/in/firoz-khan-1153358a/');
      expect(defaultAuthor.socialLinks.instagram).toBe('https://www.instagram.com/rtibyfiroz/');
    });

    it('has default reviewer as undefined to prevent fabricated claims', () => {
      const defaultReviewer = AuthorManager.getDefaultReviewer();
      expect(defaultReviewer).toBeUndefined();
    });

    it('sanitizes social links to reject non-http or javascript protocols', () => {
      const sanitized = AuthorManager.sanitizeSocialLinks({
        linkedin: 'https://linkedin.com/in/test',
        x: 'javascript:alert(1)',
        website: 'http://example.com'
      });

      expect(sanitized.linkedin).toBe('https://linkedin.com/in/test');
      expect(sanitized.x).toBeUndefined();
      expect(sanitized.website).toBe('http://example.com');
    });
  });
});
