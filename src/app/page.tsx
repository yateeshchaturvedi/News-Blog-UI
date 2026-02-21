import NewsCard from '@/components/news-card';
import { getEnrichedNews } from './news/utils';
import Link from 'next/link';
import type { Metadata } from 'next';
import PublicAdSlot from '@/components/PublicAdSlot';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Latest DevOps Lessons',
  description: 'Browse the latest practical DevOps lessons on CI/CD, Kubernetes, cloud infrastructure, and observability.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const latestNews = await getEnrichedNews();

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-sky-50 to-white p-8 md:p-12">
        <div className="max-w-2xl animate-fade-up">
          <p className="mb-3 inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">DevOps Learning Tracks</p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">Latest Lessons</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">Learn by doing with concise lessons on CI/CD, Kubernetes, cloud operations, and infrastructure automation.</p>
          <div className="mt-6">
            <Link href="/news" className="animate-soft-pulse inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700">
              Explore All Lessons
            </Link>
          </div>
        </div>
      </section>

      {latestNews.length > 0 ? (
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestNews.slice(0, 5).map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-blue-100 bg-white/85 py-14 text-center text-slate-500 shadow-sm">
          <p>No lessons found yet.</p>
        </div>
      )}

      <section>
        <PublicAdSlot placement="homepage-top" title="Sponsored" />
      </section>
    </div>
  );
}
