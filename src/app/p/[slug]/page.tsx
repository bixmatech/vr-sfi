export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await prisma.page.findUnique({ where: { slug: params.slug } });
  if (!page) return notFound();
  return (
    <main className="max-w-3xl mx-auto p-6 prose dark:prose-invert">
      <h1>{page.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}