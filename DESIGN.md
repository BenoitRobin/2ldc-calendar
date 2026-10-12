---
name: 2LDC Calendar
description: Shared calendar and attendance for the 2LDC fanfare, printed like a gig poster.
colors:
  poster-black: "#030304"
  cream-ink: "#f6f3ea"
  stage-board: "#1a1815"
  stage-board-raised: "#262420"
  faded-ink: "#a39b8b"
  rivet-grey: "#655f4e"
  tarnished-brass: "#8c6215"
  white: "#ffffff"
  bottle-green: "#3f6b4a"
  oxblood: "#9b3a3a"
  warning-coral: "#d6635f"
  pitch-black-ink: "#0e0e0e"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.333
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.375
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.375
  date-numeral:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1
  wordmark:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 900
    lineHeight: 1.556
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.429
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.333
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  header-gap: "80px"
components:
  button-primary:
    backgroundColor: "{colors.cream-ink}"
    textColor: "{colors.pitch-black-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "44px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.cream-ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.tarnished-brass}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "{colors.stage-board-raised}"
    textColor: "{colors.cream-ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "44px"
  button-destructive:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "44px"
  ticket-card:
    backgroundColor: "{colors.stage-board}"
    textColor: "{colors.cream-ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  status-badge-oui:
    backgroundColor: "{colors.bottle-green}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  status-badge-non:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  status-badge-indecis:
    backgroundColor: "{colors.tarnished-brass}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  status-badge-none:
    backgroundColor: "{colors.stage-board-raised}"
    textColor: "{colors.faded-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  input-text:
    backgroundColor: "transparent"
    textColor: "{colors.cream-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "44px"
  top-nav:
    backgroundColor: "{colors.stage-board}"
    textColor: "{colors.faded-ink}"
    typography: "{typography.body}"
    padding: "12px 16px"
---

# Design System: 2LDC Calendar

## Overview

**Creative North Star: "The Gig Poster"**

2LDC Calendar looks like the flyer stapled outside a bar on gig night: black poster stock, cream ink, and one brass highlight. The page background is the exact black of the 2LDC logo's own plate, so the logo and the app read as one continuous printed sheet. Everything on top of it is set in a single heavy grotesque (Archivo) and laid down flat, as if stamped rather than floating.

The system is dense and practical, because members open it on a phone between other things to check a date and tap an answer. Personality comes from the type weight, the poster palette and the ticket-stub card, not from decoration. Color is mostly reserved for meaning: the brass marks dates and the current position, and the four presence colors say oui, non, indécis or no answer. Nothing else competes with them.

Surfaces are dark-only. There is no light theme, and no screen should introduce one piecemeal.

**Key Characteristics:**
- Black poster stock (logo-matched) with cream ink, never pure white text on pure black.
- One typeface, Archivo, carried by weight: 800–900 for anything that names a thing, 400–600 for everything else.
- Tarnished brass as the single accent, used sparingly.
- Ticket-stub cards: brass date numeral on the left, dashed tear line before actions.
- Flat surfaces separated by tone and hairline borders, not shadows.
- Presence status is always color plus a word, from four dedicated tokens.

## Colors

A poster palette: near-black stock, warm cream ink, warm brown-greys for paper layers, one tarnished-brass accent and a small set of muted, print-like status inks.

### Primary
- **Tarnished Brass** (tarnished-brass): the band's metal. Event date numerals, the active-page dot, the dashed header rule in the attendance matrix, hover on outline buttons, and the "indécis" status. Every pairing with white text passes WCAG AA.

### Neutral
- **Poster Black** (poster-black): page background, sampled from the logo plate so the logo has no visible edge.
- **Cream Ink** (cream-ink): all primary text, the primary button fill and the focus ring. Warm off-white, never #ffffff for body text.
- **Stage Board** (stage-board): cards, the top nav bar and dialogs; the one raised paper layer.
- **Stage Board Raised** (stage-board-raised): secondary buttons, hover rows, and the "pas de réponse" status fill.
- **Faded Ink** (faded-ink): secondary text such as month labels, times, locations, inactive nav links and helper copy.
- **Rivet Grey** (rivet-grey): every border, input stroke and dashed divider.
- **Pitch Black Ink** (pitch-black-ink): text on the cream primary button.

