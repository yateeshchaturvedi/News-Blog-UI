import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for DevOpsTic Academy.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Privacy Policy</h1>
      <p className="text-sm text-slate-600">Last updated: February 22, 2026</p>
      <p className="text-slate-700">
        We collect only the information required to provide account access, publish content, and respond to contact requests.
      </p>
      <h2 className="text-xl font-semibold text-slate-900">Data We Collect</h2>
      <ul className="list-disc space-y-1 pl-6 text-slate-700">
        <li>Account details: username, email, profile information.</li>
        <li>Content you submit: lessons, blogs, contact messages.</li>
        <li>Operational metadata: IP, user-agent, audit logs for security and abuse prevention.</li>
      </ul>
      <h2 className="text-xl font-semibold text-slate-900">Use of Data</h2>
      <p className="text-slate-700">
        Data is used for authentication, content delivery, moderation, and platform security.
      </p>
      <h2 className="text-xl font-semibold text-slate-900">Your Rights</h2>
      <p className="text-slate-700">
        You can request account deletion from your profile page. See our Data Retention Policy for details.
      </p>
    </div>
  );
}
