# Navigation

Sidebar, app bar, command bar, breadcrumbs, tabs, pagination, mobile tabs and sheets, the marketing header pill and menu. Traces: P4 (glass is chrome), P5, SM3.

## Sidebar (dashboard, workspace, settings)

**Anatomy**: `layout-sidebar-w` 264, `surface-primary`, hairline on the inline-end edge, padding `space-6 space-4` · lockup at the top (mark 24 + wordmark or the product name in `h4`) · groups with an `h6` kicker · items (`--control-h` − 4, `radius-control`, icon 18 + label `button` type) · footer: branch switcher, appearance toggle, the user.
**States**: rest (`text-secondary`) · hover (`text-primary`, `interaction-hover`) · current (`accent-text`, `accent-soft` background, a 2px `accent-fill` bar at the inline-start, `aria-current="page"`) · focus ring · with a count badge.
**Collapse**: at `lg` → rail 64 (icons only, tooltips on hover, current bar stays); below `md` → a drawer (T3.3) opened from the app bar's menu button; user-collapsible on desktop with a toggle at the bottom (T6.8), remembered.
**Groups**: ≤ 3 groups, ≤ 7 items each; the console link first for operators.
**Don't**: a sidebar on phones; glass on the sidebar (it scrolls); nested trees deeper than one level.

## App bar (apps)

56px sticky (`z-app-bar`), `surface-canvas` with a hairline below; on desktop glass is permitted because it is fixed (P4); on touch always solid. Left: menu button (< md), page title `h1` at 20px when compressed (T7.2), breadcrumbs on desktop. Right: search (`⌘K`), notifications bell with a count, the user avatar (menu). Never a primary action in the app bar; it belongs to the page header.

## Page header (apps)

Below the app bar: kicker `h6` (context), title `h1`, one sentence, actions (≤ 3: one primary, ghosts; overflow to a menu beyond 3). On phones actions collapse to the primary + overflow.

## Command bar / palette (`⌘K`)

`patterns/search-and-command.md`. A dialog at the top centre (T3.7): search input, grouped results (Pages, Orders, Patients, Actions), keyboard first.

## Breadcrumbs

`body-s`, `text-secondary`, `/` separators in `text-tertiary`, current item `text-primary` not a link, ≤ 4 levels, collapse the middle to `…` (a menu) beyond 4; hidden on phones (the back button carries the parent).

## Tabs

**Anatomy**: a row of `button` type labels with a 2px indicator that travels (T6.5), hairline under the row; `role="tablist"`, arrow keys move, automatic activation on desktop, manual on touch; ≤ 6 tabs, overflow scrolls horizontally with a fade. Selected `text-primary` + indicator `accent-fill`; rest `text-secondary`. Counts in mono after the label. Tabs never hide the dominant region (R5); they split a subordinate rail or a drawer.

## Pagination

Only where virtualisation is impossible (printed reports, exports): `1–50 of 812` in mono + ◀ ▶ icon buttons + a page-size select. Tables virtualise by default.

## Bottom nav (phones)

`layout-bottom-nav-h` 64 + safe area, fixed, glass, `z-header`; 4–5 items, icon 24 (`fill` weight when current) + `bottom-nav` label; current `accent-text`; a centre FAB only in utility apps that create constantly (Qeemat). Never more than 5; the fifth is "More" if needed. Hides on scroll down in feeds (T? uses the header pattern M6), never in forms.

## Sheets as navigation (phones)

Secondary navigation (filters, sort, account switch) opens a bottom sheet (T3.2) with a drag handle, a title, and a list; the sheet closes on selection.

## Stepper (form flows)

`core-primitives.md`-style list: number in a 24px ring (mono), label `body-s` 500; current `accent-text` with the ring filled `accent-fill`; done `text-secondary` with a check; upcoming `text-tertiary`; linear, no jumping ahead; on phones only the current step label and "2 of 5".

## Marketing header pill (canonical)

Fixed, 56px tall, `layout-nav-max` 1120, `radius-pill`, glass, `z-header`; lockup left, links centre (`nav` type, roll text on hover T1.9), CTA + theme toggle + menu button right; hides on scroll down after 200px and returns on scroll up (M6); collapses to lockup + menu below `md`.

## Marketing menu (canonical)

Full-screen, canvas 90% + blur 40, links in display-tight at `clamp(2.6rem, 9vw, 6.5rem)`, T3.6.

## Back

Apps: a `←` icon button at the inline-start of the page header on detail views (`aria-label="Back to orders"`) plus the platform gesture; never a "Back" text button in the app bar on iOS-style screens.

## Skip links

`Skip to main` first in the DOM; `Skip to results` above tables in consoles.

## Platforms

Flutter: `NavigationRail` (desktop) and `NavigationBar` (phones) restyled with the tokens (indicator `accentSoft`, selected icon `accentText`, label `bottomNav` size, height 64); the app bar as a `SliverAppBar` with `surfaceCanvas` and a hairline `bottom`.
