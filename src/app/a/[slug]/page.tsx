'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentChatPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState<any>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/agents/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setAgent(data.agent);
      }
    })();
  }, [slug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !agent) return;
    setLoading(true);
    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, messages: newMessages, threadId })
    });

    if (!res.ok || !res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = '';
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      assistantText += chunk;
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'assistant', content: assistantText };
        return copy;
      });
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col max-w-3xl mx-auto h-[calc(100vh-2rem)] p-4">
      <div className="border rounded p-4 flex-1 overflow-y-auto">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{agent?.name || 'Loading...'}</h1>
          <p className="text-gray-600 dark:text-gray-300">{agent?.welcomeMessage}</p>
        </div>
        <div className="mt-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
              <div className={`inline-block px-3 py-2 rounded ${m.role === 'user' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800'}`}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black" onClick={send} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </main>
  );
}