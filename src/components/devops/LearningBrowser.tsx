"use client";

import NewsCard from "@/components/news-card";
import type { Category, NewsArticle } from "@/lib/types";
import SearchBar from "./SearchBar";
import TagChip from "./TagChip";
import { useMemo, useState } from "react";

export default function LearningBrowser({ lessons, categories }: { lessons: NewsArticle[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesCategory = category === "All" || lesson.category_name === category;
      const haystack = `${lesson.title} ${lesson.category_name || ""} ${lesson.summary || ""}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
  }, [category, lessons, query]);

  return (
    <section className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <SearchBar value={query} onChange={setQuery} placeholder="Search lessons" />
        <div className="flex flex-wrap gap-2">
          {["All", ...categories.map((topic) => topic.name)].map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)}>
              <TagChip active={category === item}>{item}</TagChip>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((lesson) => (
          <NewsCard key={lesson.id} article={lesson} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          No lessons found.
        </div>
      )}
    </section>
  );
}
