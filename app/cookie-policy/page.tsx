import type { Metadata } from 'next';
import { LegalPolicyView } from '@/components/LegalPolicyView';

export const metadata: Metadata = {
  title: 'Cookie and Local Storage Policy',
  description: 'Essential local storage, Service Worker cache, and zero-tracker cookie policy for Faizul Foundation.',
};

export default function CookiePolicyPage() {
  return <LegalPolicyView policyKey="cookie_policy" />;
}
