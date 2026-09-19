# Archetypes

Nine layout archetypes (D-022). Every screen in a CiNQ product is one of these; `screen-inventory.md` maps each screen type to one. Each archetype answers: wireframe, proportions, region roles, density, gradient and glow use, motion budget, and its five lifecycle states. Rules cite `anti-bento-grammar.md` (R1–R9) and `audit/BRAND_DNA.md` (P, SM). Working reference screens are in `showcase/archetypes/`.

## Decision tree

```
Is the user signed in?
├─ no ── is it the marketing site or a public product page? → platforms/marketing-and-demos.md
│        otherwise (login, MFA, recovery, invite) → 9 AUTH / ENTRY
└─ yes
   Is it one linear task with an end (setup, onboarding, a wizard, checkout)? → 4 SETUP / ONBOARDING
   Is it a single record (an order, a patient, a product)? → 5 DETAIL / RECORD
   Is it settings or configuration? → 8 SETTINGS
   Primary device a phone? → 6 MOBILE UTILITY
   Primary device a tablet, kiosk or till? → 7 TABLET / KIOSK
   Does the operator watch it for hours and act on live items? → 1 OPERATIONAL CONSOLE
   Is it KPIs and charts with drill-down? → 2 EXECUTIVE DASHBOARD
   Otherwise (a table with actions and a detail drawer) → 3 DATA WORKSPACE
```

Between two, take the plainer (console over dashboard, workspace over dashboard).

---

## 1. Operational console

