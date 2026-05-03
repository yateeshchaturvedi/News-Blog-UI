import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PublicAdSlot from '@/components/PublicAdSlot';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getEnrichedNews } from "@/app/news/utils";
import { formatDate } from "@/lib/utils";
import { getNews } from '@/lib/api';
import { NewsArticle } from '@/lib/types';
import { normalizeCanonicalPath, toAbsoluteUrl } from '@/lib/seo';
import { toAuthorSlug, toCategorySlug, toLessonSlug } from '@/lib/lesson-path';

function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isApproved(article: NewsArticle) {
  return (article.status || '').trim().toUpperCase() === 'APPROVED';
}

async function getLessonBySlugs(categorySlug: string, lessonTitleSlug: string): Promise<NewsArticle | undefined> {
  const allNews = await getNews();
  const filtered = allNews.filter((article) => {
    const articleCategorySlug = toCategorySlug(article.category_name || article.category || 'general');
    return articleCategorySlug === categorySlug && isApproved(article);
  });
  return filtered.find((article) => toLessonSlug(article.title || '') === lessonTitleSlug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; lessonTitle: string }>;
}): Promise<Metadata> {
  const { category, lessonTitle } = await params;
  const article = await getLessonBySlugs(decodeURIComponent(category), decodeURIComponent(lessonTitle));

  if (!article) {
    return {
      title: 'Lesson Not Found',
      alternates: { canonical: '/news' },
      robots: { index: false, follow: true },
    };
  }

  const canonicalPath = `/lessons/${toCategorySlug(article.category_name || 'general')}/${toLessonSlug(article.title)}`;
  const imageUrl = article.imageUrl ? toAbsoluteUrl(article.imageUrl) : undefined;
  const description = article.summary || article.content?.slice(0, 160) || 'DevOps lesson';

  return {
    title: article.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'article',
      url: canonicalPath,
      title: article.title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ category: string; lessonTitle: string }>;
}) {
  const { category, lessonTitle } = await params;
  const categorySlug = decodeURIComponent(category);
  const lessonTitleSlug = decodeURIComponent(lessonTitle);
  const article = await getLessonBySlugs(categorySlug, lessonTitleSlug);

  if (!article) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Lesson Not Found</h1>
        <p>The requested lesson could not be found.</p>
        <Link href="/news" className="mt-4 inline-block text-blue-500 hover:underline">
          &larr; Back to Learning
        </Link>
      </div>
    );
  }

  const displayCategory = article.category_name ? capitalize(article.category_name) : 'Category';
  const publishedDate = article.created_at ?? article.createdAt ?? article.publishedAt;
  const articleContent = article.full_content ?? article.content ?? '';
  const canonicalPath = `/lessons/${toCategorySlug(article.category_name || 'general')}/${toLessonSlug(article.title)}`;
  const normalizedCanonicalPath = normalizeCanonicalPath(canonicalPath);
  const authorSlug = toAuthorSlug(article.author || 'Unknown author');

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: publishedDate ? new Date(publishedDate).toISOString() : undefined,
    dateModified: article.updated_at ? new Date(article.updated_at).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: article.author || 'Devopstick Team',
    },
      image: article.imageUrl ? [toAbsoluteUrl(article.imageUrl)] : undefined,
      articleSection: displayCategory,
      mainEntityOfPage: toAbsoluteUrl(normalizedCanonicalPath),
      publisher: {
        '@type': 'Organization',
        name: 'Devopstick Academy',
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Lessons', href: '/news' },
          { name: displayCategory, href: `/topics/${toCategorySlug(article.category_name || 'general')}` },
          { name: article.title },
        ]}
      />
      
      <div className="mt-8 space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
          <div className="mb-6">
            <Link href={`/news/${toCategorySlug(article.category_name || 'general')}`} className="text-sm font-bold text-primary hover:gap-1 transition-all inline-flex items-center gap-2">
              &larr; Back to {displayCategory}
            </Link>
          </div>
          
          <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-950 dark:text-white lg:text-5xl">{article.title}</h1>
          
          <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-slate-100 pb-8 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Image
                src={article.authorAvatarUrl || '/placeholder.svg'}
                alt={article.author || 'Author'}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-slate-100 object-cover dark:border-slate-700"
              />
              <div className="text-sm">
                 <div className="font-bold text-slate-900 dark:text-white">
                    <Link href={`/authors/${authorSlug}`} className="hover:text-primary transition-colors">
                      {article.author || 'Devopstick Team'}
                    </Link>
                 </div>
                 <div className="text-slate-500">{formatDate(publishedDate || '')}</div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block" />
            <div className="text-sm font-bold uppercase tracking-widest text-primary">
              {displayCategory}
            </div>
          </div>

          {article.imageUrl && (
            <div className="mb-10 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={1000}
                height={500}
                className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          )}
          
          <div 
            className="lesson-content prose prose-slate max-w-none text-slate-700 dark:text-slate-300 prose-headings:font-black prose-headings:text-slate-950 dark:prose-headings:text-white prose-a:text-primary prose-strong:text-slate-950 dark:prose-strong:text-white" 
            dangerouslySetInnerHTML={{ __html: articleContent }} 
          />
        </div>
      </div>
    </div>
  );
}
