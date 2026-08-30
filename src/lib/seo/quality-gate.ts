/**
 * Automated SEO & Editorial Quality Gate
 * Validates metadata, E-E-A-T credentials, source attachments and orphan status before publishing.
 */

export interface QualityGateInput {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly contentBody?: string;
  readonly authorId?: string;
  readonly reviewerId?: string;
  readonly sourceIds?: readonly string[];
  readonly inboundLinkCount?: number;
  readonly contentType: 'calculator' | 'guide' | 'plan' | 'glossary' | 'author';
}

export interface QualityGateCheckResult {
  readonly passed: boolean;
  readonly scorePercent: number;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly isOrphan: boolean;
}

export class SEOQualityGate {
  public static evaluate(input: QualityGateInput): QualityGateCheckResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Title validation
    if (!input.title || input.title.trim().length === 0) {
      errors.push('Title tag is missing.');
    } else if (input.title.length < 10) {
      errors.push('Title tag is too short (must be >= 10 characters).');
    } else if (input.title.length > 70) {
      warnings.push('Title tag exceeds 70 characters and may be truncated on SERPs.');
    }

    // 2. Meta description validation
    if (!input.description || input.description.trim().length === 0) {
      errors.push('Meta description is missing.');
    } else if (input.description.length < 40) {
      errors.push('Meta description is too short (must be >= 40 characters).');
    } else if (input.description.length > 170) {
      warnings.push('Meta description exceeds 170 characters.');
    }

    // 3. Canonical validation
    if (!input.canonicalUrl || !/^https?:\/\//i.test(input.canonicalUrl)) {
      errors.push('A valid absolute canonical URL is required.');
    }

    // 4. E-E-A-T: Author & Reviewer requirements
    if (input.contentType === 'guide' || input.contentType === 'calculator') {
      if (!input.authorId) {
        errors.push('An assigned author profile is required for financial tools/guides.');
      }
      if (!input.reviewerId) {
        warnings.push('No actuarial reviewer assigned. Independent verification is recommended.');
      }
      if (!input.sourceIds || input.sourceIds.length === 0) {
        errors.push('At least one verified actuarial source reference must be attached.');
      }
    }

    // 5. Thin Content Protection
    if (input.contentType === 'guide' && input.contentBody) {
      const words = input.contentBody.trim().split(/\s+/).length;
      if (words < 250) {
        errors.push(`Thin content detected: Guide has only ${words} words (minimum 250 required).`);
      }
    }

    // 6. Orphan Detection
    const inbound = input.inboundLinkCount !== undefined ? input.inboundLinkCount : 1;
    const isOrphan = inbound === 0 && input.contentType !== 'author';
    if (isOrphan) {
      warnings.push('Potential orphan page: Page has 0 inbound internal links.');
    }

    const passed = errors.length === 0;
    const deductions = errors.length * 20 + warnings.length * 5;
    const scorePercent = Math.max(0, 100 - deductions);

    return {
      passed,
      scorePercent,
      errors,
      warnings,
      isOrphan
    };
  }
}
