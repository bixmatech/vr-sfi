import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/credits';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' as any });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId as string | undefined;
    const packageSlug = session.metadata?.packageSlug as string | undefined;
    if (userId && packageSlug) {
      const pkg = await prisma.creditPackage.findUnique({ where: { slug: packageSlug } });
      if (pkg) {
        await prisma.purchase.create({
          data: {
            userId,
            provider: 'stripe',
            providerId: session.id,
            status: 'paid',
            amountCents: pkg.priceCents,
            currency: pkg.currency,
            creditsGranted: pkg.credits,
            packageId: pkg.id
          }
        });
        await addCredits(userId, pkg.credits + (pkg.bonus || 0), `Stripe purchase: ${pkg.name}`);
      }
    }
  }

  return NextResponse.json({ received: true });
}