# Elevation and depth

Traces: P3 (surfaces are objects), P4 (glass is chrome), SM2 (double bezel), SM5 (ink veil recession). Tokens: `shadow.*`, `blur.*`, `z-index.*`, `color.semantic.surface.*`. Generated: `--shadow-*`, `--blur-*`, `--z-*`.

## 1. The model

Depth at CiNQ comes from **surface step + edge + shadow**, in that order of importance. A surface one step lighter than its parent (dark) with a hairline is already "raised"; a shadow is added only when the element is lifted off the page by an interaction or is chrome. Blur is reserved for fixed chrome.

## 2. Levels

| Level | Name | Surface | Edge | Shadow | Backdrop blur | z-index | Examples |
|:--|:--|:--|:--|:--|:--|:--|:--|
| 0 | Canvas | `surface-canvas` | none | none | none | `z-base` 0 | The page, table wells (`surface-sunken`, a step down) |
| 1 | Panel | `surface-primary` | `line-hairline` (apps) or bezel shell (marketing) | none at rest | none | `z-raised` 1 | Cards, sidebars, form columns |
| 2 | Raised | `surface-raised` | `line-hairline` | `shadow-slab` only on hover/lift | none | `z-sticky` 10 | Hovered rows, sticky headers, nested panels |
| 3 | Floating | `surface-raised` | `line-hairline` | `shadow-strong` | none | `z-dropdown` 30 | Popovers, menus, tooltips (`surface-inverse`, no shadow) |
| 4 | Chrome | glass (canvas 55%) or `surface-primary` on touch | `shadow-glass` inset lines | none | `blur-glass` 20px | `z-header` 50, `z-app-bar` 40, bottom nav 50 | Header pill, app bar, bottom nav |
| 5 | Modal | `surface-overlay` | `line-hairline` | `shadow-strong` (dialog), `shadow-sheet` (sheet) | scrim behind: `surface-scrim`; the menu uses `blur-glass-heavy` 40px | `z-overlay` 60, `z-sheet` 55, `z-menu` 70 | Dialog, sheet, drawer, full-screen menu |
| + | Toast | `surface-raised` | hairline | `shadow-strong` | none | `z-toast` 70 | |
| + | Grain / cursor / preloader | | | | | `z-cursor-glow` 5, `z-grain` 90, `z-preloader` 100 | Fixed effect layers |

Named z-index only. A literal `z-index: 999` fails lint.

## 3. Edges

- **Hairline** (`line-hairline`, text 10%): every panel in an app. Inset via `box-shadow: inset 0 0 0 1px` so it never affects layout.
- **Top light** (`shadow-bezel-top`, 1px text 6%): every panel core in marketing; every `surface-overlay` in apps. The only highlight in the system.
- **Bezel shell** (SM2): marketing cards. Shell = text 4% fill + inset hairline 8%, 6px padding; core = `surface-primary` + top light. Radius core = shell − 6. Paper: shell fill transparent, hairline 12%.
- **Selected**: `line-selected` 2px inset (`border-selected`).
- **Gradient border highlight**: the illuminated ring (`gradients-and-effects.md` §3) replaces a static gradient border; there is no static 1px gradient border in the system.

## 4. Shadow stacks

Defined in `gradients-and-effects.md` §12. Rules:

- A resting element at levels 0–2 has no drop shadow.
- Blur ≥ 40px on any drop shadow; there is no `shadow-md`.
- Shadows are ink-black with alpha, never coloured, never vermilion.
- Light mode halves the alpha (generated).
- Stacked cards (process, decks) use `shadow-stack` (upward, `0 -20px 60px -30px`) so the card below reads as beneath.

## 5. Recession (SM5)

When a card is pinned and the next slides over it: the pinned card keeps `opacity: 1`, scales to 0.92 (stack) / 0.94 (deck), blurs 2px (`blur-recede`, stack only), and an inner veil (`surface-canvas` at `opacity-veil` 0.55–0.6) darkens it. The card itself is never faded; fading shows what is beneath through the gap.

## 6. Fallbacks

| Condition | Level 4 | Level 5 menu |
|:--|:--|:--|
| No `backdrop-filter` (old WebView, Firefox with the flag off) | `background: var(--surface-primary)` at 100% (`@supports not (backdrop-filter: blur(1px))`) | `background: var(--surface-canvas)` at 100% |
| `prefers-reduced-transparency` | blur 0, fill 1 (generated) | same |
| Flutter | `BackdropFilter` in a `ClipRRect`; on low-end devices (`PerformanceOverlay` budget) replace with solid `surfacePrimary` | |
| Print | all levels flat, no shadow | |

## 7. Platform mapping

| | Web | Flutter | Notes |
|:--|:--|:--|:--|
| Panel | `.cq-slab` | `Container(decoration: BoxDecoration(color: surfacePrimary, border: Border.all(lineHairline), borderRadius: 16))` | |
| Hover lift | `box-shadow: var(--shadow-slab)` on `:hover` | `AnimatedContainer` with `CinqShadowDark.slab` on hover (desktop) | 150ms |
| Popover | `.cq-popover` | `Material(elevation: 0)` + manual `BoxShadow` from `CinqShadowDark.strong` | Never Material elevation |
| Chrome | `.cq-glass` fixed | `BackdropFilter` | |
| Dialog | `<dialog>` + `::backdrop` scrim | `showDialog(barrierColor: surfaceScrim)` | |

## 8. Verification

`tooling/lint` fails `box-shadow` literals and unnamed `z-index`. `tooling/motion-check` fails `backdrop-filter` on any element that is not `position: fixed` (or inside one) in the showcase and `code/`.
