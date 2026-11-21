import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Work',
  description:
    'Explore verified humanitarian, educational, madrasa, and masjid activities documented by Faizul Foundation.',
};

export default function OurWorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
