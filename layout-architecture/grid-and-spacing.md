# Grid and spacing

Traces: P5 (one thing reads first), P7 (decks on a phone), SM12 (alternating families). Tokens: `space.*`, `layout.*`, `breakpoint.*`, `density.*`. Generated: `--space-*`, `--layout-*`, `--control-h` etc.

## 1. Spacing scale

4px base. `space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 · `6` 24 · `8` 32 · `10` 40 · `12` 48 · `16` 64 · `20` 80 · `24` 96 · `32` 128. Marketing sections: `space-section` `clamp(96px, 12vw, 200px)`. Page gutter: `space-gutter` `clamp(20px, 4.2vw, 64px)`.

Usage rule: inside a component use 1–4; between components in a region use `--gap` (density); between regions use `--gap-lg` × 2 (comfortable 48, compact 32, dense 24); between page sections `space-16`+ in apps, `space-section` in marketing. Never a spacing value that is not on the scale; never `margin` to nudge something into alignment.

## 2. Breakpoints

| Name | Width | What changes |
|:--|:--|:--|
| `sm` | 640 | Two-column form fields become one (already one in form flows); toolbars wrap |
| `md` | 768 | Phone → tablet. Bottom nav → sidebar rail; sheets → dialogs; product list → bento; founders list → strips |
| `lg` | 1024 | Sidebar rail → full sidebar; work deck → horizontal room; two-pane detail; table shows ≤ 9 columns |
| `xl` | 1280 | Marketing content max; dashboards add the third column (detail rail) |
| `2xl` | 1536 | Nothing (a laptop) |
| `3xl` | 1920 | Marketing tier: type and radii grow; work panels widen; process column 1720. Apps: nothing beyond `app-max` 1600 |

Responsive behaviour is always *reflow, collapse or hide with a way back*; nothing "shrinks" a control below its density height or text below 13px.

## 3. Grids

**Marketing**: content `layout-page-max` 1280 (1720 on 3xl), gutters `space-gutter`. 12 columns, 24px gutters, used for the hero (8/4 before 19 Sep, now a single stack), the bento (7/5), the contact split (5/7), the footer (5/3/3/1). Sections alternate layout families (SM12); no two adjacent sections share one.

**Dashboard / data workspace**: sidebar `layout-sidebar-w` 264 (rail 64 at `lg`) + content `layout-app-max` 1600 with `--gap-lg` gutters. Content grid: 12 columns, gutter `--gap` (16 compact), row gap `--gap-lg`. Regions span whole column groups (8/4, 7/5, 12) per the archetype; never 6/6 (equal weight, R3).

**Console**: no max width, full viewport, `--gap` (8 dense) between panes; panes are fixed-proportion splits (e.g. 62/38) defined by the archetype, not a card grid.

**Mobile utility**: single column, 20px gutters (`space-gutter` minimum), content max 560 centred on tablets.

**Form flow**: one column of `layout-form-col` 560, centred; never two columns of inputs.

**Detail / record**: 7/5 at `lg`+ (record body / rail), single column below.

**Settings**: 4/8 at `lg`+ (nav / content), single column below.

## 4. Density modes (D-024)

| Variable | Comfortable | Compact | Dense | Touch |
|:--|:--|:--|:--|:--|
| `--control-h` | 44 | 36 | 32 | 56 |
| `--control-pad-x` | 16 | 12 | 10 | 20 |
| `--gap` | 16 | 12 | 8 | 16 |
| `--gap-lg` | 24 | 16 | 12 | 24 |
| `--row-h` | 52 | 40 | 32 | 64 |
| `--body-size` | 15–17 fluid | 15 | 14 | 17 |
| `--icon` | 20 | 18 | 16 | 24 |
| Hit area (touch device) | 44 | 44 | 44 | 56 |

| Mode | Applies to |
|:--|:--|
| Comfortable (default) | Marketing, mobile utility, detail, settings, auth, onboarding |
| Compact | Executive dashboard, data workspace, desktop settings for operators |
| Dense | Operational console on desktop (opt-in via `data-density="dense"`) |
| Touch | Tablet/kiosk/POS, and any surface when `data-input="touch"` |

A user setting "Text size: Large" bumps `--body-size` one notch and sets `--control-h` to at least comfortable.

## 5. Vertical rhythm

Line grid 4px. Text roles' line-heights land on 4px multiples at their base size (body 15/24 at compact, 17/27.2 fluid rounds via `line-height: 1.6` which is accepted; headings at 1.1). Regions align to a 24px baseline in apps (`--gap-lg` compact = 16, so region padding is 24 always: `space-6`). Cards: padding `space-6` (24) comfortable/compact, `space-4` (16) dense, `space-8` (32) marketing (`p-7`→28 on phones is a canonical marketing exception).

## 6. Responsive rules per region type

| Region | ≥ lg | md | < md |
|:--|:--|:--|:--|
| Sidebar | full 264 | rail 64 (icons + tooltips) | drawer from the inline-start edge, opened from the app bar |
| App bar | 56 sticky | 56 | 56 + safe area, title truncates |
| Table | all columns ≤ 9, pinned first column | columns ≤ 6, horizontal scroll inside the wrapper, first column sticky | card list (one card per row: primary text, secondary, one number, one status) |
| Stat row | 4 tiles in one row | 2 × 2 | horizontal scroll-snap row of 2.2 tiles |
| Detail rail | right column 5/12 | below the body | a sheet opened from a "Details" button |
| Chart | full width of its region, 320 tall | 280 | 240, legend below |
| Filter bar | inline chips + inputs | chips wrap | a "Filters (2)" button → sheet |
| Two-pane (list + detail) | side by side 5/7 | side by side 5/7 | push: list → detail route with a back |
| Form | one column 560 | 560 | full width |
| Bottom nav | none | none | 64 + safe area |
| Toolbar with > 3 actions | all inline | primary + overflow menu | primary + overflow |

## 7. Layout constants

`layout-page-max` 1280 · `layout-page-max-3xl` 1720 · `layout-app-max` 1600 · `layout-nav-max` 1120 · `layout-nav-h` 72 (pill 56) · `layout-prose-max` 68ch · `layout-sidebar-w` 264 · `layout-sidebar-rail-w` 64 · `layout-bottom-nav-h` 64 · `layout-touch-min` 44 / 48 · `layout-form-col` 560 · `layout-dialog-max` 480 · `layout-drawer-w` 480 · `layout-work-panel` `min(84vw, 1240px)` (3xl `min(80vw, 1900px)`).

## 8. Verification

`tooling/lint` flags `margin`/`padding`/`gap` literals not on the scale and `grid-template-columns: repeat(auto-fit…)` (the bento tell) outside marketing; `tooling/audit-script` reports equal-column grids.
