import NewsCard from '@/components/news-card';
import { getPaginatedNews } from '@/lib/api';
import Link from 'next/link';
import type { Metadata } from 'next';
import PublicAdSlot from '@/components/PublicAdSlot';
import Breadcrumbs from '@/components/Breadcrumbs';
import { normalizeCanonicalPath } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'All DevOps Lessons',
  description: 'Explore all approved DevOps lessons and tutorials by category.',
  alternates: {
    canonical: normalizeCanonicalPath('/news'),
  },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, Number.parseInt(resolvedParams.page || '1', 10) || 1);
  const { items, pagination } = await getPaginatedNews(page, 12, 'APPROVED');

  return (
    <div className="space-y-8">
        <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Lessons' }]} />
        <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
            <h1 className="text-4xl font-semibold text-slate-900">All Lessons</h1>
            <div className="flex items-center gap-2">
                <Link href="/topics" className="rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                    Topic Hubs
                </Link>
                <Link href="/" className="rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                    &larr; Back to Home
                </Link>
            </div>
        </div>

        {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {items.map((article) => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>
        ) : (
            <div className="rounded-2xl border border-blue-100 bg-white/85 py-14 text-center text-slate-500 shadow-sm">
                <p>No lessons were found.</p>
            </div>
        )}

        <div className="flex items-center justify-center gap-3">
            <Link
                href={`/news?page=${Math.max(1, pagination.page - 1)}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    pagination.hasPreviousPage
                        ? 'border-blue-100 text-blue-700 hover:bg-blue-50'
                        : 'pointer-events-none border-slate-200 text-slate-400'
                }`}
            >
                Previous
            </Link>
            <span className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
            </span>
            <Link
                href={`/news?page=${pagination.page + 1}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    pagination.hasNextPage
                        ? 'border-blue-100 text-blue-700 hover:bg-blue-50'
                        : 'pointer-events-none border-slate-200 text-slate-400'
                }`}
            >
                Next
            </Link>
        </div>

        <PublicAdSlot placement="news-sidebar" title="Sponsored" />
    </div>
  );
}
