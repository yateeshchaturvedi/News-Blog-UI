
import NewsCard from "@/components/news-card";
import { getNews } from "@/lib/api";
import { NewsArticle } from "@/lib/types";

export default async function HomePage() {
  let news: NewsArticle[] = [];
  try {
    // Fetch news without requiring a token for the public homepage
    news = await getNews();
  } catch (error) {
    // Log the error for debugging but don't redirect the user
    console.error("Failed to fetch news for homepage:", error);
    // The page will render with an empty news array, which is a graceful failure
  }

  const now = new Date();
  const trendingNews = news
    .filter(article => {
        const articleDate = new Date(article.createdAt);
        const diffTime = Math.abs(now.getTime() - articleDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    })
    .slice(0, 2);

  const latestNews = news.slice(0, 6);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Trending News Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Trending News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trendingNews.length > 0 ? (
            trendingNews.map((article) => (
              <NewsCard key={article.id} article={article} isLarge />
            ))
          ) : (
            <p>No trending news available at the moment.</p>
          )}
        </div>
      </section>

      {/* Latest News Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.length > 0 ? (
            latestNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))
          ) : (
            <p>No latest news available at the moment.</p>
          )}
        </div>
      </section>
    </main>
  );
}
