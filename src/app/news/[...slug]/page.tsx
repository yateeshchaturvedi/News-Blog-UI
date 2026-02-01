import { getNews, getNewsById } from "@/lib/api";
import { NewsArticle } from "@/lib/types";
import NewsCard from "@/components/news-card";
import Link from "next/link";

// Helper function to capitalize the first letter of a string
function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default async function NewsPage({ params }: { params: { slug: string[] } }) {
  // Defensive check for slug
  if (!params.slug || !Array.isArray(params.slug) || params.slug.length === 0) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p>The requested page could not be found.</p>
            <Link href="/news" className="text-blue-500 hover:underline mt-4 inline-block">
                &larr; Back to News
            </Link>
        </div>
    );
  }

  const slug = params.slug.map(segment => decodeURIComponent(segment));

  // Case 1: Viewing a single article (/news/[category]/[articleId])
  if (slug.length === 2) {
    const [category, articleId] = slug;
    let article: NewsArticle | undefined = undefined;
    let error = null;

    try {
      article = await getNewsById(articleId);
    } catch (e: any) {
      error = e.message;
    }

    if (error) {
      return <div className="text-center text-red-500"><p>Error loading news: {error}</p></div>;
    }

    if (!article) {
      return <div className="text-center"><p>News article not found.</p></div>;
    }

    // Capitalize category name for display
    const displayCategory = article.category_name ? capitalize(article.category_name) : 'Category';

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-4">
            <Link href={`/news/${article.category_name?.toLowerCase()}`} className="text-blue-500 hover:underline">
              &larr; Back to {displayCategory}
            </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{article.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{displayCategory}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Published on: {new Date(article.created_at).toLocaleDateString()}
        </p>
        {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover rounded-lg mb-8" />}
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.full_content }}></div>
      </div>
    );
  }

  // Case 2: Viewing a category list (/news/[category])
  if (slug.length === 1) {
    const categoryName = slug[0];
    let articles: NewsArticle[] = [];
    let error = null;

    try {
      const allNews = await getNews();
      articles = allNews.filter(
        article => article.category_name && article.category_name.toLowerCase() === categoryName.toLowerCase()
      );
    } catch (e: any) {
      error = e.message;
    }

    if (error) {
      return <div className="text-center text-red-500"><p>Error loading news: {error}</p></div>;
    }

    if (articles.length === 0) {
        return <div className="text-center"><p>No news found for this category.</p></div>
    }

    // Get the properly capitalized category name from the first article
    const displayCategoryName = articles[0]?.category_name ? capitalize(articles[0].category_name) : capitalize(categoryName);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{displayCategoryName} News</h1>
             <Link href="/news" className="text-blue-500 hover:underline mt-2 inline-block">
                &larr; Back to All News
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    );
  }

  // Case 3: Invalid URL
  return (
      <div className="text-center">
          <h1 className="text-2xl font-bold">Page Not Found</h1>
          <p>The URL is not valid.</p>
          <Link href="/news" className="text-blue-500 hover:underline mt-4 inline-block">
              &larr; Back to News
          </Link>
      </div>
  )
}
