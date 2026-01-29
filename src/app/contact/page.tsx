'use client'

import { Mail, Phone, MapPin } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitContactForm } from '@/app/actions';

// Define the shape of the form state
interface FormState {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
}

const initialState: FormState = {
    message: '',
    errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:bg-gray-400">
            {pending ? 'Sending...' : 'Send Message'}
        </button>
    );
}

export default function ContactPage() {
    const [state, formAction] = useFormState(submitContactForm, initialState);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Get in Touch</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Have a question or a story to share? We&apos;d love to hear from you. 
                    Fill out the form and we&apos;ll get back to you as soon as possible.
                </p>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Mail className="h-6 w-6 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300">contact@newshub.com</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Phone className="h-6 w-6 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <MapPin className="h-6 w-6 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300">123 News Street, New York, NY 10001</span>
                    </div>
                </div>
            </div>
            <div>
                <form action={formAction} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                    {state.message && <p className={`mb-4 ${state.errors ? 'text-red-500' : 'text-green-500'}`}>{state.message}</p>}
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Your Name</label>
                        <input type="text" id="name" name="name" className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {state.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Your Email</label>
                        <input type="email" id="email" name="email" className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                         {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Message</label>
                        <textarea id="message" name="message" rows={5} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                         {state.errors?.message && <p className="text-red-500 text-sm mt-1">{state.errors.message[0]}</p>}
                    </div>
                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
