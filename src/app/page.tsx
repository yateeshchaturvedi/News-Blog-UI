import NewsCard from '@/components/news-card';
import { getEnrichedNews } from './news/utils';
import { getBlogs, getInterviewQuestions } from '@/lib/api';
import Link from 'next/link';
import type { Metadata } from 'next';
import PublicAdSlot from '@/components/PublicAdSlot';
import {
  ArrowRight,
  BookOpenText,
  Cloud,
  Code2,
  FolderTree,
  GitBranch,
  GraduationCap,
  Handshake,
  Lightbulb,
  Rocket,
  ServerCog,
  TerminalSquare,
  Users,
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
  const [latestNews, blogs, interviewQuestions] = await Promise.all([
    getEnrichedNews(),
    getBlogs(),
    getInterviewQuestions(),
  ]);
  const publishedBlogs = [...blogs]
    .sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 6);
  const topicCount = new Set(
    latestNews
      .map((item) => (item.category_name || '').trim())
      .filter((value) => value.length > 0)
  ).size;

  const stats = [
    { label: 'Learning Topics', value: topicCount },
    { label: 'Published Lessons', value: latestNews.length },
    { label: 'Hands-on Projects', value: publishedBlogs.length },
    { label: 'Interview Q&A', value: interviewQuestions.length },
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

  const involvementTracks = [
    {
      title: 'Improve Lessons',
      description: 'Fix gaps, add new examples, and strengthen the curriculum.',
      icon: BookOpenText,
    },
    {
      title: 'Ship Projects',
      description: 'Share build guides and real-world DevOps scenarios.',
      icon: Code2,
    },
    {
      title: 'Grow the Community',
      description: 'Mentor, review, and help new learners get unblocked.',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)] md:p-12">
        <div className="absolute right-8 top-8 hidden h-36 w-36 rounded-full bg-gradient-to-br from-blue-200/60 via-cyan-200/40 to-transparent blur-2xl md:block" />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
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
            <div className="grid grid-cols-2 gap-4 pt-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                  <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-fade-up space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.55)]">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                <span>Terminal</span>
                <span>devopstic</span>
              </div>
              <pre className="mt-6 whitespace-pre-wrap text-sm leading-6 text-slate-100">
                <code className="font-mono">{`$ git clone https://github.com/devopstic/academy.git
$ cd academy
$ ls lessons/ projects/ interview-qa/

✓ Ready to build DevOps muscle.`}</code>
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-float rounded-2xl border border-slate-200 bg-white p-4">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Structured paths</p>
                <p className="mt-1 text-xs text-slate-500">Follow curated lesson sequences.</p>
              </div>
              <div className="animate-float rounded-2xl border border-slate-200 bg-white p-4">
                <Lightbulb className="h-6 w-6 text-emerald-600" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Real scenarios</p>
                <p className="mt-1 text-xs text-slate-500">Practice incident-style drills.</p>
              </div>
            </div>
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

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
            <Handshake className="h-5 w-5 text-blue-600" />
            Get involved
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">This platform is built together.</h2>
          <p className="mt-3 text-sm text-slate-600">
            Contribute tutorials, improve docs, or mentor others. Every contribution makes DevOps
            learning more approachable.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {involvementTracks.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <item.icon className="h-5 w-5 text-emerald-600" />
                <p className="mt-3 text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-8 text-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <Code2 className="h-4 w-4" />
            Getting Started
          </div>
          <p className="mt-4 text-sm text-slate-300">
            Clone the repo, explore the notes, and jump into the projects folder.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs leading-6 text-slate-100">
            <code className="font-mono">{`# Clone the repository
$ git clone https://github.com/devopstic/academy.git

# Navigate into the project
$ cd academy

# Explore content
$ ls lessons/ projects/ interview-qa/`}</code>
          </pre>
          <Link
            href="/interview-questions"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white"
          >
            Review Interview Q&A <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Connect with DevOpsTic</h2>
            <p className="mt-2 text-sm text-slate-600">
              Follow for updates, lesson drops, and community discussions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
            <Link href="/blog" className="rounded-full border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50">
              Project Updates
            </Link>
            <Link href="/topics" className="rounded-full border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50">
              Browse Topics
            </Link>
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-sm">
        <PublicAdSlot placement="homepage-top" title="Sponsored" compact />
      </div>
    </div>
  );
}
