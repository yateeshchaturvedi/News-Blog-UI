import { cookies } from 'next/headers';
import { getBlogs } from '@/lib/api';
import { createBlogByAdmin, deleteBlogByAdmin, updateBlogByAdmin } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/rich-text-editor';

export default async function BlogsPage() {
    const token = (await cookies()).get('token')?.value;
    const blogs = await getBlogs(token);

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <h1 className="text-3xl font-semibold text-slate-900">Blogs</h1>
                <p className="mt-2 text-sm text-slate-600">Publish long-form DevOps learning content.</p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white/90 p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Create Blog</h2>
                <form
                    action={async (formData) => {
                        'use server';
                        await createBlogByAdmin({ message: '' }, formData);
                    }}
                    className="space-y-3"
                >
                    <Input name="title" placeholder="Blog title" required />
                    <RichTextEditor
                        name="content"
                        defaultValue=""
                        placeholder="Write blog content..."
                        minHeightClassName="min-h-[180px]"
                    />
                    <Button type="submit">Create</Button>
                </form>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white/90 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Existing Blogs</h2>
                <div className="space-y-4">
                    {blogs.map((blog) => (
                        <form
                            key={blog.id}
                            action={async (formData) => {
                                'use server';
                                await updateBlogByAdmin(String(blog.id), { message: '' }, formData);
                            }}
                            className="space-y-2 rounded-lg border border-blue-50 p-4"
                        >
                            <Input name="title" defaultValue={blog.title} required />
                            <RichTextEditor
                                name="content"
                                defaultValue={blog.content || ''}
                                placeholder="Update blog content..."
                                minHeightClassName="min-h-[160px]"
                            />
                            <div className="flex gap-2">
                                <Button type="submit" variant="outline">Update</Button>
                                <Button formAction={deleteBlogByAdmin.bind(null, String(blog.id))} type="submit" variant="destructive">
                                    Delete
                                </Button>
                            </div>
                        </form>
                    ))}
                    {blogs.length === 0 && <p className="text-sm text-slate-500">No blogs available.</p>}
                </div>
            </div>
        </div>
    );
}
