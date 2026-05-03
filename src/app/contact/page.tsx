"use client";

import { Mail, Send, LoaderCircle, PartyPopper, AlertCircle } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { submitContactForm } from "@/app/actions";

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
  message: "",
  success: false,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center rounded-lg bg-slate-950 px-6 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400 dark:bg-white dark:text-slate-950"
    >
      {pending ? (
        <>
          <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />
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

  return (
    <div className="rounded-xl border border-slate-200 bg-white py-12 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Contact Devopstick</h1>
          <p className="mt-4 text-lg leading-7 text-slate-600 dark:text-slate-300">
            This form submits through the existing contact action and API.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-white p-3 text-cyan-700 dark:bg-slate-900 dark:text-cyan-300">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-950 dark:text-white">Email</h2>
                <a href="mailto:hello@Devopstick.academy" className="mt-1 block text-sm text-slate-600 hover:text-cyan-700 dark:text-slate-300">
                  hello@Devopstick.academy
                </a>
              </div>
            </div>
          </aside>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <form action={formAction} className="space-y-6">
              {state.message && (
                <div className={`flex items-center gap-x-3 rounded-md p-4 text-sm ${state.success ? "bg-green-100/70 text-green-800 dark:bg-green-900/40 dark:text-green-200" : "bg-red-100/70 text-red-800 dark:bg-red-900/40 dark:text-red-200"}`}>
                  {state.success ? <PartyPopper className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  <p className="font-medium">{state.message}</p>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">Your Name</label>
                  <input id="name" name="name" className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                  {state.errors?.name && <p className="mt-2 text-sm text-red-500">{state.errors.name[0]}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">Your Email</label>
                  <input type="email" id="email" name="email" className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                  {state.errors?.email && <p className="mt-2 text-sm text-red-500">{state.errors.email[0]}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">Message</label>
                <textarea id="message" name="message" rows={5} className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                {state.errors?.message && <p className="mt-2 text-sm text-red-500">{state.errors.message[0]}</p>}
              </div>
              <div>
                <label htmlFor="captcha" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                  Anti-spam: type <code>DEVOPS</code>
                </label>
                <input id="captcha" name="captcha" type="text" className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <SubmitButton />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
