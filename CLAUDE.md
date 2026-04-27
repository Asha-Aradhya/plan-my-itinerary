@AGENTS.md

# PlanMyTravel — Agent Rules

## Architecture

### Server vs client components
- Default to server components; add `'use client'` only when the component uses `useState`, `useEffect`, or browser APIs
- Never import `groq-sdk` in a client component — it must stay server-side only

### API layer
- All Groq SDK interactions go through `src/lib/groqService.ts` — do not call the SDK directly in route handlers
- Route handlers only parse, validate, and return responses

### Validation
- Use Zod for all validation — schema lives in `src/types/preferences.ts`
- Validate on both client (form steps) and server (API route)

### Imports
- Always use the `@/` path alias — never relative `../` imports

---

## Coding Standards

- Use TypeScript for all components and utilities
- Prefer functional React components
- Use clear and descriptive variable names — never single-letter or abbreviated names like `p`, `v`, `e`, `cb`
- Keep components small and reusable
- Avoid duplicate logic
- Follow consistent folder structure

---

## Styling Rules

- Use SCSS modules for component styles (`*.module.scss`)
- Use Tailwind CSS utility classes where appropriate
- Global design tokens (colors, spacing, typography) live in `src/styles/_variables.scss` — do not hardcode values in component files
- Avoid inline styles unless necessary
- Keep spacing and typography consistent

---

## Component Guidelines

- One component per file
- Use default export only when necessary; prefer named exports for reusable components
- Keep business logic outside UI components when possible
- Always declare all `useState` and `useEffect` calls at the top of the component, before any conditional returns — violating this breaks React's Rules of Hooks and causes runtime crashes

---

## Naming Conventions

- Components: `PascalCase`
- Functions / variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: match the component name exactly

---

## Best Practices

- Write readable and maintainable code
- Prefer composition over duplication
- Do not introduce unnecessary dependencies
- Preserve existing project structure and coding conventions
- Prioritise readability and scalability

---

## What this app intentionally does NOT have
- No global state manager — plain `useState` only

---

## Living Documents — Keep These Up To Date

After every meaningful change to the app, update these two files:

### `docs/DEVELOPMENT.md`
Update when:
- A new service, tool, or provider is added (e.g. NextAuth, a new API, a third-party library)
- A new environment variable is introduced
- The database schema changes (new model, new migration)
- A significant architectural decision is made
- Setup steps change (new install command, new config file)

What to add: what it is, why it was chosen, exact steps followed, relevant links.

### `docs/flow-diagram.html`
Update when:
- A new page or route is added
- A new component is added to an existing page
- The data flow changes (new API call, new storage mechanism)
- A component changes from server to client or vice versa
- New user interactions are added (new buttons, new navigation paths)

Keep the diagrams accurate — an outdated diagram is worse than no diagram.
