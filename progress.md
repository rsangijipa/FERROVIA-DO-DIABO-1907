Original prompt: PLEASE IMPLEMENT THIS PLAN:

- Started implementation pass for production stabilization.
- Confirmed local Next 16 docs for layout, server/client boundaries, error handling, not-found, and metadata.
- Confirmed current root layout is client-heavy via AppShell import in `src/app/layout.tsx`.
- Confirmed current mobile issue from prior audit and current shell structure likely causing overflow.
- Confirmed settings toggles exist in state/UI but are only partially applied.
- Next chunk: expand shared types/store for onboarding + richer restoration decisions, then refactor app shell into server layout + client island.

Implemented:

- Split `AppShell` into a server wrapper plus `AppShellClient` island for navigation, progress UI, preference bridging and ambient client-only behavior.
- Reworked mobile shell/header into a compact menu-driven layout and verified `390x844` without horizontal overflow.
- Added first-session guided onboarding with persisted tutorial state, progress tracking and next-step CTA on the hub.
- Expanded restoration data/state model to support 5 decision stages per module and immediate feedback after every decision.
- Rebuilt `Restauração 2026` module content so each module has diagnosis, prioritization, contracting, restoration and validation tasks.
- Added restoration feedback summary panel with resource delta, next stage and timeline note.
- Applied `highContrast` and `reducedMotion` at the root level and hid the unfinished audio toggle from the config UI.
- Added production readiness files: `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, plus baseline security headers in `next.config.ts`.
- Added asset inventory doc in `docs/asset-inventory.md` and enabled AVIF/WebP output formats in Next image config.

Validation:

- `npm run lint` ✅
- `npm run build` ✅
- Browser validation on `http://localhost:3000/` confirmed:
  - no horizontal overflow at `390x844`
  - tutorial CTA advances after a restoration decision
  - restoration decision updates state, resource bars and immediate feedback summary
