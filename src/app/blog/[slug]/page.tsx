import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogById } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import { normalizeCanonicalPath } from '@/lib/seo';

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
      title: 'Blog Not Found',
      alternates: { canonical: '/blog' },
      robots: { index: false, follow: true },
    };
  }

  const description = stripHtml(blog.content || '').slice(0, 160) || 'DevOps blog post';

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: normalizeCanonicalPath(`/blog/${slug}`),
    },
    openGraph: {
      type: 'article',
      url: `/blog/${slug}`,
      title: blog.title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
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
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }, { name: blog.title }]} />
      <article className="rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">DevOpsTic Blog</p>
          <h1 className="text-4xl font-semibold text-slate-900">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{blog.authorName || 'DevOpsTic Team'}</span>
            <span>•</span>
            <span>{createdDate ? new Date(createdDate).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        <div
          className="lesson-content prose mt-8 max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: blog.content || '' }}
        />
        <div className="mt-10">
          <Link href="/blog" className="text-sm font-semibold text-blue-700 hover:underline">
            &larr; Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
