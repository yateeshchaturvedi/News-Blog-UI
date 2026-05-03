import Link from "next/link";
import { Blog } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function stripHtml(content: string): string {
    return content
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

export default function BlogCard({ blog }: { blog: Blog }) {
    const excerpt = stripHtml(blog.content || '');
    const createdDate = blog.updatedAt || blog.createdAt;

    return (
        <Link href={`/blog/${blog.id}`} className="group block animate-fade-up">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 shadow-[0_12px_35px_-20px_rgba(2,6,23,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-24px_rgba(2,6,23,0.4)]">
                <div className="flex h-40 items-center justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-5">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                        Blog
                    </span>
                    <span className="text-xs text-slate-200">Devopstick</span>
                </div>
                <div className="flex flex-grow flex-col p-5">
                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-slate-700">
                        {blog.title}
                    </h3>
                    <p className="flex-grow text-sm leading-6 text-slate-600">
                        {excerpt ? `${excerpt.slice(0, 120)}${excerpt.length > 120 ? '...' : ''}` : 'No summary available.'}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-[11px] font-medium text-slate-500">
                            {blog.authorName || 'Author not provided'}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                            Read blog
                        </span>
                    </div>
                    <span className="mt-1 text-[11px] text-slate-400">
                        {formatDate(createdDate)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
