import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/lib/types";

export default function NewsCard({ article }: { article: NewsArticle }) {
    const placeholderImage = "/placeholder.svg";

    const category = article.category_name || 'general';
    const categoryUrl = article.category_name ? article.category_name.toLowerCase() : 'uncategorized';

    return (
        <Link href={`/news/${categoryUrl}/${article.id}`} className="block group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                <div className="relative h-48 w-full">
                    <Image 
                        src={article.imageUrl || placeholderImage} 
                        alt={article.title} 
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                </div>
                <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors duration-300 mb-2 truncate">{article.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">{article.summary}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(article.created_at).toLocaleDateString()}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full dark:bg-blue-900 dark:text-blue-200 capitalize">{category}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
