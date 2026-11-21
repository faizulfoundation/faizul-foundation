import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal & Policies',
  description:
    'Privacy Policy, Terms and Conditions, Disclaimer, Data Protection Policy, and Cookie Policy for Faizul Foundation.',
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
