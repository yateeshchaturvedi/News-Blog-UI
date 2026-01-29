import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import NewsCard from "@/components/news-card";
import { getNews } from "@/lib/api";
import { NewsArticle } from "@/lib/types";

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  let news;

  try {
    news = await getNews(token);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      redirect('/admin');
    }
    // For other errors, you might want to show an error page or log it
    throw error;
  }

  const trendingNews = news.slice(0, 2);
  const latestNews = news.slice(2, 8);

  return (
    <div>
      {/* Trending News Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Trending News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trendingNews.map((news: NewsArticle) => (
            <NewsCard key={news.title} {...news} />
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.map((news: NewsArticle) => (
            <NewsCard key={news.title} {...news} />
          ))}
        </div>
      </section>

      {/* Advertisement Section */}
      <div className="mt-12 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
