import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const thread = await prisma.thread.findUnique({ where: { id: params.id } });
  if (!thread || thread.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const shareId = thread.shareId || crypto.randomUUID();
  const updated = await prisma.thread.update({ where: { id: thread.id }, data: { isPublic: true, shareId } });
  return NextResponse.json({ shareUrl: `${process.env.APP_URL}/share/${updated.shareId}` });
}