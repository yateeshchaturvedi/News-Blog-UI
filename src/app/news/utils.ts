import { getNews } from '@/lib/api';
import { NewsArticle } from '@/lib/types';

export async function getEnrichedNews(): Promise<NewsArticle[]> {
  const allNews = await getNews();
  const approved = allNews.filter((article) => (article.status || '').trim().toUpperCase() === 'APPROVED');
  return approved.length > 0 ? approved : allNews;
}
