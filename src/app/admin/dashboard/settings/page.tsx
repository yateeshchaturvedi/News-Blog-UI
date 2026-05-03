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
        <div className="flex flex-1 flex-col gap-10 p-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Platform Settings</h1>
                    <p className="text-sm text-slate-500">Manage administrative configurations and operational access.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[400px_1fr]">
                 <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Access Control
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Editors can create and update content, but cannot delete or approve items without administrative override.
                        </p>
                    </div>
                 </div>

                 <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Onboard New Editor</h2>
                    <p className="mt-1 text-sm text-slate-500">Provide credentials for a new content team member.</p>
                    
                    <form action={formAction} className="mt-8 space-y-6">
                        {state.message && (
                            <div className={`flex items-center gap-x-3 rounded-xl p-4 text-sm font-bold ${
                                state.success
                                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                                {state.success ? <PartyPopper className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                <p>{state.message}</p>
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</Label>
                                <Input id="username" name="username" placeholder="editor_devopstick" required className="h-11 rounded-xl" />
                                {state.errors?.username && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{state.errors.username[0]}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Temporary Password</Label>
                                <Input id="password" name="password" type="password" placeholder="••••••••" required className="h-11 rounded-xl" />
                                {state.errors?.password && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{state.errors.password[0]}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                <Input id="fullName" name="fullName" placeholder="John Doe" required className="h-11 rounded-xl" />
                                {state.errors?.fullName && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{state.errors.fullName[0]}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Email</Label>
                                <Input id="email" name="email" type="email" placeholder="john@devopstick.com" required className="h-11 rounded-xl" />
                                {state.errors?.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{state.errors.email[0]}</p>}
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Connection</Label>
                                <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" required className="h-11 rounded-xl" />
                                {state.errors?.phone && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{state.errors.phone[0]}</p>}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <CreateEditorButton />
                        </div>
                    </form>
                 </div>
            </div>
        </div>
    );
}
