import LoginForm from "@/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in using the existing authentication action.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Login</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Uses the existing login action and backend API.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
