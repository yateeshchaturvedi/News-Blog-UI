import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Retention Policy',
  description: 'Data retention and account deletion policy for DevOpsTic Academy.',
  alternates: { canonical: '/data-retention' },
};

export default function DataRetentionPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Data Retention Policy</h1>
      <p className="text-sm text-slate-600">Last updated: February 22, 2026</p>

      <h2 className="text-xl font-semibold text-slate-900">Retention Windows</h2>
      <ul className="list-disc space-y-1 pl-6 text-slate-700">
        <li>Account profile data: retained while account is active.</li>
        <li>Audit and security logs: retained up to 24 months for abuse/security investigations.</li>
        <li>Contact submissions: retained for support and moderation workflows.</li>
      </ul>

      <h2 className="text-xl font-semibold text-slate-900">Account Deletion Workflow</h2>
      <p className="text-slate-700">
        Users can delete their account from profile settings by confirming password and typing
        <code> DELETE </code>. Associated authored content and account data are removed as part of the
        backend deletion workflow.
      </p>
    </div>
  );
}
