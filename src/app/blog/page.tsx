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
        <div className="space-y-8">
            <div className="animate-fade-up rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <h1 className="text-4xl font-semibold text-slate-900">DevOpsHub Blog</h1>
                <p className="mt-3 text-lg text-slate-600">Deep dives, engineering notes, and team practices from real DevOps environments.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article: NewsArticle) => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}
