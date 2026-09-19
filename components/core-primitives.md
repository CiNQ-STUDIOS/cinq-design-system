# Core primitives

Spec format for every component: anatomy · variants · sizes · tokens · behaviour · states · motion · gradient/glow · accessibility · platforms · do/don't · example. Reference code: `code/react/primitives.tsx` + `primitives.css` (classes `cq-*`). Traces: SM10 (the pill and the disc), P1, P8.

---

## Button

**Anatomy**: pill container · label · optional icon disc (right, 32px round) · loader slot.
**Variants**: primary (`accent-fill` / `text-on-accent`) · ghost (transparent, `line-standard` inset, `text-primary`) · bone (`surface-inverse` / `text-inverse`) · destructive (`feedback-danger-solid` / `on-solid`) · icon-only (round, 44/36/56 by density, `aria-label`) · split (primary + a chevron segment that opens a menu, one hairline between) · link-style (text only, `accent-text`, underline on hover; for tertiary actions in running text).
**Sizes**: md = `--control-h` (44/36/32/56 by density), sm = `--control-h` − 8, lg (marketing hero only) 52.
**Tokens**: `radius-pill`, `typography.button` (Geist 500, 15px, −0.01em), `control-pad-x` (label side × 1.4), `transition-button-color`, `transition-press`.
**Behaviour**: label says what happens (`content-voice.md`); one primary per viewport (R4/D-014); destructive confirms unless undoable; loading keeps width and disables.
**States**: rest · hover (`accent-hover` / ghost line 40% / bone `color-mix` 92% / danger 90%; disc lifts `translate(2px,−2px) scale(1.06)`) · focus-visible (ring) · active (`scale(0.97)`, primary fill `accent-active`) · disabled (opacity 0.4, no pointer) · loading (T2.7).
**Motion**: T1.2 colour `slow`, disc `press`; T1.3 press; T2.4 success morph; touch T1.7.
**Gradient/glow**: none. A button is flat.
**Accessibility**: `<button>` or `<a>`; icon-only has `aria-label`; loading sets `aria-busy` and `disabled`; min 44px hit area on touch; the split's chevron is its own button with `aria-haspopup="menu"`.
**Platforms**: Flutter `FilledButton` restyled (shape `StadiumBorder`, minimumSize `Size(0, 44)`, `NoSplash`), icon disc as a `Container` child; touch density bumps to 56.
**Do**: `Send to kitchen ↗`, `Book a clinic demo`. **Don't**: `Submit`, two primaries in a toolbar, a vermilion icon-only button next to a primary.
```tsx
<Button variant="primary" icon={<ArrowUpRight size={16} weight="bold" />}>Start a project</Button>
<Button variant="destructive" onClick={confirmVoid}>Void order</Button>
```

## Input (text, number, email, tel, search, password)

**Anatomy**: label (above, `body-s` 500, `text-secondary`) · control (`--control-h`, `radius-control`, `surface-input`, `line-boundary`) · optional leading icon / trailing action (clear, show password) · helper or error line.
**Variants**: default · with icon · with unit (`Rs` prefix, `kg` suffix in `text-tertiary`) · search (leading magnifier, `radius-pill` in toolbars) · number (right-aligned, tabular, steppers in dense only) · password (trailing eye, `aria-pressed`).
**Sizes**: by density.
**States**: rest (`line-boundary`) · hover (text 30%) · focus (border `accent-text` + ring) · filled · invalid (2px `feedback-danger-solid`, message) · disabled (opacity 0.5, `line-hairline`) · read-only (no border, `surface-primary`).
**Motion**: T2.3.
**Accessibility**: `<label for>`; `aria-describedby` for help/error; `aria-invalid`; `inputmode` set (`numeric`, `tel`, `email`); autocomplete tokens; never placeholder-only.
**Platforms**: Flutter `InputDecoration` with `OutlineInputBorder(borderRadius: 12, borderSide: lineBoundary)`, focused `accentText`, error `feedbackDangerSolid` width 2.
**Do**: `Email or phone` with `(optional)` on the minority. **Don't**: floating labels, placeholder as label, red text without an icon.

## Textarea

As Input; min 3 rows, `resize: vertical`, `radius-control`, padding `control-pad-x × 0.75`; auto-grow to 8 rows in sheets; character count as helper text only when a limit exists ("120 / 160").

## Select (native) and Combobox

**Select**: native `<select>` styled as Input with a chevron; used on phones and for ≤ 12 options. **Combobox**: `form-controls-advanced.md`.

## Checkbox, radio, switch

