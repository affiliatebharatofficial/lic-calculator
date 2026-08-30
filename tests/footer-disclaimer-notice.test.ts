import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Footer Independent Platform Notice Verification', () => {
  const rootDir = process.cwd();

  it('verifies that the top header disclaimer banner is removed from BaseLayout.astro', () => {
    const baseLayoutPath = resolve(rootDir, 'src/layouts/BaseLayout.astro');
    const baseLayoutContent = readFileSync(baseLayoutPath, 'utf-8');

    expect(baseLayoutContent).not.toContain('<DisclaimerBanner');
  });

  it('verifies that Footer.astro includes the exact required notice and copy', () => {
    const footerPath = resolve(rootDir, 'src/components/layout/Footer.astro');
    const footerContent = readFileSync(footerPath, 'utf-8');

    // Title
    expect(footerContent).toContain('Independent Platform Notice');

    // Body wording
    expect(footerContent).toContain(
      'LIC Calculators is an independent informational and financial calculation platform. It is not affiliated with, authorized by, or endorsed by Life Insurance Corporation of India (LIC).'
    );

    // Call to action link
    expect(footerContent).toContain('Read Full Disclaimer');
    expect(footerContent).toContain("getLocalizedPath('/disclaimer', locale)");
  });

  it('verifies that there are no localhost URLs in the layout or footer components', () => {
    const footerPath = resolve(rootDir, 'src/components/layout/Footer.astro');
    const baseLayoutPath = resolve(rootDir, 'src/layouts/BaseLayout.astro');

    const footerContent = readFileSync(footerPath, 'utf-8');
    const baseLayoutContent = readFileSync(baseLayoutPath, 'utf-8');

    expect(footerContent).not.toContain('localhost');
    expect(baseLayoutContent).not.toContain('localhost');
  });

  it('verifies that the full legal disclosure on the /disclaimer page remains intact', () => {
    const disclaimerPagePath = resolve(rootDir, 'src/pages/disclaimer.astro');
    expect(existsSync(disclaimerPagePath)).toBe(true);

    const disclaimerContent = readFileSync(disclaimerPagePath, 'utf-8');
    expect(disclaimerContent).toContain('Legal Disclaimer & Independence Notice');
    expect(disclaimerContent).toContain('Nature of the Service');
    expect(disclaimerContent).toContain('No Official Representations');
    expect(disclaimerContent).toContain('Verification of Exact Values');
    expect(disclaimerContent).toContain('Trademarks and Intellectual Property');
  });

  it('verifies that subtle, non-alarming styling is applied in the footer', () => {
    const footerPath = resolve(rootDir, 'src/components/layout/Footer.astro');
    const footerContent = readFileSync(footerPath, 'utf-8');

    // Should use subtle slate colors, not alarming warning colors
    expect(footerContent).toContain('bg-slate-900');
    expect(footerContent).toContain('text-slate-400');
    expect(footerContent).not.toContain('bg-red-');
    expect(footerContent).not.toContain('border-red-');
  });
});
