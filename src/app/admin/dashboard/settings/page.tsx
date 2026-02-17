'use client'

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { UserPlus, ShieldCheck, AlertCircle, PartyPopper } from 'lucide-react';
import { createEditorByAdmin, FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';

const initialState: FormState = { message: '' };

function CreateEditorButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            {pending ? 'Creating Editor...' : 'Create Editor'}
        </Button>
    );
}

export default function SettingsPage() {
    const [state, formAction] = useActionState(createEditorByAdmin, initialState);

    return (
        <div className="space-y-8">
            <div className="rounded-2xl border border-blue-100 bg-white/85 p-6 shadow-sm">
                <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
                <p className="mt-2 text-sm text-slate-600">Manage admin-level configuration and access controls.</p>
            </div>

            <Card className="border-blue-100 bg-white/90 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <ShieldCheck className="h-5 w-5 text-blue-700" />
                        Editor Access Management
                    </CardTitle>
                    <CardDescription>Create new editor accounts for content operations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        {state.message && (
                            <div className={`flex items-center gap-x-3 rounded-md p-3 text-sm ${
                                state.success
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {state.success ? <PartyPopper className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <p className="font-medium">{state.message}</p>
                            </div>
                        )}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="username">Editor Username</Label>
                                <Input id="username" name="username" placeholder="editor_username" required />
                                {state.errors?.username && <p className="text-xs text-red-500">{state.errors.username[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Temporary Password</Label>
                                <Input id="password" name="password" type="password" placeholder="At least 6 characters" required />
                                {state.errors?.password && <p className="text-xs text-red-500">{state.errors.password[0]}</p>}
                            </div>
                        </div>
                        <div className="pt-2">
                            <CreateEditorButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
