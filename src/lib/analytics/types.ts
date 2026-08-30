/**
 * Privacy-Preserving Analytics Type Definitions
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'calculator_started'
  | 'calculation_completed'
  | 'ai_requested'
  | 'language_changed'
  | 'guide_opened'
  | 'author_profile_opened'
  | 'source_opened';

export interface AnalyticsEvent {
  readonly eventType: AnalyticsEventType;
  readonly path?: string;
  readonly calculatorId?: string;
  readonly planCode?: string;
  readonly locale?: string;
  readonly durationMs?: number;
  readonly timestamp?: string;
}
