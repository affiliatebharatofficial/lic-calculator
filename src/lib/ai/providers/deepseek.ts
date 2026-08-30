/**
 * DeepSeek AI Provider Integration
 * Direct integration with DeepSeek API (api.deepseek.com) with OpenAI compatibility.
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

export class DeepSeekProvider implements AIProvider {
  public readonly providerType = 'deepseek';
  public readonly model: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor(config: { apiKey: string; model?: string; timeoutMs?: number }) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'deepseek-chat';
    this.timeoutMs = config.timeoutMs || 10000;
  }

  public async generateExplanation(
    request: ExplanationRequest
  ): Promise<AIResponse<StructuredExplanation>> {
    const startTime = Date.now();
    const context = AIContextBuilder.buildExplanationContext(request);

    try {
      const jsonText = await this.callDeepSeekApi([
        { role: 'system', content: `${SYSTEM_PROMPT_CORE}\n\n${EXPLANATION_INSTRUCTIONS}` },
        { role: 'user', content: `CALCULATION DETAILS TO EXPLAIN:\n${context}` }
      ], true);

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
          message: err?.message || 'Failed to generate explanation from DeepSeek'
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

    try {
      const jsonText = await this.callDeepSeekApi([
        { role: 'system', content: `${SYSTEM_PROMPT_CORE}\n\n${CHAT_INSTRUCTIONS}` },
        { role: 'user', content: `CONVERSATION CONTEXT:\n${context}` }
      ], true);

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
          message: err?.message || 'Failed to answer question via DeepSeek'
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

    try {
      const text = await this.callDeepSeekApi([
        { role: 'system', content: SYSTEM_PROMPT_CORE },
        { role: 'user', content: `Explain the following insurance calculator field in 1-2 clear, simple sentences for a consumer:\nField: ${request.fieldName}` }
      ], false);

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
          message: err?.message || 'Failed to explain field via DeepSeek'
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

  private async callDeepSeekApi(
    messages: Array<{ role: string; content: string }>,
    isJson: boolean = true
  ): Promise<string> {
    const endpoint = 'https://api.deepseek.com/chat/completions';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const bodyPayload: any = {
        model: this.model,
        messages,
        temperature: 0.2
      };

      if (isJson) {
        bodyPayload.response_format = { type: 'json_object' };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify(bodyPayload)
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('DeepSeek API returned an empty text response');
      }

      return text;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
