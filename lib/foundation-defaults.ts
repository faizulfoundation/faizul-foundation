import {
  BannerSlide,
  ContactConfig,
  ImpactMetrics,
  LegalPolicy,
  ProjectStage,
  ShowcaseProject,
  SiteContent,
} from './types';

export const FOUNDATION_NAME = 'Faizul Foundation';
export const FOUNDATION_TAGLINE =
  'Serving Humanity • Supporting Education • Strengthening Madrasas & Masjids';
export const DEFAULT_HELPLINE = '7983035055';
export const DEFAULT_EMAIL = 'faizulfoundation@gmail.com';
export const ADDRESS_PLACEHOLDER = '[To be updated by Administrator]';
export const DATA_COMING_SOON_LABEL = 'Data Coming Soon';
export const BOOTSTRAPPED_ADMIN_EMAILS = [
  'faizul8057@gmail.com',
  'faizulfoundation@gmail.com',
];

export const OFFICIAL_IMAGES = {
  logo: '/images/logo.jpg',
  humanityBanner: '/images/banner-humanity.jpg',
  madrasaBanner: '/images/banner-madrasa.jpg',
  masjidBanner: '/images/banner-masjid.jpg',
  missionBanner: '/images/banner-mission.jpg',
} as const;

export const HERO_BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'serving-humanity',
    imageSrc: OFFICIAL_IMAGES.humanityBanner,
    imageAlt:
      'Faizul Foundation volunteer delivering essential humanitarian aid beside students and a local madrasa',
    eyebrow: 'Serving Humanity',
    title: 'Education, Madrasa, Masjid & Family Support',
    caption:
      'Standing beside poor and needy families, supporting Islamic education, and strengthening neighborhood institutions with care and dignity.',
    stageLabel: 'Mission Overview',
  },
  {
    id: 'madrasa-project',
    imageSrc: OFFICIAL_IMAGES.madrasaBanner,
    imageAlt:
      'Proposed Madrasa and Students Hostel construction concept banner by Faizul Foundation',
    eyebrow: 'Educational Initiative · Proposed / Work in Progress',
    title: 'Proposed Madrasa & Students Hostel',
    caption:
      'Planning and groundwork for a centre dedicated to Islamic education, safe student accommodation, prayer, and character building.',
    stageLabel: 'Work in Progress',
  },
  {
    id: 'masjid-project',
    imageSrc: OFFICIAL_IMAGES.masjidBanner,
    imageAlt:
      'Masjid Construction Project visual concept banner by Faizul Foundation',
    eyebrow: 'Community Worship · Proposed / Work in Progress',
    title: 'Masjid Construction Initiative',
    caption:
      'Architectural planning toward a clean, peaceful House of Allah for daily prayer, Islamic learning, and neighborhood unity.',
    stageLabel: 'Proposed',
  },
  {
    id: 'our-mission',
    imageSrc: OFFICIAL_IMAGES.missionBanner,
    imageAlt:
      'Faizul Foundation team reviewing community assistance priorities around a conference table',
    eyebrow: 'Accountability & Service',
    title: 'Verified Review & Transparent Governance',
    caption:
      'Every help request is reviewed privately and respectfully so support reaches genuine cases without compromising applicant dignity.',
    stageLabel: 'Mission Overview',
  },
];

