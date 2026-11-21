import type { Metadata } from 'next';
import { LegalPolicyView } from '@/components/LegalPolicyView';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Truthfulness, verification, and statutory status disclaimer for Faizul Foundation.',
};

export default function DisclaimerPage() {
  return <LegalPolicyView policyKey="disclaimer" />;
}
