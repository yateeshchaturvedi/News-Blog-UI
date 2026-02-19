'use client'

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertCircle, PartyPopper, Save, UserRound } from 'lucide-react';
import { updateProfileByUser, FormState } from '@/app/actions';
import { UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';

const initialState: FormState = { message: '' };

function SaveProfileButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {pending ? 'Saving Profile...' : 'Save Profile'}
        </Button>
    );
}

export default function ProfileForm({ profile }: { profile: UserProfile }) {
    const [state, formAction] = useActionState(updateProfileByUser, initialState);

    return (
        <Card className="border-blue-100 bg-white/90 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <UserRound className="h-5 w-5 text-blue-700" />
                    Profile Details
                </CardTitle>
                <CardDescription>Keep your account details up to date.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    {state.message && (
                        <div
                            className={`flex items-center gap-x-3 rounded-md p-3 text-sm ${
                                state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {state.success ? <PartyPopper className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <p className="font-medium">{state.message}</p>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue={profile.username} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" defaultValue={profile.roleName || ''} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" defaultValue={profile.fullName} required />
                            {state.errors?.fullName && <p className="text-xs text-red-500">{state.errors.fullName[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={profile.email} required />
                            {state.errors?.email && <p className="text-xs text-red-500">{state.errors.email[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" defaultValue={profile.phone} required />
                            {state.errors?.phone && <p className="text-xs text-red-500">{state.errors.phone[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatarUrl">Avatar URL</Label>
                            <Input id="avatarUrl" name="avatarUrl" defaultValue={profile.avatarUrl || ''} />
                            {state.errors?.avatarUrl && <p className="text-xs text-red-500">{state.errors.avatarUrl[0]}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            name="bio"
                            defaultValue={profile.bio || ''}
                            rows={4}
                            className="block w-full rounded-md border border-slate-300 bg-white px-3.5 py-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        />
                        {state.errors?.bio && <p className="text-xs text-red-500">{state.errors.bio[0]}</p>}
                    </div>

                    <div className="pt-2">
                        <SaveProfileButton />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
