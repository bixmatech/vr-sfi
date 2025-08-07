export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ShareThread({ params }: { params: { shareId: string } }) {
  const thread = await prisma.thread.findFirst({ where: { shareId: params.shareId, isPublic: true }, include: { messages: true, agent: true } });
  if (!thread) return notFound();
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{thread.agent.name}</h1>
      <div className="space-y-3">
        {thread.messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block px-3 py-2 rounded ${m.role === 'user' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}