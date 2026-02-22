import type { Metadata } from 'next';
import Link from 'next/link';
import NewsCard from '@/components/news-card';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getNews } from '@/lib/api';
import { toCategorySlug } from '@/lib/lesson-path';
import { normalizeCanonicalPath } from '@/lib/seo';

type Props = {
  params: Promise<{ topicSlug: string }>;
};

function humanize(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicSlug } = await params;
  const title = `${humanize(topicSlug)} Topic Hub`;
  return {
    title,
    description: `Explore all approved lessons under ${humanize(topicSlug)}.`,
    alternates: { canonical: normalizeCanonicalPath(`/topics/${topicSlug}`) },
  };
}

export default async function TopicHubPage({ params }: Props) {
  const { topicSlug } = await params;
  const allNews = await getNews();

  const topicNews = allNews.filter((article) => {
    const category = article.category_name || article.category || 'general';
    return (article.status || '').toUpperCase() === 'APPROVED' && toCategorySlug(category) === topicSlug;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Topics', href: '/topics' },
          { name: humanize(topicSlug) },
        ]}
      />

      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{humanize(topicSlug)} Topic Hub</h1>
        <p className="mt-2 text-slate-600">All approved lessons for this topic.</p>
      </div>

      {topicNews.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topicNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-100 bg-white/90 p-8 text-center text-slate-600 shadow-sm">
          No lessons found under this topic.
          <div className="mt-3">
            <Link href="/topics" className="text-blue-700 hover:underline">Browse all topics</Link>
          </div>
        </div>
      )}
    </div>
  );
}
