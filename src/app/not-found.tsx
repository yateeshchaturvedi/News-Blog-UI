import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
      <div className="w-full rounded-3xl border border-blue-100 bg-white/90 p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">404</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Page Not Found</h1>
        <p className="mt-3 text-slate-600">
          The page you requested does not exist or was moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go Home
          </Link>
          <Link
            href="/lessons"
            className="rounded-full border border-blue-100 px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            Browse Lessons
          </Link>
        </div>
      </div>
    </div>
  );
}
