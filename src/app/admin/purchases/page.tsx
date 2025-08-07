'use client';
import useSWR from 'swr';

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AdminPurchases() {
  const { data } = useSWR('/api/admin/purchases', fetcher);
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Purchases</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">User</th>
              <th className="py-2">Provider</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Credits</th>
              <th className="py-2">Package</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.purchases?.map((p: any) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 pr-4">{p.user?.email}</td>
                <td className="py-2 pr-4">{p.provider}</td>
                <td className="py-2 pr-4">${(p.amountCents / 100).toFixed(2)} {p.currency.toUpperCase()}</td>
                <td className="py-2 pr-4">{p.creditsGranted}</td>
                <td className="py-2 pr-4">{p.package?.name}</td>
                <td className="py-2 pr-4">{p.status}</td>
                <td className="py-2 pr-4">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}