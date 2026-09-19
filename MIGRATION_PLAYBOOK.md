# Migration playbook

How an existing product is moved onto the CiNQ design system without becoming a reskin, and the RMS case study that proves the difference. Five phases, each gated by `tooling/`. Traces: `audit/GAP_ANALYSIS.md` §1 (the failure), `layout-architecture/anti-bento-grammar.md`, `AGENT_RULES.md` §6.

## Phase 1 · Token binding

Goal: every literal becomes a token, nothing changes visually yet.

1. `npm run audit -- <product/src> --report audit-before.md`. Record the score and the per-category counts in the product's `project-profile.md`.
2. Install: `scripts/install-to-product.sh <product> --submodule` (vendors `brand/design-system/`), import `implementations/variables.css` first, then the Tailwind mapping for the version in use (`tailwind.v4.css` or the `tailwind.config.ts` preset), then `motion.css`, then `code/react/primitives.css`. Flutter: add `flutter_theme.dart` and set `theme: CinqTheme.dark()`.
3. Add `code/theme-init.ts` as the first script in `<head>`.
4. Codemods (run in order, review each diff):

| Find | Replace with |
|:--|:--|
| `#0c0b0a`, `#000`, `black`, `bg-gray-900/950`, `Colors.black` | `var(--surface-canvas)` / `CinqColorsDark.surfaceCanvas` |
| `#fff`, `white`, `bg-white`, `Colors.white` (as a surface) | `var(--surface-primary)` (dark) or `var(--surface-input)` for fields |
| Any grey text `text-gray-500/600`, `#6b7280`, `Colors.grey` | `var(--text-secondary)` |
| The old brand orange / blue / any accent hex | `var(--accent-fill)` for fills, `var(--accent-text)` for words |
| `red-*` / `green-*` / `yellow-*` / `blue-*` for states | `var(--feedback-danger/success/warning/info-*)` |
| `rounded-md/lg/xl`, `border-radius: 8px` | `var(--radius-control)` (fields), `var(--radius-slab)` (cards), `var(--radius-pill)` (buttons) |
| `shadow-sm/md/lg/xl`, any `box-shadow:` literal | none at rest; `var(--shadow-slab)` on hover; `var(--shadow-strong)` on popovers |
| `linear-gradient(…)`, `bg-gradient-to-*` | the catalog token or nothing |
| `transition: all 0.2s ease`, `duration-200`, `Curves.easeInOut` | `var(--dur-fast) var(--ease-out)` for colour, `var(--transition-<name>)` otherwise |
| `@keyframes …` | delete; use `.cq-anim-*` |
| `font-family:`, `font-size: 14px`, `font-semibold` | `.t-*` roles; weights 400/500/700/800 |
| `z-index: 9999` | `var(--z-<layer>)` |

Regexes for the audit categories are in `tooling/audit-script/audit.js`; run `npm run lint` on the product with `tooling/lint/eslint.config.mjs` and fix until clean.

5. Gate: `npm run audit` colour, gradient, shadow, motion, type categories at zero hits. Structure will still be high. **That score is the swap test result**: write it down; the product now has CiNQ colours and still is not CiNQ.

## Phase 2 · Structural deconstruction

Goal: every screen has an archetype, a dominant region and a reading path.

1. Inventory every route against `layout-architecture/screen-inventory.md`; assign an archetype; record in the profile.
2. Score each screen with the rubric (0–2 each, 10 max):

| Criterion | 0 | 1 | 2 |
|:--|:--|:--|:--|
| Dominant region ≥ 40% | equal cards | one larger | ≥ 40% and ≥ 2:1 |
| Regions ≤ 4 | > 6 | 5–6 | ≤ 4 |
| One focal fill | many accents | 2 | 1 |
| Reading path | none | implied | stated and followed |
| Cards only for peers | cards everywhere | some singles | peers only |

Screens under 6 are rebuilt on the archetype wireframe, not adjusted.

3. Rebuild order: the screen users see most (console for operators, dashboard for owners) → lists → detail → forms → settings → auth.
4. Gate: `npm run audit` structure at zero; squint and greyscale screenshots pass for every rebuilt screen (`governance/TESTING.md` §5).

## Phase 3 · Component replacement

| Generic | CiNQ |
|:--|:--|
| `<Button variant="contained">`, Material `ElevatedButton`, Bootstrap `.btn-primary` | `Button variant="primary"` (pill, disc, one per viewport) |
| Outlined / secondary button | `Button variant="ghost"` |
| Danger button | `Button variant="destructive"` + confirm dialog |
| Text field with floating label | `Field` + `Input` (label above, `line-boundary`) |
| Select / Autocomplete | native `Select` on phones; Combobox (`form-controls-advanced.md`) |
| Card | `Slab` only for repeated peers; otherwise a region with a heading |
| Data grid / `DataTable` | `Table` (sticky header, pinned first column, drawer detail, bulk bar) |
| Modal for edit | Drawer |
| Snackbar | `Toast` with Undo |
| Alert | Banner (inline) or Dialog (decision) |
| Tabs hiding equal panels | one dominant panel + a rail; tabs only inside drawers/rails |
| App bar with actions | app bar (search, account) + page header (title, ≤ 3 actions) |
| Drawer nav on desktop | Sidebar (264, rail at lg, drawer < md) |
| Bottom navigation with 6 items | 5 items + More |
| Spinner | the mark loader; skeletons for regions |
| Empty illustration | `EmptyState` (mark, one line, one action) |

