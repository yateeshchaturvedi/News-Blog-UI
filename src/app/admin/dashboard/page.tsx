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
        <div className="flex flex-1 flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome Back, {roleName}</h1>
                    <p className="text-sm text-slate-600">
                        {role === 1
                            ? 'Track publishing status and manage DevOps learning modules.'
                            : 'Create and update lessons. Approval controls are available to admins.'}
                    </p>
                </div>
                <Link href="/admin/dashboard/news/new">
                    <Button className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        <span>Create New Lesson</span>
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {summaryStats.map((stat) => (
                    <div key={stat.title} className="rounded-xl border border-blue-100 bg-white/90 text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium tracking-tight text-slate-700">{stat.title}</h3>
                            <stat.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-3xl font-semibold text-slate-900">{stat.value}</div>
                            <p className="text-xs text-slate-500">{stat.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div>
                <h2 className="mb-4 text-2xl font-semibold text-slate-900">Publishing Workflow</h2>
                <div className="rounded-xl border border-blue-100 bg-white/90 text-card-foreground shadow-sm">
                    <div className="space-y-2 p-6 text-sm text-slate-600">
                        <p>1. Lessons with <span className="font-semibold text-slate-900">APPROVED</span> status are visible on public learning pages.</p>
                        <p>2. Use lesson actions to move modules between <span className="font-semibold text-slate-900">PENDING</span> and <span className="font-semibold text-slate-900">APPROVED</span>.</p>
                        <p>3. Create editor accounts from <span className="font-semibold text-slate-900">Settings</span>.</p>
                        <p>4. Manage taxonomy and promotions from <span className="font-semibold text-slate-900">Categories</span>, <span className="font-semibold text-slate-900">Blogs</span>, and <span className="font-semibold text-slate-900">Advertisements</span>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
