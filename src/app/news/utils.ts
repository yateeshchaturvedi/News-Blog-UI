import { getNews } from '@/lib/api';
import { NewsArticle } from '@/lib/types';

export async function getEnrichedNews(): Promise<NewsArticle[]> {
  return getNews();
}
