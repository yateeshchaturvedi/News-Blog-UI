import { getNewsArticle } from '@/lib/api';
import NewsEditor from '@/components/NewsEditor';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { use } from 'react';

export default function EditNewsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);

    return <EditNewsPageContent id={params.id} />;
}

async function EditNewsPageContent({ id }: { id: string }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) redirect('/admin');

    const article = await getNewsArticle(id);

    if (!article) {
        return <div>Lesson not found</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Lesson</h1>
            <NewsEditor article={article} token={token} />
        </div>
    );
}
