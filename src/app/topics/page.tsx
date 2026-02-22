import type { Metadata } from 'next';
import Link from 'next/link';
import { getNews } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import { toCategorySlug } from '@/lib/lesson-path';
import { normalizeCanonicalPath, toAbsoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Topic Hubs',
  description: 'Browse topic hubs for DevOps learning paths.',
  alternates: { canonical: normalizeCanonicalPath('/topics') },
};

export default async function TopicsPage() {
  const allNews = await getNews();
  const approved = allNews.filter((item) => (item.status || '').toUpperCase() === 'APPROVED');

  const topicMap = new Map<string, { label: string; count: number }>();
  approved.forEach((item) => {
    const label = item.category_name || 'General';
    const slug = toCategorySlug(label);
    const current = topicMap.get(slug);
    topicMap.set(slug, {
      label,
      count: (current?.count || 0) + 1,
    });
  });

  const topics = Array.from(topicMap.entries())
    .map(([slug, data]) => ({ slug, ...data }))
    .sort((a, b) => b.count - a.count);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'DevOps Topic Hubs',
    url: toAbsoluteUrl('/topics'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: topics.map((topic, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: topic.label,
        url: toAbsoluteUrl(`/topics/${topic.slug}`),
      })),
    },
  };

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Topics' }]} />
      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Topic Hubs</h1>
        <p className="mt-2 text-slate-600">Explore lessons grouped by DevOps topics.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="rounded-xl border border-blue-100 bg-white/90 px-5 py-4 shadow-sm transition-colors hover:bg-blue-50/60"
          >
            <p className="font-semibold text-slate-900">{topic.label}</p>
            <p className="text-sm text-slate-600">{topic.count} lessons</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
