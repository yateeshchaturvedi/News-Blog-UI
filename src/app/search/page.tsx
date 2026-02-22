'use client'

import { useState, useEffect, useMemo } from 'react';
import { getNews } from '@/lib/api';
import NewsCard from '@/components/news-card';
import { NewsArticle } from '@/lib/types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = (searchParams.get('q') || '').trim();
    const [searchTerm, setSearchTerm] = useState('');
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSearchTerm(initialQuery);
    }, [initialQuery]);

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
        <div className="py-8">
            <div className="animate-fade-up mb-12 rounded-2xl border border-blue-100 bg-white/85 p-6 text-center shadow-sm">
                <h1 className="text-4xl font-semibold text-slate-900">Search Lessons</h1>
                <p className="mt-2 text-lg text-slate-600">Find the DevOps topic you want to learn next.</p>
            </div>

            <div className="mx-auto mb-12 max-w-2xl">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by lesson title or summary..."
                        className="w-full rounded-full border border-blue-100 bg-white py-4 pl-12 pr-6 text-lg text-slate-800 shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center text-slate-500">Loading lessons...</div>
            ) : filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredNews.map((item) => (
                        <NewsCard key={item.id} article={item} />
                    ))}
                </div>
            ) : (
                 <div className="rounded-2xl border border-blue-100 bg-white/85 py-16 text-center shadow-sm">
                    <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-slate-400" />
                    <h3 className="mt-4 text-2xl font-semibold text-slate-900">No Lessons Found</h3>
                    <p className="mt-2 text-slate-500">Your search for &quot;{searchTerm}&quot; did not match any lessons.</p>
                </div>
            )}
        </div>
    );
}
