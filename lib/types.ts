export enum HelpCategory {
  FINANCIAL_ASSISTANCE = 'Financial Assistance',
  EDUCATION_SUPPORT = 'Education Support',
  MADRASA_SUPPORT = 'Madrasa Support',
  MASJID_SUPPORT = 'Masjid Support',
  FOOD_AND_BASIC_NEEDS = 'Food and Basic Needs',
  OTHER_ASSISTANCE = 'Other Assistance',
}

export const HELP_CATEGORIES: HelpCategory[] = [
  HelpCategory.FINANCIAL_ASSISTANCE,
  HelpCategory.EDUCATION_SUPPORT,
  HelpCategory.MADRASA_SUPPORT,
  HelpCategory.MASJID_SUPPORT,
  HelpCategory.FOOD_AND_BASIC_NEEDS,
  HelpCategory.OTHER_ASSISTANCE,
];

export enum RequestStatus {
  PENDING_REVIEW = 'Pending Review',
  UNDER_REVIEW = 'Under Review',
  VERIFIED = 'Verified',
  ASSISTED = 'Assisted',
  CLOSED = 'Closed',
}

export const REQUEST_STATUSES: RequestStatus[] = [
  RequestStatus.PENDING_REVIEW,
  RequestStatus.UNDER_REVIEW,
  RequestStatus.VERIFIED,
  RequestStatus.ASSISTED,
  RequestStatus.CLOSED,
];

export enum ProjectStage {
  COMPLETED = 'Completed',
  WORK_IN_PROGRESS = 'Work in Progress',
  PROPOSED = 'Proposed',
}

export const PROJECT_STAGES: ProjectStage[] = [
  ProjectStage.COMPLETED,
  ProjectStage.WORK_IN_PROGRESS,
  ProjectStage.PROPOSED,
];

export interface HelpRequestRecord {
  referenceCode: string;
  fullName: string;
  mobileNumber: string;
  location: string;
  category: HelpCategory;
  description: string;
  attachmentName: string | null;
  attachmentMimeType: string | null;
  attachmentDataUrl: string | null;
  consentAccepted: boolean;
  status: RequestStatus;
  adminNotes: string;
  statusLookupId: string | null;
  createdAtMillis: number;
  updatedAtMillis: number;
}

export interface RequestStatusResult {
  referenceCode: string;
  category: HelpCategory;
  status: RequestStatus;
  createdAtMillis: number;
  updatedAtMillis: number;
}

export interface FoundationActivity {
  id: string;
  title: string;
  description: string;
  activityDate: string;
  location: string;
  photoUrls: string[];
  isPublished: boolean;
  projectStage: ProjectStage;
  createdAtMillis: number;
  updatedAtMillis: number;
}

export interface ImpactMetrics {
  peopleHelped: number | null;
  studentsSupported: number | null;
  familiesSupported: number | null;
  madrasasSupported: number | null;
  masjidsSupported: number | null;
  updatedAtMillis: number | null;
}

export interface ContactConfig {
  contactPerson: string;
  mobileNumber: string;
  emailAddress: string;
  address: string;
  whatsappNumber: string;
  updatedAtMillis: number | null;
}

export interface SiteContent {
  missionStatement: string;
  homeIntroduction: string;
  aboutWhoWeAre: string;
  aboutWhyCreated: string;
  aboutVision: string;
  aboutCommitment: string;
  supportUsMessage: string;
  updatedAtMillis: number | null;
}

export interface LegalPolicy {
  policyKey: string;
  title: string;
  content: string;
  sortOrder: number;
  updatedAtMillis: number;
}

export interface BannerSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  caption: string;
  stageLabel: 'Mission Overview' | 'Work in Progress' | 'Proposed';
}

export interface ShowcaseProject {
  id: string;
  title: string;
  stage: ProjectStage;
  location: string;
  dateLabel: string;
  imageSrc: string;
  summary: string;
  details: string;
  focusPoints: string[];
}
