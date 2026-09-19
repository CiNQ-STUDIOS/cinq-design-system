# Transitions and choreography

The catalog. Every named transition has exact parameters, an anatomy, a reduced-motion behaviour (RM) and a platform mapping. Components name the transition they use (`components/*` "Motion" rows); nothing animates without a name from this file.

Notation: `dur` and `ease` are token names (`motion.md` §2–3). Travel is in px unless stated. Anatomy timelines are in ms from trigger.

---

## T1. Micro-interactions

| Id | Interaction | Property | Dur / ease | Anatomy | RM |
|:--|:--|:--|:--|:--|:--|
| T1.1 | Hover colour (link, row, ghost) | `color`, `background-color` | `fast` / `out` | 0 → 150 crossfade | keep |
| T1.2 | Button hover | `background-color` `slow`; icon disc `transform` `press` | canonical `.btn`: disc `translate(2px,−2px) scale(1.06)` | 0–500 colour, 0–600 disc | colour only |
| T1.3 | Press | `transform: scale(0.97)` | `press` / `out` | on `:active`; releases over the same | none |
| T1.4 | Focus ring | `outline` appears | instant | 2px accent ring, 4px offset | keep |
| T1.5 | Toggle / switch | knob `transform: translateX(track − knob)`, track `background-color` | `base` / `in-out` | 0–300 | instant |
| T1.6 | Checkbox / radio | check `clip-path: inset(0 100% 0 0 → 0)` and fill | `instant` / `out` | 0–100 | instant |
| T1.7 | Press feedback on touch | ring lights 60% centred, `opacity` | `base` / `out` | 0–300 in, 0–150 out | none |
| T1.8 | Tooltip | `opacity` 0→1, `transform: translateY(travel-sm → 0)` | show `base` after `tooltip-delay` 400; hide `fast` `in` | 400–700 | opacity only |
| T1.9 | Roll text (nav links) | two copies `transform: translateY(±100%)` | `press` / `out`, `stagger-letters` 18 | per letter | none |
| T1.10 | Magnetic | `transform: translate(offset × 0.35)` | `spring-snappy` | continuous | none |
| T1.11 | Tilt + spotlight | `rotateX/Y ±6°` `spring-soft`; ring intensity `spring-glow`; position via motion values | continuous | none |

## T2. State transitions

| Id | From → to | Anatomy | Dur / ease | RM |
|:--|:--|:--|:--|:--|
| T2.1 | Skeleton → content | Skeleton geometry matches content (same boxes, same heights). At data: skeleton `opacity` 1→0 over `fast`, content `opacity` 0→1 over `base`, both in place, no travel. Never a layout shift. | `fast` out / `base` in, `out` | instant swap |
| T2.2 | Empty → populated | First row/card `fade-up` (travel-lg 24, `reveal`), subsequent items `stagger` 60 up to 8, rest instant | `reveal` / `out` | opacity only |
| T2.3 | Field error | Border to `feedback-danger-solid` `fast`; message `fade-up` travel-sm `base`; **no shake**. Focus moves to the first invalid field on submit. | `fast`, `base` | keep opacity |
| T2.4 | Success morph (button → check) | Label `opacity` 0 `fast`; disc grows to 44px `base` `out`; check `clip-path` inset reveal `instant`; hold `toast-hold`; reverse | 0–150, 150–450, 450–550 | swap label to "Saved" |
| T2.5 | Optimistic update | Row appears immediately with `Badge` "Pending" (`feedback-info`) at `opacity-veil`; on confirm badge `opacity` 0 `fast`; on rollback row `background-color` to `feedback-danger-bg` `fast`, then removed with T6.2 and a toast with Undo | | keep |
| T2.6 | Live value change (number) | Old value `translateY(−100%) opacity 0`, new from `+100%` (roll), `base` `out`; for counts use count-up T9.1 | `base` | instant |
| T2.7 | Loading button | Label `visibility: hidden`; loader (the mark) in the disc; `aria-busy` | instant | keep |

## T3. Enter / exit (overlays)

