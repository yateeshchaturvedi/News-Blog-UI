import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import NewsCard from '@/components/news-card';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getNews } from '@/lib/api';
import { toAuthorSlug } from '@/lib/lesson-path';
import { normalizeCanonicalPath, toAbsoluteUrl } from '@/lib/seo';

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
  const authorAvatar = approvedByAuthor[0]?.authorAvatarUrl || '/placeholder.svg';
  const topics = Array.from(new Set(approvedByAuthor.map((item) => item.category_name || 'General'))).slice(0, 5);

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorName,
    image: toAbsoluteUrl(authorAvatar),
    url: toAbsoluteUrl(`/authors/${authorSlug}`),
    description: `${authorName} publishes practical DevOps lessons on DevOpsTic.`,
  };

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Authors', href: '/authors' },
          { name: authorName },
        ]}
      />

      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">
          <Image
            src={authorAvatar}
            alt={authorName}
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full border border-blue-100 object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-slate-900">{authorName}</h1>
            <p className="mt-2 text-slate-600">Author profile with published lessons and topic coverage.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {approvedByAuthor.length} lessons
              </span>
              {topics.map((topic) => (
                <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
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
            <Link href="/lessons" className="text-blue-700 hover:underline">Browse all lessons</Link>
          </div>
        </div>
      )}
    </div>
  );
}
