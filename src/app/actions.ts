'use server'

import { z } from 'zod';
import { put } from '@vercel/blob';
import { loginUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
    createNewsArticle,
    updateNewsArticle,
    updateNewsStatusArticle,
    deleteNewsArticle,
    submitContact,
    createEditorAccount,
    createCategory,
    updateCategory,
    deleteCategory,
    createBlog,
    updateBlog,
    deleteBlog,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    updateMyProfile,
    deleteMyAccount,
} from '@/lib/api';
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
    captcha: z.string().trim().min(1, 'Captcha is required'),
});

const EditorFormSchema = z.object({
    username: z.string().trim().min(3, 'Username must be at least 3 characters'),
    password: z.string().trim().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().trim().min(2, 'Full name is required'),
    email: z.string().trim().email('A valid email is required'),
    phone: z.string().trim().min(7, 'Phone number is required'),
});

const ProfileFormSchema = z.object({
    username: z.string().trim().min(3, 'Username must be at least 3 characters'),
    fullName: z.string().trim().min(2, 'Full name is required'),
    email: z.string().trim().email('A valid email is required'),
    phone: z.string().trim().min(7, 'Phone number is required'),
    bio: z.string().trim().optional(),
    avatarUrl: z.string().trim().url('Avatar URL must be valid').optional().or(z.literal('')),
    currentPassword: z.string().trim().optional(),
    newPassword: z.string().trim().optional(),
});

const CategoryFormSchema = z.object({
    name: z.string().trim().min(2, 'Category name must be at least 2 characters'),
});

const BlogFormSchema = z.object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters'),
    content: z.string().trim().min(10, 'Content must be at least 10 characters'),
});

const AdvertisementFormSchema = z.object({
    title: z.string().trim().min(2, 'Title must be at least 2 characters'),
    imageUrl: z.string().trim().optional(),
    linkUrl: z.string().trim().optional(),
    placement: z.string().trim().min(2, 'Placement is required'),
    isActive: z.string().trim().optional(),
});

async function saveNewsImage(file: File): Promise<string | undefined> {
    if (!(file instanceof File) || file.size === 0) {
        return undefined;
    }

    const fileName = `news/${Date.now()}-${file.name}`;

    const blob = await put(fileName, file, {
        access: 'public',
    });

    return blob.url; // This is your public image URL
}

async function saveProfileImage(file: File): Promise<string | undefined> {
    if (!(file instanceof File) || file.size === 0) {
        return undefined;
    }

    const fileName = `profiles/${Date.now()}-${file.name}`;
    const blob = await put(fileName, file, {
        access: 'public',
    });

    return blob.url;
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
        fullName?: string[];
        imageUrl?: string[];
        linkUrl?: string[];
        placement?: string[];
        phone?: string[];
        bio?: string[];
        avatarUrl?: string[];
        currentPassword?: string[];
        newPassword?: string[];
        currentPasswordConfirm?: string[];
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
            sameSite: 'strict',
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
    const token = cookieStore.get('token')?.value;

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
        return { message: 'Lesson created successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to create lesson: ${errorMessage}` };
    }
}

export async function updateArticle(id: string | number, prevState: FormState, formData: FormData): Promise<FormState> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

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
        return { message: 'Lesson updated successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to update lesson: ${errorMessage}` };
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

    await updateNewsStatusArticle(id, status, token);
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
        captcha: formData.get('captcha'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, message, captcha } = validatedFields.data;
    const website = String(formData.get('website') || '');

    if (captcha.trim().toUpperCase() !== 'DEVOPS') {
        return { message: 'Captcha validation failed.' };
    }

    try {
        await submitContact({ name, email, message, website, captcha });
        return { message: 'Your message has been sent successfully!', success: true };
    } catch (error) {
        console.error(error);
        return { message: 'Failed to send message' };
    }
}

