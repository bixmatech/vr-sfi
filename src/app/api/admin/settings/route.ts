import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json({
    openai: { configured: !!process.env.OPENAI_API_KEY },
    stripe: { configured: !!process.env.STRIPE_SECRET_KEY },
    paypal: { configured: !!process.env.PAYPAL_CLIENT_ID }
  });
}