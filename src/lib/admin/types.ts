/**
 * Production Admin, CMS & Rule Management Type Definitions
 */

import type { Locale } from '@/types/i18n';

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'reviewer';

export type AdminStatus = 'active' | 'suspended' | 'invited';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: AdminRole;
  expiresAt: string;
  createdAt: string;
  ipAddress?: string;
}

export type RuleStatus =
  | 'draft'
  | 'review'
  | 'verified'
  | 'published'
  | 'expired'
  | 'rejected'
  | 'archived'
  | 'disabled';

export type SourceType =
  | 'official_document'
  | 'official_webpage'
  | 'policy_document'
  | 'regulatory_document'
  | 'circular'
  | 'internal_review'
  | 'test_fixture'
  | 'other';

export type SourceVerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface RuleSource {
  id: string;
  sourceTitle: string;
  sourceType: SourceType;
  publisher: string;
  publicationDate?: string;
  effectiveDate?: string;
  sourceReference: string;
  sourceUrl?: string;
  documentRef?: string;
  verificationStatus: SourceVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManagedRuleSet {
  id: string;
  planCode: string;
  tableNo: number;
  calculatorCode: string;
  version: string;
  status: RuleStatus;
  isPublished: boolean;
  calculationStrategy: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceId?: string;
  sourceTitle?: string;
  rulePayload: Record<string, unknown>;
  notes?: string;
  createdBy: string;
  reviewedBy?: string;
  reviewedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  publishedBy?: string;
  publishedAt?: string;
  disabledBy?: string;
  disabledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegressionFixture {
  id: string;
  ruleSetId: string;
  calculatorCode: string;
  fixtureName: string;
  testInput: Record<string, unknown>;
  expectedOutput: Record<string, unknown>;
  lastTestStatus: 'passed' | 'failed' | 'pending';
  lastRunAt?: string;
}

export type ContentStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export interface ContentItem {
  id: string;
  contentId: string;
  contentType: 'article' | 'calculator_copy' | 'guide' | 'disclaimer' | 'legal' | 'faq';
  category?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  translations?: Record<Locale, ContentTranslation>;
}

export interface ContentTranslation {
  id: string;
  contentItemId: string;
  locale: Locale;
  version: number;
  title: string;
  slug: string;
  contentMarkdown: string;
  metaTitle?: string;
  metaDescription?: string;
  status: ContentStatus;
  isPublished: boolean;
  createdBy: string;
  reviewedBy?: string;
  publishedBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: AdminRole;
  eventType: string;
  targetEntity: string;
  targetId: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalPlans: number;
  activePlans: number;
  totalRules: number;
  draftRules: number;
  pendingReviewRules: number;
  verifiedRules: number;
  publishedRules: number;
  totalSources: number;
  pendingSources: number;
  pendingTranslations: number;
  recentAuditLogs: AuditLogEntry[];
}
