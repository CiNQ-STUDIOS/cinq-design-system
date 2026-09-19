# Colour system

Traces: P1 (one accent, one light), P2 (gradients are alpha), SM4 (colour blocks), SM7 (ambient vermilion). Tokens: `foundations/tokens.json` → `color.*`. Generated: `implementations/variables.css` (`--surface-*`, `--text-*`, `--accent-*`, `--line-*`, `--feedback-*`, `--interaction-*`, `--chart-*`, `--footer-*`), `flutter_theme.dart` (`CinqColorsDark`, `CinqColorsLight`).

## 1. Layers

```
primitive  ──►  semantic  ──►  component
#f9633a         accent.fill     .cq-btn-primary { background: var(--accent-fill) }
```

A product touches only the semantic layer. A component file that names a primitive (`--color-vermilion-500`) or a hex fails lint (`tooling/lint`). The one exception is `color.primitive.amber` and `rose-shader`, which exist so the shader and the OG image can be reproduced and are banned from UI by the same lint rule.

## 2. Primitives

Every value canonical unless tagged.

### Neutrals (warm)

| Step | Hex | HSL | RGBA | Name in the kit |
|:--|:--|:--|:--|:--|
| 50 | `#f7f4ee` | 40° 36% 95% | 247 244 238 | derived |
| 100 | `#f3efe7` | 40° 33% 93% | 243 239 231 | Bone |
| 200 | `#e6dfd1` | 40° 30% 86% | 230 223 209 | Paper 2 |
| 300 | `#cdc6b8` | 40° 17% 76% | 205 198 184 | Paper 4 (light bezel) |
| 400 | `#aca69b` | 39° 9% 64% | 172 166 155 | Bone 2 |
| 500 | `#857f74` | 39° 7% 49% | 133 127 116 | Light text 3 |
| 600 | `#6f6a62` | 37° 6% 41% | 111 106 98 | Bone 3 |
| 700 | `#5a554d` | 37° 8% 33% | 90 85 77 | Light text 2 |
| 800 | `#2a2723` | 34° 9% 15% | 42 39 35 | Ink 4 |
| 900 | `#1d1b18` | 36° 9% 10% | 29 27 24 | Ink 3 |
| 925 | `#141311` | 40° 8% 7% | 20 19 17 | Ink 2 |
| 950 | `#0c0b0a` | 30° 9% 4% | 12 11 10 | Ink |

Paper: `#efe9dd` (40° 36% 90%, 239 233 221), canonical since 19 Sep (D-004). Paper warm `#efe3d3`. Ink warm `#1a1410`. Ink deep `#080807` (derived, the input well). Graphite 1–3 `#14120f` / `#5a554d` / `#7a7368` are the light-mode text roles.

### Vermilion (the brand hue, OKLCH hue 36°)

| Step | Hex | HSL | Role |
|:--|:--|:--|:--|
| 50 | `#fff1ec` | 16° 100% 96% | tint |
| 100 | `#ffdfd6` | 13° 100% 92% | tint |
| 200 | `#ffbfad` | 13° 100% 84% | tint |
| 300 | `#ffbfad`→`#fa9b81` | 13° 92% 74% | high-contrast accent text on ink |
| 400 | `#f07554` | 13° 84% 64% | |
| **500** | **`#f9633a`** | **13° 94% 60%** | **the accent** (canonical) |
| 600 | `#e8521f` | 15° 82% 52% | active (pressed) on ink, chart-1 on paper |
| 700 | `#af2f02` | 16° 98% 35% | |
| 800 | `#892504` | 15° 94% 28% | |
| 900 | `#651b05` | 14° 91% 21% | |
| 950 | `#431104` | 12° 89% 14% | |

