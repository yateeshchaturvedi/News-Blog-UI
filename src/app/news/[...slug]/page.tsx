
import type { Metadata } from 'next';
import { getNews, getNewsArticle } from "@/lib/api";
import { NewsArticle } from "@/lib/types";
import NewsCard from "@/components/news-card";
import Link from "next/link";
import Image from "next/image";
import { use } from 'react';
import { toAbsoluteUrl } from '@/lib/seo';

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
          canonical: `/news/${categorySlug}/${articleId}`,
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
        alternates: { canonical: `/news/${categorySlug}/${articleId}` },
      };
    }
  }

  if (slug.length === 1) {
    return {
      title: `${capitalize(slug[0])} Lessons`,
      description: `Explore ${capitalize(slug[0])} DevOps lessons and tutorials.`,
      alternates: { canonical: `/news/${slug[0]}` },
    };
  }

  return {
    title: 'DevOps Lessons',
    alternates: { canonical: '/news' },
  };
}

async function ArticleDetail({ articleId }: { articleId: string }) {
    let article: NewsArticle | undefined = undefined;
    let error = null;

    try {
      article = await getNewsArticle(articleId);
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "An unexpected error occurred.";
    }

    if (error) {
      return <div className="text-center text-red-500"><p>Error loading lesson: {error}</p></div>;
    }

    if (!article) {
      return <div className="text-center"><p>Lesson not found.</p></div>;
    }

    const displayCategory = article.category_name ? capitalize(article.category_name) : 'Category';
    const publishedDate = article.created_at ?? article.createdAt ?? article.publishedAt;
    const articleContent = article.full_content ?? article.content ?? '';
    const categorySlug = toCategorySlug(article.category_name || 'general');
    const articleUrl = toAbsoluteUrl(`/news/${categorySlug}/${article.id}`);

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
      mainEntityOfPage: articleUrl,
      publisher: {
        '@type': 'Organization',
        name: 'DevOpsTic Academy',
      },
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <div className="mb-4">
            <Link href={`/news/${toCategorySlug(article.category_name || "general")}`} className="text-blue-500 hover:underline">
              &larr; Back to {displayCategory}
            </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{article.title}</h1>
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
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{displayCategory}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Published on: {publishedDate ? new Date(publishedDate).toLocaleDateString() : 'N/A'}
        </p>
        {article.imageUrl && <Image src={article.imageUrl} alt={article.title} width={800} height={400} className="w-full h-auto object-cover rounded-lg mb-8" />}
        <div className="lesson-content max-w-none" dangerouslySetInnerHTML={{ __html: articleContent }}></div>
      </div>
    );
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
