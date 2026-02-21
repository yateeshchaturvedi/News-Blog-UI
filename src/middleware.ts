import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAdminRoot = request.nextUrl.pathname === '/admin';

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token && !isAdminRoot) {
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
                const parsedPayload = JSON.parse(decodedPayload) as { exp?: number };
                const isExpired =
                    typeof parsedPayload.exp === 'number' &&
                    parsedPayload.exp <= Math.floor(Date.now() / 1000);

                if (isExpired) {
                    if (
                        isAdminRoot &&
                        request.nextUrl.searchParams.get('session') === 'expired'
                    ) {
                        const response = NextResponse.next();
                        response.cookies.delete('token');
                        return response;
                    }
                    const redirectUrl = new URL('/admin?session=expired', request.url);
                    const response = NextResponse.redirect(redirectUrl);
                    response.cookies.delete('token');
                    return response;
                }
            } catch {
                if (!isAdminRoot) {
                    const response = NextResponse.redirect(new URL('/admin', request.url));
                    response.cookies.delete('token');
                    return response;
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
