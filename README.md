# ✦ PlanMyTravel

An AI-powered travel itinerary generator. Fill a 3-step preferences form and get a personalised day-by-day itinerary streamed in real time, powered by Groq's LLM.

## Tech stack

- **Next.js** (App Router) — React 19, TypeScript
- **Groq SDK** — `llama-3.3-70b-versatile` model
- **Zod** — schema validation
- **SCSS modules** + **Tailwind CSS v4**
- **Vitest** + Testing Library

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com/keys).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run start        # run production server
npm test             # run tests in watch mode
npm test -- --run    # run tests once
npx tsc --noEmit     # typecheck
```

## How it works

```
User fills 3-step form (destination, travelers, preferences)
  → Saved to sessionStorage
    → POST /api/itinerary/generate
      → Groq SDK streams response from llama-3.3-70b-versatile
        → Itinerary rendered word-by-word in the browser
```

## Project structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Home page /
│   ├── plan/new/page.tsx       # Planning form /plan/new
│   ├── itinerary/page.tsx      # Itinerary display /itinerary
│   └── api/itinerary/generate/ # POST API route
├── components/
│   ├── layout/                 # Navbar, Footer
│   ├── landing/                # Hero, FeatureGrid
│   ├── plan/                   # PreferenceForm, StepIndicator, steps
│   └── itinerary/              # ItineraryDisplay, ItineraryLoading
├── lib/
│   ├── groqService.ts          # Groq SDK wrapper (retries, streaming)
│   └── promptBuilder.ts        # Builds the AI prompt
├── types/
│   └── preferences.ts          # Zod schema + TravelPreferences type
└── styles/
    └── _variables.scss         # Design tokens (colors, spacing, typography)
```

## Deployment

Deploy with [Vercel](https://vercel.com). Set `GROQ_API_KEY` in the Vercel project environment variables.
