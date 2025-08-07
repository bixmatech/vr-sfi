import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' as any });

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.redirect(new URL('/auth/signin', process.env.APP_URL));

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('package');
  if (!slug) return NextResponse.json({ error: 'Missing package' }, { status: 400 });

  const pkg = await prisma.creditPackage.findUnique({ where: { slug } });
  if (!pkg || !pkg.isActive) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: session.user.email || undefined,
    line_items: [
      {
        price_data: {
          currency: pkg.currency,
          product_data: { name: `${pkg.name} (${pkg.credits} credits)` },
          unit_amount: pkg.priceCents
        },
        quantity: 1
      }
    ],
    metadata: {
      userId: session.user.id,
      packageSlug: pkg.slug
    },
    success_url: `${process.env.APP_URL}/billing?success=1`,
    cancel_url: `${process.env.APP_URL}/billing?canceled=1`
  });

  return NextResponse.redirect(checkout.url!);
}