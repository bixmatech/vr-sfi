import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <header className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-bold">AI Agents SaaS</h1>
        <nav className="space-x-4">
          <Link href="/agents" className="hover:underline">Agents</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <Link href="/auth/signin" className="hover:underline">Sign in</Link>
        </nav>
      </header>
      <section className="mt-16 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Build, share, and monetize AI chatbots
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Create custom AI agents with prompts, chat with them, and sell credits.
        </p>
        <div className="mt-8 space-x-4">
          <Link href="/agents" className="px-5 py-2 rounded bg-black text-white dark:bg-white dark:text-black">Explore Agents</Link>
          <Link href="/dashboard" className="px-5 py-2 rounded border">Go to Dashboard</Link>
        </div>
      </section>
    </main>
  );
}