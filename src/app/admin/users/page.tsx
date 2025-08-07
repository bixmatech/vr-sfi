'use client';
import useSWR from 'swr';

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AdminUsers() {
  const { data } = useSWR('/api/admin/users', fetcher);
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Email</th>
              <th className="py-2">Name</th>
              <th className="py-2">Role</th>
              <th className="py-2">Credits</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((u: any) => (
              <tr key={u.id} className="border-b">
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.name}</td>
                <td className="py-2 pr-4">{u.role}</td>
                <td className="py-2 pr-4">{u.credits}</td>
                <td className="py-2 pr-4">{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}