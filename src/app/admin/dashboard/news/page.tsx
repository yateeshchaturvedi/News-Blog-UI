import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { getNews } from "@/lib/api";
import { formatDate } from "@/lib/utils";
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
        <div className="flex flex-1 flex-col gap-8 p-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Learning Modules</h1>
                    <p className="text-sm text-slate-500">Manage, approve, and organize your DevOps curriculum.</p>
                </div>
                <Link href="/admin/dashboard/news/new">
                    <Button className="h-11 gap-2 rounded-xl bg-primary font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
                        <PlusCircle className="h-5 w-5" />
                        Create New Lesson
                    </Button>
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-black uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {news.map((article: NewsArticle) => {
                                const publishedDate = article.publishedAt ?? article.created_at ?? article.createdAt;
                                return (
                                    <tr key={article.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{article.title}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-tight">ID: {article.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {article.authorAvatarUrl ? (
                                                    <img src={article.authorAvatarUrl} alt={article.author || 'Author'} className="h-6 w-6 rounded-full object-cover shadow-sm" />
                                                ) : (
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                        {(article.author || 'D')[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-medium text-slate-600 dark:text-slate-400">{article.author || 'Devopstick'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                                article.status === 'APPROVED'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                                {article.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {formatDate(publishedDate || '')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                {isAdmin && (
                                                    <>
                                                        <form action={setNewsStatus.bind(null, String(article.id), 'APPROVED')}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                type="submit"
                                                                disabled={article.status === 'APPROVED'}
                                                                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20"
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
                                                                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20"
                                                            >
                                                                Pending
                                                            </Button>
                                                        </form>
                                                    </>
                                                )}
                                                <Link href={`/admin/dashboard/news/${article.id}`}>
                                                    <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider">Edit</Button>
                                                </Link>
                                                <form action={deleteArticle.bind(null, String(article.id))}>
                                                    <Button variant="destructive" size="sm" type="submit" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider">Delete</Button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
