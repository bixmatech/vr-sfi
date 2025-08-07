import { NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai';

export async function POST(req: Request) {
  const { prompt, size } = await req.json();
  const openai = getOpenAI();
  const result = await openai.images.generate({ model: 'gpt-image-1', prompt, size: size || '1024x1024' });
  const url = (result.data?.[0] as any)?.url;
  return NextResponse.json({ url });
}