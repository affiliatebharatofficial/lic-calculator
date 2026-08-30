/**
 * Core AI Provider & Assistant Type Definitions
 */

export type AIProviderType = 'gemini' | 'openai' | 'deepseek' | 'mock';

export interface AIModelConfig {
  readonly provider: AIProviderType;
  readonly model: string;
  readonly apiKey?: string;
  readonly maxTokens?: number;
  readonly timeoutMs?: number;
}

export interface ExplanationNumberItem {
  readonly label: string;
  readonly amount: string;
  readonly meaning: string;
  readonly category?: string;
}

export interface StructuredExplanation {
  readonly summary: string;
  readonly whatNumbersMean: readonly ExplanationNumberItem[];
  readonly howCalculated: string;
  readonly keyAssumptions: readonly string[];
  readonly importantWarnings: readonly string[];
  readonly whatToVerify: readonly string[];
  readonly sources?: readonly string[];
}

export interface StructuredChatAnswer {
  readonly answer: string;
  readonly keyPoints: readonly string[];
  readonly assumptions?: readonly string[];
  readonly sources?: readonly string[];
  readonly suggestedFollowUps: readonly string[];
}

export interface ExplanationRequest {
  readonly calculatorId: string;
  readonly planName?: string;
  readonly planCode?: string;
  readonly primaryResult: string;
  readonly breakdownItems: readonly { label: string; amount: string; notes?: string }[];
  readonly assumptions?: readonly string[];
  readonly warnings?: readonly string[];
  readonly ruleVersion?: string;
  readonly sourceReference?: string;
  readonly userQuestion?: string;
  readonly language?: string;
}

export interface ChatMessage {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
  readonly timestamp?: string;
}

export interface ChatRequest {
  readonly message: string;
  readonly conversationHistory?: readonly ChatMessage[];
  readonly currentCalculatorId?: string;
  readonly currentPlanCode?: string;
  readonly currentResultContext?: string;
  readonly language?: string;
}

export interface FieldExplanationRequest {
  readonly fieldName: string;
  readonly calculatorId?: string;
  readonly planCode?: string;
  readonly language?: string;
}

export interface AIResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
  readonly meta: {
    readonly provider: AIProviderType;
    readonly model: string;
    readonly latencyMs: number;
    readonly timestamp: string;
  };
}

export interface AIProvider {
  readonly providerType: AIProviderType;
  readonly model: string;

  generateExplanation(
    request: ExplanationRequest
  ): Promise<AIResponse<StructuredExplanation>>;

  answerQuestion(
    request: ChatRequest
  ): Promise<AIResponse<StructuredChatAnswer>>;

  explainField(
    request: FieldExplanationRequest
  ): Promise<AIResponse<string>>;
}