| Id | Overlay | Enter | Exit | Origin | Scrim | RM |
|:--|:--|:--|:--|:--|:--|:--|
| T3.1 | Dialog | `opacity` 0→1 + `scale(0.98→1)`, `base` `out` (`cq-anim-dialog-in`) | `opacity` 1→0, `fast` `in` | centre | `surface-scrim` fades `base` | opacity `fast` |
| T3.2 | Bottom sheet | `translateY(100% → 0)`, `press` `emphasized` (`cq-anim-sheet-in`) | `translateY(0 → 100%)`, `base` `in` | bottom edge | scrim `base` | opacity |
| T3.3 | Drawer (side) | `translateX(100% → 0)` (`inline-end`), `press` `emphasized` | `base` `in` | the edge it lives on | scrim | opacity |
| T3.4 | Popover / menu | `opacity` + `translateY(travel-sm)` from the anchor side, `base` `out`; `transform-origin` at the anchor | `fast` `in` | anchor | none | opacity |
| T3.5 | Toast | `fade-up` travel-sm, `base` `out` (`cq-anim-toast-in`) | `opacity` `fast` `in`; stacking toasts move up `base` | bottom | none | opacity |
| T3.6 | Full-screen menu (marketing) | `clip-path: inset(0 0 100% 0 round 0 0 40px 40px) → inset(0)` 800ms `out`; links `translateY(110% → 0)` `reveal` delay 120 + 60i; note `fade-up` 800 delay 400 | reverse, 500ms `in` | top edge | is the scrim (canvas 90% + blur 40) | opacity |
| T3.7 | Command palette | as T3.1 but from `translateY(−travel-lg)` | `fast` | top centre | scrim | opacity |

Exit is always ≤ 50% of enter (MP2). Focus moves into the overlay on enter and back to the opener on exit.

## T4. Route and page transitions

| Id | Platform | Forward | Back | Lateral (tabs) | Modal route | RM |
|:--|:--|:--|:--|:--|:--|:--|
| T4.1 | Web, View Transitions API (`motion.css`) | old `opacity`→0 `base` `in`; new `opacity` 0→1 + `translateY(travel-route 24 → 0)` `page` `out` | same with `translateY(−24)` | crossfade `base`, no travel | T3.1 | instant |
| T4.2 | Web fallback (no VT) | `opacity` crossfade `base` | same | same | | |
| T4.3 | Next.js App Router | `<ViewTransition>` where available, else T4.2 via a layout-level `AnimatePresence` | | | | |
| T4.4 | Flutter | `CinqPageTransitionsBuilder`: fade + 3% rise, `page` `out` (generated) | reverse | `PageView` with `emphasized` | `showModalBottomSheet` T3.2 | `Duration.zero` |
| T4.5 | SwiftUI / Compose | `.transition(.opacity.combined(with: .offset(y: 24)))`; `fadeIn + slideInVertically(24)` | | | | |

Direction grammar: **forward** rises from below, **back** descends from above, **lateral** slides ±24px horizontally with a crossfade, **modal** scales in (T3.1). A push that is not one of these is a bug.

## T5. Shared-element and container transforms

| Id | Pair | Web | Flutter | Dur / ease |
|:--|:--|:--|:--|:--|
| T5.1 | List row → detail | `view-transition-name` on the row title and the detail title; the group moves, others crossfade | `Hero` on the title | `page` `emphasized` |
| T5.2 | Card → drawer | Card gets `view-transition-name: panel`; drawer's header shares it; the card's box morphs into the drawer header | `Hero` on the card | `page` `emphasized` |
| T5.3 | Chip → filter bar | Chip morphs into its slot in the filter bar (FLIP with GSAP `Flip.from`) | `AnimatedPositioned` | `base` `out` |
| T5.4 | Founder name (canonical M19) | One element: translate + rotate 90→0 + scale 0.5→1 + clip | | `reveal` `out` |

## T6. List and layout motion

| Id | Change | Anatomy | Dur / ease | RM |
|:--|:--|:--|:--|:--|
| T6.1 | Insert | New item `fade-up` travel-sm; siblings below FLIP down (GSAP `Flip` / Motion `layout`) | `base` `out` | instant |
| T6.2 | Remove | Item `opacity` → 0 and `scale(0.98)` `fast` `in`; siblings FLIP up `base` | | instant |
| T6.3 | Reorder | FLIP, `base` `emphasized` | | instant |
| T6.4 | Accordion expand | `height` auto via Motion `layout` (permitted exception) + content `opacity` `base` | `base` `in-out` | instant |
| T6.5 | Tab indicator | `transform: translateX/scaleX` to the active tab, `base` `out` | | instant |
| T6.6 | Table row expand | Detail row `clip-path: inset(0 0 100% 0 → 0)` + `opacity`, `base` | | instant |
| T6.7 | Drag and drop | Lifted item `scale(1.02)` + `shadow-slab` `fast`; others FLIP `base`; drop snaps with `spring-snappy` | | none |
| T6.8 | Sidebar collapse | Width via FLIP of the container, labels `opacity` `fast` | `base` `emphasized` | instant |

