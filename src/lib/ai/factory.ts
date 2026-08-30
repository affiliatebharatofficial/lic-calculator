/**
 * AI Provider Factory
 * Resolves active AIProvider based on runtime Cloudflare environment and secrets.
 */

import type { AIProvider } from './types';
import { MockAIProvider } from './providers/mock';
import { GeminiProvider } from './providers/gemini';
import { OpenAIProvider } from './providers/openai';
import { DeepSeekProvider } from './providers/deepseek';

export interface RuntimeEnv {
  readonly AI_PROVIDER?: string;
  readonly AI_API_KEY?: string;
  readonly AI_MODEL?: string;
  readonly AI_TIMEOUT_MS?: string | number;
  readonly GEMINI_API_KEY?: string;
  readonly OPENAI_API_KEY?: string;
  readonly DEEPSEEK_API_KEY?: string;
  readonly [key: string]: unknown;
}

export function getAIProvider(env?: RuntimeEnv): AIProvider {
  const providerType = (env?.AI_PROVIDER || (env?.DEEPSEEK_API_KEY ? 'deepseek' : env?.OPENAI_API_KEY ? 'openai' : env?.GEMINI_API_KEY ? 'gemini' : 'mock')).toLowerCase();
  const apiKey = env?.AI_API_KEY || (
    providerType === 'deepseek'
      ? env?.DEEPSEEK_API_KEY
      : providerType === 'gemini'
      ? env?.GEMINI_API_KEY
      : env?.OPENAI_API_KEY
  );
  const model = env?.AI_MODEL;
  const timeoutMs = env?.AI_TIMEOUT_MS ? Number(env.AI_TIMEOUT_MS) : 10000;

  if (providerType === 'deepseek' && apiKey) {
    return new DeepSeekProvider({ apiKey, model, timeoutMs });
  }

  if (providerType === 'gemini' && apiKey) {
    return new GeminiProvider({ apiKey, model, timeoutMs });
  }

  if (providerType === 'openai' && apiKey) {
    return new OpenAIProvider({ apiKey, model, timeoutMs });
  }

  // Default to deterministic grounded offline mock provider
  return new MockAIProvider();
}
