import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import NewsEditor from '@/components/NewsEditor';

interface JwtPayload {
    name?: string;
    username?: string;
    sub?: string;
    email?: string;
    user?: {
        name?: string;
        username?: string;
    };
}

export default async function NewNewsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/admin');
    }

    let authorName = 'Admin';
    try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        authorName =
            decodedToken.name ||
            decodedToken.username ||
            decodedToken.user?.name ||
            decodedToken.user?.username ||
            decodedToken.sub ||
            decodedToken.email ||
            'Admin';
    } catch (error) {
        console.error("Failed to decode token:", error);
        // If token is invalid, redirect to login
        redirect('/admin');
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Create New Lesson</h1>
            <NewsEditor authorName={authorName} token={token} />
        </div>
    );
}
