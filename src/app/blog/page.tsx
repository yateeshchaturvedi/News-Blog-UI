import NewsCard from "@/components/news-card";
import { getPaginatedBlogs } from "@/lib/api";
import { Blog, NewsArticle } from "@/lib/types";
import type { Metadata } from "next";
import PublicAdSlot from "@/components/PublicAdSlot";
import Link from "next/link";

export const metadata: Metadata = {
    title: "DevOps Blog",
    description: "Read deep dives, engineering notes, and practical DevOps insights from the DevOpsTic team.",
    alternates: {
        canonical: "/blog",
    },
};

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

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const resolvedParams = await searchParams;
    const page = Math.max(1, Number.parseInt(resolvedParams.page || '1', 10) || 1);
    const { items: blogs, pagination } = await getPaginatedBlogs(page, 9, 'APPROVED');

    const articles: NewsArticle[] = blogs.map((blog: Blog) => ({
        id: blog.id,
        title: blog.title,
        summary: stripHtml(blog.content).slice(0, 100) + "...",
        full_content: blog.content,
        imageUrl: "/placeholder.svg", // Use a placeholder image
        category: "blog",
        category_name: "Blog",
        created_at: blog.createdAt,
        updated_at: blog.updatedAt,
    }));

    return (
        <div className="space-y-8">
            <div className="animate-fade-up rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <h1 className="text-4xl font-semibold text-slate-900">DevOpsTic Blog</h1>
                <p className="mt-3 text-lg text-slate-600">Deep dives, engineering notes, and team practices from real DevOps environments.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article: NewsArticle) => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>
            <div className="flex items-center justify-center gap-3">
                <Link
                    href={`/blog?page=${Math.max(1, pagination.page - 1)}`}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${pagination.hasPreviousPage
                        ? 'border-blue-100 text-blue-700 hover:bg-blue-50'
                        : 'pointer-events-none border-slate-200 text-slate-400'
                        }`}
                >
                    Previous
                </Link>
                <span className="text-sm text-slate-600">
                    Page {pagination.page} of {pagination.totalPages}
                </span>
                <Link
                    href={`/blog?page=${pagination.page + 1}`}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${pagination.hasNextPage
                        ? 'border-blue-100 text-blue-700 hover:bg-blue-50'
                        : 'pointer-events-none border-slate-200 text-slate-400'
                        }`}
                >
                    Next
                </Link>
            </div>
            <PublicAdSlot placement="blog-sidebar" title="Sponsored" />
        </div>
    );
}
