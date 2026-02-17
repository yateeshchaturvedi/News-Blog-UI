import NewsCard from '@/components/news-card';
import { getEnrichedNews } from './utils';
import Link from 'next/link';

export default async function NewsPage() {
  const news = await getEnrichedNews();

  return (
    <div className="space-y-8">
        <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
            <h1 className="text-4xl font-semibold text-slate-900">All News</h1>
            <Link href="/" className="rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                &larr; Back to Home
            </Link>
        </div>

        {news.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>
        ) : (
            <div className="rounded-2xl border border-blue-100 bg-white/85 py-14 text-center text-slate-500 shadow-sm">
                <p>No news articles were found.</p>
            </div>
        )}
    </div>
  );
}