Gate: `npm run lint` clean; every component's states present; `npm run audit` ≥ 90.

## Phase 4 · Flow and motion alignment

1. Onboarding to archetype 4 (`patterns/onboarding-flows.md`); empty states per variant; loading to geometry-matched skeletons; errors inline vs dialog per the escalation rule.
2. Replace every framework transition: routes → T4 (View Transitions / `CinqPageTransitionsBuilder`), dialogs → T3.1, sheets → T3.2, drawers → T3.3, menus → T3.4, toasts → T3.5, list changes → T6, tab indicators → T6.5, skeletons → T12. Strip Material ripples (`NoSplash`), Bootstrap fades, `animate-*` utilities.
3. Add the reduced-motion setting to Appearance.
4. Gate: `npm run motion:check` on the product; the motion lab's transitions are the only ones in use.

## Phase 5 · Verification

Run every acceptance test in `governance/TESTING.md` §6 on the migrated product; record results in the product profile's adoption table; register any deviation with a review date; tag the design system version used.

---

## RMS case study: orders and inventory

**Before** (the 1.0.0 reskin, RMS back office, owner signed in):

```
┌────────────┬─────────────────────────────────────────────────────────────┐
│ sidebar    │ Dashboard                                    [+ New] [Export]│
│            ├──────────────┬──────────────┬──────────────┬────────────────┤
│ ● Dashboard│ Today's sales│ Orders       │ Low stock    │ Staff on shift │  four equal cards
│ ● Orders   │ Rs 184,500   │ 412          │ 3 items      │ 6              │
│ ● Inventory├──────────────┼──────────────┼──────────────┼────────────────┤
│ ● Menu     │ Recent orders│ Top items    │ Inventory    │ Notifications  │  four more equal cards
│ ● Staff    │ (5 rows,     │ (list)       │ (list)       │ (list)         │
│ ● Reports  │  "View all") │              │              │                │
│ ● Settings ├──────────────┴──────────────┴──────────────┴────────────────┤
│            │ Sales chart (small, at the bottom, orange gradient fill)     │
└────────────┴─────────────────────────────────────────────────────────────┘
```

Diagnosis (rubric 2/10): eight equal cards (R1, R2, R3 fail); four vermilion elements (three card headers and the button; R4/R6 fail); no reading path (the chart, the one thing an owner reads, is last); orders and inventory fragmented into four cards that each show five rows and a "View all"; density comfortable on a screen an operator watches; framework fade on every card; a modal for order detail; the orange gradient on the chart at 100% alpha.

**After**, two screens instead of one "dashboard":

Operators (waiters, cashiers, kitchen) get the **operational console** (`showcase/archetypes/rms-after.html`): the order queue is the dominant region (62%), the selected order and its one primary action are the rail, inventory is a second dense table under the queue with low-stock as a banner in the app bar, stations are a filter, shortcuts are listed. Touch mode on the till (`showcase/archetypes/tablet-kiosk-pos.html`).

Owners get the **executive dashboard** (`showcase/archetypes/executive-dashboard.html`): one stat row (a set, R7), the revenue chart dominant (8/12) with the only area gradient, top items as a rail, recent orders as a table below linking to the workspace.

```
CONSOLE (operators)                                DASHBOARD (owners)
┌ app bar · Live · ⌘K · low-stock banner ─────┐    ┌ sidebar ┬ app bar · period ────────────┐
│ QUEUE 62%                    │ RAIL 38%     │    │         │ stat row (4, one region)      │
│ table, dense, sticky header  │ #412 items   │    │         ├──────────────────────┬────────┤
│ live edge on new rows        │ [Mark served]│    │         │ REVENUE BY HOUR 8/12 │ top 4/12│
│ station filter               │ KOT · Void   │    │         │ chart-area, one fill │        │
│ inventory table (dense)      │ shortcuts    │    │         ├──────────────────────┴────────┤
└──────────────────────────────┴──────────────┘    │         │ recent orders table → workspace│
                                                   └─────────┴───────────────────────────────┘
```

Token and component mapping applied: `surface-sunken` wells for tables; `Table` with `cq-live-row`; `Badge` tones from `feedback-*`; one `Button variant="primary"` per view; `accent-text` for links; `numeric` role for the four stats (vermilion only on revenue, the focal group); `chart-1` + `gradient-chart-area`; `Banner` warning for stock; `line-boundary` on the search.

Motion applied: T2.6 status roll, T9.5 live edge and breathing dot, T3.3 drawer for order detail from the workspace, T4.1 route crossfade, T12 skeletons; nothing else. Gradients: one (`chart-area`) on the dashboard, zero on the console.

Print: `Print KOT` sends the ticket format in `patterns/documents-and-print.md` §2 to the station printer; `Receipt` the 80mm format.

States: queue empty ("No open orders. New ones show up here as they come in."), queue error inline with retry and rows kept, offline banner with queued count, payment declined inline in the till's order panel, success on payment as a 2s full-panel state.

Rubric after: 10/10 on both screens. `npm run audit` on the reference screens: 100. Swap test: with `variables.css` replaced by a generic theme, the console still reads as CiNQ (a dense table with a rail, one action, a live edge), which is the point.
