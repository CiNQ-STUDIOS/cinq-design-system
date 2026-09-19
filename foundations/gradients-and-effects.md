# Gradients and effects

Traces: P1, P2 (gradients are alpha, not hue), P3 (surfaces are objects), P4 (glass is chrome), SM2 (double bezel), SM3 (illuminated border), SM7 (ambient vermilion), SM9 (grain and duotone). Tokens: `gradient.*`, `shadow.*`, `blur.*`, `opacity.*`. Generated: `--gradient-*`, `--shadow-*`, `--blur-*`, `--opacity-*`; Flutter `CinqGradientsDark/Light`, `CinqGlow`.

## 1. The law of CiNQ gradients

Every UI gradient is **one token colour fading to transparent** (alpha over a flat surface). A gradient that moves between two hues appears in exactly two places: the hero shader and its OG image stand-in. This is canonical (kit: "Amber … never as UI"; "Vermilion deep: gradients and print shadows only") and is enforced by `tooling/motion-check --gradients`, which fails any gradient whose stops contain more than one non-transparent colour family outside `og-ribbon-*`.

Interpolation: `in srgb` for alpha fades (matches the site's `color-mix(in srgb …)` byte for byte); `in oklch` only for the two OG ribbons. Never `in hsl`.

## 2. Catalog

Token name → exact CSS in dark mode. Light mode swaps the base colour token; the geometry is identical. Stops are given as `colour position`.

| Token | Shape and geometry | Stops (dark) | Permitted | Forbidden |
|:--|:--|:--|:--|:--|
| `scrim-hero` | radial `120% 80% at 0% 100%` | canvas 85% → 0%; canvas 35% → 45%; transparent → 70% | Under hero copy over the shader | Anywhere else |
| `glow-cursor` | radial `closest-side at center`, 52vmax disc, `mix-blend-mode: screen` | accent 16% → 0%; accent 5% → 45%; transparent → 70% | One per page, marketing, dark mode, pointer devices | Apps; light mode (hidden); touch |
| `ring-spotlight` | radial `260px circle at var(--mx) var(--my)`, masked to 1px | accent ⟨0–90⟩% → 0%; transparent → 65% | Interactive cards, hover only | Static borders; tables |
| `ring-spotlight-inverse` | same | canvas 90% → 0% | Accent-washed cards | |
| `sheen` | radial `420px circle at cursor` | text 6% → 0%; transparent → 60% | With `ring-spotlight` | Alone |
| `sheen-inverse` | same | canvas 14% → 0% | With the inverse ring | |
| `portrait-fade` | linear `to top` | canvas 95% → 0%; canvas 35% → 45%; transparent → 80% | Text over a photo | Over UI |
| `ambience-accent` | radial `70% 50% at 80% 100%` | accent 35% → 0%; transparent → 70% | One focal card per viewport | Two per viewport; consoles |
| `wash-accent` | linear `135deg` | accent-wash (22%) → 0%; transparent → 55% | One card per view; fades out on hover | Buttons; text backgrounds |
| `wash-ink-reverse` | linear `315deg` | canvas 70% → 0%; transparent → 60% | The hover reverse of `wash-accent` | Alone |
| `dots` | radial `1px` tiled `18px 18px`, layer opacity 0.4 | text 18% → 0; transparent → 0 | A texture on one card | Behind text < 17px |
| `corner-fade` | radial `60% 60% at 100% 0%` | transparent → 0%; surface-primary → 70% | Over `dots` | |
| `backlight-accent` | radial `60% 60% at 50% 70%` | accent 32% → 0%; transparent → 70% | Behind a device mock | Behind UI |
| `backlight-amber` | radial `60% 50% at 50% 80%` | `rgb(255 176 32 / .22)` → 0%; transparent → 70% | Illustration of a third-party brand only | UI, ever |
| `og-ribbon-1` | radial `closest-side`, `in oklch` | `rgb(249 99 58/.55)` → 0; `rgb(255 176 32/.25)` → 55%; `rgb(12 11 10/0)` → 100% | OG image | UI |
| `og-ribbon-2` | radial `closest-side`, `in oklch` | `rgb(255 176 32/.35)` → 0; transparent → 100% | OG image | UI |
| `chart-area` | linear `180deg` | chart-1 24% → 0%; transparent → 100% | Area under series 1 | Bars |
| `chart-area-2` | linear `180deg` | chart-2 20% → 0% | Area under series 2 | |
| `shimmer` | linear `100deg`, `background-size: 200% 100%` | transparent → 35%; text 6% → 50%; transparent → 65% | Skeletons | Loaded content |
| `live-edge` | 2px left inset shadow, accent → transparent over 2s | | New console rows | Anything static |
| `scrim-sheet` | flat scrim as a gradient token | scrim → scrim | Platforms that need a gradient object | |

`scrim-hero` and the shader are marketing only. Apps have exactly four gradients available: `ambience-accent`, `wash-accent` + `wash-ink-reverse`, `chart-area*`, `shimmer`, plus the `ring-spotlight` pair on interactive cards.

## 3. Illuminated borders (SM3)

Technique, web:

```css
.ring {
  position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none;
  background: var(--gradient-ring-spotlight);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
}
```

- Thickness 1px. Radius inherits the card.
- `--mx`, `--my` are set from pointer position through a spring (`spring-glow`, 120/20) or Motion values; never React state (M14).
- Intensity: rest 0%, hover peak 90%, focus-visible 90% centred on the card, active 90%.
- Behind it the `sheen` at the same point.
- Inverse pair on any card that already carries `wash-accent`.
- Flutter: `CustomPainter` drawing `RadialGradient` into a stroked `RRect` path (`Paint()..style = stroke ..strokeWidth = 1 ..shader = RadialGradient(...).createShader(rect)`), centre from a `Listener` position through `SpringSimulation(CinqSpring.glow)`. Native: SwiftUI `.overlay(RoundedRectangle().strokeBorder(RadialGradient(...)))`; Compose `Modifier.border(1.dp, Brush.radialGradient(...))`.
- Touch: no pointer, so the ring lights at 60% centred on the card during `:active` and fades over `dur-base`.

## 4. Ambient glows (SM7, D-017)

| Glow | Blur | Spread | Alpha | Offset | Colour source | Layer |
|:--|:--|:--|:--|:--|:--|:--|
| Cursor glow | radial gradient, no filter | 52vmax disc | 16% → 5% → 0 | follows cursor via `spring-ambient` (60/20/0.8) | `accent-fill` | z 5, `mix-blend: screen`, above canvas, below content |
| Card ambience | radial gradient | 70% × 50% of card | 35% → 0 | anchored 80% 100% | `accent-fill` | inside the card core, under content |
| Device backlight | radial gradient | 60% × 60% | 32% → 0 | 50% 70% | `accent-fill` | behind the device |
| Live pulse | `opacity` 0.55 ↔ 1 over 2.4s | | | | `feedback-*` or accent | consoles only |

Glow ↔ elevation ↔ state:

| State | Ring intensity | Ambience |
|:--|:--|:--|
| Rest | 0 | 35% if the card is the focal card |
| Hover / focus | 90% | unchanged |
| Active | 90% | unchanged |
| Live (streaming data) | 0 | `glow-breathe` on the status dot only |

Cap: **one ambient glow per viewport** on any surface; **zero** in the console archetype unless it signals live state; **zero** in forms. Glows never carry text.

## 5. Surface treatments

**Glass** (canonical `.glass`): `background: color-mix(in srgb, var(--surface-canvas) 55%, transparent)`, `backdrop-filter: blur(var(--blur-glass)) saturate(140%)`, `box-shadow: var(--shadow-glass)` (inset hairline 10% + top light 8%). Menu: canvas 90% + `blur-glass-heavy` (40px). Only on `position: fixed` chrome (P4). Fallback without `backdrop-filter`: `background: var(--surface-primary)` at 100%. `prefers-reduced-transparency`: blur 0, fill 1 (generated).

**Grain** (SM9): a fixed, non-interactive layer, SVG `feTurbulence` `baseFrequency 0.9` `numOctaves 2`, 220px tile, `opacity-grain-dark` 0.06 with `mix-blend-mode: overlay`; light `0.16` with `multiply`. Never on a scrolling box. Doubles as banding prevention for every gradient beneath it.

**Inner light stroke**: `shadow-bezel-top`, `inset 0 1px 0 text 6%`, on every `surface-primary` core in marketing and on `surface-overlay` in apps.

**Bezel shell** (SM2): `background: text 4%`, `shadow-bezel-shell` (inset hairline 8%), padding 6px, radius `radius-marketing`; core radius = shell radius − 6px. On paper the shell fill is transparent and the hairline is 12% (canonical, 19 Sep). Marketing only (rule S3).

**Specular highlight**: none. CiNQ surfaces are matte; the top stroke is the only highlight.

**Duotone** (portraits): `filter: grayscale(1) contrast(1.08) brightness(0.92)` under a `background: accent-fill; mix-blend-mode: multiply` layer at `opacity-wash-closed` 0.85 (closed) / `opacity-wash-open` 0.55 (open), then `portrait-fade`.

## 6. Gradient text and icons

Not permitted. The wordmark, headings and icons are flat bone, ink or vermilion. The only "animated text" is weight (SM8), which is not a gradient. Fallback colour for any legacy gradient text encountered in migration: `text-primary`.

## 7. Animated gradients

| What may animate | How | Duration | Loop | Pause |
|:--|:--|:--|:--|:--|
| Position of `ring-spotlight` / `sheen` | `--mx`/`--my` via spring | continuous | n/a | on pointer leave → intensity 0 |
| `shimmer` | `background-position` on a 200%-wide layer | 1.6s linear | infinite while loading | when offscreen (IntersectionObserver) or under reduced motion (static 0.8 opacity) |
| `wash-accent` ↔ `wash-ink-reverse` | `opacity` crossfade of two layers | 700ms `ease-out` | no | |
| Ambient drift (`gradient-drift`) | `transform: translate3d` on a layer 108% wide | 12s in-out alternate | infinite | offscreen, reduced motion, apps (never allowed) |
| `@property`-registered stops | allowed for a registered `--glow-pct` (number) so intensity can transition in CSS | `dur-base` | | |

Never animate `background-image` itself, a gradient's colour stops directly, or `filter: blur` on a large layer.

## 8. Gradients in data

- Area under a line: `chart-area` (24% → 0). Two series: `chart-area-2`. Never three filled areas.
- Sequential ramps (heatmaps): vermilion 100 → 700 in 5 steps on ink; 200 → 800 on paper. Value must also be encoded by a label or a tooltip (meaning independent of hue).
- Threshold: a solid `feedback-*` band, not a gradient.
- Bars are flat.

## 9. Quality rules

- **Banding**: the grain layer sits above every gradient in marketing; in apps, gradients are ≤ 35% alpha so 8-bit banding is below threshold. Never a gradient across more than 40% of the viewport height without grain.
- **Dark vs light**: every catalog entry re-resolves its base token per mode (generated). The RMS wash drops from 22% to 18% on paper; ambience stays 35%; sheen base flips from text (bone) to text (graphite) automatically.
- **Print / greyscale**: gradients are dropped; `@media print` sets every `--gradient-*` to `none` (see `patterns/documents-and-print.md`).
- **Low power / reduced transparency**: glass → solid; glows keep (they are cheap radial paints); shimmer → static.
- **Paint budget**: ≤ 2 gradient layers per surface, ≤ 6 gradient-filled elements per view, ≤ 1 `backdrop-filter` element per view, no gradient larger than 1200 × 1200 css px except the cursor glow (which is a single composited layer with `will-change: transform`).

## 10. Composition rules

| Rule | Value |
|:--|:--|
| Max gradient layers per surface | 2 (e.g. `dots` + `corner-fade`; `wash` + its reverse) |
| Max gradient-filled elements per view | 6 |
| Never gradient-filled | Dense data cells, table rows, body-text backgrounds, inputs, buttons, badges, icons, text |
| Colour blocks (SM4) | Flat `accent-fill` with `text-on-accent`; a colour block never carries a gradient |

## 11. Platform implementations

| Gradient | CSS | Tailwind | Flutter | SwiftUI / Compose |
|:--|:--|:--|:--|:--|
| Any catalog entry | `background: var(--gradient-<name>)` | `bg-<name>` (v4 `background-image-*` theme) / `bg-gradient-<name>` (v3 preset `backgroundImage`) | `CinqGradientsDark.<camelName>` (`RadialGradient` / `LinearGradient`) | `RadialGradient(colors:…)` / `Brush.radialGradient` with the same stops |
| Ring | mask-composite (§3) | same via utility | `CustomPainter` stroke shader | `.strokeBorder` / `Modifier.border(brush)` |
| Grain | fixed SVG layer | | `CustomPaint` with a cached noise `ui.Image` at 0.06, `BlendMode.overlay` | `Canvas` noise texture |
| Glass | `backdrop-filter` | `backdrop-blur-glass` | `BackdropFilter(ImageFilter.blur(20))` inside `ClipRRect` | `.ultraThinMaterial` tinted / `Modifier.blur` |

## 12. Shadows (P3)

| Token | Value (dark) | Light | Use |
|:--|:--|:--|:--|
| `shadow-slab` | `0 24px 60px -24px rgb(0 0 0/.55)` | alpha .25 | Card lifting on hover |
| `shadow-strong` | `0 32px 80px -20px rgb(0 0 0/.65)` | .3 | Popover, dialog |
| `shadow-sheet` | `0 -24px 80px -20px rgb(0 0 0/.6)` | .25 | Bottom sheet, drawer |
| `shadow-device` | `0 40px 80px -20px rgb(0 0 0/.6)` + inset top `rgb(243 239 231/.18)` | .35 | Phone frame |
| `shadow-screen` | `0 40px 60px -20px rgb(0 0 0/.7)` | .35 | Loose screenshots |
| `shadow-stack` | `0 -20px 60px -30px rgb(0 0 0/.7)` | .3 | A pinned card in a stack |
| `shadow-pressed` | `inset 0 2px 6px rgb(0 0 0/.35)` | .15 | Pressed segment, sunken well |
| `shadow-bezel-shell` / `-top` / `glass` | inset hairlines | | Surface edges |

There is no small or medium shadow. A resting card has none. Blur is never below 40px on a drop shadow.
