# Have Fun

Have Fun is a neon mobile event discovery app that helps people in Tunisia find a good reason to go outside.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/have-fun run dev` — run the Expo mobile preview
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/have-fun/app/` — Expo Router screens for discovery, event details, notifications, and profile
- `artifacts/have-fun/components/have-fun-ui.tsx` — shared mobile UI primitives and event cards
- `artifacts/have-fun/data/events.ts` — Tunisia demo event catalog and category definitions
- `artifacts/have-fun/context/app-state.tsx` — AsyncStorage-backed interests, categories, and notification preferences
- `artifacts/have-fun/constants/colors.ts` — Have Fun visual tokens

## Architecture decisions

- The first mobile slice is intentionally local-first: event interests and preferences persist with AsyncStorage so the discovery journey works without a backend connection.
- Event data is typed and category-driven so a future API/admin layer can replace the seed catalog without changing the screen components.
- Navigation keeps the app focused on leaving the app: event details expose map, ticket, website, share, and interested actions.
- Email authentication and a secure admin event editor require an auth/database service connection; the current build keeps the account surface honest rather than pretending guest storage is a real account.

## Product

The current mobile build lets users browse Tunisia events by time and category, open immersive event details, save interest locally, open maps or external ticket links, review notification-style prompts, and tune category/frequency preferences.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Use the managed `artifacts/have-fun: expo` workflow for the preview; do not start Expo directly from the shell.
- Keep the visual palette centralized in `constants/colors.ts` and use iconography instead of emojis in the product UI.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