export async function deleteAccountByUser(prevState: FormState, formData: FormData): Promise<FormState> {
    const token = (await cookies()).get('token')?.value;
    if (!token) return { message: 'Authentication failed. Please log in again.' };

    const currentPassword = String(formData.get('currentPasswordConfirm') || '').trim();
    const confirmation = String(formData.get('confirmationText') || '').trim();

    if (!currentPassword) {
        return { message: 'Current password is required to delete your account.' };
    }

    if (confirmation !== 'DELETE') {
        return { message: 'Type DELETE to confirm account deletion.' };
    }

    try {
        await deleteMyAccount({ currentPassword }, token);
        const cookieStore = await cookies();
        await cookieStore.delete('token');
        redirect('/');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to delete account: ${errorMessage}` };
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
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { username, password, fullName, email, phone } = validatedFields.data;

    try {
        await createEditorAccount({ username, password, fullName, email, phone }, token);
        return { message: 'Editor account created successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to create editor: ${errorMessage}` };
    }
}

export async function updateProfileByUser(prevState: FormState, formData: FormData): Promise<FormState> {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return { message: 'Authentication failed. Please log in again.' };
    }

    const validatedFields = ProfileFormSchema.safeParse({
        username: formData.get('username'),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        bio: formData.get('bio') || '',
        avatarUrl: formData.get('avatarUrl') || '',
        currentPassword: formData.get('currentPassword') || '',
        newPassword: formData.get('newPassword') || '',
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const currentPassword = validatedFields.data.currentPassword || '';
    const newPassword = validatedFields.data.newPassword || '';

    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
        return { message: 'To reset password, provide both current and new password.' };
    }

    if (newPassword && newPassword.length < 6) {
        return { message: 'New password must be at least 6 characters long.' };
    }

    const uploadedAvatar = await saveProfileImage(formData.get('avatarFile') as File);

    try {
        await updateMyProfile(
            {
                username: validatedFields.data.username,
                fullName: validatedFields.data.fullName,
                email: validatedFields.data.email,
                phone: validatedFields.data.phone,
                bio: validatedFields.data.bio || '',
                avatarUrl: uploadedAvatar || validatedFields.data.avatarUrl || '',
                currentPassword: currentPassword || undefined,
                newPassword: newPassword || undefined,
            },
            token
        );
        revalidatePath('/admin/dashboard/profile');
        return { message: 'Profile updated successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to update profile: ${errorMessage}` };
    }
}

export async function createCategoryByAdmin(prevState: FormState, formData: FormData): Promise<FormState> {
    const token = (await cookies()).get('token')?.value;
    if (!token) return { message: 'Authentication failed. Please log in again.' };

    const validatedFields = CategoryFormSchema.safeParse({
        name: formData.get('name'),
    });
    if (!validatedFields.success) {
        return { message: 'Validation failed', errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await createCategory({ name: validatedFields.data.name }, token);
        revalidatePath('/admin/dashboard/categories');
        revalidatePath('/admin/dashboard/news/new');
        return { message: 'Category created successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to create category: ${errorMessage}` };
    }
}

export async function updateCategoryByAdmin(id: string | number, prevState: FormState, formData: FormData): Promise<FormState> {
    const token = (await cookies()).get('token')?.value;
    if (!token) return { message: 'Authentication failed. Please log in again.' };

    const validatedFields = CategoryFormSchema.safeParse({
        name: formData.get('name'),
    });
    if (!validatedFields.success) {
        return { message: 'Validation failed', errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await updateCategory(id, { name: validatedFields.data.name }, token);
        revalidatePath('/admin/dashboard/categories');
        revalidatePath('/admin/dashboard/news/new');
        return { message: 'Category updated successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to update category: ${errorMessage}` };
    }
}

export async function deleteCategoryByAdmin(id: string | number): Promise<void> {
    const token = (await cookies()).get('token')?.value;
    if (!token) throw new Error('Authentication failed. Please log in again.');
    await deleteCategory(id, token);
    revalidatePath('/admin/dashboard/categories');
    revalidatePath('/admin/dashboard/news/new');
}

export async function createBlogByAdmin(prevState: FormState, formData: FormData): Promise<FormState> {
    const token = (await cookies()).get('token')?.value;
    if (!token) return { message: 'Authentication failed. Please log in again.' };

    const validatedFields = BlogFormSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
    });
    if (!validatedFields.success) {
        return { message: 'Validation failed', errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await createBlog(validatedFields.data, token);
        revalidatePath('/admin/dashboard/blogs');
        revalidatePath('/blog');
        return { message: 'Blog created successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to create blog: ${errorMessage}` };
    }
}

export async function updateBlogByAdmin(id: string | number, prevState: FormState, formData: FormData): Promise<FormState> {
    const token = (await cookies()).get('token')?.value;
    if (!token) return { message: 'Authentication failed. Please log in again.' };

    const validatedFields = BlogFormSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
    });
    if (!validatedFields.success) {
        return { message: 'Validation failed', errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await updateBlog(id, validatedFields.data, token);
        revalidatePath('/admin/dashboard/blogs');
        revalidatePath('/blog');
        return { message: 'Blog updated successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to update blog: ${errorMessage}` };
    }
}

export async function deleteBlogByAdmin(id: string | number): Promise<void> {
    const token = (await cookies()).get('token')?.value;
    if (!token) throw new Error('Authentication failed. Please log in again.');
    await deleteBlog(id, token);
    revalidatePath('/admin/dashboard/blogs');
    revalidatePath('/blog');
}

export async function createAdvertisementByAdmin(prevState: FormState, formData: FormData): Promise<FormState> {
    const token = (await cookies()).get('token')?.value;
    if (!token) return { message: 'Authentication failed. Please log in again.' };

    const validatedFields = AdvertisementFormSchema.safeParse({
        title: formData.get('title'),
        imageUrl: formData.get('imageUrl') || '',
        linkUrl: formData.get('linkUrl') || '',
        placement: formData.get('placement'),
        isActive: formData.get('isActive') ? 'true' : 'false',
    });
    if (!validatedFields.success) {
        return { message: 'Validation failed', errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await createAdvertisement(
            {
                title: validatedFields.data.title,
                imageUrl: validatedFields.data.imageUrl || undefined,
                linkUrl: validatedFields.data.linkUrl || undefined,
                placement: validatedFields.data.placement,
                isActive: validatedFields.data.isActive === 'true',
            },
            token
        );
        revalidatePath('/admin/dashboard/advertisements');
        return { message: 'Advertisement created successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to create advertisement: ${errorMessage}` };
    }
}

export async function updateAdvertisementByAdmin(id: string | number, prevState: FormState, formData: FormData): Promise<FormState> {
    const token = (await cookies()).get('token')?.value;
    if (!token) return { message: 'Authentication failed. Please log in again.' };

    const validatedFields = AdvertisementFormSchema.safeParse({
        title: formData.get('title'),
        imageUrl: formData.get('imageUrl') || '',
        linkUrl: formData.get('linkUrl') || '',
        placement: formData.get('placement'),
        isActive: formData.get('isActive') ? 'true' : 'false',
    });
    if (!validatedFields.success) {
        return { message: 'Validation failed', errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await updateAdvertisement(
            id,
            {
                title: validatedFields.data.title,
                imageUrl: validatedFields.data.imageUrl || undefined,
                linkUrl: validatedFields.data.linkUrl || undefined,
                placement: validatedFields.data.placement,
                isActive: validatedFields.data.isActive === 'true',
            },
            token
        );
        revalidatePath('/admin/dashboard/advertisements');
        return { message: 'Advertisement updated successfully', success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Failed to update advertisement: ${errorMessage}` };
    }
}

export async function deleteAdvertisementByAdmin(id: string | number): Promise<void> {
    const token = (await cookies()).get('token')?.value;
    if (!token) throw new Error('Authentication failed. Please log in again.');
    await deleteAdvertisement(id, token);
    revalidatePath('/admin/dashboard/advertisements');
}
