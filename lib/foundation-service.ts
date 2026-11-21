import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  auth,
  db,
  handleFirestoreError,
  isBootstrappedAdminEmail,
  OperationType,
} from './firebase';
import {
  getDefaultContactConfig,
  getDefaultImpactMetrics,
  getDefaultLegalPolicies,
  getDefaultSiteContent,
} from './foundation-defaults';
import {
  computeStatusLookupId,
  generateReferenceCode,
  generateTrackingPin,
} from './image-compress';
import {
  ContactConfig,
  FoundationActivity,
  HelpCategory,
  HelpRequestRecord,
  ImpactMetrics,
  LegalPolicy,
  ProjectStage,
  RequestStatus,
  RequestStatusResult,
  SiteContent,
} from './types';

export const COLLECTIONS = {
  HELP_REQUESTS: 'help_requests',
  STATUS_LOOKUPS: 'request_status_lookups',
  ACTIVITIES: 'activities',
  IMPACT: 'impact_metrics',
  CONTACT: 'contact_config',
  SITE_CONTENT: 'site_content',
  LEGAL_POLICIES: 'legal_policies',
  ADMINS: 'admins',
} as const;

export const DOC_CURRENT = 'current';
const LAST_SUBMISSION_STORAGE_KEY = 'ff_last_help_submission_ms';
const SUBMISSION_COOLDOWN_MS = 20_000;

function toMillis(value: unknown, fallback = Date.now()): number {
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === 'number') return value;
  return fallback;
}

function toNullableInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
  return null;
}

export function getSubmissionCooldownRemainingSec(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(LAST_SUBMISSION_STORAGE_KEY);
    if (!raw) return 0;
    const elapsed = Date.now() - Number(raw);
    if (elapsed >= SUBMISSION_COOLDOWN_MS) return 0;
    return Math.max(1, Math.ceil((SUBMISSION_COOLDOWN_MS - elapsed) / 1000));
  } catch {
    return 0;
  }
}

function recordHelpSubmissionTimestamp(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LAST_SUBMISSION_STORAGE_KEY, String(Date.now()));
  } catch {
    // Ignore storage unavailability in private browsing
  }
}