## T7. Scroll-driven

Marketing only, except T7.2 and T7.5 which apps may use.

| Id | Effect | Anatomy | RM |
|:--|:--|:--|:--|
| T7.1 | Reveal on scroll (`RevealText`, cards) | Lines rise out of masks `translateY(110%) rotate(2deg) → 0`, `headline`/`reveal` `out`, `stagger-lines`; cards `fade-up` travel-reveal 40 + `blur-reveal` 6→0 `cinematic`; `start: top 85%`, once | none (content visible) |
| T7.2 | Sticky header compression (apps) | App bar height 72 → 56 and title `scale(0.85)` via `animation-timeline: scroll()` with a class fallback at 80px | none |
| T7.3 | Parallax | ≤ ±10% (`xPercent 10 → −10` canonical) on a visual inside a moving panel; never on text | none |
| T7.4 | Pinned stack / deck (SM5) | Card pins at `top 10–14%`, next scrubs it to `scale 0.92–0.94`, veil to 0.55–0.6, blur 2 (stack) | cards simply stack |
| T7.5 | Progress indicator | `scaleX` scrub, linear | static 0 |
| T7.6 | Horizontal room | Track `x: −(scrollWidth − innerWidth)`, `scrub: 1`, pinned; `containerAnimation` for inner reveals | vertical stack |
| T7.7 | Word fill (studio) | `opacity` 0.16 → 1, `stagger` 40, `scrub 0.6` | all 1 |
| T7.8 | Hero exit | copy `yPercent −18` + `opacity` 0, scrub `top top` → `bottom 40%` | none |

`animation-timeline: scroll()` is permitted for T7.2 and T7.5 with a JS fallback; everything else is GSAP.

## T8. Gesture-driven

| Id | Gesture | Physics | Haptic |
|:--|:--|:--|:--|
| T8.1 | Swipe to dismiss (sheet, toast, row) | Follows the finger 1:1; release velocity > 500px/s or offset > 40% → dismiss with `spring-snappy`; else return `spring-soft`. Rubber-band beyond the origin at 0.35× | light on threshold cross |
| T8.2 | Bottom sheet snap points | `content`, `50%`, `90%`; `spring-soft`; velocity > 800px/s skips a point | light on snap |
| T8.3 | Pull to refresh | The mark appears at 0.6× pull distance, segments fill with distance, spins at threshold 72px; release runs the loader until data | medium at threshold |
| T8.4 | Drag reorder | T6.7; long-press 300ms to lift | medium on lift, light on drop |
| T8.5 | Horizontal swipe between tabs | `PageView` / scroll-snap, `emphasized`, indicator follows | none |

## T9. Data motion

| Id | Element | Anatomy | Dur | RM |
|:--|:--|:--|:--|:--|
| T9.1 | Count-up | 0 → n, `expo.out`, once in view; tabular figures; suffix static | `count` 1600 | final value |
| T9.2 | Ticker (live number) | T2.6 roll | `base` | instant |
| T9.3 | Chart draw-in | Line `stroke-dashoffset` → 0 `page` `out`; area `opacity` 0 → 1 `base` after; bars `scaleY` from baseline `base` `out` `stagger` 40 | | final |
| T9.4 | Chart update | Points/bars FLIP to new values `base` `in-out`; axis labels crossfade `fast` | | instant |
| T9.5 | Live pulse | Status dot `glow-breathe` 2.4s; row `live-edge` 2s once | | dot static |
| T9.6 | Progress bar | `scaleX` linear as value changes, `base`; indeterminate: `shimmer` | | static |

## T10. Splash and boot (apps)

Cold start, ms:

| t | Event |
|:--|:--|
| 0 | Native splash: `surface-canvas` with the mark centred at 64px in `accent-fill`, static (OS-drawn) |
| 0–400 | App shell loads. If ready before 400, hold until 400 so the mark is seen once. |
| 400–1000 | Segments chase once (`mark-chase` one cycle, 1200ms shortened to 600 by starting at −600ms) while the first screen's skeleton mounts beneath at `opacity` 0 |
| 1000–1300 | Mark `scale(1 → 0.92)` + `opacity` → 0 `base` `in`; skeleton `opacity` → 1 `base` |
| 1300 → data | Skeleton (T2.1) |
| data | Content crossfade T2.1 |

