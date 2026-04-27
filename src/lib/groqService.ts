import Groq from 'groq-sdk';
import { buildItineraryPrompt } from '@/lib/promptBuilder';
import type { TravelPreferences } from '@/types/preferences';

const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 4096;
const MAX_RETRIES = 3;

export class GroqServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'CONFIG_ERROR' | 'GENERATION_ERROR'
  ) {
    super(message);
    this.name = 'GroqServiceError';
  }
}

function getClient(): Groq {
  if (!process.env.GROQ_API_KEY) {
    throw new GroqServiceError('GROQ_API_KEY is not configured.', 'CONFIG_ERROR');
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export async function streamItinerary(prefs: TravelPreferences): Promise<ReadableStream<Uint8Array>> {
  const client = getClient();
  const prompt = buildItineraryPrompt(prefs);
  const encoder = new TextEncoder();

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const groqStream = await client.chat.completions.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        stream: true,
        messages: [{ role: 'user', content: prompt }],
      });

      return new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of groqStream) {
              const text = chunk.choices[0]?.delta?.content ?? '';
              if (text) controller.enqueue(encoder.encode(text));
            }
          } finally {
            controller.close();
          }
        },
      });
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        // exponential backoff: 1s, 2s
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  console.error('Groq stream failed after retries:', lastError);
  throw new GroqServiceError('Failed to generate itinerary. Please try again.', 'GENERATION_ERROR');
}
