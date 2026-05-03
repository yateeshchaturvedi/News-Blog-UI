import BlogExplorer from "@/components/devops/BlogExplorer";
import { getPaginatedBlogs } from "@/lib/api";
import type { Metadata } from "next";
import PublicAdSlot from "@/components/PublicAdSlot";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { normalizeCanonicalPath } from "@/lib/seo";
import { FileText, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "DevOps Blog",
  description: "Read deep dives, engineering notes, and practical DevOps insights from the Devopstick team.",
  alternates: {
    canonical: normalizeCanonicalPath("/blog"),
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, Number.parseInt(resolvedParams.page || "1", 10) || 1);
  const approvedResponse = await getPaginatedBlogs(page, 9, "APPROVED");
  let blogs = approvedResponse.items;
  let pagination = approvedResponse.pagination;

  if (blogs.length === 0) {
    const allResponse = await getPaginatedBlogs(page, 9);
    blogs = allResponse.items;
    pagination = allResponse.pagination;
  }

  // Removed mock fallback to prioritize API data
  const finalBlogs = blogs;
  const featuredBlog = finalBlogs[0];
  const authors = Array.from(new Set(finalBlogs.map((blog) => blog.authorName).filter(Boolean)));

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog" }]} />

      <div className="space-y-8">
        <section className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-6 md:p-8">
            <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">Devopstick Blog</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Deep dives into cloud architecture, automation, and engineering culture.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50">
                <FileText className="h-5 w-5 text-primary" />
                <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{pagination.total || finalBlogs.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Published Posts</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50">
                <UserRound className="h-5 w-5 text-primary" />
                <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{authors.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expert Authors</p>
              </div>
            </div>
          </div>
          {featuredBlog && (
            <div className="border-t border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/50">
              <Link href={`/blog/${featuredBlog.id}`} className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  Featured Post
                </div>
                <h2 className="line-clamp-2 text-xl font-black text-slate-950 dark:text-white group-hover:text-primary transition-colors">{featuredBlog.title}</h2>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <span>{featuredBlog.authorName || "Devopstick Team"}</span>
                </div>
              </Link>
            </div>
          )}
        </section>

        <BlogExplorer blogs={finalBlogs} />

        <div className="flex items-center justify-center gap-3 py-8">
          <Link
            href={`/blog?page=${Math.max(1, pagination.page - 1)}`}
            className={`rounded-xl border px-6 py-2.5 text-sm font-bold transition-all ${pagination.hasPreviousPage
              ? "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100"
              : "pointer-events-none border-slate-100 text-slate-300 dark:border-slate-800 dark:text-slate-600"
              }`}
          >
            Previous
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20">
            {pagination.page}
          </div>
          <Link
            href={`/blog?page=${pagination.page + 1}`}
            className={`rounded-xl border px-6 py-2.5 text-sm font-bold transition-all ${pagination.hasNextPage
              ? "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100"
              : "pointer-events-none border-slate-100 text-slate-300 dark:border-slate-800 dark:text-slate-600"
              }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
