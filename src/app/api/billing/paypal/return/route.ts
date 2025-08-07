import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/credits';

function getPayPalClient() {
  const env = process.env.PAYPAL_ENVIRONMENT === 'live'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID || '', process.env.PAYPAL_CLIENT_SECRET || '')
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID || '', process.env.PAYPAL_CLIENT_SECRET || '');
  return new paypal.core.PayPalHttpClient(env);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.redirect(new URL('/billing?error=1', process.env.APP_URL));

  const client = getPayPalClient();
  const request = new paypal.orders.OrdersCaptureRequest(token);
  request.requestBody({} as any);
  const capture = await client.execute(request);
  const customId = capture.result.purchase_units?.[0]?.custom_id as string | undefined; // userId:slug
  if (customId) {
    const [userId, slug] = customId.split(':');
    const pkg = await prisma.creditPackage.findUnique({ where: { slug } });
    if (pkg) {
      await prisma.purchase.create({
        data: {
          userId,
          provider: 'paypal',
          providerId: token,
          status: 'paid',
          amountCents: pkg.priceCents,
          currency: pkg.currency,
          creditsGranted: pkg.credits,
          packageId: pkg.id
        }
      });
      await addCredits(userId, pkg.credits + (pkg.bonus || 0), `PayPal purchase: ${pkg.name}`);
    }
  }

  return NextResponse.redirect(new URL('/billing?success=1', process.env.APP_URL));
}