export const WORK_AREAS = [
  {
    code: '01',
    title: 'Education Support',
    description:
      'Assisting students from financially vulnerable households with essential academic fees, textbooks, and educational continuity.',
    categoryMatch: 'Education Support',
  },
  {
    code: '02',
    title: 'Madrasa Support',
    description:
      'Supporting Islamic seminaries with student welfare, educational resources, and planned infrastructure improvements.',
    categoryMatch: 'Madrasa Support',
  },
  {
    code: '03',
    title: 'Masjid Support',
    description:
      'Helping local masjids sustain clean, accessible, and welcoming spaces for worship, community guidance, and learning.',
    categoryMatch: 'Masjid Support',
  },
  {
    code: '04',
    title: 'Food and Basic Needs',
    description:
      'Coordinating essential ration kits and urgent household necessities for families navigating acute hardship.',
    categoryMatch: 'Food and Basic Needs',
  },
  {
    code: '05',
    title: 'Financial Assistance',
    description:
      'Case-by-case emergency financial relief following confidential review and direct verification of urgent need.',
    categoryMatch: 'Financial Assistance',
  },
  {
    code: '06',
    title: 'Humanitarian & Community Services',
    description:
      'Responding with compassion to neighborhood welfare needs, seasonal relief efforts, and local community solidarity.',
    categoryMatch: 'Other Assistance',
  },
  {
    code: '07',
    title: 'Family Assistance',
    description:
      'Standing alongside widowed, elderly, and struggling households with respectful, private guidance and practical aid.',
    categoryMatch: 'Other Assistance',
  },
] as const;

export const INITIAL_SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'showcase-madrasa-hostel',
    title: 'Proposed Madrasa & Students Hostel',
    stage: ProjectStage.WORK_IN_PROGRESS,
    location: 'To be confirmed upon site verification',
    dateLabel: 'Planning & Work in Progress',
    imageSrc: OFFICIAL_IMAGES.madrasaBanner,
    summary:
      'Concept and ongoing development plan for a centre dedicated to Islamic education, safe student accommodation, and character building.',
    details:
      'This visual showcase represents Faizul Foundation’s proposed Madrasa and Students Hostel initiative. Shown strictly as a Proposed / Work in Progress concept—never as a completed facility—verified construction milestones will be published here once officially confirmed.',
    focusPoints: [
      'Islamic Education & Structured Learning',
      'Safe Student Accommodation',
      'Dedicated Space for Prayer & Worship',
      'Knowledge & Character Building',
    ],
  },
  {
    id: 'showcase-masjid-construction',
    title: 'Masjid Construction Initiative',
    stage: ProjectStage.PROPOSED,
    location: 'Community site planning stage',
    dateLabel: 'Proposed Concept',
    imageSrc: OFFICIAL_IMAGES.masjidBanner,
    summary:
      'Architectural concept for building a clean, peaceful House of Allah for worship, Islamic learning, and community services.',
    details:
      'This conceptual project outlines our long-term vision for supporting community masjid construction. In keeping with our commitment to strict honesty, this initiative is clearly labeled Proposed until verified groundwork and construction records are published by the administrator.',
    focusPoints: [
      'Accessible & Peaceful Prayer Hall',
      'Islamic Education for Youth & Adults',
      'Clean & Peaceful Community Space',
      'Long-Term Community Welfare Services',
    ],
  },
  {
    id: 'showcase-humanity-outreach',
    title: 'Serving Humanity & Family Welfare Outreach',
    stage: ProjectStage.WORK_IN_PROGRESS,
    location: 'Community Outreach Desk',
    dateLabel: 'Active Mission Program',
    imageSrc: OFFICIAL_IMAGES.humanityBanner,
    summary:
      'Direct community outreach connecting vulnerable families and students with respectful, confidential help request intake.',
    details:
      'Our core operational program welcomes private requests for Education Support, Madrasa Support, Masjid Support, Food & Basic Needs, and Financial Assistance. Verified completed distributions and field reports are published only as authenticated records become available.',
    focusPoints: [
      'Confidential Intake Without Registration',
      'Education & Student Book Support',
      'Essential Family Food & Ration Relief',
      'Dignity-First Case Verification',
    ],
  },
];

export const CORE_VALUES = [
  {
    title: 'Honesty & Truthfulness',
    description:
      'We never invent achievements, inflated impact numbers, or unverified claims. Where official counts are pending verification, we state Data Coming Soon.',
  },
  {
    title: 'Kindness & Compassion',
    description:
      'Every family and student reaching out is met with warmth, patience, and genuine care rooted in humanitarian service.',
  },
  {
    title: 'Transparency',
    description:
      'Donations remain disabled until complete accountability structures are finalized, and no statutory registration or tax exemption is claimed without verified publication.',
  },
  {
    title: 'Privacy & Dignity',
    description:
      'Applicant names, phone numbers, locations, hardships, and attachments are kept strictly confidential and never displayed publicly.',
  },
  {
    title: 'Community Service',
    description:
      'Strengthening local madrasas, masjids, and families so neighborhoods grow together in learning and mutual support.',
  },
] as const;

