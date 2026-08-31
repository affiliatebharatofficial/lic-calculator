import type { Locale } from '@/types/i18n';

export interface PrivacyPolicySection {
  title: string;
  paragraphs: string[];
  listItems?: string[];
  alert?: {
    type: 'info' | 'warning';
    text: string;
  };
}

export interface PrivacyPolicyPageData {
  seoTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  sections: PrivacyPolicySection[];
  relatedLinksHeading: string;
  relatedLinks: Array<{ label: string; url: string; description: string }>;
}

export const PRIVACY_POLICY_CONTENT: Record<Locale, PrivacyPolicyPageData> = {
  en: {
    seoTitle: 'Privacy Policy | LIC Calculators',
    metaDescription: 'Understand how lic-calculators.com protects your privacy. Transparent disclosure regarding browser-based calculations, zero PII storage, cookies, and AI features.',
    h1: 'Privacy Policy',
    subtitle: 'Comprehensive disclosure of our data processing, security safeguards, and privacy practices.',
    lastUpdatedLabel: 'Last Updated',
    lastUpdatedDate: 'August 2026',
    sections: [
      {
        title: '1. Introduction and Scope',
        paragraphs: [
          'Welcome to lic-calculators.com ("Website", "Platform", "we", "us", or "our"). We are committed to maintaining the highest standards of user privacy and data transparency.',
          'This Privacy Policy explains how information is handled when you access our calculation engines, educational guides, and AI assistant tools. We operate on a strict principle of data minimization: our calculators run client-side in your web browser or via transient stateless APIs, ensuring that your personal financial planning remains confidential.'
        ]
      },
      {
        title: '2. Calculator Inputs & Local Storage (Zero PII Storage)',
        paragraphs: [
          'When you use any of our 16 financial calculators (such as the Surrender Value Calculator, Maturity Calculator, or Policy Loan Calculator), the values you enter (e.g. sum assured, premium amount, entry age, policy term) are processed directly within your browser or transiently in-memory for calculation.',
          'We do NOT store your policy numbers, full names, dates of birth, PAN numbers, Aadhaar numbers, or banking credentials on any persistent server or database.'
        ],
        listItems: [
          'Browser Local Storage: Our platform uses your browser\'s local storage (localStorage key: lic_calculator_drafts) strictly on your own device to allow you to restore recent calculation parameters without retyping. This data remains on your device and is never sent to our servers.',
          'Stateless API Processing: For advanced multi-scenario calculators (such as the 3-Way Surrender Analysis), calculations are computed transiently in real time and returned immediately to your browser without being saved to a database or linked to any user identity.'
        ],
        alert: {
          type: 'info',
          text: 'You can clear your stored calculation drafts at any time by clearing your browser cache and local storage data.'
        }
      },
      {
        title: '3. AI Policy Assistant Data Processing',
        paragraphs: [
          'Our website includes an optional AI Policy Assistant designed to provide instant educational answers regarding LIC policy rules, surrender factor concepts, and bonus mechanics.',
          'When you interact with the AI assistant, the message you type and the context of the active calculator page (e.g., plan code and calculated metrics) are transmitted via an encrypted HTTPS connection to our configured AI model provider (such as Google Gemini or Cloudflare Workers AI) solely to generate a contextual response.',
          'We do NOT save your chat conversations to any persistent database on lic-calculators.com, nor do we associate AI queries with individual personal identities.'
        ],
        alert: {
          type: 'warning',
          text: 'Please do NOT enter sensitive personal information, policy passwords, or payment OTPs into the AI assistant chat window.'
        }
      },
      {
        title: '4. Analytics and Usage Metrics',
        paragraphs: [
          'To understand website traffic patterns, popular calculator features, and technical performance, we employ privacy-focused analytics methodologies:',
          'We do not engage in cross-site tracking or behavioral profiling across other third-party websites.'
        ],
        listItems: [
          'Google Analytics 4 (G-65LH0P4XCD): We use standard web analytics to measure aggregated page views, general referral sources, device categories (mobile/desktop), and approximate geographic location (country/city level). IP addresses are anonymized.',
          'Privacy-Preserving Event Tracker: Our in-house analytics endpoint (/api/analytics/event) records high-level tool usage (such as page path, calculator ID, and execution duration) in a temporary in-memory buffer. It strictly strips and rejects any forbidden keys including names, emails, policy numbers, or premium figures.'
        ]
      },
      {
        title: '5. Cookies and Technical Tracking',
        paragraphs: [
          'A cookie is a small text file stored on your device by your web browser. We categorize cookies used on our website as follows:'
        ],
        listItems: [
          'Essential Administrative Cookies: An encrypted session cookie (lic_admin_session) is used exclusively for authorized site administrators to access the internal rules and translation console. Regular public calculator visitors do not receive account session cookies.',
          'Analytics Cookies: Google Analytics sets standard performance cookies (_ga, _ga_*) to distinguish unique anonymized visitors and track aggregated metrics.',
          'No Advertising Cookies: We do NOT use third-party advertising cookies, retargeting pixels, or commercial tracking networks.'
        ]
      },
      {
        title: '6. Information You Voluntarily Provide',
        paragraphs: [
          'You may browse and utilize all calculation tools without registering for an account or providing any personal identity details.',
          'If you choose to contact us via our Contact Form (/contact) or submit a data correction request (/contact/correction), you may voluntarily provide your name, email address, and inquiry message. This information is used solely to respond to your inquiry or review your calculation feedback and is never sold or shared with commercial marketers.'
        ]
      },
      {
        title: '7. Infrastructure, Server Logs & Cloudflare Services',
        paragraphs: [
          'Our platform is deployed on Cloudflare global edge infrastructure (Cloudflare Pages, Workers, and D1 serverless database).',
          'When you visit our website, standard web server access logs are temporarily generated by the infrastructure for security, DDoS mitigation, and rate limiting. These technical logs may include your IP address, browser user-agent, operating system, requested URL, and request timestamp. These logs are maintained by Cloudflare in accordance with their enterprise security standards.'
        ]
      },
      {
        title: '8. How Information is Used (Legitimate Purposes)',
        paragraphs: [
          'Any technical or voluntarily provided information is processed exclusively for the following legitimate purposes:'
        ],
        listItems: [
          'Executing financial calculations and rendering instant browser results.',
          'Generating educational responses through the AI Policy Assistant.',
          'Maintaining server security, rate limiting, and preventing automated scraping.',
          'Responding to user-submitted correction requests and technical inquiries.',
          'Analyzing aggregate site performance to enhance calculator speed and mobile responsiveness.'
        ]
      },
      {
        title: '9. Data Sharing and Third-Party Disclosures',
        paragraphs: [
          'We do not sell, rent, trade, or monetize your information under any circumstances. Data is only processed by trusted technical service providers necessary for website operations:'
        ],
        listItems: [
          'Cloudflare (Edge Hosting, CDN, and Security Infrastructure)',
          'Google LLC (Aggregated Web Analytics & AI Model API Processing)',
          'Legal Authorities: We may disclose technical logs only if required by applicable Indian or international law in response to valid court orders or law enforcement subpoenas.'
        ]
      },
      {
        title: '10. Data Retention and Safeguards',
        paragraphs: [
          'Calculator inputs are not retained by our servers after the calculation response is delivered.',
          'In-memory analytics buffers operate on a rolling FIFO queue (maximum 500 records) and are automatically cleared upon server restarts.',
          'We implement robust security safeguards including full HTTPS encryption in transit, Content Security Policy (CSP) headers, and strict rate-limiting firewalls. While we employ rigorous technical measures, no internet transmission can be guaranteed as 100% impenetrable.'
        ]
      },
      {
        title: '11. Children\'s Privacy',
        paragraphs: [
          'lic-calculators.com is intended for adult insurance policyholders, financial planners, and individuals of legal age to enter contracts. We do not knowingly collect or solicit personal data from children under the age of 18.'
        ]
      },
      {
        title: '12. External Third-Party Links',
        paragraphs: [
          'Our educational guides and calculator references contain hyperlinks to external websites (such as licindia.in and irdai.gov.in). We are not responsible for the privacy practices, cookie policies, or content of third-party websites.'
        ]
      },
      {
        title: '13. User Rights and Data Control',
        paragraphs: [
          'Depending on your jurisdiction, you have the right to inspect, control, and manage your data:',
          'To exercise any privacy rights regarding voluntary contact inquiries, you may reach out via our contact page.'
        ],
        listItems: [
          'Right to Clear Local Data: You can delete all saved calculation drafts at any time by clearing your browser local storage.',
          'Right to Opt-Out of Analytics: You can disable Google Analytics tracking using standard browser privacy extensions or cookie-blocking settings.',
          'Right to Correction: If you identify any calculation inaccuracy or wish to modify previous contact submissions, you can submit a correction at /contact/correction.'
        ]
      },
      {
        title: '14. Policy Updates and Contact Information',
        paragraphs: [
          'We may update this Privacy Policy from time to time to reflect technological enhancements or regulatory revisions. All updates will be posted directly to this page with an updated revision date.',
          'If you have questions regarding this Privacy Policy or our data handling practices, please contact us via our Contact Page (/contact) or email us at support@lic-calculators.com.'
        ]
      }
    ],
    relatedLinksHeading: 'Related Legal & Platform Resources',
    relatedLinks: [
      { label: 'Legal Disclaimer', url: '/disclaimer', description: 'Review our non-affiliation notice, calculation estimates, and liability limits.' },
      { label: 'Terms of Service', url: '/terms', description: 'Read the terms governing access and use of our financial calculation platform.' },
      { label: 'About Us', url: '/about', description: 'Learn about our editorial mission, authors, and independent financial tools.' },
      { label: 'Contact Us', url: '/contact', description: 'Reach out to our technical support team for inquiries or feedback.' }
    ]
  },
  hi: {
    seoTitle: 'गोपनीयता नीति (Privacy Policy) | LIC Calculators',
    metaDescription: 'lic-calculators.com की गोपनीयता नीति पढ़ें। ब्राउज़र-आधारित गणना, शून्य व्यक्तिगत डेटा संग्रहण, कुकीज़ और AI सुरक्षा उपायों की पारदर्शी जानकारी।',
    h1: 'गोपनीयता नीति (Privacy Policy)',
    subtitle: 'हमारे डेटा प्रबंधन, सुरक्षा उपायों और उपयोगकर्ता गोपनीयता का पूर्ण पारदर्शी विवरण।',
    lastUpdatedLabel: 'अंतिम अद्यतन',
    lastUpdatedDate: 'अगस्त 2026',
    sections: [
      {
        title: '1. प्रस्तावना और उद्देश्य',
        paragraphs: [
          'lic-calculators.com ("वेबसाइट", "हम") पर आपका स्वागत है। हम उपयोगकर्ता की गोपनीयता और डेटा पारदर्शिता को सर्वोपरि मानते हैं।',
          'यह नीति बताती है कि जब आप हमारे कैलकुलेटर, गाइड और AI टूल्स का उपयोग करते हैं तो डेटा का प्रबंधन कैसे किया जाता है। हमारे सभी वित्तीय कैलकुलेटर सीधे आपके वेब ब्राउज़र में चलते हैं और आपका व्यक्तिगत वित्तीय डेटा सुरक्षित व गोपनीय रहता है।'
        ]
      },
      {
        title: '2. कैलकुलेटर इनपुट और लोकल स्टोरेज (शून्य व्यक्तिगत डेटा संग्रहण)',
        paragraphs: [
          'जब आप हमारे किसी भी कैलकुलेटर (जैसे सरेंडर वैल्यू या मैच्युरिटी कैलकुलेटर) में डेटा भरते हैं, तो वह केवल गणना के लिए आपके ब्राउज़र में ही प्रोसेस होता है।',
          'हम आपका पॉलिसी नंबर, नाम, जन्मतिथि, पैन कार्ड, आधार नंबर या बैंक विवरण किसी भी सर्वर पर स्टोर नहीं करते हैं।'
        ],
        listItems: [
          'ब्राउज़र लोकल स्टोरेज: आपका हालिया कैलकुलेशन ड्राफ्ट केवल आपके अपने डिवाइस के ब्राउज़र में सेव होता है ताकि आपको दोबारा टाइप न करना पड़े। यह डेटा हमारे सर्वर पर कभी नहीं भेजा जाता।',
          'स्टेटलेस API गणना: 3-Way सरेंडर एनालिसिस जैसे टूल्स के लिए गणना तात्कालिक मेमोरी में प्रोसेस होकर तुरंत परिणाम दिखाती है और किसी डेटाबेस में रिकॉर्ड नहीं की जाती।'
        ],
        alert: {
          type: 'info',
          text: 'आप अपने ब्राउज़र की सेटिंग से कभी भी लोकल स्टोरेज और कैश डिलीट करके अपने ड्राफ्ट हटा सकते हैं।'
        }
      },
      {
        title: '3. AI पॉलिसी सहायक और डेटा सुरक्षा',
        paragraphs: [
          'हमारी वेबसाइट पर LIC नियमों और बीमा गणनाओं को समझाने के लिए AI पॉलिसी सहायक उपलब्ध है।',
          'जब आप AI से सवाल पूछते हैं, तो आपका मैसेज और वर्तमान पेज का संदर्भ एन्क्रिप्टेड HTTPS कनेक्शन के जरिए AI मॉडल (जैसे Google Gemini) को भेजा जाता है ताकि सही उत्तर मिल सके।',
          'हम आपकी AI चैट बातचीत को किसी स्थायी डेटाबेस में सेव नहीं करते हैं और न ही इसे आपकी व्यक्तिगत पहचान से जोड़ते हैं।'
        ],
        alert: {
          type: 'warning',
          text: 'कृपया AI चैट में अपना पासवर्ड, OTP या गोपनीय पॉलिसी विवरण दर्ज न करें।'
        }
      },
      {
        title: '4. एनालिटिक्स और उपयोग सांख्यिकी',
        paragraphs: [
          'वेबसाइट के प्रदर्शन और लोकप्रिय टूल्स को समझने के लिए हम गोपनीयता-अनुकूल एनालिटिक्स का उपयोग करते हैं:'
        ],
        listItems: [
          'Google Analytics 4 (G-65LH0P4XCD): कुल पेज व्यू, सामान्य विज़िटर स्रोत और डिवाइस प्रकार (मोबाइल/डेस्कटॉप) को एनोनिमाइज़्ड तरीके से ट्रैक किया जाता है।',
          'डेटा मिनिमाइजेशन ट्रैकर: हमारा आंतरिक ट्रैकर केवल टूल का नाम और पेज लोड का समय अस्थायी बफर में रखता है। इसमें नाम, ईमेल या वित्तीय राशि रिकॉर्ड करना पूरी तरह वर्जित है।'
        ]
      },
      {
        title: '5. कुकीज़ और ट्रैकिंग नीतियां',
        paragraphs: [
          'हमारी वेबसाइट पर कुकीज़ का उपयोग अत्यंत सीमित और स्पष्ट है:'
        ],
        listItems: [
          'प्रशासनिक सत्र कुकीज़: केवल वेबसाइट व्यवस्थापकों के लॉगिन के लिए सुरक्षित HttpOnly कुकी (lic_admin_session) का उपयोग किया जाता है। आम उपयोगकर्ताओं को कोई सत्र कुकी जारी नहीं की जाती।',
          'एनालिटिक्स कुकीज़: Google Analytics द्वारा विज़िटर सांख्यिकी के लिए मानक कुकीज़ (_ga) का उपयोग किया जाता है।',
          'कोई विज्ञापन कुकीज़ नहीं: हम किसी भी प्रकार के थर्ड-पार्टी विज्ञापन या मार्केटिंग ट्रैकर का उपयोग नहीं करते हैं।'
        ]
      },
      {
        title: '6. संपर्क और सुधार प्रपत्र',
        paragraphs: [
          'आप बिना खाता बनाए या व्यक्तिगत जानकारी दिए सभी कैलकुलेटर का उपयोग कर सकते हैं।',
          'यदि आप संपर्क पेज (/contact) या सुधार पेज (/contact/correction) के माध्यम से संदेश भेजते हैं, तो आपका नाम और ईमेल केवल आपके सवाल का जवाब देने के लिए उपयोग किया जाता है।'
        ]
      },
      {
        title: '7. इंफ्रास्ट्रक्चर और क्लाउड सुरक्षा',
        paragraphs: [
          'हमारी वेबसाइट Cloudflare के सुरक्षित ग्लोबल नेटवर्क पर होस्ट की गई है। सुरक्षा और DDoS रोकथाम के लिए सर्वर लॉग में IP पता और ब्राउज़र प्रकार सीमित समय के लिए रिकॉर्ड हो सकता है।'
        ]
      },
      {
        title: '8. उपयोगकर्ता के अधिकार',
        paragraphs: [
          'आपको अपने ब्राउज़र से डेटा हटाने, एनालिटिक्स ऑप्ट-आउट करने और सुधार अनुरोध सबमिट करने का पूर्ण अधिकार है।'
        ]
      },
      {
        title: '9. नीति में बदलाव और संपर्क',
        paragraphs: [
          'हम समय-समय पर इस नीति को अद्यतन कर सकते हैं। किसी भी प्रश्न के लिए आप support@lic-calculators.com पर संपर्क कर सकते हैं।'
        ]
      }
    ],
    relatedLinksHeading: 'संबंधित कानूनी व नीतिगत संसाधन',
    relatedLinks: [
      { label: 'कानूनी अस्वीकरण (Disclaimer)', url: '/disclaimer', description: 'कैलकुलेटर अनुमानों, गैर-संबद्धता और दायित्व सीमाओं की जानकारी पढ़ें।' },
      { label: 'उपयोग की शर्तें (Terms of Service)', url: '/terms', description: 'वेबसाइट उपयोग के नियम और दिशा-निर्देश देखें।' },
      { label: 'हमारे बारे में (About Us)', url: '/about', description: 'हमारी संपादकीय टीम और स्वतंत्र मिशन के बारे में जानें।' },
      { label: 'संपर्क करें (Contact Us)', url: '/contact', description: 'तकनीकी सहायता या प्रतिक्रिया के लिए हमारी टीम से संपर्क करें।' }
    ]
  },
  mr: {
    seoTitle: 'गोपनीयता धोरण (Privacy Policy) | LIC Calculators',
    metaDescription: 'lic-calculators.com चे गोपनीयता धोरण वाचा. ब्राउझर-आधारित गणना, शून्य वैयक्तिक डेटा संचयन आणि सुरक्षिततेची पारदर्शक माहिती.',
    h1: 'गोपनीयता धोरण (Privacy Policy)',
    subtitle: 'आमच्या डेटा हाताळणी आणि वापरकर्ता गोपनीयतेचे संपूर्ण पारदर्शक विवरण.',
    lastUpdatedLabel: 'अंतिम अद्यतन',
    lastUpdatedDate: 'ऑगस्ट २०२६',
    sections: [
      {
        title: '१. प्रस्तावना आणि व्याप्ती',
        paragraphs: [
          'lic-calculators.com वर आपले स्वागत आहे. आम्ही वापरकर्त्यांची गोपनीयता आणि डेटा पारदर्शकता जपण्यासाठी कटिबद्ध आहोत.',
          'आमचे सर्व वित्तीय कॅल्क्युलेटर थेट आपल्या वेब ब्राउझरमध्ये चालतात, ज्यामुळे आपली आर्थिक माहिती पूर्णपणे सुरक्षित आणि गोपनीय राहते.'
        ]
      },
      {
        title: '२. कॅल्क्युलेटर इनपुट आणि लोकल स्टोरेज',
        paragraphs: [
          'कॅल्क्युलेटरमध्ये भरलेली माहिती (जसे की विमा रक्कम, मुदत, वय) केवळ गणितासाठी वापरली जाते. आम्ही पॉलिसी क्रमांक किंवा बँक खात्याचा तपशील कोणत्याही सर्व्हरवर साठवत नाही.',
          'लोकल स्टोरेजचा वापर केवळ आपल्या सोयीसाठी ड्राफ्ट जतन करण्यासाठी केला जातो आणि तो डेटा कधीही बाहेर पाठवला जात नाही.'
        ]
      },
      {
        title: '३. AI सहाय्यक आणि डेटा सुरक्षा',
        paragraphs: [
          'AI सहाय्यकाशी झालेला संवाद कोणत्याही कायमस्वरूपी डेटाबेसमध्ये जतन केला जात नाही आणि तो केवळ तात्कालिक उत्तरासाठी वापरला जातो.'
        ]
      },
      {
        title: '४. कुकीज आणि सांख्यिकी',
        paragraphs: [
          'आम्ही केवळ Google Analytics आणि प्रशासकीय सुरक्षिततेसाठी आवश्यक कुकीज वापरतो. जाहिरात ट्रॅकर्स वापरले जात नाहीत.'
        ]
      },
      {
        title: '५. संपर्क आणि वापरकर्ता अधिकार',
        paragraphs: [
          'वापरकर्त्यांना त्यांचा डेटा व्यवस्थापित करण्याचा पूर्ण अधिकार आहे. शंका असल्यास support@lic-calculators.com वर संपर्क साधावा.'
        ]
      }
    ],
    relatedLinksHeading: 'संबंधित कायदेशीर साधने',
    relatedLinks: [
      { label: 'कायदेशीर अस्वीकरण (Disclaimer)', url: '/disclaimer', description: 'अंदाजांच्या मर्यादा आणि अस्वीकरण वाचा.' },
      { label: 'वापराच्या अटी (Terms of Service)', url: '/terms', description: 'वापराचे नियम व अटी जाणून घ्या.' },
      { label: 'आमच्याबद्दल (About Us)', url: '/about', description: 'आमच्या मिशनबद्दल माहिती मिळवा.' },
      { label: 'संपर्क (Contact Us)', url: '/contact', description: 'आमच्याशी संपर्क साधा.' }
    ]
  },
  gu: {
    seoTitle: 'ગોપનીયતા નીતિ (Privacy Policy) | LIC Calculators',
    metaDescription: 'lic-calculators.com ની ગોપનીયતા નીતિ વાંચો. બ્રાઉઝર-આધારિત ગણતરી, શૂન્ય વ્યક્તિગત ડેટા સંગ્રહ અને પારદર્શક ડેટા સુરક્ષા નીતિ.',
    h1: 'ગોપનીયતા નીતિ (Privacy Policy)',
    subtitle: 'અમારી ડેટા સુરક્ષા પદ્ધતિઓ અને વપરાશકર્તા ગોપનીયતાનું પારદર્શક વિવરણ.',
    lastUpdatedLabel: 'છેલ્લું અપડેટ',
    lastUpdatedDate: 'ઓગસ્ટ ૨૦૨૬',
    sections: [
      {
        title: '૧. પ્રસ્તાવના અને અવકાશ',
        paragraphs: [
          'lic-calculators.com પર આપનું સ્વાગત છે. અમે વપરાશકર્તાની ગોપનીયતાનું રક્ષણ કરવા માટે કટિબદ્ધ છીએ.',
          'અમારા તમામ કેલ્ક્યુલેટર સીધા તમારા બ્રાઉઝરમાં કાર્ય કરે છે, જેથી તમારો વ્યક્તિગત નાણાકીય ડેટા ખાનગી રહે છે.'
        ]
      },
      {
        title: '૨. કેલ્ક્યુલેટર ઇનપુટ્સ અને ડેટા સંગ્રહ',
        paragraphs: [
          'અમે પોલિસી નંબર, નામ, જન્મતારીખ કે બેંક વિગતો અમારા સર્વર પર સંગ્રહિત કરતા નથી.',
          'લોકલ સ્ટોરેજનો ઉપયોગ માત્ર તમારા બ્રાઉઝરમાં તાજેતરની ગણતરી સેવ રાખવા માટે થાય છે.'
        ]
      },
      {
        title: '૩. AI સહાયક અને એનાલિટિક્સ',
        paragraphs: [
          'AI પ્રશ્નોત્તરી કાયમી સંગ્રહિત થતી નથી. અમે ફક્ત Google Analytics ના અનામી ડેટાનો ઉપયોગ કરીએ છીએ.'
        ]
      },
      {
        title: '૪. વપરાશકર્તા અધિકારો અને સંપર્ક',
        paragraphs: [
          'કોઈપણ પ્રશ્ન માટે support@lic-calculators.com પર સંપર્ક કરી શકો છો.'
        ]
      }
    ],
    relatedLinksHeading: 'સંબંધિત કાનૂની સંસાધનો',
    relatedLinks: [
      { label: 'કાનૂની અસ્વીકરણ (Disclaimer)', url: '/disclaimer', description: 'અંદાજો અને જવાબદારીની મર્યાદાઓ.' },
      { label: 'ઉપયોગની શરતો (Terms of Service)', url: '/terms', description: 'વેબસાઇટના નિયમો અને શરતો.' },
      { label: 'અમારા વિશે (About Us)', url: '/about', description: 'અમારા મિશન વિશે જાણો.' },
      { label: 'સંપર્ક કરો (Contact Us)', url: '/contact', description: 'અમારો સંપર્ક કરો.' }
    ]
  },
  bn: {
    seoTitle: 'গোপনীয়তা নীতি (Privacy Policy) | LIC Calculators',
    metaDescription: 'lic-calculators.com এর গোপনীয়তা নীতি পড়ুন। ব্রাউজার-ভিত্তিক গণনা, শূন্য ব্যক্তিগত তথ্য সংরক্ষণ এবং স্বচ্ছ তথ্য সুরক্ষা পদ্ধতি।',
    h1: 'গোপনীয়তা নীতি (Privacy Policy)',
    subtitle: 'আমাদের ডেটা ব্যবস্থাপনা এবং ব্যবহারকারীর গোপনীয়তার পূর্ণ বিবরণ।',
    lastUpdatedLabel: 'সর্বশেষ আপডেট',
    lastUpdatedDate: 'আগস্ট ২০২৬',
    sections: [
      {
        title: '১. ভূমিকা ও পরিধি',
        paragraphs: [
          'lic-calculators.com এ আপনাকে স্বাগতম। আমরা ব্যবহারকারীর ডেটা গোপনীয়তা বজায় রাখতে প্রতিশ্রুতিবদ্ধ।',
          'আমাদের আর্থিক ক্যালকুলেটরগুলি মূলত ক্লায়েন্ট-সাইড ব্রাউজারে কাজ করে, যার ফলে আপনার আর্থিক তথ্য গোপন থাকে।'
        ]
      },
      {
        title: '২. ক্যালকুলেটর ইনপুট ও ডেটা সংরক্ষণ',
        paragraphs: [
          'আমরা আপনার পলিসি নম্বর, নাম, জন্মতারিখ বা ব্যাংক তথ্য আমাদের সার্ভারে সংরক্ষণ করি না।',
          'লোকাল স্টোরেজ শুধুমাত্র আপনার ডিভাইসে খসড়া সংরক্ষণের জন্য ব্যবহৃত হয়।'
        ]
      },
      {
        title: '৩. এআই সহকারী ও বিশ্লেষণ',
        paragraphs: [
          'এআই চ্যাট কোনো স্থায়ী ডেটাবেসে সংরক্ষিত হয় না। ওয়েবসাইটের ট্রাফিক নিরীক্ষণের জন্য বেনামী গুগল অ্যানালিটিক্স ব্যবহার করা হয়।'
        ]
      },
      {
        title: '৪. ব্যবহারকারীর অধিকার ও যোগাযোগ',
        paragraphs: [
          'যেকোনো প্রশ্নের জন্য support@lic-calculators.com এ যোগাযোগ করতে পারেন।'
        ]
      }
    ],
    relatedLinksHeading: 'সম্পর্কিত আইনি তথ্য',
    relatedLinks: [
      { label: 'দাবিত্যাগ (Disclaimer)', url: '/disclaimer', description: 'ক্যালকুলেটর সীমাবদ্ধতা ও দাবিত্যাগ দেখুন।' },
      { label: 'ব্যবহারের শর্তাবলী (Terms of Service)', url: '/terms', description: 'ব্যবহারের নিয়মাবলী পড়ুন।' },
      { label: 'আমাদের সম্পর্কে (About Us)', url: '/about', description: 'আমাদের মিশন সম্পর্কে বিস্তারিত জানুন।' },
      { label: 'যোগাযোগ (Contact Us)', url: '/contact', description: 'আমাদের সাথে যোগাযোগ করুন।' }
    ]
  },
  ta: {
    seoTitle: 'தனியுரிமைக் கொள்கை (Privacy Policy) | LIC Calculators',
    metaDescription: 'lic-calculators.com இன் தனியுரிமைக் கொள்கையைப் படியுங்கள். உலாவி அடிப்படையிலான கணக்கீடுகள் மற்றும் தனிப்பட்ட தரவு சேமிக்கப்படாத வெளிப்படையான நடைமுறைகள்.',
    h1: 'தனியுரிமைக் கொள்கை (Privacy Policy)',
    subtitle: 'எங்கள் தரவு மேலாண்மை மற்றும் பயனர் தனியுரிமை குறித்த முழுமையான வெளிப்படைத்தன்மை.',
    lastUpdatedLabel: 'கடைசி புதுப்பிப்பு',
    lastUpdatedDate: 'ஆகஸ்ட் 2026',
    sections: [
      {
        title: '1. அறிமுகம் மற்றும் நோக்கம்',
        paragraphs: [
          'lic-calculators.com தளத்திற்கு உங்களை வரவேற்கிறோம். பயனர் தனியுரிமை மற்றும் தரவுப் பாதுகாப்பை நாங்கள் முதன்மையாகக் கருதுகிறோம்.',
          'எங்கள் கணக்கீடுகள் உங்கள் உலாவியில் நேரடியாக இயங்குவதால் உங்கள் நிதித் தகவல்கள் பாதுகாப்பாக இருக்கும்.'
        ]
      },
      {
        title: '2. கால்குலேட்டர் உள்ளீடுகள் மற்றும் உள்ளூர் சேமிப்பு',
        paragraphs: [
          'பாலிசி எண், பெயர், பிறந்த தேதி அல்லது வங்கி விவரங்களை நாங்கள் எந்த சேவையகத்திலும் சேமிப்பதில்லை.',
          'உள்ளூர் உலாவி சேமிப்பு உங்கள் வசதிக்காக மட்டுமே உங்கள் சாதனத்தில் பயன்படுத்தப்படுகிறது.'
        ]
      },
      {
        title: '3. AI உதவியாளர் மற்றும் பகுப்பாய்வு',
        paragraphs: [
          'AI உரையாடல்கள் நிரந்தர தரவுத்தளத்தில் சேமிக்கப்படுவதில்லை. பெயர் குறிப்பிடப்படாத Google Analytics மட்டுமே பயன்படுத்தப்படுகிறது.'
        ]
      },
      {
        title: '4. பயனர் உரிமைகள் மற்றும் தொடர்பு',
        paragraphs: [
          'கேள்விகள் அல்லது கருத்துகளுக்கு support@lic-calculators.com இல் தொடர்பு கொள்ளவும்.'
        ]
      }
    ],
    relatedLinksHeading: 'தொடர்புடைய சட்ட வளங்கள்',
    relatedLinks: [
      { label: 'பொறுப்புத் துறப்பு (Disclaimer)', url: '/disclaimer', description: 'மதிப்பீட்டு வரம்புகள் மற்றும் பொறுப்புத் துறப்பு.' },
      { label: 'பயன்பாட்டு விதிமுறைகள் (Terms of Service)', url: '/terms', description: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்.' },
      { label: 'எங்களைப் பற்றி (About Us)', url: '/about', description: 'எங்கள் நோக்கம் மற்றும் குழுவைப் பற்றி அறியவும்.' },
      { label: 'தொடர்பு கொள்ள (Contact Us)', url: '/contact', description: 'எங்களைத் தொடர்பு கொள்ளவும்.' }
    ]
  },
  te: {
    seoTitle: 'గోప్యతా విధానం (Privacy Policy) | LIC Calculators',
    metaDescription: 'lic-calculators.com యొక్క గోప్యతా విధానాన్ని చదవండి. బ్రౌజర్ ఆధారిత గణనలు, వ్యక్తిగత డేటా నిల్వ లేని పారదర్శక పద్ధతులు.',
    h1: 'గోప్యతా విధానం (Privacy Policy)',
    subtitle: 'మా డేటా నిర్వహణ మరియు వినియోగదారు గోప్యతపై స్పష్టమైన ప్రకటన.',
    lastUpdatedLabel: 'చివరి నవీకరణ',
    lastUpdatedDate: 'ఆగస్టు 2026',
    sections: [
      {
        title: '1. పరిచయం మరియు పరిధి',
        paragraphs: [
          'lic-calculators.com కి స్వాగతం. వినియోగదారుల గోప్యతను కాపాడటానికి మేము కట్టుబడి ఉన్నాము.',
          'మా కాలిక్యులేటర్లు మీ బ్రౌజర్‌లోనే నేరుగా రన్ అవుతాయి, తద్వారా మీ వ్యక్తిగత సమాచారం పూర్తిగా సురక్షితంగా ఉంటుంది.'
        ]
      },
      {
        title: '2. కాలిక్యులేటర్ ఇన్‌పుట్‌లు మరియు డేటా నిల్వ',
        paragraphs: [
          'మేము పాలసీ నంబర్లు, పేర్లు, పుట్టిన తేదీలు లేదా బ్యాంక్ వివరాలను ఏ సర్వర్‌లోనూ నిల్వ చేయము.',
          'లోకల్ స్టోరేజ్ కేవలం మీ బ్రౌజర్‌లో డ్రాఫ్ట్ భద్రపరచడానికి మాత్రమే ఉపయోగించబడుతుంది.'
        ]
      },
      {
        title: '3. AI సహాయకుడు మరియు విశ్లేషణలు',
        paragraphs: [
          'AI చాట్ శాశ్వత డేటాబేస్‌లో నిల్వ చేయబడదు. సైట్ ట్రాఫిక్ కోసం అనామక Google Analytics మాత్రమే ఉపయోగించబడుతుంది.'
        ]
      },
      {
        title: '4. సంప్రదింపులు మరియు యూజర్ హక్కులు',
        paragraphs: [
          'ఏదైనా సమాచారం కోసం support@lic-calculators.com ద్వారా సంప్రదించండి.'
        ]
      }
    ],
    relatedLinksHeading: 'సంబంధిత చట్టపరమైన వనరులు',
    relatedLinks: [
      { label: 'డిస్క్లైమర్ (Disclaimer)', url: '/disclaimer', description: 'అంచనాలు మరియు బాధ్యత పరిమితులు.' },
      { label: 'వినియోగ నిబంధనలు (Terms of Service)', url: '/terms', description: 'వినియోగ నిబంధనలను చదవండి.' },
      { label: 'మా గురించి (About Us)', url: '/about', description: 'మా స్వతంత్ర లక్ష్యం గురించి తెలుసుకోండి.' },
      { label: 'సంప్రదించండి (Contact Us)', url: '/contact', description: 'మా బృందాన్ని సంప్రదించండి.' }
    ]
  }
};

export function getPrivacyPolicyContent(locale: Locale): PrivacyPolicyPageData {
  return PRIVACY_POLICY_CONTENT[locale] || PRIVACY_POLICY_CONTENT.en;
}
