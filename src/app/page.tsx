import NewsCard from "@/components/news-card";
import BlogCard from "@/components/blog-card";
import PublicAdSlot from "@/components/PublicAdSlot";
import { getEnrichedNews } from "./news/utils";
import { getBlogs } from "@/lib/api";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Newspaper, Zap, Globe, Shield, Layers, Play } from "lucide-react";
import { buildLessonHref } from "@/lib/lesson-path";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Master the Art of DevOps",
  description: "Browse the latest practical DevOps lessons and published blogs.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [latestNews, blogs] = await Promise.all([getEnrichedNews(), getBlogs()]);
  const approvedBlogs = [...blogs].filter((blog) => (blog.status || "").toUpperCase() === "APPROVED");
  const publishedBlogs = approvedBlogs.length > 0 ? approvedBlogs : blogs;

  const sortedBlogs = [...publishedBlogs].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });

  const finalBlogs = sortedBlogs;

  const topicMap = new Map<string, number>();
  latestNews.forEach((article) => {
    const label = article.category_name || "General";
    topicMap.set(label, (topicMap.get(label) || 0) + 1);
  });
  const topics = Array.from(topicMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
  const topTopicCount = Math.max(1, ...topics.map((topic) => topic.count));
  const featuredLesson = latestNews[0];
  const featuredBlog = finalBlogs[0];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white pt-16 pb-24 dark:bg-slate-900 lg:pt-32 lg:pb-40 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,rgba(37,99,235,0.1),transparent)] opacity-20 dark:opacity-5" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold leading-6 text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                New: Kubernetes Mastery Course is Out!
              </div>
              <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl text-slate-950 dark:text-white">
                Master the Art of <span className="text-primary italic">DevOps</span>
              </h1>
              <p className="mb-10 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                The comprehensive learning platform for modern engineers. Master Linux, Docker, Kubernetes, and Cloud through production-ready curriculum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/lessons"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Start Learning Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Explore Blogs <Play className="h-4 w-4 fill-current" />
                </Link>
              </div>
              
              {/* <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800"
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User avatar"
                    />
                  ))}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span className="text-primary font-bold">10,000+</span> engineers already joined
                </div>
              </div> */}
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&q=80"
                  alt="Code Editor"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-xl border border-white/20">
                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Zap size={24} />
                     </div>
                     <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-white/60">Live Environment</div>
                        <div className="text-sm font-bold text-white">Interactive Sandbox Terminal</div>
                     </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-slate-900/10 blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black tracking-tight lg:text-4xl text-slate-950 dark:text-white">Why Learn with <span className="text-primary italic">Devopstick</span>?</h2>
            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">Expertise-driven curriculum designed to take you from a curious beginner to a professional cloud architect.</p>
         </div>
         <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Industry Experts', desc: 'Curriculum built by DevOps professionals and Tech leads.', icon: Globe },
              { title: 'Modular Learning', desc: 'Bite-sized modules that fit into your busy schedule.', icon: Layers },
              { title: 'Secure Mindset', desc: 'Security integrated into every step of the learning path.', icon: Shield },
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Topics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-end justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 className="mb-4 text-3xl font-black tracking-tight lg:text-4xl underline decoration-primary decoration-4 underline-offset-8 text-slate-950 dark:text-white">Learning Paths</h2>
            <p className="text-slate-600 dark:text-slate-400">Dive deep into the core tools of modern DevOps.</p>
          </div>
          <Link href="/topics" className="group flex items-center gap-2 font-bold text-primary">
            View All Topics <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        {topics.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {topics.slice(0, 4).map((topic) => (
              <div key={topic.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 mb-4">
                  <Layers size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">{topic.label}</h3>
                <p className="mt-2 text-sm text-slate-500">{topic.count} Lessons</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            No topics available.
          </div>
        )}
      </section>

      {/* Latest Lessons */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight lg:text-4xl text-slate-950 dark:text-white">Latest <span className="text-primary italic">Lessons</span></h2>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">Freshly published content from our engineering team.</p>
        </div>
        
        {latestNews.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.slice(0, 6).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            No lessons published yet.
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link
            href="/lessons"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            Explore All Lessons
          </Link>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="bg-slate-50 py-24 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-black tracking-tight lg:text-4xl text-slate-950 dark:text-white">Latest from <span className="text-primary italic">Our Blog</span></h2>
            <p className="text-slate-600 dark:text-slate-400">Insights, tutorials, and thoughts on the evolving world of cloud computing.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {finalBlogs.length > 0 ? (
              finalBlogs.slice(0, 3).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500">
                No blog posts found in the API.
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
             <Link
              href="/blog"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
             >
                Read All Articles
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
