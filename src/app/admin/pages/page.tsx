'use client';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AdminPages() {
  const { data, mutate } = useSWR('/api/admin/pages', fetcher);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

  const create = async () => {
    await fetch('/api/admin/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, slug, content }) });
    setTitle(''); setSlug(''); setContent('');
    mutate();
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Pages</h1>
      <div className="border rounded p-4 space-y-2">
        <input className="border p-2 rounded w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <textarea className="border p-2 rounded w-full" placeholder="HTML content" rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="px-4 py-2 bg-black text-white rounded" onClick={create}>Save</button>
      </div>
      <div className="space-y-2">
        {data?.pages?.map((p: any) => (
          <div key={p.id} className="border rounded p-4">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-gray-500">/{p.slug}</div>
          </div>
        ))}
      </div>
    </main>
  );
}