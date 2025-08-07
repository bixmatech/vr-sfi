export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || !post.published) return notFound();
  return (
    <main className="max-w-3xl mx-auto p-6 prose dark:prose-invert">
      <Link href="/blog">← Back</Link>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
}