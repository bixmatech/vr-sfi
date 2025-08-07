import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createChatCompletionStream } from '@/lib/openai';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { addCredits, deductCredits, getUserCredits } from '@/lib/credits';

function getAnonId() {
  const jar = cookies();
  const existing = jar.get('anonId');
  if (existing?.value) return existing.value;
  const id = crypto.randomUUID();
  jar.set('anonId', id, { httpOnly: true, secure: false, path: '/', maxAge: 60 * 60 * 24 * 365 });
  return id;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { slug, messages, threadId } = body as { slug: string; messages: { role: 'user' | 'assistant'; content: string }[]; threadId?: string | null };

    const agent = await prisma.agent.findUnique({ where: { slug } });
    if (!agent || agent.visibility === 'PRIVATE') return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    // Free allowance for anonymous users
    if (!session?.user) {
      const anonId = getAnonId();
      const record = await prisma.anonymousUsage.upsert({
        where: { anonId },
        update: {},
        create: { anonId }
      });
      const allowed = Number(process.env.FREE_ANON_MESSAGES || '0');
      if (record.messages >= allowed) {
        return NextResponse.json({ error: 'Please sign in to continue' }, { status: 401 });
      }
      await prisma.anonymousUsage.update({ where: { anonId }, data: { messages: { increment: 1 } } });
    } else {
      // Check credits
      const credits = await getUserCredits(session.user.id);
      if (credits <= 0) return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
      await deductCredits(session.user.id, 1, `Message to agent ${agent.name}`);
    }

    // Create or use thread
    let thread = null as null | { id: string };
    if (threadId) {
      thread = await prisma.thread.findUnique({ where: { id: threadId }, select: { id: true } });
    }
    if (!thread) {
      thread = await prisma.thread.create({
        data: {
          userId: session?.user?.id || null,
          agentId: agent.id,
          title: null
        },
        select: { id: true }
      });
    }

    // Persist the last user message
    const lastUserMessage = messages[messages.length - 1];
    const createdUserMessage = await prisma.message.create({
      data: { threadId: thread.id, role: 'user', content: lastUserMessage.content, cost: session?.user ? 1 : 0 }
    });

    const systemPrompt = agent.welcomeMessage ? [{ role: 'system' as const, content: agent.welcomeMessage }] : [];
    const toSend = [
      ...systemPrompt,
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const stream = await createChatCompletionStream({ model: agent.model, messages: toSend });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        let assistantText = '';
        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content || '';
          if (content) {
            assistantText += content;
            controller.enqueue(encoder.encode(content));
          }
        }
        await prisma.message.create({ data: { threadId: thread!.id, role: 'assistant', content: assistantText } });
        controller.close();
      }
    });

    const headers = new Headers();
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    headers.set('Cache-Control', 'no-cache');

    return new NextResponse(readable as any, { headers });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}