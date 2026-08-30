import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { getAIProvider, RateLimiter } from '@/lib/ai';
import { GLOSSARY_TERMS } from '@/lib/i18n/glossary';
import { LOCALE_CODES, DEFAULT_LOCALE } from '@/lib/i18n';
import { CALCULATOR_SEO_DATA, getCalculatorSeoData, type CalculatorId } from '@/lib/seo/calculator-content';
import type { Locale } from '@/types/i18n';

export const prerender = false;

// Fallback dictionary map for instant terminology substitution
const COMMON_PHRASES: Record<string, Record<Locale, string>> = {
  'Calculate': {
    en: 'Calculate',
    hi: 'गणना करें',
    mr: 'गणना करा',
    gu: 'ગણતરી કરો',
    bn: 'গণনা করুন',
    ta: 'கணக்கிடுங்கள்',
    te: 'లెక్కించండి'
  },
  'Surrender Value': {
    en: 'Surrender Value',
    hi: 'समर्पण मूल्य (सरेंडर वैल्यू)',
    mr: 'समर्पण मूल्य (सरेंडर व्हॅल्यू)',
    gu: 'સમર્પણ મૂલ્ય (સરન્ડર વેલ્યુ)',
    bn: 'সমর্পণ মূল্য (সারেন্ডার ভ্যালু)',
    ta: 'சரண்டர் மதிப்பு',
    te: 'సరెండర్ విలువ'
  },
  'Sum Assured': {
    en: 'Sum Assured',
    hi: 'बीमा राशि (सम एश्योर्ड)',
    mr: 'विमा रक्कम (सम अ‍ॅश्युअर्ड)',
    gu: 'વીમા રકમ (સમ એશ્યોર્ડ)',
    bn: 'বীমাকৃত রাশি (সাম অ্যাশিওર્ડ)',
    ta: 'காப்பீட்டுத் தொகை (சம் அஷ்யூர்டு)',
    te: 'భీమా మొత్తం (సమ్ అష్యూర్డ్)'
  },
  'Maturity Benefit': {
    en: 'Maturity Benefit',
    hi: 'परिपक्वता लाभ (मैच्योरिटी)',
    mr: 'परिपक्वता लाभ (मॅच्युरिटी)',
    gu: 'પાકતી મુદતનો લાભ (મેચ્યોરિટી)',
    bn: 'মেয়াদপূর্তি সুবিধা (ম্যাচিউরিটি)',
    ta: 'முதிர்வு பலன் (மெச்சூரிட்டி)',
    te: 'మెచ్యూరిటీ ప్రయోజనం'
  }
};

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  try {
    // 1. Rate Limiting for Admin Operations
    const ip = clientAddress || '127.0.0.1';
    const rateLimit = RateLimiter.check(ip, { maxRequests: 50, windowMs: 60 * 1000 });
    if (!rateLimit.isAllowed) {
      return createErrorResponse(
        'RATE_LIMITED',
        `Translation rate limit reached. Please wait ${Math.ceil(rateLimit.resetInMs / 1000)} seconds.`,
        429
      );
    }

    // 2. Parse request payload
    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('BAD_REQUEST', 'Invalid JSON request payload', 400);
    }

    const env = (locals as any)?.runtime?.env || (process as any).env;
    const provider = getAIProvider(env);

    // MODE A: Full Tool Page Translation (When toolId & targetLocale are provided)
    if (body?.toolId) {
      const toolId = String(body.toolId) as CalculatorId;
      const targetLocale = (body.targetLocale || 'hi') as Locale;

      if (!CALCULATOR_SEO_DATA[toolId]) {
        return createErrorResponse('NOT_FOUND', `Calculator tool "${toolId}" not found.`, 404);
      }

      if (!LOCALE_CODES.includes(targetLocale) || targetLocale === DEFAULT_LOCALE) {
        return createErrorResponse('VALIDATION_ERROR', `Invalid target language "${targetLocale}".`, 422);
      }

      const englishOriginal = CALCULATOR_SEO_DATA[toolId];
      const localizedData = getCalculatorSeoData(toolId, targetLocale);

      return createSuccessResponse({
        mode: 'tool',
        toolId,
        targetLocale,
        original: {
          h1: englishOriginal.h1,
          subtitle: englishOriginal.subtitle,
          seoTitle: englishOriginal.seoTitle,
          metaDescription: englishOriginal.metaDescription,
          category: englishOriginal.category,
          howItWorksTitle: englishOriginal.howItWorks.title,
          howItWorksDescription: englishOriginal.howItWorks.description,
          faqs: englishOriginal.faqs
        },
        translation: {
          h1: localizedData.h1,
          subtitle: localizedData.subtitle,
          seoTitle: localizedData.seoTitle,
          metaDescription: localizedData.metaDescription,
          category: localizedData.category,
          howItWorksTitle: localizedData.howItWorks.title,
          howItWorksDescription: localizedData.howItWorks.description,
          faqs: localizedData.faqs
        },
        meta: {
          provider: provider.providerType,
          model: provider.model,
          timestamp: new Date().toISOString()
        }
      });
    }

    // MODE B: Single Text / Snippet Translation
    const text = body?.text?.trim();
    if (!text || typeof text !== 'string') {
      return createErrorResponse('VALIDATION_ERROR', 'Input "text" or "toolId" is required.', 422);
    }

    if (text.length > 5000) {
      return createErrorResponse('VALIDATION_ERROR', 'Input text exceeds 5,000 characters limit.', 422);
    }

    const category = body?.category || 'General';
    const targetLocales: Locale[] = Array.isArray(body?.targetLocales) && body.targetLocales.length > 0
      ? body.targetLocales.filter((l: string) => LOCALE_CODES.includes(l as Locale) && l !== DEFAULT_LOCALE)
      : (LOCALE_CODES.filter((l) => l !== DEFAULT_LOCALE) as Locale[]);

    const glossaryHints = GLOSSARY_TERMS.slice(0, 5).map(g => `${g.englishTerm} -> HI:${g.localizedTerms.hi}, MR:${g.localizedTerms.mr}, GU:${g.localizedTerms.gu}, BN:${g.localizedTerms.bn}, TA:${g.localizedTerms.ta}, TE:${g.localizedTerms.te}`).join('\n');

    const promptMessage = `You are a certified actuarial and financial translator specializing in Indian insurance policies (LIC).
Translate the following English content into these target Indian languages: ${targetLocales.join(', ')}.

Context/Category: ${category}
Text to translate:
"""
${text}
"""

STRICT RULES:
1. Preserve all numerical figures, years, percentages (%), and currency symbols (₹).
2. Use verified Indian insurance terminology.
3. Glossary Reference:
${glossaryHints}
4. Return ONLY a valid JSON map where keys are language codes (${targetLocales.join(', ')}) and values are the translated text.

Schema:
{
  ${targetLocales.map(l => `"${l}": "Translated text in ${l}"`).join(',\n  ')}
}`;

    const aiResult = await provider.answerQuestion({
      message: promptMessage,
      language: 'en'
    });

    const translations: Record<string, string> = {};

    if (aiResult.success && aiResult.data?.answer) {
      try {
        const rawJson = aiResult.data.answer.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(rawJson);
        for (const loc of targetLocales) {
          if (parsed[loc]) {
            translations[loc] = parsed[loc];
          }
        }
      } catch {
        // Fallback below
      }
    }

    for (const loc of targetLocales) {
      if (!translations[loc]) {
        if (COMMON_PHRASES[text] && COMMON_PHRASES[text][loc]) {
          translations[loc] = COMMON_PHRASES[text][loc];
        } else {
          const matchingTerm = GLOSSARY_TERMS.find(g => g.englishTerm.toLowerCase() === text.toLowerCase());
          if (matchingTerm && matchingTerm.localizedTerms[loc]) {
            translations[loc] = matchingTerm.localizedTerms[loc];
          } else {
            translations[loc] = `[${loc.toUpperCase()}] ${text}`;
          }
        }
      }
    }

    return createSuccessResponse({
      mode: 'snippet',
      originalText: text,
      category,
      translations,
      targetLocales,
      meta: {
        provider: provider.providerType,
        model: provider.model,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      `Unexpected error in AI translation: ${err?.message || err}`,
      500
    );
  }
};
