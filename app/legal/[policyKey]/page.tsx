'use client';

import { useParams } from 'next/navigation';
import { LegalPolicyView } from '@/components/LegalPolicyView';

export default function LegalDynamicPolicyPage() {
  const params = useParams<{ policyKey: string }>();
  return <LegalPolicyView policyKey={params?.policyKey || 'privacy_policy'} />;
}
