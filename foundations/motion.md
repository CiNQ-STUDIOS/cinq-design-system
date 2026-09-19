# Motion

Traces: P6 (scroll or state, never both), P7 (decks on a phone), SM5 (veil recession), SM6 (masked reveals), SM8 (weight as motion). Tokens: `duration.*`, `easing.*`, `spring.*`, `transition.*`, `motion.*`, `travel.*`. Generated: `--dur-*`, `--ease-*`, `--spring-*` (CSS `linear()`), `--transition-*`, `motion.css` keyframes and utilities, `react_tokens.ts` `easings`/`durations`/`springs`/`transitions`, Flutter `CinqDuration`, `CinqCurve`, `CinqSpring`, `CinqMotion`.

The full inventory of what moves on the site, with parameters, is `audit/BRAND_DNA.md` §6. This document turns it into rules.

## 1. Principles (falsifiable)

| # | Principle | Test |
|:--|:--|:--|
| MP1 | **Motion explains a change of place.** Something that enters comes from where it was summoned (a sheet from the bottom, a popover from its anchor, a route from the direction of travel). | Every enter transition has an origin stated in `transitions-and-choreography.md`; none is a centred fade except the dialog. |
| MP2 | **Exit is faster than enter.** | Every exit ≤ 50% of its enter duration; exits use `ease-in`. |
| MP3 | **One clock per element.** GSAP owns scroll, Motion/CSS owns state, R3F owns the hero; no element has two drivers. | `motion-check` finds no element with both a ScrollTrigger and a Motion/CSS animation on the same property. |
| MP4 | **Only cheap properties.** `transform`, `opacity`, `clip-path`, `filter` (blur ≤ 6px, one element at a time); exceptions listed in §5. | `motion-check` property allow-list. |
| MP5 | **Interruptible and retargetable.** A hover that ends mid-tween eases back from where it is; a route change mid-transition jumps to the new target. | Springs and `overwrite: "auto"`; no `animation-fill-mode` traps; no `pointer-events: none` during a transition longer than `dur-base`. |
| MP6 | **Reduced motion leaves a complete page.** | With `prefers-reduced-motion`, nothing is hidden behind a reveal, no scroll effect mounts, no preloader; screenshots of every archetype under reduced motion contain all content. |
| MP7 | **Operational views do not decorate.** Consoles animate only opacity on state and the live edge on a new row. | Console archetype screens contain no transform animation except the sheet and the row edge. |

## 2. Duration scale (D-019)

| Token | ms | Rule | Canonical uses |
|:--|:--|:--|:--|
| `instant` | 100 | A knob, a check, a caret. Anything under 24px of travel. | |
| `fast` | 150 | Colour and opacity on hover; exits of small things. | hover colour |
| `base` | 300 | Toggles, menus, popovers, dialogs, toasts, tab indicator. Travel ≤ 80px. | |
| `slow` | 500 | Colour on a button (canonical `.btn` 0.5s); header return. | `.btn` colour, header `0.55s` |
| `press` | 600 | Transform on a button; roll text; sheets. | `.btn` transform, roll text |
| `page` | 700 | Route crossfade; the wash reverse. | RMS wash |
| `reveal` | 900 | In-view reveals, the founder strip, menu links, the name morph. | founders, menu |
| `cinematic` | 1200 | Hero fades, portrait scale. Marketing only. | hero |
| `headline` | 1400 | Hero headline lines. Marketing only. | hero |
| `count` | 1600 | Count-up; skeleton pulse period. | studio |
| `live-fade` | 2000 | A new row's edge. | consoles |
| `loader-chase` / `loader-spin` | 1200 / 2400 | The mark. | |
| `marquee` | 38000 | One marquee per page. | |
| `tooltip-delay` | 400 | Before a tooltip shows. | |
| `toast-hold` | 5000 | Before a toast dismisses itself. | |

Distance → duration rule: travel ≤ 24px → `instant`/`fast`; ≤ 80px → `base`; a panel's own height (sheet) → `press`; a viewport → `page`; a reveal with a mask → `reveal`; the hero → `cinematic`+. Importance raises one notch (the primary button's colour uses `slow`, not `fast`); density lowers one notch (dense consoles use `fast` where comfortable uses `base`).

Staggers: `stagger` 60ms siblings (cap 8 items, then 0), `stagger-lines` 90ms headline lines, `stagger-letters` 18ms roll text, `stagger-mark` 70ms segments.

## 3. Easing library (D-020)

| Token | Curve | GSAP | Use |
|:--|:--|:--|:--|
| `out` | `cubic-bezier(0.16, 1, 0.3, 1)` | `expo.out` | Everything that moves on its own: enters, reveals, hover transforms. The house curve. |
| `in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | `power2.inOut` | Things that open and later close symmetrically: toggles, accordion, skeleton pulse. |
| `in` | `cubic-bezier(0.7, 0, 0.84, 0)` | `expo.in` | Exits. |
| `emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | `power4.out`-like | Sheets, drawers, route travel: fast start, long settle. |
| `back` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `back.out(1.6)` | The mark's segments only. |
| `linear` | | `none` | Scrubbed tweens, the marquee, progress bars. |

