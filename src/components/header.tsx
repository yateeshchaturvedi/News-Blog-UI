'use client'

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { navLinks } from "@/lib/placeholder";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-3 px-4 py-3 md:px-6">
                <Link href="/" className="text-4xl font-semibold leading-none text-slate-900">
                    DevOpsHub
                </Link>
                <nav className="hidden items-center gap-5 md:flex">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="rounded-full px-3 py-1.5 text-[15px] font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700">
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-2 md:gap-4">
                    <form onSubmit={handleSearch} className="relative hidden md:block">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search lessons..."
                            className="w-56 rounded-full border border-blue-100 bg-white/90 py-2 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all focus:w-64 focus:ring-2 focus:ring-blue-200"
                        />
                        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="rounded-full border border-blue-100 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-blue-50 md:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="animate-fade-up border-t border-blue-50 bg-white px-4 py-4 md:hidden">
                    <form onSubmit={handleSearch} className="relative mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search lessons..."
                            className="w-full rounded-full border border-blue-100 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>
                    <nav className="grid gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
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
