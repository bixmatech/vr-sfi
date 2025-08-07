export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Please <Link className="underline" href="/auth/signin">sign in</Link>.</p>
      </main>
    );
  }

  const threads = await prisma.thread.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: 'desc' }, take: 10, include: { agent: true } });
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {session.user.name || 'User'}</h1>
        <div className="text-sm">Credits: <span className="font-semibold">{session.user.credits}</span></div>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-3">Recent Threads</h2>
        <div className="space-y-2">
          {threads.map((t) => (
            <Link key={t.id} href={`/a/${t.agent.slug}`} className="block border rounded p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.agent.name}</div>
                <div className="text-sm text-gray-500">{new Date(t.updatedAt).toLocaleString()}</div>
              </div>
            </Link>
          ))}
          {threads.length === 0 && <p className="text-sm text-gray-500">No threads yet.</p>}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-3">Buy Credits</h2>
        <Link className="px-4 py-2 bg-black text-white rounded dark:bg-white dark:text-black" href="/billing">View packages</Link>
      </section>
    </main>
  );
}