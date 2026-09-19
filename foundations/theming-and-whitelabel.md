# Theming and white-label

Traces: D-003 (dark default, light opt-in), D-008 (mode selectors), D-027 (white-label limits). Generated: `variables.css` mode blocks; `code/theme-init.ts` for the pre-paint script and toggle.

## 1. Modes

| Mode | Selector | Trigger | What changes |
|:--|:--|:--|:--|
| Dark | `:root` | Default. The brand. | |
| Light | `html.light` | In-app toggle; remembered in `localStorage["cinq-theme"]`; never from the OS on first run (canonical) | Every semantic colour, shadow alphas, grain blend; the footer and device frames do not change |
| High contrast | `html.contrast` | In-app toggle; `prefers-contrast: more` sets it on first run | Text secondary/tertiary raised, accent text lighter on ink, lines 30/45/70% |
| Reduced motion | `[data-motion="reduced"]` or the media query | In-app `Motion` setting or OS | Every duration 0.001ms, travel 0, loops static, scroll effects unmounted |
| Density | `[data-density="compact" / "dense" / "touch"]` | Per surface root by archetype; `touch` also from `[data-input="touch"]` | Control heights, gaps, rows, body size, icon size |

Combinations are valid (`html.light.contrast [data-density="dense"]`). `color-scheme` follows the mode so native controls and scrollbars match.

Pre-paint: `code/theme-init.ts` `themeInitScript` is the first child of `<head>`; it reads `cinq-theme` and `cinq-contrast` and `cinq-motion` and sets the classes/attributes before first paint (no flash). `themeInitScriptFollowingSystem` exists for a product whose profile sets `followSystem: true` (a deviation, logged).

Flutter: `MaterialApp(theme: CinqTheme.dark(), darkTheme: CinqTheme.dark(), themeMode: userChoice)` with `CinqTheme.light()` swapped in when the user opts in; high contrast via a `CinqColorsContrast` overlay on the text roles (same hexes as the CSS block).

## 2. What a mode may not change

The mark's geometry; the wordmark; radii; type faces, sizes, weights; motion durations and curves (except reduced motion); layout constants; the accent budget; the footer (always ink); device frames (always dark); the rule that text on vermilion is ink.

## 3. Appearance settings (required in every app)

`Settings → Appearance`: Theme (Dark / Light), Contrast (Standard / High), Motion (System / Full / Reduced), Text size (System / Large: sets `--body-size` one notch up and `--control-h` to comfortable), Density on desktop tools (Comfortable / Compact). Each writes its `localStorage` key and its selector; each is reflected immediately with no reload.

## 4. White-label (client products, D-027)

A client product built by CiNQ (SpiceHUT) may carry its own brand within these limits:

| May change | May not change |
|:--|:--|
| The accent hue: `accent.fill`, `accent.hover`, `accent.active`, `accent.text`, `accent.ring`, `accent.soft`, `accent.wash`, `chart.1`, `line.selected`, and the generated gradients that alias them | Ink, bone, paper, graphite (the neutral system) |
| The wordmark and mark (their own logo files, same size rules) | Type faces and the scale |
| `surface-footer` and `footer-*` (their footer may be their brand colour) | Radii, spacing, density, layout constants |
| The OG image and splash artwork | Motion (durations, curves, transitions) |
| Feedback hues only if the brand's accent collides with rose/mint/gold/sky, and only by moving to another hue that passes the matrix | The accent budget, the anti-bento rules, the archetypes |

Procedure: copy `foundations/tokens.json`, change only the permitted tokens, run `npm run tokens:build` and `npm run contrast`; the matrix must pass with zero failures before the theme ships. The tenant theme is a second `variables.<tenant>.css` loaded after the base, overriding only those custom properties. Per-tenant runtime theming (many tenants in one deployment) writes the same properties on `<html data-tenant="…">` from a server-provided JSON that has passed the same contrast script at build time; a tenant cannot set an arbitrary colour at runtime.

Contrast is re-measured for every tenant accent: `text-on-accent` stays ink and the tenant's fill must give ink ≥ 4.5:1 in both modes; if it cannot, the tenant's `text-on-accent` may become bone/paper, logged as a tenant deviation.

## 5. Per-tenant limits, at runtime

Allowed: accent tokens (8), footer tokens (5), logo assets, product name strings. Not allowed: anything else in `variables.css`, any component override, any layout change. A tenant theme file larger than 60 lines is a sign the limits were crossed.

## 6. Verification

`npm run contrast` on the tenant's tokens; `tooling/audit-script` fails a tenant CSS that sets a property outside the allowed list.
