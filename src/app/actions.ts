'use server';

import { z } from 'zod';
import { login, submitContact } from "@/lib/api";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export interface FormState {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
    api?: string[];
    username?: string[];
    password?: string[];
  };
}

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
  };

  const validatedFields = contactSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  try {
    const response = await submitContact(rawFormData);
    return { message: response.message || 'Thank you for your message!' };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      message: 'An unexpected error occurred. Please try again later.',
      errors: { api: [errorMessage] },
    };
  }
}

export async function adminLogin(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  let response;
  try {
    const { username, password } = validatedFields.data;
    response = await login({ username, password });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      message: 'Invalid username or password',
      errors: { api: [errorMessage] },
    };
  }

  if (response && response.token) {
    const cookieStore = await cookies(); // ✅ FIX
    cookieStore.set('token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    redirect('/admin/dashboard'); // ❗ must be last
  }

  return { message: 'Login failed: No token received.' };
}

export async function logout() {
  const cookieStore = await cookies(); // ✅ FIX
  cookieStore.delete('token');
  redirect('/admin');
}
