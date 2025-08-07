'use client';
import useSWR from 'swr';

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AdminSettings() {
  const { data } = useSWR('/api/admin/settings', fetcher);
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="border rounded p-4">
        <div>OpenAI: {data?.openai?.configured ? 'Configured' : 'Missing'}</div>
        <div>Stripe: {data?.stripe?.configured ? 'Configured' : 'Missing'}</div>
        <div>PayPal: {data?.paypal?.configured ? 'Configured' : 'Missing'}</div>
      </div>
    </main>
  );
}