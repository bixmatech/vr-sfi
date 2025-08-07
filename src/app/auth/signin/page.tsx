'use client';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/dashboard'
      });
    } catch (err: any) {
      setError('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-black text-white py-2 rounded" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <div className="mt-4">
        <button className="w-full border py-2 rounded" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>Continue with Google</button>
      </div>
      <p className="mt-4 text-sm">Don\'t have an account? <Link className="underline" href="/auth/signup">Sign up</Link></p>
    </main>
  );
}