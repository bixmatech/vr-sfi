export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({ where: { visibility: 'PUBLIC' }, orderBy: { name: 'asc' } });
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Explore Agents</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((a) => (
          <Link key={a.id} href={`/a/${a.slug}`} className="border rounded p-4 hover:shadow">
            <div className="flex items-center gap-3">
              {a.avatarUrl && <img src={a.avatarUrl} alt={a.name} className="w-10 h-10 rounded-full" />}
              <div>
                <h3 className="font-semibold">{a.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{a.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}