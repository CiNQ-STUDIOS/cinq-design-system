# CiNQ. The visual language.

Version 1.0.0. The tokens in `tokens/tokens.css` are the source of truth;
this document says what they mean and how they are used. Every value below
is a token name. If you find a hex in a component, that is a bug.

---

## 1. Identity

### Philosophy

Vermilion ink on a warm dark page. CiNQ is five founders in Islamabad
building the systems restaurants, clinics and growing companies actually run
on, and the design says that once, quietly: one near-black canvas, bone type,
a single accent, big confident display type, and interfaces that feel like
physical objects with an edge you could hold. Nothing glows, nothing is
glassy unless it is pinned to the viewport, nothing has two colours where
one would do. Motion is generous on the public site and almost absent in
the tools people use all day. When two agents argue about a choice, the
quieter one wins.

### The name

`CiNQ`. Three capitals and one lowercase i, in running text as much as in
the wordmark. Never `Cinq`, never `CINQ`, never `cinq` except in URLs and
file names. Products carry it the same way: `CiNQ RMS`.

### Hard constraints

These hold on every surface, every product, with no per-product override.
Register anything else in the profile's deviation log; these are not
deviations, they are bugs.

| Never | Because |
|:---|:---|
| A second accent colour | Vermilion is the brand. Semantic colours are signals, not accents. |
| Pure black `#000` or pure white `#fff` as canvas or type | Ink and bone carry warmth. The one exception is `--app-surface` on paper, which is white for input contrast. |
| A hex, px radius, shadow or duration literal in a component | Everything binds to a token so the mode switch and density switch work for free. |
| Gradients in UI | Amber and the vermilion ribbons exist only inside the hero shader and the OG image. |
| `backdrop-filter` on anything that scrolls | Glass is for fixed chrome: the header pill, the menu, a bottom sheet handle. |
| A medium shadow | Shadows are large and soft or they are absent. `shadow-md` reads as a template. |
| `text-3` for body copy | It is 3.67:1. Large type, uppercase mono labels and decoration only. |
| Bone type on a vermilion fill | 2.66:1. Text on vermilion is ink, always. |
| Two motion libraries on one element | GSAP owns scroll, Motion owns component state, R3F owns the hero. |
| Scroll-linked motion under `prefers-reduced-motion` | The page must be static and complete without it. |
| Em-dashes in copy | House style is periods and commas. |
| Title Case in headings, labels or buttons | Sentence case everywhere. |
| `leverage`, `seamless`, `cutting-edge`, `world-class`, `next-gen`, `revolutionise`, `empower`, `unlock` | They say nothing. |
| A button that says `Submit`, `OK`, `Click here` or `Learn more` | Buttons say what happens. |
| Inventing a number, a phone, an address or a client name to fill a layout | Claims are limited to what the source material supports. |

---

## 2. Colour

### The accent split

The most misunderstood rule in the system. There are two vermilion tokens
and they are not interchangeable.

- `--accent` is a **fill**. Buttons, the mark, selected rows, the colour-block
  panels, display numerals, `::selection`. Text on it is `--on-accent` (ink).
- `--accent-text` is vermilion **as small text**: links, labels, the role
  line under a name, an active nav item. On the dark canvas it is the same
  hex as the fill (6.44:1). On paper the fill would fail as text (3.02:1),
  so light mode deepens `--accent-text` to `#b8360f` (5.21:1) and leaves the
  fill alone.

`--focus-ring` follows `--accent-text` for the same reason.

If you write `text-accent`, stop and ask whether it is a display numeral or
the mark. If it is a word, it is `text-accent-text`.

### The ramp

`--vermilion-50` to `--vermilion-950`, hue locked at OKLCH 36°, `500` is the
accent. Use it for hover math, chart tints and soft fills. Never promote a
ramp step to a new accent. Never use it for text below `600` on paper or
above `400` on ink without measuring.

### Canvas systems

