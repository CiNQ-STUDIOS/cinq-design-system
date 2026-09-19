# CiNQ. The pre-ship gate.

Walk this before reporting any UI work as done. A is blocking: nothing
ships with an A item unchecked. B is required: fix it or register it in the
product profile's deviation log with a reason and a review date. C is
release-level: required before a version goes to real users.

Report using the template at the end. Do not summarise the checklist as
"all good"; list what you checked and what you found.

---

## A. Blockers

### A1. Tokens
- [ ] A1.1 No hex, rgb, hsl or named colour in any component or page file. Grep for `#[0-9a-f]{3,8}`, `rgb(`, `hsl(`.
- [ ] A1.2 No literal `px` radius, shadow, or `ms`/`s` duration outside `tokens.css`.
- [ ] A1.3 No font-family or font-size literal; every size is a `--text-*` token or its Tailwind utility.
- [ ] A1.4 No `--amber` in UI. No vermilion ramp step used as text without a measured ratio.

### A2. Both modes
- [ ] A2.1 Every screen viewed in dark and in `html.light`. Nothing disappears, nothing fails contrast, nothing keeps a dark-only colour.
- [ ] A2.2 The footer stays ink in light mode. The header pill and glass surfaces invert.
- [ ] A2.3 `theme-color` meta updates on toggle. No flash of the wrong mode on load (the init script is the first thing in `<head>`).

### A3. Accessibility basics
- [ ] A3.1 Every text pair is one from the measured tables in DESIGN.md §9 or has been measured and passes 4.5:1 (3:1 for large).
- [ ] A3.2 Focus ring visible on every focusable element with the keyboard. No `outline: none` anywhere without a replacement.
- [ ] A3.3 Every form control has a bound visible label. Every image has alt or `alt=""`.
- [ ] A3.4 Whole flow completes with keyboard only. Dialogs and sheets trap and return focus, close on Escape.
- [ ] A3.5 Tap targets 44px on touch, at every density.
- [ ] A3.6 State is never colour alone.

### A4. States
- [ ] A4.1 Every button has rest, hover, focus-visible, active, disabled and loading.
- [ ] A4.2 Every field has rest, hover, focus, filled, invalid (with a message) and disabled.
- [ ] A4.3 Every list, table and region has empty, loading and error states that follow DESIGN.md §7.
- [ ] A4.4 Every async action reports success (toast, inline or full state) and failure (with a retry).

### A5. Motion
- [ ] A5.1 Only `transform`, `opacity`, `filter`, `clip-path` animate.
- [ ] A5.2 With `prefers-reduced-motion: reduce` the page is complete and static: nothing hidden behind a reveal, no preloader, no scroll effects mounted.
- [ ] A5.3 One library per element. Scroll effects are in GSAP `matchMedia`; component state is Motion or CSS.
- [ ] A5.4 The surface's motion budget (SURFACES.md) is not exceeded.

### A6. Content
- [ ] A6.1 The name is written `CiNQ` everywhere it appears, including product names.
- [ ] A6.2 Sentence case in every heading, label and button. No em-dashes. No banned words (DESIGN.md §8).
- [ ] A6.3 Every button says what happens. No `Submit`, `OK`, `Learn more`.
- [ ] A6.4 No invented numbers, names, addresses, testimonials or client logos. No lorem ipsum.
- [ ] A6.5 Money and dates in the profile's locale format.

---

## B. Required

### B1. Archetype fidelity
- [ ] B1.1 The surface's archetype is named in the profile and the screen follows its table: canvas family, density attribute, radius ceiling, nav pattern, shadow rules, "never here" list.
- [ ] B1.2 Marketing: adjacent sections use different layout families; one section per viewport; hero has at most a three-line headline, a 20-word sub and two buttons.
- [ ] B1.3 Dashboard and console: no bezel cards, no display type above `--text-title`, no scrolling glass.
- [ ] B1.4 Mobile: bottom nav has five items or fewer, sheets not dialogs, no hover-only affordances.
- [ ] B1.5 Form flow: one column, a stepper, Back keeps data, a review step before anything irreversible.

### B2. Layout
- [ ] B2.1 Content respects `--page-max` / `--app-max` / `--prose-max` and the `--pad` gutter.
- [ ] B2.2 Works at 320px wide without horizontal scroll, and at 200% zoom.
- [ ] B2.3 Nested radii step down by the padding. No larger radius inside a smaller.
- [ ] B2.4 Layout holds with real content lengths: a 40-character name, a 6-digit price, an empty optional field, a 200-word note.

### B3. Numbers and type
- [ ] B3.1 Tabular figures in every column of numbers. Right-aligned.
- [ ] B3.2 `Rs 12,500` style money, `19 Sep 2026` dates, 24-hour times in tools.
- [ ] B3.3 Only weights 400, 500, 700, 800 appear. No bold body text.
- [ ] B3.4 Kickers and eyebrows are mono, uppercase, tracked. Nothing else is uppercase.
- [ ] B3.5 Headings balance, paragraphs are pretty-wrapped, body never exceeds 68ch.

### B4. Code quality
- [ ] B4.1 Components come from `code/react/primitives.tsx` or match its contract; no parallel button, input or dialog was written.
- [ ] B4.2 Custom CSS lives in `@layer components` so utilities win.
- [ ] B4.3 Icons are Phosphor at one weight per surface (regular for marketing and mobile, bold in consoles), sized to the text they sit beside.
- [ ] B4.4 No pointer-move handler sets React state. No layout thrash (reads after writes) in an animation frame.
- [ ] B4.5 Copy lives in a content module, not inline in components.

---

## C. Release-level

- [ ] C1 Lighthouse on a throttled mobile profile: Performance 90+, Accessibility 100, Best practices 100, SEO 100 for marketing; Performance 80+ and Accessibility 100 for apps.
- [ ] C2 Tested on a real iPhone and a real Android phone for mobile surfaces; on a real touch till for the cashier console.
- [ ] C3 A full pass with a screen reader (VoiceOver on iOS or NVDA on Windows): every control announced with its role, name and state; every error announced; every live region heard.
- [ ] C4 Forced-colours mode on Windows: controls keep their borders, focus still visible.
- [ ] C5 Fonts load with `display: swap` and no layout shift over 0.05 CLS.
- [ ] C6 Both modes checked on an OLED phone at low brightness for the dark canvas and on a dim laptop for paper.

---

## Report template

```
## Pre-ship report · <product> · <surface> · <date>

Archetype: <marketing | dashboard | mobile-app | form-flow | console>
Density: <comfortable | compact | dense>
Modes checked: dark, light
Reduced motion checked: yes

### A. Blockers
A1 tokens: pass. Grep for hex/rgb/px/ms in <paths>: 0 hits.
A2 modes: pass. <what was looked at>
A3 accessibility: pass. <pairs measured, keyboard path walked>
A4 states: pass. <components and the states exercised>
A5 motion: pass. <libraries used, matchMedia confirmed>
A6 content: pass. <copy source, banned-word grep>

### B. Required
<each item: pass, or "deviation D-<n>" with a pointer to the profile>

### C. Release-level
<each item: pass, not run (why), or the numbers>

### Deviations registered
D-<n>: <rule> · <reason> · review <date>

### Open questions for the owner
<anything the agent could not decide>
```
