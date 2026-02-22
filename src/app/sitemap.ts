import type { MetadataRoute } from 'next';
import { getBlogs, getNews } from '@/lib/api';
import { getSiteUrl } from '@/lib/seo';
import { toAuthorSlug, toCategorySlug, toLessonSlug } from '@/lib/lesson-path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/topics`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${siteUrl}/authors`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${siteUrl}/data-retention`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  try {
    const [news, blogs] = await Promise.all([getNews(), getBlogs()]);
    const approvedNews = news.filter(
      (article) => (article.status || '').trim().toUpperCase() === 'APPROVED'
    );

    const categoryUrls = Array.from(
      new Set(
        approvedNews
          .map((article) => article.category_name)
          .filter((value): value is string => Boolean(value))
          .map((categoryName) => `${siteUrl}/news/${toCategorySlug(categoryName)}`)
      )
    ).map((url) => ({
      url,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const topicHubUrls = Array.from(
      new Set(
        approvedNews
          .map((article) => article.category_name)
          .filter((value): value is string => Boolean(value))
          .map((categoryName) => `${siteUrl}/topics/${toCategorySlug(categoryName)}`)
      )
    ).map((url) => ({
      url,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

    const authorUrls = Array.from(
      new Set(
        approvedNews
          .map((article) => article.author)
          .filter((value): value is string => Boolean(value))
          .map((authorName) => `${siteUrl}/authors/${toAuthorSlug(authorName)}`)
      )
    ).map((url) => ({
      url,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    }));

    const articleUrls = approvedNews.map((article) => {
      const categorySlug = toCategorySlug(article.category_name || 'general');
      const articleDate = article.updated_at || article.created_at || article.publishedAt;
      return {
        url: `${siteUrl}/lessons/${categorySlug}/${toLessonSlug(article.title || '')}`,
        lastModified: articleDate ? new Date(articleDate) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
    });

    const blogUrls = blogs.map((blog) => ({
      url: `${siteUrl}/blog/${blog.id}`,
      lastModified: blog.updatedAt ? new Date(blog.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [
      ...staticRoutes,
      ...categoryUrls,
      ...topicHubUrls,
      ...authorUrls,
      ...articleUrls,
      ...blogUrls,
    ];
  } catch {
    return staticRoutes;
  }
}
