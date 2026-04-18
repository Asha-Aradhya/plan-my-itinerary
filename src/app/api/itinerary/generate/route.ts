import Groq from 'groq-sdk';
import { travelPreferencesSchema } from '@/types/preferences';
import { buildItineraryPrompt } from '@/lib/promptBuilder';

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY is not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = travelPreferencesSchema.safeParse(body);
  if (!result.success) {
    return new Response(
      JSON.stringify({ error: result.error.issues[0]?.message ?? 'Invalid input' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = buildItineraryPrompt(result.data);

    const stream = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4096,
      stream: true,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? '';
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    console.error('Itinerary generation error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate itinerary. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
