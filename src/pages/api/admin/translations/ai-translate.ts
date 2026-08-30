import type { APIRoute } from 'astro';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/response';
import { getAIProvider, RateLimiter } from '@/lib/ai';
import { GLOSSARY_TERMS } from '@/lib/i18n/glossary';
import { LOCALE_CODES, DEFAULT_LOCALE } from '@/lib/i18n';
import { CALCULATOR_SEO_DATA, getCalculatorSeoData, type CalculatorId } from '@/lib/seo/calculator-content';
import type { Locale } from '@/types/i18n';

export const prerender = false;

// Modern colloquial dictionary mappings for instant natural substitutions
const COMMON_PHRASES: Record<string, Record<Locale, string>> = {
  'Calculate': {
    en: 'Calculate',
    hi: 'कैलकुलेट करें',
    mr: 'कॅल्क्युलेट करा',
    gu: 'કેલ્ક્યુલેટ કરો',
    bn: 'ক্যালকুলেট করুন',
    ta: 'கணக்கிடுங்கள்',
    te: 'లెక్కించండి'
  },
  'Options': {
    en: 'Options',
    hi: 'ऑप्शन्स',
    mr: 'ऑप्शन्स',
    gu: 'ઓપ્શન્સ',
    bn: 'অপশন',
    ta: 'ஆப்ஷன்கள்',
    te: 'ఆప్షన్లు'
  },
  'Option': {
    en: 'Option',
    hi: 'ऑप्शन',
    mr: 'ऑप्शन',
    gu: 'ઓપ્શન',
    bn: 'অপশন',
    ta: 'ஆப்ஷன்',
    te: 'ఆప్షన్'
  },
  'Surrender Value': {
    en: 'Surrender Value',
    hi: 'सरेंडर वैल्यू (समर्पण मूल्य)',
    mr: 'सरेंडर व्हॅल्यू (समर्पण मूल्य)',
    gu: 'સરન્ડર વેલ્યુ (સમર્પણ મૂલ્ય)',
    bn: 'সারেন্ডার ভ্যালু',
    ta: 'சரண்டர் மதிப்பு',
    te: 'సరెండర్ విలువ'
  },
  'Sum Assured': {
    en: 'Sum Assured',
    hi: 'सम एश्योर्ड (बीमा राशि)',
    mr: 'सम अ‍ॅश्युअर्ड (विमा रक्कम)',
    gu: 'સમ એશ્યોર્ડ (વીમા રકમ)',
    bn: 'সাম অ্যাশিওর্ড (বীমা রাশি)',
    ta: 'சம் அஷ்யூர்டு (காப்பீட்டுத் தொகை)',
    te: 'సమ్ అష్యూర్డ్ (భీమా మొత్తం)'
  },
  'Maturity Benefit': {
    en: 'Maturity Benefit',
    hi: 'मैच्योरिटी बेनिफिट',
    mr: 'मॅच्युरिटी बेनिफिट',
    gu: 'મેચ્યોરિટી બેનિફિટ',
    bn: 'ম্যাচিউরিটি সুবিধা',
    ta: 'மெச்சூரிட்டி பலன்',
    te: 'మెచ్యూరిటీ బెనిఫిట్'
  }
};

const NATURAL_LANGUAGE_INSTRUCTIONS = `
CRITICAL NATURAL / COLLOQUIAL CONVERSATIONAL GUIDELINES:
1. USE NATURAL, EVERYDAY SPOKEN LANGUAGE: Do NOT use difficult, archaic, bookish, or overly Sanskritized words.
2. COMMON LOAN WORDS: For terms that people commonly use in everyday speech in India, write the common English word in the target script:
   - "Option" / "Alternative" -> Use "ऑप्शन" / "ऑप्शन्स" (NOT archaic "विकल्प").
   - "Policy" -> Use "पॉलिसी" (NOT "बीमा पत्र").
   - "Calculator" -> Use "कैलकुलेटर" (NOT "गणना यंत्र").
   - "Premium" -> Use "प्रीमियम" (NOT "प्रब्याज़" or "किश्त").
   - "Surrender" -> Use "सरेंडर" / "सरेंडर वैल्यू".
   - "Maturity" -> Use "मैच्योरिटी".
   - "Bonus" -> Use "बोनस".
   - "Loan" -> Use "लोन".
   - "Online" -> Use "ऑनलाइन".
   - "Check" -> Use "चेक करें / चेक करा".
   - "Details" -> Use "डिटेल्स".
   - "Steps" -> Use "स्टेप्स".
   - "Benefit" -> Use "बेनिफिट / फायदा".
3. Apply this same natural, user-friendly, spoken-style standard across ALL supported languages (Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu).
4. Preserve all numbers, percentages (%), and currency symbols (₹) exactly.`;

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

    // MODE A: Full Tool Page Translation
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

      let translatedResult = {
        h1: localizedData.h1,
        subtitle: localizedData.subtitle,
        seoTitle: localizedData.seoTitle,
        metaDescription: localizedData.metaDescription,
        category: localizedData.category,
        howItWorksTitle: localizedData.howItWorks.title,
        howItWorksDescription: localizedData.howItWorks.description,
        faqs: localizedData.faqs
      };

      // If AI provider is available (e.g. DeepSeek, OpenAI, Gemini), prompt for natural spoken tone
      if (provider.providerType !== 'mock') {
        try {
          const aiPrompt = `Translate the following LIC calculator content into natural, conversational, everyday spoken ${targetLocale.toUpperCase()}.
${NATURAL_LANGUAGE_INSTRUCTIONS}

Source Content (English):
H1: ${englishOriginal.h1}
Subtitle: ${englishOriginal.subtitle}
Meta Description: ${englishOriginal.metaDescription}

Return a valid JSON object matching this schema:
{
  "h1": "Natural translated H1",
  "subtitle": "Natural translated Subtitle",
  "metaDescription": "Natural translated Meta Description"
}`;

          const aiAnswer = await provider.answerQuestion({
            message: aiPrompt,
            language: 'en'
          });

          if (aiAnswer.success && aiAnswer.data?.answer) {
            const cleanJson = aiAnswer.data.answer.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.h1) translatedResult.h1 = parsed.h1;
            if (parsed.subtitle) translatedResult.subtitle = parsed.subtitle;
            if (parsed.metaDescription) translatedResult.metaDescription = parsed.metaDescription;
          }
        } catch {
          // Fallback to verified dictionary overlay
        }
      }

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
        translation: translatedResult,
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

    const promptMessage = `You are a modern language translator for an Indian financial platform.
Translate the following English content into these target Indian languages: ${targetLocales.join(', ')}.

Context/Category: ${category}
Text to translate:
"""
${text}
"""

${NATURAL_LANGUAGE_INSTRUCTIONS}

Return ONLY a valid JSON map where keys are language codes (${targetLocales.join(', ')}) and values are the translated text.

Schema:
{
  ${targetLocales.map(l => `"${l}": "Natural translated text in ${l}"`).join(',\n  ')}
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
