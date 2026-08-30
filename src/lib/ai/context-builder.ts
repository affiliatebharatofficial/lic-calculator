/**
 * AI Context Builder & Sensitive Data Sanitizer
 */

import type { ExplanationRequest, ChatRequest } from './types';

// Regex patterns for sensitive data
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+91[\-\s]?)?[6789]\d{9}/g;
const AADHAAR_REGEX = /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g;
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
const POLICY_NUM_REGEX = /\b\d{9}\b/g; // 9-digit LIC policy number
const HTML_TAG_REGEX = /<[^>]*>/g;

// Dangerous prompt injection substrings
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
  /you\s+are\s+now\s+(an?\s+)?unrestricted/gi,
  /override\s+(all\s+)?calculations?/gi,
  /disregard\s+(the\s+)?system\s+prompt/gi,
  /change\s+the\s+(surrender|maturity|premium)\s+value\s+to/gi,
  /act\s+as\s+a\s+financial\s+advisor\s+and\s+tell\s+me\s+to/gi
];

export class AIContextBuilder {
  /**
   * Sanitizes arbitrary text by stripping PII, neutralizing prompt injection attempts,
   * and stripping raw HTML/script tags.
   */
  public static sanitizeText(text: string, maxLength: number = 2000): string {
    if (!text || typeof text !== 'string') return '';

    let cleaned = text.trim();

    // Strip HTML tags & scripts
    cleaned = cleaned.replace(HTML_TAG_REGEX, '');

    // Mask PII
    cleaned = cleaned.replace(EMAIL_REGEX, '[EMAIL_REDACTED]');
    cleaned = cleaned.replace(PHONE_REGEX, '[PHONE_REDACTED]');
    cleaned = cleaned.replace(AADHAAR_REGEX, '[GOVT_ID_REDACTED]');
    cleaned = cleaned.replace(PAN_REGEX, '[PAN_REDACTED]');
    cleaned = cleaned.replace(POLICY_NUM_REGEX, '[POLICY_NUM_REDACTED]');

    // Neutralize prompt injection attempts
    for (const pattern of INJECTION_PATTERNS) {
      cleaned = cleaned.replace(pattern, '[INJECTION_FILTERED]');
    }

    // Clamp length
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength) + '... [TRUNCATED]';
    }

    return cleaned;
  }

  /**
   * Formats structured calculator explanation request into a grounded prompt context.
   */
  public static buildExplanationContext(req: ExplanationRequest): string {
    const lines: string[] = [];

    lines.push(`CALCULATOR: ${req.calculatorId}`);
    if (req.planName) lines.push(`PLAN NAME: ${this.sanitizeText(req.planName, 100)}`);
    if (req.planCode) lines.push(`PLAN CODE: ${this.sanitizeText(req.planCode, 20)}`);
    lines.push(`PRIMARY CALCULATED AMOUNT: ${req.primaryResult}`);

    if (req.breakdownItems && req.breakdownItems.length > 0) {
      lines.push('\nITEMIZED BREAKDOWN:');
      for (const item of req.breakdownItems) {
        lines.push(`- ${item.label}: ${item.amount}${item.notes ? ` (${item.notes})` : ''}`);
      }
    }

    if (req.assumptions && req.assumptions.length > 0) {
      lines.push('\nAPPLICABLE ASSUMPTIONS:');
      for (const a of req.assumptions) {
        lines.push(`- ${this.sanitizeText(a, 300)}`);
      }
    }

    if (req.warnings && req.warnings.length > 0) {
      lines.push('\nENGINE WARNINGS:');
      for (const w of req.warnings) {
        lines.push(`- ${this.sanitizeText(w, 300)}`);
      }
    }

    if (req.ruleVersion) lines.push(`\nRULE VERSION APPLIED: ${req.ruleVersion}`);
    if (req.sourceReference) lines.push(`SOURCE REFERENCE: ${req.sourceReference}`);

    if (req.userQuestion) {
      lines.push(`\nUSER QUESTION: ${this.sanitizeText(req.userQuestion, 500)}`);
    }

    return lines.join('\n');
  }

  /**
   * Builds sanitized conversation context for chat inquiries.
   */
  public static buildChatContext(req: ChatRequest): string {
    const parts: string[] = [];

    if (req.currentCalculatorId) {
      parts.push(`Current Context: Calculator '${req.currentCalculatorId}'`);
    }
    if (req.currentPlanCode) {
      parts.push(`Selected Plan: Table ${this.sanitizeText(req.currentPlanCode, 20)}`);
    }
    if (req.currentResultContext) {
      parts.push(`Current Calculation Context:\n${this.sanitizeText(req.currentResultContext, 1000)}`);
    }

    parts.push(`User Message: ${this.sanitizeText(req.message, 1000)}`);

    return parts.join('\n\n');
  }
}
