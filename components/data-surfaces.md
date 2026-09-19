# Data surfaces

Tables, operational cards, detail drawers, metric indicators, lists, timelines, key-value grids. Traces: P5, R7 (cards only for repeated peers), SM5.

## Data table

**Anatomy**: wrapper (`radius-slab`, hairline inset, `surface-sunken` body) · toolbar above (search, filters, view switcher, density toggle, column picker) · sticky header row (`surface-primary`, `body-s` 500 `text-secondary`, sort caret 24px hit) · rows (`--row-h`) · cells (`--control-pad-x` padding, `body` at `--body-size`) · bulk bar (appears on selection, sticky at the bottom of the wrapper) · footer line (count, `1–50 of 812` mono).
**Densities**: comfortable 52 · compact 40 · dense 32 · touch 64. Density toggle in the toolbar for workspaces; consoles are dense by default.
**Columns**: text (left) · numeric (right, tabular) · status (badge) · date (mono `19 Sep, 14:05`) · actions (icon buttons, appear on hover on desktop, always on touch) · selection (checkbox 20, select-all with indeterminate). Pinning: first column sticky (`.cq-sticky`) when horizontal scroll exists; a pinned actions column at the end in consoles. Max 9 visible columns at `lg`; a column picker hides the rest.
**Rows**: hairline between; no zebra; hover `surface-raised`; selected `accent-soft` + 2px `line-selected` inset at the start; focused row an inset ring; expanded row (T6.6) shows a detail band on `surface-primary`; a new live row gets `live-edge` (T9.5).
**Sorting**: click header cycles asc → desc → none; `aria-sort`; multi-sort with Shift.
**Filtering**: chips in the toolbar; a saved view is a named set of filters + sort + columns, in a `[All ▾]` select at the toolbar start.
**Inline edit**: double-click or Enter on an editable cell → an Input fills the cell; Esc cancels, Enter/Tab commits with T2.5 optimistic; a pencil icon on hover marks editable cells.
**Bulk actions**: the bulk bar lists the count and ≤ 4 actions (one destructive, last); confirm destructive with a dialog naming the count.
**Virtualisation**: rows beyond 100 are windowed; scroll position restored on back.
**Responsive**: ≤ 6 columns at `md`; < `md` a card list (one row → one card: primary text, secondary line, one numeric, one badge, chevron) unless the table is a console (then horizontal scroll with the first column sticky).
**States**: loading (header + 8–10 skeleton rows matching column widths) · empty (first-use / no-results / cleared variants inside the wrapper) · error (inline with Retry) · partial (a banner row "3 rows could not load").
**Motion**: T6.1 insert, T6.2 remove, T6.3 reorder, T6.6 expand, T2.5 optimistic, live edge.
**Accessibility**: `<table>` semantics; `<caption class="cq-sr-only">`; `scope="col"`; sortable headers are buttons; row selection announced; `aria-live="polite"` on `<tbody>` for live tables; keyboard: arrows move the focused row, Space selects, Enter opens.
**Flutter**: `DataTable` is not used (its density and shape are Material); a `ListView.builder` of row widgets with a sticky header via `SliverPersistentHeader`, or `two_dimensional_scrollables` for pinned columns.
**Don't**: cards for rows; a modal for row detail (use the drawer); truncating a price; zebra stripes; more than one accent element in a row.

## Operational card (queue item, ticket)

The one card in the system that is not a peer-grid card: a queue row that needs more than one line (kitchen ticket, dispatch job). `surface-primary`, hairline, `radius-slab` 16 (12 dense), padding `space-4`; header line: id mono + elapsed timer mono + status badge; body: items as a compact list (qty × name); footer: one action (touch 56). Ordered by urgency; a new one gets `live-edge`. Never more than 3 lines of body without "+n more". On a kitchen display in touch mode, tapping the card advances its status with a haptic; a long-press opens the detail sheet.

## Detail drawer

`layout-drawer-w` 480 (full width < md as a route), `surface-overlay`, hairline on the inline-start edge, `shadow-strong`, `z-overlay`, T3.3; header: kicker + `h2` title + status + ✕; tabs allowed (Summary, history, bills); body scrolls independently; footer with ≤ 2 actions (one primary) sticky. Opening a drawer keeps the table visible and the selected row highlighted; Escape closes; focus trapped and returned. The drawer never stacks on another drawer; a second level opens a dialog or replaces the content with a back.

## Metric indicator (inline)

Not a tile: a `numeric`-lite line inside a region header, `h3` value in tabular figures + delta arrow `body-s` in `feedback-success-text` / `feedback-danger-text` + a `text-tertiary` label. Used when one number belongs to a table or chart (R7: no card for one number).

## Stat tile row

`core-primitives.md` Stat tile; the row is one subordinate region; ≤ 4 tiles; the value in `accent-fill` is the focal group (only when the row is the view's fill region, i.e. no primary button on the same view; otherwise values are `text-primary`).

## List (mobile and rails)

Rows `--row-h` (52 comfortable / 64 touch), leading icon or avatar 40, primary `body` 500, secondary `body-s` `text-secondary`, trailing value tabular or chevron, hairline between, `interaction-hover` on desktop, `interaction-pressed` on touch; sections with an `h6` kicker; swipe actions (T8.1) on phones for archive/delete with the action's feedback colour revealed behind.

## Key-value grid (record rails)

Two-column definition list: key `body-s` `text-secondary`, value `body` tabular where numeric, 8px row gap, groups with an `h6` kicker and a hairline; on phones stacked (key above value). Copyable values (ids, phones) get a trailing copy icon button.

## Timeline

Vertical list of events: a 2px line `line-hairline` with 8px dots (`text-tertiary`; the latest `accent-fill`), time mono `text-tertiary`, text `body`; newest at the top in rails, oldest at the top in audit views; grouped by day with an `h6` date header.

## Kanban (optional, dispatch and pipelines)

Columns `surface-sunken` with `h6` headers and counts; cards are operational cards; drag T6.7; ≤ 5 columns visible, horizontal scroll beyond; WIP limits shown as `3 / 5` in the header, exceeding turns the count `feedback-warning-text`.

## Calendar / day view (clinics)

Time grid: hour rows 60px (15-min lines hairline), doctor/chair columns ≥ 180px, the now-line 2px `accent-fill` with a mono time tag, appointments as blocks on `surface-primary` with a 3px status edge (`feedback-*`), title `body-s` 500, drag to move (T6.7) with a haptic, resize handles on hover; current day column has `interaction-hover` as a wash.