### Status inks
- **Bottle Green** (bottle-green): "Oui".
- **Oxblood** (oxblood): "Non", plus destructive buttons (delete event or member).
- **Tarnished Brass** (tarnished-brass): "Indécis" (shared with the accent on purpose: undecided is the brass "pending" state).
- **Stage Board Raised + Faded Ink**: "Pas de réponse", deliberately the quietest of the four.
- **Warning Coral** (warning-coral): inline error text only. Oxblood is tuned for white text on it and fails as text on dark surfaces; coral is its readable counterpart.

### Named Rules
**The Tarnished Brass Rule.** Brass appears only on dates, active-position markers, the matrix header rule, hover on outline buttons, and the indécis status. If a new screen wants brass anywhere else, it should pick a different signal. Its scarcity is the point.

**The Status Token Rule.** Presence colors come only from the `status-oui / non / indecis / none` tokens (and their `-foreground` pairs), never a hard-coded color, and always appear with a text label or screen-reader text alongside.

**The Measured Contrast Rule.** Every text/background pair is checked against WCAG AA by calculation, not by eye. A new pair is only added to the palette after it has been checked.

## Typography

**Display Font:** Archivo (with ui-sans-serif, system-ui)
**Body Font:** Archivo (with ui-sans-serif, system-ui, -apple-system)

**Character:** A single sturdy grotesque, used like poster wood type at the top end of its weight range and like plain information-board text at the bottom. The contrast is entirely in weight; size steps stay small because the app lives on phones.

### Hierarchy
- **Display** (800, 1.5rem, 1.33): page titles (Calendrier, Vue d'ensemble, Frais, Partition), always followed by an 80px gap.
- **Headline** (800, 1.25rem, 1.375): the event name on the event detail page.
- **Title** (800, 1.125rem, 1.375): event names on ticket cards and card headings.
- **Date Numeral** (800, 1.5rem, 1.0, tarnished brass): the day number on a ticket stub, with the month in label size underneath.
- **Wordmark** (900, 1.125rem): the "2LDC" mark in the top nav, the only use of weight 900.
- **Body** (400–700, 0.875rem, 1.43): almost all running text, nav links, form labels, button text (700).
- **Label** (600, 0.75rem): status badges, month labels under date numerals, role tag.

### Named Rules
**The Weight Carries It Rule.** Hierarchy comes from weight before size. Anything that names a thing (a page, an event, a date) is 800; everything else is 400–600. Don't add a second typeface or a larger size step to make something stand out.

**The 16px Field Rule.** Below 768px, every text input, select and textarea renders at 16px so iOS Safari doesn't zoom the page on focus.

## Layout

Mobile first: a single column with 16px page padding. On md (768px) and up, the content column and the fixed top nav share the same centered width (80% of the viewport), so the nav reads as the header of the sheet beneath it.

- **Page header:** display-size title on the left, at most one primary action on the right, then an 80px gap before content. The large gap is deliberate breathing room, like a poster's headline zone.
- **Lists:** ticket cards stacked with a 12px gap. Inside a card, the date column is a fixed 56px so names line up down the list.
- **Nav offset:** content starts 96px from the top on mobile (112px on md) to clear the fixed nav.
- **Event detail:** a centered column (max 512px, 768px on md). On desktop, previous and next events sit beside it as 160px mini-stubs; on mobile, the card is swiped and dot indicators sit under it.
- **Attendance overview:** a full table with a sticky first column on desktop. On mobile it becomes horizontally snapping cards (85% width), one per event.
- **Touch targets:** interactive controls are at least 44px tall (`min-h-11`), including the small button size.

## Elevation & Depth

The system is flat. Depth comes only from tonal layering: poster black, then stage board for cards and the nav, then stage board raised for hover rows and secondary fills, each layer outlined by a rivet-grey hairline. The only shadow in the app is under modal dialogs, so they lift clearly off the page.

### Shadow Vocabulary
- **Dialog lift** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): alert dialogs (delete confirmations) only.

### Named Rules
**The Printed Sheet Rule.** Surfaces are flat at rest and stay flat on hover. Interaction is shown by a border shifting toward brass (60% opacity) or a tone change, never by a shadow or a lift.

