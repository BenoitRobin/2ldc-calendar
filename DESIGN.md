---
name: 2LDC Calendar
description: Shared calendar and attendance for the 2LDC fanfare, set like a living foundry type specimen.
colors:
  paper: '#fbfaf7'
  ink: '#111111'
  specimen-red: '#c4321a'
  danger-red: '#b42d17'
  proof-stone: '#efece6'
  graphite: '#67635b'
  hairline: '#d9d6cf'
  field-stroke: '#8a857b'
  mustard: '#e8b931'
  white: '#ffffff'
typography:
  display:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif'
    fontSize: '10rem'
    fontWeight: 200
    lineHeight: 0.8
    letterSpacing: '-0.04em'
    fontFeature: '"tnum"'
    fontVariation: '"wdth" 72'
  numeral-list:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif'
    fontSize: '3rem'
    fontWeight: 200
    lineHeight: 1
    fontFeature: '"tnum"'
    fontVariation: '"wdth" 72'
  numeral-section:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.875rem'
    fontWeight: 200
    lineHeight: 1
    fontFeature: '"tnum"'
    fontVariation: '"wdth" 80'
  headline:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.875rem'
    fontWeight: 800
    lineHeight: 1
    fontVariation: '"wdth" 85'
  page-title:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 800
    lineHeight: 1.333
  title:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 800
    lineHeight: 1.375
  wordmark:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.25rem'
    fontWeight: 900
    lineHeight: 1.4
    fontVariation: '"wdth" 125'
  body:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: '0.05em'
rounded:
  sm: '6px'
  md: '8px'
  lg: '12px'
  pill: '9999px'
spacing:
  row: '12px'
  page: '16px'
  row-roomy: '16px'
  card: '24px'
  header-gap: '40px'
  header-gap-desktop: '64px'
  touch: '44px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '44px'
  button-outline:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: '8px 12px'
    height: '44px'
  button-outline-hover:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
  button-destructive:
    backgroundColor: '{colors.specimen-red}'
    textColor: '{colors.white}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '44px'
  status-pill-oui:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    rounded: '{rounded.pill}'
    padding: '2px 10px'
  status-pill-non:
    backgroundColor: '{colors.specimen-red}'
    textColor: '{colors.white}'
    rounded: '{rounded.pill}'
    padding: '2px 10px'
  status-pill-indecis:
    backgroundColor: '{colors.mustard}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    padding: '2px 10px'
  status-pill-none:
    backgroundColor: '{colors.proof-stone}'
    textColor: '{colors.graphite}'
    rounded: '{rounded.pill}'
    padding: '2px 10px'
  input-field:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: '0 12px'
    height: '44px'
  card-form:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: '{spacing.card}'
---

# Design System: 2LDC Calendar

## Overview

**Creative North Star: "Le Spécimen vivant"**

The interface is a foundry type specimen sheet that happens to be alive: paper and ink, one variable family, and numerals set large enough to read across a rehearsal room. Its single signature is that weight, not colour, encodes how many musicians are coming. A date numeral is set at hairline weight when nobody has said oui and at black weight when everyone has (weight = 200 + share of oui × 700), so a glance down the calendar reads as a texture of light and heavy dates before any word is read. That weight is always paired with a readable number ("3 / 6 viennent", "50 % de oui"), because a typographic signal alone is not an accessible one.

Structure comes from printed rules, not boxes. An ink rule opens every list, section and featured date; hairline rules separate rows beneath it; corners are softly rounded like the logo's frame; nothing floats except a confirmation dialog. Colour is almost absent: the one red is reserved for what still needs attention, so when it appears it means something.

Density is calm and generous at the top of a page (a large gap under every page title, one giant numeral for the next date) and tight in lists, where rows sit 12 to 16px apart under hairlines. The previous "Gig Poster" world (black stage, cream ink, brass accents) is retired; none of its tokens or devices carry over.

