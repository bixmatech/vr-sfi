export async function GET() {
  const res = await fetch(`${process.env.APP_URL || 'http://localhost:3000'}/api/sitemap`, { cache: 'no-store' });
  const body = await res.text();
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}