export async function checkIsAuthorizedAdmin(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  if (isBootstrappedAdminEmail(user.email, user.emailVerified)) return true;
  if (!user.emailVerified) return false;

  const adminPath = `${COLLECTIONS.ADMINS}/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.ADMINS, user.uid));
    return snap.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, adminPath);
  }
}

export function subscribePublishedActivities(
  onData: (items: FoundationActivity[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.ACTIVITIES), where('isPublished', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: FoundationActivity[] = snapshot.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: String(data.title ?? ''),
            description: String(data.description ?? ''),
            activityDate: String(data.activityDate ?? ''),
            location: String(data.location ?? ''),
            photoUrls: Array.isArray(data.photoUrls) ? data.photoUrls.map(String) : [],
            isPublished: Boolean(data.isPublished ?? true),
            projectStage: (data.projectStage as ProjectStage) || ProjectStage.COMPLETED,
            createdAtMillis: toMillis(data.createdAt),
            updatedAtMillis: toMillis(data.updatedAt),
          };
        })
        .sort((a, b) => b.createdAtMillis - a.createdAtMillis);
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.ACTIVITIES);
      } catch (wrapped) {
        onError?.(wrapped as Error);
      }
    }
  );
}

export function subscribeAllActivitiesForAdmin(
  onData: (items: FoundationActivity[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.ACTIVITIES),
    (snapshot) => {
      const list: FoundationActivity[] = snapshot.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: String(data.title ?? ''),
            description: String(data.description ?? ''),
            activityDate: String(data.activityDate ?? ''),
            location: String(data.location ?? ''),
            photoUrls: Array.isArray(data.photoUrls) ? data.photoUrls.map(String) : [],
            isPublished: Boolean(data.isPublished ?? true),
            projectStage: (data.projectStage as ProjectStage) || ProjectStage.COMPLETED,
            createdAtMillis: toMillis(data.createdAt),
            updatedAtMillis: toMillis(data.updatedAt),
          };
        })
        .sort((a, b) => b.createdAtMillis - a.createdAtMillis);
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.ACTIVITIES);
      } catch (wrapped) {
        onError?.(wrapped as Error);
      }
    }
  );
}

export function subscribeImpactMetrics(
  onData: (metrics: ImpactMetrics) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = `${COLLECTIONS.IMPACT}/${DOC_CURRENT}`;
  return onSnapshot(
    doc(db, COLLECTIONS.IMPACT, DOC_CURRENT),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(getDefaultImpactMetrics());
        return;
      }
      const data = snapshot.data();
      onData({
        peopleHelped: toNullableInt(data.peopleHelped),
        studentsSupported: toNullableInt(data.studentsSupported),
        familiesSupported: toNullableInt(data.familiesSupported),
        madrasasSupported: toNullableInt(data.madrasasSupported),
        masjidsSupported: toNullableInt(data.masjidsSupported),
        updatedAtMillis: data.updatedAt ? toMillis(data.updatedAt) : null,
      });
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (wrapped) {
        onError?.(wrapped as Error);
      }
    }
  );
}

export function subscribeContactConfig(
  onData: (config: ContactConfig) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = `${COLLECTIONS.CONTACT}/${DOC_CURRENT}`;
  return onSnapshot(
    doc(db, COLLECTIONS.CONTACT, DOC_CURRENT),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(getDefaultContactConfig());
        return;
      }
      const data = snapshot.data();
      const defaults = getDefaultContactConfig();
      onData({
        contactPerson: String(data.contactPerson ?? defaults.contactPerson),
        mobileNumber: String(data.mobileNumber ?? defaults.mobileNumber),
        emailAddress: String(data.emailAddress ?? defaults.emailAddress),
        address: String(data.address ?? defaults.address),
        whatsappNumber: String(data.whatsappNumber ?? defaults.whatsappNumber),
        updatedAtMillis: data.updatedAt ? toMillis(data.updatedAt) : null,
      });
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (wrapped) {
        onError?.(wrapped as Error);
      }
    }
  );
}

export function subscribeSiteContent(
  onData: (content: SiteContent) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = `${COLLECTIONS.SITE_CONTENT}/${DOC_CURRENT}`;
  return onSnapshot(
    doc(db, COLLECTIONS.SITE_CONTENT, DOC_CURRENT),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(getDefaultSiteContent());
        return;
      }
      const data = snapshot.data();
      const defaults = getDefaultSiteContent();
      onData({
        missionStatement: String(data.missionStatement ?? defaults.missionStatement),
        homeIntroduction: String(data.homeIntroduction ?? defaults.homeIntroduction),
        aboutWhoWeAre: String(data.aboutWhoWeAre ?? defaults.aboutWhoWeAre),
        aboutWhyCreated: String(data.aboutWhyCreated ?? defaults.aboutWhyCreated),
        aboutVision: String(data.aboutVision ?? defaults.aboutVision),
        aboutCommitment: String(data.aboutCommitment ?? defaults.aboutCommitment),
        supportUsMessage: String(data.supportUsMessage ?? defaults.supportUsMessage),
        updatedAtMillis: data.updatedAt ? toMillis(data.updatedAt) : null,
      });
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (wrapped) {
        onError?.(wrapped as Error);
      }
    }
  );
}

export function subscribeLegalPolicies(
  onData: (policies: LegalPolicy[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.LEGAL_POLICIES),
    (snapshot) => {
      const defaults = getDefaultLegalPolicies();
      if (snapshot.empty) {
        onData(defaults);
        return;
      }
      const map = new Map<string, LegalPolicy>();
      for (const policy of defaults) {
        map.set(policy.policyKey, policy);
      }
      for (const d of snapshot.docs) {
        const data = d.data();
        map.set(d.id, {
          policyKey: d.id,
          title: String(data.title ?? ''),
          content: String(data.content ?? ''),
          sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 99,
          updatedAtMillis: toMillis(data.updatedAt),
        });
      }
      onData(Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.LEGAL_POLICIES);
      } catch (wrapped) {
        onError?.(wrapped as Error);
      }
    }
  );
}

export async function submitHelpRequest(input: {
  fullName: string;
  mobileNumber: string;
  location: string;
  category: HelpCategory;
  description: string;
  attachmentName: string | null;
  attachmentMimeType: string | null;
  attachmentDataUrl: string | null;
  consentAccepted: boolean;
}): Promise<{ referenceCode: string; trackingPin: string }> {
  const remaining = getSubmissionCooldownRemainingSec();
  if (remaining > 0) {
    throw new Error(`Please wait ${remaining} seconds before submitting another request.`);
  }

  const referenceCode = generateReferenceCode();
  const trackingPin = generateTrackingPin();
  const statusLookupId = await computeStatusLookupId(referenceCode, trackingPin);

  const batch = writeBatch(db);
  const requestRef = doc(db, COLLECTIONS.HELP_REQUESTS, referenceCode);
  const lookupRef = doc(db, COLLECTIONS.STATUS_LOOKUPS, statusLookupId);

  batch.set(requestRef, {
    referenceCode,
    fullName: input.fullName.trim(),
    mobileNumber: input.mobileNumber.trim(),
    location: input.location.trim(),
    category: input.category,
    description: input.description.trim(),
    attachmentName: input.attachmentName,
    attachmentMimeType: input.attachmentMimeType,
    attachmentDataUrl: input.attachmentDataUrl,
    consentAccepted: input.consentAccepted,
    status: RequestStatus.PENDING_REVIEW,
    adminNotes: '',
    statusLookupId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.set(lookupRef, {
    requestRef: referenceCode,
    category: input.category,
    status: RequestStatus.PENDING_REVIEW,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
    recordHelpSubmissionTimestamp();
    return { referenceCode, trackingPin };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTIONS.HELP_REQUESTS}/${referenceCode}`);
  }
}

