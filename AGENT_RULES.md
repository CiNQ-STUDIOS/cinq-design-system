# CiNQ agent rules

Read before touching UI code in any CiNQ product. Imperative, short, enforced by `tooling/`. Longer reasoning lives in `DESIGN.md` and the files it indexes; this file is the contract.

The name is `CiNQ`. Not Cinq, not CINQ. Products: `CiNQ RMS`.

## 1. Load order

| Task | Read, in order |
|:--|:--|
| Any UI work, first time in a repo | this file → the product's `project-profile.md` → `DESIGN.md` → `layout-architecture/archetypes.md` → `layout-architecture/anti-bento-grammar.md` |
| New screen | `layout-architecture/screen-inventory.md` (find the screen, take its archetype) → that archetype → `components/*` for each component → `foundations/transitions-and-choreography.md` for each motion |
| Restyle an existing product | `MIGRATION_PLAYBOOK.md` |
| Any colour, size, radius, shadow, duration | `foundations/tokens.json` via `implementations/variables.css`; never a literal |
| Copy | `foundations/content-voice.md` |
| Charts | `components/data-visualization.md` |
| Print, receipts, email | `patterns/documents-and-print.md` |
| Flutter | `implementations/flutter_theme.dart` + `platforms/mobile-apps.md` |

## 2. Never

- A hex, rgb, hsl, oklch, named colour, or Tailwind palette class in a component. Tokens only.
- A primitive token (`--color-*`) in a component. The semantic layer only.
- A raw gradient. `var(--gradient-<name>)` from the catalog, and never a two-hue gradient.
- A raw shadow, `shadow-md/lg`, `drop-shadow`, or Flutter `elevation > 0`. `var(--shadow-<name>)` or nothing.
- A raw duration or easing in CSS, Motion, GSAP or Flutter. `--dur-*`, `--ease-*`, `springs.*`, `CinqDuration.*`, `CinqCurve.*`.
- A `@keyframes` block in a product stylesheet. Add it to `tokens.json` `motion.*` and rebuild.
- Animating `height`, `width`, `top`, `left`, `margin`, `padding`, `font-size`. Transform, opacity, clip-path, filter (≤ 6px, one element) only, plus the documented exceptions.
- `backdrop-filter` on anything that scrolls. Glass is fixed chrome.
- A numeric `z-index`. `var(--z-<layer>)`.
- A font-family, weight or size literal. Weights are 400, 500, 700, 800.
- A second accent hue. Vermilion is the only accent; feedback colours are signals with an icon or label.
- More than one vermilion fill region per viewport (one primary button, or one colour block, or one selected set, or one stat group).
- `accent-fill` as a text colour. Words use `accent-text`.
- Bone or paper text on vermilion. Text on vermilion is ink.
- Pure `#000` or `#fff` as canvas or type.
- A generic card grid: `repeat(auto-fit…)`, equal columns of equal cards, a card per number, a card inside a card, a module-tile "overview".
- Two regions of equal weight where one should dominate (anti-bento R1–R9).
- A modal to view or edit a record. Drawer for edit, inline for view, dialog for a decision.
- A page with any state missing: every control has rest, hover, focus-visible, active, disabled, loading (invalid for fields); every region has idle, loading, empty, error, success.
- A library spinner, a generic grey skeleton, an illustration in an empty state, confetti, a sound without a setting.
- Framework default transitions (Material ripple, Bootstrap fade, default `PageRoute`) surviving in a product.
- Scroll-linked or pointer-driven motion in apps; any motion under reduced motion that hides content.
- Title Case, em-dashes, exclamation marks, the banned words, `Submit` / `OK` / `Learn more` / `Get started`, invented numbers, names or logos.
- Inline copy in components. Strings live in the content module.
- A screen without a named archetype and reading path.
- Reporting "done" without the checklist in §5.

## 3. Always

- Tokens through `implementations/variables.css` (or the Tailwind mapping, `react_tokens.ts`, `flutter_theme.dart`); `tokens:build` after any token change; `tokens:check` before commit.
- Both modes, every screen. Dark is default; `html.light` is the opt-in; `html.contrast` and `data-motion="reduced"` work.
- One archetype per screen; `data-density` on its root per the archetype; the reading path stated in the profile.
- Sentence case; buttons say what happens; `Rs 12,500`; `19 Sep 2026`; 24-hour in tools.
- Focus visible; labels bound; 44px targets; state never colour alone; `<dialog>` for overlays; live regions for async.
- Named transitions only (`T1.1` … `T12`), each with its reduced-motion behaviour.
- Geometry-matched skeletons; the mark as the loader; toasts with Undo for reversible actions.
- Custom CSS in `@layer components`.
- Deviations in the product profile with a reason and a review date; hard constraints are bugs, not deviations.
- `npm run verify` and `npm run lint` green before "done".

## 4. New screen: the decision tree

```
Signed out?                     → 9 Auth / entry (or the marketing platform doc for public pages)
One linear task with an end?    → 4 Setup / onboarding
One record?                     → 5 Detail / record
Settings or configuration?      → 8 Settings
Phone first?                    → 6 Mobile utility
Tablet, kiosk, till?            → 7 Tablet / kiosk / POS
Watched for hours, live items?  → 1 Operational console
KPIs and charts?                → 2 Executive dashboard
Otherwise                       → 3 Data workspace
```

Then: the wireframe in `archetypes.md`, its density, its motion budget, its "never" list, its five lifecycle states with copy.

## 5. Per-screen checklist (paste into the report)

```
Screen: <name> · Archetype: <n> · Density: <mode> · Reading path: <F | Z | anchor-and-rail | single column>
[ ] Dominant region ≥ 40%, ≤ 4 regions, weight ratio ≥ 2:1 (R1–R3)
[ ] Exactly one vermilion fill region; accent-text for words
[ ] Tokens only: npm run lint clean on the files touched
[ ] Both modes viewed; high contrast viewed; reduced motion viewed and complete
[ ] Every control state; every region state, with copy from content-voice.md
[ ] Motion: each animation named T<x>; only allowed properties; within the archetype budget
[ ] Gradients: only catalog tokens; ≤ 1 ambient glow; none in consoles/forms
[ ] Accessibility: focus, labels, targets, roles/keys, live regions, table alternative for charts
[ ] Copy: sentence case, no em-dashes, buttons say what happens, CiNQ spelled right, nothing invented
[ ] Numbers tabular; money and dates in the profile's locale
[ ] Responsive: 320px reflow, 200% zoom, phone/tablet/desktop per grid-and-spacing.md §6
[ ] Deviations registered (ids) or none
Verify: npm run verify · npm run lint · npm run audit -- <dir> score ≥ 90
```

## 6. The reskin test

Before calling a migration or a new build done, answer in writing:

1. Remove `variables.css` and put a generic theme back. Does the screen **still look like CiNQ**? It must not: layout, hierarchy, density, motion and states should be recognisably CiNQ without the colours. If it still looks generic with our colours, you have reskinned.
2. Blur the screenshot. **One** region dominates?
3. Desaturate it. Hierarchy survives?
4. `npm run audit` on the product: **structure** category at zero hits?
5. Every transition in the product is a named `T<x>`? No framework defaults left?

A "no" to any of these is not done.

## 7. Snippets for agent rule loaders

`CLAUDE.md` and `.cursorrules` at the repo root repeat the load order and the never/always lists in ≤ 60 lines and point here. Copy them into a product next to its own instructions; keep them first.
