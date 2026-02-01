'use client'

import { useActionState } from "react";
import { adminLogin, FormState } from "@/app/actions";

const initialState: FormState = {
  message: "",
};

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(adminLogin, initialState);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your content
          </p>
        </div>
        <form className="mt-8 space-y-6" action={formAction}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>

          {state.message && (
            <p className={`text-sm ${state.errors ? 'text-red-500' : 'text-green-500'} text-center`}>
              {state.message}
            </p>
          )}

          {state.errors?.username &&
            state.errors.username.map((error) => (
              <p className="text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          {state.errors?.password &&
            state.errors.password.map((error) => (
              <p className="text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          {state.errors?.api &&
            state.errors.api.map((error) => (
              <p className="text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </form>
      </div>
    </div>
  );
}
