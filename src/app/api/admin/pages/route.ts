import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const pages = await prisma.page.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ pages });
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { title, slug, content } = await req.json();
  const created = await prisma.page.create({ data: { title, slug, content } });
  return NextResponse.json({ page: created });
}