import Link from 'next/link';
import { PlusCircle, Newspaper, Clock3, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getNews } from '@/lib/api';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    user?: {
        role?: number;
    };
}

export default async function AdminDashboard() {
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
    const roleName = role === 1 ? 'Admin' : 'Editor';

    const news = await getNews();
    const totalArticles = news.length;
    const approvedArticles = news.filter((item) => (item.status || '').toUpperCase() === 'APPROVED').length;
    const pendingArticles = news.filter((item) => (item.status || '').toUpperCase() === 'PENDING').length;

    const summaryStats = [
        { 
            title: 'Total Lessons', 
            value: totalArticles, 
            icon: Newspaper, 
            description: 'All created learning modules'
        },
        {
            title: 'Approved',
            value: approvedArticles,
            icon: BadgeCheck,
            description: 'Visible on public learning pages',
        },
        {
            title: 'Pending',
            value: pendingArticles,
            icon: Clock3,
            description: 'Pending review before publishing',
        },
    ];

    return (
        <div className="flex flex-1 flex-col gap-10 p-2">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">Welcome back, <span className="text-primary">{roleName}</span></h1>
                        <p className="mt-2 max-w-md text-slate-400">
                            {role === 1
                                ? 'You have full administrative control over lessons, blogs, and advertisements.'
                                : 'You can create and manage content. Submit your work for admin approval.'}
                        </p>
                    </div>
                    <Link href="/admin/dashboard/news/new">
                        <Button className="h-12 gap-2 rounded-xl bg-primary px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                            <PlusCircle className="h-5 w-5" />
                            Create New Lesson
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                 {summaryStats.map((stat, i) => (
                    <div key={stat.title} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:bg-slate-800 dark:text-slate-400`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Stat {i + 1}</span>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-950 dark:text-white">{stat.value}</div>
                            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{stat.title}</div>
                            <p className="mt-2 text-xs text-slate-500">{stat.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-xl font-black text-slate-950 dark:text-white">Publishing Workflow</h2>
                    <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex gap-4">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">01</div>
                            <p><span className="font-bold text-slate-900 dark:text-white">Review:</span> Lessons start as <span className="text-amber-600 font-bold">PENDING</span> and are only visible to editors and admins.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">02</div>
                            <p><span className="font-bold text-slate-900 dark:text-white">Approve:</span> Admins can change status to <span className="text-emerald-600 font-bold">APPROVED</span> to publish live.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">03</div>
                            <p><span className="font-bold text-slate-900 dark:text-white">Monetize:</span> Use the <span className="font-bold text-slate-900 dark:text-white">Advertisements</span> tab to manage global sidebar placements.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-primary p-8 text-white shadow-xl shadow-primary/20">
                    <div>
                        <h3 className="text-2xl font-black">Need Help?</h3>
                        <p className="mt-2 text-white/80">Check out the documentation or contact the engineering team for platform support.</p>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button className="rounded-xl bg-white px-6 py-2.5 text-sm font-black text-primary transition-all hover:bg-slate-50">Documentation</button>
                        <button className="rounded-xl border border-white/30 bg-transparent px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10">Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
