import NewsCard from "@/components/news-card";
import { getBlogs } from "@/lib/api";
import { Blog } from "@/lib/types";

export default async function BlogPage() {
    const blogs = await getBlogs();

    return (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">NewsHub Blog</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Explore the latest articles and stay informed.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog: Blog) => (
                    <NewsCard key={blog.id} {...blog} />
                ))}
            </div>
        </div>
    );
}
