import LearningBrowser from "@/components/devops/LearningBrowser";
import PublicAdSlot from "@/components/PublicAdSlot";
import { getCategories, getNews } from "@/lib/api";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Layers3 } from "lucide-react";
import { buildLessonHref } from "@/lib/lesson-path";

export const metadata: Metadata = {
  title: "Learning Dashboard",
  description: "Browse lessons and categories returned by the Devopstick API.",
  alternates: { canonical: "/learning" },
};

export default async function LearningPage() {
  const [categories, allNews] = await Promise.all([getCategories(), getNews()]);
  const lessons = allNews.filter((item) => (item.status || "").toUpperCase() === "APPROVED");
  const categoryNamesWithLessons = new Set(lessons.map((item) => item.category_name).filter(Boolean));
  const visibleCategories = categories.filter((category) => categoryNamesWithLessons.has(category.name));
  const topCategoryCount = Math.max(
    1,
    ...visibleCategories.map((category) => lessons.filter((item) => item.category_name === category.name).length),
  );
  const latestLesson = lessons[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-8">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="p-6 md:p-8">
              <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Learning dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Search and filter the published lessons returned by the existing API.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  { label: "Published lessons", value: lessons.length },
                  { label: "Active categories", value: visibleCategories.length },
                  { label: "All categories", value: categories.length },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-2xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950 lg:border-l lg:border-t-0">
              {latestLesson ? (
                <Link href={buildLessonHref(latestLesson)} className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                  <BookOpen className="h-5 w-5 text-cyan-600" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Latest lesson</p>
                  <h2 className="mt-2 line-clamp-3 text-lg font-semibold text-slate-950 dark:text-white">{latestLesson.title}</h2>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{latestLesson.category_name || "General"}</p>
                </Link>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                  No lessons found.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Layers3 className="h-5 w-5 text-cyan-600" />
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Category distribution</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {visibleCategories.map((category) => {
              const count = lessons.filter((item) => item.category_name === category.name).length;
              return (
                <div key={category.id} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">{category.name}</p>
                    <p className="text-slate-500 dark:text-slate-400">{count}</p>
                  </div>
                  <div className="h-2 rounded-full bg-white dark:bg-slate-800">
                    <div className="h-full rounded-full bg-cyan-500" style={{ width: `${Math.max(8, (count / topCategoryCount) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {visibleCategories.length === 0 && <p className="mt-4 text-sm text-slate-500">No categories with published lessons found.</p>}
        </section>

        <LearningBrowser lessons={lessons} categories={visibleCategories} />
      </div>
      <aside className="space-y-5">
        <nav className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Categories</h2>
          <div className="mt-4 grid gap-2">
            <Link href="/learning" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              All lessons
            </Link>
            {visibleCategories.map((category) => (
              <Link key={category.id} href={`/topics/${category.name.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
        <PublicAdSlot placement="news-sidebar" title="Sponsored" compact />
      </aside>
    </div>
  );
}
