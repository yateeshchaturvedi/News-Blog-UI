import type { Metadata } from 'next';
import { latestNews, trendingNews } from "@/lib/placeholder";
import Image from "next/image";
import { use } from 'react';
import { normalizeCanonicalPath, toAbsoluteUrl } from '@/lib/seo';
import PublicAdSlot from '@/components/PublicAdSlot';
import Breadcrumbs from '@/components/Breadcrumbs';

function findPostBySlug(slug: string) {
    const allNews = [...trendingNews, ...latestNews];
    return allNews.find((p) => p.href === `/blog/${slug}`);
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = findPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
            alternates: { canonical: '/blog' },
            robots: { index: false, follow: true },
        };
    }

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: normalizeCanonicalPath(`/blog/${slug}`),
        },
        openGraph: {
            type: 'article',
            url: `/blog/${slug}`,
            title: post.title,
            description: post.description,
            images: [{ url: post.image }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: [post.image],
        },
    };
}

export default function BlogPostPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = use(paramsPromise);
    const news = findPostBySlug(params.slug);

    if (!news) {
        return <div className="text-center text-red-500">Learning post not found</div>;
    }

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: news.title,
        description: news.description,
        datePublished: new Date(news.createdAt).toISOString(),
        image: [news.image],
        mainEntityOfPage: toAbsoluteUrl(`/blog/${params.slug}`),
        author: {
            '@type': 'Person',
            name: news.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'DevOpsTic Academy',
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="px-6 pt-6">
                <Breadcrumbs
                    items={[
                        { name: 'Home', href: '/' },
                        { name: 'Blog', href: '/blog' },
                        { name: news.title },
                    ]}
                />
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <div className="relative h-[500px]">
                <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    sizes="100vw"
                    className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-12">
                     <span className="text-white bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">{news.category}</span>
                    <h1 className="text-5xl font-extrabold text-white mt-4 leading-tight">{news.title}</h1>
                    <p className="text-gray-300 mt-2">Published: {news.createdAt}</p>
                </div>
            </div>
            <div className="p-12">
                <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
                    <p className="text-xl font-semibold mb-6">{news.description}</p>
                    <p>This learning article walks through the practical workflow behind modern DevOps teams: plan a change, version it, validate it in CI, deploy safely, and observe impact in production.</p>
                    <p>You can use this structure for every topic, from Docker image optimization to Kubernetes rollout strategy and Terraform state management.</p>
                    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-8 bg-gray-50 dark:bg-gray-700">
                        <p className="text-xl italic font-medium text-gray-900 dark:text-white">&quot;Automate what is repetitive, observe what is critical, and document what matters.&quot;</p>
                    </blockquote>
                    <p>Pair each lesson with a small lab, expected outcomes, and troubleshooting notes so learners can build confidence by executing real workflows instead of only reading theory.</p>
                </div>
                <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                    <PublicAdSlot placement="blog-detail" title="Sponsored" />
                </div>
            </div>
        </div>
    );
}
