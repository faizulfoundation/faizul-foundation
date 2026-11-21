'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { signInWithPopup, signOut } from 'firebase/auth';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Database,
  FileText,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { ActivitiesManager } from '@/components/admin/ActivitiesManager';
import { HelpRequestsManager } from '@/components/admin/HelpRequestsManager';
import {
  ContactAndPoliciesEditor,
  ImpactEditor,
  SiteContentEditor,
} from '@/components/admin/ImpactAndContentEditors';
import { useFoundation } from '@/components/FoundationProvider';
import { auth, googleProvider } from '@/lib/firebase';
import { OFFICIAL_IMAGES } from '@/lib/foundation-defaults';
import {
  seedDefaultFirestoreData,
  subscribeAllActivitiesForAdmin,
  subscribeHelpRequestsForAdmin,
} from '@/lib/foundation-service';
import { FoundationActivity, HelpRequestRecord, RequestStatus } from '@/lib/types';

type AdminTab = 'overview' | 'requests' | 'activities' | 'impact' | 'content' | 'contact';

export default function AdminPortalPage() {
  const {
    user,
    authChecked,
    isAuthorizedAdmin,
    impactMetrics,
    contactConfig,
    siteContent,
    legalPolicies,
  } = useFoundation();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminRequests, setAdminRequests] = useState<HelpRequestRecord[]>([]);
  const [adminActivities, setAdminActivities] = useState<FoundationActivity[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthorizedAdmin) return;

    const unsubReqs = subscribeHelpRequestsForAdmin(
      (list) => setAdminRequests(list),
      () => undefined
    );
    const unsubActs = subscribeAllActivitiesForAdmin(
      (list) => setAdminActivities(list),
      () => undefined
    );

    return () => {
      unsubReqs();
      unsubActs();
    };
  }, [isAuthorizedAdmin]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Google Sign-In failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    setSeedMessage(null);
    try {
      const count = await seedDefaultFirestoreData();
      setSeedMessage(
        count > 0
          ? `Initialized ${count} default Firestore document(s).`
          : 'All default Firestore documents are already initialized.'
      );
    } catch {
      setSeedMessage('Could not seed defaults. Verify bootstrapped admin permissions.');
    } finally {
      setIsSeeding(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="inline-flex items-center gap-2 text-sm text-[#4B594E]">
          <Loader2 className="h-5 w-5 animate-spin text-[#0E7A21]" />
          Verifying administrator session...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#F7FAF7] py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-2xl border border-[#D9E3DB] bg-white p-8 text-center space-y-5 shadow-xs">
            <div className="mx-auto h-16 w-16 overflow-hidden rounded-xl border border-[#D9E3DB] bg-white p-1">
              <Image
                src={OFFICIAL_IMAGES.logo}
                alt="Faizul Foundation logo"
                width={64}
                height={64}
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
                Restricted Access
              </p>
              <h1 className="mt-1 font-serif text-2xl font-bold text-[#131D15]">
                Administrator Portal
              </h1>
              <p className="mt-2 text-sm text-[#4B594E]">
                Sign in with an authorized Faizul Foundation Google account to review confidential
                help requests and manage public content.
              </p>
            </div>

            {authError && (
              <div className="rounded-lg border border-[#C91E1E]/30 bg-[#FDEAEA] p-3 text-xs text-[#5A0B0B]">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E7A21] px-5 py-3 text-sm font-semibold text-white hover:bg-[#073B10] disabled:opacity-60 transition-colors"
            >
              {isSigningIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <div className="bg-[#F7FAF7] py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-2xl border border-[#C91E1E]/30 bg-white p-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDEAEA] text-[#C91E1E]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#131D15]">Access Denied</h1>
            <p className="text-sm text-[#4B594E]">
              The signed-in account (<strong>{user.email}</strong>) is not authorized for the Faizul
              Foundation Administrator Portal.
            </p>
            <button
              type="button"
              onClick={() => signOut(auth)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D9E3DB] px-5 py-2.5 text-sm font-semibold text-[#131D15] hover:border-[#C91E1E]"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = adminRequests.filter(
    (r) => r.status === RequestStatus.PENDING_REVIEW
  ).length;
  const underReviewCount = adminRequests.filter(
    (r) => r.status === RequestStatus.UNDER_REVIEW
  ).length;
  const publishedCount = adminActivities.filter((a) => a.isPublished).length;

  const tabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'requests', label: `Help Requests (${adminRequests.length})`, icon: Inbox },
    { id: 'activities', label: `Activities (${adminActivities.length})`, icon: Activity },
    { id: 'impact', label: 'Impact Metrics', icon: BarChart3 },
    { id: 'content', label: 'Site Content', icon: FileText },
    { id: 'contact', label: 'Contact & Policies', icon: ShieldCheck },
  ];

  return (
    <div className="bg-[#F7FAF7] min-h-[80vh] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <header className="rounded-2xl border border-[#D9E3DB] bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
              Verified Administrator Workspace
            </p>
            <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#131D15]">
              Faizul Foundation Admin Portal
            </h1>
            <p className="mt-1 text-xs text-[#4B594E]">Signed in as {user.email}</p>
          </div>

          <button
            type="button"
            onClick={() => signOut(auth)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D9E3DB] bg-white px-4 py-2 text-sm font-medium text-[#131D15] hover:border-[#C91E1E] hover:text-[#C91E1E] self-start sm:self-auto"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </header>

        <nav
          aria-label="Admin Portal Sections"
          className="flex flex-wrap gap-2 border-b border-[#D9E3DB] pb-3"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#0E7A21] text-white'
                    : 'border border-[#D9E3DB] bg-white text-[#4B594E] hover:border-[#0E7A21] hover:text-[#131D15]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#D9E3DB] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                  Total Help Requests
                </p>
                <p className="mt-3 font-mono text-3xl font-bold text-[#131D15] tabular-nums">
                  {adminRequests.length}
                </p>
              </div>
              <div className="rounded-2xl border border-[#D9E3DB] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C91E1E]">
                  Pending Review
                </p>
                <p className="mt-3 font-mono text-3xl font-bold text-[#C91E1E] tabular-nums">
                  {pendingCount}
                </p>
              </div>
              <div className="rounded-2xl border border-[#D9E3DB] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#4B594E]">
                  Under Review
                </p>
                <p className="mt-3 font-mono text-3xl font-bold text-[#131D15] tabular-nums">
                  {underReviewCount}
                </p>
              </div>
              <div className="rounded-2xl border border-[#D9E3DB] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0E7A21]">
                  Published Activities
                </p>
                <p className="mt-3 font-mono text-3xl font-bold text-[#0E7A21] tabular-nums">
                  {publishedCount}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D9E3DB] bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#131D15]">
                  Firestore Cloud Initialization
                </h2>
                <p className="mt-1 text-sm text-[#4B594E]">
                  Ensure default public site copy, contact info, null impact counters, and all 6
                  legal policies are saved in Cloud Firestore.
                </p>
                {seedMessage && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#0E7A21]">
                    <CheckCircle2 className="h-4 w-4" />
                    {seedMessage}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleSeedDefaults}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 rounded-lg border border-[#0E7A21] bg-white px-4 py-2.5 text-sm font-semibold text-[#0E7A21] hover:bg-[#E6F4E9] shrink-0"
              >
                {isSeeding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                Initialize Default Documents
              </button>
            </div>
          </div>
        )}

        {activeTab === 'requests' && <HelpRequestsManager requests={adminRequests} />}
        {activeTab === 'activities' && <ActivitiesManager activities={adminActivities} />}
        {activeTab === 'impact' && <ImpactEditor current={impactMetrics} />}
        {activeTab === 'content' && <SiteContentEditor current={siteContent} />}
        {activeTab === 'contact' && (
          <ContactAndPoliciesEditor contact={contactConfig} policies={legalPolicies} />
        )}
      </div>
    </div>
  );
}
