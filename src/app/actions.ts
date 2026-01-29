'use server'

import { z } from 'zod';
import { submitContact, login } from '@/lib/api';
import { FormState } from 'react-dom';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
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
        return { message: response.message || 'Thank you for your message!', errors: {} };
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
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please correct the errors and try again.'
        };
    }

    try {
        await login(validatedFields.data);
        // Handle the JWT token here
        return { message: 'Login successful!', errors: {} };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return {
            message: 'Invalid email or password',
            errors: { api: [errorMessage] }
        };
    }
}