**Checkbox**: 20px, `radius-check` 6, `surface-input` + `line-boundary`; checked `accent-fill` with an ink check drawn by `clip-path` (T1.6); indeterminate an ink bar; label to the right, whole row clickable; group with a `<fieldset>`.
**Radio**: 20px round, checked `accent-fill` ring 6px with ink centre.
**Switch**: `role="switch"`, track `control-h × 1.1` wide × `control-h × 0.6` tall, knob travels over `base` `in-out` (T1.5); on `accent-fill` with ink knob; off `text 18%` track with bone knob; label left or right, `aria-checked`. A switch applies immediately (and shows "Saved" if persisted); a checkbox waits for Save.
**Segmented control**: `role="radiogroup"`, pill track `surface-sunken` + hairline, selected option `surface-primary` + `shadow-pressed`, arrow keys move, ≤ 5 options, otherwise tabs or a select.

## Chip / tag

**Anatomy**: pill, `badge` type or `body-s`, optional leading icon, optional trailing ✕ (remove) or check (selectable).
**Variants**: filter (selectable, `aria-pressed`; selected `accent-soft` + `line-selected` + `accent-text`) · input chip (removable) · static tag (`surface-raised`).
**Sizes**: 28 / 32 / 40 (dense / compact / touch).
**Do**: filter chips wrap into a "Filters (2)" button on phones. **Don't**: a vermilion-filled chip (it is not a button).

## Badge (status)

Pill, `badge` type (mono uppercase 11px), a 6px dot before the text in `currentColor`, `feedback-*-bg` + `feedback-*-text`, or neutral (`text 8%` + `text-secondary`), or accent (`accent-soft` + `accent-text`, one per view). Height 22 / 24 / 28. Never clickable; a clickable badge is a chip. Numeric badge (count) on a nav item: 18px round, `accent-fill`, ink digits, max "99+".

## Avatar

`iconography-imagery.md` §6. Sizes 24/32/40/56; fallback initials; status dot 8px with a 2px `surface-primary` ring; group overlap 8px, max 4 + `+n`.

## Tooltip

`surface-inverse` / `text-inverse`, `radius-control`, `body-s`, padding 6 × 10, arrow none, shows after `tooltip-delay` 400 on hover and immediately on focus, hides on blur/leave/Escape, never contains interactive content, never the only way to learn a control's name on touch (use a label). T1.8.

## Dropdown / context menu

**Anatomy**: `surface-raised`, `radius-panel`, `shadow-strong`, hairline; items `--control-h` − 4 tall, `body`, leading icon 18, trailing shortcut in mono `text-tertiary`; groups separated by a hairline and an `h6` kicker; destructive items `feedback-danger-text` in the last group.
**Behaviour**: `role="menu"`, arrow keys, Home/End, type-ahead, Escape closes and returns focus, click outside closes; opens from its anchor's side (T3.4); on phones a bottom sheet (T3.2) instead.
**Do**: ≤ 8 items per group. **Don't**: nested submenus beyond one level; a menu as primary navigation.

## Link

`accent-text`, underline on hover (offset 4px), `text-primary` for nav links with a bar/underline when current; external links get `↗` (`ArrowUpRight` 14) and `rel="noopener"`.

## Divider

`line-hairline`, 1px; vertical dividers only in toolbars; never two in a row; a heading with a hairline under it is the section separator in settings.

## Icon button and icon

`iconography-imagery.md` §2. Round, `interaction-hover` on hover, ring on focus, `aria-label`.

## Loader (the mark)

`Loader` component: `.cq-loader` (spin 2.4s, chase 1.2s), `role="status"`, `aria-label="Loading"`; sizes 16 (inline), 24 (button disc), 32, 48 (region), 64 (splash). Colour inherits: `accent-fill` default, `text-tertiary` inline, `text-on-accent` in a primary button.

## Stat tile

`surface-primary` + hairline, `h6` kicker (`text-tertiary`), `numeric` value (`accent-fill`, the view's focal group), delta line `body-s` with `feedback-success-text` ▲ / `feedback-danger-text` ▼ and a label. Four in a row (R7 set); on phones a scroll-snap row. T9.1 once.

---

## The primitives file

`code/react/primitives.tsx` implements Button, ButtonLink, Slab, Field, Input, Select, Textarea, Toggle, Segmented, Checkbox, Badge, StatTile, Table, TopBar, AppTopBar, Sidebar, BottomNav, Stepper, Dialog, BottomSheet, Toast, ToastRegion, EmptyState, ErrorState, Skeleton, Mark, Loader, with no dependencies; `primitives.css` binds every class to a token. Components in this document without a primitive yet (split button, chip, avatar, tooltip, menu, stat delta) are specified here first and added to the primitives file per `governance/CONTRIBUTING.md`.
