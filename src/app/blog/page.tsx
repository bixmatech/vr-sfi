export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Blog</h1>
      <div className="space-y-4">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="block border rounded p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="font-semibold">{p.title}</div>
            {p.excerpt && <p className="text-sm text-gray-600 dark:text-gray-400">{p.excerpt}</p>}
          </Link>
        ))}
        {posts.length === 0 && <p className="text-sm text-gray-500">No posts yet.</p>}
      </div>
    </main>
  );
}