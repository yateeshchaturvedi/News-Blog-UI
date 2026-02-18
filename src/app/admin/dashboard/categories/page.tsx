import { cookies } from 'next/headers';
import { getCategories } from '@/lib/api';
import { createCategoryByAdmin, deleteCategoryByAdmin, updateCategoryByAdmin } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

export default async function CategoriesPage() {
    const token = (await cookies()).get('token')?.value;
    const categories = await getCategories(token);

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <h1 className="text-3xl font-semibold text-slate-900">Categories</h1>
                <p className="mt-2 text-sm text-slate-600">Create and manage lesson categories.</p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white/90 p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Add Category</h2>
                <form
                    action={async (formData) => {
                        'use server';
                        await createCategoryByAdmin({ message: '' }, formData);
                    }}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                    <Input name="name" placeholder="e.g. Platform Engineering" required />
                    <Button type="submit">Create</Button>
                </form>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white/90 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Existing Categories</h2>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category.id} className="flex flex-col gap-2 rounded-lg border border-blue-50 p-3 sm:flex-row sm:items-center">
                            <form
                                action={async (formData) => {
                                    'use server';
                                    await updateCategoryByAdmin(String(category.id), { message: '' }, formData);
                                }}
                                className="flex flex-1 gap-2"
                            >
                                <Input name="name" defaultValue={category.name} required />
                                <Button type="submit" variant="outline">Update</Button>
                            </form>
                            <form action={deleteCategoryByAdmin.bind(null, String(category.id))}>
                                <Button type="submit" variant="destructive">Delete</Button>
                            </form>
                        </div>
                    ))}
                    {categories.length === 0 && <p className="text-sm text-slate-500">No categories available.</p>}
                </div>
            </div>
        </div>
    );
}
