import type { TravelPreferences } from '@/types/preferences';

export function buildItineraryPrompt(prefs: TravelPreferences): string {
  const start = new Date(prefs.startDate);
  const end   = new Date(prefs.endDate);
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const days   = nights + 1;

  const formattedStart = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedEnd   = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const tripTypeDescriptions: Record<TravelPreferences['tripType'], string> = {
    adventure:   'adventure-focused with active pursuits and off-the-beaten-path experiences',
    relaxation:  'relaxed and rejuvenating with a leisurely pace and restful activities',
    cultural:    'culturally immersive with a focus on history, art, local traditions and cuisine',
    family:      'family-friendly with activities suitable for all ages',
    romantic:    'romantic and intimate with special experiences for couples',
  };

  const budgetDescriptions: Record<TravelPreferences['budget'], string> = {
    budget:     'budget-conscious (hostels, street food, public transport, free attractions)',
    'mid-range': 'mid-range (comfortable 3–4 star hotels, good local restaurants, mix of transport)',
    luxury:     'luxury (5-star hotels, fine dining, private transfers, exclusive experiences)',
  };

  const paceDescriptions: Record<TravelPreferences['pace'], string> = {
    slow:     'leisurely (2–3 activities per day, plenty of free time and spontaneous exploration)',
    moderate: 'moderate (4–5 activities per day, balanced between sightseeing and downtime)',
    packed:   'packed (6+ activities per day, maximising every hour)',
  };

  const cleanInterests = prefs.interests.map(i => i.replace(/^[\p{Emoji}\s]+/u, '').trim()).join(', ');

  return `You are a world-class luxury travel concierge with deep expertise in crafting bespoke travel itineraries. Create a detailed, inspiring and practical day-by-day itinerary for the following trip.

**TRIP DETAILS**
- Destination: ${prefs.destination}
- Dates: ${formattedStart} to ${formattedEnd} (${days} days, ${nights} nights)
- Travellers: ${prefs.travelers} ${prefs.travelers === 1 ? 'person' : 'people'}
- Trip style: ${tripTypeDescriptions[prefs.tripType]}
- Budget level: ${budgetDescriptions[prefs.budget]}
- Travel pace: ${paceDescriptions[prefs.pace]}
- Key interests: ${cleanInterests}
${prefs.notes ? `- Special notes: ${prefs.notes}` : ''}

**INSTRUCTIONS**
Create a day-by-day itinerary with exactly ${days} days. For each day:
- Start with a captivating day title (e.g. "Day 1 — Arrival & First Impressions")
- Divide into Morning, Afternoon, and Evening sections
- For each section include: specific places/restaurants/activities with brief descriptions of why they're special
- Add 1–2 practical tips per day (best time to visit, booking advice, local tips)
- Suggest accommodation type that fits the budget for the first and last nights

After the itinerary, add a brief **Travel Essentials** section with:
- Best way to get around
- 3–4 must-try local dishes or drinks
- 1–2 cultural etiquette tips
- Best time of year consideration

Write in an inspiring, warm, and knowledgeable tone — like advice from a well-travelled friend. Be specific with real place names. Format clearly using the structure above.`;
}
