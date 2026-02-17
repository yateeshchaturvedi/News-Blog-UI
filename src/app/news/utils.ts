import { getNews } from '@/lib/api';
import { NewsArticle } from '@/lib/types';

export async function getEnrichedNews(): Promise<NewsArticle[]> {
  const allNews = await getNews();
  return allNews.filter((article) => (article.status || '').trim().toUpperCase() === 'APPROVED');
}
