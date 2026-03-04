import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getContactMessages } from '@/lib/api';
import { ContactMessage } from '@/lib/types';

export default async function AdminContactsPage() {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    redirect('/admin');
  }

  let messages: ContactMessage[] = [];
  try {
    messages = await getContactMessages(token);
  } catch {
    messages = [];
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Contact Messages</h1>
        <p className="mt-2 text-sm text-slate-600">
          Messages submitted from the public contact form.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Spam</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={5}>
                    No contact messages yet.
                  </td>
                </tr>
              ) : (
                messages.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-slate-700">{item.email}</td>
                    <td className="max-w-[520px] px-4 py-3 text-slate-700">
                      <p className="whitespace-pre-wrap break-words">{item.message}</p>
                      {item.moderation_reason ? (
                        <p className="mt-1 text-xs text-amber-700">
                          Reason: {item.moderation_reason}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          item.is_spam
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.is_spam ? 'Flagged' : 'Clean'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
