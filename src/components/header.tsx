'use client'

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { navLinks } from "@/lib/placeholder";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationToggle from "@/components/NotificationToggle";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${searchQuery}`);
            setMenuOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/72 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.5)] backdrop-blur-2xl">
            <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-3 px-4 py-3 md:px-6">
                <Link href="/" className="text-4xl font-semibold leading-none tracking-tight text-slate-900">
                    <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 bg-clip-text text-transparent">
                        DevOpsTic
                    </span>
                </Link>
                <nav className="hidden items-center gap-5 md:flex">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="rounded-full px-3 py-1.5 text-[15px] font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900">
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden md:block">
                        <NotificationToggle />
                    </div>
                    <form onSubmit={handleSearch} className="relative hidden md:block">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search lessons..."
                            className="w-60 rounded-full border border-slate-200 bg-white/95 py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all focus:w-72 focus:border-blue-200 focus:ring-2 focus:ring-blue-100"
                        />
                        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 md:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="animate-fade-up border-t border-slate-100 bg-white/95 px-4 py-4 md:hidden">
                    <form onSubmit={handleSearch} className="relative mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search lessons..."
                            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>
                    <div className="mb-4">
                        <NotificationToggle />
                    </div>
                    <nav className="grid gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