## Shapes

Gently rounded, never pill-shaped except for status. Cards and dialogs use an 8px radius, buttons and inputs 6px, small tags 4px. Status badges and dot indicators are fully round, which makes status instantly distinguishable from actions.

The recurring signature is the **dashed tear line**: a dashed rivet-grey border separating a card's information from its actions, like the perforation on a ticket stub. In the attendance matrix it becomes a thicker 2px dashed brass rule under the header row.

## Components

### Buttons
Sturdy and printed: solid fills, bold 700 text, no gradients or shadows.
- **Shape:** gently rounded (6px), at least 44px tall.
- **Primary:** cream-ink fill with pitch-black text, 8px 16px padding. Hover drops the fill to 85% opacity.
- **Outline:** transparent with a 2px cream border at 40% opacity. On hover it fills with tarnished brass and the border turns brass.
- **Secondary:** stage-board-raised fill, cream text.
- **Destructive:** oxblood fill, white text; always behind a confirmation dialog.
- **Link:** brass text, underline on hover.
- **Focus:** 2px cream ring with 2px offset, on every interactive element.
- **Presence choice (Oui / Non / Indécis):** a 3-column grid of small outline buttons. The selected one switches to its status ink fill with white text, so the chosen answer is the only colored button in the row.

### Status Badges
- **Style:** fully round pill, 2px 10px padding, label type (600, 0.75rem), filled with the matching status ink.
- **Dot form:** in dense lists (calendar), status shrinks to a 10px dot; "pas de réponse" is an empty dot with a faded outline instead of a fill. Screen-reader text always carries the word.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** stage board on poster black.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px rivet grey; standalone shadcn cards (login, dialogs) use 2px.
- **Internal Padding:** 16px; dialogs and placeholder cards 24px.

### Inputs / Fields
- **Style:** transparent fill, 1px rivet-grey stroke, 6px radius, 44px height, 12px horizontal padding, label above in body 500.
- **Focus:** the global 2px cream outline.
- **Error:** inline warning-coral text below the form, announced with `role="alert"`.

### Navigation
- **Style:** a fixed top bar on stage board with a rivet-grey bottom border, shared by members and admins. Left: the "2LDC" wordmark (900), an optional "Admin" tag (outlined, 4px radius) and the member's first name in faded ink. Center: icon + label links. Right: Déconnexion.
- **States:** inactive links in faded ink, hover to cream; the active link is cream and semibold with `aria-current="page"`.
- **Mobile:** below md, links collapse behind a burger icon into a dropdown panel under the bar; it closes on navigation.

### Ticket Stub (signature component)
The defining pattern for any list of dated things (Calendrier, admin Dates, Fanfarons, event detail). A stage-board card with a fixed 56px left column holding the brass date numeral and faded month, then the event name in title weight with time and location in faded body text below. When a card has actions, they sit in a row below a dashed tear line, aligned right. The whole card is the link, and hover shifts its border toward brass.

### Motion
Motion is minimal and functional. Color changes use the default 150ms transition. Moving between events on the detail page slides the card 32px out with a fade (180–200ms, ease-out) before navigating. All motion is disabled under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** build every new list of events, members or items as a ticket stub: stage-board card, 8px radius, rivet-grey border, dashed tear line before actions.
- **Do** keep the page background at poster black (#030304) so the logo stays seamless.
- **Do** use Archivo 800 for anything that names a thing and 400–600 for supporting text.
- **Do** pull every presence color from the four status tokens and pair it with a label or screen-reader text.
- **Do** keep controls at least 44px tall, and check new text colors against WCAG AA by calculation.
- **Do** show hover by tone or a brass-tinted border, never by lifting.

### Don't:
- **Don't** use tarnished brass outside dates, active markers, the matrix header rule, outline-button hover and the indécis status.
- **Don't** add drop shadows to cards, nav or buttons; the only shadow is the dialog lift.
- **Don't** introduce a second typeface, a light theme or pure white body text.
- **Don't** hard-code status colors or invent a fifth status color.
- **Don't** use oxblood for error text on dark surfaces; use warning coral.
