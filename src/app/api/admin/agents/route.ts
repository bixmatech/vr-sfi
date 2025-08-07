import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const agents = await prisma.agent.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ agents });
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const { name, slug, model } = body as { name: string; slug: string; model: string };
  if (!name || !slug) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const created = await prisma.agent.create({ data: { name, slug, model } });
  return NextResponse.json({ agent: created });
}