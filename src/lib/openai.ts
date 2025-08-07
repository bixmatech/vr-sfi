import OpenAI from 'openai';

let openAIClient: OpenAI | null = null;

export function getOpenAI() {
  if (!openAIClient) {
    openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  }
  return openAIClient;
}

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export async function createChatCompletionStream(params: {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
}) {
  const client = getOpenAI();
  const stream = await client.chat.completions.create({
    model: params.model,
    messages: params.messages,
    temperature: params.temperature ?? 0.7,
    stream: true
  });
  return stream;
}