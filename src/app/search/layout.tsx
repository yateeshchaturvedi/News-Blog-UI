import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Lessons',
  description: 'Search DevOps lessons by topic and keyword.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/search',
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
