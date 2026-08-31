import type { Locale } from '@/types/i18n';

export interface AboutValueCard {
  title: string;
  description: string;
  icon: string;
}

export interface AboutSection {
  title: string;
  paragraphs: string[];
  listItems?: string[];
  alert?: {
    type: 'info' | 'warning';
    text: string;
  };
}

export interface AboutPageData {
  seoTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  missionHeading: string;
  missionText: string;
  bannerNotice: {
    title: string;
    text: string;
  };
  pillars: AboutValueCard[];
  sections: AboutSection[];
  editorialHeading: string;
  editorialSubtext: string;
  relatedLinksHeading: string;
  relatedLinks: Array<{ label: string; url: string; description: string }>;
}

export const ABOUT_CONTENT: Record<Locale, AboutPageData> = {
  en: {
    seoTitle: 'About LIC Calculators | Independent Financial Tools',
    metaDescription: 'Learn about lic-calculators.com, our independent mission, deterministic actuarial methodology, editorial review process, and policy transparency standards.',
    h1: 'About LIC Calculators',
    subtitle: 'An independent financial technology platform dedicated to bringing mathematical clarity, transparency, and unbiased decision-making to life insurance policyholders.',
    missionHeading: 'Our Mission & Independence',
    missionText: 'lic-calculators.com was built to solve a critical challenge faced by millions of Indian policyholders: understanding the true mathematical value of life insurance contracts without commercial sales pressure or opaque calculations.',
    bannerNotice: {
      title: 'Independent Financial Platform Notice',
      text: 'lic-calculators.com is an independent educational calculation portal. We are NOT affiliated with, sponsored by, authorized by, or endorsed by Life Insurance Corporation of India (LIC), the Government of India, or any statutory authority.'
    },
    pillars: [
      {
        title: 'Deterministic Calculation Engine',
        description: 'Calculations run on verifiable actuarial formulas and historical valuation factors—never speculative AI or black-box guesswork.',
        icon: '🧮'
      },
      {
        title: 'Zero Sales Bias',
        description: 'We do not sell insurance policies, collect agent commissions, or push new products. Our tools deliver objective financial clarity.',
        icon: '⚖️'
      },
      {
        title: 'Privacy-First Architecture',
        description: 'Calculators execute in your browser. We never harvest or store policy numbers, personal names, or banking credentials.',
        icon: '🔒'
      },
      {
        title: 'Multilingual Accessibility',
        description: 'Available across 7 major Indian languages so policyholders nationwide can analyze their financial plans in their native language.',
        icon: '🌐'
      }
    ],
    sections: [
      {
        title: '1. What We Do',
        paragraphs: [
          'lic-calculators.com provides a comprehensive suite of 16 specialized online financial calculation tools, comparative decision frameworks, and educational guides for policyholders.',
          'Whether you are evaluating whether to surrender a policy, convert to a paid-up policy, check policy loan borrowing limits, estimate maturity returns, or determine your Human Life Value (HLV), our tools simplify complex insurance mathematics into transparent, actionable insights.'
        ],
        listItems: [
          'Surrender & Paid-Up Calculators: Compute Guaranteed Surrender Value (GSV), Special Surrender Value (SSV), and paid-up sum assured.',
          'Maturity & Bonus Calculators: Project maturity proceeds based on declared simple reversionary and final additional bonus rates.',
          'Policy Loan & Liquidity Tools: Calculate loan eligibility against accrued surrender value and estimate interest repayment schedules.',
          'Human Life Value (HLV) & Term Tools: Determine required life cover based on income replacement and future family liabilities.'
        ]
      },
      {
        title: '2. Why This Platform Exists',
        paragraphs: [
          'Traditional life insurance contracts often span 15 to 30 years and contain intricate actuarial terms—such as surrender factors, reversionary bonuses, modal loadings, and paid-up deductions. Manually calculating these figures is daunting, and policyholders frequently encounter biased guidance from sales intermediaries.',
          'Our platform bridges this knowledge gap by giving policyholders instant access to transparent computation engines with clearly disclosed formulas and assumptions.'
        ]
      },
      {
        title: '3. How Our Calculators Work',
        paragraphs: [
          'Every calculator follows a structured, transparent 4-step execution workflow:'
        ],
        listItems: [
          '1. User Input Collection: The user enters non-PII policy parameters (such as sum assured, policy term, premium paying term, and completed policy years).',
          '2. Actuarial Factor Lookup: The engine references verified plan-specific rules (such as GSV tables, SSV discount factors, or declared bonus charts).',
          '3. Deterministic Computation: Mathematical algorithms compute exact premiums, surrender values, loan limits, or IRR returns.',
          '4. Structured Output & Explanation: Results are rendered instantly with interactive visual breakdowns, cash flow tables, and disclosed assumptions.'
        ]
      },
      {
        title: '4. Accuracy, Variance Factors & Transparency Standards',
        paragraphs: [
          'We hold ourselves to high editorial and mathematical rigor. However, because life insurance contracts are governed by individual policy endorsements, regulatory revisions, and future bonus declarations, calculator outputs must be treated strictly as informative estimates.',
          'We do NOT claim that our outputs are "100% guaranteed" or "official LIC ledger entries". Actual policy values are determined exclusively by Life Insurance Corporation of India at the time of official policy processing.'
        ],
        listItems: [
          'Plan Era & Policy Changes: Regulatory updates (such as the IRDAI Master Circular guidelines) alter surrender factors across different product eras.',
          'Dynamic Bonus Declarations: Bonuses are declared annually by LIC post-statutory valuation and cannot be guaranteed in advance.',
          'Individual Liens & Deductions: Calculations do not include unpaid loans, late fee penalties, or special medical loadings unless manually specified by the user.'
        ],
        alert: {
          type: 'info',
          text: 'If there is any variance between online estimates and your official LIC status report, official LIC documentation always supersedes.'
        }
      },
      {
        title: '5. Public & Regulatory Data Sources',
        paragraphs: [
          'Our calculation formulas and reference tables are constructed using publicly available actuarial information and statutory regulatory publications, including:'
        ],
        listItems: [
          'Official LIC Product Brochures & Policy Bonds (e.g. Plan 914, Plan 915, Plan 936, Plan 945).',
          'Annual LIC Statutory Valuation Reports & Bonus Gazettes.',
          'IRDAI Master Circulars on Life Insurance Products and Surrender Regulations.'
        ]
      },
      {
        title: '6. The Role of Artificial Intelligence',
        paragraphs: [
          'Our platform features an optional AI Policy Assistant designed to provide educational explanations, clarify insurance terminology, and help users understand calculator outputs.',
          'Crucially, AI is NOT the calculation engine. All financial calculations are executed by deterministic mathematical algorithms in JavaScript/TypeScript. The AI serves exclusively as an interpretive and educational guide, operating under strict prompt grounding.'
        ]
      }
    ],
    editorialHeading: 'Editorial Standards & Peer Review Process',
    editorialSubtext: 'Our calculation methodologies and informational guides are authored, peer-reviewed, and fact-checked by experienced actuarial researchers and financial professionals.',
    relatedLinksHeading: 'Related Legal & Platform Resources',
    relatedLinks: [
      { label: 'All Financial Calculators', url: '/calculators', description: 'Explore our complete suite of 16 independent LIC calculators.' },
      { label: 'Legal Disclaimer', url: '/disclaimer', description: 'Review our non-affiliation notice, calculation estimates, and liability limits.' },
      { label: 'Privacy Policy', url: '/privacy-policy', description: 'Understand how we protect your privacy with zero personal data storage.' },
      { label: 'Terms of Service', url: '/terms', description: 'Read the terms governing access and use of our calculation tools.' }
    ]
  },
  hi: {
    seoTitle: 'हमारे बारे में (About Us) | LIC Calculators',
    metaDescription: 'lic-calculators.com के बारे में जानें। हमारा स्वतंत्र मिशन, गणितीय फॉर्मूले, संपादकीय समीक्षा प्रक्रिया और बीमा पारदर्शिता मानक।',
    h1: 'हमारे बारे में (About LIC Calculators)',
    subtitle: 'एक स्वतंत्र वित्तीय तकनीक मंच जो भारतीय पॉलिसीधारकों को बिना किसी बिक्री दबाव के सटीक और स्पष्ट गणना प्रदान करता है।',
    missionHeading: 'हमारा मिशन और स्वतंत्रता',
    missionText: 'lic-calculators.com का निर्माण भारतीय पॉलिसीधारकों को जटिल जीवन बीमा गणनाओं को आसानी से समझाने और पारदर्शी वित्तीय निर्णय लेने में मदद करने के लिए किया गया है।',
    bannerNotice: {
      title: 'स्वतंत्र वित्तीय प्लेटफॉर्म की घोषणा',
      text: 'lic-calculators.com एक स्वतंत्र शैक्षणिक गणना पोर्टल है। यह भारतीय जीवन बीमा निगम (LIC), भारत सरकार या किसी भी वैधानिक प्राधिकरण से संबद्ध, अधिकृत या प्रायोजित नहीं है।'
    },
    pillars: [
      {
        title: 'सटीक गणितीय गणना इंजन',
        description: 'गणनाएं सार्वजनिक बीमा नियमों और ऐतिहासिक बोनस दरों पर आधारित हैं—किसी काल्पनिक AI अनुमान पर नहीं।',
        icon: '🧮'
      },
      {
        title: 'शून्य बिक्री पूर्वाग्रह (Zero Sales Bias)',
        description: 'हम कोई बीमा पॉलिसी नहीं बेचते हैं और न ही एजेंट कमीशन लेते हैं। हमारा उद्देश्य केवल निष्पक्ष वित्तीय स्पष्टता देना है।',
        icon: '⚖️'
      },
      {
        title: 'गोपनीयता-प्रथम संरचना',
        description: 'कैलकुलेटर सीधे आपके ब्राउज़र में चलते हैं। हम आपका पॉलिसी नंबर या व्यक्तिगत डेटा कभी स्टोर नहीं करते।',
        icon: '🔒'
      },
      {
        title: 'बहुभाषी पहुंच (Multilingual)',
        description: 'भारत की 7 प्रमुख भाषाओं में उपलब्ध ताकि हर नागरिक अपनी मातृभाषा में वित्तीय विश्लेषण कर सके।',
        icon: '🌐'
      }
    ],
    sections: [
      {
        title: '1. हम क्या करते हैं',
        paragraphs: [
          'lic-calculators.com 16 स्वतंत्र वित्तीय कैलकुलेटर और शैक्षणिक गाइड प्रदान करता है।',
          'चाहे आपको सरेंडर वैल्यू जाननी हो, पेड-अप वैल्यू, पॉलिसी लोन की पात्रता, मैच्युरिटी अनुमान या ह्यूमन लाइफ वैल्यू (HLV), हमारे टूल्स जटिल गणनाओं को सरल बनाते हैं।'
        ]
      },
      {
        title: '2. यह वेबसाइट क्यों बनाई गई',
        paragraphs: [
          'जीवन बीमा पॉलिसियां 15 से 30 वर्षों की होती हैं और इनमें सरेंडर फैक्टर, बोनस और पेनल्टी जैसे कई जटिल नियम होते हैं। पॉलिसीधारकों को सही जानकारी देने के लिए हमने यह स्वतंत्र प्लेटफॉर्म बनाया है।'
        ]
      },
      {
        title: '3. सटीकता और पारदर्शिता के मानक',
        paragraphs: [
          'हमारे टूल्स सार्वजनिक रूप से उपलब्ध एलआईसी ब्रोशर और आईआरडीएआई सर्कुलर पर आधारित हैं।',
          'सभी परिणाम गणितीय अनुमान हैं। किसी भी विसंगति की स्थिति में एलआईसी का आधिकारिक रिकॉर्ड ही मान्य होगा।'
        ],
        alert: {
          type: 'info',
          text: 'अंतिम आधिकारिक सरेंडर वैल्यू और मैच्युरिटी राशि के लिए हमेशा LIC की आधिकारिक शाखा से संपर्क करें।'
        }
      },
      {
        title: '4. कृत्रिम बुद्धिमत्ता (AI) की भूमिका',
        paragraphs: [
          'वेबसाइट पर उपलब्ध AI सहायक केवल बीमा नियमों और गणना परिणामों को सरल भाषा में समझाने के लिए है। मुख्य वित्तीय गणनाएं सख्त गणितीय कोड द्वारा की जाती हैं।'
        ]
      }
    ],
    editorialHeading: 'संपादकीय मानक और विशेषज्ञ समीक्षा',
    editorialSubtext: 'हमारी सभी गणना विधियां और गाइड योग्य बीमा व वित्तीय विशेषज्ञों द्वारा सत्यापित की जाती हैं।',
    relatedLinksHeading: 'संबंधित कानूनी व वित्तीय संसाधन',
    relatedLinks: [
      { label: 'सभी वित्तीय कैलकुलेटर', url: '/calculators', description: 'हमारे सभी 16 स्वतंत्र कैलकुलेटर एक्सप्लोर करें।' },
      { label: 'कानूनी अस्वीकरण (Disclaimer)', url: '/disclaimer', description: 'कैलकुलेटर अनुमानों और गैर-संबद्धता की जानकारी पढ़ें।' },
      { label: 'गोपनीयता नीति (Privacy Policy)', url: '/privacy-policy', description: 'जानें कि हम बिना डेटा स्टोर किए आपकी गोपनीयता कैसे सुरक्षित रखते हैं।' },
      { label: 'उपयोग की शर्तें (Terms of Service)', url: '/terms', description: 'वेबसाइट उपयोग के नियम और शर्तें पढ़ें।' }
    ]
  },
  mr: {
    seoTitle: 'आमच्याबद्दल (About Us) | LIC Calculators',
    metaDescription: 'lic-calculators.com बद्दल जाणून घ्या. आमचे स्वतंत्र मिशन, अचूक गणितीय सूत्रे आणि संपादकीय पारदर्शकता.',
    h1: 'आमच्याबद्दल (About LIC Calculators)',
    subtitle: 'भारतीय पॉलिसीधारकांसाठी पारदर्शक, स्वतंत्र आणि अचूक वित्तीय कॅल्क्युलेटर व्यासपीठ.',
    missionHeading: 'आमचे ध्येय आणि स्वातंत्र्य',
    missionText: 'lic-calculators.com हे पॉलिसीधारकांना त्यांच्या जीवन विमा पॉलिसींचे अचूक आणि निष्पक्ष गणित समजून सांगण्यासाठी तयार केले आहे.',
    bannerNotice: {
      title: 'स्वतंत्र वित्तीय प्लॅटफॉर्म सूचना',
      text: 'lic-calculators.com हे स्वतंत्र शैक्षणिक पोर्टल आहे. हे भारतीय आयुर्विमा महामंडळ (LIC) किंवा कोणत्याही सरकारी संस्थेशी संलग्न किंवा अधिकृत नाही.'
    },
    pillars: [
      {
        title: 'अचूक गणना इंजिन',
        description: 'सर्व आकडेमोड प्रत्यक्ष विमा नियमांवर आधारित आहे.',
        icon: '🧮'
      },
      {
        title: 'विक्रीचा कोणताही दबाव नाही',
        description: 'आम्ही पॉलिसी विकत नाही, केवळ निष्पक्ष माहिती देतो.',
        icon: '⚖️'
      },
      {
        title: 'डेटा गोपनीयता',
        description: 'आपला कोणताही वैयक्तिक डेटा सर्व्हरवर साठवला जात नाही.',
        icon: '🔒'
      },
      {
        title: 'बहुभाषिक उपलब्धता',
        description: 'महाराष्ट्रातील नागरिकांसाठी मराठीत पूर्णपणे उपलब्ध.',
        icon: '🌐'
      }
    ],
    sections: [
      {
        title: '१. आम्ही काय करतो',
        paragraphs: [
          'आम्ही सरेंडर व्हॅल्यू, मॅच्युरिटी, लोन आणि पेन्शनसाठी १६ स्वतंत्र कॅल्क्युलेटर उपलब्ध करून देतो.'
        ]
      },
      {
        title: '२. पारदर्शकता आणि मर्यादा',
        paragraphs: [
          'सर्व आकडेमोड गणितीय अंदाज आहेत. अधिकृत अंतिम मूल्यासाठी LIC च्या शाखेशी संपर्क साधावा.'
        ]
      }
    ],
    editorialHeading: 'संपादकीय कार्यपद्धती',
    editorialSubtext: 'आमची माहिती विमा तज्ज्ञांद्वारे तपासली जाते.',
    relatedLinksHeading: 'संबंधित संसाधने',
    relatedLinks: [
      { label: 'सर्व कॅल्क्युलेटर', url: '/calculators', description: 'आमचे सर्व १६ कॅल्क्युलेटर एक्सप्लोर करा.' },
      { label: 'कायदेशीर अस्वीकरण (Disclaimer)', url: '/disclaimer', description: 'अस्वीकरण आणि मर्यादा वाचा.' },
      { label: 'गोपनीयता धोरण (Privacy Policy)', url: '/privacy-policy', description: 'डेटा सुरक्षा धोरण जाणून घ्या.' },
      { label: 'वापराच्या अटी (Terms of Service)', url: '/terms', description: 'वापराच्या अटी वाचा.' }
    ]
  },
  gu: {
    seoTitle: 'અમારા વિશે (About Us) | LIC Calculators',
    metaDescription: 'lic-calculators.com વિશે જાણો. અમારું સ્વતંત્ર મિશન, ગાણિતિક સૂત્રો અને પારદર્શક નીતિઓ.',
    h1: 'અમારા વિશે (About LIC Calculators)',
    subtitle: 'પોલિસીધારકો માટે સ્વતંત્ર, પારદર્શક અને સચોટ નાણાકીય કેલ્ક્યુલેટર પ્લેટફોર્મ.',
    missionHeading: 'અમારું મિશન અને સ્વતંત્રતા',
    missionText: 'lic-calculators.com ભારતીય પોલિસીધારકોને જીવન વીમા ગણતરીઓ સરળતાથી સમજાવવા માટે બનાવવામાં આવ્યું છે.',
    bannerNotice: {
      title: 'સ્વતંત્ર નાણાકીય પ્લેટફોર્મ સૂચના',
      text: 'lic-calculators.com એ એક સ્વતંત્ર શૈક્ષણિક પોર્ટલ છે. તે લાઈફ ઈન્સ્યોરન્સ કોર્પોરેશન ઓફ ઈન્ડિયા (LIC) સાથે જોડાયેલ નથી.'
    },
    pillars: [
      {
        title: 'સચોટ ગણતરી એન્જિન',
        description: 'તમામ ગણતરીઓ વાસ્તવિક વીમા નિયમો પર આધારિત છે.',
        icon: '🧮'
      },
      {
        title: 'વેચાણ પક્ષપાત વિના',
        description: 'અમે વીમા પોલિસી વેચતા નથી, માત્ર પારદર્શક માહિતી આપીએ છીએ.',
        icon: '⚖️'
      },
      {
        title: 'ડેટા ગોપનીયતા',
        description: 'તમારો કોઈપણ અંગત ડેટા સર્વર પર સંગ્રહિત થતો નથી.',
        icon: '🔒'
      },
      {
        title: 'બહુભાષી સુવિધા',
        description: 'ગુજરાતી સહિત ભારતની ૭ મુખ્ય ભાષાઓમાં ઉપલબ્ધ.',
        icon: '🌐'
      }
    ],
    sections: [
      {
        title: '૧. અમે શું કરીએ છીએ',
        paragraphs: [
          'અમે સરન્ડર વેલ્યુ, મેચ્યોરિટી, લોન અને પેન્શન માટે ૧૬ સ્વતંત્ર કેલ્ક્યુલેટર પ્રદાન કરીએ છીએ.'
        ]
      },
      {
        title: '૨. પારદર્શિતા અને મર્યાદાઓ',
        paragraphs: [
          'બધા પરિણામો ગાણિતિક અંદાજ છે. સત્તાવાર મૂલ્ય માટે LIC નો સંપર્ક કરવો.'
        ]
      }
    ],
    editorialHeading: 'સંપાદકીય ધોરણો',
    editorialSubtext: 'અમારી સામગ્રી નાણાકીય નિષ્ણાતો દ્વારા ચકાસાયેલ છે.',
    relatedLinksHeading: 'સંબંધિત કાનૂની સંસાધનો',
    relatedLinks: [
      { label: 'બધા કેલ્ક્યુલેટર', url: '/calculators', description: 'તમામ ૧૬ કેલ્ક્યુલેટર જુઓ.' },
      { label: 'કાનૂની અસ્વીકરણ (Disclaimer)', url: '/disclaimer', description: 'અંદાજો અને જવાબદારીની મર્યાદાઓ.' },
      { label: 'ગોપનીયતા નીતિ (Privacy Policy)', url: '/privacy-policy', description: 'ડેટા સુરક્ષા નીતિ જુઓ.' },
      { label: 'ઉપયોગની શરતો (Terms of Service)', url: '/terms', description: 'વેબસાઇટના નિયમો અને શરતો.' }
    ]
  },
  bn: {
    seoTitle: 'আমাদের সম্পর্কে (About Us) | LIC Calculators',
    metaDescription: 'lic-calculators.com সম্পর্কে জানুন। আমাদের স্বাধীন লক্ষ্য, গাণিতিক সূত্র ও সম্পাদকীয় পর্যালোচনা প্রক্রিয়া।',
    h1: 'আমাদের সম্পর্কে (About LIC Calculators)',
    subtitle: 'ভারতীয় পলিসিধারকদের জন্য স্বাধীন, স্বচ্ছ এবং নির্ভরযোগ্য আর্থিক ক্যালকুলেটর প্ল্যাটফর্ম।',
    missionHeading: 'আমাদের মিশন ও স্বাধীনতা',
    missionText: 'lic-calculators.com তৈরি করা হয়েছে পলিসিধারকদের জীবন বীমার জটিল হিসাব সহজে এবং নির্ভুলভাবে বুঝতে সাহায্য করার জন্য।',
    bannerNotice: {
      title: 'স্বাধীন আর্থিক প্ল্যাটফর্ম বিজ্ঞপ্তি',
      text: 'lic-calculators.com একটি স্বাধীন শিক্ষামূলক পোর্টাল। এটি লাইফ ইন্স্যুরেন্স কর্পোরেশন অব ইন্ডিয়া (LIC) এর সাথে সম্পর্কিত নয়।'
    },
    pillars: [
      {
        title: 'নির্ভরযোগ্য গণনা ইঞ্জিন',
        description: 'সকল হিসাব প্রকৃত বীমা নিয়ম এবং ঐতিহাসিক বোনাস হারের উপর ভিত্তি করে নির্মিত।',
        icon: '🧮'
      },
      {
        title: 'বিক্রয় চাপহীন নিরপেক্ষ তথ্য',
        description: 'আমরা কোনো পলিসি বিক্রি করি না, কেবলমাত্র সঠিক আর্থিক স্পষ্টতা প্রদান করি।',
        icon: '⚖️'
      },
      {
        title: 'তথ্য গোপনীয়তা',
        description: 'আপনার পলিসি নম্বর বা ব্যক্তিগত তথ্য সার্ভারে সংরক্ষিত হয় না।',
        icon: '🔒'
      },
      {
        title: 'বহুভাষিক অ্যাক্সেসিবিলিটি',
        description: 'বাংলা সহ ভারতের ৭টি প্রধান ভাষায় সম্পূর্ণ উপলব্ধ।',
        icon: '🌐'
      }
    ],
    sections: [
      {
        title: '১. আমরা যা করি',
        paragraphs: [
          'আমরা সারেন্ডার ভ্যালু, ম্যাচিউরিটি, লোন এবং পেনশনের জন্য ১৬টি স্বাধীন ক্যালকুলেটর প্রদান করি।'
        ]
      },
      {
        title: '২. স্বচ্ছতা ও সীমাবদ্ধতা',
        paragraphs: [
          'সকল ফলাফল গাণিতিক অনুমান মাত্র। অফিসিয়াল তথ্যের জন্য LIC শাখায় যোগাযোগ করুন।'
        ]
      }
    ],
    editorialHeading: 'সম্পাদকীয় পর্যালোচনা',
    editorialSubtext: 'আমাদের তথ্য বীমা ও আর্থিক বিশেষজ্ঞদের দ্বারা যাচাইকৃত।',
    relatedLinksHeading: 'সম্পর্কিত আইনি তথ্য',
    relatedLinks: [
      { label: 'সকল ক্যালকুলেটর', url: '/calculators', description: 'আমাদের ১৬টি বীমা ক্যালকুলেটর দেখুন।' },
      { label: 'দাবিত্যাগ (Disclaimer)', url: '/disclaimer', description: 'ক্যালকুলেটর সীমাবদ্ধতা ও দাবিত্যাগ দেখুন।' },
      { label: 'গোপনীয়তা নীতি (Privacy Policy)', url: '/privacy-policy', description: 'আমরা কীভাবে ডেটা সুরক্ষিত রাখি তা জানুন।' },
      { label: 'ব্যবহারের শর্তাবলী (Terms of Service)', url: '/terms', description: 'ব্যবহারের নিয়মাবলী পড়ুন।' }
    ]
  },
  ta: {
    seoTitle: 'எங்களைப் பற்றி (About Us) | LIC Calculators',
    metaDescription: 'lic-calculators.com பற்றி அறியவும். எங்கள் சுயாதீன நோக்கம், கணித சூத்திரங்கள் மற்றும் தலையங்க வெளிப்படைத்தன்மை.',
    h1: 'எங்களைப் பற்றி (About LIC Calculators)',
    subtitle: 'பாலிசிதாரர்களுக்கான சுயாதீன, வெளிப்படையான மற்றும் துல்லியமான நிதி கால்குலேட்டர் தளம்.',
    missionHeading: 'எங்கள் நோக்கம் மற்றும் சுதந்திரம்',
    missionText: 'பாலிசிதாரர்கள் தங்கள் ஆயுள் காப்பீட்டின் உண்மையான மதிப்பை எளிதாகப் புரிந்துகொள்ள lic-calculators.com உருவாக்கப்பட்டது.',
    bannerNotice: {
      title: 'சுயாதீன நிதி தள அறிவிப்பு',
      text: 'lic-calculators.com என்பது ஒரு சுயாதீனமான கல்வி தளமாகும். இது LIC உடன் இணைக்கப்படவில்லை.'
    },
    pillars: [
      {
        title: 'துல்லியமான கணக்கீட்டு இயந்திரம்',
        description: 'அனைத்து கணக்கீடுகளும் உண்மையான காப்பீட்டு விதிகளின் அடிப்படையில் இயங்குகின்றன.',
        icon: '🧮'
      },
      {
        title: 'விற்பனை சார்பற்றது',
        description: 'நாங்கள் பாலிசிகளை விற்பனை செய்வதில்லை, துல்லியமான தகவல்களை மட்டுமே வழங்குகிறோம்.',
        icon: '⚖️'
      },
      {
        title: 'தரவு பாதுகாப்பு',
        description: 'தனிப்பட்ட பாலிசி விவரங்கள் சேமிக்கப்படுவதில்லை.',
        icon: '🔒'
      },
      {
        title: 'பன்மொழி வசதி',
        description: 'தமிழ் உட்பட 7 இந்திய மொழிகளில் கிடைக்கிறது.',
        icon: '🌐'
      }
    ],
    sections: [
      {
        title: '1. எங்கள் சேவைகள்',
        paragraphs: [
          'நாங்கள் சரண்டர் மதிப்பு, முதிர்வு, கடன் மற்றும் ஓய்வூதியத்திற்கான 16 கால்குலேட்டர்களை வழங்குகிறோம்.'
        ]
      },
      {
        title: '2. வெளிப்படைத்தன்மை மற்றும் வரம்புகள்',
        paragraphs: [
          'முடிவுகள் கணித தோராய மதிப்பீடுகளே. துல்லியமான தகவல்களுக்கு LIC கிளையை அணுகவும்.'
        ]
      }
    ],
    editorialHeading: 'தலையங்க மதிப்பாய்வு',
    editorialSubtext: 'எங்கள் உள்ளடக்கம் நிதி நிபுணர்களால் மதிப்பாய்வு செய்யப்படுகிறது.',
    relatedLinksHeading: 'தொடர்புடைய சட்ட வளங்கள்',
    relatedLinks: [
      { label: 'அனைத்து கால்குலேட்டர்கள்', url: '/calculators', description: 'எங்கள் 16 கால்குலேட்டர்களை ஆராயுங்கள்.' },
      { label: 'பொறுப்புத் துறப்பு (Disclaimer)', url: '/disclaimer', description: 'மதிப்பீட்டு வரம்புகள் மற்றும் பொறுப்புத் துறப்பு.' },
      { label: 'தனியுரிமைக் கொள்கை (Privacy Policy)', url: '/privacy-policy', description: 'தரவு பாதுகாப்பு நடைமுறைகளைப் பார்க்கவும்.' },
      { label: 'பயன்பாட்டு விதிமுறைகள் (Terms of Service)', url: '/terms', description: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்.' }
    ]
  },
  te: {
    seoTitle: 'మా గురించి (About Us) | LIC Calculators',
    metaDescription: 'lic-calculators.com గురించి తెలుసుకోండి. మా స్వతంత్ర లక్ష్యం, గణిత సూత్రాలు మరియు సంపాదకీయ పారదర్శకత.',
    h1: 'మా గురించి (About LIC Calculators)',
    subtitle: 'పాలసీదారుల కోసం స్వతంత్ర, పారదర్శక మరియు ఖచ్చితమైన ఆర్థిక కాలిక్యులేటర్ ప్లాట్‌ఫారమ్.',
    missionHeading: 'మా లక్ష్యం మరియు స్వతంత్రత',
    missionText: 'పాలసీదారులు తమ జీవిత బీమా పాలసీల విలువను సులభంగా అర్థం చేసుకోవడానికి lic-calculators.com రూపొందించబడింది.',
    bannerNotice: {
      title: 'స్వతంత్ర ఆర్థిక ప్లాట్‌ఫారమ్ నోటీసు',
      text: 'lic-calculators.com అనేది స్వతంత్ర విద్యా పోర్టల్. ఇది LIC తో అనుబంధించబడలేదు.'
    },
    pillars: [
      {
        title: 'ఖచ్చితమైన గణన ఇంజిన్',
        description: 'అన్ని గణనలు నిజమైన బీమా నిబంధనలపై ఆధారపడి ఉంటాయి.',
        icon: '🧮'
      },
      {
        title: 'అమ్మకాల ఒత్తిడి లేని సమాచారం',
        description: 'మేము పాలసీలను విక్రయించము, కేవలం నిష్పాక్షిక సమాచారాన్ని అందిస్తాము.',
        icon: '⚖️'
      },
      {
        title: 'డేటా గోప్యత',
        description: 'వ్యక్తిగత పాలసీ వివరాలు సర్వర్‌లో నిల్వ చేయబడవు.',
        icon: '🔒'
      },
      {
        title: 'బహుభాషా సౌలభ్యం',
        description: 'తెలుగుతో సహా 7 భారతీయ భాషల్లో అందుబాటులో ఉంది.',
        icon: '🌐'
      }
    ],
    sections: [
      {
        title: '1. మేము ఏమి చేస్తాము',
        paragraphs: [
          'మేము సరెండర్ విలువ, మెచ్యూరిటీ, లోన్ మరియు పెన్షన్ కోసం 16 కాలిక్యులేటర్లను అందిస్తున్నాము.'
        ]
      },
      {
        title: '2. పారదర్శకత మరియు పరిమితులు',
        paragraphs: [
          'ఫలితాలు గణిత అంచనాలు మాత్రమే. అధికారిక విలువల కోసం LIC శాఖను సంప్రదించండి.'
        ]
      }
    ],
    editorialHeading: 'సంపాదకీయ సమీక్ష ప్రక్రియ',
    editorialSubtext: 'మా కంటెంట్ ఆర్థిక నిపుణులచే ధృవీకరించబడింది.',
    relatedLinksHeading: 'సంబంధిత చట్టపరమైన వనరులు',
    relatedLinks: [
      { label: 'అన్ని కాలిక్యులేటర్లు', url: '/calculators', description: 'మా 16 కాలిక్యులేటర్లను చూడండి.' },
      { label: 'డిస్క్లైమర్ (Disclaimer)', url: '/disclaimer', description: 'అంచనాలు మరియు బాధ్యత పరిమితులు.' },
      { label: 'గోప్యతా విధానం (Privacy Policy)', url: '/privacy-policy', description: 'డేటా భద్రత గురించి తెలుసుకోండి.' },
      { label: 'వినియోగ నిబంధనలు (Terms of Service)', url: '/terms', description: 'వినియోగ నిబంధనలను చదవండి.' }
    ]
  }
};

export function getAboutContent(locale: Locale): AboutPageData {
  return ABOUT_CONTENT[locale] || ABOUT_CONTENT.en;
}
