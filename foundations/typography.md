# Typography

Traces: P5 (one thing reads first), P8 (sentence case), SM8 (weight as motion), SM11 (kicker · headline · lead). Tokens: `font.*`, `typography.*`. Generated: `--font-*`, `--font-size-*`, `--leading-*`, `--tracking-*`, `.t-*` classes; Flutter `CinqFontSize`, `CinqTheme._text`.

## 1. Families

| Role | Web | iOS | Android | Fallback chain |
|:--|:--|:--|:--|:--|
| Display | Bricolage Grotesque (variable: `wght`, `wdth`, `opsz`) | Bricolage Grotesque, bundled | Bricolage Grotesque, bundled | `ui-sans-serif, system-ui, sans-serif` |
| Text | Geist 400, 500 | Geist, bundled (SF Pro fallback) | Geist, bundled (Roboto fallback) | `ui-sans-serif, system-ui` |
| Mono | Geist Mono 400 | SF Mono fallback | Roboto Mono fallback | `ui-monospace, Menlo, monospace` |
| Urdu / Arabic script | Noto Nastaliq Urdu (Nastaliq) for headings and body; Noto Naskh Arabic for dense tables where Nastaliq's vertical rhythm is too tall | same | same | `serif` |
| Other non-Latin | Noto Sans (script subset) | system | system | |

All Latin faces are SIL OFL. Files live in `cinq-website/brand/fonts/` and are copied into each product (`install-to-product.sh`). Bricolage is used only in its variable TTF; the static woffs are for the kit and the OG image.

Weights in the system: 400, 500, 700, 800. 300 exists only as the lightest pole of the wordmark wave (SM8) and is never static text. There is no 600.

## 2. Loading

- Web: `next/font/local` with `display: "swap"`, `preload: true` for Geist 400 and Bricolage variable; Geist Mono and Geist 500 `preload: false`. Subset: `unicode-range` Latin + Latin-1 for the three; Urdu loaded only when `lang="ur"`. Expose `--font-bricolage`, `--font-geist`, `--font-geist-mono` (the tokens fall through to family names when absent).
- Plain HTML: `@font-face` with the same `font-display: swap`, `<link rel="preload" as="font" crossorigin>` for the two hot files.
- Flutter: `pubspec.yaml` `fonts:` with the variable TTF; `FontVariation('wght', 800)` for the tight cut; Nastaliq via `google_fonts` or bundled.
- CLS budget: ≤ 0.05; size-adjust on the fallback: `size-adjust: 104%` for Geist on Arial, `98%` for Bricolage on system-ui.

## 3. The scale

px at 16px root. Fluid sizes state min → max; the preferred term is in tokens.json.

| Role | Token | Face / weight | Size | Line | Tracking | ≤ md | 3xl |
|:--|:--|:--|:--|:--|:--|:--|:--|
| Display L | `display-l` | Bricolage 700, opsz 96, wdth 100 | 44 → 120 px (2.75 → 7.5rem) | 0.95 | −0.03em | 44 | 120 → 160 |
| Display M | `display-m` | Bricolage 700 | 36 → 88 px | 0.95 | −0.03em | 36 | 88 → 120 |
| Display S | `display-s` | Bricolage 700 | 24 → 40 px | 1.1 | −0.03em | 24 | 40 → 54 |
| H1 | `h1` | Bricolage 700 | 28 → 36 px | 1.1 | −0.03em | 28 | 36 |
| H2 | `h2` | Bricolage 700 | 24 px | 1.1 | −0.03em | 22 | 24 |
| H3 | `h3` | Geist 500 | 20 px | 1.25 | 0 | 18 | 20 |
| H4 | `h4` | Geist 500 | 17 px | 1.25 | 0 | 16 | 17 |
| H5 | `h5` | Geist 500 | 15 px | 1.25 | 0 | 15 | 15 |
| H6 | `h6` | Geist Mono 400, uppercase | 13 px | 1 | 0.08em | 13 | 13 |
| Body L (lead) | `body-l` | Geist 400 | 17 → 22 px | 1.45 | 0 | 17 | 22 → 28 |
| Body | `body` | Geist 400 | 15 → 17 px | 1.6 | 0 | 15 | 17 → 21.6 |
| Body S | `body-s` | Geist 400 | 13 px | 1.5 | 0 | 13 | 16 |
| Caption | `caption` | Geist 400 | 12 px | 1.4 | 0 | 12 | 12 |
| Overline (kicker) | `overline` | Geist Mono 400, uppercase | 12 px | 1 | 0.08em | 12 | 14 |
| Code | `code` | Geist Mono 400 | 14 px | 1.55 | 0 | 14 | 14 |
| Badge | `badge` | Geist Mono 400, uppercase | 11 px | 1 | 0.08em | 11 | 11 |
| Numeric | `numeric` | Bricolage 800, wdth 90, tabular | 32 → 56 px | 1 | −0.045em | 32 | 56 |
| Button / nav | `button` | Geist 500 | 15 px | 1 | −0.01em | 15 | 15 |
| Bottom-nav label | `bottom-nav` | Geist 500 | 11 px | 1 | 0 | 11 | |

