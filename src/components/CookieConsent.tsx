'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const consentKey = 'cookie_consent_v1';

const euRegions = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'UK',
]);

function getRegionCode() {
  if (typeof navigator === 'undefined') return '';
  const parts = (navigator.language || '').split('-');
  return parts.length > 1 ? parts[1].toUpperCase() : '';
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const region = useMemo(() => getRegionCode(), []);

  useEffect(() => {
    const existingConsent = localStorage.getItem(consentKey);
    if (existingConsent) return;
    if (!region || !euRegions.has(region)) return;
    setVisible(true);
  }, [region]);

  const saveConsent = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(consentKey, value);
    document.cookie = `${consentKey}=${value}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[120] w-[94%] max-w-2xl -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
      <p className="text-sm text-slate-700">
        We use cookies to provide core functionality and improve your experience.
        Please review our <Link href="/privacy" className="text-blue-700 underline">Privacy Policy</Link> and{' '}
        <Link href="/terms" className="text-blue-700 underline">Terms</Link>.
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => saveConsent('rejected')}
          className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Reject Non-Essential
        </button>
        <button
          type="button"
          onClick={() => saveConsent('accepted')}
          className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
