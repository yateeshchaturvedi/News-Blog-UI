'use client';

import { useEffect } from 'react';
import { createRequestId, logEvent } from '@/lib/observability';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const requestId = createRequestId();
    logEvent('error', 'ui.global_error', {
      requestId,
      digest: error.digest || '',
      message: error.message,
    });
  }, [error]);

  return (
    <html>
      <body className="mx-auto flex min-h-screen w-full max-w-[1240px] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-600">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-5 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
