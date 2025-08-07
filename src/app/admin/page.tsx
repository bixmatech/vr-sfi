export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function AdminHome() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return <main className="max-w-3xl mx-auto p-6">Access denied.</main>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link className="border rounded p-4" href="/admin/agents">Agents</Link>
        <Link className="border rounded p-4" href="/admin/users">Users</Link>
        <Link className="border rounded p-4" href="/admin/purchases">Purchases</Link>
        <Link className="border rounded p-4" href="/admin/blog">Blog</Link>
        <Link className="border rounded p-4" href="/admin/pages">Pages</Link>
        <Link className="border rounded p-4" href="/admin/settings">Settings</Link>
      </div>
    </main>
  );
}