Warm start: skip to 1000 with the mark already at rest for 150ms. Reduced motion: splash → content instantly, mark static. Skip: any tap after 400ms ends the sequence. Never a progress bar on the splash. Marketing preloader (M1) is a separate, once-per-session sequence and never appears in apps.

## T11. Ambient and brand motion

| Id | Effect | Allowed where | Cap |
|:--|:--|:--|:--|
| T11.1 | Glow breathe (`glow-breathe`) | A live status dot in consoles and dashboards | 1 per view, 2.4s |
| T11.2 | Gradient drift (`gradient-drift`) | Marketing hero stand-ins only | 12s, pauses offscreen |
| T11.3 | Wordmark weight wave (`weight-wave`) | Footer on touch devices; pointer-driven on desktop | 1 per page |
| T11.4 | Mark idle | None. The mark spins only as a loader or on hover/tap (M4). | |
| T11.5 | Marquee | Marketing, one per page | 38s loop |

None of these in forms, consoles (except T11.1) or dialogs.

## T12. Skeleton and shimmer

- Geometry: one skeleton block per text line (height = line-height × 1em, width 70/85/55% alternating), per image (its aspect ratio), per control (its `control-h`). Never generic grey rectangles of one size.
- Pulse: `opacity` 0.4 ↔ 0.8, `count` 1600 `in-out`, all blocks in phase.
- Shimmer: `gradient-shimmer` at 100°, layer 200% wide, `background-position` 200% → −200% over 1600 linear, blocks staggered 60ms up to 8.
- Surface: `surface-raised` on the panel's surface.
- After 8s without data, replace the skeleton with the error state (T2.3 semantics, `components/global-states.md`).

## T13. Choreography rules

- **Hierarchy moves first**: the focal region enters before its subordinates; within a region, heading → lead → controls → list items.
- **Stagger**: 60ms siblings, cap 8, then simultaneous. Lines 90ms. Letters 18ms. Never a stagger on more than 24 elements.
- **Overlap**: the next element starts at 40% of the previous one's duration (GSAP position `"-=60%"`), never after it ends.
- **Interruption**: every tween uses `overwrite: "auto"` (GSAP) or Motion's default retargeting; a new state mid-tween starts from the current value.
- **Cancellation**: unmount kills timelines (`useGSAP` cleanup, `mm.revert()`); `AnimatePresence` for exits.
- **Nothing waits**: content is in the DOM and accessible before its reveal; reveals are visual only.

## T14. Platform mapping

| Transition | CSS | Motion / Motion One | GSAP | Flutter | SwiftUI / Compose |
|:--|:--|:--|:--|:--|:--|
| Hover colour T1.1 | `transition: color var(--transition-hover-color)` | | | `AnimatedDefaultTextStyle(duration: fast)` | `.animation(.easeOut(duration: .15))` / `animateColorAsState` |
| Press T1.3 | `.cq-press` | `whileTap={{ scale: 0.97 }}` | | `GestureDetector` + `AnimatedScale(0.97, press, CinqCurve.out)` | `.scaleEffect` / `animateFloatAsState` |
| Dialog T3.1 | `.cq-anim-dialog-in` + `::backdrop` | `transitions.dialogIn` | | `showGeneralDialog(transitionBuilder: FadeTransition + ScaleTransition(0.98))` | `.transition(.scale(0.98).combined(with: .opacity))` |
| Sheet T3.2 | `.cq-anim-sheet-in` | `transitions.sheetIn` | | `showModalBottomSheet` (default curve replaced with `CinqCurve.emphasized`, `press`) | `.sheet` / `ModalBottomSheet` |
| Route T4 | view transitions | `AnimatePresence` | | `CinqPageTransitionsBuilder` | `NavigationStack` transitions |
| Reveal T7.1 | `.cq-mask > .cq-line` | `whileInView` + `transitions.reveal` | `SplitText` + `ScrollTrigger` | `SlideTransition` from `Offset(0, 1.1)` clipped by `ClipRect` | |
| Stack T7.4 | | | `ScrollTrigger pin` | `SliverPersistentHeader` + `Transform.scale` from scroll offset | |
| Skeleton T12 | `.cq-skeleton(-shimmer)` | | | `AnimatedOpacity` loop + `ShaderMask` | |
| Count-up T9.1 | | `animate(0, n)` | `gsap.to(obj)` | `TweenAnimationBuilder<int>` | |
| Springs | `--spring-*` `linear()` | `springs.*` | | `SpringSimulation(CinqSpring.*)` | `.spring(response:…)` |
