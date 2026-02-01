import NewsCard from "@/components/news-card";
import { getBlogs } from "@/lib/api";
import { Blog, NewsArticle } from "@/lib/types";

export default async function BlogPage() {
    const blogs = await getBlogs();

    const articles: NewsArticle[] = blogs.map((blog: Blog) => ({
        id: blog.id,
        title: blog.title,
        summary: blog.content.substring(0, 100) + "...", // Create a summary
        full_content: blog.content,
        imageUrl: "/placeholder.svg", // Use a placeholder image
        category: "blog",
        category_name: "Blog",
        created_at: blog.createdAt,
        updated_at: blog.updatedAt,
    }));

    return (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">NewsHub Blog</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Explore the latest articles and stay informed.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: NewsArticle) => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}
