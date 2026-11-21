import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Us',
  description:
    'Transparency update regarding support and donations at Faizul Foundation. Donations are not being accepted at this time.',
};

export default function SupportUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
