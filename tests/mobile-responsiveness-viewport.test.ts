import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Mobile-First Responsive Optimization Audit', () => {
  const rootDir = process.cwd();

  // --- 1. Global CSS & Viewport Invariants ---
  describe('1. Global CSS & Viewport Safeguards', () => {
    const globalCssPath = resolve(rootDir, 'src/styles/global.css');
    const globalCss = readFileSync(globalCssPath, 'utf-8');

    it('enforces overflow-x prevention and viewport width bounds', () => {
      expect(globalCss).toContain('overflow-x: hidden');
      expect(globalCss).toContain('max-width: 100vw');
    });

    it('defines fluid clamp() typography for financial outputs to prevent overflow', () => {
      expect(globalCss).toContain('clamp(');
      expect(globalCss).toContain('.financial-hero');
      expect(globalCss).toContain('.financial-result-xl');
      expect(globalCss).toContain('overflow-wrap: anywhere');
    });

    it('configures responsive table container utility with touch scrolling', () => {
      expect(globalCss).toContain('.table-responsive-container');
      expect(globalCss).toContain('-webkit-overflow-scrolling: touch');
    });

    it('honors prefers-reduced-motion for animations and scroll behavior', () => {
      expect(globalCss).toContain('prefers-reduced-motion: reduce');
      expect(globalCss).toContain('animation-duration: 0.01ms !important');
    });
  });

  // --- 2. Mobile Header & Navigation Drawer ---
  describe('2. Mobile Header & Navigation Drawer', () => {
    const headerPath = resolve(rootDir, 'src/components/layout/Header.astro');
    const mobileNavPath = resolve(rootDir, 'src/components/layout/MobileNavigation.astro');

    const header = readFileSync(headerPath, 'utf-8');
    const mobileNav = readFileSync(mobileNavPath, 'utf-8');

    it('aligns breakpoint between hamburger button and drawer (lg:hidden)', () => {
      expect(header).toContain('lg:hidden');
      expect(mobileNav).toContain('lg:hidden');
    });

    it('provides minimum 44px touch targets on mobile menu toggle and close button', () => {
      expect(header).toContain('min-w-[44px]');
      expect(header).toContain('min-h-[44px]');
      expect(mobileNav).toContain('min-w-[44px]');
      expect(mobileNav).toContain('min-h-[44px]');
    });

    it('contains accessibility attributes (aria-expanded, aria-modal, role="dialog")', () => {
      expect(header).toContain('aria-expanded');
      expect(header).toContain('aria-controls="mobile-menu-drawer"');
      expect(mobileNav).toContain('role="dialog"');
      expect(mobileNav).toContain('aria-modal="true"');
    });

    it('implements ESC key listener and body scroll locking in mobile drawer', () => {
      expect(mobileNav).toContain("e.key === 'Escape'");
      expect(mobileNav).toContain("document.body.style.overflow = 'hidden'");
    });
  });

  // --- 3. Form Inputs & Touch Targets ---
  describe('3. Form Inputs, Buttons & Touch Targets', () => {
    const buttonPath = resolve(rootDir, 'src/components/ui/Button.astro');
    const numberInputPath = resolve(rootDir, 'src/components/calculator/NumberInput.astro');
    const currencyInputPath = resolve(rootDir, 'src/components/calculator/CurrencyInput.astro');

    const button = readFileSync(buttonPath, 'utf-8');
    const numberInput = readFileSync(numberInputPath, 'utf-8');
    const currencyInput = readFileSync(currencyInputPath, 'utf-8');

    it('provides compliant minimum heights on Button component', () => {
      expect(button).toContain('min-h-[44px]');
    });

    it('configures inputmode="numeric" on financial and numeric fields for mobile keyboards', () => {
      expect(numberInput).toContain('inputmode="numeric"');
      expect(currencyInput).toContain('inputmode="numeric"');
    });

    it('uses 16px font on mobile inputs (text-base sm:text-sm) to prevent iOS auto-zoom', () => {
      expect(numberInput).toContain('text-base');
      expect(currencyInput).toContain('text-base');
    });
  });

  // --- 4. Result Cards & Financial Data Word Wrap ---
  describe('4. Result Cards & Number Wrapping', () => {
    const resultCardPath = resolve(rootDir, 'src/components/ui/ResultCard.astro');
    const surrenderAnalysisCardPath = resolve(rootDir, 'src/components/calculator/SurrenderAnalysisCard.astro');
    const resultBreakdownPath = resolve(rootDir, 'src/components/calculator/ResultBreakdown.astro');

    const resultCard = readFileSync(resultCardPath, 'utf-8');
    const surrenderAnalysisCard = readFileSync(surrenderAnalysisCardPath, 'utf-8');
    const resultBreakdown = readFileSync(resultBreakdownPath, 'utf-8');

    it('enforces word-break and overflow-wrap on large financial amounts', () => {
      expect(resultCard).toContain('overflow-wrap: anywhere');
      expect(surrenderAnalysisCard).toContain('overflow-wrap: anywhere');
      expect(resultBreakdown).toContain('overflow-wrap: anywhere');
    });

    it('stacks metrics grid in single column on narrow mobile screens (320px)', () => {
      expect(resultCard).toContain('grid-cols-1 sm:grid-cols-2');
      expect(surrenderAnalysisCard).toContain('grid-cols-1 sm:grid-cols-3');
    });
  });

  // --- 5. Breadcrumbs Wrapping ---
  describe('5. Breadcrumbs Layout', () => {
    const breadcrumbsPath = resolve(rootDir, 'src/components/layout/Breadcrumbs.astro');
    const breadcrumbs = readFileSync(breadcrumbsPath, 'utf-8');

    it('allows breadcrumbs to wrap naturally on small screens without horizontal scroll', () => {
      expect(breadcrumbs).toContain('flex-wrap');
    });
  });

  // --- 6. AI Assistant Drawer Mobile Bottom-Sheet ---
  describe('6. AI Assistant Drawer Mobile Behavior', () => {
    const aiDrawerPath = resolve(rootDir, 'src/components/ai/AIChatDrawer.astro');
    const aiDrawer = readFileSync(aiDrawerPath, 'utf-8');

    it('adapts as a bottom sheet on mobile (rounded-t-3xl max-h-[85vh]) and slideover on desktop', () => {
      expect(aiDrawer).toContain('max-h-[85vh]');
      expect(aiDrawer).toContain('rounded-t-3xl');
      expect(aiDrawer).toContain('sm:rounded-none');
    });
  });
});
