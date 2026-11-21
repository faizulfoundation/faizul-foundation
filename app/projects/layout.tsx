import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'View proposed, in-progress, and verified community initiatives including the Proposed Madrasa & Students Hostel and Masjid Construction concept.',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
