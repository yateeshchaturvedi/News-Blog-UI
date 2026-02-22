import type { Metadata } from 'next';
import Link from 'next/link';
import NewsCard from '@/components/news-card';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getNews } from '@/lib/api';
import { toAuthorSlug } from '@/lib/lesson-path';
import { normalizeCanonicalPath } from '@/lib/seo';

type Props = {
  params: Promise<{ authorSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { authorSlug } = await params;
  return {
    title: `Author: ${authorSlug}`,
    description: 'Published lessons by author.',
    alternates: { canonical: normalizeCanonicalPath(`/authors/${authorSlug}`) },
  };
}

export default async function AuthorProfilePage({ params }: Props) {
  const { authorSlug } = await params;
  const news = await getNews();

  const approvedByAuthor = news.filter((item) => {
    const author = item.author || 'Unknown author';
    return (item.status || '').toUpperCase() === 'APPROVED' && toAuthorSlug(author) === authorSlug;
  });

  const authorName = approvedByAuthor[0]?.author || authorSlug.replace(/-/g, ' ');

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Authors', href: '/authors' },
          { name: authorName },
        ]}
      />

      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Author: {authorName}</h1>
        <p className="mt-2 text-slate-600">Lessons published by this author.</p>
      </div>

      {approvedByAuthor.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {approvedByAuthor.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-100 bg-white/90 p-8 text-center text-slate-600 shadow-sm">
          No approved lessons found for this author.
          <div className="mt-3">
            <Link href="/news" className="text-blue-700 hover:underline">Browse all lessons</Link>
          </div>
        </div>
      )}
    </div>
  );
}
