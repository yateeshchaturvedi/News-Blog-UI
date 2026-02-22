import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for DevOpsTic Academy.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Terms of Service</h1>
      <p className="text-sm text-slate-600">Last updated: February 22, 2026</p>
      <p className="text-slate-700">
        By using DevOpsTic Academy, you agree to use the service lawfully and not post malicious, abusive, or infringing content.
      </p>
      <h2 className="text-xl font-semibold text-slate-900">User Responsibilities</h2>
      <ul className="list-disc space-y-1 pl-6 text-slate-700">
        <li>Provide accurate account information.</li>
        <li>Keep credentials secure.</li>
        <li>Respect intellectual property and community standards.</li>
      </ul>
      <h2 className="text-xl font-semibold text-slate-900">Content Moderation</h2>
      <p className="text-slate-700">
        We may remove spam or policy-violating submissions and suspend abusive accounts.
      </p>
    </div>
  );
}
