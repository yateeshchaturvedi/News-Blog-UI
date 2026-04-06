import NewsCard from '@/components/news-card';
import { getEnrichedNews } from './news/utils';
import { getBlogs } from '@/lib/api';
import Link from 'next/link';
import type { Metadata } from 'next';
import PublicAdSlot from '@/components/PublicAdSlot';
import {
  ArrowRight,
  Cloud,
  FolderTree,
  GitBranch,
  Rocket,
  ServerCog,
  TerminalSquare,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Latest DevOps Lessons',
  description: 'Browse the latest practical DevOps lessons on CI/CD, Kubernetes, cloud infrastructure, and observability.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const [latestNews, blogs] = await Promise.all([getEnrichedNews(), getBlogs()]);
  const publishedBlogs = [...blogs]
    .sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 6);

  const stats = [
    { label: 'Learning Topics', value: 2 },
    { label: 'Published Lessons', value: 12 },
    { label: 'Hands-on Projects', value: 1 },
    { label: 'Interview Q&A', value: 0 },
  ];

  const learningAreas = [
    {
      title: 'Linux & Networking',
      description: 'Shell literacy, system fundamentals, and network troubleshooting.',
      icon: TerminalSquare,
    },
    {
      title: 'Containers & Orchestration',
      description: 'Docker workflows, Kubernetes basics, and deployment patterns.',
      icon: ServerCog,
    },
    {
      title: 'CI/CD Pipelines',
      description: 'Automated builds, test gates, and release confidence.',
      icon: Rocket,
    },
    {
      title: 'Cloud Platforms',
      description: 'Infrastructure planning, scaling, and reliability in the cloud.',
      icon: Cloud,
    },
    {
      title: 'Infrastructure as Code',
      description: 'Declarative provisioning with Terraform and config tooling.',
      icon: FolderTree,
    },
    {
      title: 'Version Control',
      description: 'Git strategies, branching discipline, and collaboration.',
      icon: GitBranch,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-12">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)] md:p-12">
        <div className="absolute right-8 top-8 hidden h-36 w-36 rounded-full bg-gradient-to-br from-blue-200/60 via-cyan-200/40 to-transparent blur-2xl md:block" />
        <div className="animate-fade-up space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Open Source Learning Platform
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-6xl">
              Learn DevOps by building real systems.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              A structured path of lessons, projects, and interview prep that makes cloud and
              infrastructure work feel practical from day one.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/lessons"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Join the Community
              </Link>
            </div>
          </div>
      </section>

      <section className="space-y-8">
        <div className="animate-fade-up space-y-2">
          <h2 className="text-3xl font-semibold text-slate-900">What you&apos;ll learn</h2>
          <p className="text-sm text-slate-600">
            Core DevOps skills, from fundamentals to production-ready automation.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {learningAreas.map((area) => (
            <div key={area.title} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <area.icon className="h-6 w-6 text-blue-600" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{area.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-900">Learning Notes</h3>
          <p className="mt-3 text-sm text-slate-600">
            Structured notes on Linux, Docker, Kubernetes, and cloud foundations. Learn at your own pace.
          </p>
          <Link
            href="/lessons"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
          >
            Explore Notes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-900">Hands-on Projects</h3>
          <p className="mt-3 text-sm text-slate-600">
            Real-world DevOps projects with step-by-step guides. Build, deploy, and automate.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
          >
            View Projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Latest lessons</h2>
            <p className="mt-2 text-sm text-slate-600">Fresh releases and updates from the community.</p>
          </div>
          <Link
            href="/lessons"
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Explore all lessons
          </Link>
        </div>
        {latestNews.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.slice(0, 6).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white/85 py-14 text-center text-slate-500 shadow-sm">
            <p>No lessons found yet.</p>
          </div>
        )}
      </section>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-blue-100 bg-white/90 p-3 shadow-sm">
          <PublicAdSlot placement="homepage-top" title="Sponsored" compact />
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Published Blogs</h2>
            <Link href="/blog" className="text-xs font-semibold text-blue-700 hover:underline">
              View all
            </Link>
          </div>
          {publishedBlogs.length > 0 ? (
            <div className="space-y-3">
              {publishedBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="block rounded-lg border border-blue-50 px-3 py-2 transition-colors hover:bg-blue-50/70"
                >
                  <p className="line-clamp-2 text-sm font-medium text-slate-900">{blog.title}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No blogs published yet.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
