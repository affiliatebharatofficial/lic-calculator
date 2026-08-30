/**
 * Centralized Multilingual Financial & Insurance Glossary
 * Reviewed terminology across English, Hindi, Marathi, Gujarati, Bengali, Tamil, and Telugu.
 */

import type { Locale } from '@/types/i18n';

export interface GlossaryTerm {
  readonly id: string;
  readonly englishTerm: string;
  readonly localizedTerms: Record<Locale, string>;
  readonly descriptions: Record<Locale, string>;
}

export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  {
    id: 'sum_assured',
    englishTerm: 'Sum Assured',
    localizedTerms: {
      en: 'Sum Assured',
      hi: 'बीमा राशि (सम एश्योर्ड)',
      mr: 'विमा रक्कम (सम अ‍ॅश्युअर्ड)',
      gu: 'વીમા રકમ (સમ એશ્યોર્ડ)',
      bn: 'বীমাকৃত রাশি (সাম অ্যাশিওর্ড)',
      ta: 'காப்பீட்டுத் தொகை (சம் அஷ்யூர்டு)',
      te: 'భీమా మొత్తం (సమ్ అష్యూర్డ్)'
    },
    descriptions: {
      en: 'The guaranteed minimum life coverage amount payable to nominees on death or to the policyholder upon maturity.',
      hi: 'पॉलिसीधारक की मृत्यु पर नामांकित व्यक्ति को अथवा परिपक्वता पर देय न्यूनतम गारंटीकृत बीमा राशि।',
      mr: 'पॉलिसीधारकाच्या मृत्यूनंतर वारसाला किंवा मुदतपूर्तीनंतर मिळणारी हमीची किमान रक्कम.',
      gu: 'વીમાધારકના અવસાન પર વારસદારને અથવા પાકતી મુદતે મળવાપાત્ર ગેરંટીયુક્ત લઘુત્તમ રકમ.',
      bn: 'পলিসিধারকের মৃত্যুতে মনোনীত ব্যক্তিকে অথবা মেয়াদপূর্তিতে প্রদেয় ন্যূনতম গ্যারান্টিযুক্ত রাশি।',
      ta: 'பாலிசிதாரரின் இறப்பின் போது நாமினிக்கு அல்லது முதிர்வின் போது பாலிசிதாரருக்கு வழங்கப்படும் உத்தரவாதமான தொகை.',
      te: 'పాలసీదారు మరణించినప్పుడు నామినీకి లేదా మెచ్యూరిటీ సమయంలో చెల్లించే కనీస గ్యారెంటీ మొత్తం.'
    }
  },
  {
    id: 'policy_term',
    englishTerm: 'Policy Term',
    localizedTerms: {
      en: 'Policy Term',
      hi: 'पॉलिसी अवधि (टर्म)',
      mr: 'पॉलिसी मुदत',
      gu: 'પૉલિસી મુદત',
      bn: 'পলিসির মেয়াদ',
      ta: 'பாலிசி காலம்',
      te: 'పాలసీ కాలవ్యవధి'
    },
    descriptions: {
      en: 'The total duration in years from policy commencement until maturity.',
      hi: 'पॉलिसी शुरू होने से लेकर परिपक्वता (मैच्योरिटी) तक के कुल वर्षों की संख्या।',
      mr: 'पॉलिसी सुरू झाल्यापासून मुदत संपेपर्यंतचा एकूण कालावधी.',
      gu: 'પૉલિસી શરૂ થવાથી પાકતી મુદત સુધીનો કુલ સમયગાળો.',
      bn: 'পলিসি শুরুর তারিখ থেকে মেয়াদ শেষ হওয়া পর্যন্ত মোট বছরের সংখ্যা।',
      ta: 'பாலிசி தொடங்கியதிலிருந்து முதிர்வு வரையிலான மொத்த ஆண்டுகள்.',
      te: 'పాలసీ ప్రారంభమైనప్పటి నుండి మెచ్యూరిటీ వరకు మొత్తం సంవత్సరాలు.'
    }
  },
  {
    id: 'premium_paying_term',
    englishTerm: 'Premium Paying Term (PPT)',
    localizedTerms: {
      en: 'Premium Paying Term (PPT)',
      hi: 'प्रीमियम भुगतान अवधि (पीपीटी)',
      mr: 'हप्ता भरण्याची मुदत (PPT)',
      gu: 'પ્રીમિયમ ભરવાની મુદત (PPT)',
      bn: 'প্রিমিয়াম প্রদানের মেয়াদ (PPT)',
      ta: 'பிரீமியம் செலுத்தும் காலம் (PPT)',
      te: 'ప్రీమియం చెల్లింపు కాలపరిమితి (PPT)'
    },
    descriptions: {
      en: 'The number of years for which premium installments must be paid under the policy.',
      hi: 'वह समयावधि जिसके दौरान पॉलिसीधारक को प्रीमियम किश्तों का भुगतान करना होता है।',
      mr: 'ज्या कालावधीसाठी पॉलिसीचे हप्ते भरणे आवश्यक असते.',
      gu: 'જેટલા વર્ષો સુધી પૉલિસીના પ્રીમિયમ હપ્તા ભરવાના હોય તે સમયગાળો.',
      bn: 'যত বছর পলিসির প্রিমিয়াম কিস্তি জমা দিতে হবে।',
      ta: 'பாலிசிக்கான பிரீமியம் செலுத்த வேண்டிய மொத்த ஆண்டுகளின் எண்ணிக்கை.',
      te: 'పాలసీ కింద ప్రీమియం వాయిదాలు చెల్లించాల్సిన సంవత్సరాల సంఖ్య.'
    }
  },
  {
    id: 'surrender_value',
    englishTerm: 'Surrender Value',
    localizedTerms: {
      en: 'Surrender Value',
      hi: 'समर्पण मूल्य (सरेंडर वैल्यू)',
      mr: 'सरेंडर मूल्य',
      gu: 'સમર્પણ મૂલ્ય (સરન્ડર વેલ્યુ)',
      bn: 'সমর্পণ মূল্য (সারেন্ডার ভ্যালু)',
      ta: 'ஒப்படைப்பு மதிப்பு (சரண்டர் வேல்யூ)',
      te: 'సరెండర్ విలువ'
    },
    descriptions: {
      en: 'The cash payout paid by LIC if a policyholder terminates their policy before its full maturity term.',
      hi: 'पॉलिसी को परिपक्वता से पहले बंद (सरेंडर) करने पर एलआईसी द्वारा दी जाने वाली नकद राशि।',
      mr: 'मुदत संपण्यापूर्वी पॉलिसी बंद केल्यास एलआयसीकडून मिळणारी रोख रक्कम.',
      gu: 'પાકતી મુદત પહેલાં પૉલિસી બંધ કરવા પર એલઆઈસી દ્વારા મળતી રોકડ રકમ.',
      bn: 'মেয়াদ শেষ হওয়ার আগেই পলিসি বন্ধ করলে এলআইসি থেকে প্রাপ্ত নগদ অর্থ।',
      ta: 'முதிர்வுக்கு முன்பே பாலிசியை ரத்து செய்யும்போது எல்ஐசி வழங்கும் பண மதிப்பு.',
      te: 'మెచ్యూరిటీకి ముందే పాలసీని రద్దు చేసుకుంటే ఎల్‌ఐసీ చెల్లించే నగదు మొత్తం.'
    }
  },
  {
    id: 'paid_up',
    englishTerm: 'Paid-Up Policy',
    localizedTerms: {
      en: 'Paid-Up Policy',
      hi: 'चुकता पॉलिसी (पेड-अप पॉलिसी)',
      mr: 'पेड-अप पॉलिसी',
      gu: 'પેઈડ-અપ પૉલિસી',
      bn: 'পেইড-আপ পলিসি',
      ta: 'பெய்ட்-அப் பாலிசி',
      te: 'పెయిడ్-అప్ పాలసీ'
    },
    descriptions: {
      en: 'A policy where premium payments have ceased but reduced life coverage continues and maturity benefit is paid at term end.',
      hi: 'ऐसी पॉलिसी जिसमें प्रीमियम भरना रोक दिया गया हो, पर घटी हुई बीमा राशि पर कवर जारी रहता है और मैच्योरिटी पर भुगतान मिलता है।',
      mr: 'हप्ते भरणे थांबवले तरी कमी झालेल्या विम्यासह सुरू राहणारी आणि मुदतीनंतर पैसे मिळणारी पॉलिसी.',
      gu: 'પ્રીમિયમ ભરવાનું બંધ કર્યા પછી પણ ઘટાડેલા વીમા કવચ સાથે ચાલુ રહેતી પૉલિસી.',
      bn: 'প্রিমিয়াম বন্ধ থাকা সত্ত্বেও হ্রাসকৃত কভারেজ সহ মেয়াদান্তে অর্থ প্রদানের পলিসি।',
      ta: 'பிரீமியம் செலுத்துவது நிறுத்தப்பட்டாலும் குறைக்கப்பட்ட காப்பீட்டுடன் முதிர்வில் பலன் தரும் பாலிசி.',
      te: 'ప్రీమియం చెల్లింపులు ఆగిపోయినా తగ్గిన భీమా రక్షణతో కొనసాగి మెచ్యూరిటీకి ప్రయోజనం అందించే పాలసీ.'
    }
  },
  {
    id: 'policy_loan',
    englishTerm: 'Policy Loan',
    localizedTerms: {
      en: 'Policy Loan',
      hi: 'पॉलिसी ऋण (लोन)',
      mr: 'पॉलिसी कर्ज',
      gu: 'પૉલિસી લોન',
      bn: 'পলিসি লোন',
      ta: 'பாலிசி கடன்',
      te: 'పాలసీ రుణం'
    },
    descriptions: {
      en: 'A secured borrowing facility against the acquired cash surrender value of an in-force or paid-up policy.',
      hi: 'पॉलिसी के अर्जित सरेंडर वैल्यू के आधार पर एलआईसी से लिया जाने वाला सुरक्षित ऋण।',
      mr: 'पॉलिसीच्या जमा सरेंडर मूल्यावर मिळणारे सुरक्षित कर्ज.',
      gu: 'પૉલિસીની જમા સરન્ડર વેલ્યુ સામે મળતી સુરક્ષિત લોન સુવિધા.',
      bn: 'পলিসির অর্জিত সারেন্ডার মূল্যের ভিত্তিতে প্রাপ্ত ঋণ সুবিধা।',
      ta: 'பாலிசியின் சரண்டர் மதிப்புக்கு எதிராக பெறப்படும் கடன் வசதி.',
      te: 'పాలసీ సరెండర్ విలువ ఆధారంగా పొందే రుణ సదుపాయం.'
    }
  },
  {
    id: 'bonus',
    englishTerm: 'Reversionary Bonus',
    localizedTerms: {
      en: 'Reversionary Bonus',
      hi: 'प्रत्यावर्ती बोनस (रिवर्शनरी बोनस)',
      mr: 'रिव्हर्शनरी बोनस',
      gu: 'રિવર્શનરી બોનસ',
      bn: 'রিভার্শনারি বোনাস',
      ta: 'ரிவர்ஷனரி போனஸ்',
      te: 'రివర్షనరీ బోనస్'
    },
    descriptions: {
      en: 'Annual profit allocation declared by LIC per ₹1,000 Sum Assured that accumulates and is payable upon maturity or death.',
      hi: 'एलआईसी द्वारा प्रति ₹1,000 बीमा राशि पर घोषित वार्षिक लाभ जो मैच्योरिटी या मृत्यु पर देय होता है।',
      mr: 'दरवर्षी एलआयसीद्वारे प्रति ₹1,000 विम्यावर जाहीर होणारा आणि मुदतपूर्तीस मिळणारा नफा.',
      gu: 'દર ₹1,000 વીમા રકમ દીઠ એલઆઈસી દ્વારા વાર્ષિક જાહેર થતો બોનસ નફો.',
      bn: 'প্রতি ₹১,০০০ বীমাকৃত রাশিতে এলআইসি কর্তৃক বার্ষিক ঘোষিত লভ্যাংশ।',
      ta: 'ஒவ்வொரு ₹1,000 காப்பீட்டுத் தொகைக்கும் எல்ஐசி அறிவிக்கும் வருடாந்திர போனஸ்.',
      te: 'ప్రతి ₹1,000 భీమా మొత్తానికి ఎల్‌ఐసీ ఏటా ప్రకటించే బోనస్ లాభం.'
    }
  }
];

export function getGlossaryTerm(termId: string, locale: Locale = 'en'): { term: string; description: string } {
  const item = GLOSSARY_TERMS.find((g) => g.id === termId);
  if (!item) {
    return { term: termId, description: '' };
  }
  return {
    term: item.localizedTerms[locale] || item.localizedTerms.en,
    description: item.descriptions[locale] || item.descriptions.en
  };
}
