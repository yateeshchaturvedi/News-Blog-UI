'use client'

import { Mail, Phone, MapPin, Send, LoaderCircle, PartyPopper, AlertCircle } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitContactForm } from '@/app/actions';

// Define the shape of the form state
interface FormState {
  message: string;
  success: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
}

const initialState: FormState = {
    message: '',
    success: false,
    errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button 
            type="submit" 
            disabled={pending} 
            className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 disabled:transform-none"
        >
            {pending ? (
                <>
                    <LoaderCircle className="animate-spin mr-3 h-5 w-5" />
                    <span>Sending...</span>
                </>
            ) : (
                <>
                    <Send className="mr-3 h-5 w-5" />
                    <span>Send Message</span>
                </>
            )}
        </button>
    );
}

export default function ContactPage() {
    const [state, formAction] = useFormState(submitContactForm, initialState);

    const contactInfo = [
        { icon: Mail, text: 'hello@devopshub.academy', href: 'mailto:hello@devopshub.academy' },
        { icon: Phone, text: '+1 (555) 987-2048', href: 'tel:+15559872048' },
        { icon: MapPin, text: '42 Deployment Lane, San Francisco, CA', href: '#' },
    ];

    return (
        <div className="rounded-3xl border border-blue-100 bg-white/85 py-12 shadow-sm sm:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Contact DevOpsHub</h1>
                    <p className="mt-4 text-lg leading-6 text-slate-600">Need help with a learning track or roadmap? We&apos;re here to help.</p>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Section */}
                    <div className="flex flex-col space-y-8">
                        <h2 className="text-3xl font-semibold text-slate-900">Get in Touch</h2>
                        {contactInfo.map((item, index) => (
                            <a key={index} href={item.href} className="flex items-start space-x-5 rounded-lg p-4 transition-colors hover:bg-blue-50/70">
                                <div className="flex-shrink-0">
                                    <div className="rounded-full bg-blue-100 p-3">
                                        <item.icon className="h-7 w-7 text-blue-700" />
                                    </div>
                                </div>
                                <div className="pt-1.5">
                                    <p className="text-lg font-semibold text-slate-700">{item.text}</p>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
                            <form action={formAction} className="space-y-6">
                                {state.message && (
                                    <div className={`flex items-center gap-x-3 rounded-md p-4 text-sm ${state.success ? 'bg-green-100/70 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100/70 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}>
                                        {state.success ? <PartyPopper className="h-5 w-5"/> : <AlertCircle className="h-5 w-5"/>}
                                        <p className="font-medium">{state.message}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold leading-6 text-slate-900">Your Name</label>
                                        <div className="mt-2.5">
                                            <input type="text" id="name" name="name" className="block w-full rounded-md border-0 bg-white px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition" />
                                            {state.errors?.name && <p className="text-red-500 text-sm mt-2">{state.errors.name[0]}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold leading-6 text-slate-900">Your Email</label>
                                        <div className="mt-2.5">
                                            <input type="email" id="email" name="email" className="block w-full rounded-md border-0 bg-white px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition" />
                                            {state.errors?.email && <p className="text-red-500 text-sm mt-2">{state.errors.email[0]}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-slate-900">Message</label>
                                    <div className="mt-2.5">
                                        <textarea id="message" name="message" rows={5} className="block w-full rounded-md border-0 bg-white px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition"></textarea>
                                        {state.errors?.message && <p className="text-red-500 text-sm mt-2">{state.errors.message[0]}</p>}
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <SubmitButton />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
