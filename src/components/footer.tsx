import { Twitter, Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-blue-100 bg-white/85 py-12 backdrop-blur">
            <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                    <div>
                        <h3 className="mb-4 text-xl font-semibold text-slate-900">About Us</h3>
                        <p className="text-slate-600">
                            DevOpsHub Academy helps engineers learn real DevOps workflows through practical, production-style lessons.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-4 text-xl font-semibold text-slate-900">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-slate-600 transition-colors hover:text-blue-700">Home</Link></li>
                            <li><Link href="/blog" className="text-slate-600 transition-colors hover:text-blue-700">Blog</Link></li>
                            <li><Link href="/contact" className="text-slate-600 transition-colors hover:text-blue-700">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-xl font-semibold text-slate-900">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="rounded-full border border-blue-100 p-2 text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"><Twitter /></a>
                            <a href="#" className="rounded-full border border-blue-100 p-2 text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"><Facebook /></a>
                            <a href="#" className="rounded-full border border-blue-100 p-2 text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"><Instagram /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-blue-100 pt-6 text-center text-sm text-slate-500">
                    &copy; 2026 DevOpsHub Academy. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
