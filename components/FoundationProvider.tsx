'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, testFirestoreConnection } from '@/lib/firebase';
import {
  getDefaultContactConfig,
  getDefaultImpactMetrics,
  getDefaultLegalPolicies,
  getDefaultSiteContent,
} from '@/lib/foundation-defaults';
import {
  checkIsAuthorizedAdmin,
  subscribeContactConfig,
  subscribeImpactMetrics,
  subscribeLegalPolicies,
  subscribePublishedActivities,
  subscribeSiteContent,
} from '@/lib/foundation-service';
import {
  ContactConfig,
  FoundationActivity,
  ImpactMetrics,
  LegalPolicy,
  SiteContent,
} from '@/lib/types';

interface FoundationContextValue {
  activities: FoundationActivity[];
  impactMetrics: ImpactMetrics;
  contactConfig: ContactConfig;
  siteContent: SiteContent;
  legalPolicies: LegalPolicy[];
  isLoadingPublicData: boolean;
  user: User | null;
  authChecked: boolean;
  isAuthorizedAdmin: boolean;
}

const FoundationContext = createContext<FoundationContextValue>({
  activities: [],
  impactMetrics: getDefaultImpactMetrics(),
  contactConfig: getDefaultContactConfig(),
  siteContent: getDefaultSiteContent(),
  legalPolicies: getDefaultLegalPolicies(),
  isLoadingPublicData: true,
  user: null,
  authChecked: false,
  isAuthorizedAdmin: false,
});

export function FoundationProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<FoundationActivity[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics>(getDefaultImpactMetrics);
  const [contactConfig, setContactConfig] = useState<ContactConfig>(getDefaultContactConfig);
  const [siteContent, setSiteContent] = useState<SiteContent>(getDefaultSiteContent);
  const [legalPolicies, setLegalPolicies] = useState<LegalPolicy[]>(getDefaultLegalPolicies);
  const [isLoadingPublicData, setIsLoadingPublicData] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);

  useEffect(() => {
    void testFirestoreConnection();

    const unsubActivities = subscribePublishedActivities(
      (items) => {
        setActivities(items);
        setIsLoadingPublicData(false);
      },
      () => setIsLoadingPublicData(false)
    );

    const unsubImpact = subscribeImpactMetrics(
      (metrics) => setImpactMetrics(metrics),
      () => undefined
    );

    const unsubContact = subscribeContactConfig(
      (config) => setContactConfig(config),
      () => undefined
    );

    const unsubContent = subscribeSiteContent(
      (content) => setSiteContent(content),
      () => undefined
    );

    const unsubPolicies = subscribeLegalPolicies(
      (policies) => setLegalPolicies(policies),
      () => undefined
    );

    const unsubAuth = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIsAuthorizedAdmin(false);
        setAuthChecked(true);
        return;
      }
      try {
        const authorized = await checkIsAuthorizedAdmin();
        setIsAuthorizedAdmin(authorized);
      } catch {
        setIsAuthorizedAdmin(false);
      } finally {
        setAuthChecked(true);
      }
    });

    return () => {
      unsubActivities();
      unsubImpact();
      unsubContact();
      unsubContent();
      unsubPolicies();
      unsubAuth();
    };
  }, []);

  return (
    <FoundationContext.Provider
      value={{
        activities,
        impactMetrics,
        contactConfig,
        siteContent,
        legalPolicies,
        isLoadingPublicData,
        user,
        authChecked,
        isAuthorizedAdmin,
      }}
    >
      {children}
    </FoundationContext.Provider>
  );
}

export function useFoundation() {
  return useContext(FoundationContext);
}
