import { Github, Linkedin, Youtube, Rss } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-slate-200/70 bg-white/80 py-12 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3">
                        <h3 className="text-2xl font-semibold text-slate-900">DevOpsTic Academy</h3>
                        <p className="max-w-md text-sm leading-6 text-slate-600">
                            A community-powered DevOps learning space with lessons, projects, and interview prep built by practitioners.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-600">
                        <Link href="/lessons" className="transition-colors hover:text-slate-900">Notes</Link>
                        <Link href="/blog" className="transition-colors hover:text-slate-900">Projects</Link>
                        <Link href="/interview-questions" className="transition-colors hover:text-slate-900">Interview Q&A</Link>
                        <Link href="/topics" className="transition-colors hover:text-slate-900">Topics</Link>
                        <Link href="/contact" className="transition-colors hover:text-slate-900">Contact</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="#" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"><Github className="h-4 w-4" /></a>
                        <a href="#" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"><Linkedin className="h-4 w-4" /></a>
                        <a href="#" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"><Youtube className="h-4 w-4" /></a>
                        <a href="#" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"><Rss className="h-4 w-4" /></a>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
                    &copy; 2026 DevOpsTic Academy
                </div>
            </div>
        </footer>
    );
}
