'use server'

import { z } from 'zod';
import { loginUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createNewsArticle, updateNewsArticle, submitContact } from '@/lib/api';
import { cookies } from 'next/headers';

const FormSchema = z.object({
    title: z.string(),
    content: z.string(),
    author: z.string(),
    category: z.string(),
});

const ContactFormSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
});

export type FormState = {
    message: string;
    errors?: {
        title?: string[];
        content?: string[];
        author?: string[];
        category?: string[];
        name?: string[];
        email?: string[];
        message?: string[];
        username?: string[];
        password?: string[];
    };
    success?: boolean;
};

export async function login(prevState: FormState, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        return { message: 'Username and password are required' };
    }

    const result = await loginUser(username, password);

    if (result.success && result.token) {
        // The Next.js cookies() function in Server Actions is asynchronous.
        // We must await it to get the cookie store before we can modify it.
        const cookieStore = await cookies();
        await cookieStore.set('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        redirect('/admin/dashboard');
    } else {
        return { message: result.error || 'Invalid credentials' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    await cookieStore.delete('token');
    redirect('/admin');
}

export async function createArticle(prevState: FormState, formData: FormData): Promise<FormState> {
    const token = formData.get('token') as string;

    if (!token) {
        return { message: 'Authentication failed. Please log in again.' };
    }

    const validatedFields = FormSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        author: formData.get('author'),
        category: formData.get('category'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, content, author, category } = validatedFields.data;

    try {
        await createNewsArticle({ title, content, author, category }, token);
        revalidatePath('/admin/dashboard/news');
        return { message: 'Article created successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to create article: ${errorMessage}` };
    }
}

export async function updateArticle(id: number, prevState: FormState, formData: FormData): Promise<FormState> {
    const token = formData.get('token') as string;
    if (!token) {
        return { message: 'Authentication failed. Please log in again.' };
    }
    const validatedFields = FormSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        author: formData.get('author'),
        category: formData.get('category'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, content, category } = validatedFields.data;

    try {
        await updateNewsArticle(id, { title, content, category }, token);
        revalidatePath('/admin/dashboard/news');
        return { message: 'Article updated successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to update article: ${errorMessage}` };
    }
}

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = ContactFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, message } = validatedFields.data;

    try {
        await submitContact({ name, email, message });
        return { message: 'Your message has been sent successfully!', success: true };
    } catch (error) {
        console.error(error);
        return { message: 'Failed to send message' };
    }
}
