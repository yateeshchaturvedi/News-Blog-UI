import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { getNews } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { NewsArticle } from '@/lib/types';
import { deleteArticle, setNewsStatus } from '@/app/actions';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    user?: {
        role?: number;
    };
}

export default async function NewsListPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    let role = 2;
    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            role = decoded.user?.role ?? 2;
        } catch {
            role = 2;
        }
    }
    const isAdmin = role === 1;

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
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Published At</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map((article: NewsArticle) => (
                                (() => {
                                    const publishedDate = article.publishedAt ?? article.created_at ?? article.createdAt;
                                    return (
                                <tr key={article.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {article.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {article.author || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                            article.status === 'APPROVED'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {article.status || 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {publishedDate ? new Date(publishedDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            {isAdmin && (
                                                <>
                                                    <form action={setNewsStatus.bind(null, String(article.id), 'APPROVED')}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            type="submit"
                                                            disabled={article.status === 'APPROVED'}
                                                        >
                                                            Approve
                                                        </Button>
                                                    </form>
                                                    <form action={setNewsStatus.bind(null, String(article.id), 'PENDING')}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            type="submit"
                                                            disabled={article.status === 'PENDING' || !article.status}
                                                        >
                                                            Set Pending
                                                        </Button>
                                                    </form>
                                                </>
                                            )}
                                            <Link href={`/admin/dashboard/news/${article.id}`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <form action={deleteArticle.bind(null, String(article.id))}>
                                                <Button variant="destructive" size="sm" type="submit">Delete</Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                                    );
                                })()
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
