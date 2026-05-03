import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Devopstick.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
          <span className="font-mono text-3xl font-black text-white">D</span>
        </div>
        
        <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          About <span className="italic text-primary">Devopstick</span>
        </h1>
        
        <div className="prose prose-slate prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p className="mb-6 leading-relaxed">
            Welcome to Devopstick, the comprehensive learning platform designed for modern engineers. Our mission is to bridge the gap between theoretical knowledge and practical, production-ready skills in the rapidly evolving world of Cloud and DevOps.
          </p>
          <p className="mb-6 leading-relaxed">
            Whether you are just starting your journey or looking to master advanced concepts in Linux, Docker, Kubernetes, and Cloud Architecture, our expertly crafted lessons provide you with the insights and hands-on guidance you need to succeed.
          </p>
          <p className="mb-8 leading-relaxed">
            Beyond our curriculum, the Devopstick blog serves as a community hub for insights, tutorials, and thoughts from engineering professionals. We believe that learning is a continuous journey, and we're here to support you every step of the way.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-100 pt-8 dark:border-slate-800">
          <Link 
            href="/lessons" 
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Learning
          </Link>
          <Link 
            href="/blog" 
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Read Our Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
