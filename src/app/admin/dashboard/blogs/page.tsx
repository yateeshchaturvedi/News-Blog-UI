import { cookies } from 'next/headers';
import { getBlogs } from '@/lib/api';
import { createBlogByAdmin, deleteBlogByAdmin, updateBlogByAdmin } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { PlusCircle, BookOpenText } from 'lucide-react';

export default async function BlogsPage() {
    const token = (await cookies()).get('token')?.value;
    const blogs = await getBlogs(token);

    return (
        <div className="flex flex-1 flex-col gap-10 p-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Blog Management</h1>
                    <p className="text-sm text-slate-500">Publish deep-dives and engineering stories to the Devopstick community.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[400px_1fr]">
                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-primary" />
                            Create New Entry
                        </h2>
                        <form
                            action={async (formData) => {
                                'use server';
                                await createBlogByAdmin({ message: '' }, formData);
                            }}
                            className="mt-6 space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Blog Title</label>
                                <Input name="title" placeholder="e.g. Master Kubernetes Networking" required className="h-11 rounded-xl" />
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Publishing Status</label>
                                <select
                                    name="status"
                                    defaultValue="APPROVED"
                                    className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                                >
                                    <option value="APPROVED">Live (Approved)</option>
                                    <option value="PENDING">Draft (Pending)</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Content Body</label>
                                <RichTextEditor
                                    name="content"
                                    defaultValue=""
                                    placeholder="Write your engineering story..."
                                    minHeightClassName="min-h-[250px]"
                                />
                            </div>

                            <Button type="submit" className="w-full h-11 rounded-xl font-black shadow-lg shadow-primary/20">
                                Create Post
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Existing Publications</h2>
                    <div className="grid gap-6">
                        {blogs.map((blog) => (
                            <form
                                key={blog.id}
                                action={async (formData) => {
                                    'use server';
                                    await updateBlogByAdmin(String(blog.id), { message: '' }, formData);
                                }}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary/50 dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Edit Title</label>
                                            <Input name="title" defaultValue={blog.title} required className="h-10 rounded-lg font-bold" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Update Status</label>
                                            <select
                                                name="status"
                                                defaultValue={blog.status || 'PENDING'}
                                                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                                            >
                                                <option value="APPROVED">APPROVED</option>
                                                <option value="PENDING">PENDING</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Body</label>
                                        <RichTextEditor
                                            name="content"
                                            defaultValue={blog.content || ''}
                                            placeholder="Update content..."
                                            minHeightClassName="min-h-[140px]"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <Button type="submit" variant="outline" className="h-9 rounded-lg text-xs font-black uppercase tracking-wider">Update Post</Button>
                                    <Button formAction={deleteBlogByAdmin.bind(null, String(blog.id))} type="submit" variant="destructive" className="h-9 rounded-lg text-xs font-black uppercase tracking-wider">
                                        Delete
                                    </Button>
                                </div>
                            </form>
                        ))}
                        {blogs.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-20 dark:border-slate-800">
                                <BookOpenText className="h-12 w-12 text-slate-200" />
                                <p className="mt-4 text-sm font-bold text-slate-400">No blog posts found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