Order dispatch, kitchen display, POS, inventory receiving, live queues. The operator's eyes live here.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ▤ Branch 1 · Floor        [Live ●]  14:05   ⌘K  Search   ⚙  Hamza      │  app bar 56, glass on desktop
├──────────────────────────────────────────┬───────────────────────────────┤
│ QUEUE (dominant, ≥ 60%)                  │ RAIL (≤ 40%)                  │
│ ┌────┬────────────────┬──────┬────────┐  │ ┌─ Selected: #412 ─────────┐ │
│ │#412│ T4 · Karahi +4 │ 12m  │ READY ●│  │ │ items, notes, timer      │ │
│ │#413│ D · Biryani    │  3m  │ NEW    │  │ │ [Send to kitchen] (1 fill)│ │
│ │#414│ T9 · Naan ×6   │  1m  │ NEW    │  │ ├─ Next actions ────────────┤ │
│ │ …  │                │      │        │  │ │ Void · Split · Print KOT  │ │
│ └────┴────────────────┴──────┴────────┘  │ └───────────────────────────┘ │
│ 18 open · 3 ready · avg 9m               │ Stations: Grill 4 · Tandoor 2 │
└──────────────────────────────────────────┴───────────────────────────────┘
```

| Field | Value |
|:--|:--|
| Proportions | Queue : rail = 62 : 38 at `lg`+; stacked (queue, then rail as a sheet) below. No max width. |
| Region roles | Queue (dominant): rows on `surface-sunken`, sticky header, first column sticky. Rail: the selected item's detail and its actions; one primary. Footer line: live counts. |
| Reading path | Anchor-and-rail: the newest/most urgent row is the anchor; actions on the rail. |
| Density | Dense (desktop), touch (till). |
| Type | `h3` title; mono for ids, times, statuses; no display face. |
| Gradient / glow | None, except `live-edge` on a new row (2s) and `glow-breathe` on the Live dot. Zero ambience. |
| Motion budget | Minimal: T1.1 hover, T2.6 ticker, T9.5 live, T3.2 sheet on touch. No reveals, no transforms on rows. |
| Shadows | `shadow-strong` on a popover only. |
| Keyboard | Every action has a shortcut listed in `?`; arrow keys move the anchor; Enter opens the rail; N new order. |
| Never | A card per order; a modal for a routine action; hiding a column to fit; pagination (virtualise); decorative motion; a second accent fill. |

Lifecycle: **Idle** rows at rest, Live dot breathing. **Loading** 8 skeleton rows matching the column geometry, rail skeleton. **Empty** "No open orders. New ones show up here as they come in." with the mark, no CTA (orders come from customers) or `New order` on a till. **Error** inline banner above the queue: "Lost connection to the kitchen display. Orders are queued." + Retry; rows stay. **Success** a row's status changes with T2.6 and a haptic on touch; never a toast for routine changes.

## 2. Executive dashboard

KPIs, temporal charts, drill-down. Owners and managers, weekly.

```
┌────────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR    │ Today · Branch 1 ▾            [This week ▾]     ⌘K  ⚙  Hamza │
│ 264        ├──────────────────────────────────────────────────────────────┤
│ Overview   │ Rs 184,500  ▲ 12%   ·   412 orders   ·   avg Rs 448   ·  9m  │  stat row (one region)
│ Orders     ├────────────────────────────────────────────┬─────────────────┤
│ Menu       │ REVENUE BY HOUR (dominant, ≥ 55%)          │ Top items       │
│ Staff      │  ╭──╮   ╭────╮                             │ 1 Karahi   142  │
│ Reports    │ ╭╯  ╰───╯    ╰─╮  ▂▃▅▇▆▃                   │ 2 Biryani  118  │
│ Settings   │ ...                                        │ 3 Naan      96  │
│            ├────────────────────────────────────────────┴─────────────────┤
│ ● Dark/Light│ Recent orders (table, 8 rows)                    See all →   │
└────────────┴──────────────────────────────────────────────────────────────┘
```

| Field | Value |
|:--|:--|
| Proportions | Sidebar 264 + content ≤ 1600. Stat row full width (one region, R7 set). Chart 8/12, rail 4/12. Table full width below. |
| Region roles | Stat row (subordinate 1), chart (dominant), top list (subordinate 2), recent table (subordinate 3). |
| Reading path | F: numbers → chart → table. |
| Density | Compact. |
| Type | `h1` page title; `numeric` in stat tiles (vermilion, the focal group: R4); `h4` region headings. |
| Gradient / glow | `chart-area` under series 1; nothing else. |
| Motion | Reduced: T7.1-style `fade-up` on first mount for regions (stagger 60, cap 4), T9.1 count-up once, T9.3 chart draw-in, T9.4 updates. No scroll effects, no tilt. |
| Shadows | Popovers and the date picker only. |
| Never | Six equal KPI cards; a card per chart; a hero; tilt/spotlight; a second chart with an area fill. |

Lifecycle: **Idle** rest. **Loading** stat tiles as four skeleton blocks of their exact size, chart region a skeleton rectangle with the axis lines drawn, table 5 rows. **Empty** (new branch) chart region: "No sales yet. The first order will draw the first bar." + `Open the till`. **Error** chart region inline error with Retry; other regions unaffected. **Success** n/a (read-only); export → toast "Report emailed to hamza@…".

## 3. Data workspace

Table-centric: menu items, patients, staff, inventory. Saved views, bulk actions, a detail drawer.

```
┌────────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR    │ Patients                        [+ New patient] (1 fill) ⌘K  │
│            ├──────────────────────────────────────────────────────────────┤
│            │ [All ▾] [Search…      ] [Doctor ▾] [Status ▾]   ⋯   ⇅        │  toolbar
│            ├──────────────────────────────────────────────────────────────┤
│            │ ☐ Name        MRN     Last visit   Doctor   Balance  Status  │  sticky header
│            │ ☐ Ayesha Khan 00412   19 Sep 2026  Dr Sara  Rs 0     Active  │
│            │ ☑ Bilal Ahmed 00398   12 Sep 2026  Dr Sara  Rs 4,500 Due   ◀ │ selected: accent-soft + left edge
│            │ …                                                            │
│            ├──────────────────────────────────────────────────────────────┤
│            │ 1 selected · [Message] [Export] [Archive]        1–50 of 812 │  bulk bar (appears on select)
└────────────┴──────────────────────────────────────────────────────────────┘
                                          ┌────── DRAWER 480 ──────────────┐
                                          │ Bilal Ahmed · 00398        ✕   │
                                          │ tabs: Summary · Visits · Bills │
                                          └────────────────────────────────┘