Named: hover `#ff7c57`, paper fill `#ef5a2f` (canonical), paper hover `#f97048`, paper active `#dc4318`, paper text `#9e2d0b` (D-033; the kit's `#b8360f` was 5.1:1 on the old paper and falls to 3.99:1 on paper 3), deep `#c9330c` (canonical, "gradients and print shadows only"). Step 600 is `#e8521f`, the pressed fill on ink, so ink text stays 5.30:1.

### Signals

| Family | 400 (on ink) | 700 (on paper) | Role |
|:--|:--|:--|:--|
| Mint | `#4fcf8e` | `#14613b` | success |
| Gold | `#f2c14e` | `#7a5600` text, `#a56f00` fill | warning |
| Rose | `#ff5c7c` | `#a51c35` | danger |
| Sky | `#7db3ff` | `#174c9c` | info |
| Lilac | `#c58bff` | `#7b3fd1` | chart 5 only |

Amber `#ffb020` and rose-shader `#f53857` are shader colours. Not signals, not UI.

## 3. Semantic surfaces

| Token | Dark | Light | Use |
|:--|:--|:--|:--|
| `surface-canvas` | ink `#0c0b0a` | paper `#efe9dd` | The page. |
| `surface-primary` | `#141311` | `#e6dfd1` | Card, panel, sidebar. |
| `surface-raised` | `#1d1b18` | `#dcd4c4` | Popover, hovered row, second step. |
| `surface-overlay` | `#141311` | `#ffffff` | Dialog, sheet. White on paper so the overlay is lighter than the page. |
| `surface-sunken` | `#080807` | `#e6dfd1` | Table body, well. |
| `surface-input` | `#080807` | `#ffffff` | A field. The one white in light mode. |
| `surface-inverse` | bone | graphite | Tooltip, the bone slab. |
| `surface-bezel` | `#2a2723` | `#c9c0ae` | Marketing device frame steps. |
| `surface-warm` | `#1a1410` | `#efe3d3` | The warm panel. |
| `surface-device` / `-screen` | `#2a2723` / `#0c0b0a` | same | A phone frame. Objects don't change with the mode. |
| `surface-scrim` | ink 60% | graphite 45% | Behind an overlay. |
| `surface-footer` | ink | ink | Canonical: the footer never flips. |

Rule S1: a surface is never lighter than the one it sits on in dark mode, never darker in light mode, except `surface-inverse` and `surface-overlay` on paper. Rule S2: at most three surface steps visible in one view (canvas + two). Rule S3: the bezel shell (`shadow-bezel-shell` over `surface-primary`) is marketing only; apps use `surface-primary` + `line-hairline`.

## 4. Text

| Token | Dark | Ratio on canvas | Light | Ratio on paper | Use |
|:--|:--|:--|:--|:--|:--|
| `text-primary` | bone | 17.15 | graphite 1 | 16.58 | Body, headings. AAA. |
| `text-secondary` | bone 2 | 8.13 | graphite 2 | 6.55 | Secondary, labels. AAA / AA. |
| `text-tertiary` | bone 3 | 3.67 | graphite 3 | 3.88 | Large text and uppercase mono only. Never body. |
| `text-inverse` | ink | 17.15 on bone | paper | 16.58 | On inverse surfaces. |
| `text-on-accent` | ink | 6.44 on accent | ink | 5.78 on paper accent | Always ink on vermilion. |
| `text-link` | vermilion | 6.44 | `#9e2d0b` | 6.13 | |
| `text-placeholder` | bone 3 | | graphite 3 | | Never the only label. |

High-contrast (`html.contrast`): secondary → bone, tertiary → bone 2, accent text → vermilion 300, lines at 30% / 45%.

## 5. The accent split

`accent-fill` is a fill: buttons, the mark, selected rows, colour blocks, display numerals, `::selection`. Text on it is `text-on-accent` (ink).
`accent-text` is vermilion as small text: links, labels, active nav, the role line. Same hex on ink; `#9e2d0b` on paper because the fill is 2.81:1 there.
`accent-ring` is the focus ring and follows `accent-text`.
`accent-soft` (10%) is a selected row; `accent-wash` (22%) is the start of a wash gradient.

If a word is vermilion it uses `accent-text`. If a shape is vermilion it uses `accent-fill`. The lint rule `no-accent-fill-on-text` checks `color: var(--accent-fill)` on text elements.

## 6. Accent budget (D-014, traces P1, RMS symptom)

Per viewport:

| Allowed | Count |
|:--|:--|
| Vermilion fill regions (primary button, colour block, selected row set, stat numeral group) | **1** |
| Vermilion text/icon signals (links, kickers, active nav, one badge tone) | unlimited, within contrast |
| Ambient vermilion glow | 1 (D-017) |
| Vermilion in a chart | series 1 only |

A second primary button in the same viewport is a bug, not a deviation. Secondary actions are ghost or bone. Destructive actions are `feedback-danger-solid`.

## 7. Feedback

Each role has `solid`, `on-solid`, `text`, `icon`, `bg` (14% tint), `border` (40%).

| Role | Dark solid | Light solid | Light text | Where |
|:--|:--|:--|:--|:--|
| success | mint 400 `#4fcf8e` | mint 700 `#14613b` | mint 700 | Toast, badge, inline check. |
| warning | gold 400 | gold 400 (fill) | gold 700 | Badge, banner, low stock. |
| danger | rose 400 `#ff5c7c` | rose 700 `#a51c35` | rose 700 | Invalid field, destructive button, error state. |
| info | sky 400 `#7db3ff` | sky 700 `#174c9c` | sky 700 | Banner, tip. |

Rule F1: a feedback colour is a signal, never decoration; it always travels with an icon or a label. Rule F2: `feedback-*-solid` fills a button only for destructive actions. Rule F3: never use vermilion for an error; it is the accent.

## 8. Interaction

| Token | Value | Use |
|:--|:--|:--|
| `interaction-hover` | text 6% | Row, list item, ghost button hover. |
| `interaction-pressed` | text 10% | Pressed. |
| `interaction-selected` | accent 10% | Selected row or item, with `line-selected` edge. |
| `interaction-focus` | accent ring | 2px outline, 4px offset. |
| `line-boundary` | text 45% (dark), graphite 50% (light) | The border of a field or any control whose only edge is a line: ≥ 3:1 (D-033). `line-standard` is for ghost buttons and dividers. |
| `interaction-disabled-opacity` | 0.4 | Whole control at 40%, pointer off. |

## 9. Charts

Fixed order `chart-1..6`: vermilion, sky, mint, gold, lilac, bone 2. Grid `chart-grid` (text 8%), axis text `chart-axis-text`. Light: series 1 is vermilion 600 (`#e8521f`, 3.88:1) and 4 is `#a56f00` (3.82:1); both are marks only, labelled with `text-secondary`. Area fills use `gradient-chart-area` (series 1 at 24% → 0). See `components/data-visualization.md`.

## 10. Escape hatch

Photographs, product screenshots, client logos and maps bring their own colour. They sit in a `surface-primary` container with the surface's radius. Founder portraits use `.duotone` (grayscale + accent multiply, SM9). Nothing else is tinted.

## 11. Print and greyscale

Print: canvas white, text `#14120f`, accent `#c9330c` (deep) for the one accent element, feedback as text labels. Greyscale test: with saturation removed, hierarchy must survive on lightness alone; every fill/text pair in §4 does (ratios are luminance-based).

## 12. Verification

`npm run contrast` generates `foundations/contrast-matrix.md`: 273 pairs across dark, light and high-contrast, text at 4.5:1 (AAA marked at 7:1), `text-tertiary` and axis text at 3:1 as large text, boundaries and chart marks at 3:1. It fails the build on any miss. Current result: 0 failures, body text AAA on every surface in every mode.
