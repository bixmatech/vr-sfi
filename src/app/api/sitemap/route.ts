export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

export async function GET() {
  const base = process.env.APP_URL || 'http://localhost:3000';
  const agents = await prisma.agent.findMany({ where: { visibility: 'PUBLIC' } });
  const posts = await prisma.blogPost.findMany({ where: { published: true } });
  const pages = await prisma.page.findMany();

  const urls = [
    `${base}/`,
    `${base}/agents`,
    ...agents.map((a) => `${base}/a/${a.slug}`),
    `${base}/blog`,
    ...posts.map((p) => `${base}/blog/${p.slug}`),
    ...pages.map((p) => `${base}/p/${p.slug}`)
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((u) => `\n  <url><loc>${u}</loc></url>`) 
    .join('')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}