**Key Characteristics:**

- Paper (#fbfaf7) and ink (#111111) carry the whole interface.
- Date numerals weighted by attendance share, from 200 to 900, at a condensed width (wdth 72), always beside a plain count.
- One red, reserved for attention: unanswered, empty, refused, destructive.
- Ink top rule opens a section; hairline rules divide rows; no boxed lists.
- Rounded corners echoing the logo's frame: 8px on controls, 12px on containers, fully rounded status pills.
- One family, Archivo variable, ranked by weight and width axes rather than by many sizes.

## Colors

A specimen-sheet palette: warm paper, near-black ink, two warm greys for hierarchy and rules, and a single red held in reserve.

### Primary

- **Specimen Red** (`specimen-red`): the attention colour. It marks an unanswered date (the red period after the featured numeral, the "À répondre" label), an empty section (its 0 numeral, which also falls to hairline weight), the "Non" status pill, text selection, and destructive actions (delete buttons, destructive dialog actions).
- **Danger Red** (`danger-red`): a slightly deeper red used only for inline error text ("Échec de l'enregistrement, réessaie."), where body-size text on paper needs the extra contrast.

### Secondary

- **Mustard** (`mustard`): appears only as the "Indécis" status pill fill, with ink text. It is a status signal, not an accent; it never decorates.

### Neutral

- **Paper** (`paper`): page background, card and dialog surface, and the text colour on ink fills.
- **Ink** (`ink`): all text, the primary button fill, the "Oui" status pill, every structural rule (nav bottom rule, section top rules, card borders), the coverage gauge fill, and the focus outline.
- **Proof Stone** (`proof-stone`): quiet fills: secondary and ghost button hover, table row hover (at 40%), and the "Pas de réponse" status pill.
- **Graphite** (`graphite`): secondary text: meta lines, dates under names, counts, inactive nav links, placeholders.
- **Hairline** (`hairline`): the row dividers under an ink rule, the empty track of the coverage gauge, and the small role tag border.
- **Field Stroke** (`field-stroke`): the 1px border of text inputs and selects, dark enough to read as a control boundary against paper.
- **White** (`white`): text on red fills only.

### Named Rules

**The Red Means Act Rule.** Red appears only on something that needs attention: an unanswered date, an empty section, a refusal, an error, a destructive action. Dates, icons, headings, links and section labels stay ink. If nothing on the screen needs the user, the screen has no red.

**The Paper and Ink Rule.** Hierarchy is built from ink, graphite and hairline on paper. Do not introduce a new hue to separate content; use weight, a rule, or graphite text instead.

## Typography

**Display Font:** Archivo variable (with ui-sans-serif, system-ui, sans-serif), loaded from Google Fonts with the full weight axis (100 to 900) and width axis (62 to 125).
**Body Font:** Archivo variable (with ui-sans-serif, system-ui, -apple-system, sans-serif).

**Character:** One grotesque family worked like a specimen sheet: condensed, data-weighted numerals; heavy, slightly condensed names; a wide, black wordmark; plain regular text everywhere else. Contrast comes from the weight and width axes, not from a second face.

### Hierarchy

- **Display** (data-weighted 200 to 900, 10rem mobile / 13rem desktop on the calendar's featured date, 9rem / 11rem on the event page, line-height 0.8, tracking -0.04em, wdth 72, tabular figures): the day of the month for the date in focus. Weight comes from the attendance share, never from a fixed value.
- **List numeral** (data-weighted, 3rem in calendar rows, 3.75rem / 2.25rem in the attendance matrix columns, wdth 72, tabular): the day numeral that heads each row or column.
- **Section numeral** (data-weighted, 1.875rem, wdth 80, tabular): the oui count per instrument section in the coverage strip.
- **Headline** (800, 1.875rem, line-height 1, wdth 85): an event's name under its featured numeral.
- **Page title** (800, 1.5rem): one per page ("Calendrier", "Partition", admin lists).
- **Title** (800, 1.125rem to 1.25rem, snug): names in lists and card titles.
- **Wordmark** (900, 1.25rem, wdth 125): "2LDC" in the top nav, the only wide setting in the system.
- **Body** (400, 0.875rem, line-height 1.43): descriptions, form labels (500), meta under names. Inputs rise to 16px below 768px to stop iOS zoom.
- **Label** (400 to 600, 0.75rem, tracking 0.05em, uppercase): the meta line above a featured numeral, which carries data (weekday and month, "À répondre", "x / y viennent"). Section abbreviations in the coverage strip use 11px uppercase with tracking 0.025em.

### Named Rules

**The Weight Is Data Rule.** A date or section numeral's weight is computed from the share of oui (200 + share × 700), never chosen for looks, and always sits next to a readable count or percentage.

**The One Family Rule.** Everything is Archivo. New hierarchy comes from the weight and width axes and the existing few sizes, not from another typeface.

## Layout

Pages sit in a single column with 16px padding. The top nav is fixed, full width on mobile and 80% wide, centred, from 768px. Every page title is followed by a 40px gap on mobile and 64px from 768px before content begins. The event page centres a column of up to 32rem (48rem from 768px), flanked on desktop by 10rem previous/next previews, each opened by its own ink rule; on mobile those become dot links below.

Lists are ruled, not gridded: an ink top rule, then rows divided by hairlines with 12px vertical padding (16px on admin lists). Calendar rows use a three-column grid: a 4rem numeral column, the name and meta, then the status. The coverage strip is a six-column grid, one column per instrument section. The attendance matrix is a full table on desktop and, on mobile, a horizontally scrolling, snap-aligned row of 85%-wide event columns.

Every tap target is at least 44px (buttons, icon buttons, inputs, selects, the back link, mobile dot links). The only breakpoint in active use is 768px; 640px appears only for the dialog's max width.

### Named Rules

**The 44 Rule.** Nothing the user taps is smaller than 44px in its hit area, even when the visible mark is a 6px dot.

## Elevation & Depth

The system is flat. Surfaces sit on paper and are separated by rules, not by shadow or tonal layers. The single exception is the confirmation dialog, which lifts off an 80% black overlay with a standard large shadow, because it is the one moment the sheet is interrupted.

### Shadow Vocabulary

- **Dialog lift** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): alert dialogs only.

### Named Rules

**The Rules Not Boxes Rule.** An ink top rule opens a list or section and hairline rules separate its rows. Lists are never wrapped in boxed cards and nothing at rest casts a shadow.

## Shapes

Corners echo the rounded frame of the 2LDC logo: buttons, inputs and selects use `rounded-md` (8px), cards and dialogs `rounded-lg` (12px), the role tag `rounded-sm` (6px). Status pills are fully rounded, as are the tiny dot indicators on the mobile event pager. Borders are 1px ink for structure (rules, cards, dialog), 1.5px ink for outline buttons, 1px field stroke for inputs, and 1px hairline for row dividers. The coverage gauge is a 1px hairline track with a 3px ink bar laid over it.

### Named Rules

**The Logo Frame Rule.** Every box takes the logo's rounded corner: 8px for controls, 12px for containers, fully rounded for status pills. Rules (horizontal lines) stay straight.

## Components

### Buttons

Blunt and typographic: bold small text in a rounded slab.

- **Shape:** 8px rounded corners, height 40px with a 44px minimum, bold 0.875rem text.
- **Primary:** ink fill with paper text, 16px horizontal padding; hover lightens the ink to 85%.
- **Outline:** transparent with a 1.5px ink border and ink text; on hover it inverts to an ink fill with paper text. Used for the unchosen attendance choices and secondary actions.
- **Destructive:** red fill with white text; delete icon buttons in admin lists are the outline form in red (1.5px red border, red icon) that fills red on hover.
- **Secondary / Ghost:** proof stone fill, or no fill with a proof stone hover.
- **Focus:** a 2px ink ring offset 2px; globally, any focused element gets a 2px ink outline offset 2px.
- **Attendance choice:** the three-up Oui / Non / Indécis group on the event page; the chosen one takes its status fill (ink, red, mustard), the others stay outline.

### Status Pills

- **Style:** fully rounded, 0.75rem semibold, 2px by 10px padding. Oui is ink with paper text, Non is red with white text, Indécis is mustard with ink text, Pas de réponse is proof stone with graphite text.
- **Editable form:** in the admin attendance matrix the pill becomes a 36px select carrying the same status fill; unanswered shows a field-stroke border.

### Cards / Containers

- **Corner Style:** 12px rounded.
- **Background:** paper.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px ink.
- **Internal Padding:** 24px, with the header title at 800, 1.25rem.
- **Use:** only for single admin forms (new or edit event, member, piece), centred at up to 32rem. Lists never use cards.

### Inputs / Fields

- **Style:** 44px tall, 8px rounded, 1px field-stroke border, 12px horizontal padding, transparent or paper fill, 0.875rem text with graphite placeholders. Labels sit above at 0.875rem, 500.
- **Focus:** the global 2px ink outline, offset 2px.
- **Error:** danger-red 0.875rem text below the field.

### Navigation

- **Style:** fixed bar on paper with a 1px ink bottom rule, 16px by 12px padding. Left: the 2LDC drum logo (`logo-2ldc-drum.svg`, 32px tall, links to Dates for admins and Calendrier otherwise), an optional 6px-rounded role tag (hairline border, graphite 0.75rem), and the user's name in graphite.
- **Links:** 0.875rem with optional 16px icons; inactive in graphite, hover to ink, active in ink at 600.
- **Mobile:** links collapse behind a 44px burger; the open menu drops under its own ink rule as a stacked list.

### Specimen Date (signature)

The featured date block: an ink top rule; a label line with the weekday and month on the left (red "À répondre" when the user has not answered) and "x / y viennent" on the right; the giant data-weighted numeral, followed by a red period when unanswered; the coverage gauge (hairline track, 3px ink bar at the oui share, "n % de oui"); the event name at 800 wdth 85; time and place in graphite; then a full-width Répondre button or the user's status pill.

### Section Coverage Strip (signature)

A six-column strip under an ink rule, one column per instrument section: the oui count as a data-weighted numeral (wdth 80) over an 11px uppercase abbreviation. A section with members but no oui shows its 0 in red at hairline weight. Counts include only members with an instrument; the instrument-less admin account is never counted.

## Do's and Don'ts

### Do:

- **Do** compute every date and section numeral's weight from attendance (200 + share of oui × 700) and set it at wdth 72 (wdth 80 in the coverage strip).
- **Do** pair every weighted numeral with a readable count ("3 / 6 viennent", "50 % de oui", "2/6 oui").
- **Do** open every list or section with a 1px ink top rule and divide rows with 1px hairline rules.
- **Do** round every box like the logo's frame (8px controls, 12px containers); keep rules straight.
- **Do** leave 40px under a page title on mobile and 64px from 768px.
- **Do** give every tap target at least 44px.
- **Do** use red only for what needs attention: unanswered, empty, refused, error, destructive.

### Don't:

- **Don't** use colour to encode how many musicians are coming; that is weight's job.
- **Don't** use red on dates, icons, headings, links or decoration.
- **Don't** wrap lists in boxed cards or add shadows to anything at rest; the alert dialog is the only lifted surface.
- **Don't** add a second typeface; reach for Archivo's weight and width axes instead.
- **Don't** set a numeral's weight by hand for emphasis.
- **Don't** add uppercase labels above headings unless they carry data (a date, a count, a status).
- **Don't** bring back Gig Poster tokens: no black stage, cream ink, brass, or ticket-stub cards.
