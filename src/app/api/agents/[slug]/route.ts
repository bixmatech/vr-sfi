import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const agent = await prisma.agent.findUnique({ where: { slug: params.slug } });
  if (!agent || agent.visibility === 'PRIVATE') return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ agent });
}