'use client'

import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const isSupported =
        typeof window !== 'undefined' &&
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window;

    if (!isSupported) return null;

    const isGranted = Notification.permission === 'granted';

    useEffect(() => {
        let mounted = true;

        async function loadSubscriptionState() {
            try {
                const registration = await navigator.serviceWorker.getRegistration('/sw.js');
                if (!registration) {
                    if (mounted) setIsSubscribed(false);
                    return;
                }
                const existingSubscription = await registration.pushManager.getSubscription();
                if (mounted) setIsSubscribed(Boolean(existingSubscription));
            } catch {
                if (mounted) setIsSubscribed(false);
            }
        }

        loadSubscriptionState();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(() => setToast(null), 3000);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const enableNotifications = async () => {
        try {
            setBusy(true);
            setToast(null);

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                setToast({ text: 'Notification permission not granted.', type: 'error' });
                return;
            }

            const keyRes = await fetch(`${apiBaseUrl}/api/notifications/public-key`);
            if (!keyRes.ok) {
                const body = await keyRes.json().catch(() => ({}));
                throw new Error(body?.msg || body?.message || 'Notification service is not available.');
            }
            const { publicKey } = await keyRes.json();
            if (!publicKey) {
                throw new Error('Public key unavailable.');
            }

            await navigator.serviceWorker.register('/sw.js');
            const registration = await navigator.serviceWorker.ready;
            if (!registration.active) {
                throw new Error('Service worker is not active yet. Please retry in a moment.');
            }

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
                const body = await subscribeRes.json().catch(() => ({}));
                throw new Error(body?.msg || body?.message || 'Failed to subscribe.');
            }

            setIsSubscribed(true);
            setToast({ text: 'Notifications enabled.', type: 'success' });
        } catch (error) {
            setToast({
                text: error instanceof Error ? error.message : 'Failed to enable notifications.',
                type: 'error',
            });
        } finally {
            setBusy(false);
        }
    };

    const disableNotifications = async () => {
        try {
            setBusy(true);
            setToast(null);

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await fetch(`${apiBaseUrl}/api/notifications/unsubscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });
                await subscription.unsubscribe();
            }

            setIsSubscribed(false);
            setToast({ text: 'Notifications disabled.', type: 'success' });
        } catch (error) {
            setToast({
                text: error instanceof Error ? error.message : 'Failed to disable notifications.',
                type: 'error',
            });
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={isSubscribed ? disableNotifications : enableNotifications}
                disabled={busy}
                className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
                title={isSubscribed ? 'Disable notifications' : 'Enable notifications'}
            >
                <span className="inline-flex items-center gap-1">
                    <Bell className="h-3.5 w-3.5" />
                    {isSubscribed ? (busy ? 'Disabling...' : 'Disable Alerts') : busy ? 'Enabling...' : isGranted ? 'Connect Alerts' : 'Enable Alerts'}
                </span>
            </button>
            {toast ? (
                <div
                    className={`fixed right-4 top-20 z-[100] max-w-xs rounded-lg border px-3 py-2 text-xs shadow-lg ${
                        toast.type === 'success'
                            ? 'border-green-200 bg-green-50 text-green-800'
                            : 'border-red-200 bg-red-50 text-red-800'
                    }`}
                    role="status"
                    aria-live="polite"
                >
                    {toast.text}
                </div>
            ) : null}
        </div>
    );
}