Springs (Motion `useSpring`, Flutter `SpringDescription`, CSS `linear()` generated):

| Token | stiffness / damping / mass | Settles | Use |
|:--|:--|:--|:--|
| `snappy` | 180 / 16 / 0.4 | ~0.5s | Magnetic buttons (offset × 0.35). |
| `soft` | 140 / 18 / 1 | ~0.7s | Card tilt ±6°. |
| `glow` | 120 / 20 / 1 | ~0.7s | Spotlight intensity. |
| `ambient` | 60 / 20 / 0.8 | ~1.0s | Cursor glow position. |
| `opacity` | 80 / 20 / 1 | ~0.8s | Cursor glow opacity. |

Never a custom bezier or spring outside this table. `motion-check` fails any `cubic-bezier(` literal not equal to one of the six.

## 4. Property rules (MP4)

Allowed on hot paths: `transform`, `opacity`, `clip-path`, `filter: blur()` ≤ 6px on ≤ 1 element per view. Documented exceptions: `height` on the services accordion via Motion `layout` (M16) and any FLIP; `box-shadow` for the live edge only (2px inset, 1 element); `background-position` on the shimmer layer; `font-variation-settings` on the wordmark; `flex-grow` on the founder strips (900ms, five elements, marketing only); `color`/`background-color` on hover (`fast`/`slow`). Banned outright: `width`, `top`, `left`, `margin`, `padding`, `font-size`, `border-width`, `filter` on a layer larger than 600 × 600.

`will-change: transform` only on elements that are about to move and only while they move (set by JS, removed after). Never in a stylesheet on a class used by many elements.

## 5. Performance budget

| Metric | Target | Degradation tier |
|:--|:--|:--|
| Frame rate | 60fps; 120 where the display allows | |
| Concurrent animations | ≤ 6 tweens + 1 scrub per view; ≤ 24 staggered children | |
| Frame cost | ≤ 8ms scripting + ≤ 6ms paint on a mid-range phone (Snapdragon 6-series) | |
| Composited layers | ≤ 12 | |
| Tier 1 (`navigator.hardwareConcurrency` ≥ 4 and no `saveData`) | full | |
| Tier 2 (2–3 cores, or `saveData`, or `deviceMemory` ≤ 2) | no shader hero (static poster), no cursor glow, no tilt, reveals become `fade-up` at `base` | |
| Tier 3 (`prefers-reduced-motion`) | MP6 | |
| Offscreen | every loop pauses (`IntersectionObserver` → `animationPlayState: paused`; GSAP `ScrollTrigger` toggleActions `play pause resume pause`) | |
| Background tab | `document.visibilityState` pauses loops | |

## 6. Reduced motion (MP6)

Every animation states its reduced-motion behaviour in `transitions-and-choreography.md` (column "RM"). Rules: durations collapse to 0.001ms (generated); positional enters become instant; opacity fades may stay at `fast`; loops stop and rest at their "on" frame (loader segments at opacity 1, skeleton at 0.8); scroll-linked effects do not mount (`gsap.matchMedia("(prefers-reduced-motion: no-preference)")`); pointer effects do not mount; the preloader never plays; route transitions become an instant swap.

A **user-level motion setting**, distinct from the OS, is required in every app: `Settings → Appearance → Motion: System / Full / Reduced`. It writes `html[data-motion="reduced"]`, which the generated CSS treats like the media query (`variables.css` selectors include both). Stored with the theme in `localStorage` (`cinq-motion`).

## 7. Library ownership (MP3)

| Driver | Owns | Never |
|:--|:--|:--|
| GSAP + ScrollTrigger (+ SplitText, Flip) | Scroll-linked and pinned motion, headline masks, count-ups, marquee, timelines with more than three steps | Hover state |
| Motion (`motion/react`) | Component state: open/close, presence, layout (accordion), springs for pointer effects, in-view reveals of single elements | Scroll pin |
| CSS transitions / animations (`motion.css`) | Hover colour, press, toggles, skeletons, loader, keyframe utilities, view transitions | Anything sequenced |
| React Three Fiber | The hero shader | Anything else |
| Lenis | Smooth scroll; GSAP's ticker drives it | |
| Flutter `AnimationController` + `CurvedAnimation` / `SpringSimulation` | All Flutter motion | `Animate` packages with their own curves |

## 8. Asset motion

Lottie / Rive / video: permitted for the Qeemat capture (video, muted, `preload="metadata"`, poster, paused under reduced motion) and for onboarding illustrations (Rive ≤ 250KB, one per screen, paused offscreen). Never for icons, loaders (the mark is the loader), or buttons. Video in a card: ≤ 2MB webm + mp4 fallback.

## 9. Verification

`npm run motion:check` scans `code/` and `showcase/` for: `cubic-bezier(` literals outside the six; `transition:`/`animation:` with a literal ms/s not in the duration table; animated properties outside the allow-list; `backdrop-filter` off fixed chrome; any `@keyframes` not generated from `motion.*`; and a reduced-motion block in every stylesheet that declares an animation.
