import { getNewsArticle } from '@/lib/api';
import NewsEditor from '@/components/NewsEditor';

export default async function EditNewsPage({ params }: { params: { id: string } }) {
    const article = await getNewsArticle(parseInt(params.id));

    if (!article) {
        return <div>Article not found</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
            <NewsEditor article={article} />
        </div>
    );
}
