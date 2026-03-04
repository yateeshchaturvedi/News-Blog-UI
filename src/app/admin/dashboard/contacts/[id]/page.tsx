import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getContactMessageById } from '@/lib/api';
import { updateContactStatusByAdmin } from '@/app/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContactMessageDetailPage({ params }: Props) {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/admin');

  const { id } = await params;
  const message = await getContactMessageById(id, token);
  if (!message) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 text-slate-600 shadow-sm">
        Contact message not found.
      </div>
    );
  }

  const updateAction = updateContactStatusByAdmin.bind(null, message.id);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Message from {message.name}</h1>
            <p className="mt-1 text-sm text-slate-600">{message.email}</p>
          </div>
          <Link
            href="/admin/dashboard/contacts"
            className="rounded-full border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            Back to list
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Message</h2>
          <p className="whitespace-pre-wrap leading-7 text-slate-700">{message.message}</p>
          {message.moderation_reason ? (
            <p className="mt-4 text-sm text-amber-700">Moderation reason: {message.moderation_reason}</p>
          ) : null}
        </div>

        <div className="space-y-4 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Review</h2>
          <form action={updateAction} className="space-y-4">
            <div>
              <label htmlFor="status" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={message.status}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-300"
              >
                <option value="NEW">NEW</option>
                <option value="REVIEWED">REVIEWED</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
            <div>
              <label htmlFor="reviewNotes" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Review Notes
              </label>
              <textarea
                id="reviewNotes"
                name="reviewNotes"
                defaultValue={message.review_notes || ''}
                rows={5}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-300"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Save Review
            </button>
          </form>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p>Submitted: {message.created_at ? new Date(message.created_at).toLocaleString() : 'N/A'}</p>
            <p>IP: {message.ip_address || 'N/A'}</p>
            <p>Reviewed at: {message.reviewed_at ? new Date(message.reviewed_at).toLocaleString() : 'Not reviewed'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
