import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-slate-200/70 bg-white/70 py-12 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Devopstick</h3>
                            The comprehensive learning platform for modern engineers. Master Linux, Docker, Kubernetes, and Cloud.
                    </div>
                    <div>
                        <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/lessons" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Dashboard</Link></li>
                            <li><Link href="/learning" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Learn</Link></li>
                            <li><Link href="/lessons" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Lessons</Link></li>
                            <li><Link href="/blog" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Blog</Link></li>
                            <li><Link href="/about" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">About</Link></li>
                            <li><Link href="/contact" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Contact</Link></li>
                            <li><Link href="/privacy" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Privacy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Community</h3>
                        <div className="flex space-x-4">
                            <a href="#" aria-label="Twitter" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><Twitter /></a>
                            <a href="#" aria-label="GitHub" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><Github /></a>
                            <a href="#" aria-label="LinkedIn" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><Linkedin /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    &copy; 2026 Devopstick. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