export function getDefaultImpactMetrics(): ImpactMetrics {
  return {
    peopleHelped: null,
    studentsSupported: null,
    familiesSupported: null,
    madrasasSupported: null,
    masjidsSupported: null,
    updatedAtMillis: null,
  };
}

export function getDefaultContactConfig(): ContactConfig {
  return {
    contactPerson: 'Faizul Foundation Helpline',
    mobileNumber: DEFAULT_HELPLINE,
    emailAddress: DEFAULT_EMAIL,
    address: ADDRESS_PLACEHOLDER,
    whatsappNumber: DEFAULT_HELPLINE,
    updatedAtMillis: null,
  };
}

export function getDefaultSiteContent(): SiteContent {
  return {
    missionStatement:
      'Helping poor and needy people, supporting Islamic education, and strengthening our communities.',
    homeIntroduction:
      'Faizul Foundation is a community-focused humanitarian initiative dedicated to helping poor and needy families, supporting Muslim students, assisting Madrasas and Masjids, and serving communities with honesty and care.',
    aboutWhoWeAre:
      'Faizul Foundation is a humanitarian and community welfare initiative focused on standing beside people facing hardship. Every step we take is guided by compassion, accountability, and respect for human dignity.',
    aboutWhyCreated:
      'Faizul Foundation was created to bridge genuine community needs with thoughtful, verified assistance—supporting students striving for education, families navigating financial difficulty, and local madrasas and masjids serving their neighborhoods.',
    aboutVision:
      'Our vision is a caring, resilient community where students can pursue learning without hardship, families have access to essential support, and every effort is carried out with verifiable honesty.',
    aboutCommitment:
      'We are committed to honesty, kindness, transparency, and safeguarding the privacy of every person who reaches out to us. We publish only verified figures and genuine activities—never exaggerated claims. Note: No statutory registration, government recognition, or tax exemption is claimed unless verified details are explicitly published here by the foundation.',
    supportUsMessage:
      "We are currently preparing our foundation's support system. Donations are not being accepted at this time.",
    updatedAtMillis: null,
  };
}

