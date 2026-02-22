import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/lib/types";
import { buildLessonHref } from "@/lib/lesson-path";

export default function NewsCard({ article }: { article: NewsArticle }) {
    const placeholderImage = "/placeholder.svg";

    const category = article.category_name || 'general';
    const createdDate = article.created_at ?? article.createdAt ?? article.publishedAt;
    const isBlog = (article.category_name || '').trim().toLowerCase() === 'blog' || article.category === 'blog';
    const detailHref = isBlog ? `/blog/${article.id}` : buildLessonHref(article);

    return (
        <Link href={detailHref} className="group block animate-fade-up">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-52 w-full overflow-hidden">
                    <Image 
                        src={article.imageUrl || placeholderImage} 
                        alt={article.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                        <div className="flex items-center gap-2">
                            <Image
                                src={article.authorAvatarUrl || "/placeholder.svg"}
                                alt={article.author || 'Author'}
                                width={18}
                                height={18}
                                sizes="18px"
                                className="h-[18px] w-[18px] rounded-full object-cover"
                            />
                            <span className="text-[11px] font-medium text-slate-500">{article.author || 'Unknown author'}</span>
                        </div>
                        <span className="text-xs font-semibold text-blue-700 transition-transform group-hover:translate-x-0.5">
                            Start lesson
                        </span>
                    </div>
                    <span className="mt-1 text-[11px] text-slate-400">
                        {createdDate ? new Date(createdDate).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