Fluid formulas (canonical): `clamp(2.75rem, 6.6vw, 7.5rem)`, `clamp(2.25rem, 5.2vw, 5.5rem)`, `clamp(1.5rem, 2.6vw, 2.5rem)`, `clamp(1.0625rem, 1.35vw, 1.375rem)`, `clamp(0.9375rem, 1.05vw, 1.0625rem)`, `clamp(2rem, 3.4vw, 3.5rem)`; H1 `clamp(1.75rem, 2.2vw, 2.25rem)` (derived). From 1920px the site raises the caps (`variables.css` keeps the marketing tier in the site's `globals.css`; apps do not scale past xl).

Per-breakpoint rule: below `md` fluid roles sit at their minimum; the app roles (H1–H6, body) do not change with viewport, only with density (`--body-size`).

## 4. Roles by archetype

| Archetype | Page title | Section | Card heading | Body |
|:--|:--|:--|:--|:--|
| Marketing | display-l (hero), display-m | overline + display-m | display-s or h3 | body-l lead, body |
| Dashboard | h1 | h4 (Geist 500) | h3 | body at compact |
| Console | h3 | h6 (mono) | h5 | body at dense, mono for ids |
| Mobile utility | h1 | h4 | h3 | body |
| Form flow | h1 | h4 as group label | | body |
| Detail / record | h1 with an h6 kicker | h4 | | body |

Display faces (Bricolage) never appear in a console (P5: nothing competes with the data).

## 5. Rules

- Sentence case everywhere: headings, labels, buttons, nav, table headers. Uppercase only in `overline`, `badge`, `h6`.
- Headings `text-wrap: balance`; paragraphs `text-wrap: pretty`.
- Measure: body ≤ 68ch; lead ≤ 20 words on marketing; a hero headline ≤ 3 lines.
- Numbers: `font-variant-numeric: tabular-nums` in every column, total, timer and counter. Display numerals use `numeric`.
- Money: `Rs 12,500` (`Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 })` renders `Rs 12,500`); paisa only on invoice lines; `-Rs 400` with `feedback-danger-text`; other currencies per product profile (SpiceHUT: CAD `$12.50`).
- Dates `19 Sep 2026`; timestamps `19 Sep, 14:05`; schedules `Fri 19 Sep`; 24-hour in tools, 12-hour permitted in customer apps by profile; relative time only under one hour and only in feeds.
- IDs, order numbers, table numbers, codes: mono (`code` role, not uppercase). Kickers and badges: mono uppercase.
- No em-dashes in UI text. No semicolons in UI. Periods and commas.
- Truncation: single-line with `text-overflow: ellipsis` and a title tooltip; never clamp a price or a name in a console row (widen or wrap).

## 6. Weight as motion (SM8)

Only the `wght` axis animates, in JS, per frame, on the wordmark and nothing else. Never `font-size` or `transform: scale` on text as an interaction. Roll text (M22) translates two copies; it does not change weight.

## 7. Urdu and RTL

- `dir="rtl"` on `<html lang="ur">`; logical properties everywhere (`margin-inline-start`, `inset-inline-end`); icons that indicate direction flip (`ArrowRight` → `ArrowLeft`); numerals stay Latin unless the product profile sets Eastern Arabic.
- Nastaliq line-height 2.0 for body, 1.6 for headings; minimum 17px body.
- Mixed-direction strings (`Order #412 · میز 4`) use `unicode-bidi: isolate` per fragment.
- Display headlines in Urdu use Nastaliq at weight 700; Bricolage is never used for Urdu.

## 8. Verification

`tooling/lint` fails a component that sets `font-size`, `font-family` or `font-weight` to a literal, or uses a weight outside 400/500/700/800. The showcase renders every role in both modes with the px measured.
