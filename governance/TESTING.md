# Testing

What is verified, how, and by which command. Automated checks live in `tooling/` and run with `npm run verify`; manual procedures are written so two people get the same result.

## 1. Automated (`npm run verify`)

| Check | Command | Fails when |
|:--|:--|:--|
| Token parity | `npm run tokens:check` | any generated file is stale, a semantic colour lacks a light value, an alias is unresolved |
| Contrast | `npm run contrast` | any text pair < 4.5 (or < 3 on the large-text list), any boundary/chart mark < 3, in any of the three modes |
| Motion | `npm run motion:check` | a non-library curve, a raw duration, a layout property animated, a keyframe not generated, backdrop-filter off fixed chrome, a stylesheet with motion and no reduced-motion path |
| Gradients | `npm run gradient:check` | a two-hue UI gradient, a gradient without a light resolution, a raw gradient in code, a catalog gradient missing from the gradient lab |
| Coverage | `npm run coverage` | an item in `coverage.json` without an existing file or its phrase, a required file missing, a placeholder word anywhere |
| Types | `npm run typecheck` | `react_tokens.ts`, `tailwind.config.ts`, `theme-init.ts` or `primitives.tsx` fail `tsc --strict` |
| Lint | `npm run lint` | a literal design value in `code/` or `showcase/` |
| Audit (report, not a gate) | `npm run audit -- <dir> --report audit.md` | never; CI may gate on the score (`--json`, `score`) |

CI: run `npm ci && npm run verify && npm run lint` on every push; publish `foundations/contrast-matrix.md` and `COVERAGE_MATRIX.md` as artefacts; block merge on red.

## 2. Compile tests

| Target | How | Status in this environment |
|:--|:--|:--|
| `tailwind.config.ts` | `tsc` with `tailwindcss` types installed | verified |
| `react_tokens.ts`, `primitives.tsx` | `tsc --strict` | verified |
| `variables.css`, `motion.css` | Loaded by every showcase page in Chromium; a parse error shows as unstyled output in the screenshot procedure | verified visually |
| `flutter_theme.dart` | `dart analyze implementations/flutter_theme.dart` in a Flutter checkout (`flutter create` a scratch app, copy the file into `lib/`, run `flutter analyze`) | not run here; no Dart SDK on the build machine. The file uses only `material.dart` and `physics.dart`, `const` constructors, `Color.fromRGBO`, `Cubic`, `SpringDescription`, `ThemeExtension`. Run it in the first Flutter product and record the result in `PROGRESS.md`. |

## 3. Visual regression

Screenshot every page in `showcase/` at 1440 × 900 (dark, light, high contrast, reduced motion) and every archetype at 390 × 844 with Playwright; store under `showcase/__screens__/` (ignored in git, kept in CI artefacts); compare against the previous run with a 0.2% pixel threshold. Any diff on a token-only change is investigated before merge.

Procedure (Playwright, from the repo root):

```js
for (const page of pages) for (const mode of ["", "light", "contrast"]) {
  await p.goto(`file://${page}`); await p.evaluate((m) => document.documentElement.className = m, mode);
  await p.emulateMedia({ reducedMotion: "no-preference" }); await p.screenshot({ path: `${name}-${mode || "dark"}.png`, fullPage: true });
}
```

## 4. Accessibility automation

axe-core against every showcase page and archetype in both modes: zero violations of `color-contrast`, `label`, `button-name`, `link-name`, `aria-*`, `focus-order-semantics`. Keyboard walk script: Tab through the page, assert every focus stop has a visible ring (`getComputedStyle(el).outlineStyle !== "none"`) and that overlays trap and return.

## 5. Manual procedures

**Squint test** (per archetype screen, both modes): blur the screenshot with a 12px Gaussian; exactly one region reads as the dominant mass. Record pass/fail in `PROGRESS.md`.

**Greyscale test**: desaturate the screenshot; the dominant region, rails and chrome are still distinguishable by lightness and type; the primary action is still found within 3 seconds by someone who has not seen the screen.

**Swap test**: apply only `implementations/variables.css` to a generic Bootstrap or Material app; the audit script must score it below 70 (structure and motion categories keep it there), proving tokens alone are not the system.

**Trace test**: every rule in `layout-architecture/`, `components/`, `patterns/` cites a P or SM id; `grep -L "P[0-9]\|SM[0-9]" layout-architecture/*.md components/*.md patterns/*.md` returns nothing.

**Screen reader pass** (per archetype, before a release): VoiceOver (Safari, iOS) and NVDA (Chrome, Windows): every control announced with role, name and state; every error announced; live regions heard; dialogs announced as dialogs with their title.

**Forced colours**: Windows High Contrast (Aquatic and Desert themes): controls keep borders, focus visible, selected rows distinguishable.

**Real devices** (before a release of a product): an iPhone and an Android phone for mobile utility; a mounted 1280 × 800 till and a 1080 × 1920 kiosk for touch; a 2560 × 1440 monitor for the 3xl tier on marketing.

**Motion**: with `prefers-reduced-motion` on, every archetype screenshot contains all content; the motion lab's reduced-motion toggle shows every transition as an instant or a fade; DevTools performance recording of the console with 200 live rows stays at 60fps on a mid-range laptop.

**Print**: receipt on 80mm and 58mm printers from the console reference screen; the invoice PDF; the dashboard through the print stylesheet.

**Offline**: `patterns/realtime-and-offline.md` §8.

## 6. Acceptance tests (master prompt §10) and where each is recorded

| Test | Evidence |
|:--|:--|
| Swap | §5 swap test result in `PROGRESS.md`; `MIGRATION_PLAYBOOK.md` §1 |
| Greyscale, squint | §5 results per archetype in `PROGRESS.md` |
| Trace | §5 grep |
| Parity | `npm run tokens:check` |
| Compile | §2 |
| Contrast | `npm run contrast` and `foundations/contrast-matrix.md` |
| Motion | `npm run motion:check`; motion lab renders every transition |
| Gradient | `npm run gradient:check`; gradient lab renders every gradient |
| Coverage | `npm run coverage`; `COVERAGE_MATRIX.md` |
