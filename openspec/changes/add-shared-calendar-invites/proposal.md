## Why

2LDC Calendar currently has no code — only the methodology (`PRD.md`) and technical
decisions (`ARCHITECTURE.md`) that describe the target app: a small team logs in,
sees a shared calendar of events, and responds to each event with a presence status
(yes / no / maybe / no response). This change builds that first working slice so the
team can start using a real shared calendar instead of ad-hoc coordination.

## What Changes

- Scaffold the SvelteKit + TypeScript project on the stack fixed in `ARCHITECTURE.md`
  (Drizzle ORM over Turso/libSQL, better-auth, Tailwind CSS + shadcn-svelte, pnpm),
  since no source tree exists yet.
- Add email + password authentication with two roles (`standard`, `admin`), a cookie
  session, and a one-shot script to bootstrap the first admin account.
- Add role-based route protection in `hooks.server.ts` so `/admin/**` is rejected
  server-side for non-admins, not just hidden in the UI.
- Add a shared event calendar: admins create/edit/delete events (name, date, time
  range, location, description); every authenticated user sees the same events —
  there is no per-event invitee list, the whole team is implicitly invited to
  everything.
- Add per-user presence responses on each event, with the four-state model from the
  PRD (`oui` / `non` / `indécis` / pas de réponse), optimistic UI updates on the
  response action, and a read-only attendance overview (users × events) reused as an
  editable matrix in the admin view.
- Add the base design system (button, card, status badge with centralized color
  tokens for the four presence states) and the two navigation shells (bottom nav for
  standard/mobile use, top nav for the desktop-oriented admin area).

## Capabilities

### New Capabilities
- `user-auth`: email/password login, cookie session, `standard`/`admin` roles, admin
  bootstrap script, server-side role-gated routing.
- `event-calendar`: admin-managed events on a single shared calendar, visible read-only
  to every authenticated user.
- `event-attendance`: per-user presence response per event (yes/no/maybe/no response),
  optimistic response UI, and the users × events attendance overview (read-only for
  standard users, editable by admins).

### Modified Capabilities
- None — this is the first change in the project; no existing specs to modify.

## Impact

- New source tree under `src/` (SvelteKit routes, `src/lib/server/db/schema.ts`,
  `src/hooks.server.ts`, `src/lib/server/email.ts` stub) plus `drizzle-kit` config —
  none of this exists today.
- New local dev dependency: a local SQLite file via `@libsql/client`, no Turso account
  required for development.
- No production accounts (Turso, Resend, Vercel) are created by this change — env vars
  are wired to `.env.example` and left blank until the project owner provisions them,
  per PRD phase 10.
- No breaking changes: nothing currently depends on this codebase.
