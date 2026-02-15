import { Home, Newspaper, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { logout } from '@/app/actions';

const navItems = [
    { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin/dashboard/news', icon: Newspaper, label: 'News' },
];

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

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">NewsHub</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
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
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
                                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                                >
                                     <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">NewsHub</span>
                                </Link>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
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
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
