'use client'

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewsArticle, Category } from '@/lib/types';
import { createArticle, updateArticle, FormState } from '@/app/actions';
import { getCategories } from '@/lib/api';

const initialState: FormState = {
    message: "",
};

function SubmitButton({ isUpdating }: { isUpdating: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? (isUpdating ? 'Updating...' : 'Creating...') : (isUpdating ? 'Update Article' : 'Create Article')}
        </Button>
    );
}

export default function NewsEditor({ article, authorName, token }: { article?: NewsArticle; authorName?: string, token?: string }) {
    const router = useRouter();
    const [isUpdating] = useState(!!article);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    const [formState, formAction] = useActionState(
        isUpdating ? updateArticle.bind(null, article!.id) : createArticle,
        initialState
    );

    useEffect(() => {
        async function fetchCategories() {
            if (!token) {
                setIsLoadingCategories(false);
                setCategoryError("Authentication token is missing.");
                return;
            }
            try {
                const fetchedCategories = await getCategories(token);
                console.log('Fetched categories:', fetchedCategories);
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setCategoryError(error instanceof Error ? error.message : "An unknown error occurred.");
            } finally {
                setIsLoadingCategories(false);
            }
        }

        fetchCategories();
    }, [token]);

    useEffect(() => {
        if (formState.success) {
            router.push('/admin/dashboard/news');
        }
    }, [formState, router]);

    const finalAuthorName = article?.author || authorName;

    return (
        <form action={formAction}>
            <input type="hidden" name="token" value={token || ''} />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={article?.title} required />
                                {formState.errors?.title && <p className="text-red-500 text-xs mt-1">{formState.errors.title[0]}</p>}
                            </div>
                             <div>
                                <Label htmlFor="category">Category</Label>
                                 <Select name="category" defaultValue={article?.category}>
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
                                <Textarea id="content" name="content" defaultValue={article?.content} required  className="min-h-[300px]"/>
                                {formState.errors?.content && <p className="text-red-500 text-xs mt-1">{formState.errors.content[0]}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publish</CardTitle>
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
                             <Input id="image" name="image" type="file" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
