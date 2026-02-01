'use client';

import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { adminLogin, FormState } from '@/app/actions';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button 
            type="submit" 
            disabled={pending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:bg-blue-300"
        >
            {pending ? 'Logging in...' : 'Login'}
        </button>
    );
}

export default function LoginForm() {
    const [state, setState] = useState<FormState>({ message: '' });

    const formAction = async (formData: FormData) => {
        const result = await adminLogin(state, formData);
        setState(result);
    };

    return (
        <form action={formAction} className="space-y-6">
            {state?.message && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <p>{state.message}</p>
                </div>
            )}
            
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input 
                    id="username"
                    name="username"
                    type="text"
                    required 
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {state?.errors?.username && (
                    <div className="text-red-500 text-sm mt-1">
                        {state.errors.username.join(', ')}
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input 
                    id="password"
                    name="password"
                    type="password"
                    required 
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {state?.errors?.password && (
                    <div className="text-red-500 text-sm mt-1">
                        {state.errors.password.join(', ')}
                    </div>
                )}
            </div>

            <SubmitButton />
        </form>
    );
}
