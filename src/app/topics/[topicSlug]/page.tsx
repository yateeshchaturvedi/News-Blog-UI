import type { Metadata } from 'next';
import Link from 'next/link';
import NewsCard from '@/components/news-card';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getNews } from '@/lib/api';
import { toCategorySlug, toLessonSlug } from '@/lib/lesson-path';
import { normalizeCanonicalPath, toAbsoluteUrl } from '@/lib/seo';

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

  const topicTitle = humanize(topicSlug);
  const faqItems = [
    {
      q: `What should I learn before ${topicTitle}?`,
      a: `Start with Git basics, Linux shell fundamentals, and one cloud provider account before deep-diving into ${topicTitle}.`,
    },
    {
      q: `How long does it take to get practical in ${topicTitle}?`,
      a: `With daily hands-on practice, most learners reach practical confidence in 3-6 weeks.`,
    },
    {
      q: `How should I practice ${topicTitle} lessons?`,
      a: `Use each lesson with a small lab, validate expected outputs, and keep troubleshooting notes for repeated drills.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: topicNews.slice(0, 12).map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: toAbsoluteUrl(`/lessons/${toCategorySlug(article.category_name || 'general')}/${toLessonSlug(article.title || '')}`),
      name: article.title,
    })),
  };

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Topics', href: '/topics' },
          { name: topicTitle },
        ]}
      />

      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{topicTitle} Topic Hub</h1>
        <p className="mt-2 text-slate-600">
          Structured learning path, practical lessons, and FAQs for {topicTitle}.
        </p>
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Recommended path:</p>
          <p className="mt-1">
            Fundamentals {'->'} Hands-on labs {'->'} Production patterns {'->'} Troubleshooting drills
          </p>
        </div>
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

      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
        <div className="mt-4 space-y-4">
          {faqItems.map((item) => (
            <div key={item.q} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-base font-semibold text-slate-900">{item.q}</h3>
              <p className="mt-1 text-sm text-slate-700">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