export async function lookupHelpRequestStatus(
  referenceCode: string,
  trackingPin: string
): Promise<RequestStatusResult | null> {
  const cleanCode = referenceCode.trim().toUpperCase();
  const cleanPin = trackingPin.trim().toUpperCase();
  if (!cleanCode.startsWith('FF-') || cleanPin.length < 6) {
    return null;
  }

  const lookupId = await computeStatusLookupId(cleanCode, cleanPin);
  const path = `${COLLECTIONS.STATUS_LOOKUPS}/${lookupId}`;
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.STATUS_LOOKUPS, lookupId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      referenceCode: String(data.requestRef ?? cleanCode),
      category: data.category as HelpCategory,
      status: data.status as RequestStatus,
      createdAtMillis: toMillis(data.createdAt),
      updatedAtMillis: toMillis(data.updatedAt),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeHelpRequestsForAdmin(
  onData: (requests: HelpRequestRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.HELP_REQUESTS),
    (snapshot) => {
      const list: HelpRequestRecord[] = snapshot.docs
        .map((d) => {
          const data = d.data();
          return {
            referenceCode: String(data.referenceCode ?? d.id),
            fullName: String(data.fullName ?? ''),
            mobileNumber: String(data.mobileNumber ?? ''),
            location: String(data.location ?? ''),
            category: data.category as HelpCategory,
            description: String(data.description ?? ''),
            attachmentName: data.attachmentName ? String(data.attachmentName) : null,
            attachmentMimeType: data.attachmentMimeType ? String(data.attachmentMimeType) : null,
            attachmentDataUrl: data.attachmentDataUrl ? String(data.attachmentDataUrl) : null,
            consentAccepted: Boolean(data.consentAccepted),
            status: (data.status as RequestStatus) || RequestStatus.PENDING_REVIEW,
            adminNotes: String(data.adminNotes ?? ''),
            statusLookupId: data.statusLookupId ? String(data.statusLookupId) : null,
            createdAtMillis: toMillis(data.createdAt),
            updatedAtMillis: toMillis(data.updatedAt),
          };
        })
        .sort((a, b) => b.createdAtMillis - a.createdAtMillis);
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.HELP_REQUESTS);
      } catch (wrapped) {
        onError?.(wrapped as Error);
      }
    }
  );
}

