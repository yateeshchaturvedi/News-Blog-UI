import { Home, Newspaper, Settings, LogOut, Menu, FolderTree, BookOpenText, Megaphone, UserRound } from 'lucide-react';
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

    const navItems = [
        { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
        { href: '/admin/dashboard/news', icon: Newspaper, label: 'Lessons' },
        { href: '/admin/dashboard/profile', icon: UserRound, label: 'Profile' },
        { href: '/admin/dashboard/categories', icon: FolderTree, label: 'Categories' },
        { href: '/admin/dashboard/blogs', icon: BookOpenText, label: 'Blogs' },
        { href: '/admin/dashboard/advertisements', icon: Megaphone, label: 'Advertisements' },
        ...(role === 1 ? [{ href: '/admin/dashboard/settings', icon: Settings, label: 'Settings' }] : []),
    ];

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[300px_1fr]">
            <div className="hidden border-r border-blue-100 bg-white/85 backdrop-blur md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b border-blue-100 px-4 lg:h-[64px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">DevOpsTic</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start gap-1 px-2 pt-2 text-sm font-medium lg:px-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        <form action={handleLogout}>
                            <Button size="sm" variant="outline" className="w-full justify-start">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-transparent">
                <header className="flex h-14 items-center gap-4 border-b border-blue-100 bg-white/70 px-4 backdrop-blur lg:h-[64px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="/"
                                    className="mb-4 flex items-center gap-2 text-lg font-semibold"
                                >
                                     <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">DevOpsTic</span>
                                </Link>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-auto">
                                <form action={handleLogout}>
                                    <Button size="sm" variant="outline" className="w-full justify-start">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </Button>
                                </form>
                            </div>
                        </SheetContent>
                    </Sheet>
                     <div className="w-full flex-1">
                         {/* Optional: Can add a search bar here */}
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
