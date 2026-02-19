'use client'

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { NewsArticle, Category } from '@/lib/types';
import { createArticle, updateArticle, FormState } from '@/app/actions';

const initialState: FormState = {
    message: "",
};

function SubmitButton({ isUpdating }: { isUpdating: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? (isUpdating ? 'Updating...' : 'Creating...') : (isUpdating ? 'Update Lesson' : 'Create Lesson')}
        </Button>
    );
}

export default function NewsEditor({
    article,
    authorName,
    initialCategories = [],
}: {
    article?: NewsArticle;
    authorName?: string;
    initialCategories?: Category[];
}) {
    const router = useRouter();
    const [isUpdating] = useState(!!article);
    const [categories] = useState<Category[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState(
        article?.category
            ? String(article.category)
            : initialCategories.length > 0
                ? String(initialCategories[0].id)
                : ''
    );
    const [isLoadingCategories] = useState(false);
    const [categoryError] = useState<string | null>(null);

    const [formState, formAction] = useActionState(
        isUpdating ? updateArticle.bind(null, String(article!.id)) : createArticle,
        initialState
    );

    useEffect(() => {
        if (formState.success) {
            router.push('/admin/dashboard/news');
        }
    }, [formState, router]);

    const finalAuthorName = article?.author || authorName || 'Admin';

    return (
        <form action={formAction}>
            <input type="hidden" name="category" value={selectedCategory} />
            <input type="hidden" name="status" value={article?.status || 'PENDING'} />
            <input type="hidden" name="currentImagePath" value={article?.imageUrl || ''} />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lesson Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={article?.title} required />
                                {formState.errors?.title && <p className="text-red-500 text-xs mt-1">{formState.errors.title[0]}</p>}
                            </div>
                             <div>
                                <Label htmlFor="category">Category</Label>
                                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                     <SelectTrigger>
                                         <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                                     </SelectTrigger>
                                     <SelectContent>
                                         {!isLoadingCategories && !categoryError && categories.map(category => (
                                             <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                                         ))}
                                     </SelectContent>
                                 </Select>
                                 {categoryError && <p className="text-red-500 text-xs mt-1">{`Failed to load categories: ${categoryError}`}</p>}
                            </div>
                            <div>
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" name="author" defaultValue={finalAuthorName} readOnly />
                            </div>
                            <div>
                                <Label htmlFor="content">Content</Label>
                                <RichTextEditor
                                    name="content"
                                    defaultValue={article?.content || ''}
                                    placeholder="Write lesson content..."
                                    minHeightClassName="min-h-[300px]"
                                />
                                {formState.errors?.content && <p className="text-red-500 text-xs mt-1">{formState.errors.content[0]}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publish Lesson</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SubmitButton isUpdating={isUpdating} />
                             {formState.message && !formState.success && <p className="text-red-500 text-sm mt-4">{formState.message}</p>}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
                             <p className="mt-2 text-xs text-slate-500">
                                Uploaded files are stored in <code>public/news-images</code> and saved as image path.
                             </p>
                             {article?.imageUrl && (
                                <p className="mt-2 text-xs text-slate-600">
                                    Current image: <code>{article.imageUrl}</code>
                                </p>
                             )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
