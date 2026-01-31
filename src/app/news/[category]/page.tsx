
import NewsCard from "@/components/news-card";
import { getNews } from "@/lib/api";
import { NewsArticle } from "@/lib/types";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category ? decodeURIComponent(params.category) : "";
  let allNews: NewsArticle[] = [];

  try {
    allNews = await getNews();
  } catch (error) {
    console.error(`Failed to fetch news for category ${category}:`, error);
  }

  const news = allNews.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

  return (
      <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
              {categoryTitle}
          </h1>
          {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {news.map((article) => (
                      <NewsCard key={article.id} article={article} />
                  ))}
              </div>
          ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                  No news found in this category.
              </div>
          )}
      </div>
  );
}
