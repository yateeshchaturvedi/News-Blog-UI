import NewsCard from '@/components/news-card';
import { getEnrichedNews } from './news/utils';
import Link from 'next/link';

export default async function HomePage() {
  const latestNews = await getEnrichedNews();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Latest News</h1>

      {latestNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.slice(0, 5).map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          <p>No news articles were found.</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/news" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300">
          View All News
        </Link>
      </div>
    </div>
  );
}
