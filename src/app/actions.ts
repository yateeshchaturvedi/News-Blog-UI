'use server'

import { z } from 'zod';
import { submitContact, login } from '@/lib/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Define a type for the form state for better type-safety
export type FormState = {
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
    api?: string[];
  };
};

const loginSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters long.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' })
});

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
    const rawFormData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        message: formData.get('message') as string,
    };

    try {
        const response = await submitContact(rawFormData);
        return { message: response.message || 'Thank you for your message!' };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return {
            message: 'An unexpected error occurred. Please try again later.',
            errors: { api: [errorMessage] }
        };
    }
}

export async function adminLogin(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = loginSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please correct the errors and try again.'
        };
    }

    try {
        const { username, password } = validatedFields.data;
        const response = await login({ username, password });

        if (response.token) {
            cookies().set('token', response.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            // This will throw a special error that needs to be handled
            redirect('/admin/dashboard');
        } else {
           return { message: 'Login failed: No token received.' };
        }
    } catch (error: any) {
        // If the error is a redirect error, re-throw it so Next.js can handle it.
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return {
            message: 'Invalid username or password',
            errors: { api: [errorMessage] }
        };
    }
}
