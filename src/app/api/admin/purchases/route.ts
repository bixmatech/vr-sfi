import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const purchases = await prisma.purchase.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true, package: true } });
  return NextResponse.json({ purchases });
}