```

| Field | Value |
|:--|:--|
| Proportions | Table is the dominant region (≥ 70%); toolbar and bulk bar are chrome; drawer `layout-drawer-w` 480 over the right edge (T3.3), never a modal. |
| Reading path | Z: title/new → filters → rows → bulk bar. |
| Density | Compact; dense opt-in. |
| Gradient / glow | None. |
| Motion | T3.3 drawer, T6.1/6.2 insert/remove, T2.5 optimistic, T3.5 toast with Undo. |
| Never | Cards for rows; a modal for edit; more than 9 columns without pinning; pagination under 200 rows (virtualise). |

Lifecycle: **Idle**. **Loading** header + 10 skeleton rows. **Empty** first-use: "No patients yet." + `New patient` / no-results: "No patients match. Clear filters?" / cleared: "Archived patients are in the archive view." **Error** inline in the table wrapper with Retry. **Success** row insert T6.1 + toast "Ayesha Khan added · Open".

## 4. Setup / onboarding

A focused canvas, one elevated task: branch setup, first login, a wizard, checkout.

```
┌──────────────────────────────────────────────────────────────┐
│  C  CiNQ RMS                                     Save & exit  │
│                                                              │
│            ① Branch  ② Menu  ③ Staff  ④ Till  ⑤ Review        │  stepper, mono
│         ┌──────────── 560 ─────────────────────────┐         │
│         │ Set up Branch 1                          │         │
│         │ Where it is and when it opens.           │         │
│         │ Branch name         [ Branch 1        ]  │         │
│         │ Address             [                 ]  │         │
│         │ Opening hours       [ 11:00 ] – [ 23:00] │         │
│         │                                          │         │
│         │            [Back]      [Continue] (fill) │         │
│         └──────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────┘
```

| Field | Value |
|:--|:--|
| Proportions | One column `layout-form-col` 560 centred on `surface-primary` (marketing may use the bezel); the canvas is empty around it. |
| Reading path | Single column, top-down. Stepper above, actions below, Continue primary and inline-end. |
| Density | Comfortable, even inside a compact app. |
| Gradient / glow | None (one `ambience-accent` behind the column is permitted on the first and last steps only). |
| Motion | T6.x step slide `translateX(±travel-lg)` `base`; T2.3 field errors; T2.4 success morph on the last step. |
| Never | Two columns of inputs; optional steps; a step without a title; losing data on Back; "Submit". |

Lifecycle: **Idle** step 1. **Loading** (resume) the column skeleton with the stepper live. **Empty** n/a. **Error** field-level (T2.3) and a step-level banner if the save fails: "We could not save this step. Your entries are kept. Try again." **Success** review step then "Branch 1 is set up. Orders can start now." + `Open the till`.

## 5. Detail / record view

One order, one patient, one product, one invoice.

```
┌────────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR    │ ← Orders   ORDER · #412                [Void] [Print] [Edit] │
│            │ Table 4 · Karahi +4 · 14:05 · Hamza                   READY │
│            ├───────────────────────────────────────┬──────────────────────┤
│            │ ITEMS (dominant, 7/12)                │ RAIL (5/12)          │
│            │ 2 × Chicken karahi        Rs 3,200    │ Customer             │
│            │ 4 × Naan                  Rs   400    │ Ayesha · +92 …       │
│            │ 1 × Raita                 Rs   150    │ Payment              │
│            │ ───────────────────────────────────   │ Cash · Rs 3,750 · ✓  │
│            │ Total                     Rs 3,750    │ Timeline             │
│            │                                       │ 14:05 placed · 14:09 │
└────────────┴───────────────────────────────────────┴──────────────────────┘
```

| Field | Value |
|:--|:--|
| Proportions | Header (kicker `h6` + `h1` + status badge + actions) full width; body 7/12 dominant; rail 5/12. Below `lg` the rail follows the body. |
| Reading path | Anchor (header) then two columns, body first. |
| Density | Comfortable (records are read), compact inside a workspace drawer. |
| Gradient / glow | None. |
| Motion | T5.1 shared title from the list; T6.6 row expand; T3.5 toasts. |
| Never | Tabs that hide the total; a card per field; editing inline without an explicit Edit state. |

Lifecycle: **Idle**. **Loading** header skeleton (2 lines) + body rows + rail blocks. **Empty** n/a (a record exists) / a section empty: "No payments yet." **Error** "Order #412 could not be loaded." + Retry + back link. **Success** action toasts with Undo where reversible.

## 6. Mobile utility screen

Phone-first, signed in: Qeemat, the waiter app, the customer app, the patient app.

```
┌──────────────────────┐
│ Balance          ⚙   │  top bar 56
│ Rs 100,000  ▲ 2.4%   │  numeric, the focal element
│ Income · Spent       │
├──────────────────────┤
│ TODAY (dominant)     │
│ ● Salary   +Rs 100k  │
│ ● Fuel      −Rs 4,500│  rows, 52
│ ● Careem    −Rs 850  │
│ …                    │
│                 (+)  │  FAB = the one primary
├──────────────────────┤
│ Home Receipts Money  │  bottom nav 64, glass
└──────────────────────┘
```

| Field | Value |
|:--|:--|
| Proportions | Single column, 20px gutters; the summary (numeric) is the focal element, the list the dominant region. |
| Reading path | Top-down; thumb zone holds the primary (FAB or bottom bar). |
| Density | Comfortable; 44px targets. |
| Gradient / glow | One `ambience-accent` behind the summary is permitted. |
| Motion | T3.2 sheets, T8.1–8.3 gestures, T6.1 list enter, T9.1 count-up on the balance once. No pointer effects. |
| Never | Hover as the only affordance; a table; a sidebar; a dialog where a sheet works; text < 13px. |

Lifecycle: **Idle**. **Loading** summary skeleton + 6 row skeletons. **Empty** "Nothing logged today. Bank alerts and receipts show up here on their own." + `Add an entry`. **Error** inline: "Could not refresh. Showing what is saved on this phone." + Retry. **Success** row enters T6.1, haptic medium on save, toast with Undo.

## 7. Tablet / kiosk / POS

Touch-first, held or mounted, in bright rooms with wet hands: the till, the customer kiosk, the kitchen display.

```
┌──────────────────────────────────────┬──────────────────────────┐
│ MENU (dominant, 60%)                 │ ORDER (40%)              │
│ [Karahi] [BBQ] [Rice] [Bread] [Drink]│ Table 4                  │
│ ┌────────┐ ┌────────┐ ┌────────┐     │ 2 × Chicken karahi 3,200 │
│ │Chicken │ │Mutton  │ │Paneer  │     │ 4 × Naan             400 │
│ │karahi  │ │karahi  │ │karahi  │     │                          │
│ │Rs 1,600│ │Rs 2,200│ │Rs 1,200│     │ Total          Rs 3,750  │
│ └────────┘ └────────┘ └────────┘     │ [ Send to kitchen ] fill │  56px
│ ┌────────┐ ┌────────┐ ┌────────┐     │ [ Pay ]     [ Hold ]     │
└──────────────────────────────────────┴──────────────────────────┘
```

| Field | Value |
|:--|:--|
| Proportions | Menu 60 / order 40 in landscape; portrait: menu on top 60vh, order as a persistent bottom panel. |
| Region roles | Menu grid (peers, R7 permits cards), order ticket (dominant by role at the moment of decision), one primary. |
| Density | Touch: 56px controls, 64px rows, `body-size` 17, icons 24, `bold` icon weight. |
| Canvas | Ink by default; paper permitted per profile for glare (the till at a window); high contrast recommended. |
| Gradient / glow | None. No glass (touch): app bar is `surface-primary`. |
| Motion | T1.7 touch press, T3.2 sheets, T2.6 totals roll. Nothing else. Haptics per `sound-and-haptics.md`. |
| Never | Hover states; small text; glass; drag as the only way; a modal that covers the order; more than one primary. |

Lifecycle: **Idle** menu at rest. **Loading** menu tiles skeleton (their aspect). **Empty** order panel: "No items yet. Tap a dish." **Error** payment: inline in the order panel, rose, "Card declined. Try again or take cash." **Success** payment: full-panel success state 2s with the mark (the one place it is allowed), haptic success, then a new order.

## 8. Settings / configuration

Profile, org, roles, billing, integrations, API keys.

```
┌────────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR    │ Settings                                                     │
│            ├────────────────┬─────────────────────────────────────────────┤
│            │ Profile        │ Roles and permissions                       │
│            │ Branch         │ Who can do what at Branch 1.                │
│            │ Roles ◀        │ ┌───────────────────────────────────────┐   │
│            │ Billing        │ │ Owner    all                          │   │
│            │ Integrations   │ │ Manager  orders, menu, staff, reports │   │
│            │ API keys       │ │ Waiter   orders on the floor          │   │
│            │ Appearance     │ │ Cashier  till, payments               │   │
│            │                │ └───────────────────────────────────────┘   │
│            │                │                                  [Save]     │
└────────────┴────────────────┴─────────────────────────────────────────────┘
```

| Field | Value |
|:--|:--|
| Proportions | Settings nav 4/12, content 8/12 (dominant); single column below `lg` with the nav as a list page. |
| Reading path | Nav → title → groups top-down; each group a heading, a sentence, its fields; Save at the end of the page or sticky on long pages. |
| Density | Comfortable (desktop operators may set compact). |
| Gradient / glow | None. |
| Motion | T1.5 toggles, T2.4 save morph, T3.1 confirm dialogs for destructive changes. |
| Never | Auto-save on toggles without a visible "Saved"; a card per setting; hiding danger actions in a menu (they live in a "Danger" group at the bottom with rose text). |

Lifecycle: **Idle**. **Loading** group skeletons. **Empty** integrations: "No integrations connected." + `Connect`. **Error** save failure banner at the top of the group, fields keep values. **Success** T2.4 on Save, toast "Saved".

## 9. Auth / entry

Login, MFA, recovery, invite acceptance, session expiry.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              C  CiNQ RMS                             │
│        ┌──────── 400 ─────────┐                      │
│        │ Sign in              │                      │
│        │ Email or phone       │                      │
│        │ [                  ] │                      │
│        │ Password             │                      │
│        │ [                  ] │                      │
│        │ [ Continue ]   fill  │                      │
│        │ Forgot password?     │                      │
│        └──────────────────────┘                      │
│        Branch 1 · Islamabad                          │
└──────────────────────────────────────────────────────┘
```