export async function updateHelpRequestReview(params: {
  referenceCode: string;
  statusLookupId: string | null;
  status: RequestStatus;
  adminNotes: string;
}): Promise<void> {
  const path = `${COLLECTIONS.HELP_REQUESTS}/${params.referenceCode}`;
  const batch = writeBatch(db);
  batch.update(doc(db, COLLECTIONS.HELP_REQUESTS, params.referenceCode), {
    status: params.status,
    adminNotes: params.adminNotes.trim(),
    updatedAt: serverTimestamp(),
  });

  if (params.statusLookupId && /^[a-f0-9]{64}$/.test(params.statusLookupId)) {
    const lookupSnap = await getDoc(doc(db, COLLECTIONS.STATUS_LOOKUPS, params.statusLookupId));
    if (lookupSnap.exists()) {
      batch.update(doc(db, COLLECTIONS.STATUS_LOOKUPS, params.statusLookupId), {
        status: params.status,
        updatedAt: serverTimestamp(),
      });
    }
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteHelpRequest(
  referenceCode: string,
  statusLookupId: string | null
): Promise<void> {
  const path = `${COLLECTIONS.HELP_REQUESTS}/${referenceCode}`;
  const batch = writeBatch(db);
  batch.delete(doc(db, COLLECTIONS.HELP_REQUESTS, referenceCode));
  if (statusLookupId && /^[a-f0-9]{64}$/.test(statusLookupId)) {
    batch.delete(doc(db, COLLECTIONS.STATUS_LOOKUPS, statusLookupId));
  }
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveActivity(params: {
  id?: string;
  title: string;
  description: string;
  activityDate: string;
  location: string;
  photoUrls: string[];
  isPublished: boolean;
  projectStage: ProjectStage;
}): Promise<string> {
  const isUpdate = Boolean(params.id);
  const activityId = params.id || `act_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  const ref = doc(db, COLLECTIONS.ACTIVITIES, activityId);
  const path = `${COLLECTIONS.ACTIVITIES}/${activityId}`;

  try {
    if (isUpdate) {
      await setDoc(
        ref,
        {
          title: params.title.trim(),
          description: params.description.trim(),
          activityDate: params.activityDate.trim(),
          location: params.location.trim(),
          photoUrls: params.photoUrls.slice(0, 5),
          isPublished: params.isPublished,
          projectStage: params.projectStage,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      await setDoc(ref, {
        title: params.title.trim(),
        description: params.description.trim(),
        activityDate: params.activityDate.trim(),
        location: params.location.trim(),
        photoUrls: params.photoUrls.slice(0, 5),
        isPublished: params.isPublished,
        projectStage: params.projectStage,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return activityId;
  } catch (error) {
    handleFirestoreError(error, isUpdate ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function deleteActivity(activityId: string): Promise<void> {
  const path = `${COLLECTIONS.ACTIVITIES}/${activityId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.ACTIVITIES, activityId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveImpactMetrics(metrics: ImpactMetrics): Promise<void> {
  const path = `${COLLECTIONS.IMPACT}/${DOC_CURRENT}`;
  try {
    await setDoc(doc(db, COLLECTIONS.IMPACT, DOC_CURRENT), {
      peopleHelped: metrics.peopleHelped,
      studentsSupported: metrics.studentsSupported,
      familiesSupported: metrics.familiesSupported,
      madrasasSupported: metrics.madrasasSupported,
      masjidsSupported: metrics.masjidsSupported,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveContactConfig(config: ContactConfig): Promise<void> {
  const path = `${COLLECTIONS.CONTACT}/${DOC_CURRENT}`;
  try {
    await setDoc(doc(db, COLLECTIONS.CONTACT, DOC_CURRENT), {
      contactPerson: config.contactPerson.trim(),
      mobileNumber: config.mobileNumber.trim(),
      emailAddress: config.emailAddress.trim(),
      address: config.address.trim(),
      whatsappNumber: config.whatsappNumber.trim(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const path = `${COLLECTIONS.SITE_CONTENT}/${DOC_CURRENT}`;
  try {
    await setDoc(doc(db, COLLECTIONS.SITE_CONTENT, DOC_CURRENT), {
      missionStatement: content.missionStatement.trim(),
      homeIntroduction: content.homeIntroduction.trim(),
      aboutWhoWeAre: content.aboutWhoWeAre.trim(),
      aboutWhyCreated: content.aboutWhyCreated.trim(),
      aboutVision: content.aboutVision.trim(),
      aboutCommitment: content.aboutCommitment.trim(),
      supportUsMessage: content.supportUsMessage.trim(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveLegalPolicy(policy: LegalPolicy): Promise<void> {
  const path = `${COLLECTIONS.LEGAL_POLICIES}/${policy.policyKey}`;
  try {
    await setDoc(doc(db, COLLECTIONS.LEGAL_POLICIES, policy.policyKey), {
      title: policy.title.trim(),
      content: policy.content.trim(),
      sortOrder: policy.sortOrder,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function seedDefaultFirestoreData(): Promise<number> {
  let seeded = 0;

  try {
    const impactRef = doc(db, COLLECTIONS.IMPACT, DOC_CURRENT);
    if (!(await getDoc(impactRef)).exists()) {
      await saveImpactMetrics(getDefaultImpactMetrics());
      seeded++;
    }

    const contactRef = doc(db, COLLECTIONS.CONTACT, DOC_CURRENT);
    if (!(await getDoc(contactRef)).exists()) {
      await saveContactConfig(getDefaultContactConfig());
      seeded++;
    }

    const siteRef = doc(db, COLLECTIONS.SITE_CONTENT, DOC_CURRENT);
    if (!(await getDoc(siteRef)).exists()) {
      await saveSiteContent(getDefaultSiteContent());
      seeded++;
    }

    for (const policy of getDefaultLegalPolicies()) {
      const policyRef = doc(db, COLLECTIONS.LEGAL_POLICIES, policy.policyKey);
      if (!(await getDoc(policyRef)).exists()) {
        await saveLegalPolicy(policy);
        seeded++;
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed_defaults');
  }

  return seeded;
}
