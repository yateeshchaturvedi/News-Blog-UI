import { cookies } from 'next/headers';
import { getAdvertisements } from '@/lib/api';
import { createAdvertisementByAdmin, deleteAdvertisementByAdmin, updateAdvertisementByAdmin } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Megaphone, Trash2, Settings } from 'lucide-react';

export default async function AdvertisementsPage() {
    const token = (await cookies()).get('token')?.value;
    const advertisements = await getAdvertisements(token);

    return (
        <div className="flex flex-1 flex-col gap-10 p-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Ad Engine</h1>
                    <p className="text-sm text-slate-500">Manage global placements and monetization strategies.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[400px_1fr]">
                <div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-primary" />
                            New Placement
                        </h2>
                        <form
                            action={async (formData) => {
                                'use server';
                                await createAdvertisementByAdmin({ message: '' }, formData);
                            }}
                            className="mt-6 space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Campaign Name</label>
                                <Input name="title" placeholder="e.g. AWS Certification Sale" required className="h-11 rounded-xl" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Target Placement</label>
                                <Input name="placement" placeholder="global-sidebar-1" defaultValue="global-sidebar-1" required className="h-11 rounded-xl font-mono text-xs" />
                                <p className="text-[10px] text-slate-500">Use <code className="text-primary font-bold">global-sidebar-1</code> or <code className="text-primary font-bold">global-sidebar-2</code></p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Media URL</label>
                                <Input name="imageUrl" placeholder="Image or Video URL" className="h-11 rounded-xl" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Destination Link</label>
                                <Input name="linkUrl" placeholder="https://..." className="h-11 rounded-xl" />
                            </div>

                            <label className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                                <input type="checkbox" name="isActive" defaultChecked className="h-5 w-5 rounded-lg border-slate-300 text-primary focus:ring-primary" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Set as Active</span>
                            </label>

                            <Button type="submit" className="w-full h-11 rounded-xl font-black shadow-lg shadow-primary/20">
                                Launch Campaign
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Active & Scheduled Ads</h2>
                    <div className="grid gap-6">
                        {advertisements.map((ad) => (
                            <form
                                key={ad.id}
                                action={async (formData) => {
                                    'use server';
                                    await updateAdvertisementByAdmin(String(ad.id), { message: '' }, formData);
                                }}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary/50 dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ad Title</label>
                                            <Input name="title" defaultValue={ad.title} required className="h-10 rounded-lg font-bold" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slot</label>
                                            <Input name="placement" defaultValue={ad.placement || 'global-sidebar-1'} required className="h-10 rounded-lg font-mono text-xs" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media</label>
                                            <Input name="imageUrl" defaultValue={ad.imageUrl || ''} placeholder="Media URL" className="h-10 rounded-lg text-xs" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target</label>
                                            <Input name="linkUrl" defaultValue={ad.linkUrl || ''} placeholder="https://..." className="h-10 rounded-lg text-xs" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" name="isActive" defaultChecked={ad.isActive ?? true} className="h-4 w-4 rounded text-primary focus:ring-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Status: {ad.isActive ? 'Active' : 'Paused'}</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <Button type="submit" variant="outline" className="h-9 rounded-lg text-xs font-black uppercase tracking-wider">Save Changes</Button>
                                        <Button formAction={deleteAdvertisementByAdmin.bind(null, String(ad.id))} type="submit" variant="destructive" className="h-9 rounded-lg text-xs font-black uppercase tracking-wider">
                                            Kill
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        ))}
                        {advertisements.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-20 dark:border-slate-800">
                                <Megaphone className="h-12 w-12 text-slate-200" />
                                <p className="mt-4 text-sm font-bold text-slate-400">No ad campaigns found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
