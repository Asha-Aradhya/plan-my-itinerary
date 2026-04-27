import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { travelPreferencesSchema } from '@/types/preferences';
import { z } from 'zod';

const saveItinerarySchema = z.object({
  destination: z.string().min(1),
  content: z.string().min(1),
  preferences: travelPreferencesSchema,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ error: 'You must be signed in to save an itinerary.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = saveItinerarySchema.safeParse(body);
  if (!result.success) {
    return new Response(
      JSON.stringify({ error: result.error.issues[0]?.message ?? 'Invalid input.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const itinerary = await prisma.itinerary.create({
    data: {
      userId: session.user.id,
      destination: result.data.destination,
      content: result.data.content,
      preferences: result.data.preferences,
    },
  });

  return new Response(
    JSON.stringify(itinerary),
    { status: 201, headers: { 'Content-Type': 'application/json' } }
  );
}
