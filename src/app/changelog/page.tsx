import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { normalizeCanonicalPath } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Track product updates and platform improvements for DevOpsTic.',
  alternates: { canonical: normalizeCanonicalPath('/changelog') },
};

const entries = [
  {
    date: '2026-03-04',
    title: 'Admin operations and platform pages',
    items: [
      'Added admin contact inbox with review workflow.',
      'Added admin audit logs page and API integration.',
      'Added status and changelog public pages.',
      'Enhanced author and topic hub experiences.',
    ],
  },
  {
    date: '2026-02-22',
    title: 'Security and moderation baseline',
    items: [
      'Added CSRF protection and rich text sanitization.',
      'Added contact anti-spam controls and moderation fields.',
      'Added audit log capture for privileged actions.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Changelog' }]} />
      <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Changelog</h1>
        <p className="mt-2 text-slate-600">Release notes for UI, API, and platform operations.</p>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <section key={entry.date} className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{entry.date}</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{entry.title}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
