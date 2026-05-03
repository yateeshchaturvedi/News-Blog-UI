"use client";

import BlogCard from "@/components/blog-card";
import type { Blog } from "@/lib/types";
import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import TagChip from "./TagChip";

function stripHtml(content: string): string {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function BlogExplorer({ blogs }: { blogs: Blog[] }) {
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("All");
  const authors = useMemo(
    () => Array.from(new Set(blogs.map((blog) => blog.authorName).filter((name): name is string => Boolean(name)))),
    [blogs],
  );

  const filtered = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesAuthor = author === "All" || blog.authorName === author;
      const haystack = `${blog.title} ${blog.authorName || ""} ${stripHtml(blog.content || "")}`.toLowerCase();
      return matchesAuthor && haystack.includes(query.toLowerCase());
    });
  }, [author, blogs, query]);

  return (
    <section className="space-y-6">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <SearchBar value={query} onChange={setQuery} placeholder="Search current blog page" />
        {authors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {["All", ...authors].map((item) => (
              <button key={item} type="button" onClick={() => setAuthor(item)}>
                <TagChip active={author === item}>{item}</TagChip>
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white py-14 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p>No blogs were found.</p>
        </div>
      )}
    </section>
  );
}
