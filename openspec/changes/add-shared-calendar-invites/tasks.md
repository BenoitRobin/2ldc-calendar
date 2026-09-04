## 1. Project scaffolding

- [x] 1.1 Generate the SvelteKit + TypeScript skeleton with pnpm and `@sveltejs/adapter-vercel`; verify `pnpm dev` serves the default page
- [x] 1.2 Install and configure Tailwind CSS and shadcn-svelte; verify a shadcn-svelte component renders styled on the default page
- [x] 1.3 Add `@libsql/client` and Drizzle ORM, pointing dev config at a local SQLite file; verify `drizzle-kit` can connect and generate an (empty) migration
- [x] 1.4 Copy `.env.example` keys into a local `.env` with dev-safe values (local db path, a generated `BETTER_AUTH_SECRET`); verify the app boots with them loaded

## 2. Data model

- [x] 2.1 Install better-auth and its Drizzle adapter; generate the `user`/`session`/`account` tables and extend `user` with a `role` column (`'standard' | 'admin'`, default `'standard'`) in `src/lib/server/db/schema.ts`
- [x] 2.2 Add `event` table (name, date, startTime, endTime, location, description, createdBy, timestamps) to the schema
- [x] 2.3 Add `attendance_response` table (eventId FK with cascade delete, userId FK, status enum `'oui' | 'non' | 'indecis'`, unique on (eventId, userId), timestamps) to the schema
- [x] 2.4 Run `drizzle-kit generate` + apply against the local dev database; verify all tables exist via a local db inspection command

## 3. Authentication and role-based routing

- [x] 3.1 Wire better-auth's SvelteKit adapter with email/password provider; implement login and logout pages/actions per `specs/user-auth/spec.md`
- [x] 3.2 Implement `src/hooks.server.ts` to resolve the session into `locals.user` and reject any `/admin/**` request from a non-admin before route `load`/actions run; verify with a request to an admin route while logged out (redirected to `/login`) and while logged in as `standard` (rejected)
- [x] 3.3 Write the one-shot admin bootstrap script (creates an `admin`-role account by email, produces a way for that person to set their own password, refuses to run if an admin already exists); verify by running it once against the local dev database
- [x] 3.4 Build the `/admin/team` "add a team member" form (email + role) reusing the bootstrap script's account-creation + password-setup logic; verify creating a duplicate email is rejected with a clear error
- [x] 3.5 Manually test the full auth journey with a throwaway account: login, role-based redirect, logout, denied access without a session — then delete the throwaway account

## 4. Design system and navigation shells

- [x] 4.1 Build the base reusable components (button, card, `StatusBadge`) and the four `--status-*` color tokens in the Tailwind theme layer; verify no page hard-codes a status color outside the token definitions
- [x] 4.2 Build the bottom-nav shell for standard/mobile routes and the top-nav shell for `/admin/**` routes
- [x] 4.3 Check the status badge color/text combinations against WCAG AA contrast and adjust tokens until they pass, per `specs/event-attendance/spec.md`

## 5. Shared event calendar

- [x] 5.1 Implement `/admin/events`, `/admin/events/new`, `/admin/events/[eventId]/edit` (create/edit forms with required-field validation) per `specs/event-calendar/spec.md`
- [x] 5.2 Implement admin event deletion with an explicit confirmation step and cascade removal of its attendance responses; verify canceling the confirmation leaves the event unchanged
- [x] 5.3 Enforce admin-only writes for event actions at the server-action level (not just hidden UI) and add a check/test that a direct `standard`-role request is rejected
- [x] 5.4 Implement `/calendar` (or `/`) as the shared read-only view for every authenticated role, and `/calendar/[eventId]` for event detail; verify a `standard` account sees every event an admin created

## 6. Presence responses and attendance overview

- [x] 6.1 Implement the presence-response form action on the event detail page (set/change own status among `oui`/`non`/`indecis`), enforcing "no row = no response yet" per `specs/event-attendance/spec.md`
- [x] 6.2 Add optimistic UI update on response selection with rollback on action failure; verify by forcing a failed submission and observing the status revert
- [x] 6.3 Build the `/overview` users-by-events matrix as a single component with an `editable` prop: read-only rendering for `standard` users, editable cells for admins that call the same response action on another user's behalf
- [x] 6.4 Enforce server-side that only an admin can write another user's response, and any user can write their own; verify a `standard` account's attempt to edit someone else's cell is rejected

## 7. Quality pass

- [x] 7.1 Walk the full journey (login → view calendar → respond to an event → view overview) on a real narrow mobile viewport, not a resized desktop window; fix any layout issue found
- [x] 7.2 Check tap-target sizes on mobile for the response controls and nav
- [x] 7.3 Exercise edge cases: event with no responses yet, very long event name/description/location across every view (calendar card, detail, admin list, overview table); fix issues found immediately. (Admin self-lockout prevention is not applicable — this change has no admin account deletion/demotion UI, per design.md's non-goals.)
- [x] 7.4 Run typecheck and linting; fix all reported errors

## 8. Deployment readiness

- [x] 8.1 Verify `.env.example` lists every env var the app now reads (Turso, better-auth, Resend) with no values committed
- [x] 8.2 Document (in the PR/change notes, not committed secrets) the one-time steps the project owner must run themselves: create the Turso database, create the Resend account/domain, set env vars in Vercel
- [x] 8.3 Confirm `pnpm build` succeeds locally before handing off for the owner's first deploy