**Marketing** (`--canvas`, `-2`, `-3`, `-4`, `-warm`): the public site. Big
steps, big radii. `--canvas-2` is a card. `--canvas-3` appears once or twice
a page. `--canvas-4` is a device bezel. `--canvas-warm` is the warm panel in
the work showcase.

**Application** (`--app-canvas`, `-surface`, `-raised`, `-sunken`, `-inverse`):
dashboards, consoles, the phone apps. `-surface` is a panel, `-raised` is a
popover or a hovered row, `-sunken` is an input well or a table body,
`-inverse` is a tooltip. In light mode `-surface` is white so inputs sit on
something that is not paper.

The brand words `--ink` and `--bone` alias the marketing canvas and the text
scale. They are how the studio talks and the website is built on them. New
code prefers the role names.

### Lines

`--line` is bone at 10%, `--line-strong` at 18%, `--line-selected` is the
accent. Because they are alpha over the text colour they invert with the
mode. A card on the public site has no border at all; it has the double
bezel (`--shadow-bezel` shell around a `--canvas-2` core, see §4).

### Semantic colours

| Role | Dark fill and text | Light fill | Light text | Soft |
|:---|:---|:---|:---|:---|
| Positive | `#4fcf8e` | `#1e7a4c` | `#1e7a4c` | 14% tint |
| Negative | `#ff5c7c` | `#c0243f` | `#c0243f` | 14% tint |
| Attention | `#f2c14e` | `#f2c14e` | `#7a5600` | 14% tint |
| Info | `#7db3ff` | `#1f5fbf` | `#1f5fbf` | 14% tint |

Negative is a rose, not a red, so it never competes with the vermilion.
Attention keeps a yellow fill in both modes and deepens only its text. A
semantic colour is a signal: a badge, a row tint, an icon, an inline
message. It is never a button fill except the destructive button, and it is
never decoration. Every fill has an `--on-*` text token; use it.

`--amber` is not a semantic colour. It lives inside the hero shader and the
OG image and nowhere else.

### Footer chrome

The footer is ink in both modes (`--footer-*`). It is the one place the mode
switch does not reach, because it is where the wordmark lives at full size
and the wordmark is bone on ink.

### Chart series

`--chart-1` to `--chart-6` in fixed order: vermilion, sky, mint, gold, lilac,
bone-2. The first series is always the accent. The same measure keeps the
same colour across every screen; do not reorder to suit a chart. Gridlines
and axes are `--chart-grid`. In light mode `--chart-1` is 3.02:1 on paper,
which is fine for a bar or a line and not fine for a label; label the
series with `--text-2`.

### The escape hatch

A photograph, a product screenshot, a client logo or a map tile brings its
own colour. Put it inside a `--canvas-2` or `--app-surface` container with
the standard radius and let it be. Do not tint it, do not duotone it unless
it is a founder portrait (`.duotone` exists for exactly that), do not match
the UI to it.

---

## 3. Typography

### Loading

Bricolage Grotesque (variable), Geist and Geist Mono. All SIL OFL. Next.js
products use `next/font/local` from `brand/fonts/` and expose
`--font-bricolage`, `--font-geist`, `--font-geist-mono`; the tokens fall
through to the family name for everything else.

```ts
// src/lib/fonts.ts
import localFont from "next/font/local";
export const bricolage = localFont({
  src: "../../brand/fonts/BricolageGrotesque-Variable.ttf",
  variable: "--font-bricolage",
  display: "swap",
});
export const geist = localFont({
  src: [
    { path: "../../brand/fonts/Geist-Regular.woff", weight: "400" },
    { path: "../../brand/fonts/Geist-Medium.woff", weight: "500" },
  ],
  variable: "--font-geist",
  display: "swap",
});
export const geistMono = localFont({
  src: "../../brand/fonts/GeistMono-Regular.woff",
  variable: "--font-geist-mono",
  display: "swap",
});
```

Plain HTML: `@font-face` the same files, same variable names.

### Weight roles

