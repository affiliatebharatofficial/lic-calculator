import type { Locale } from '@/types/i18n';

export interface TermsSection {
  title: string;
  paragraphs: string[];
  listItems?: string[];
  alert?: {
    type: 'info' | 'warning';
    text: string;
  };
}

export interface TermsPageData {
  seoTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  sections: TermsSection[];
  relatedLinksHeading: string;
  relatedLinks: Array<{ label: string; url: string; description: string }>;
}

export const TERMS_CONTENT: Record<Locale, TermsPageData> = {
  en: {
    seoTitle: 'Terms of Service | LIC Calculators',
    metaDescription: 'Read the official Terms of Service for lic-calculators.com. Governs the terms of use for our independent financial calculators, estimation rules, and platform conduct.',
    h1: 'Terms of Service',
    subtitle: 'Legal agreement governing your access, acceptable use, and estimation terms on our independent calculation platform.',
    lastUpdatedLabel: 'Last Updated',
    lastUpdatedDate: 'August 2026',
    sections: [
      {
        title: '1. Acceptance of Terms',
        paragraphs: [
          'By accessing, browsing, or utilizing any calculation tools, articles, or resources on lic-calculators.com (the "Website" or "Platform"), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service (these "Terms") and our Privacy Policy and Disclaimer.',
          'If you do not agree with any provision of these Terms, you must immediately discontinue your use of the Website.'
        ]
      },
      {
        title: '2. Purpose and Scope of Service',
        paragraphs: [
          'lic-calculators.com provides a comprehensive suite of 16 independent financial calculation engines, comparison matrices, educational guides, and an AI policy explanation assistant.',
          'The Platform is provided exclusively for personal financial planning, educational simulation, and general informational purposes. We do NOT sell insurance policies, collect premium payments on behalf of any insurance corporation, solicit insurance business, or act as an insurance intermediary, broker, corporate agent, or underwriting authority.'
        ]
      },
      {
        title: '3. Independent Platform & Trademark Notice',
        paragraphs: [
          'lic-calculators.com is an independent financial technology resource and is NOT affiliated with, authorized by, sponsored by, or endorsed by Life Insurance Corporation of India (LIC), the Government of India, or the Insurance Regulatory and Development Authority of India (IRDAI).',
          'All registered trademarks, plan names, and logos (including "LIC", "Life Insurance Corporation of India", "Jeevan Labh", "Jeevan Umang", "New Jeevan Anand") remain the exclusive property of their respective statutory owners. Any use on this platform is solely for descriptive, identification, and nominative fair use.'
        ],
        alert: {
          type: 'warning',
          text: 'Do not enter official account passwords or payment OTPs on any third-party website. For official policy servicing, always use licindia.in.'
        }
      },
      {
        title: '4. Nature of Calculator Results & Estimation Limitations',
        paragraphs: [
          'All calculation outputs—including Guaranteed Surrender Values (GSV), Special Surrender Values (SSV), loan eligibility figures, paid-up sums assured, and maturity projections—are mathematical estimates.',
          'Estimates are derived from public actuarial formulas, standard surrender value factors, and historical bonus declarations published in LIC annual valuation reports. Actual policy surrender values and maturity proceeds are determined solely by Life Insurance Corporation of India upon official policy processing and may vary based on exact policy dates, tax regulations, and future bonus declarations.'
        ],
        listItems: [
          'Outputs are mathematical approximations, not real-time ledger balance queries.',
          'Calculations exclude unpaid policy loans, interest liens, or penalties unless manually entered by the user.',
          'In any conflict between calculator estimates and official LIC status reports, official LIC documentation always supersedes.'
        ]
      },
      {
        title: '5. No Professional Financial or Insurance Advice',
        paragraphs: [
          'The insights, computations, and guides provided on this Website are of a general informational nature and do not take into account the personal financial objectives, tax situations, or risk tolerances of any individual user.',
          'Nothing on this Website constitutes individualized financial, legal, tax, investment, or actuarial advice. You should always consult a licensed insurance professional, chartered accountant (CA), or certified financial planner before surrendering a policy or altering your financial plans.'
        ],
        alert: {
          type: 'info',
          text: 'Never make irreversible insurance decisions (such as policy surrender or lapse) solely based on online estimates.'
        }
      },
      {
        title: '6. User Responsibilities & Acceptable Conduct',
        paragraphs: [
          'When accessing and using our Platform, you agree to:',
          'You are solely responsible for verifying that your use of the Platform complies with all applicable local, national, and international laws.'
        ],
        listItems: [
          'Provide accurate numerical inputs (policy commencement dates, premium amounts, policy terms) for meaningful calculations.',
          'Review the specific terms, conditions, and exclusion schedules in your original LIC Policy Bond.',
          'Use the calculators in a lawful manner and respect the platform infrastructure.'
        ]
      },
      {
        title: '7. Prohibited Uses of the Platform',
        paragraphs: [
          'You expressly agree NOT to engage in any of the following prohibited activities:'
        ],
        listItems: [
          'Deploying automated scrapers, bots, spiders, or crawlers that generate unreasonable load or harvest proprietary calculation algorithms.',
          'Attempting to probe, scan, or breach the security or authentication measures of our Cloudflare edge infrastructure or API endpoints.',
          'Flooding or abusing calculation APIs (/api/calculators/*) with excessive rate-limit-triggering requests.',
          'Transmitting any viruses, malware, worms, or malicious code designed to disrupt or compromise website operations.',
          'Impersonating any person or falsely claiming official affiliation with LIC or our editorial team.'
        ]
      },
      {
        title: '8. Intellectual Property Rights',
        paragraphs: [
          'All software code, custom mathematical algorithms, interactive calculator interfaces, visual design elements, typography, educational articles, and branding associated with lic-calculators.com are the intellectual property of the Website operators and are protected by applicable copyright and intellectual property laws.',
          'You may use the calculators for personal, non-commercial purposes. You may not reproduce, duplicate, copy, sell, reverse engineer, or redistribute our calculation engines or proprietary software without prior written authorization.'
        ]
      },
      {
        title: '9. Third-Party Services & External Links',
        paragraphs: [
          'Our platform utilizes trusted infrastructure providers (Cloudflare for hosting and security, Google LLC for analytics and AI processing). These external service providers operate under their own independent terms of service and privacy policies.',
          'This Website contains external hyperlinks to third-party domains (such as licindia.in and irdai.gov.in) for informational convenience. We do not control, endorse, or accept responsibility for the content, availability, or accuracy of external websites.'
        ]
      },
      {
        title: '10. Service Availability & Modifications',
        paragraphs: [
          'We provide the Platform on an "as is" and "as available" basis. While we strive to maintain uninterrupted 24/7 uptime, we do not guarantee that the Website will always be error-free, continuous, or devoid of technical interruptions.',
          'We reserve the right to modify, enhance, update, or temporarily suspend any calculator, feature, or database table at any time without prior notice or liability.'
        ]
      },
      {
        title: '11. Disclaimer of Warranties & Limitation of Liability',
        paragraphs: [
          'To the fullest extent permitted by applicable law, the operators of lic-calculators.com disclaim all warranties, express or implied, including warranties of merchantability, accuracy, fitness for a particular purpose, and non-infringement.',
          'Under no circumstances shall the platform operators, authors, or contributors be liable for any direct, indirect, incidental, consequential, special, or exemplary damages—including financial losses, surrender penalties, tax liabilities, or lost investment opportunities—arising out of your access to, use of, or inability to use this Platform.'
        ]
      },
      {
        title: '12. Indemnification',
        paragraphs: [
          'You agree to defend, indemnify, and hold harmless lic-calculators.com and its operators from and against any claims, liabilities, damages, losses, or legal expenses arising out of your breach of these Terms or your unlawful use of the Platform.'
        ]
      },
      {
        title: '13. Termination & Access Restriction',
        paragraphs: [
          'We reserve the right to restrict, rate-limit, or terminate access to the Website or specific API endpoints for any user, automated IP address, or bot network that violates these Terms or threatens server integrity.'
        ]
      },
      {
        title: '14. Updates to Terms & Contact Information',
        paragraphs: [
          'We may revise these Terms of Service periodically to reflect changes in regulatory norms, calculation methodology, or platform features. Any modifications become effective immediately upon posting to this page.',
          'If you have questions regarding these Terms, you may reach out via our Contact Page (/contact) or email us at support@lic-calculators.com.'
        ]
      }
    ],
    relatedLinksHeading: 'Related Legal & Platform Resources',
    relatedLinks: [
      { label: 'Privacy Policy', url: '/privacy-policy/', description: 'Learn how we protect your privacy with zero personal data storage.' },
      { label: 'Legal Disclaimer', url: '/disclaimer/', description: 'Review our non-affiliation notice, calculation estimates, and liability limits.' },
      { label: 'About Our Platform', url: '/about/', description: 'Learn about our editorial team, methodology, and independent mission.' },
      { label: 'Contact Us', url: '/contact/', description: 'Reach out to our technical support team for inquiries or feedback.' }
    ]
  },
  hi: {
    seoTitle: 'उपयोग की शर्तें (Terms of Service) | LIC Calculators',
    metaDescription: 'lic-calculators.com की उपयोग की शर्तें पढ़ें। स्वतंत्र कैलकुलेटर टूल्स, अनुमानों की सीमाएं, बौद्धिक संपदा और उपयोगकर्ता आचार संहिता के नियम।',
    h1: 'उपयोग की शर्तें (Terms of Service)',
    subtitle: 'हमारे स्वतंत्र वित्तीय गणना प्लेटफॉर्म के उपयोग और कानूनी नियमों का विवरण।',
    lastUpdatedLabel: 'अंतिम अद्यतन',
    lastUpdatedDate: 'अगस्त 2026',
    sections: [
      {
        title: '1. शर्तों की स्वीकृति',
        paragraphs: [
          'lic-calculators.com का उपयोग करके, आप इन उपयोग की शर्तों (Terms of Service), हमारी गोपनीयता नीति और कानूनी अस्वीकरण को स्वीकार करते हैं।',
          'यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।'
        ]
      },
      {
        title: '2. सेवा का उद्देश्य और कार्यक्षेत्र',
        paragraphs: [
          'यह वेबसाइट 16 स्वतंत्र वित्तीय कैलकुलेटर, तुलनात्मक चार्ट और शैक्षणिक गाइड प्रदान करती है।',
          'यह प्लेटफॉर्म केवल व्यक्तिगत वित्तीय योजना और शैक्षणिक जानकारी के लिए है। हम बीमा पॉलिसी नहीं बेचते हैं और न ही किसी बीमा एजेंसी के रूप में कार्य करते हैं।'
        ]
      },
      {
        title: '3. स्वतंत्र प्लेटफॉर्म और ट्रेडमार्क सूचना',
        paragraphs: [
          'lic-calculators.com एक स्वतंत्र निजी पहल है और यह भारतीय जीवन बीमा निगम (LIC) या IRDAI से संबद्ध या अधिकृत नहीं है।',
          '"LIC" और योजनाओं के नाम उनके संबंधित स्वामियों के ट्रेडमार्क हैं। इनका उपयोग केवल पहचान और संदर्भ (Nominative Fair Use) के लिए किया गया है।'
        ],
        alert: {
          type: 'warning',
          text: 'अपनी पॉलिसी का पासवर्ड या भुगतान OTP किसी भी अनधिकृत वेबसाइट पर न डालें। आधिकारिक सेवाओं के लिए licindia.in का उपयोग करें।'
        }
      },
      {
        title: '4. कैलकुलेटर परिणामों का स्वरूप और सीमाएं',
        paragraphs: [
          'सभी परिणाम, सरेंडर वैल्यू और मैच्युरिटी राशियां गणितीय अनुमान हैं। वास्तविक मूल्य पॉलिसी के मूल बॉन्ड और LIC के आधिकारिक नियमों पर निर्भर करते हैं।'
        ],
        listItems: [
          'परिणाम गणितीय सूत्रों पर आधारित हैं, वास्तविक लेजर बैलेंस नहीं।',
          'गणना में बकाया लोन या ब्याज शामिल नहीं होता जब तक उपयोगकर्ता स्वयं दर्ज न करे।',
          'हमारी गणना और LIC के आधिकारिक रिकॉर्ड में अंतर होने पर LIC का आधिकारिक रिकॉर्ड ही मान्य होगा।'
        ]
      },
      {
        title: '5. वित्तीय सलाह का अभाव',
        paragraphs: [
          'वेबसाइट की सामग्री सामान्य जानकारी के लिए है। यह व्यक्तिगत वित्तीय, कर या कानूनी सलाह नहीं है। कोई भी बड़ा निर्णय लेने से पहले अधिकृत सलाहकार से परामर्श लें।'
        ]
      },
      {
        title: '6. उपयोगकर्ता की जिम्मेदारियां और आचार संहिता',
        paragraphs: [
          'उपयोगकर्ता सही डेटा दर्ज करने और अपनी मूल पॉलिसी बॉन्ड की शर्तों की जांच करने के लिए जिम्मेदार हैं।'
        ]
      },
      {
        title: '7. प्रतिबंधित गतिविधियां',
        paragraphs: [
          'वेबसाइट पर अत्यधिक बॉट ट्रैफिक, अनधिकृत डेटा स्क्रैपिंग, सुरक्षा में सेंध लगाने का प्रयास या API का दुरुपयोग पूरी तरह प्रतिबंधित है।'
        ]
      },
      {
        title: '8. बौद्धिक संपदा अधिकार',
        paragraphs: [
          'वेबसाइट का कोड, डिजाइन, लेख और एल्गोरिदम lic-calculators.com की बौद्धिक संपदा हैं। बिना लिखित अनुमति के इसका व्यावसायिक पुनरुत्पादन प्रतिबंधित है।'
        ]
      },
      {
        title: '9. दायित्व की सीमा और बदलाव',
        paragraphs: [
          'वेबसाइट "जैसी है" (As-Is) आधार पर उपलब्ध कराई गई है। अनुमानों के आधार पर हुए किसी भी वित्तीय नुकसान के लिए प्लेटफॉर्म उत्तरदायी नहीं होगा।'
        ]
      },
      {
        title: '10. संपर्क और त्रुटि निवारण',
        paragraphs: [
          'शर्तों या गणना में सुधार के लिए आप हमारे संपर्क पेज (/contact) या support@lic-calculators.com पर संपर्क कर सकते हैं।'
        ]
      }
    ],
    relatedLinksHeading: 'संबंधित कानूनी व नीतिगत संसाधन',
    relatedLinks: [
      { label: 'गोपनीयता नीति (Privacy Policy)', url: '/privacy-policy/', description: 'जानें कि हम आपकी गोपनीयता की रक्षा कैसे करते हैं।' },
      { label: 'कानूनी अस्वीकरण (Disclaimer)', url: '/disclaimer/', description: 'कैलकुलेटर अनुमानों और गैर-संबद्धता की पूरी जानकारी।' },
      { label: 'हमारे बारे में (About Us)', url: '/about/', description: 'हमारी संपादकीय टीम और स्वतंत्र मिशन के बारे में जानें।' },
      { label: 'संपर्क करें (Contact Us)', url: '/contact/', description: 'तकनीकी सहायता या प्रतिक्रिया के लिए संपर्क करें।' }
    ]
  },
  mr: {
    seoTitle: 'वापराच्या अटी (Terms of Service) | LIC Calculators',
    metaDescription: 'lic-calculators.com च्या वापराच्या अटी वाचा. स्वतंत्र वित्तीय कॅल्क्युलेटर, अंदाजांच्या मर्यादा आणि नियमांची माहिती.',
    h1: 'वापराच्या अटी (Terms of Service)',
    subtitle: 'आमच्या स्वतंत्र वित्तीय कॅल्क्युलेटर प्लॅटफॉर्म वापराचे नियम आणि कायदेशीर अटी.',
    lastUpdatedLabel: 'अंतिम अद्यतन',
    lastUpdatedDate: 'ऑगस्ट २०२६',
    sections: [
      {
        title: '१. अटींची स्वीकृती',
        paragraphs: [
          'या संकेतस्थळाचा वापर करून आपण या वापराच्या अटी, गोपनीयता धोरण आणि अस्वीकरण स्वीकारता.',
          'अटी मान्य नसल्यास कृपया संकेतस्थळाचा वापर करू नये.'
        ]
      },
      {
        title: '२. सेवेचे स्वरूप आणि गैर-संलग्नता',
        paragraphs: [
          'हे व्यासपीठ केवळ शैक्षणिक आणि वैयक्तिक नियोजनासाठी आहे. आम्ही विमा विकत नाही किंवा LIC चे अधिकृत प्रतिनिधी नाही.',
          '"LIC" आणि योजनांची नावे त्यांच्या मूळ मालकांची संपत्ती आहेत.'
        ]
      },
      {
        title: '३. अंदाजांचे स्वरूप आणि मर्यादा',
        paragraphs: [
          'सर्व आकडेमोड गणितीय अंदाज आहेत. प्रत्यक्ष आकडे LIC च्या अधिकृत शाखा नोंदींवर अवलंबून असतात.'
        ]
      },
      {
        title: '४. प्रतिबंधित वापर आणि बौद्धिक संपदा',
        paragraphs: [
          'अनधिकृत स्क्रॅपिंग, बॉट्स आणि सिस्टीमचा गैरवापर करण्यास सक्त मनाई आहे. वेबसाइटची सामग्री व कोड कॉपीराइट संरक्षित आहे.'
        ]
      },
      {
        title: '५. संपर्क',
        paragraphs: [
          'काही प्रश्न असल्यास support@lic-calculators.com वर संपर्क साधावा.'
        ]
      }
    ],
    relatedLinksHeading: 'संबंधित कायदेशीर संसाधने',
    relatedLinks: [
      { label: 'गोपनीयता धोरण (Privacy Policy)', url: '/privacy-policy/', description: 'आम्ही डेटा कसा सुरक्षित ठेवतो ते जाणून घ्या.' },
      { label: 'कायदेशीर अस्वीकरण (Disclaimer)', url: '/disclaimer/', description: 'अंदाजांच्या मर्यादा आणि अस्वीकरण वाचा.' },
      { label: 'आमच्याबद्दल (About Us)', url: '/about/', description: 'आमच्या मिशनबद्दल जाणून घ्या.' },
      { label: 'संपर्क (Contact Us)', url: '/contact/', description: 'आमच्याशी संपर्क साधा.' }
    ]
  },
  gu: {
    seoTitle: 'ઉપયોગની શરતો (Terms of Service) | LIC Calculators',
    metaDescription: 'lic-calculators.com ની ઉપયોગની શરતો વાંચો. સ્વતંત્ર કેલ્ક્યુલેટર ટૂલ્સ, અંદાજોની મર્યાદાઓ અને ઉપયોગના નિયમો.',
    h1: 'ઉપયોગની શરતો (Terms of Service)',
    subtitle: 'અમારા સ્વતંત્ર નાણાકીય કેલ્ક્યુલેટર પ્લેટફોર્મના ઉપયોગ સંબંધિત કાનૂની નિયમો.',
    lastUpdatedLabel: 'છેલ્લું અપડેટ',
    lastUpdatedDate: 'ઓગસ્ટ ૨૦૨૬',
    sections: [
      {
        title: '૧. શરતોનો સ્વીકાર',
        paragraphs: [
          'આ વેબસાઇટનો ઉપયોગ કરીને તમે આ ઉપયોગની શરતો, ગોપનીયતા નીતિ અને અસ્વીકરણ સ્વીકારો છો.'
        ]
      },
      {
        title: '૨. સેવાનો હેતુ અને બિન-સંલગ્નતા',
        paragraphs: [
          'આ પ્લેટફોર્મ શૈક્ષણિક અને માહિતી હેતુ માટે છે. અમે વીમા પોલિસી વેચતા નથી કે LIC ના પ્રતિનિધિ નથી.',
          '"LIC" અને યોજનાઓના નામ તેમના મૂળ માલિકોની સંપત્તિ છે.'
        ]
      },
      {
        title: '૩. કેલ્ક્યુલેટર અંદાજોની મર્યાદાઓ',
        paragraphs: [
          'બધા પરિણામો ગાણિતિક અંદાજ છે. સત્તાવાર ચોક્કસ મૂલ્ય માટે LIC નો સંપર્ક કરવો.'
        ]
      },
      {
        title: '૪. પ્રતિબંધિત ઉપયોગ અને સંપર્ક',
        paragraphs: [
          'અનધિકૃત સ્ક્રેપિંગ કે સિસ્ટમનો દુરુપયોગ પ્રતિબંધિત છે. કોઈપણ પ્રશ્ન માટે support@lic-calculators.com પર સંપર્ક કરો.'
        ]
      }
    ],
    relatedLinksHeading: 'સંબંધિત કાનૂની સંસાધનો',
    relatedLinks: [
      { label: 'ગોપનીયતા નીતિ (Privacy Policy)', url: '/privacy-policy/', description: 'ડેટા સુરક્ષા નીતિ જુઓ.' },
      { label: 'કાનૂની અસ્વીકરણ (Disclaimer)', url: '/disclaimer/', description: 'અંદાજો અને જવાબદારીની મર્યાદાઓ.' },
      { label: 'અમારા વિશે (About Us)', url: '/about/', description: 'અમારા મિશન વિશે જાણો.' },
      { label: 'સંપર્ક કરો (Contact Us)', url: '/contact/', description: 'અમારો સંપર્ક કરો.' }
    ]
  },
  bn: {
    seoTitle: 'ব্যবহারের শর্তাবলী (Terms of Service) | LIC Calculators',
    metaDescription: 'lic-calculators.com এর ব্যবহারের শর্তাবলী পড়ুন। স্বাধীন বীমা ক্যালকুলেটর ব্যবহারের নিয়ম, মেধা সম্পদ ও আইনি শর্তাবলী।',
    h1: 'ব্যবহারের শর্তাবলী (Terms of Service)',
    subtitle: 'আমাদের স্বাধীন আর্থিক ক্যালকুলেটর প্ল্যাটফর্ম ব্যবহারের নিয়মাবলী ও আইনি চুক্তি।',
    lastUpdatedLabel: 'সর্বশেষ আপডেট',
    lastUpdatedDate: 'আগস্ট ২০২৬',
    sections: [
      {
        title: '১. শর্তাবলীর গ্রহণযোগ্যতা',
        paragraphs: [
          'lic-calculators.com ব্যবহারের মাধ্যমে আপনি এই শর্তাবলী, গোপনীয়তা নীতি এবং দাবিত্যাগ মেনে নিচ্ছেন।'
        ]
      },
      {
        title: '২. সেবার প্রকৃতি ও অ-অনুমোদিততা',
        paragraphs: [
          'এই প্ল্যাটফর্মটি শিক্ষামূলক ও ব্যক্তিগত পরিকল্পনার জন্য। আমরা বীমা বিক্রি করি না বা LIC-এর প্রতিনিধি নই।',
          '"LIC" এবং পলিসির নামসমূহ তাদের সংশ্লিষ্ট মালিকদের ট্রেডমার্ক।'
        ]
      },
      {
        title: '৩. ক্যালকুলেটর অনুমানের সীমাবদ্ধতা',
        paragraphs: [
          'প্রদর্শিত ফলাফল গাণিতিক অনুমান মাত্র। সঠিক আর্থিক তথ্যের জন্য অফিসিয়াল LIC নথিপত্র প্রযোজ্য।'
        ]
      },
      {
        title: '৪. নিষিদ্ধ ব্যবহার ও যোগাযোগ',
        paragraphs: [
          'অননুমোদিত স্ক্র্যাপিং বা সিস্টেমের অপব্যবহার নিষিদ্ধ। যেকোনো তথ্যের জন্য support@lic-calculators.com এ যোগাযোগ করুন।'
        ]
      }
    ],
    relatedLinksHeading: 'সম্পর্কিত আইনি তথ্য',
    relatedLinks: [
      { label: 'গোপনীয়তা নীতি (Privacy Policy)', url: '/privacy-policy/', description: 'আমরা কীভাবে ডেটা সুরক্ষিত রাখি তা জানুন।' },
      { label: 'দাবিত্যাগ (Disclaimer)', url: '/disclaimer/', description: 'ক্যালকুলেটর সীমাবদ্ধতা ও দাবিত্যাগ দেখুন।' },
      { label: 'আমাদের সম্পর্কে (About Us)', url: '/about/', description: 'আমাদের মিশন সম্পর্কে বিস্তারিত জানুন।' },
      { label: 'যোগাযোগ (Contact Us)', url: '/contact/', description: 'আমাদের সাথে যোগাযোগ করুন।' }
    ]
  },
  ta: {
    seoTitle: 'பயன்பாட்டு விதிமுறைகள் (Terms of Service) | LIC Calculators',
    metaDescription: 'lic-calculators.com இன் பயன்பாட்டு விதிமுறைகளைப் படியுங்கள். சுயாதீன நிதி கால்குலேட்டர் கருவிகள் மற்றும் தள பயன்பாட்டு வழிகாட்டுதல்கள்.',
    h1: 'பயன்பாட்டு விதிமுறைகள் (Terms of Service)',
    subtitle: 'எங்கள் சுயாதீன நிதி கால்குலேட்டர் தளத்தைப் பயன்படுத்துவதற்கான சட்டபூர்வ விதிமுறைகள்.',
    lastUpdatedLabel: 'கடைசி புதுப்பிப்பு',
    lastUpdatedDate: 'ஆகஸ்ட் 2026',
    sections: [
      {
        title: '1. விதிமுறைகளை ஏற்றுக்கொள்வது',
        paragraphs: [
          'இந்த தளத்தைப் பயன்படுத்துவதன் மூலம் நீங்கள் இந்த பயன்பாட்டு விதிமுறைகள், தனியுரிமைக் கொள்கை மற்றும் மறுப்புரையை ஏற்றுக்கொள்கிறீர்கள்.'
        ]
      },
      {
        title: '2. தளத்தின் நோக்கம் மற்றும் தொடர்பின்மை',
        paragraphs: [
          'இந்த தளம் கல்வி மற்றும் தகவல் நோக்கங்களுக்காக மட்டுமே. நாங்கள் காப்பீடு விற்பனை செய்வதில்லை அல்லது LIC இன் அதிகாரப்பூர்வ முகவர் அல்ல.',
          '"LIC" மற்றும் திட்டப் பெயர்கள் அவற்றின் உரிமையாளர்களின் சொத்து.'
        ]
      },
      {
        title: '3. மதிப்பீட்டு வரம்புகள்',
        paragraphs: [
          'அனைத்து கணக்கீடுகளும் கணித தோராய மதிப்பீடுகளே. துல்லியமான விவரங்களுக்கு அதிகாரப்பூர்வ LIC கிளையை அணுகவும்.'
        ]
      },
      {
        title: '4. தடைசெய்யப்பட்ட பயன்பாடு மற்றும் தொடர்பு',
        paragraphs: [
          'தளத்தை தவறாகப் பயன்படுத்துதல் மற்றும் தானியங்கி ஸ்கிராப்பிங் தடைசெய்யப்பட்டுள்ளது. தொடர்புக்கு support@lic-calculators.com ஐப் பயன்படுத்தவும்.'
        ]
      }
    ],
    relatedLinksHeading: 'தொடர்புடைய சட்ட வளங்கள்',
    relatedLinks: [
      { label: 'தனியுரிமைக் கொள்கை (Privacy Policy)', url: '/privacy-policy/', description: 'தரவு பாதுகாப்பு நடைமுறைகளைப் பார்க்கவும்.' },
      { label: 'பொறுப்புத் துறப்பு (Disclaimer)', url: '/disclaimer/', description: 'மதிப்பீட்டு வரம்புகள் மற்றும் பொறுப்புத் துறப்பு.' },
      { label: 'எங்களைப் பற்றி (About Us)', url: '/about/', description: 'எங்கள் நோக்கம் மற்றும் குழுவைப் பற்றி அறியவும்.' },
      { label: 'தொடர்பு கொள்ள (Contact Us)', url: '/contact/', description: 'எங்களைத் தொடர்பு கொள்ளவும்.' }
    ]
  },
  te: {
    seoTitle: 'వినియోగ నిబంధనలు (Terms of Service) | LIC Calculators',
    metaDescription: 'lic-calculators.com యొక్క వినియోగ నిబంధనలను చదవండి. స్వతంత్ర ఆర్థిక కాలిక్యులేటర్లు, అంచనాల పరిమితులు మరియు నియమావళి.',
    h1: 'వినియోగ నిబంధనలు (Terms of Service)',
    subtitle: 'మా స్వతంత్ర ఆర్థిక కాలిక్యులేటర్ ప్లాట్‌ఫారమ్ వినియోగానికి సంబంధించిన చట్టపరమైన నిబంధనలు.',
    lastUpdatedLabel: 'చివరి నవీకరణ',
    lastUpdatedDate: 'ఆగస్టు 2026',
    sections: [
      {
        title: '1. నిబంధనల ఆమోదం',
        paragraphs: [
          'ఈ వెబ్‌సైట్‌ను ఉపయోగించడం ద్వారా మీరు ఈ వినియోగ నిబంధనలు, గోప్యతా విధానం మరియు డిస్క్లైమర్‌ను అంగీకరిస్తున్నారు.'
        ]
      },
      {
        title: '2. సేవ యొక్క స్వభావం మరియు అనుబంధం లేని ప్రకటన',
        paragraphs: [
          'ఇది విద్యా మరియు వ్యక్తిగత ప్రణాళిక కోసం మాత్రమే. మేము బీమా పాలసీలను విక్రయించము లేదా LIC యొక్క అధికారిక ప్రతినిధులము కాము.',
          '"LIC" మరియు పాలసీ పేర్లు వాటి యజమానుల ఆస్తి.'
        ]
      },
      {
        title: '3. కాలిక్యులేటర్ అంచనాల పరిమితులు',
        paragraphs: [
          'చూపించబడే ఫలితాలు గణిత అంచనాలు మాత్రమే. అధికారిక ఖచ్చితమైన విలువల కోసం LIC ని సంప్రదించండి.'
        ]
      },
      {
        title: '4. నిషేధిత వినియోగం మరియు సంప్రదింపులు',
        paragraphs: [
          'అనధికారిక స్క్రాపింగ్ లేదా దుర్వినియోగం నిషేధించబడింది. ప్రశ్నల కోసం support@lic-calculators.com ద్వారా సంప్రదించండి.'
        ]
      }
    ],
    relatedLinksHeading: 'సంబంధిత చట్టపరమైన వనరులు',
    relatedLinks: [
      { label: 'గోప్యతా విధానం (Privacy Policy)', url: '/privacy-policy/', description: 'డేటా భద్రత గురించి తెలుసుకోండి.' },
      { label: 'డిస్క్లైమర్ (Disclaimer)', url: '/disclaimer/', description: 'అంచనాలు మరియు బాధ్యత పరిమితులు.' },
      { label: 'మా గురించి (About Us)', url: '/about/', description: 'మా స్వతంత్ర లక్ష్యం గురించి తెలుసుకోండి.' },
      { label: 'సంప్రదించండి (Contact Us)', url: '/contact/', description: 'మా బృందాన్ని సంప్రదించండి.' }
    ]
  }
};

export function getTermsContent(locale: Locale): TermsPageData {
  return TERMS_CONTENT[locale] || TERMS_CONTENT.en;
}
