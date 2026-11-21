import type { Metadata } from 'next';
import { LegalPolicyView } from '@/components/LegalPolicyView';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and Conditions governing use of the Faizul Foundation website and help request intake.',
};

export default function TermsAndConditionsPage() {
  return <LegalPolicyView policyKey="terms_and_conditions" />;
}
