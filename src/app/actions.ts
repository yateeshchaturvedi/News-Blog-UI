'use server'

import { z } from 'zod';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { loginUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createNewsArticle, updateNewsArticle, getNewsArticle, deleteNewsArticle, submitContact, createEditorAccount } from '@/lib/api';
import { cookies } from 'next/headers';

const FormSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    content: z.string().trim().min(1, 'Content is required'),
    author: z.string().trim().min(1, 'Author is required'),
    category: z.string().trim().min(1, 'Category is required'),
    status: z.string().trim().optional(),
});

const ContactFormSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
});

const EditorFormSchema = z.object({
    username: z.string().trim().min(3, 'Username must be at least 3 characters'),
    password: z.string().trim().min(6, 'Password must be at least 6 characters'),
});

async function saveNewsImage(file: File): Promise<string | undefined> {
    if (!(file instanceof File) || file.size === 0) {
        return undefined;
    }

    const extFromName = path.extname(file.name || '').toLowerCase();
    const ext = extFromName || '.jpg';
    const fileName = `${Date.now()}-${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'news-images');
    const filePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return `/news-images/${fileName}`;
}

export type FormState = {
    message: string;
    errors?: {
        title?: string[];
        content?: string[];
        author?: string[];
        category?: string[];
        status?: string[];
        name?: string[];
        email?: string[];
        message?: string[];
        username?: string[];
        password?: string[];
    };
    success?: boolean;
};

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
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
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('token')?.value;
    const tokenFromForm = formData.get('token');
    const token = tokenFromCookie || (typeof tokenFromForm === 'string' ? tokenFromForm : '');

    if (!token) {
        return { message: 'Authentication failed. Please log in again.' };
    }

    const validatedFields = FormSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        author: formData.get('author'),
        category: formData.get('category'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, content, author, category } = validatedFields.data;
    const uploadedImage = await saveNewsImage(formData.get('imageFile') as File);

    try {
        await createNewsArticle({ title, content, author, category, imageUrl: uploadedImage }, token);
        revalidatePath('/admin/dashboard/news');
        return { message: 'Article created successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to create article: ${errorMessage}` };
    }
}

export async function updateArticle(id: string | number, prevState: FormState, formData: FormData): Promise<FormState> {
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('token')?.value;
    const tokenFromForm = formData.get('token');
    const token = tokenFromCookie || (typeof tokenFromForm === 'string' ? tokenFromForm : '');

    if (!token) {
        return { message: 'Authentication failed. Please log in again.' };
    }
    const validatedFields = FormSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        author: formData.get('author'),
        category: formData.get('category'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, content, category, status } = validatedFields.data;
    const uploadedImage = await saveNewsImage(formData.get('imageFile') as File);
    const currentImagePath = formData.get('currentImagePath');
    const imageUrl =
        uploadedImage ||
        (typeof currentImagePath === 'string' && currentImagePath.trim() ? currentImagePath.trim() : undefined);

    try {
        await updateNewsArticle(id, { title, content, category, status, imageUrl }, token);
        revalidatePath('/admin/dashboard/news');
        return { message: 'Article updated successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to update article: ${errorMessage}` };
    }
}

export async function deleteArticle(id: string | number): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('Authentication failed. Please log in again.');
    }

    await deleteNewsArticle(id, token);
    revalidatePath('/admin/dashboard/news');
}

export async function setNewsStatus(id: string | number, status: 'PENDING' | 'APPROVED'): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('Authentication failed. Please log in again.');
    }

    const article = await getNewsArticle(id, token);
    if (!article) {
        throw new Error('News not found');
    }

    await updateNewsArticle(
        id,
        {
            title: article.title,
            content: article.content || '',
            category: article.category,
            status,
        },
        token
    );
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/news/[...slug]');
    revalidatePath('/admin/dashboard/news');
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

export async function createEditorByAdmin(prevState: FormState, formData: FormData): Promise<FormState> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
        return { message: 'Authentication failed. Please log in again.' };
    }

    const validatedFields = EditorFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { username, password } = validatedFields.data;

    try {
        await createEditorAccount({ username, password });
        return { message: 'Editor account created successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to create editor: ${errorMessage}` };
    }
}