| Face | Weight | Role |
|:---|:---|:---|
| Bricolage Grotesque | 700, `opsz 96`, `wdth 100`, tracking `--tracking-display` | Headings. `.font-display`. |
| Bricolage Grotesque | 800, `opsz 96`, `wdth 90`, tracking `--tracking-display-tight` | The wordmark, product names, display numerals. `.font-display-tight`. |
| Geist | 400 | Everything you read. |
| Geist | 500 | Buttons, labels, table headers, a name. Never bold. |
| Geist Mono | 400, uppercase, tracking `--tracking-mono` | Kickers, eyebrows, IDs, timestamps, code. `.t-mono`. |

There is no 600 and no 300 in the system.

### Size scale

Every role has a token. Fluid sizes use `clamp()` and need no breakpoints.

| Role | Token | Face | Leading | Where |
|:---|:---|:---|:---|:---|
| Display | `--text-display` | display 700 | `--leading-display` | The hero headline. One per page. |
| Hero | `--text-hero` | display 700 | `--leading-display` | Marketing section titles. |
| Title | `--text-title` | display 700 or 800 | `--leading-tight` | h3, product names, an app page title. |
| Slab heading | `--text-slab` | sans 500 | `--leading-tight` | A card's heading. |
| Section heading | `--text-section` | sans 500 | `--leading-tight` | An app section, a settings group. |
| Lead | `--text-lead` | sans 400 | `--leading-lead` | The paragraph under a title. |
| Subheading | `--text-subheading` | sans 500 | `--leading-body` | A form group label, a table caption. |
| Body | `--text-body` | sans 400 | `--leading-body` | Reading. |
| Label | `--text-label` | sans 400 or 500 | 1.5 | Input labels, helper text, badges. |
| Nav link | `--text-nav` | sans 500 | 1 | Header and sidebar links. |
| Kicker | `--text-kicker` | mono, uppercase | 1 | The small line above a heading. |
| Eyebrow | `--text-eyebrow` | mono, uppercase | 1 | Metadata: dates, IDs, counts. |
| Bottom-nav label | `--text-bottom-nav` | sans 500 | 1 | Under a bottom-nav icon. |
| Numeral | `--text-numeral` | display 800 | 1 | Stat tiles, prices in a summary. |

### Measure

