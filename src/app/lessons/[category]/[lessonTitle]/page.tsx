import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PublicAdSlot from '@/components/PublicAdSlot';
import { getNews } from '@/lib/api';
import { NewsArticle } from '@/lib/types';
import { toAbsoluteUrl } from '@/lib/seo';
import { toCategorySlug, toLessonSlug } from '@/lib/lesson-path';

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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: publishedDate ? new Date(publishedDate).toISOString() : undefined,
    dateModified: article.updated_at ? new Date(article.updated_at).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: article.author || 'DevOpsTic Team',
    },
    image: article.imageUrl ? [toAbsoluteUrl(article.imageUrl)] : undefined,
    articleSection: displayCategory,
    mainEntityOfPage: toAbsoluteUrl(canonicalPath),
    publisher: {
      '@type': 'Organization',
      name: 'DevOpsTic Academy',
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="mb-4">
        <Link href={`/news/${toCategorySlug(article.category_name || 'general')}`} className="text-blue-500 hover:underline">
          &larr; Back to {displayCategory}
        </Link>
      </div>
      <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">{article.title}</h1>
      <div className="mb-3 flex items-center gap-2">
        <Image
          src={article.authorAvatarUrl || '/placeholder.svg'}
          alt={article.author || 'Author'}
          width={20}
          height={20}
          className="h-5 w-5 rounded-full object-cover"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Written by {article.author || 'Unknown author'}
        </span>
      </div>
      <p className="mb-2 text-lg text-gray-600 dark:text-gray-300">{displayCategory}</p>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Published on: {publishedDate ? new Date(publishedDate).toLocaleDateString() : 'N/A'}
      </p>
      {article.imageUrl && (
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={800}
          height={400}
          className="mb-8 h-auto w-full rounded-lg object-cover"
        />
      )}
      <div className="lesson-content max-w-none" dangerouslySetInnerHTML={{ __html: articleContent }} />
      <div className="mt-8">
        <PublicAdSlot placement="lesson-detail" title="Sponsored" />
      </div>
    </div>
  );
}
