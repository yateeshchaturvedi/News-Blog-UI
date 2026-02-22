
import type { Metadata } from 'next';
import { getNews, getNewsArticle } from "@/lib/api";
import { NewsArticle } from "@/lib/types";
import NewsCard from "@/components/news-card";
import Link from "next/link";
import Image from "next/image";
import { use } from 'react';
import { toAbsoluteUrl } from '@/lib/seo';
import { normalizeCanonicalPath } from '@/lib/seo';
import PublicAdSlot from '@/components/PublicAdSlot';
import { redirect } from 'next/navigation';
import { toLessonSlug } from '@/lib/lesson-path';

// Helper function to capitalize the first letter of a string
function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCategorySlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = (resolvedParams.slug || []).map((segment) => decodeURIComponent(segment));

  if (slug.length === 2) {
    const [categorySlug, articleId] = slug;
    try {
      const article = await getNewsArticle(articleId);
      if (!article) {
        return {
          title: 'Lesson Not Found',
          alternates: { canonical: '/news' },
          robots: { index: false, follow: true },
        };
      }

      const imageUrl = article.imageUrl ? toAbsoluteUrl(article.imageUrl) : undefined;
      const description = article.summary || article.content?.slice(0, 160) || 'DevOps lesson';

      return {
        title: article.title,
        description,
        alternates: {
          canonical: normalizeCanonicalPath(`/news/${categorySlug}/${articleId}`),
        },
        openGraph: {
          type: 'article',
          url: `/news/${categorySlug}/${articleId}`,
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
    } catch {
      return {
        title: 'Lesson',
        alternates: { canonical: normalizeCanonicalPath(`/news/${categorySlug}/${articleId}`) },
      };
    }
  }

  if (slug.length === 1) {
    return {
      title: `${capitalize(slug[0])} Lessons`,
      description: `Explore ${capitalize(slug[0])} DevOps lessons and tutorials.`,
      alternates: { canonical: normalizeCanonicalPath(`/news/${slug[0]}`) },
    };
  }

  return {
    title: 'DevOps Lessons',
    alternates: { canonical: '/news' },
  };
}

async function ArticleDetail({ articleId }: { articleId: string }) {
  let article: NewsArticle | undefined;

  try {
    article = await getNewsArticle(articleId);
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return <div className="text-center text-red-500"><p>Error loading lesson: {error}</p></div>;
  }

  if (!article) {
    return <div className="text-center"><p>Lesson not found.</p></div>;
  }

  const lessonUrl = `/lessons/${toCategorySlug(article.category_name || 'general')}/${toLessonSlug(article.title || '')}`;
  redirect(lessonUrl);
}

async function CategoryList({ categoryName }: { categoryName: string }) {
    let articles: NewsArticle[] = [];
    let error = null;

    try {
      const allNews = await getNews();
      articles = allNews.filter(
        article =>
          article.category_name &&
          toCategorySlug(article.category_name) === toCategorySlug(categoryName) &&
          (article.status || '').trim().toUpperCase() === 'APPROVED'
      );
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "An unexpected error occurred.";
    }

    if (error) {
      return <div className="text-center text-red-500"><p>Error loading lessons: {error}</p></div>;
    }

    if (articles.length === 0) {
        return <div className="text-center"><p>No lessons found for this topic.</p></div>
    }

    const displayCategoryName = articles[0]?.category_name ? capitalize(articles[0].category_name) : capitalize(categoryName);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{displayCategoryName} Lessons</h1>
             <Link href="/news" className="text-blue-500 hover:underline mt-2 inline-block">
                &larr; Back to All Lessons
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    );
}


export default function NewsPage({ params: paramsPromise }: { params: Promise<{ slug: string[] }> }) {
  const params = use(paramsPromise);

  if (!params.slug || !Array.isArray(params.slug) || params.slug.length === 0) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p>The requested page could not be found.</p>
            <Link href="/news" className="text-blue-500 hover:underline mt-4 inline-block">
                &larr; Back to Learning
            </Link>
        </div>
    );
  }

  const slug = params.slug.map(segment => decodeURIComponent(segment));

  if (slug.length === 2) {
    const [, articleId] = slug;
    return <ArticleDetail articleId={articleId} />;
  }

  if (slug.length === 1) {
    const categoryName = slug[0];
    return <CategoryList categoryName={categoryName} />;
  }

  return (
      <div className="text-center">
          <h1 className="text-2xl font-bold">Page Not Found</h1>
          <p>The URL is not valid.</p>
          <Link href="/news" className="text-blue-500 hover:underline mt-4 inline-block">
              &larr; Back to Learning
          </Link>
      </div>
  )
}
