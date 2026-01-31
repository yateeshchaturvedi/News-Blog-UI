import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. You are successfully logged in.</p>
      {/* You can add more dashboard content here */}
    </div>
  );
}
