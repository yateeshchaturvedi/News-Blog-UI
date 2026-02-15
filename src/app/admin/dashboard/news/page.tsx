import Link from 'next/link';
import { PlusCircle, MoreHorizontal } from 'lucide-react';

import { getNews } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { NewsArticle } from '@/lib/types';

export default async function NewsListPage() {
    const news = await getNews();

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">News Articles</h1>
                    <p className="text-muted-foreground">Manage all your news articles here.</p>
                </div>
                <Link href="/admin/dashboard/news/new">
                    <Button className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        <span>Create New Post</span>
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Author</th>
                                <th scope="col" className="px-6 py-3">Published At</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map((article: NewsArticle) => (
                                <tr key={article.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {article.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {article.author}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(article.publishedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                         <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
