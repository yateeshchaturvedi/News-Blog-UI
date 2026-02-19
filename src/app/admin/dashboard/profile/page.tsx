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
        <div className="space-y-8">
            <div className="rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <h1 className="text-3xl font-semibold text-slate-900">My Profile</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Manage your account details used across admin and editor workflows.
                </p>
            </div>
            <ProfileForm profile={profile} />
        </div>
    );
}
