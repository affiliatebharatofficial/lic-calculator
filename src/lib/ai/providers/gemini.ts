/**
 * Google Gemini Provider Integration
 */

import type {
  AIProvider,
  AIResponse,
  ExplanationRequest,
  ChatRequest,
  FieldExplanationRequest,
  StructuredExplanation,
  StructuredChatAnswer
} from '../types';
import { AIContextBuilder } from '../context-builder';
import { SYSTEM_PROMPT_CORE, EXPLANATION_INSTRUCTIONS, CHAT_INSTRUCTIONS } from '../prompt-templates';

export class GeminiProvider implements AIProvider {
  public readonly providerType = 'gemini';
  public readonly model: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor(config: { apiKey: string; model?: string; timeoutMs?: number }) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-1.5-flash';
    this.timeoutMs = config.timeoutMs || 8000;
  }

  public async generateExplanation(
    request: ExplanationRequest
  ): Promise<AIResponse<StructuredExplanation>> {
    const startTime = Date.now();
    const context = AIContextBuilder.buildExplanationContext(request);

    const prompt = `${SYSTEM_PROMPT_CORE}\n\n${EXPLANATION_INSTRUCTIONS}\n\nCALCULATION DETAILS TO EXPLAIN:\n${context}`;

    try {
      const jsonText = await this.callGeminiApi(prompt);
      const parsed = JSON.parse(jsonText) as StructuredExplanation;

      return {
        success: true,
        data: parsed,
        meta: {
          provider: this.providerType,
          model: this.model,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'AI_GENERATION_FAILED',
          message: err?.message || 'Failed to generate explanation from Gemini'
        },
        meta: {
          provider: this.providerType,
          model: this.model,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  public async answerQuestion(
    request: ChatRequest
  ): Promise<AIResponse<StructuredChatAnswer>> {
    const startTime = Date.now();
    const context = AIContextBuilder.buildChatContext(request);

    const prompt = `${SYSTEM_PROMPT_CORE}\n\n${CHAT_INSTRUCTIONS}\n\nCONVERSATION CONTEXT:\n${context}`;

    try {
      const jsonText = await this.callGeminiApi(prompt);
      const parsed = JSON.parse(jsonText) as StructuredChatAnswer;

      return {
        success: true,
        data: parsed,
        meta: {
          provider: this.providerType,
          model: this.model,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'AI_CHAT_FAILED',
          message: err?.message || 'Failed to answer question via Gemini'
        },
        meta: {
          provider: this.providerType,
          model: this.model,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  public async explainField(
    request: FieldExplanationRequest
  ): Promise<AIResponse<string>> {
    const startTime = Date.now();
    const prompt = `${SYSTEM_PROMPT_CORE}\n\nExplain the following insurance calculator field in 1-2 clear, simple sentences for a consumer:\nField: ${request.fieldName}`;

    try {
      const text = await this.callGeminiApi(prompt, false);
      return {
        success: true,
        data: text.trim(),
        meta: {
          provider: this.providerType,
          model: this.model,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'AI_FIELD_EXPLAIN_FAILED',
          message: err?.message || 'Failed to explain field via Gemini'
        },
        meta: {
          provider: this.providerType,
          model: this.model,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  private async callGeminiApi(prompt: string, isJson: boolean = true): Promise<string> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: isJson ? 'application/json' : 'text/plain'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini API returned an empty text response');
      }

      return text;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