Body copy never runs wider than `--prose-max` (68ch). Lead copy under a
title is at most 20 words on marketing pages. A hero headline is three lines
at most. `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

### Numerals

Tabular figures in any column of numbers: `font-variant-numeric: tabular-nums`.
Display numerals in stat tiles use the tight display face and may be
vermilion (`--accent`), the one place a word-sized accent fill is a fill and
not text.

### Money

The studio's home market is Pakistan. Default locale `en-PK`, currency PKR.

- Format with `Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 })`. Output: `Rs 12,500`. Never `PKR 12500.00` in UI.
- Rupees are whole in UI. Show paisa only on an invoice line that has them.
- Large sums keep the digits: `Rs 1,250,000`, not `Rs 12.5 lakh`, unless the product profile says the audience reads lakh and crore, in which case say so there and use it consistently.
- Negative money is `-Rs 400` with `--negative-text`, never parentheses, never red without the sign.
- A price in a client product outside Pakistan uses that product's profile currency (SpiceHUT is CAD).

### Dates

`d MMM yyyy` for a date (`19 Sep 2026`), `d MMM, HH:mm` for a timestamp
(`19 Sep, 14:05`), `EEE d MMM` in a schedule (`Fri 19 Sep`). 24-hour clock in
the tools, 12-hour on a customer-facing app if the profile says so. Relative
times (`2 min ago`) only in feeds and only under an hour old.

### Monospace

IDs, order numbers, table numbers, codes, timestamps in a log, anything a
person might read aloud to someone else. `.t-mono` is uppercase and tracked;
a code block or a log line is mono but not uppercase.

---

## 4. Shape and depth

### Radius

| Token | Value | Targets |
|:---|:---|:---|
| `--radius-control` | 12px | Inputs, selects, textareas, small buttons, chips, table wrappers in dense mode |
| `--radius-slab` | 16px | Cards inside apps, tiles, table wrappers |
| `--radius-panel` | 20px | Dialogs, popovers, a sidebar's inner panel |
| `--radius-sheet` | 28px | Bottom sheets, drawers, full-height panels |
| `--radius-pill` | 9999px | Every button, toggle, segmented control, badge |
| `--radius-marketing` | 28px | Cards on the public site |
| `--radius-marketing-sm` | 16px | Small elements on the public site |

A nested radius is the parent minus the padding: a 6px shell around a
28px card gives the core 22px. Never nest a larger radius inside a smaller.

### Borders

`--border-hairline` is the default separator. `--border-standard` is for an
input at rest and a ghost button. `--border-selected` (2px, accent) is for a
selected card or option. Borders are never the accent unless selected.

### The bezel

The signature surface on the public site. A 6px translucent shell
(`--shadow-bezel`, bone at 4%) with a hairline, around a concentric
`--canvas-2` core with a one-pixel top highlight (`--shadow-bezel-top`). Use
it for anything that should read as a physical object: a product card, a
device, the contact form. In apps it is too heavy; use `--app-surface` with a
hairline instead.

### Shadows

| Token | Use |
|:---|:---|
| `--shadow-slab` | A card lifting on hover. |
| `--shadow-strong` | A popover, a menu, a dropdown. |
| `--shadow-pressed` | An inset for a pressed segmented option or a sunken well. |
| `--shadow-sheet` | A bottom sheet or drawer, the only shadow that lifts a whole panel. |
| `--shadow-bezel` | The card shell. Inset, not a drop shadow. |

All soft, all tinted to ink, all large. There is no small or medium shadow.
Cards at rest have none.

### Press states

Buttons scale to `0.97` on `:active` over `--dur-slow` with `--ease-out`;
their icon disc lifts by `translate(2px, -2px) scale(1.06)` on hover. A
segmented option takes `--shadow-pressed` when selected. A card does not
scale on press; it tilts on pointer move (the spotlight card) and returns
over `--dur-slow`.

---

## 5. Density and layout

### Density

Set `data-density` on the surface root. Everything below it re-sizes.

| Variable | Comfortable | Compact | Dense |
|:---|:---|:---|:---|
| `--control-h` | 44px | 36px | 32px |
| `--control-pad-x` | 16px | 12px | 10px |
| `--gap` | 16px | 12px | 8px |
| `--gap-lg` | 24px | 16px | 12px |
| `--row-h` | 52px | 40px | 32px |
| `--body-size` | `--text-body` | 0.9375rem | 0.875rem |

Marketing and mobile are comfortable. Dashboards are compact. Consoles are
dense. Touch targets never drop below `--touch-min` (44px) on a touch
device regardless of density: a dense row is 32px tall but its tap area is
padded to 44.

### Layout constants

| Token | Value | Use |
|:---|:---|:---|
| `--page-max` | 1280px | Marketing content width |
| `--app-max` | 1600px | Dashboard and console width |
| `--prose-max` | 68ch | Reading width |
| `--nav-h` | 72px | Top bar height |
| `--nav-max` | 1120px | The header pill on marketing |
| `--sidebar-w` | 264px | Dashboard sidebar |
| `--bottom-nav-h` | 64px | Mobile bottom nav |
| `--pad` | 20px to 64px | Page gutter, fluid |
| `--touch-min` | 44px | Minimum tap target |

### Rhythm

Vertical spacing on marketing pages is in multiples of `--gap-lg`; between
sections it is `clamp(96px, 12vw, 200px)`. In apps the unit is `--gap`.
Adjacent sections on a marketing page never share a layout family (see
SURFACES.md). Below `lg` (1024px) pinned and horizontal sections stack;
below `md` (768px) multi-column grids go to one column.

---

## 6. Motion

### The curve

`--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`, GSAP `expo.out`) for anything
that moves on its own. `--ease-io` for anything that opens and then closes.
Linear only for scrubbed tweens tied to scroll position and the marquee.

### Interaction specs

| Interaction | Property | Duration | Ease | Travel |
|:---|:---|:---|:---|:---|
| Hover colour | `background-color`, `color`, `box-shadow` | `--dur-fast` | `--ease-out` | none |
| Button press | `transform: scale(0.97)` | `--dur-slow` | `--ease-out` | none |
| Toggle, checkbox, switch | `transform`, `background-color` | `--dur-base` | `--ease-io` | knob travel |
| Menu, popover, dropdown open | `opacity`, `transform` | `--dur-base` | `--ease-out` | `--travel-sm` |
| Dialog open | `opacity`, `transform: scale(0.98→1)` | `--dur-base` | `--ease-out` | none |
| Bottom sheet | `transform: translateY` | `--dur-slow` | `--ease-out` | full height |
| In-view reveal | `opacity`, `transform` | `--dur-reveal` | `--ease-out` | `--travel-lg` |
| Text mask reveal | `transform` on lines inside `.mask-line` | `--dur-reveal` | `--ease-out` | 100% of line |
| Stagger between siblings | | `--stagger` | | |
| Route transition | `opacity` | `--dur-page` | `--ease-out` | none |
| Toast enter | `opacity`, `transform` | `--dur-base` | `--ease-out` | `--travel-sm` |
| Skeleton pulse | `opacity` 0.4 to 0.8 | 1.6s | `--ease-io` | loop |
| Loader (the mark) | `opacity` per segment, `rotate` | 1.2s / 2.4s | linear | loop |

Only `transform`, `opacity`, `filter` and `clip-path` animate. Never
`height`, `width`, `top`, `left`, or a colour on a large area.

### Budgets by surface

| Surface | Budget |
|:---|:---|
| Marketing | Full: preloader once per session, scroll-linked pins and scrubs, one marquee, text masks, magnetic buttons, tilt and spotlight on cards, a shader hero. |
| Mobile app | Reduced: enter reveals, sheet and toggle motion, no scroll-linked effects, no pointer effects. |
| Dashboard | Reduced: enter reveals on first mount only, component state motion. |
| Form flow | Reduced: step transitions and field state only. |
| Console | Minimal: opacity on hover and state, nothing positional, no reveals. |

### Ownership

GSAP + ScrollTrigger owns everything scroll-linked. Motion (`motion/react`)
owns component state: menus, accordions, tilt, in-view. React Three Fiber
owns the hero shader and nothing else. CSS transitions own hover colour.
One element, one library. Lenis drives the scroll and GSAP's ticker drives
Lenis so pins and smooth scroll share a clock.

Pointer-driven effects write to motion values or the style property
directly. Never React state on pointer move.

### Reduced motion

Every duration token collapses to `0.001ms` under the media query and
every scroll-linked effect is inside `gsap.matchMedia()` or checks the
query before mounting. The preloader never plays. The page is static and
complete: nothing waits for a reveal to become visible.

---

## 7. Components

Every component declares every applicable state in both modes: rest, hover,
focus-visible, active, disabled, loading, invalid. Reference implementations
are in `code/react/primitives.tsx`. What follows is the contract.

### Buttons

Pill radius, `--control-h` tall, Geist 500, sentence case, an optional icon
disc on the right (`.btn-ico`, 2rem, round). Label says what happens.

| Variant | Rest | Hover | Active | Focus | Disabled | Loading |
|:---|:---|:---|:---|:---|:---|:---|
| Primary | `--accent` fill, `--on-accent` text | `--accent-hover` | scale 0.97 | ring | 40% opacity, no pointer | label hidden, mark loader in disc, `aria-busy` |
| Ghost | transparent, `--text`, `--border-standard` | border to bone 40% | scale 0.97 | ring | 40% | same |
| Bone | `--text` fill, `--text-inverse` text | slightly lighter via `color-mix` 92% | scale 0.97 | ring | 40% | same |
| Destructive | `--negative` fill, `--on-negative` | `--negative` at 90% | scale 0.97 | ring | 40% | same |

Invalid does not apply. A destructive action always confirms in a dialog
first unless it is undoable with a toast.

### Slabs (cards)

| Tone | Surface | Text | Use |
|:---|:---|:---|:---|
| Ink | bezel shell around `--canvas-2` (marketing) or `--app-surface` + hairline (app) | `--text` | Default |
| Accent | `--accent` | `--on-accent` | A colour block. One per viewport at most. |
| Deep | `--canvas-warm` | `--text` | The warm variant, once per page |
| Bone | `--text` | `--text-inverse` | An inversion, once per page |

States: rest (no shadow), hover (`--shadow-slab`, spotlight if interactive),
focus-visible (ring on the whole card if it is a link), selected
(`--border-selected`). A card is a link or it contains links, never both.

### Data table

Wrapper `--radius-slab`, hairline border, `--app-sunken` body on dark.
Header row Geist 500 `--text-label`, sticky. Row height `--row-h`. Hairline
between rows, no zebra. Numeric columns right-aligned, tabular figures.
Hover row `--app-raised`. Selected row `--accent` at 10% with a
`--line-selected` left edge. Sort indicator is a caret in `--text-2`; the
sorted header is `--text`. Select-all in the header, per-row checkbox.
States: empty (see feedback), loading (skeleton rows, three), error (inline
error state inside the wrapper, with retry). Column count over seven on a
phone becomes a card list.

### Forms

Field: label above (`--text-label`, 500, `--text-2`), control `--control-h`,
`--radius-control`, `--app-sunken` fill, `--border-standard`, helper below
in `--text-label` `--text-3` only when needed, placeholder in `--text-3`.
Required is stated in the label as `(required)` only when most fields are
optional; otherwise optional fields say `(optional)`.

| State | Border | Extra |
|:---|:---|:---|
| Rest | `--line-strong` | |
| Hover | bone 30% | |
| Focus | ring, border `--accent-text` | |
| Filled | `--line-strong` | value in `--text` |
| Invalid | `--negative`, 2px | message below in `--negative-text`, `aria-invalid`, `aria-describedby` |
| Disabled | `--line`, 50% opacity | no pointer |

Select: native on mobile, custom popover on desktop. Textarea: min three
rows, resizes vertically only. Toggle: `role="switch"`, pill track
`--control-h` × 0.5 tall, knob travels over `--dur-base`, on is `--accent`.
Segmented control: pill track in `--app-sunken`, selected option in
`--app-surface` with `--shadow-pressed`, `role="radiogroup"`. Checkbox and
radio: 20px, `--radius-control` / round, accent when checked, ink check
mark. Never two columns of inputs in a form flow.

### Navigation

| Pattern | Where | Spec |
|:---|:---|:---|
| Top bar pill | Marketing | Fixed, `--nav-h`, `--nav-max` wide, `.glass`, hides on scroll down and returns on scroll up, wordmark left, links centre, CTA right. Collapses to wordmark + menu button below `md`. |
| Full-screen menu | Marketing, mobile | Motion-driven, `.glass`, links in `--text-hero`, a note line and the contact details. |
| Sidebar | Dashboard | `--sidebar-w`, `--app-surface`, hairline right edge, lockup top, groups with kicker headings, active item `--accent-text` with a 2px accent left bar. Collapses to icons at `lg`, to a drawer below. |
| Bottom nav | Mobile app | Fixed, `--bottom-nav-h`, `.glass`, four or five items, icon + `--text-bottom-nav`, active `--accent-text`. Never more than five. |
| Stepper | Form flow | Top of page, step number in mono, current in `--accent-text`, done with a check, upcoming in `--text-3`. Linear only; no jumping ahead. |

Active states are colour and a bar or an underline, never colour alone.

### Overlays

| Overlay | Spec |
|:---|:---|
| Dialog | Centred, `--radius-panel`, `--app-surface`, `--shadow-strong`, max 480px, scrim ink at 60%, title `--text-title`, actions right-aligned with the primary last, closes on Escape and scrim, focus trapped, returns focus. |
| Bottom sheet | Mobile only, `--radius-sheet` top corners, `--shadow-sheet`, drag handle, snaps to content or 90%, scrim as dialog. |
| Popover | `--radius-panel`, `--app-raised`, `--shadow-strong`, anchored, `--travel-sm` enter. |
| Tooltip | `--app-inverse` fill, `--app-on-inverse` text, `--radius-control`, `--text-label`, delay 400ms, never holds anything interactive. |
| Toast | Bottom centre on mobile, bottom right on desktop, `--app-raised`, `--radius-slab`, `--shadow-strong`, icon in the semantic colour, one action at most, 5s or until dismissed, `role="status"`. |

### Feedback states

| State | Spec |
|:---|:---|
| Empty | Centred in the region, the mark in `--text-3` at 48px, a one-line title in `--text-slab`, one sentence of what to do, one primary button. Never a stock illustration. |
| Loading | Skeletons shaped like the content, `--app-raised` blocks pulsing. Use the mark loader only for a whole-page or a button-level wait. Never a spinner from a library. |
| Error | Inline in the region: title, the reason in one sentence, a retry button. Rose icon, not a red banner. For a whole page, the same centred like empty. |
| Success | A toast for an action, an inline check for a field, a full state only at the end of a form flow. |

---

## 8. Voice

- Sentence case everywhere, including buttons and nav.
- Say what the customer gets, not what the software has. "One place where the floor, the kitchen and the till agree", not "Integrated multi-module POS".
- Short sentences. Periods and commas. No em-dashes, no semicolons in UI, no exclamation marks.
- No Oxford comma.
- Numbers as digits in UI (`5 founders`), spelled out only when a sentence starts with them.
- Banned: leverage, seamless, cutting-edge, world-class, next-gen, revolutionise, empower, unlock, robust, innovative, solution (as a noun for software), synergy, delight.
- **CTAs** say what happens: `Start a project`, `Book a clinic demo`, `Send it to us`. Never `Submit`, `Get started`, `Learn more`, `Click here`.
- **Errors** say what went wrong and what to do, in that order, without blame: "Add your name and an email or phone number." Never "Invalid input", never "Oops".
- **Empty states** say what will appear here and how to make it appear: "No orders yet today. They will show up here as they come in." One sentence, then the button.
- **Confirmations** name the thing: "Delete table 4?" with buttons `Delete table` and `Keep it`. Never `Are you sure?` with `Yes` / `No`.
- **Money**: `Rs 12,500`. Dates: `19 Sep 2026`. Times: `14:05`.
- Address the reader as `you`, the studio as `we`. Products are `it`.
- Claims are limited to what the source material supports. Do not add a capability, a number or a client to fill space.

---

## 9. Accessibility

WCAG 2.1 AA is a build-time requirement. Measured ratios, sRGB relative
luminance:

### Dark mode

| Pair | Ratio | Passes |
|:---|:---|:---|
| `--text` on `--canvas` | 17.15 | AAA |
| `--text-2` on `--canvas` | 8.13 | AAA |
| `--text-3` on `--canvas` | 3.67 | Large text only |
| `--text` on `--canvas-2` | 16.19 | AAA |
| `--text-2` on `--canvas-2` | 7.68 | AAA |
| `--text-3` on `--canvas-2` | 3.46 | Large text only |
| `--accent-text` on `--canvas` | 6.44 | AA |
| `--accent-text` on `--canvas-2` | 6.08 | AA |
| `--on-accent` on `--accent` | 6.44 | AA |
| `--text` on `--accent` | 2.66 | **Fails. Never.** |
| `--text-inverse` on `--text` (bone slab) | 17.15 | AAA |
| `--positive-text` on `--canvas` | 9.97 | AAA |
| `--negative-text` on `--canvas` | 6.62 | AA |
| `--attention-text` on `--canvas` | 11.72 | AAA |
| `--info-text` on `--canvas` | 9.14 | AAA |
| `--on-positive` on `--positive` | 9.97 | AAA |
| `--on-negative` on `--negative` | 6.62 | AA |
| `--on-attention` on `--attention` | 11.72 | AAA |
| `--on-info` on `--info` | 9.14 | AAA |
| `--chart-1` to `-6` on `--canvas` | 6.44, 9.14, 9.97, 11.72, 7.97, 8.13 | AA or better |

### Light mode

| Pair | Ratio | Passes |
|:---|:---|:---|
| `--text` on `--canvas` | 16.58 | AAA |
| `--text-2` on `--canvas` | 6.55 | AA |
| `--text-3` on `--canvas` | 3.52 | Large text only |
| `--text` on `--canvas-2` | 15.15 | AAA |
| `--text-2` on `--canvas-2` | 5.99 | AA |
| `--accent-text` on `--canvas` | 5.21 | AA |
| `--accent` (fill) on `--canvas` | 3.02 | Non-text only |
| `--on-accent` on `--accent` | 5.78 | AA |
| `--accent-deep` on `--canvas` | 4.70 | AA |
| `--text-inverse` on `--text` | 16.58 | AAA |
| `--positive-text` on `--canvas` | 4.72 | AA |
| `--negative-text` on `--canvas` | 5.22 | AA |
| `--attention-text` on `--canvas` | 5.89 | AA |
| `--info-text` on `--canvas` | 5.40 | AA |
| `--on-positive` on `--positive` | 4.72 | AA |
| `--on-negative` on `--negative` | 5.22 | AA |
| `--on-attention` on `--attention` | 11.14 | AAA |
| `--on-info` on `--info` | 5.40 | AA |
| `--chart-1` to `-6` on `--canvas` | 3.02, 5.40, 4.72, 3.82, 5.36, 6.55 | Marks only for 1 and 4 |

### Standing requirements

1. Focus is always visible: the 2px `--focus-ring` outline with 4px offset on every focusable element, never removed.
2. Tap targets are at least `--touch-min` on touch devices, at every density.
3. Colour is never the only signal. A state has an icon, a label, a bar or an underline as well.
4. Every image has alt text that says what it shows or `alt=""` if decorative. Founder portraits say name and role.
5. Every form control has a visible label bound with `for`/`id`. Placeholder is not a label.
6. Errors are announced: `aria-invalid`, `aria-describedby` to the message, and the first invalid field receives focus on submit.
7. Dialogs trap focus, close on Escape, and return focus to the opener. Sheets too.
8. Everything works with a keyboard alone, in reading order, with no traps. Custom widgets carry the right role and keyboard model (switch, radiogroup, tablist, menu).
9. Text zooms to 200% without loss and reflows at 320px wide without horizontal scroll.
10. Forced colours mode (Windows high contrast) is respected: no `forced-color-adjust: none`, borders present on controls so they survive.
11. Motion respects `prefers-reduced-motion` (see §6) and nothing flashes more than three times a second.
12. Live regions for toasts (`role="status"`) and for async table updates (`aria-live="polite"`).

---

## 10. Extending the system

**A new token.** Add it to `tokens.css` in both `:root` and `html.light`
with a comment. Run `node tokens/build-tokens.js`. Add it to
`tailwind-v4.css` and `tailwind-v3.cjs`. Document it in the matching
section here. Log it in `CHANGELOG.md` with a minor version bump.

**A new component.** Write its contract in §7 first: every state, both
modes, keyboard model, which tokens. Then the reference in
`code/react/primitives.tsx`, bound to tokens only. Add it to PRE-SHIP.md if
it introduces a new gate (a new ARIA pattern, say). Log it.

**A new archetype.** Only when none of the five in SURFACES.md fits a whole
product surface, not a screen. Answer every field in the archetype table
and add a branch to the decision tree. Log it with a minor bump.

**A deviation.** A product that must break a rule records it in its
`project-profile.md` deviation register with the reason and a review date.
Deviations from the hard constraints in §1 are not deviations; they are
bugs, and the answer is to fix the product.
