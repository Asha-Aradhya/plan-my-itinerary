import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { destination } = await request.json();

  if (!destination?.trim()) {
    return NextResponse.json({ valid: false });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PlanMyTravel/1.0',
        'Accept-Language': 'en',
      },
    });

    const results = await response.json();
    return NextResponse.json({ valid: Array.isArray(results) && results.length > 0 });
  } catch {
    // If Nominatim is unreachable, allow the user to proceed rather than blocking them
    return NextResponse.json({ valid: true });
  }
}
