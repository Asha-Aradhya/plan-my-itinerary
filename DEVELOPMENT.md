# PlanMyTravel — Development Notes

A record of every major technical decision, setup step, and the reasoning behind it.

---

## 1. Project Overview

**PlanMyTravel** is an AI-powered travel itinerary generator built with Next.js. Users fill a 3-step preferences form, the data is sent to Groq's LLM, and a personalised day-by-day itinerary is streamed back in real time.

**Core tech stack:**
- Next.js (App Router) + React 19 + TypeScript
- Groq SDK (`llama-3.3-70b-versatile` model)
- Zod (validation)
- SCSS Modules + Tailwind CSS v4
- Vitest + Testing Library

---

## 2. Groq API Setup

**What:** Groq is the AI provider that generates the itineraries.

**Why Groq:** Fast inference speeds, generous free tier, and supports streaming responses out of the box.

**Useful links:**
- [Groq Console (API keys)](https://console.groq.com/keys)
- [Groq supported models](https://console.groq.com/docs/models)
- [Groq Node.js SDK docs](https://console.groq.com/docs/openai)

**Steps followed:**
1. Went to [console.groq.com/keys](https://console.groq.com/keys)
2. Signed up / logged in
3. Clicked **Create API Key**, gave it the name `plan-my-travel`
4. Copied the key immediately (only shown once)
5. Added to `.env.local`:
   ```env
   GROQ_API_KEY=your_key_here
   ```
6. Added the same key to Vercel (Settings → Environment Variables) and GitHub Actions (Settings → Secrets → Actions)

**How it works in the app:**
- `src/lib/promptBuilder.ts` — converts the user's form data into a detailed text prompt
- `src/lib/groqService.ts` — owns the Groq SDK, handles streaming + retries (up to 3 attempts with exponential backoff: 1s, 2s)
- `src/app/api/itinerary/generate/route.ts` — the API route, only responsible for parsing, validating, and returning the response

**Why the service layer:** Separating Groq SDK logic into `groqService.ts` means the route handler stays thin and any future provider swap or retry logic change only touches one file.

---

## 3. Vercel Deployment

**What:** Vercel hosts the production app.

**Why Vercel:** First-class Next.js support (made by the same team), automatic deployments on push to `main`, free tier for personal projects.

**Useful links:**
- [Vercel dashboard](https://vercel.com/dashboard)
- [Vercel environment variables docs](https://vercel.com/docs/projects/environment-variables)
- [Vercel CLI docs](https://vercel.com/docs/cli)

**Steps followed:**
1. Went to [vercel.com](https://vercel.com) and signed in with GitHub
2. Clicked **Add New → Project**
3. Imported the `plan-my-itinerary` GitHub repository
4. Vercel auto-detected it as a Next.js project — no build config changes needed
5. Added environment variables under **Project → Settings → Environment Variables:**
   - `GROQ_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` → set to `https://plan-my-itinerary.vercel.app`
6. Clicked **Deploy** — first deployment ran immediately
7. Every subsequent push to `main` triggers an automatic production deployment

**Production URL:** `https://plan-my-itinerary.vercel.app`

---

## 4. GitHub Actions (CI/CD)

**What:** Automated pipeline that runs on every push or pull request to `main`.

**Why:** Catches type errors, test failures, and broken builds before they reach production.

**Useful links:**
- [GitHub Actions docs](https://docs.github.com/en/actions)
- [Workflow file](/.github/workflows/ci.yml)
- [Repo Actions tab](https://github.com/Asha-Aradhya/plan-my-itinerary/actions)
- [Repo secrets settings](https://github.com/Asha-Aradhya/plan-my-itinerary/settings/secrets/actions)

**Steps followed:**
1. Created `.github/workflows/ci.yml` in the repo
2. Went to **GitHub repo → Settings → Secrets and variables → Actions**
3. Added each secret by clicking **New repository secret:**
   - `GROQ_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `DATABASE_URL`
   - `VERCEL_TOKEN` — generated at [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` — found in Vercel → Team Settings → General
   - `VERCEL_PROJECT_ID` — found in Vercel → Project → Settings → General
4. Verified pipeline was running by going to the **Actions** tab (not Settings → Actions → Runners)

**Pipeline (`.github/workflows/ci.yml`):**
```
Push / PR to main
      ↓
1. Typecheck     → npx tsc --noEmit
2. Run tests     → npm test -- --run
3. Build         → npm run build
      ↓ (only if all 3 pass AND branch is main AND it's a push, not a PR)
4. Deploy        → vercel deploy --prod
```

> **Tip:** Workflow runs appear in the **Actions tab** of your repo, not under Settings. If nothing triggers on push, check **Settings → Actions → General** and ensure "Allow all actions and reusable workflows" is selected.

---

## 5. Google OAuth Setup

**What:** Allows users to sign in with their Google account.

**Why Google OAuth:** Users don't need to create a new account or remember a new password. We never handle passwords — Google does. This is the standard OAuth 2.0 flow.

**Useful links:**
- [Google Cloud Console](https://console.cloud.google.com)
- [Google Auth Platform](https://console.cloud.google.com/auth)
- [OAuth 2.0 overview](https://developers.google.com/identity/protocols/oauth2)

**Steps followed:**
1. Went to [console.cloud.google.com](https://console.cloud.google.com)
2. Clicked the project dropdown (top bar) → **New Project**
   - Project name: `plan-my-travel`
   - Clicked **Create**
3. With the new project selected, navigated to **APIs & Services → Google Auth Platform**
4. Clicked **Get Started** (new Google Auth Platform UI)
5. Filled in the OAuth consent screen:
   - App name: `PlanMyTravel`
   - User support email: own email
   - Audience: **External**
6. Navigated to **Clients → Create Client**
   - Application type: **Web application**
   - Name: `PlanMyTravel Web Client`
7. Under **Authorized JavaScript origins** added (base domains only, no path):
   ```
   http://localhost:3000
   https://plan-my-itinerary.vercel.app
   ```
8. Under **Authorized redirect URIs** added (full callback paths):
   ```
   http://localhost:3000/api/auth/callback/google
   https://plan-my-itinerary.vercel.app/api/auth/callback/google
   ```
9. Clicked **Create** — downloaded the credentials JSON
10. Copied `client_id` and `client_secret` from the JSON
11. Added both to `.env.local`, Vercel, and GitHub Actions secrets

**What each URI means:**
- **JavaScript origins** — the domain your app runs on (where requests come *from*)
- **Redirect URIs** — where Google sends the user *back to* after they approve login. NextAuth handles this route automatically at `/api/auth/callback/google`

> ⚠️ **Security:** Never commit `client_secret` to git or share it publicly. If accidentally exposed, go to Google Cloud Console → Credentials → edit the client → **Regenerate secret** immediately.

---

## 6. Neon Database

**What:** Neon is a serverless PostgreSQL database.

**Why Neon:** Serverless (scales to zero when idle — no cost when not in use), generous free tier (0.5GB), built specifically for Vercel/Next.js deployments, fast cold starts, and EU region availability.

**Why not Supabase:** Supabase bundles auth + DB but adds unnecessary complexity. Since we use NextAuth for auth, we only need the database — Neon is leaner.

**Useful links:**
- [Neon dashboard](https://console.neon.tech)
- [Neon + Prisma guide](https://neon.tech/docs/guides/prisma)
- [Neon connection strings docs](https://neon.tech/docs/connect/connect-from-any-app)

**Steps followed:**
1. Went to [neon.tech](https://neon.tech) and signed in with Google
2. Clicked **New Project**
   - Project name: `plan-my-travel`
   - PostgreSQL version: **17** (latest stable, default)
   - Region: **EU Central (Frankfurt)** — closest to expected users, matches Vercel region
   - **Neon Auth toggle: OFF** — we use NextAuth instead
3. After project was created, on the dashboard main page:
   - Found the **Connection string** section
   - Selected **Prisma** from the framework dropdown
   - Copied the connection string (format: `postgresql://user:password@host/dbname?sslmode=require`)
4. Added as `DATABASE_URL` to:
   - `.env.local` (local development)
   - Vercel environment variables (production)
   - GitHub Actions secrets (CI)

---

## 7. Prisma ORM

**What:** Prisma is a type-safe ORM that sits between the app and the Neon database.

**Why Prisma:**
- Single `schema.prisma` file is the source of truth for the entire database structure
- Type-safe queries — TypeScript catches database errors at compile time
- Migrations are version-controlled alongside the code
- NextAuth has an official Prisma adapter that auto-manages auth tables
- Scales well as the app grows (user profiles, trip sharing, bookmarks, reviews)

**Why not raw SQL:** For a simple app raw SQL would work, but Prisma pays off the moment the schema grows or you need to onboard another developer.

**Useful links:**
- [Prisma docs](https://www.prisma.io/docs)
- [Prisma schema reference](https://www.prisma.io/docs/orm/prisma-schema)
- [Prisma migrate docs](https://www.prisma.io/docs/orm/prisma-migrate)
- [Auth.js Prisma adapter](https://authjs.dev/getting-started/adapters/prisma)

**Steps followed:**
1. Installed Prisma:
   ```bash
   npm install prisma @prisma/client
   npm install --save-dev dotenv
   npx prisma init --datasource-provider postgresql
   ```
2. `npx prisma init` generated two files:
   - `prisma/schema.prisma` — the schema definition file
   - `prisma.config.ts` — Prisma 7 config file (reads `DATABASE_URL` from env)
3. Updated `prisma.config.ts` to read from `.env.local` first (so Prisma CLI picks up local DB URL):
   ```ts
   import { config } from "dotenv";
   config({ path: ".env.local" }); // reads .env.local first
   config();                        // fallback to .env
   ```
4. Wrote the full schema in `prisma/schema.prisma` with two groups of models:

   *NextAuth required models (auto-managed by the Prisma adapter):*
   - `User` — stores user profile (name, email, image)
   - `Account` — links a user to their Google OAuth account
   - `Session` — stores active login sessions
   - `VerificationToken` — used for email verification flows

   *App models:*
   - `Itinerary` — stores saved itineraries, linked to a `User`

5. Ran the initial migration (creates all tables in Neon):
   ```bash
   npx prisma migrate dev --name init
   ```
   This created `prisma/migrations/20260427124920_init/migration.sql`

6. Generated the Prisma client (TypeScript types + query builder):
   ```bash
   npx prisma generate
   ```
   Generated client lives at `src/generated/prisma/`. Main import is from `@/generated/prisma/client` (not `@/generated/prisma` — Prisma 7 does not generate an `index.ts`).

   > **Prisma 7 note:** The generated client requires a driver adapter in the constructor — it no longer reads `DATABASE_URL` directly. For Neon, use `@prisma/adapter-neon`. See `src/lib/prisma.ts`.

**Common Prisma commands:**
```bash
npx prisma migrate dev --name <name>   # create + apply a new migration (dev only)
npx prisma migrate deploy              # apply pending migrations (production/CI)
npx prisma generate                    # regenerate client after schema changes
npx prisma studio                      # open a visual database browser at localhost:5555
npx prisma db pull                     # pull schema from an existing database
```

> **Important:** Any time you change `schema.prisma`, run `prisma migrate dev` locally then `prisma generate`. Both must be run — migrate updates the database, generate updates the TypeScript client.

---

## 8. NextAuth (Auth.js)

**What:** NextAuth handles the full Google OAuth flow and session management inside Next.js.

**Why NextAuth:**
- De-facto standard auth library for Next.js (v4, stable)
- Built-in Google provider — handles the entire OAuth redirect flow
- Official Prisma adapter auto-creates and manages the `User`, `Account`, `Session` tables
- Open source, no vendor lock-in

**Useful links:**
- [NextAuth v4 docs](https://next-auth.js.org/getting-started/introduction)
- [NextAuth Google provider](https://next-auth.js.org/providers/google)
- [Auth.js Prisma adapter](https://authjs.dev/getting-started/adapters/prisma)
- [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver)
- [Prisma adapter-neon](https://www.npmjs.com/package/@prisma/adapter-neon)

**Steps followed:**

1. Installed packages:
   ```bash
   npm install next-auth @auth/prisma-adapter
   npm install @neondatabase/serverless @prisma/adapter-neon
   ```
   > **Note:** `@neondatabase/serverless` + `@prisma/adapter-neon` are required because Prisma 7 no longer accepts a direct connection URL in the client constructor — it requires a driver adapter.

2. Generated `NEXTAUTH_SECRET` (random string used to sign and encrypt sessions):
   ```bash
   openssl rand -base64 32
   ```
   Added the output to:
   - `.env.local` as `NEXTAUTH_SECRET=<value>`
   - Vercel → Settings → Environment Variables
   - GitHub Actions → Settings → Secrets → Actions

3. Created `src/lib/prisma.ts` — Prisma client singleton using the Neon driver adapter:
   ```ts
   import { PrismaNeon } from '@prisma/adapter-neon';
   import { PrismaClient } from '@/generated/prisma/client';

   function createPrismaClient() {
     const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
     return new PrismaClient({ adapter });
   }
   // Singleton pattern prevents too many connections in dev (hot reload creates new instances)
   export const prisma = globalForPrisma.prisma ?? createPrismaClient();
   ```

4. Created `src/lib/auth.ts` — NextAuth config:
   ```ts
   export const authOptions: NextAuthOptions = {
     adapter: PrismaAdapter(prisma),
     providers: [GoogleProvider({ clientId, clientSecret })],
     session: { strategy: 'database' },
     callbacks: {
       session({ session, user }) {
         session.user.id = user.id; // expose user.id on the session
         return session;
       },
     },
   };
   ```
   - `strategy: 'database'` — sessions stored in the `Session` table in Neon (not JWT cookies)
   - The `session` callback adds `user.id` to the session object so API routes can identify the logged-in user

5. Created `src/app/api/auth/[...nextauth]/route.ts` — the catch-all route NextAuth uses:
   ```ts
   const handler = NextAuth(authOptions);
   export { handler as GET, handler as POST };
   ```
   This single file handles all NextAuth endpoints:
   - `GET /api/auth/signin` — sign in page
   - `GET /api/auth/callback/google` — Google OAuth callback
   - `GET /api/auth/signout` — sign out
   - `GET /api/auth/session` — returns current session

6. Created `src/types/next-auth.d.ts` — extends NextAuth's session type to include `user.id`:
   ```ts
   declare module 'next-auth' {
     interface Session {
       user: { id: string; name?: string | null; email?: string | null; image?: string | null; };
     }
   }
   ```

**Still to implement:**
- Add sign in / sign out buttons to the Navbar
- Add a "My Itineraries" page to view saved trips

---

## 9. Save Itinerary Feature

**What:** Logged-in users can save a generated itinerary to the database. Unauthenticated users see a sign-in modal when they attempt to save.

**Why deferred auth (modal instead of forced login upfront):** Users get value first — they generate an itinerary before being asked to log in. By the time the sign-in prompt appears, they already have something worth saving, so the motivation is high. This is the same pattern used by Canva, Notion, and most modern AI tools.

**Files created:**

- `src/components/layout/AuthSessionProvider/AuthSessionProvider.tsx` — thin `'use client'` wrapper around NextAuth's `SessionProvider`. Required because `layout.tsx` is a server component and cannot use hooks directly. Wraps the entire app so any client component can call `useSession()`.

- `src/components/auth/SignInModal/SignInModal.tsx` — modal overlay shown when an unauthenticated user clicks "Save Itinerary". Contains a "Continue with Google" button that calls `signIn('google')`. Closes on overlay click or ✕ button.

- `src/app/api/itineraries/route.ts` — `POST /api/itineraries`. Checks session with `getServerSession()`, validates body with Zod, saves to Neon via Prisma. Returns `201` with the saved record or `401` if unauthenticated.

**Files updated:**

- `src/app/layout.tsx` — wrapped `<body>` children with `<AuthSessionProvider>`
- `src/components/itinerary/ItineraryDisplay/ItineraryDisplay.tsx` — added `useSession()`, `saveStatus` state, `handleSave()` function, save button, and `<SignInModal>`

**Save flow:**
```
Click "✦ Save Itinerary"
        ↓
session exists? ── No ──→ show SignInModal → "Continue with Google" → Google OAuth → return
        │
       Yes
        ↓
POST /api/itineraries  { destination, content, preferences }
        ↓
getServerSession() checks auth → Zod validates body → prisma.itinerary.create()
        ↓
Button shows "✓ Saved"
```

**Save button states:** `idle` → `saving` → `saved` / `error`

---

## 10. Environment Variables Reference

| Variable | Used by | Where to get it |
|----------|---------|-----------------|
| `GROQ_API_KEY` | Groq SDK | [console.groq.com/keys](https://console.groq.com/keys) |
| `GOOGLE_CLIENT_ID` | NextAuth Google provider | [Google Cloud Console → Credentials](https://console.cloud.google.com/auth/clients) |
| `GOOGLE_CLIENT_SECRET` | NextAuth Google provider | [Google Cloud Console → Credentials](https://console.cloud.google.com/auth/clients) |
| `DATABASE_URL` | Prisma / Neon | [Neon dashboard](https://console.neon.tech) → Connection string → Prisma format |
| `NEXTAUTH_SECRET` | NextAuth session signing | Run `openssl rand -base64 32` in terminal |
| `NEXTAUTH_URL` | NextAuth redirects | `http://localhost:3000` (dev) / `https://plan-my-itinerary.vercel.app` (prod) |
| `VERCEL_TOKEN` | GitHub Actions deploy | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | GitHub Actions deploy | [Vercel → Team Settings → General](https://vercel.com/teams) |
| `VERCEL_PROJECT_ID` | GitHub Actions deploy | Vercel → Project → Settings → General |

**Where each variable must be added:**

| Variable | `.env.local` | Vercel Dashboard | GitHub Actions Secrets |
|----------|:---:|:---:|:---:|
| `GROQ_API_KEY` | ✅ | ✅ | ✅ |
| `GOOGLE_CLIENT_ID` | ✅ | ✅ | ✅ |
| `GOOGLE_CLIENT_SECRET` | ✅ | ✅ | ✅ |
| `DATABASE_URL` | ✅ | ✅ | ✅ |
| `NEXTAUTH_SECRET` | ✅ | ✅ | ✅ |
| `NEXTAUTH_URL` | ✅ (localhost) | ✅ (prod URL) | ❌ |
| `VERCEL_TOKEN` | ❌ | ❌ | ✅ |
| `VERCEL_ORG_ID` | ❌ | ❌ | ✅ |
| `VERCEL_PROJECT_ID` | ❌ | ❌ | ✅ |

---

## 11. Accessibility

**What:** A full accessibility (a11y) pass to make the app usable by keyboard-only users, screen reader users, and people with motion sensitivity.

**Standard followed:** WCAG 2.1 AA.

| Area | What was done |
|---|---|
| **Skip link** | `layout.tsx` — "Skip to main content" link before the Navbar; slides in on keyboard focus using `transform` (not negative position values) |
| **Focus ring** | `globals.scss` — `:focus-visible` gold outline on all interactive elements; consistent and brand-matched |
| **Reduced motion** | `globals.scss` — `@media (prefers-reduced-motion: reduce)` disables all animations globally; cursor blink also overridden in its module |
| **Screen-reader utility** | `globals.scss` — `.sr-only` class for visually hidden but announced text |
| **Navbar** | `aria-label="Main navigation"` on `<nav>`; loading skeleton is `aria-hidden` |
| **SignInModal** | `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; focus auto-moves to first element on open; Tab/Shift-Tab trapped inside the modal; Escape key closes it |
| **Form errors** | `role="alert"` on validation error paragraph — screen readers announce it immediately |
| **Counter buttons** | `aria-label="Decrease/Increase number of travellers"` on the − / + buttons; `<output aria-live="polite">` announces the updated count |
| **Card & chip groups** | `role="group"` + `aria-labelledby` on all budget, pace, trip-type, and interest grids |
| **Toggle buttons** | `aria-pressed` on all select-card and chip toggle buttons so selected state is communicated |
| **Decorative content** | `aria-hidden="true"` on emoji icons, ✦ symbols, and the blinking cursor |
| **StepIndicator** | Changed wrapper to `<nav aria-label="Form progress">`; `aria-current="step"` on active step; `.sr-only` text announces completed/current/upcoming state |
| **Loading screen** | `role="status"` + `aria-live="polite"` — screen reader announces when generation starts |
| **Streaming content** | `aria-live="polite"` on the itinerary content div — changes announced as text streams in |

---

## 12. Local Development Setup (for a new developer)

```bash
# 1. Clone the repo
git clone https://github.com/Asha-Aradhya/plan-my-itinerary.git
cd plan-my-itinerary

# 2. Install dependencies
npm install

# 3. Create .env.local and fill in all variables (see section 9 above)
# Minimum required to run locally:
# GROQ_API_KEY, DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# 4. Generate Prisma client
npx prisma generate

# 5. Apply migrations (first time only, or after schema changes)
npx prisma migrate dev

# 6. Start the dev server
npm run dev
# → http://localhost:3000
```
