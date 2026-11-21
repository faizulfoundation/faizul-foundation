import type { Metadata } from 'next';
import { LegalPolicyView } from '@/components/LegalPolicyView';

export const metadata: Metadata = {
  title: 'Data Protection Policy',
  description: 'Data protection, security rules, and confidentiality policy for Faizul Foundation help requests.',
};

export default function DataProtectionPage() {
  return <LegalPolicyView policyKey="data_protection" />;
}
