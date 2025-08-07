'use client';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminAgents() {
  const { data, mutate } = useSWR('/api/admin/agents', fetcher);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');

  const create = async () => {
    const res = await fetch('/api/admin/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug, model }) });
    if (res.ok) {
      setName('');
      setSlug('');
      mutate();
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Agents</h1>
      <div className="border rounded p-4 space-y-2">
        <input className="border p-2 rounded w-full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
        <button className="px-4 py-2 bg-black text-white rounded" onClick={create}>Create</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.agents?.map((a: any) => (
          <div key={a.id} className="border rounded p-4">
            <div className="font-semibold">{a.name}</div>
            <div className="text-sm text-gray-500">/{a.slug}</div>
          </div>
        ))}
      </div>
    </main>
  );
}