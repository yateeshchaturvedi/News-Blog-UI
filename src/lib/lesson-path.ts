import { NewsArticle } from '@/lib/types';

export function toCategorySlug(value: string): string {
  return (value || 'general').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function toLessonSlug(title: string): string {
  return (title || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function buildLessonHref(article: NewsArticle): string {
  const categorySlug = toCategorySlug(article.category_name || article.category || 'general');
  const lessonSlug = toLessonSlug(article.title || '');
  return `/lessons/${categorySlug}/${lessonSlug}`;
}
