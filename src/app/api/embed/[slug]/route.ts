import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const agent = await prisma.agent.findUnique({ where: { slug: params.slug } });
  if (!agent || agent.visibility === 'PRIVATE') return new Response('Not found', { status: 404 });
  const base = process.env.APP_URL || 'http://localhost:3000';
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body,iframe{margin:0;padding:0;height:100%;width:100%;border:0}</style></head><body><iframe src="${base}/a/${agent.slug}?embed=1" allow="clipboard-write *; clipboard-read *;"/></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}