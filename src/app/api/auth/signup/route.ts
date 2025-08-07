import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parse = z
      .object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) })
      .safeParse(body);
    if (!parse.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email: parse.data.email } });
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    const user = await prisma.user.create({ data: { name: parse.data.name, email: parse.data.email } });
    const hashed = await hash(parse.data.password, 10);
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: user.email!,
        access_token: hashed
      }
    });

    if (process.env.ALLOW_REGISTRATION_BONUS === 'true') {
      const bonus = Number(process.env.REGISTRATION_BONUS_CREDITS || '0');
      if (bonus > 0) {
        await prisma.user.update({ where: { id: user.id }, data: { credits: { increment: bonus } } });
        await prisma.creditLedger.create({ data: { userId: user.id, delta: bonus, reason: 'Registration bonus' } });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}