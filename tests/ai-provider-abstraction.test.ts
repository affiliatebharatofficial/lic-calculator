import { describe, it, expect } from 'vitest';
import { getAIProvider, MockAIProvider, GeminiProvider, OpenAIProvider, DeepSeekProvider } from '@/lib/ai';

describe('AI Provider Abstraction & Factory', () => {
  it('defaults to MockAIProvider when no API keys are provided', () => {
    const provider = getAIProvider({});
    expect(provider).toBeInstanceOf(MockAIProvider);
    expect(provider.providerType).toBe('mock');
  });

  it('resolves DeepSeekProvider when AI_PROVIDER is deepseek and key is present', () => {
    const provider = getAIProvider({
      AI_PROVIDER: 'deepseek',
      DEEPSEEK_API_KEY: 'test-deepseek-key',
      AI_MODEL: 'deepseek-chat'
    });
    expect(provider).toBeInstanceOf(DeepSeekProvider);
    expect(provider.providerType).toBe('deepseek');
    expect(provider.model).toBe('deepseek-chat');
  });

  it('resolves GeminiProvider when AI_PROVIDER is gemini and key is present', () => {
    const provider = getAIProvider({
      AI_PROVIDER: 'gemini',
      GEMINI_API_KEY: 'test-gemini-key',
      AI_MODEL: 'gemini-1.5-pro'
    });
    expect(provider).toBeInstanceOf(GeminiProvider);
    expect(provider.providerType).toBe('gemini');
    expect(provider.model).toBe('gemini-1.5-pro');
  });

  it('resolves OpenAIProvider when AI_PROVIDER is openai and key is present', () => {
    const provider = getAIProvider({
      AI_PROVIDER: 'openai',
      OPENAI_API_KEY: 'test-openai-key',
      AI_MODEL: 'gpt-4o'
    });
    expect(provider).toBeInstanceOf(OpenAIProvider);
    expect(provider.providerType).toBe('openai');
    expect(provider.model).toBe('gpt-4o');
  });

  it('MockAIProvider produces fully structured explanation response', async () => {
    const provider = new MockAIProvider();
    const res = await provider.generateExplanation({
      calculatorId: 'lic-surrender-value-calculator',
      planName: 'Jeevan Labh (Table 936)',
      primaryResult: '₹68,750',
      breakdownItems: [
        { label: 'Total Paid So Far', amount: '₹1,25,000' },
        { label: 'Special Surrender Value', amount: '₹68,750' }
      ],
      assumptions: ['Assumes standard in-force status.'],
      warnings: ['Minimum 2 years duration required.']
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.summary).toContain('₹68,750');
    expect(res.data?.whatNumbersMean.length).toBe(2);
    expect(res.data?.whatToVerify.length).toBeGreaterThan(0);
  });
});
