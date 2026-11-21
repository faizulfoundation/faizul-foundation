import type { Metadata } from 'next';
import { LegalPolicyView } from '@/components/LegalPolicyView';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy explaining how Faizul Foundation protects applicant details and confidential help requests.',
};

export default function PrivacyPolicyPage() {
  return <LegalPolicyView policyKey="privacy_policy" />;
}
