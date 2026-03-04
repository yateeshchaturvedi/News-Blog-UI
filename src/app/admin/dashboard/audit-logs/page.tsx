import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuditLogs } from '@/lib/api';

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/admin');

  const resolved = await searchParams;
  const page = Math.max(1, Number.parseInt(resolved.page || '1', 10) || 1);
  const { items, pagination } = await getAuditLogs(page, 40, token);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Audit Logs</h1>
        <p className="mt-2 text-sm text-slate-600">Admin/editor actions tracked for compliance and traceability.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Request ID</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={5}>No logs found.</td>
                </tr>
              ) : (
                items.map((log) => (
                  <tr key={log.id} className="border-t border-slate-100 align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{log.action}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {log.entity_type}
                      {log.entity_id ? <span className="text-slate-500"> #{log.entity_id}</span> : null}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {log.actor_user_id ? `User #${log.actor_user_id}` : 'System'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.request_id || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Link
          href={`/admin/dashboard/audit-logs?page=${Math.max(1, pagination.page - 1)}`}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            pagination.hasPreviousPage ? 'border-blue-100 text-blue-700 hover:bg-blue-50' : 'pointer-events-none border-slate-200 text-slate-400'
          }`}
        >
          Previous
        </Link>
        <span className="text-sm text-slate-600">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <Link
          href={`/admin/dashboard/audit-logs?page=${pagination.page + 1}`}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            pagination.hasNextPage ? 'border-blue-100 text-blue-700 hover:bg-blue-50' : 'pointer-events-none border-slate-200 text-slate-400'
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
