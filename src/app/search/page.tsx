'use client'

import { useState, useEffect, useMemo } from 'react';
import { getNews } from '@/lib/api';
import NewsCard from '@/components/news-card';
import { NewsArticle } from '@/lib/types';

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [news, setNews] = useState<NewsArticle[]>([]);

    useEffect(() => {
        async function fetchNews() {
            const newsData = await getNews();
            setNews(newsData);
        }
        fetchNews();
    }, []);

    const filteredNews = useMemo(() => {
        return news.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, news]);

    return (
        <div>
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search for articles..."
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item) => (
                    <NewsCard key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
}
