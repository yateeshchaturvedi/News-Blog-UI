import Link from 'next/link';
import { PlusCircle, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getNews } from '@/lib/api';

export default async function AdminDashboard() {
    const news = await getNews();
    const totalArticles = news.length;

    const summaryStats = [
        { 
            title: 'Total Articles', 
            value: totalArticles, 
            icon: Newspaper, 
            href: '#', // Link to news management page
            change: `+5 from last month` // Placeholder change data
        },
        // Add more stats here as needed
    ];

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back, Admin!</h1>
                    <p className="text-muted-foreground">Here&apos;s a summary of your news content.</p>
                </div>
                <Link href="/admin/dashboard/news/new">
                    <Button className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        <span>Create New Post</span>
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {summaryStats.map((stat) => (
                    <div key={stat.title} className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium tracking-tight">{stat.title}</h3>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Placeholder for recent activity or other dashboard components */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <p className="text-muted-foreground">No recent activity to display.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
