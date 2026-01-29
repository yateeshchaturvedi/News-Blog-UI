'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { adminLogin } from '../actions';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-blue-300"
      type="submit"
      disabled={pending}
    >
      {pending ? 'Signing In...' : 'Sign In'}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(adminLogin, initialState);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">Admin Portal</h2>
        <form action={formAction}>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              className="shadow-inner appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              id="email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              required
            />
            {state.errors?.email && 
              <p className="text-red-500 text-xs italic mt-2">{state.errors.email[0]}</p>
            }
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow-inner appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-300 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              id="password"
              type="password"
              name="password"
              placeholder="******************"
              required
            />
             {state.errors?.password && 
              <p className="text-red-500 text-xs italic mt-2">{state.errors.password[0]}</p>
            }
          </div>
          {state.message && !state.errors && <p className="text-green-500 text-sm italic mb-4">{state.message}</p>}
          {state.message && state.errors && <p className="text-red-500 text-sm italic mb-4">{state.message}</p>}
          <div className="flex items-center justify-center">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
