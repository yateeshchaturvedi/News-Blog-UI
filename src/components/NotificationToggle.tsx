'use client'

import { Bell } from 'lucide-react';
import { useState } from 'react';

function base64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const safeBase64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(safeBase64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i += 1) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const apiBaseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === 'production'
        ? 'https://news-blog-api-mzxq.onrender.com'
        : 'http://localhost:3000')
).replace(/\/+$/, '');

export default function NotificationToggle() {
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');

    const isSupported =
        typeof window !== 'undefined' &&
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window;

    if (!isSupported) return null;

    const isGranted = Notification.permission === 'granted';

    const enableNotifications = async () => {
        try {
            setBusy(true);
            setMessage('');

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                setMessage('Notification permission not granted.');
                return;
            }

            const keyRes = await fetch(`${apiBaseUrl}/api/notifications/public-key`);
            if (!keyRes.ok) {
                throw new Error('Notification service is not available.');
            }
            const { publicKey } = await keyRes.json();
            if (!publicKey) {
                throw new Error('Public key unavailable.');
            }

            const registration = await navigator.serviceWorker.register('/sw.js');
            const existingSubscription = await registration.pushManager.getSubscription();
            const subscription =
                existingSubscription ||
                (await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: base64ToUint8Array(publicKey),
                }));

            const subscribeRes = await fetch(`${apiBaseUrl}/api/notifications/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription),
            });
            if (!subscribeRes.ok) {
                throw new Error('Failed to subscribe.');
            }

            setMessage('Notifications enabled.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Failed to enable notifications.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={enableNotifications}
                disabled={busy || isGranted}
                className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
                title={isGranted ? 'Notifications already enabled' : 'Enable notifications'}
            >
                <span className="inline-flex items-center gap-1">
                    <Bell className="h-3.5 w-3.5" />
                    {isGranted ? 'Alerts On' : busy ? 'Enabling...' : 'Enable Alerts'}
                </span>
            </button>
            {message ? (
                <p className="absolute right-0 mt-1 max-w-[220px] text-[11px] text-slate-600">{message}</p>
            ) : null}
        </div>
    );
}
