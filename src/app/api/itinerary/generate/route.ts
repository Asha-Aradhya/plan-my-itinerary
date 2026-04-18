import Anthropic from '@anthropic-ai/sdk';
import { travelPreferencesSchema } from '@/types/preferences';
import { buildItineraryPrompt } from '@/lib/promptBuilder';

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = travelPreferencesSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error.issues[0]?.message ?? 'Invalid input' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const prompt = buildItineraryPrompt(result.data);

    const stream = await client.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
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