export function getDefaultLegalPolicies(): LegalPolicy[] {
  const now = Date.now();
  return [
    {
      policyKey: 'privacy_policy',
      title: 'Privacy Policy',
      sortOrder: 1,
      updatedAtMillis: now,
      content: `Faizul Foundation respects the privacy and dignity of every visitor and applicant.

1. Information We Collect
When you submit a help request, we collect only the details you voluntarily provide: your full name, mobile number, village/city and district, the category of assistance requested, your description of the situation, and any optional document or photo you choose to attach.

2. How Information Is Used
Submitted details are used solely to review your request, contact you if follow-up verification is needed, and coordinate appropriate humanitarian support.

3. Confidentiality & Public Protection
Applicant names, phone numbers, locations, and problem descriptions are strictly private and are never displayed publicly on this website or anywhere else.

4. Data Storage & Review
Your submission is stored securely in Google Firebase Cloud Firestore protected by strict Zero-Trust security rules so only verified Faizul Foundation administrators authenticated via Google Sign-In can review it.

5. Status Tracking Privacy
Each submission receives a unique Reference Code (FF-...) paired with a private Verification PIN. A one-way SHA-256 hash allows you to check only your review stage and category without exposing any personal details.

6. Policy Updates
This policy may be reviewed and updated by the Faizul Foundation administrator prior to and during public operations.`,
    },
    {
      policyKey: 'terms_and_conditions',
      title: 'Terms and Conditions',
      sortOrder: 2,
      updatedAtMillis: now,
      content: `By using the Faizul Foundation website, you agree to the following respectful terms:

1. Accurate Information
Individuals submitting help requests agree to provide truthful, accurate information to the best of their knowledge.

2. No Guarantee of Assistance
Submitting a help request initiates a careful review by the foundation team. It does not guarantee financial or material approval, as support depends on verification and available resources.

3. Appropriate Use
You agree not to submit false requests, automated spam, or misleading attachments.

4. No Financial Transactions
Faizul Foundation is not accepting online or offline donations through this website at this time. Any claims asking for payments or QR transfers on behalf of this website are unauthorized unless explicitly published here by the administrator.

5. Policy Updates
These terms may be updated by the foundation administrator as operations evolve.`,
    },
    {
      policyKey: 'disclaimer',
      title: 'Disclaimer',
      sortOrder: 3,
      updatedAtMillis: now,
      content: `1. Good-Faith Humanitarian Effort
Information on this website is provided in good faith for community awareness and confidential help request intake.

2. Verification & Truthfulness
Impact counters and activity records are published only when verified by the foundation administrator. Where verified figures are not yet available, "Data Coming Soon" is displayed. Concept or construction visuals are explicitly labeled "Proposed" or "Work in Progress" when not yet completed.

3. Legal Status Clarification
Unless explicitly updated with verified registration records by the foundation administrator, this website makes no claim of government registration, statutory recognition, tax exemption, or certified charity status.

4. External Communication Links
Opening WhatsApp, phone dialer, or email links launches external communication applications governed by those providers' terms and privacy practices.`,
    },
    {
      policyKey: 'data_protection',
      title: 'Data Protection Policy',
      sortOrder: 4,
      updatedAtMillis: now,
      content: `1. Purpose Limitation
Help request records and optional attachments are collected exclusively for humanitarian assessment and follow-up.

2. Access Restriction
Public visitors have zero access to submitted help requests. Only verified foundation administrators signed in via Google Sign-In can view, review, update status, or remove requests under Firebase Security Rules.

3. Attachment Protection & Deletion
Optional photos or documents uploaded with a request are compressed locally in your browser before secure submission and are completely deleted if the administrator deletes the request.

4. Respectful Handling
All personal hardships shared with Faizul Foundation are treated with strict discretion, non-judgment, and respect.`,
    },
    {
      policyKey: 'cookie_policy',
      title: 'Cookie & Local Storage Policy',
      sortOrder: 5,
      updatedAtMillis: now,
      content: `1. No Advertising or Tracking Cookies
This website does not use third-party advertising trackers, behavioral profiling, analytics pixels, or marketing cookies.

2. Essential Cloud, Cache & Local Storage
To function reliably across mobile and desktop browsers (including Progressive Web App offline support), this website uses:
- Firebase Cloud Firestore & Firebase Authentication session storage (strictly for administrator sign-in and public content syncing).
- Browser Service Worker cache for fast offline loading of public pages and static foundation images (never caching private admin views or applicant data).
- Essential localStorage cooldown timestamps on your device to prevent accidental duplicate form submissions and protect against spam.

3. Managing Browser Storage
You may clear your browser cache, cookies, or local storage at any time from your browser settings.`,
    },
    {
      policyKey: 'contact_information',
      title: 'Contact Information Notice',
      sortOrder: 6,
      updatedAtMillis: now,
      content: `Official contact details for Faizul Foundation are maintained by the foundation administrator on the Contact Us page.

If specific contact fields currently display "[To be updated by Administrator]", official office address or secondary details are still being finalized before publication.

For questions regarding a submitted help request or privacy concern, please reach out through the official helpline, WhatsApp, or email listed on the Contact Us page.`,
    },
  ];
}

export const POLICY_ROUTE_MAP: Record<string, string> = {
  'privacy-policy': 'privacy_policy',
  'terms-and-conditions': 'terms_and_conditions',
  disclaimer: 'disclaimer',
  'data-protection': 'data_protection',
  'cookie-policy': 'cookie_policy',
  'contact-information': 'contact_information',
};
