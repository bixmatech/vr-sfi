import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { title, slug, content, published } = await req.json();
  const created = await prisma.blogPost.create({ data: { title, slug, content, published: !!published } });
  return NextResponse.json({ post: created });
}