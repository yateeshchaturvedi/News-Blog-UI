'use client';

import Link from 'next/link';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
      <div className="w-full rounded-3xl border border-red-100 bg-white/90 p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-600">500</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Something Went Wrong</h1>
        <p className="mt-3 text-slate-600">
          An unexpected error occurred while rendering this page.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            type="button"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border border-blue-100 px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
