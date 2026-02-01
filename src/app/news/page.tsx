import NewsCard from '@/components/news-card';
import { getEnrichedNews } from './utils';
import Link from 'next/link';

export default async function NewsPage() {
  const news = await getEnrichedNews();

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">All News</h1>
            <Link href="/" className="text-blue-500 hover:underline">
                &larr; Back to Home
            </Link>
        </div>

        {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((article) => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>
        ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                <p>No news articles were found.</p>
            </div>
        )}
    </div>
  );
}
