import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

function getPayPalClient() {
  const env = process.env.PAYPAL_ENVIRONMENT === 'live'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID || '', process.env.PAYPAL_CLIENT_SECRET || '')
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID || '', process.env.PAYPAL_CLIENT_SECRET || '');
  return new paypal.core.PayPalHttpClient(env);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.redirect(new URL('/auth/signin', process.env.APP_URL));

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('package');
  if (!slug) return NextResponse.json({ error: 'Missing package' }, { status: 400 });

  const pkg = await prisma.creditPackage.findUnique({ where: { slug } });
  if (!pkg || !pkg.isActive) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

  const client = getPayPalClient();
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: pkg.currency.toUpperCase(),
          value: (pkg.priceCents / 100).toFixed(2)
        },
        custom_id: `${session.user.id}:${pkg.slug}`
      }
    ],
    application_context: {
      return_url: `${process.env.APP_URL}/api/billing/paypal/return`,
      cancel_url: `${process.env.APP_URL}/billing?canceled=1`
    }
  });
  const order = await client.execute(request);
  const approve = order.result.links?.find((l: any) => l.rel === 'approve');
  if (!approve?.href) return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  return NextResponse.redirect(approve.href);
}