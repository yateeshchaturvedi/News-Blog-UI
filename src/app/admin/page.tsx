'use client'

import { useActionState } from 'react';
import { useFormStatus } from "react-dom";
import { login, FormState } from "@/app/actions";
import { Lock, User, LogIn, AlertCircle, LoaderCircle } from 'lucide-react';
import Link from 'next/link';

const initialState: FormState = {
  message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-transform transform hover:scale-105"
        >
            {pending ? (
                <>
                    <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Signing In...
                </>
            ) : (
                <>
                    <LogIn className="-ml-1 mr-2 h-5 w-5" />
                    Sign in
                </>
            )}
        </button>
    );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-20 dark:opacity-30"></div>
        <div className="relative max-w-md w-full space-y-8 bg-white dark:bg-gray-800/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl">
            <div className="text-center">
                <Link href="/" className="inline-block mb-6">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        DevOpsHub Console
                    </h1>
                </Link>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Access Learning CMS
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Sign in to manage DevOps lessons and tracks
                </p>
            </div>

            <form className="mt-8 space-y-6" action={formAction}>
                 {state.message && (
                    <div className={`flex items-center gap-x-3 rounded-md p-3 text-sm ${state.errors ? 'bg-red-100/80 text-red-800 dark:bg-red-900/40 dark:text-red-200' : 'bg-green-100/80 text-green-800 dark:bg-green-900/40 dark:text-green-200'}`}>
                         <AlertCircle className="h-5 w-5"/>
                        <p className="font-medium">{state.message}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                            placeholder="Username"
                        />
                         {state.errors?.username && <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.username[0]}</p>}
                    </div>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                            placeholder="Password"
                        />
                        {state.errors?.password && <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.password[0]}</p>}
                    </div>
                </div>

                <div className="pt-2">
                    <SubmitButton />
                </div>
            </form>
        </div>
    </div>
  );
}
