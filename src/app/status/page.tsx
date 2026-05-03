import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { normalizeCanonicalPath } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'System Status',
  description: 'Live service health and readiness status for Devopstick.',
  alternates: { canonical: normalizeCanonicalPath('/status') },
};

type StatusResult = {
  ok: boolean;
  status: number;
  payload?: Record<string, unknown>;
};

async function checkEndpoint(url: string): Promise<StatusResult> {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));
    return {
      ok: response.ok,
      status: response.status,
      payload: payload as Record<string, unknown>,
    };
  } catch {
    return { ok: false, status: 0 };
  }
}

export default async function StatusPage() {
  const apiBase = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    'https://news-blog-api-mzxq.onrender.com'
  ).replace(/\/+$/, '');

  const [health, ready] = await Promise.all([
    checkEndpoint(`${apiBase}/health`),
    checkEndpoint(`${apiBase}/ready`),
  ]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Status' }]} />
      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">System Status</h1>
        <p className="mt-2 text-slate-600">Service health checks from the production API.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Liveness</p>
          <p className={`mt-2 text-xl font-semibold ${health.ok ? 'text-emerald-700' : 'text-red-700'}`}>
            {health.ok ? 'Healthy' : 'Down'}
          </p>
          <p className="mt-2 text-sm text-slate-600">HTTP {health.status || 'N/A'} from `/health`</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Readiness</p>
          <p className={`mt-2 text-xl font-semibold ${ready.ok ? 'text-emerald-700' : 'text-red-700'}`}>
            {ready.ok ? 'Ready' : 'Not Ready'}
          </p>
          <p className="mt-2 text-sm text-slate-600">HTTP {ready.status || 'N/A'} from `/ready`</p>
        </div>
      </div>
    </div>
  );
}
