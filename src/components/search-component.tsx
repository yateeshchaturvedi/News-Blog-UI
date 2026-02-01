'use client'

import NewsCard from "@/components/news-card";
import { latestNews } from "@/lib/placeholder";
import { useSearchParams } from 'next/navigation';
import { NewsArticle } from "@/lib/types";

export default function SearchComponent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const filteredNews = latestNews.filter(news =>
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        news.description.toLowerCase().includes(query.toLowerCase())
    );

    const articles: NewsArticle[] = filteredNews.map((news) => ({
        id: news._id,
        title: news.title,
        summary: news.description,
        full_content: news.description, // Using description as full_content
        imageUrl: news.image,
        category: news.category,
        category_name: news.category,
        created_at: news.createdAt,
        updated_at: news.createdAt, // Using createdAt as updated_at
    }));

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Search Results for &quot;{query}&quot;</h1>
            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No results found for your search.
                </div>
            )}
        </div>
    );
}
