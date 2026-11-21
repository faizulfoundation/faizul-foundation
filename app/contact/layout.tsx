import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Official helpline mobile number, WhatsApp, email address, and contact desk for Faizul Foundation.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
