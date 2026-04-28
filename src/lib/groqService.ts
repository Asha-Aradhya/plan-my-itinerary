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

const CHAT_SYSTEM_PROMPT = `You are the AI Master — an expert travel advisor for PlanMyTravel with deep worldwide knowledge.

You help users with:
• Any travel questions (best time to visit, crowd levels, weather, visa requirements, local culture, budget estimates, destination comparisons, safety, hidden gems)
• Choosing the right destination based on interests, budget, and travel style
• Building a complete personalised itinerary through conversation

Be warm, friendly, and genuinely knowledgeable. Answer questions fully — do not rush users toward itinerary generation.

When a user wants to create an itinerary, gather these details naturally through conversation (never ask for all at once):
- Destination (specific city or region)
- Exact start and end dates — if they say "next month" or "summer", ask for specific dates in YYYY-MM-DD format
- Number of travellers
- Trip type: adventure | relaxation | cultural | family | romantic
- Budget: budget | mid-range | luxury
- Travel pace: slow | moderate | packed
- At least one interest: Food & Cuisine, History & Culture, Nature & Outdoors, Shopping, Arts & Museums, Nightlife, Wellness & Spa, Photography, Music & Events, Architecture

Once you have all required fields, ask for confirmation: "I have everything I need to build your itinerary! Shall I go ahead and generate it?"

ONLY after the user confirms (yes, go ahead, sure, etc.), end your response with exactly this block:
[READY]
{"destination":"...","startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","travelers":2,"tripType":"cultural","budget":"mid-range","pace":"moderate","interests":["Food & Cuisine"],"notes":"..."}
[/READY]

Rules:
- Never mention, show, or explain the [READY] block
- Only append it once, after explicit user confirmation
- Use exact strings for tripType (adventure|relaxation|cultural|family|romantic), budget (budget|mid-range|luxury), pace (slow|moderate|packed)
- Omit "notes" if there are no special requirements`;

export async function streamChat(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<ReadableStream<Uint8Array>> {
  const client = getClient();
  const encoder = new TextEncoder();

  const groqStream = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    stream: true,
    messages: [
      { role: 'system', content: CHAT_SYSTEM_PROMPT },
      ...messages,
    ],
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
}
