import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token && request.nextUrl.pathname !== '/admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        if (token) {
            try {
                const [, payload] = token.split('.');
                if (!payload) {
                    throw new Error('Invalid token format');
                }
                const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
                const paddedPayload =
                    normalizedPayload + '='.repeat((4 - (normalizedPayload.length % 4)) % 4);
                const decodedPayload = atob(paddedPayload);
                JSON.parse(decodedPayload);
            } catch {
                if (request.nextUrl.pathname !== '/admin') {
                    return NextResponse.redirect(new URL('/admin', request.url));
                }
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
};
