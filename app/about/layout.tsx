import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Faizul Foundation: who we are, why we were created, our mission, vision, core values, and commitment to transparency.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
