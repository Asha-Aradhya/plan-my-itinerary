import { travelPreferencesSchema } from '@/types/preferences';
import { streamItinerary, GroqServiceError } from '@/lib/groqService';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
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
    const stream = await streamItinerary(result.data);
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    if (error instanceof GroqServiceError) {
      const status = error.code === 'CONFIG_ERROR' ? 500 : 503;
      return new Response(
        JSON.stringify({ error: error.message }),
        { status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('Unexpected error in itinerary route:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
