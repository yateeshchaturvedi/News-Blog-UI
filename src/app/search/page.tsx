'use client'

import { useState, useEffect, useMemo } from 'react';
import { getNews } from '@/lib/api';
import NewsCard from '@/components/news-card';
import { NewsArticle } from '@/lib/types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            try {
                const newsData = await getNews();
                setNews(newsData);
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    const filteredNews = useMemo(() => {
        if (!searchTerm) {
            return news;
        }
        return news.filter(item =>
            (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, news]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Search for News</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Find the articles that matter to you.</p>
            </div>

            <div className="mb-12 max-w-2xl mx-auto">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by title or summary..."
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-4 pl-12 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow shadow-md hover:shadow-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">Loading articles...</div>
            ) : filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNews.map((item) => (
                        <NewsCard key={item.id} article={item} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16">
                    <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">No Articles Found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Your search for &quot;{searchTerm}&quot; did not match any articles.</p>
                </div>
            )}
        </div>
    );
}
