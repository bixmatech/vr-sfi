export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function BillingPage() {
  const packages = await prisma.creditPackage.findMany({ where: { isActive: true }, orderBy: { priceCents: 'asc' } });
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Buy Credits</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {packages.map((p) => (
          <div key={p.id} className="border rounded p-4">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{p.credits} credits</p>
            <div className="mt-2 text-2xl font-bold">${(p.priceCents / 100).toFixed(2)}</div>
            <div className="mt-4 flex gap-2">
              <Link href={`/api/billing/stripe/checkout?package=${p.slug}`} className="flex-1 text-center bg-black text-white py-2 rounded">Stripe</Link>
              <Link href={`/api/billing/paypal/checkout?package=${p.slug}`} className="flex-1 text-center border py-2 rounded">PayPal</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Manual Bank Deposit</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Contact support with your deposit receipt. Admin will approve and add credits.</p>
      </div>
    </main>
  );
}