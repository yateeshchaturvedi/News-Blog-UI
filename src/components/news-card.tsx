import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/lib/types";

export default function NewsCard({ article }: { article: NewsArticle }) {
    const placeholderImage = "/placeholder.svg";

    const category = article.category_name || 'general';
    const categoryUrl = article.category_name ? article.category_name.toLowerCase() : 'uncategorized';
    const createdDate = article.created_at ?? article.createdAt ?? article.publishedAt;

    return (
        <Link href={`/news/${categoryUrl}/${article.id}`} className="group block animate-fade-up">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-52 w-full overflow-hidden">
                    <Image 
                        src={article.imageUrl || placeholderImage} 
                        alt={article.title} 
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-700">
                        {category}
                    </span>
                </div>
                <div className="flex flex-grow flex-col p-5">
                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-700">{article.title}</h3>
                    <p className="flex-grow text-sm leading-6 text-slate-600">{article.summary ?? ''}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-blue-50 pt-3">
                        <span className="text-xs font-medium text-slate-500">{createdDate ? new Date(createdDate).toLocaleDateString() : 'N/A'}</span>
                        <span className="text-xs font-semibold text-blue-700 transition-transform group-hover:translate-x-0.5">Read story</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
