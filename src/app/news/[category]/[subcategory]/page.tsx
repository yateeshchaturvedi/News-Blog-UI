import NewsCard from "@/components/news-card";
import { latestNews } from "@/lib/placeholder";

export default function SubCategoryPage({ params }: { params: { category: string, subcategory: string } }) {
    const news = latestNews.filter(p => p.category.toLowerCase() === params.category && p.href.includes(params.subcategory));

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                {params.category.charAt(0).toUpperCase() + params.category.slice(1)} - {params.subcategory}
            </h1>
            {news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((news) => (
                        <NewsCard key={news.title} {...news} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No news found in this subcategory.
                </div>
            )}
        </div>
    );
}
