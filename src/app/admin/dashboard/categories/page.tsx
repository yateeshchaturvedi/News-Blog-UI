import { cookies } from 'next/headers';
import { getCategories } from '@/lib/api';
import { createCategoryByAdmin, deleteCategoryByAdmin, updateCategoryByAdmin } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { PlusCircle, FolderTree, LogOut } from 'lucide-react';

export default async function CategoriesPage() {
    const token = (await cookies()).get('token')?.value;
    const categories = await getCategories(token);

    return (
        <div className="flex flex-1 flex-col gap-10 p-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Curriculum Taxonomy</h1>
                    <p className="text-sm text-slate-500">Organize your learning modules into meaningful categories.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[400px_1fr]">
                <div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-primary" />
                            New Category
                        </h2>
                        <form
                            action={async (formData) => {
                                'use server';
                                await createCategoryByAdmin({ message: '' }, formData);
                            }}
                            className="mt-6 space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category Name</label>
                                <Input name="name" placeholder="e.g. Platform Engineering" required className="h-11 rounded-xl" />
                            </div>
                            <Button type="submit" className="w-full h-11 rounded-xl font-black shadow-lg shadow-primary/20">
                                Create Category
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Active Taxonomies</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {categories.map((category) => (
                            <div key={category.id} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary/50 dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <FolderTree className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {category.id}</span>
                                </div>
                                <form
                                    action={async (formData) => {
                                        'use server';
                                        await updateCategoryByAdmin(String(category.id), { message: '' }, formData);
                                    }}
                                    className="space-y-4"
                                >
                                    <Input name="name" defaultValue={category.name} required className="h-10 rounded-lg font-bold" />
                                    <div className="flex gap-2">
                                        <Button type="submit" variant="outline" className="h-9 flex-1 rounded-lg text-xs font-black uppercase tracking-wider">Update</Button>
                                        <Button formAction={deleteCategoryByAdmin.bind(null, String(category.id))} type="submit" variant="destructive" className="h-9 px-4 rounded-lg">
                                            <LogOut className="h-3 w-3 rotate-90" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-20 dark:border-slate-800">
                                <FolderTree className="h-12 w-12 text-slate-200" />
                                <p className="mt-4 text-sm font-bold text-slate-400">No categories found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
