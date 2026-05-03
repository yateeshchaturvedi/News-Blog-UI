import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Breadcrumbs from "@/components/Breadcrumbs";
import { normalizeCanonicalPath } from "@/lib/seo";
import ReadingProgress from "@/components/devops/ReadingProgress";
import PublicAdSlot from "@/components/PublicAdSlot";

function stripHtml(content: string): string {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  const blog = await getBlogById(slug);
  if (!blog) {
    return {
      title: "Blog Not Found",
      alternates: { canonical: "/blog" },
      robots: { index: false, follow: true },
    };
  }

  const description = stripHtml(blog.content || "").slice(0, 160) || "DevOps blog post";

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: normalizeCanonicalPath(`/blog/${slug}`),
    },
    openGraph: {
      type: "article",
      url: `/blog/${slug}`,
      title: blog.title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const blog = await getBlogById(slug);

  if (!blog) {
    notFound();
  }

  const createdDate = blog.updatedAt || blog.createdAt;

  return (
    <>
      <ReadingProgress />
      <div className="space-y-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: blog.title }]} />
        
        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/10">
               Devopstick Blog
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white lg:text-5xl">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                 <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800" />
                 <span>{blog.authorName || "Devopstick Team"}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>{formatDate(createdDate)}</span>
            </div>
          </div>
          <div
            className="lesson-content prose mt-12 max-w-none text-slate-700 dark:text-slate-300 prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-primary dark:prose-a:text-primary prose-strong:text-slate-950 dark:prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
              &larr; Back to Blog Archive
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
