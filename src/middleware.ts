import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            if (request.nextUrl.pathname !== '/admin') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        } else {
            // Optionally, verify the token here
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
};