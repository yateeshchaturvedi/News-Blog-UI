import { Home, Newspaper, Settings, LogOut, Menu, FolderTree, BookOpenText, Megaphone, UserRound, Mail, ShieldCheck, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { logout } from '@/app/actions';

interface JwtPayload {
    user?: {
        role?: number;
    };
}

async function handleLogout() {
    'use server';
    await logout();
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/admin');
    }

    let role = 2;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        role = decoded.user?.role ?? 2;
    } catch {
        role = 2;
    }

    const roleName = role === 1 ? 'Admin' : 'Editor';
    
    let profileName = `${roleName} User`;
    let profileAvatar = '';
    try {
        // Dynamically import to avoid circular dependencies if any, though regular import is fine
        const { getMyProfile } = await import('@/lib/api');
        const profile = await getMyProfile(token);
        if (profile.fullName || profile.username) {
            profileName = profile.fullName || profile.username;
        }
        if (profile.avatarUrl) {
            profileAvatar = profile.avatarUrl;
        }
    } catch (e) {
        // Ignore fetch errors
    }
    const navItems = [
        { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
        { href: '/admin/dashboard/news', icon: Newspaper, label: 'Lessons' },
        { href: '/admin/dashboard/interview-questions', icon: ClipboardList, label: 'Interview Q&A' },
        { href: '/admin/dashboard/profile', icon: UserRound, label: 'Profile' },
        { href: '/admin/dashboard/categories', icon: FolderTree, label: 'Categories' },
        { href: '/admin/dashboard/blogs', icon: BookOpenText, label: 'Blogs' },
        { href: '/admin/dashboard/advertisements', icon: Megaphone, label: 'Advertisements' },
        ...(role === 1 ? [{ href: '/admin/dashboard/contacts', icon: Mail, label: 'Contact Messages' }] : []),
        ...(role === 1 ? [{ href: '/admin/dashboard/audit-logs', icon: ShieldCheck, label: 'Audit Logs' }] : []),
        ...(role === 1 ? [{ href: '/admin/dashboard/settings', icon: Settings, label: 'Settings' }] : []),
    ];

    return (
        <div className="relative isolate flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
            {/* Sidebar Desktop */}
            <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
                <div className="flex h-full flex-col">
                    <div className="flex h-20 items-center border-b border-slate-100 px-8 dark:border-slate-800">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-white font-black">D</div>
                            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Devopstick</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary"
                                >
                                    <item.icon className="h-5 w-5 transition-colors group-hover:text-primary" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="border-t border-slate-100 p-6 dark:border-slate-800">
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                             <div className="flex items-center gap-3">
                                {profileAvatar ? (
                                    <img src={profileAvatar} alt={profileName} className="h-10 w-10 rounded-full object-cover shadow-sm" />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {profileName[0]?.toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-bold text-slate-900 dark:text-white">{profileName}</div>
                                    <div className="truncate text-xs text-slate-500">Workspace</div>
                                </div>
                             </div>
                             <form action={handleLogout} className="mt-4">
                                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 transition-all hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                    <LogOut className="h-3 w-3" />
                                    Sign Out
                                </button>
                             </form>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 p-0">
                                <div className="flex h-full flex-col bg-white dark:bg-slate-900">
                                    <div className="flex h-20 items-center border-b border-slate-100 px-8 dark:border-slate-800">
                                        <span className="text-xl font-black text-slate-900 dark:text-white">Devopstick</span>
                                    </div>
                                    <nav className="flex-1 px-4 py-6 space-y-1">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.label}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Dashboard / <span className="text-slate-900 dark:text-white">Overview</span></h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900 sm:flex">
                             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-xs font-bold text-slate-600 dark:text-slate-400">API Status: Operational</span>
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
