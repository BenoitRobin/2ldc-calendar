# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Musicians (fanfarons):** members of the 2LDC fanfare (brass band), roughly 15–30 people. Each member plays exactly one instrument (batterie, saxophone, trompette, sousaphone, tuba, trombone). They use the app mostly on their phone, often in passing, to check what's coming up and answer oui / non / indécis for each rehearsal or gig.
- **Admins:** a few members who run the band's organization. They create, edit, and delete events, manage member accounts (including setting passwords themselves), and correct attendance by hand. They work mostly on desktop, occasionally.

## Product Purpose

2LDC Calendar is the band's shared calendar and attendance tool, growing into its all-in-one hub. Both jobs carry equal weight:

1. **Know who's coming.** For every rehearsal and gig, organizers can see who answered and whether each instrument section is covered, early enough to plan.
2. **One place for the band's practical needs.** Calendar, attendance, expenses (frais), and sheet music (partitions) live together, so members stop juggling group chats, Google Forms, and shared drives.

Success means members actually answer, so the attendance overview reflects reality and organizers stop chasing people one by one.

## Positioning

A private tool built for one specific fanfare, not a generic scheduling product: everyone is implicitly invited to every event, the roster is organized by instrument, and the four-state presence model (oui / non / indécis / pas de réponse) is the core of the app.

## Operating Context

- Members open it on their phone between other things: glance at the next events, tap an answer, leave.
- Admins use the desktop admin area (`/admin`) for event and team management and the editable attendance matrix.
- Expense reimbursements currently go through an external Google Form (link-out from the Frais page, because the form needs a Google login for photo uploads of receipts).
- Login uses the member's **prénom** and a password; email is stored but never typed by members. No self-signup and no email password reset: an admin creates each account and hands over the password.

## Capabilities and Constraints

**Shipped:**
- Shared event calendar (name, date, start/end time, location, description); past events hidden from the overview.
- Per-member presence response with optimistic UI; "pas de réponse" is the absence of a response, never a stored value.
- Attendance overview matrix (members × events), read-only for members and editable for admins; admins can override any member's response.
- Admin CRUD for events and team members, with self-lockout protection (an admin can't delete their own account or drop the last admin role).
- Frais page (link to the Google Form) and Partition page (placeholder, "en construction").

**Planned (committed direction, not yet built):**
- Sheet music library on the Partition page.
- Notifications (reminders for new events or missing responses).
- Native in-app expense form to replace the Google Form.

**Constraints:**
- SvelteKit + Drizzle/libSQL (Turso) + better-auth, hosted on Vercel Hobby; target hosting cost is €0/month.
- UI copy is French. Status values and terms stay in French: oui, non, indécis, pas de réponse, répétition, concert, frais, partition, fanfaron.
- Fixed instrument list in `src/lib/instruments.ts`; one instrument per member.

## Brand Commitments

- Name: **2LDC** (app title "2LDC Calendar").
- Existing assets: white 2LDC logo (`src/lib/assets/logo-2ldc-white.png`), brass-band drummer favicon (`src/lib/assets/favicon.svg`), per-instrument icons (`src/lib/assets/instruments/*.svg`).
- Voice: plain, friendly French for bandmates; short labels over explanations.

## Evidence on Hand

- Demo dataset via `pnpm seed:demo` (fictional musicians and events) for local exploration.
- No real member photos, gig photos, testimonials, or public-facing content exist. Don't invent any.

## Product Principles

1. **Answering takes one tap.** Any change that adds friction to giving a presence response works against the app's main job.
2. **Phone first for members, desktop is fine for admins.** Member screens are designed for a narrow phone held in one hand; admin screens can assume a desktop.
3. **Show coverage, not just counts.** Attendance is read through instruments: a gig with no sousaphone is a different problem from one with three trumpets missing.
4. **Keep the band's tools under one roof.** New features should bring practical band needs (scores, expenses, reminders) into the app rather than linking further out, when it's feasible at zero cost.
5. **The server enforces roles.** Hiding a control is never the only protection for an admin action.

## Accessibility & Inclusion

No product-specific requirement established yet. Working baseline from the project's methodology: measured text and status-color contrast (not eyeballed) and comfortable touch-target sizes on mobile.
