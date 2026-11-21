import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Help',
  description:
    'Submit a confidential help request for education, madrasa, masjid, food, or financial assistance, or securely track an existing request.',
};

export default function RequestHelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
