import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMyProfile } from '@/lib/api';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        redirect('/admin');
    }

    const profile = await getMyProfile(token);

    return (
        <div className="flex flex-1 flex-col gap-10 p-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
                    <p className="text-sm text-slate-500">Manage your identity and preferences on the Devopstick platform.</p>
                </div>
            </div>
            <ProfileForm profile={profile} />
        </div>
    );
}
