import type { Metadata } from 'next';
import Link from 'next/link';
import { getNews } from '@/lib/api';
import { toAuthorSlug } from '@/lib/lesson-path';
import Breadcrumbs from '@/components/Breadcrumbs';
import { normalizeCanonicalPath, toAbsoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Explore DevOpsTic lesson authors.',
  alternates: { canonical: normalizeCanonicalPath('/authors') },
};

export default async function AuthorsPage() {
  const news = await getNews();
  const approved = news.filter((item) => (item.status || '').toUpperCase() === 'APPROVED');

  const authorMap = new Map<string, { name: string; count: number }>();
  approved.forEach((item) => {
    const name = item.author || 'Unknown author';
    const slug = toAuthorSlug(name);
    const current = authorMap.get(slug);
    authorMap.set(slug, {
      name,
      count: (current?.count || 0) + 1,
    });
  });

  const authors = Array.from(authorMap.entries())
    .map(([slug, data]) => ({ slug, ...data }))
    .sort((a, b) => b.count - a.count);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'DevOpsTic Authors',
    url: toAbsoluteUrl('/authors'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: authors.map((author, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: author.name,
        url: toAbsoluteUrl(`/authors/${author.slug}`),
      })),
    },
  };

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Authors' }]} />
      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Authors</h1>
        <p className="mt-2 text-slate-600">Contributors publishing DevOps lessons.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {authors.map((author) => (
          <Link
            key={author.slug}
            href={`/authors/${author.slug}`}
            className="rounded-xl border border-blue-100 bg-white/90 px-5 py-4 shadow-sm transition-colors hover:bg-blue-50/60"
          >
            <p className="font-semibold text-slate-900">{author.name}</p>
            <p className="text-sm text-slate-600">{author.count} published lessons</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
