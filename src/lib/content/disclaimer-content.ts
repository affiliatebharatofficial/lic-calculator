import type { Locale } from '@/types/i18n';

export interface DisclaimerSection {
  title: string;
  paragraphs: string[];
  listItems?: string[];
  alert?: {
    type: 'warning' | 'info';
    text: string;
  };
}

export interface DisclaimerPageData {
  seoTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  bannerNotice: {
    title: string;
    text: string;
  };
  sections: DisclaimerSection[];
  relatedLinksHeading: string;
  relatedLinks: Array<{ label: string; url: string; description: string }>;
}

export const DISCLAIMER_CONTENT: Record<Locale, DisclaimerPageData> = {
  en: {
    seoTitle: 'LIC Calculators Disclaimer | Independent Financial Tools',
    metaDescription: 'Read the official disclaimer for lic-calculators.com. An independent informational platform providing financial estimates, calculation limitations, and non-affiliation notice.',
    h1: 'Disclaimer',
    subtitle: 'Mandatory legal disclosure regarding independent platform status, calculator estimation limitations, and educational purpose.',
    lastUpdatedLabel: 'Last Updated',
    lastUpdatedDate: 'August 2026',
    bannerNotice: {
      title: 'Independent Financial Platform Notice',
      text: 'lic-calculators.com is an independent educational and calculation tool. It is NOT affiliated with, sponsored by, authorized by, or endorsed by Life Insurance Corporation of India (LIC), the Government of India, or any statutory authority.'
    },
    sections: [
      {
        title: '1. Overview and Nature of Service',
        paragraphs: [
          'Welcome to lic-calculators.com (the "Website"). This Disclaimer sets forth the terms, conditions, and legal boundaries governing your use of our financial calculation engines, comparison charts, informational articles, and educational resources.',
          'The services and tools provided on this platform are designed exclusively for general informational, educational, and personal planning purposes. We do not sell insurance policies, collect premium payments on behalf of any insurance corporation, solicit insurance business, or act as an insurance intermediary, broker, corporate agent, or underwriting authority.'
        ]
      },
      {
        title: '2. Independent Platform & Non-Affiliation Disclosure',
        paragraphs: [
          'lic-calculators.com is operated as a private, independent financial technology initiative.',
          'We hereby explicitly declare that this Website is NOT an official website of the Life Insurance Corporation of India (LIC). We do not claim any partnership, affiliation, agency, sponsorship, or certification from LIC of India, the Insurance Regulatory and Development Authority of India (IRDAI), or any government body.',
          'The registered trademarks "LIC", "Life Insurance Corporation of India", and specific policy names (such as "Jeevan Labh", "Jeevan Umang", "New Jeevan Anand", etc.) belong entirely to their respective statutory owners. Any reference to these names, plan numbers, or products on this platform is solely for descriptive, comparative, and identification purposes under the doctrine of nominative fair use.'
        ],
        alert: {
          type: 'warning',
          text: 'Do not submit sensitive policy credentials, policy passwords, or payment OTPs on any third-party website. All official policy servicing must be performed through the official portal at licindia.in.'
        }
      },
      {
        title: '3. Nature of Calculator Results and Estimates',
        paragraphs: [
          'All calculation results, surrender value estimations, loan eligibility figures, maturity projections, internal rate of return (IRR) calculations, and bonus computations displayed on this platform are mathematical approximations.',
          'Our calculation engines implement published actuarial algorithms, standard surrender value factors (GSV / SSV), and historical bonus rates made public in LIC annual valuation reports. Because individual policy contracts are governed by specific underwriting terms, rider options, tax regulations, and dynamic annual bonus declarations, our outputs must be treated strictly as informative estimates and never as guaranteed financial values.'
        ],
        listItems: [
          'Estimates are generated based on mathematical formulas, not live ledger synchronization with LIC policy databases.',
          'Actual policy surrender values are determined exclusively by the insurer at the exact date of official surrender processing.',
          'Calculations do not include late payment penalties, outstanding policy loan liens, or individual policy endorsements unless specifically inputted.'
        ]
      },
      {
        title: '4. General Financial Information (No Professional Advice)',
        paragraphs: [
          'The content, insights, analysis, and calculations provided on this Website are of a general nature and do not take into account the unique financial situation, investment objectives, tax brackets, or risk appetite of any individual user.',
          'Nothing on this Website constitutes personalized financial, investment, legal, tax, or actuarial advice. Users must not make critical financial decisions—including surrendering a policy, stopping premium payments, or purchasing alternative financial instruments—solely on the basis of estimates obtained from this Website.'
        ],
        alert: {
          type: 'info',
          text: 'Always consult a certified financial planner, chartered accountant, or authorized insurance professional before undertaking significant insurance or investment actions.'
        }
      },
      {
        title: '5. Accuracy, Factors Causing Variance & Calculation Limitations',
        paragraphs: [
          'We strive to maintain accurate calculation rules and up-to-date actuarial parameters. However, financial outcomes in life insurance contracts depend on numerous dynamic variables that can cause actual values to vary significantly from calculator outputs:',
          'We do NOT claim or guarantee that any calculation result is "100% accurate", "guaranteed", or "official".'
        ],
        listItems: [
          'Policy Plan & Table Number: Each plan has distinct Guaranteed Surrender Value (GSV) percentages and Special Surrender Value (SSV) factors.',
          'Commencement Date & Plan Era: Regulatory norms (e.g., pre-2014, 2014-2019, 2020+, and October 2024 IRDAI Master Circular guidelines) alter surrender thresholds and cooling periods.',
          'Bonus Declarations: Simple Reversionary Bonuses and Final Additional Bonuses (FAB) are declared annually by LIC post-actuarial valuation and cannot be guaranteed in advance.',
          'Modal Loading & GST: Tax rates on premiums (4.5% in Year 1, 2.25% in subsequent years, 18% for pure term/riders) and modal frequency rebates impact cumulative cash flows.',
          'User Input Accuracy: Output accuracy is directly dependent on the precision of data entered by the user (exact policy dates, premium amounts without tax, and years completed).'
        ]
      },
      {
        title: '6. User Responsibility and Self-Verification',
        paragraphs: [
          'As a user of this Website, you acknowledge and agree that it is your sole responsibility to:',
          'If there is any discrepancy between our calculator estimate and the official status report provided by Life Insurance Corporation of India, the official LIC documentation shall always supersede and prevail.'
        ],
        listItems: [
          'Review and verify the accuracy of all numbers, policy terms, and dates you enter into our tools.',
          'Read and understand the specific terms, conditions, exclusions, and benefit schedules in your original LIC Policy Bond.',
          'Verify all actual cash surrender values, loan balances, and maturity figures directly through official LIC branch offices or the official LIC customer portal.',
          'Independently evaluate whether altering your insurance coverage aligns with your personal long-term financial security.'
        ]
      },
      {
        title: '7. Third-Party Information, Sources & External Links',
        paragraphs: [
          'This Website may reference official regulatory circulars, LIC annual valuation bonus sheets, and IRDAI guidelines to provide contextual educational depth. These references are cited purely as external informative sources.',
          'Our Website may also contain hyperlinks to third-party websites, including official government portals (irdai.gov.in) and the official insurer portal (licindia.in). Such links are provided solely for user convenience. We have no operational control over external websites, do not endorse their commercial offerings, and assume no responsibility for their content, privacy policies, or service availability.'
        ]
      },
      {
        title: '8. Limitation of Liability',
        paragraphs: [
          'To the fullest extent permitted by applicable law, lic-calculators.com, its developers, authors, reviewers, and operators expressly disclaim all warranties, whether express or implied, including warranties of accuracy, completeness, fitness for a particular purpose, and non-infringement.',
          'Under no legal theory—whether in contract, tort, negligence, or strict liability—shall the platform operators be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including financial losses, surrender penalties, lost investment opportunities, or disputes arising out of the use or inability to use this platform.'
        ]
      },
      {
        title: '9. Changes, Revisions & Methodology Updates',
        paragraphs: [
          'Insurance regulations, actuarial surrender factors, and bonus declarations undergo periodic updates. We reserve the right to modify our calculation algorithms, update policy rule sets, and revise the contents of this Disclaimer at any time without prior notice.',
          'Any updates become effective immediately upon being published on this page. Your continued use of the Website following any revision signifies your acceptance of the updated Disclaimer.'
        ]
      },
      {
        title: '10. Contact Information & Reporting Discrepancies',
        paragraphs: [
          'We are committed to maintaining data integrity and transparency. If you notice any formula inconsistency, outdated bonus rate, or factual discrepancy on any page, we welcome your feedback.',
          'You may submit corrections or inquiries through our dedicated correction portal (/contact/correction) or contact page (/contact).'
        ]
      }
    ],
    relatedLinksHeading: 'Related Legal & Financial Resources',
    relatedLinks: [
      { label: 'Privacy Policy', url: '/privacy-policy', description: 'Understand how we protect your privacy with zero personal data storage.' },
      { label: 'Terms of Service', url: '/terms', description: 'Review our terms governing calculator use and acceptable conduct.' },
      { label: 'About Our Platform', url: '/about', description: 'Learn about our editorial team, methodology, and independent mission.' },
      { label: 'All Financial Calculators', url: '/calculators', description: 'Explore our complete suite of 16 independent LIC calculators.' }
    ]
  },
  hi: {
    seoTitle: 'LIC कैलकुलेटर अस्वीकरण | स्वतंत्र वित्तीय टूल्स डिस्क्लेमर',
    metaDescription: 'lic-calculators.com का आधिकारिक कानूनी अस्वीकरण पढ़ें। स्वतंत्र वित्तीय कैलकुलेटर, अनुमानों की सीमाएं और गैर-संबद्धता की स्पष्ट सूचना।',
    h1: 'अस्वीकरण (Disclaimer)',
    subtitle: 'स्वतंत्र प्लेटफॉर्म स्थिति, कैलकुलेटर अनुमानों की सीमाओं और शैक्षणिक उद्देश्य से संबंधित अनिवार्य कानूनी घोषणा।',
    lastUpdatedLabel: 'अंतिम अद्यतन',
    lastUpdatedDate: 'अगस्त 2026',
    bannerNotice: {
      title: 'स्वतंत्र वित्तीय प्लेटफॉर्म की घोषणा',
      text: 'lic-calculators.com एक स्वतंत्र शैक्षणिक व गणना पोर्टल है। यह भारतीय जीवन बीमा निगम (LIC), भारत सरकार या किसी भी सरकारी निकाय से संबद्ध, अधिकृत या प्रायोजित नहीं है।'
    },
    sections: [
      {
        title: '1. सेवा का स्वरूप और उद्देश्य',
        paragraphs: [
          'lic-calculators.com पर आपका स्वागत है। यह अस्वीकरण हमारे वित्तीय कैलकुलेटर, तुलनात्मक चार्ट और सूचनात्मक लेखों के उपयोग से संबंधित नियमों और कानूनी सीमाओं को स्पष्ट करता है।',
          'इस वेबसाइट पर उपलब्ध सभी टूल्स और सामग्री केवल सामान्य जानकारी, शिक्षा और व्यक्तिगत वित्तीय योजना के उद्देश्य से बनाई गई है। हम बीमा पॉलिसी नहीं बेचते हैं, LIC की ओर से प्रीमियम जमा नहीं करते हैं, और न ही किसी बीमा एजेंट या ब्रोकर के रूप में कार्य करते हैं।'
        ]
      },
      {
        title: '2. स्वतंत्र प्लेटफॉर्म और गैर-संबद्धता की घोषणा',
        paragraphs: [
          'lic-calculators.com का संचालन एक स्वतंत्र निजी वित्तीय तकनीक पहल के रूप में किया जाता है।',
          'हम स्पष्ट रूप से घोषणा करते हैं कि यह वेबसाइट भारतीय जीवन बीमा निगम (LIC) की आधिकारिक वेबसाइट नहीं है। हमारा LIC, IRDAI या किसी भी सरकारी संस्था के साथ कोई व्यावसायिक संबंध, साझेदारी या प्रमाणन नहीं है।',
          'ट्रेडमार्क "LIC", "भारतीय जीवन बीमा निगम" और योजनाओं के नाम (जैसे जीवन लाभ, जीवन उमंग, न्यू जीवन आनंद आदि) उनके संबंधित स्वामियों की संपत्ति हैं। इनका उपयोग केवल वर्णनात्मक और संदर्भ उद्देश्यों (Nominative Fair Use) के लिए किया गया है।'
        ],
        alert: {
          type: 'warning',
          text: 'किसी भी अनधिकृत वेबसाइट पर अपनी पॉलिसी का पासवर्ड या भुगतान OTP साझा न करें। सभी आधिकारिक सेवाओं के लिए licindia.in का ही उपयोग करें।'
        }
      },
      {
        title: '3. कैलकुलेटर परिणामों और अनुमानों का स्वरूप',
        paragraphs: [
          'इस वेबसाइट पर प्रदर्शित सभी गणना परिणाम, सरेंडर वैल्यू अनुमान, लोन पात्रता और परिपक्वता (Maturity) राशियां गणितीय सन्निकटन (Approximations) हैं।',
          'हमारे कैलकुलेटर सार्वजनिक रूप से उपलब्ध ब्रोशर, सरेंडर वैल्यू फैक्टर और पिछले वर्षों के घोषित बोनस दरों पर आधारित हैं। वास्तविक पॉलिसियों में सटीक आंकड़े व्यक्तिगत शर्तों और नए नियमों के अनुसार भिन्न हो सकते हैं, इसलिए इन्हें अनुमान माना जाना चाहिए, कोई गारंटीकृत राशि नहीं।'
        ],
        listItems: [
          'परिणाम गणितीय सूत्रों पर आधारित हैं, LIC के आधिकारिक सर्वर से लाइव जुड़े नहीं हैं।',
          'वास्तविक सरेंडर वैल्यू का निर्धारण केवल LIC द्वारा सरेंडर के समय ही किया जाता है।',
          'गणना में विलंब शुल्क (Late fee) या बकाया लोन तब तक शामिल नहीं होता जब तक आप स्वयं दर्ज न करें।'
        ]
      },
      {
        title: '4. सामान्य वित्तीय जानकारी (पेशेवर सलाह का विकल्प नहीं)',
        paragraphs: [
          'इस वेबसाइट की सामग्री किसी व्यक्ति विशेष की व्यक्तिगत वित्तीय स्थिति, टैक्स स्लैब या जोखिम क्षमता को ध्यान में रखकर नहीं बनाई गई है।',
          'यह किसी भी प्रकार की वित्तीय, कानूनी, कर (Tax) या बीमा संबंधी व्यक्तिगत सलाह नहीं है। केवल इस वेबसाइट के अनुमानों के आधार पर पॉलिसी बंद करने या नया निवेश करने का निर्णय न लें।'
        ],
        alert: {
          type: 'info',
          text: 'कोई भी बड़ा वित्तीय निर्णय लेने से पहले किसी प्रमाणित वित्तीय सलाहकार या अधिकृत बीमा विशेषज्ञ से परामर्श अवश्य लें।'
        }
      },
      {
        title: '5. सटीकता की सीमाएं और अंतर के मुख्य कारण',
        paragraphs: [
          'हम सटीक गणना नियम बनाए रखने का हर संभव प्रयास करते हैं। हालांकि, जीवन बीमा पॉलिसियों में कई ऐसे कारक होते हैं जिनके कारण वास्तविक मूल्य कैलकुलेटर से भिन्न हो सकते हैं:',
          'हम किसी भी परिणाम के "100% सटीक", "गारंटीशुदा" या "आधिकारिक" होने का दावा नहीं करते हैं।'
        ],
        listItems: [
          'प्लान और टेबल नंबर: प्रत्येक प्लान के गारंटीड (GSV) और स्पेशल (SSV) सरेंडर फैक्टर अलग होते हैं।',
          'पॉलिसी शुरू होने की तिथि: IRDAI के नए दिशा-निर्देशों (जैसे अक्टूबर 2024 मास्टर सर्कुलर) के अनुसार नियम बदलते रहते हैं।',
          'वार्षिक बोनस घोषणा: वार्षिक बोनस और फाइनल एडिशनल बोनस (FAB) LIC द्वारा हर साल घोषित किया जाता है और पहले से निश्चित नहीं होता।',
          'GST और भुगतान मोड: प्रथम वर्ष 4.5% और बाद के वर्षों में 2.25% GST व वार्षिक मोड पर 2% छूट का प्रभाव पड़ता है।',
          'उपयोगकर्ता द्वारा दर्ज डेटा: गणना की सटीकता आपके द्वारा दर्ज किए गए आंकड़ों की सटीकता पर निर्भर करती है।'
        ]
      },
      {
        title: '6. उपयोगकर्ता की जिम्मेदारी और स्वयं सत्यापन',
        paragraphs: [
          'इस वेबसाइट का उपयोग करके आप स्वीकार करते हैं कि यह आपकी जिम्मेदारी है कि:',
          'यदि हमारी गणना और LIC के आधिकारिक स्टेटस रिपोर्ट में कोई अंतर होता है, तो हमेशा LIC के आधिकारिक दस्तावेज ही मान्य होंगे।'
        ],
        listItems: [
          'कैलकुलेटर में दर्ज की गई सभी तिथियों और प्रीमियम राशियों की सटीकता की जांच करें।',
          'अपनी मूल पॉलिसी बॉन्ड में लिखी शर्तों और लाभ तालिकाओं को ध्यान से पढ़ें।',
          'वास्तविक सरेंडर वैल्यू और लोन राशि का सत्यापन LIC की आधिकारिक शाखा या licindia.in पोर्टल से करें।'
        ]
      },
      {
        title: '7. तृतीय-पक्ष स्रोत और बाहरी लिंक्स',
        paragraphs: [
          'हमारी वेबसाइट पर IRDAI सर्कुलर और LIC बोनस चार्ट के संदर्भ दिए गए हैं। ये केवल सामान्य जानकारी और संदर्भ के लिए हैं।',
          'वेबसाइट में बाहरी वेबसाइटों (जैसे licindia.in, irdai.gov.in) के लिंक हो सकते हैं। उन वेबसाइटों की सामग्री और नीतियों पर हमारा कोई नियंत्रण नहीं है।'
        ]
      },
      {
        title: '8. दायित्व की सीमा (Limitation of Liability)',
        paragraphs: [
          'कानून द्वारा अनुमत सीमा तक, lic-calculators.com और इसके संचालक किसी भी प्रत्यक्ष, अप्रत्यक्ष या आकस्मिक वित्तीय नुकसान के लिए उत्तरदायी नहीं होंगे जो इस वेबसाइट के अनुमानों के उपयोग से उत्पन्न हो सकता है।'
        ]
      },
      {
        title: '9. सामग्री और नियमों में बदलाव',
        paragraphs: [
          'बीमा नियमों और बोनस दरों में बदलाव के अनुसार हम अपने कैलकुलेटर के सूत्रों और इस अस्वीकरण को बिना पूर्व सूचना के संशोधित कर सकते हैं।',
          'वेबसाइट का निरंतर उपयोग यह दर्शाता है कि आप अद्यतन नियमों को स्वीकार करते हैं।'
        ]
      },
      {
        title: '10. संपर्क और त्रुटि निवारण',
        paragraphs: [
          'यदि आपको किसी कैलकुलेटर या लेख में कोई विसंगति मिलती है, तो आप हमारे संपर्क या सुधार (Correction) पृष्ठ के माध्यम से हमें सूचित कर सकते हैं।'
        ]
      }
    ],
    relatedLinksHeading: 'संबंधित कानूनी व वित्तीय संसाधन',
    relatedLinks: [
      { label: 'गोपनीयता नीति (Privacy Policy)', url: '/privacy-policy', description: 'जानें कि हम बिना व्यक्तिगत डेटा स्टोर किए आपकी गोपनीयता कैसे सुरक्षित रखते हैं।' },
      { label: 'उपयोग की शर्तें (Terms of Service)', url: '/terms', description: 'कैलकुलेटर के उपयोग और नियमों से संबंधित शर्तें पढ़ें।' },
      { label: 'हमारे बारे में (About Us)', url: '/about', description: 'हमारी संपादकीय टीम और स्वतंत्र मिशन के बारे में जानें।' },
      { label: 'सभी वित्तीय कैलकुलेटर', url: '/calculators', description: 'हमारे सभी 16 स्वतंत्र बीमा कैलकुलेटर एक्सप्लोर करें।' }
    ]
  },
  mr: {
    seoTitle: 'LIC कॅल्क्युलेटर अस्वीकरण | स्वतंत्र वित्तीय टूल्स डिस्क्लेमर',
    metaDescription: 'lic-calculators.com चे अधिकृत कायदेशीर अस्वीकरण वाचा. स्वतंत्र वित्तीय कॅल्क्युलेटर, अंदाजांच्या मर्यादा आणि गैर-संलग्नतेची स्पष्ट माहिती.',
    h1: 'अस्वीकरण (Disclaimer)',
    subtitle: 'स्वतंत्र व्यासपीठ स्थिती, कॅल्क्युलेटर अंदाजांच्या मर्यादा आणि शैक्षणिक उद्देशाशी संबंधित कायदेशीर घोषणा.',
    lastUpdatedLabel: 'अंतिम अद्यतन',
    lastUpdatedDate: 'ऑगस्ट २०२६',
    bannerNotice: {
      title: 'स्वतंत्र वित्तीय प्लॅटफॉर्म सूचना',
      text: 'lic-calculators.com हे एक स्वतंत्र शैक्षणिक व गणना पोर्टल आहे. हे भारतीय आयुर्विमा महामंडळ (LIC) किंवा कोणत्याही सरकारी संस्थेशी संलग्न किंवा अधिकृत नाही.'
    },
    sections: [
      {
        title: '१. सेवेचे स्वरूप आणि उद्देश',
        paragraphs: [
          'lic-calculators.com वर आपले स्वागत आहे. हे अस्वीकरण आमच्या वित्तीय कॅल्क्युलेटर व माहितीपूर्ण लेखांच्या वापराशी संबंधित कायदेशीर मर्यादा स्पष्ट करते.',
          'या संकेतस्थळावरील सर्व साधने केवळ सामान्य माहिती, शिक्षण आणि वैयक्तिक नियोजनासाठी आहेत. आम्ही विमा पॉलिसींची विक्री करत नाही किंवा LIC च्या वतीने प्रीमियम गोळा करत नाही.'
        ]
      },
      {
        title: '२. स्वतंत्र प्लॅटफॉर्म आणि गैर-संलग्नता',
        paragraphs: [
          'lic-calculators.com हे स्वतंत्रपणे चालवले जाणारे व्यासपीठ आहे. आमचा LIC किंवा IRDAI शी कोणताही व्यावसायिक संबंध किंवा भागीदारी नाही.',
          '"LIC" आणि योजनांची नावे ही त्यांच्या मूळ संस्थांची नोंदणीकृत मालमत्ता आहेत. त्यांचा वापर केवळ वर्णनात्मक उद्देशांसाठी केला गेला आहे.'
        ]
      },
      {
        title: '३. कॅल्क्युलेटर निकालांचे स्वरूप',
        paragraphs: [
          'या संकेतस्थळावरील सर्व आकडेमोड, सरेंडर व्हॅल्यू आणि मॅच्युरिटीचे आकडे गणितीय अंदाज आहेत.',
          'प्रत्यक्ष सरेंडर व्हॅल्यू पॉलिसीच्या अटी आणि चालू बोनस दरांवर अवलंबून असते. हे आकडे अंतिम नसून केवळ माहितीसाठी आहेत.'
        ]
      },
      {
        title: '४. व्यावसायिक सल्ल्याचा अभाव',
        paragraphs: [
          'येथील माहिती वैयक्तिक वित्तीय किंवा कर सल्ला नाही. कोणताही मोठा आर्थिक निर्णय घेण्यापूर्वी तज्ज्ञांचा सल्ला घ्यावा.'
        ]
      },
      {
        title: '५. अचूकतेच्या मर्यादा आणि तफावतीची कारणे',
        paragraphs: [
          'पॉलिसी प्रकार, कालावधी, बोनस घोषणा आणि GST यांमुळे प्रत्यक्ष आकडे कॅल्क्युलेटर निकालांपेक्षा वेगळे असू शकतात. आम्ही १००% हमी देत नाही.'
        ]
      },
      {
        title: '६. वापरकर्त्याची जबाबदारी',
        paragraphs: [
          'कॅल्क्युलेटरमध्ये अचूक माहिती भरणे आणि अंतिम आकडे LIC च्या अधिकृत शाखेतून किंवा licindia.in वरून पडताळणे ही वापरकर्त्याची जबाबदारी आहे.'
        ]
      },
      {
        title: '७. बाह्य दुवे आणि जबाबदारीची मर्यादा',
        paragraphs: [
          'बाह्य संकेतस्थळांच्या सामग्रीवर आमचे नियंत्रण नाही. या संकेतस्थळावरील अंदाजांच्या आधारे घेतलेल्या निर्णयांच्या परिणामांसाठी प्लॅटफॉर्म जबाबदार राहणार नाही.'
        ]
      },
      {
        title: '८. अद्यतने आणि संपर्क',
        paragraphs: [
          'नियम बदलल्यास माहिती अद्यतनित केली जाते. त्रुटी आढळल्यास आपण आमच्या संपर्क पानावरून कळवू शकता.'
        ]
      }
    ],
    relatedLinksHeading: 'संबंधित कायदेशीर संसाधने',
    relatedLinks: [
      { label: 'गोपनीयता धोरण (Privacy Policy)', url: '/privacy-policy', description: 'आम्ही वैयक्तिक डेटा कसा सुरक्षित ठेवतो ते जाणून घ्या.' },
      { label: 'वापराच्या अटी (Terms of Service)', url: '/terms', description: 'कॅल्क्युलेटर वापराच्या अटी वाचा.' },
      { label: 'आमच्याबद्दल (About Us)', url: '/about', description: 'आमच्या स्वतंत्र मिशनबद्दल जाणून घ्या.' },
      { label: 'सर्व कॅल्क्युलेटर', url: '/calculators', description: 'आमचे सर्व १६ कॅल्क्युलेटर एक्सप्लोर करा.' }
    ]
  },
  gu: {
    seoTitle: 'LIC કેલ્ક્યુલેટર ડિસ્ક્લેમર | સ્વતંત્ર નાણાકીય ટૂલ્સ અસ્વીકરણ',
    metaDescription: 'lic-calculators.com નું સત્તાવાર કાનૂની અસ્વીકરણ વાંચો. સ્વતંત્ર કેલ્ક્યુલેટર, અંદાજોની મર્યાદાઓ અને બિન-સંલગ્નતાની સ્પષ્ટ સૂચના.',
    h1: 'ડિસ્ક્લેમર (Disclaimer)',
    subtitle: 'સ્વતંત્ર પ્લેટફોર્મ સ્થિતિ, કેલ્ક્યુલેટર અંદાજોની મર્યાદાઓ અને શૈક્ષણિક હેતુ અંગેનું કાનૂની જાહેરાતનામું.',
    lastUpdatedLabel: 'છેલ્લું અપડેટ',
    lastUpdatedDate: 'ઓગસ્ટ ૨૦૨૬',
    bannerNotice: {
      title: 'સ્વતંત્ર નાણાકીય પ્લેટફોર્મ સૂચના',
      text: 'lic-calculators.com એ એક સ્વતંત્ર શૈક્ષણિક અને ગણતરી પોર્ટલ છે. તે લાઈફ ઈન્સ્યોરન્સ કોર્પોરેશન ઓફ ઈન્ડિયા (LIC) કે કોઈપણ સરકારી સંસ્થા સાથે જોડાયેલ નથી.'
    },
    sections: [
      {
        title: '૧. સેવાનું સ્વરૂપ અને હેતુ',
        paragraphs: [
          'lic-calculators.com પર આપનું સ્વાગત છે. આ અસ્વીકરણ અમારા નાણાકીય કેલ્ક્યુલેટર અને લેખોના ઉપયોગ સંબંધિત કાનૂની સીમાઓ સ્પષ્ટ કરે છે.',
          'આ વેબસાઇટ પરના તમામ સાધનો માત્ર સામાન્ય માહિતી, શિક્ષણ અને વ્યક્તિગત નાણાકીય આયોજન માટે છે. અમે કોઈ વીમા પોલિસી વેચતા નથી.'
        ]
      },
      {
        title: '૨. સ્વતંત્ર પ્લેટફોર્મ અને બિન-સંલગ્નતા',
        paragraphs: [
          'આ વેબસાઇટ LIC ઓફ ઇન્ડિયાની સત્તાવાર વેબસાઇટ નથી. અમારો LIC કે IRDAI સાથે કોઈ એજન્સી કે વ્યવસાયિક સંબંધ નથી.',
          '"LIC" અને પ્લાનના નામો તેમના મૂળ માલિકોની નોંધાયેલ મિલકત છે અને અહીં તેનો ઉપયોગ માત્ર ઓળખ અને સંદર્ભ માટે થયો છે.'
        ],
        alert: {
          type: 'warning',
          text: 'કોઈપણ અનધિકૃત વેબસાઇટ પર પોલિસી પાસવર્ડ અથવા પેમેન્ટ OTP દાખલ કરશો નહીં. તમામ સત્તાવાર સેવાઓ માટે licindia.in નો ઉપયોગ કરો.'
        }
      },
      {
        title: '૩. કેલ્ક્યુલેટર અંદાજો અને પરિણામોની મર્યાદાઓ',
        paragraphs: [
          'બધા પરિણામો, સરન્ડર વેલ્યુ અને મેચ્યોરિટીની રકમ ગાણિતિક અંદાજ છે. વાસ્તવિક મૂલ્ય માટે LIC ની સત્તાવાર શાખાનો સંપર્ક કરવો.'
        ]
      },
      {
        title: '૪. વ્યાવસાયિક સલાહનો અભાવ',
        paragraphs: [
          'આ માહિતી કોઈ વ્યક્તિગત નાણાકીય કે ટેક્સ સલાહ નથી. વપરાશકર્તાઓએ તેમના પોતાના નિર્ણયો લેતા પહેલા અધિકૃત સલાહકારનો સંપર્ક કરવો જોઈએ.'
        ]
      },
      {
        title: '૫. સુધારા અને સંપર્ક',
        paragraphs: [
          'નિયમો બદલાતા અમે કેલ્ક્યુલેટર અપડેટ કરીએ છીએ. કોઈપણ વિસંગતતા માટે સંપર્ક પૃષ્ઠ દ્વારા અમારો સંપર્ક કરી શકો છો.'
        ]
      }
    ],
    relatedLinksHeading: 'સંબંધિત કાનૂની સંસાધનો',
    relatedLinks: [
      { label: 'ગોપનીયતા નીતિ (Privacy Policy)', url: '/privacy-policy', description: 'અમારી ડેટા સુરક્ષા નીતિ જુઓ.' },
      { label: 'ઉપયોગની શરતો (Terms of Service)', url: '/terms', description: 'ઉપયોગ સંબંધિત શરતો વાંચો.' },
      { label: 'અમારા વિશે (About Us)', url: '/about', description: 'અમારા મિશન વિશે જાણો.' },
      { label: 'બધા કેલ્ક્યુલેટર', url: '/calculators', description: 'તમામ ૧૬ કેલ્ક્યુલેટર જુઓ.' }
    ]
  },
  bn: {
    seoTitle: 'LIC ক্যালকুলেটর ডিসক্লেমার | স্বাধীন আর্থিক টুলস দাবিত্যাগ',
    metaDescription: 'lic-calculators.com এর আনুষ্ঠানিক আইনি দাবিত্যাগ পড়ুন। স্বাধীন আর্থিক ক্যালকুলেটর, অনুমানের সীমাবদ্ধতা এবং অ-অনুমোদিততার স্পষ্ট বিজ্ঞপ্তি।',
    h1: 'দাবিত্যাগ (Disclaimer)',
    subtitle: 'স্বাধীন প্ল্যাটফর্মের অবস্থান, ক্যালকুলেটর অনুমানের সীমাবদ্ধতা এবং শিক্ষামূলক উদ্দেশ্য সংক্রান্ত আইনি বিজ্ঞপ্তি।',
    lastUpdatedLabel: 'সর্বশেষ আপডেট',
    lastUpdatedDate: 'আগস্ট ২০২৬',
    bannerNotice: {
      title: 'স্বাধীন আর্থিক প্ল্যাটফর্ম বিজ্ঞপ্তি',
      text: 'lic-calculators.com একটি স্বাধীন শিক্ষামূলক ও গণনা পোর্টাল। এটি লাইফ ইন্স্যুরেন্স কর্পোরেশন অব ইন্ডিয়া (LIC) বা কোনো সরকারি সংস্থার সাথে সম্পর্কিত বা অনুমোদিত নয়।'
    },
    sections: [
      {
        title: '১. সেবার প্রকৃতি ও উদ্দেশ্য',
        paragraphs: [
          'lic-calculators.com এ আপনাকে স্বাগতম। এই দাবিত্যাগ আমাদের আর্থিক ক্যালকুলেটর এবং তথ্যমূলক নিবন্ধের ব্যবহারের আইনি শর্তাবলী নির্ধারণ করে।',
          'এই ওয়েবসাইটের সমস্ত টুলস কেবলমাত্র সাধারণ তথ্য, শিক্ষা এবং ব্যক্তিগত আর্থিক পরিকল্পনার উদ্দেশ্যে তৈরি। আমরা কোনো বীমা পলিসি বিক্রি করি না।'
        ]
      },
      {
        title: '২. স্বাধীন প্ল্যাটফর্ম ও অ-সংযুক্ততা প্রকাশ',
        paragraphs: [
          'আমরা স্পষ্টভাবে ঘোষণা করছি যে এই ওয়েবসাইটটি লাইফ ইন্স্যুরেন্স কর্পোরেশন অব ইন্ডিয়া (LIC) এর অফিসিয়াল ওয়েবসাইট নয়। LIC বা IRDAI এর সাথে আমাদের কোনো অংশীদারিত্ব বা সংশ্লিষ্টতা নেই।',
          '"LIC" এবং পলিসির নামসমূহ তাদের সংশ্লিষ্ট মালিকদের ট্রেডমার্ক এবং এখানে কেবলমাত্র বর্ণনামূলক উদ্দেশ্যে ব্যবহৃত হয়েছে।'
        ],
        alert: {
          type: 'warning',
          text: 'কোনো অনিরাপদ ওয়েবসাইটে আপনার পলিসি পাসওয়ার্ড বা পেমেন্ট ওটিপি শেয়ার করবেন না। অফিসিয়াল সেবার জন্য licindia.in ব্যবহার করুন।'
        }
      },
      {
        title: '৩. ক্যালকুলেটর ফলাফল ও অনুমানের সীমাবদ্ধতা',
        paragraphs: [
          'প্রদর্শিত সমস্ত সারেন্ডার ভ্যালু, লোন এবং ম্যাচিউরিটির ফলাফল গাণিতিক অনুমান মাত্র। প্রকৃত মান পলিসির শর্তাবলী এবং LIC-এর বর্তমান বোনাস হারের উপর নির্ভর করে।'
        ]
      },
      {
        title: '৪. পেশাদার আর্থিক পরামর্শ নয়',
        paragraphs: [
          'এখানে প্রদত্ত তথ্য কোনো ব্যক্তিগত আর্থিক বা কর পরামর্শ নয়। কোনো বড় আর্থিক সিদ্ধান্ত নেওয়ার আগে যোগ্য আর্থিক উপদেষ্টার পরামর্শ নিন।'
        ]
      },
      {
        title: '৫. দায়বদ্ধতার সীমাবদ্ধতা ও যোগাযোগ',
        paragraphs: [
          'এই ওয়েবসাইটের অনুমানের ভিত্তিতে নেওয়া কোনো সিদ্ধান্তের ক্ষতির জন্য কর্তৃপক্ষ দায়ী থাকবে না। তথ্যের কোনো অসঙ্গতি থাকলে আমাদের যোগাযোগ পৃষ্ঠার মাধ্যমে জানান।'
        ]
      }
    ],
    relatedLinksHeading: 'সম্পর্কিত আইনি সংস্থান',
    relatedLinks: [
      { label: 'গোপনীয়তা নীতি (Privacy Policy)', url: '/privacy-policy', description: 'আমরা কীভাবে ডেটা সুরক্ষিত রাখি তা জানুন।' },
      { label: 'ব্যবহারের শর্তাবলী (Terms of Service)', url: '/terms', description: 'ওয়েবসাইট ব্যবহারের শর্তাবলী পড়ুন।' },
      { label: 'আমাদের সম্পর্কে (About Us)', url: '/about', description: 'আমাদের মিশন সম্পর্কে বিস্তারিত জানুন।' },
      { label: 'সকল ক্যালকুলেটর', url: '/calculators', description: 'আমাদের ১৬টি বীমা ক্যালকুলেটর দেখুন।' }
    ]
  },
  ta: {
    seoTitle: 'LIC கால்குலேட்டர் மறுப்புரை | சுயாதீன நிதி கருவிகள் பொறுப்புத் துறப்பு',
    metaDescription: 'lic-calculators.com இன் அதிகாரப்பூர்வ சட்ட மறுப்புரையைப் படியுங்கள். சுயாதீன நிதி கால்குலேட்டர்கள், மதிப்பீடுகளின் வரம்புகள் மற்றும் தொடர்பின்மை பற்றிய தெளிவான அறிவிப்பு.',
    h1: 'மறுப்புரை (Disclaimer)',
    subtitle: 'சுயாதீன தளத்தின் நிலை, கால்குலேட்டர் மதிப்பீட்டு வரம்புகள் மற்றும் கல்வி நோக்கம் குறித்த சட்டபூர்வ அறிவிப்பு.',
    lastUpdatedLabel: 'கடைசி புதுப்பிப்பு',
    lastUpdatedDate: 'ஆகஸ்ட் 2026',
    bannerNotice: {
      title: 'சுயாதீன நிதி தள அறிவிப்பு',
      text: 'lic-calculators.com என்பது ஒரு சுயாதீனமான கல்வி மற்றும் கணக்கீட்டு தளமாகும். இது இந்திய ஆயுள் காப்பீட்டுக் கழகம் (LIC) அல்லது எந்தவொரு அரசு நிறுவனத்துடனும் இணைக்கப்படவில்லை அல்லது அங்கீகரிக்கப்படவில்லை.'
    },
    sections: [
      {
        title: '1. சேவையின் தன்மை மற்றும் நோக்கம்',
        paragraphs: [
          'lic-calculators.com தளத்திற்கு உங்களை வரவேற்கிறோம். இந்த மறுப்புரை எங்கள் நிதி கால்குலேட்டர்கள் மற்றும் கட்டுரைகளைப் பயன்படுத்துவதற்கான சட்ட வரம்புகளை விளக்குகிறது.',
          'இந்த இணையதளத்தில் உள்ள அனைத்து கருவிகளும் பொதுவான தகவல், கல்வி மற்றும் தனிப்பட்ட திட்டமிடல் நோக்கங்களுக்காக மட்டுமே. நாங்கள் காப்பீட்டுக் கொள்கைகளை விற்பனை செய்வதில்லை.'
        ]
      },
      {
        title: '2. சுயாதீன தளம் மற்றும் தொடர்பின்மை அறிவிப்பு',
        paragraphs: [
          'இந்த தளம் இந்திய ஆயுள் காப்பீட்டுக் கழகத்தின் (LIC) அதிகாரப்பூர்வ தளம் அல்ல என்பதை நாங்கள் வெளிப்படையாக அறிவிக்கிறோம். LIC அல்லது IRDAI உடன் எங்களுக்கு எந்த வணிக தொடர்பும் இல்லை.',
          '"LIC" மற்றும் திட்டப் பெயர்கள் அவற்றின் உரிமையாளர்களின் வர்த்தக முத்திரைகளாகும். அவை குறிப்பு நோக்கங்களுக்காக மட்டுமே இங்கு பயன்படுத்தப்பட்டுள்ளன.'
        ],
        alert: {
          type: 'warning',
          text: 'எந்தவொரு மூன்றாம் தரப்பு தளத்திலும் கொள்கை கடவுச்சொல் அல்லது கட்டண OTP-ஐ பகிர வேண்டாம். அனைத்து அதிகாரப்பூர்வ சேவைகளுக்கும் licindia.in ஐப் பயன்படுத்தவும்.'
        }
      },
      {
        title: '3. கால்குலேட்டர் முடிவுகளின் தன்மை',
        paragraphs: [
          'காட்டப்படும் அனைத்து சரண்டர் மதிப்பு, கடன் மற்றும் முதிர்வுத் தொகைகள் கணித ரீதியான தோராய மதிப்பீடுகள் மட்டுமே. துல்லியமான தகவல்களுக்கு LIC அதிகாரப்பூர்வ கிளையை அணுகவும்.'
        ]
      },
      {
        title: '4. தொழில்முறை ஆலோசனையல்ல',
        paragraphs: [
          'இங்குள்ள தகவல்கள் தனிப்பட்ட நிதி அல்லது வரி ஆலோசனையாகாது. முக்கிய முடிவுகளை எடுப்பதற்கு முன் சான்றளிக்கப்பட்ட நிதி ஆலோசகரை அணுகவும்.'
        ]
      },
      {
        title: '5. பொறுப்பு வரம்பு மற்றும் தொடர்பு',
        paragraphs: [
          'தளத்தின் மதிப்பீடுகளின் அடிப்படையில் எடுக்கப்படும் முடிவுகளுக்கு தளம் பொறுப்பேற்காது. ஏதேனும் முரண்பாடுகள் இருந்தால் தொடர்பு பக்கத்தின் மூலம் தெரிவிக்கலாம்.'
        ]
      }
    ],
    relatedLinksHeading: 'தொடர்புடைய சட்ட வளங்கள்',
    relatedLinks: [
      { label: 'தனியுரிமைக் கொள்கை (Privacy Policy)', url: '/privacy-policy', description: 'தரவு பாதுகாப்பு நடைமுறைகளைப் பார்க்கவும்.' },
      { label: 'பயன்பாட்டு விதிமுறைகள் (Terms of Service)', url: '/terms', description: 'பயன்பாட்டு விதிகளைப் படிக்கவும்.' },
      { label: 'எங்களைப் பற்றி (About Us)', url: '/about', description: 'எங்கள் குழு மற்றும் நோக்கத்தை அறியவும்.' },
      { label: 'அனைத்து கால்குலேட்டர்கள்', url: '/calculators', description: 'எங்கள் 16 கால்குலேட்டர்களை ஆராயுங்கள்.' }
    ]
  },
  te: {
    seoTitle: 'LIC కాలిక్యులేటర్ డిస్క్లైమర్ | స్వతంత్ర ఆర్థిక సాధనాల నిరాకరణ పత్రం',
    metaDescription: 'lic-calculators.com యొక్క అధికారిక చట్టపరమైన నిరాకరణను చదవండి. స్వతంత్ర ఆర్థిక కాలిక్యులేటర్లు, అంచనాల పరిమితులు మరియు అనుబంధం లేని స్పష్టమైన ప్రకటన.',
    h1: 'డిస్క్లైమర్ (Disclaimer)',
    subtitle: 'స్వతంత్ర ప్లాట్‌ఫారమ్ స్థితి, కాలిక్యులేటర్ అంచనాల పరిమితులు మరియు విద్యా ప్రయోజనాలపై చట్టపరమైన ప్రకటన.',
    lastUpdatedLabel: 'చివరి నవీకరణ',
    lastUpdatedDate: 'ఆగస్టు 2026',
    bannerNotice: {
      title: 'స్వతంత్ర ఆర్థిక ప్లాట్‌ఫారమ్ నోటీసు',
      text: 'lic-calculators.com అనేది స్వతంత్ర విద్యా మరియు గణన పోర్టల్. ఇది లైఫ్ ఇన్సూరెన్స్ కార్పొరేషన్ ఆఫ్ ఇండియా (LIC) లేదా ఏ ప్రభుత్వ సంస్థతోనూ అనుబంధించబడలేదు లేదా ఆమోదించబడలేదు.'
    },
    sections: [
      {
        title: '1. సేవ యొక్క స్వభావం మరియు ఉద్దేశ్యం',
        paragraphs: [
          'lic-calculators.com కి స్వాగతం. ఈ డిస్క్లైమర్ మా ఆర్థిక కాలిక్యులేటర్లు మరియు వ్యాసాల వినియోగానికి సంబంధించిన చట్టపరమైన నిబంధనలను స్పష్టం చేస్తుంది.',
          'ఈ వెబ్‌సైట్‌లోని అన్ని సాధనాలు కేవలం సాధారణ సమాచారం, విద్య మరియు వ్యక్తిగత ఆర్థిక ప్రణాళిక ప్రయోజనాల కోసం మాత్రమే రూపొందించబడ్డాయి. మేము ఎటువంటి బీమా పాలసీలను విక్రయించము.'
        ]
      },
      {
        title: '2. స్వతంత్ర ప్లాట్‌ఫారమ్ మరియు అనుబంధం లేని ప్రకటన',
        paragraphs: [
          'ఇది లైఫ్ ఇన్సూరెన్స్ కార్పొరేషన్ ఆఫ్ ఇండియా (LIC) యొక్క అధికారిక వెబ్‌సైట్ కాదని మేము స్పష్టంగా తెలియజేస్తున్నాము. LIC లేదా IRDAI తో మాకు ఎటువంటి ఏజెన్సీ లేదా వాణిజ్య భాగస్వామ్యం లేదు.',
          '"LIC" మరియు పాలసీల పేర్లు వాటి సంబంధిత చట్టబద్ధమైన యజమానుల ఆస్తి. ఇక్కడ వాటి ప్రస్తావన కేవలం గుర్तिంపు మరియు వివరణ ప్రయోజనాల కోసమే.'
        ],
        alert: {
          type: 'warning',
          text: 'ఏ అనధికారిక వెబ్‌సైట్‌లోనూ పాలసీ పాస్‌వర్డ్ లేదా చెల్లింపు OTP ని నమోదు చేయవద్దు. అన్ని అధికారిక సేవల కోసం licindia.in ని ఉపయోగించండి.'
        }
      },
      {
        title: '3. కాలిక్యులేటర్ అంచనాలు మరియు ఫలితాల పరిమితులు',
        paragraphs: [
          'చూపించబడే అన్ని సరెండర్ విలువ, లోన్ మరియు మెచ్యూరిటీ మొత్తాలు గణిత అంచనాలు మాత్రమే. ఖచ్చితమైన విలువల కోసం LIC అధికారిక శాఖను లేదా licindia.in ను సంప్రదించండి.'
        ]
      },
      {
        title: '4. వృత్తిపరమైన ఆర్థిక సలహా కాదు',
        paragraphs: [
          'ఈ సమాచారం వ్యక్తిగత ఆర్థిక లేదా పన్ను సలహా కాదు. ముఖ్యమైన ఆర్థిక నిర్ణయాలు తీసుకునే ముందు ధృవీకరించబడిన ఆర్థిక సలహాదారుని సంప్రదించండి.'
        ]
      },
      {
        title: '5. బాధ్యత పరిమితి మరియు సంప్రదింపులు',
        paragraphs: [
          'ఈ వెబ్‌సైట్ అంచనాల ఆధారంగా తీసుకున్న నిర్ణయాల నష్టాలకు నిర్వాహకులు బాధ్యత వహించరు. ఏదైనా సవరణల కోసం సంప్రదింపు పేజీ ద్వారా మాకు తెలియజేయవచ్చు.'
        ]
      }
    ],
    relatedLinksHeading: 'సంబంధిత చట్టపరమైన వనరులు',
    relatedLinks: [
      { label: 'గోప్యతా విధానం (Privacy Policy)', url: '/privacy-policy', description: 'మేము డేటాను ఎలా సురక్షితంగా ఉంచుతామో చూడండి.' },
      { label: 'వినియోగ నిబంధనలు (Terms of Service)', url: '/terms', description: 'వినియోగ నిబంధనలను చదవండి.' },
      { label: 'మా గురించి (About Us)', url: '/about', description: 'మా స్వతంత్ర లక్ష్యం గురించి తెలుసుకోండి.' },
      { label: 'అన్ని కాలిక్యులేటర్లు', url: '/calculators', description: 'మా 16 కాలిక్యులేటర్లను చూడండి.' }
    ]
  }
};

export function getDisclaimerContent(locale: Locale): DisclaimerPageData {
  return DISCLAIMER_CONTENT[locale] || DISCLAIMER_CONTENT.en;
}