| Field | Value |
|:--|:--|
| Proportions | One panel 400 wide, centred vertically; the mark and product name above; nothing else on the canvas. Marketing may put the shader behind; apps do not. |
| Reading path | Top-down. |
| Density | Comfortable; touch on a till (a PIN pad: 3 × 4 grid of 64px keys). |
| Gradient / glow | Apps: none. |
| Motion | T2.3 errors; T4 route to the app on success; MFA code fields auto-advance with T1.6. |
| Never | Social login buttons in brand colours (P1: one accent; other brands' marks render in `text-primary` on ghost buttons); a marketing headline; an image column. |

Lifecycle: **Idle**. **Loading** button loading state only. **Empty** n/a. **Error** field-level: "That password is not right. Try again or reset it." (never "invalid credentials"); lockout banner with the time. **Success** route T4 forward. **Session expiry**: a dialog over the app "You were signed out after 8 hours. Sign in to continue; your unsaved work is kept." with the password field inline.

---

## Mapping from 1.0.0 surfaces

| 1.0.0 | 2.0.0 |
|:--|:--|
| marketing | `platforms/marketing-and-demos.md` |
| dashboard | 2 Executive dashboard, 3 Data workspace, 8 Settings |
| mobile-app | 6 Mobile utility |
| form-flow | 4 Setup / onboarding |
| console | 1 Operational console, 7 Tablet / kiosk |
| (none) | 5 Detail / record, 9 Auth / entry |
