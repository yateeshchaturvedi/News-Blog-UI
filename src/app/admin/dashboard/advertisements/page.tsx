import { cookies } from 'next/headers';
import { getAdvertisements } from '@/lib/api';
import { createAdvertisementByAdmin, deleteAdvertisementByAdmin, updateAdvertisementByAdmin } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

export default async function AdvertisementsPage() {
    const token = (await cookies()).get('token')?.value;
    const advertisements = await getAdvertisements(token);

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <h1 className="text-3xl font-semibold text-slate-900">Advertisements</h1>
                <p className="mt-2 text-sm text-slate-600">Manage ad slots for banners and sponsor blocks.</p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white/90 p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Create Advertisement</h2>
                <form
                    action={async (formData) => {
                        'use server';
                        await createAdvertisementByAdmin({ message: '' }, formData);
                    }}
                    className="grid gap-3 md:grid-cols-2"
                >
                    <Input name="title" placeholder="Ad title" required />
                    <Input name="placement" placeholder="homepage-top" defaultValue="homepage-top" required />
                    <Input name="imageUrl" placeholder="Media URL (image, .mp4, YouTube URL)" />
                    <Input name="linkUrl" placeholder="Click-through URL (optional)" />
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" name="isActive" defaultChecked />
                        Active
                    </label>
                    <div>
                        <Button type="submit">Create</Button>
                    </div>
                </form>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white/90 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Existing Advertisements</h2>
                <div className="space-y-3">
                    {advertisements.map((ad) => (
                        <form
                            key={ad.id}
                            action={async (formData) => {
                                'use server';
                                await updateAdvertisementByAdmin(String(ad.id), { message: '' }, formData);
                            }}
                            className="grid gap-2 rounded-lg border border-blue-50 p-4 md:grid-cols-2"
                        >
                            <Input name="title" defaultValue={ad.title} required />
                            <Input name="placement" defaultValue={ad.placement || 'homepage-top'} required />
                            <Input name="imageUrl" defaultValue={ad.imageUrl || ''} placeholder="Media URL (image, .mp4, YouTube URL)" />
                            <Input name="linkUrl" defaultValue={ad.linkUrl || ''} placeholder="Click-through URL (optional)" />
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input type="checkbox" name="isActive" defaultChecked={ad.isActive ?? true} />
                                Active
                            </label>
                            <div className="flex gap-2">
                                <Button type="submit" variant="outline">Update</Button>
                                <Button formAction={deleteAdvertisementByAdmin.bind(null, String(ad.id))} type="submit" variant="destructive">
                                    Delete
                                </Button>
                            </div>
                        </form>
                    ))}
                    {advertisements.length === 0 && (
                        <p className="text-sm text-slate-500">
                            No advertisements found. If your backend uses a different endpoint, update `src/lib/api.ts`.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
