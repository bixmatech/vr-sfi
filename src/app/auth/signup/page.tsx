'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (res.ok) {
      window.location.href = '/auth/signin';
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to sign up');
    }
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-black text-white py-2 rounded" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link className="underline" href="/auth/signin">Sign in</Link></p>
    </main>
  );
}