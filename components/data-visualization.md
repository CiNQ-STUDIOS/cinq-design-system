# Data visualisation

Traces: P1 (series 1 is the brand), P2 (area fills are alpha), D-013. Tokens: `chart.*`, `gradient.chart-area*`, `typography.overline/body-s/numeric`. Generated: `--chart-1..6`, `--chart-grid`, `--chart-axis-text`, `react_tokens.ts chartSeries()`.

## 1. Palette and order

| Series | Dark | Light | Name |
|:--|:--|:--|:--|
| 1 | `#f9633a` vermilion | `#e8521f` (600) | the brand; the primary measure |
| 2 | `#7db3ff` sky | `#174c9c` | |
| 3 | `#4fcf8e` mint | `#14613b` | |
| 4 | `#f2c14e` gold | `#a56f00` | |
| 5 | `#c58bff` lilac | `#7b3fd1` | |
| 6 | `#aca69b` bone 2 | `#5a554d` | "other", totals |

Fixed order: the same measure keeps the same colour on every screen of a product (revenue is always series 1). Never reorder to look balanced. Beyond 6 series, group into "Other" (series 6). Sequential ramps: vermilion 100 → 700 (5 steps) on ink, 200 → 800 on paper. Diverging: rose 400 ↔ bone 2 ↔ mint 400. Status colouring uses `feedback-*` and always a legend.

## 2. Anatomy and styling

| Element | Style |
|:--|:--|
| Canvas | The region's surface; no card of its own unless it is the dominant region's container |
| Gridlines | `chart-grid` (text 8%), 1px, horizontal only; no vertical gridlines; no border box |
| Axis labels | `body-s` mono for numbers (`overline` size), `text-secondary` (`chart-axis-text`); tabular; 4–6 ticks; abbreviated `Rs 12k`, `184.5k` |
| Axis lines | none; the baseline is a `line-hairline` |
| Line | 2px, `stroke-linecap: round`, series colour; no dots except on hover (6px, series colour, 2px surface ring) |
| Area | `gradient-chart-area` (series 1 at 24% → 0) under series 1 only; series 2 at 20%; never a third |
| Bars | flat series colour, `radius-control / 3` (4px) top corners, gap 40% of bar width; stacked bars separated by a 1px surface line |
| Donut | ring width 12% of diameter, 2px surface gaps; the total in `numeric` at the centre; ≤ 5 slices |
| Heatmap | cells `radius-check` 6, sequential ramp, value on hover |
| Legend | below or right, chips with an 8px swatch (round for lines, square for bars), `body-s`; clickable to toggle a series (`aria-pressed`) |
| Tooltip | `surface-inverse` / `text-inverse`, `radius-control`, shows the x value in `overline` and each series value tabular with its swatch; follows the nearest point, snaps to x |
| Annotation | a dashed 1px `text-tertiary` line with a mono label (`Ramadan`, `Price change`); a threshold band is `feedback-warning-bg` |
| Now-line (temporal) | 2px `accent-fill` only when series 1 is not vermilion in that chart (P1 budget), otherwise `text-primary` |
| Empty | the axes drawn, the mark at 32 in `text-tertiary`, "No sales yet." |
| Loading | the axes drawn, a skeleton rectangle for the plot area |

Sizes: 320 tall in dashboards (280 `md`, 240 phones), sparklines 32 × 96 in tables (no axes, series colour, no area).

## 3. Motion

T9.3 draw-in on first mount (line `stroke-dashoffset` `page` `out`; bars `scaleY` from the baseline `base` `stagger` 40; area `opacity` after), T9.4 updates (FLIP `base` `in-out`), tooltip T1.8 without the delay, legend toggle crossfade `base`. Reduced motion: final state instantly. No gradient animation.

## 4. Meaning independent of hue

Every series has a name in a legend and a value in a tooltip; stacked and multi-line charts offer a table toggle (`Show as table`); colour-vision safety: series 1–4 are distinguishable in deuteranopia (vermilion, sky, mint, gold) and every line may add a marker shape (circle, square, triangle, diamond) when a product profile requires it.

## 5. Accessibility

`role="img"` with `aria-label` summarising ("Revenue by hour, Rs 184,500 today, peak at 20:00"), a visually hidden `<table>` with the data, keyboard focus moves between points with arrow keys announcing values, tooltips on focus.

## 6. Number and date formats

`content-voice.md` §4: `Rs 12,500`, abbreviated axis `Rs 12k`; hours `14:00`; days `Mon 15`; months `Sep`. Percent one decimal.

## 7. Libraries

Web: any SVG charting library (Recharts, visx, D3) with colours from `chartSeries(mode)` in `react_tokens.ts` and fonts from the tokens; never the library's default palette or animation curves. Flutter: `fl_chart` with `CinqColorsDark.chart1…6`, `CinqCurve.out`, durations from `CinqDuration`. Charts never use canvas alone without the table alternative.

## 8. Do / don't

Do: one chart per region, the primary measure in vermilion, a table toggle. Don't: 3D, drop shadows on bars, gradient bars, rainbow palettes, pie charts with more than 5 slices, dual y-axes (use two charts), animated gradients.
