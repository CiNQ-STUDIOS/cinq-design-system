# Anti-bento grammar

Traces: P5 (one thing reads first), P1 (one accent), SM4 (colour blocks), SM11 (kicker · headline · lead). Tag: proposed (D-023), driven by the RMS failure in `audit/GAP_ANALYSIS.md` §1.

## 1. Why bento fails in operational and productivity software

A bento is a grid of equal or near-equal cards. It photographs well and explains nothing. In a tool it fails for five reasons, each observable:

| Failure | What you see | Why it hurts |
|:--|:--|:--|
| **Equal visual weight** | Six cards of the same size, radius, surface and heading style | The eye has no first stop; the user scans everything to find anything. |
| **No reading path** | Cards ordered by what fit, not by what the user does first | Task order is lost; the next action is not adjacent to its cause. |
| **Container-first** | Each datum gets a card because cards were the unit | Relationships between data (this order → this table → this kitchen station) are cut at the card edge. |
| **Fragmentation** | A KPI here, its trend there, its cause in a third card | One question needs three cards and a mental join. |
| **Density inefficiency** | 24px padding × 6 cards × 2 sides, plus headings, plus gaps | Half the viewport is chrome; a cashier sees eight orders instead of twenty. |

A theme applied to a bento is still a bento. That is the reskin.

## 2. CiNQ's alternative: dominant region, subordinate rails

Every view has **one dominant region** that answers the view's question, and at most three subordinate regions that support it. Weight is expressed by area, surface step, type role and position, in that order.

```
┌───────────────────────────────────────────────┬───────────────┐
│ kicker                                        │ subordinate   │
│ HEADLINE (one line, what this view is)        │ rail          │
│                                               │ (facts,       │
│  DOMINANT REGION                              │  filters,     │
│  ≥ 40% of content area                        │  next actions)│
│  the table / the queue / the record / the form│               │
│                                               ├───────────────┤
│                                               │ subordinate 2 │
├───────────────────────────────────────────────┴───────────────┤
│ subordinate 3 (optional, full width, lower weight)             │
└───────────────────────────────────────────────────────────────┘
```

## 3. Rules (testable)

| # | Rule | Test |
|:--|:--|:--|
| R1 | **One dominant region ≥ 40%** of the content area (excluding chrome) in every view. | Measure bounding boxes; the largest region ≥ 0.4 × content area. |
| R2 | **≤ 4 regions per view** (dominant + ≤ 3). A "region" is a bounded area with its own heading or role. | Count regions; > 4 fails. |
| R3 | **Weight ratio ≥ 2:1** between the dominant region and the next largest. No two regions within 20% of each other's area unless they are peers in a repeated set (R7). | area(dominant) / area(second) ≥ 2. |
| R4 | **One focal element**: exactly one of {primary button, colour block, display numeral group, selected item} per viewport. | Count vermilion fill regions = 1 (D-014). |
| R5 | **Reading path stated**: every screen's spec names its path (F, Z, or anchor-and-rail) and the regions are placed on it. Consoles: anchor-and-rail (the queue is the anchor, actions on the rail). Dashboards: F (headline numbers, then the chart, then the table). Forms: single column top-down. Detail: anchor (header) then two columns. | The screen's profile entry or component doc names the path; the first three focus stops follow it. |
| R6 | **Accent budget** (D-014): one vermilion fill region per viewport. | Count. |
| R7 | **Cards only for repeated peers**: a card is permitted when it is one of ≥ 3 sibling items of the same shape (orders, products, founders) or when it frames a single elevated task (a form column, an auth panel). A single datum never gets its own card. | Any `surface-primary` container that contains one heading + one value and has no siblings of the same shape → fails. |
| R8 | **Whitespace carries hierarchy**: the gap between regions is ≥ 2× the gap inside a region; the gap above a heading is ≥ 1.5× the gap below it. | Measure `--gap-lg` vs `--gap` usage. |
| R9 | **Progressive disclosure in three tiers**: visible (what the user acts on now), one tap away (a rail, a drawer, an expand), two taps away (settings, history). Nothing important is at tier 3; nothing rare is at tier 1. | Each screen spec lists its tiers. |

## 4. Weight vocabulary

How to make a region dominant without adding colour:

1. **Area** (R1).
2. **Surface step**: the dominant region sits on `surface-sunken` (a well) or directly on the canvas; subordinates sit on `surface-primary`. The eye goes to the well.
3. **Type**: the dominant region's title is `h1`/`display-s`; subordinates use `h4`/`h6` kicker.
4. **Position**: top-left (LTR) or top-right (RTL) of the content area, or centred for a single-task screen.
5. **Density**: the dominant region may be one density step denser than its rails (a dense table beside compact controls).

Never by: a bigger shadow, a brighter background, a gradient, a border colour.

## 5. When generic grids are acceptable

| Case | Why | Constraint |
|:--|:--|:--|
| Product or menu catalogue (RMS menu, Dentisto treatments) | Items are true peers; the user is choosing among equals | Cards are one shape; the grid has a heading row that is the dominant region's title; a selected card becomes the focal element |
| Media galleries | | |
| Settings tiles on a mobile home | | ≤ 8 tiles, one row of them is enough |
| Marketing bento (the products section) | Marketing is allowed spectacle; SM12 alternates families so the bento is one section among others | Never two bento sections; the big cell is 2× the others (R3 holds inside the bento) |
| A stat row (4 tiles) | They are a repeated set (R7) that together form one subordinate region | The row is never the dominant region; the chart or table below it is |

## 6. Anti-patterns, named

| Anti-pattern | Replace with |
|:--|:--|
| Dashboard of 6 equal KPI cards | Stat row (one region) + a dominant chart or table |
| "Overview" page with a card per module | A home that is the console or the dashboard, with the modules in the sidebar |
| Card inside a card inside a card | A region with a heading and a hairline divider |
| A card for one number | The number inline in the region's header (`numeric` role) |
| Tabs to hide equal-weight panels | One panel dominant, the rest in a rail or a drawer |
| Everything in a modal | A drawer for edit, inline for view, a modal only for a decision |
| Same 24px padding everywhere | Padding by density and by tier (`grid-and-spacing.md` §5) |

## 7. The squint and greyscale tests

Blur the screen: one region should remain a distinct mass, the rails smaller masses, chrome a frame. Remove colour: hierarchy must survive on area, surface step and type alone. Both are run on every archetype reference screen (`governance/TESTING.md`). A screen that passes both cannot be a bento.
