# Progress

Design system 2.0.0 build, gated phases. Each phase is one commit.

| Phase | Deliverables | Status |
|:--|:--|:--|
| 0 · Audit | `audit/BRAND_DNA.md`, `audit/GAP_ANALYSIS.md`, `DECISIONS.md` seeded | done |
| 1 · Tokens + pipeline | `foundations/tokens.json` (413 tokens), `tooling/tokens/build.js`, `implementations/*` (7 files), `tokens:build`, `tokens:check`, `typecheck` | done |
| 2 · Foundations | colour, gradients and effects, typography, elevation, motion, transitions, iconography, accessibility (+ generated contrast matrix, 273 pairs, 0 failures), content and voice, sound and haptics, theming | done |
| 3 · Layout, components, patterns, platforms | grid and spacing, anti-bento grammar (R1–R9), nine archetypes with wireframes and lifecycle states, screen inventory; global states, core primitives, advanced form controls, navigation, data surfaces, data visualisation, overlays and feedback; onboarding, forms and validation, search and command, realtime and offline, auth and permissions, documents and print; web, mobile, tablet/kiosk/POS, marketing | done |
| 4 · Tooling + governance | ESLint flat config with the cinq rule, Stylelint config, audit script (scored report), contrast check (generated matrix), motion and gradient check, coverage check (generated matrix); versioning, contributing, testing | done |
| 5 · Showcase | `showcase/index.html` (every token, every component state, density and mode bar), `motion-lab.html` (6 easings, 5 springs, 20 durations, 16 transitions, 15 keyframes, reduced-motion toggle), `gradient-lab.html` (21 gradients, ring, wash, glow cap, glass, grain, duotone, data), ten reference screens in `showcase/archetypes/`; all generated or scaffolded by `tooling/showcase/*` and self-contained with bundled fonts | done |
| 6 · Enforcement + migration | `AGENT_RULES.md`, `MIGRATION_PLAYBOOK.md` (with the RMS case study), `COVERAGE_MATRIX.md` (generated, 63 items), `DESIGN.md`, `CLAUDE.md`, `.cursorrules`; README, AGENTS, CHANGELOG 2.0.0; retained 1.0.0 files repointed | done |
| 7 · Verification | every §10 test run; results below | done |

## Final report · 2.0.0 · 19 Sep 2026

### Files

79 files created or rewritten in this release (46 Markdown specifications and records, 7 generated implementations, 8 tooling scripts and configs, 2 code files, 13 showcase pages plus their stylesheet, script and fonts, 3 governance documents). Removed: `spec/` (3) and `tokens/` (7), superseded. Retained and repointed: `code/react/primitives.*`, `prompts/*`, `profiles/cinq-website.md`, `project-profile.md`, `rules/cinq-design.mdc`, `scripts/*`.

### Decisions logged

33 in `DECISIONS.md`: 5 canonical, 21 derived, 7 proposed. Each derived and proposed entry states what it rests on and how to overrule it.

### Acceptance tests (master prompt §10)

| Test | Result | Evidence |
|:--|:--|:--|
| Swap | pass | `npm run audit` on the website source, which carries the brand's colours already, scores 28/100 ("generic"): structure and motion categories keep a token-bound site far from "on system". The primitives and the showcase score 100. Report: `tooling/audit-script/audit.js <cinq-website/src> --report`. |
| Greyscale | pass | Six archetype screens desaturated (`governance/TESTING.md` §5): dominant region, rails and chrome remain distinct by lightness and type; the primary action is found by position and shape. |
| Squint | pass | The same six blurred at 12px: one mass dominates each (queue, chart, table, form column, items, queue). |
| Trace | pass | Every file in `layout-architecture/`, `components/`, `patterns/` cites P or SM ids in its header; `audit/BRAND_DNA.md` §9–10 define them. |
| Parity | pass | `tokens:check ok · 416 tokens · 7 files current`. |
| Compile | pass (web), not run (Dart) | `tsc --strict` on `react_tokens.ts`, `tailwind.config.ts`, `theme-init.ts`, `primitives.tsx`: clean. `variables.css` and `motion.css` load in Chromium on every showcase page with zero console errors. `flutter_theme.dart` was not analysed: no Dart SDK on this machine. The file uses only `material.dart` and `physics.dart`, const constructors, `Color.fromRGBO`, `Cubic`, `SpringDescription` and `ThemeExtension`; run `dart analyze` in the first Flutter product and record the result here. |
| Contrast | pass | `contrast: 273 pairs · 0 failures · body text AAA on 18/18 surfaces`; 27 light-mode failures were found and fixed during the build (D-033). |
| Motion | pass | `motion:check · 0 failures` on `code/` and `showcase/`; the motion lab renders 6 easings, 5 springs, 20 durations, 16 transitions and 15 keyframe animations with a reduced-motion toggle. |
| Gradient | pass | `gradient:check · 21 gradient tokens · 0 failures`; every token has a light resolution and is rendered in the gradient lab; no raw gradient in code or showcase. |
| Coverage | pass | `coverage: 63 items · 67 required files · 0 gaps`; no placeholder words anywhere. |

Also: `npm run lint` clean (the cinq ESLint rule on `code/` and `showcase/`).

### Known limitations

- Dart output is unverified by a compiler (above).
- The audit script is regex-based: it reads context (values, `<code>` text, `@font-face`, `cinq-allow:` lines) but a literal inside an unusual construct can slip past or a legitimate value can be flagged; treat the score as a signal, the report as the evidence.
- The showcase's reference screens are static HTML: they demonstrate structure, states and tokens, not data flow. The RMS "after" screen is a layout and component proof, not the product.
- Sound cues are specified, not shipped as assets.
- SwiftUI and Compose stubs are not generated (D-009).
- The website still vendors design system 1.0.0 at `brand/design-system/`; replacing it with this repository as a submodule is the first migration task (D-032). The website's own audit score (28) is its baseline for that migration.

### Recommended next steps

1. Vendor this repository into `cinq-website` (`scripts/install-to-product.sh --submodule`), swap `globals.css` to import `implementations/variables.css`, and bring the site's arbitrary Tailwind durations and inline gradients onto tokens (audit report attached to the profile).
2. Run `dart analyze` on `flutter_theme.dart` in the RMS or Qeemat app; fix and record.
3. Rebuild the RMS back office on `showcase/archetypes/rms-after.html` and `operational-console.html` per `MIGRATION_PLAYBOOK.md`, phase by phase, with the audit score as the gate.
4. Add the visual-regression and axe runs to CI (`governance/TESTING.md` §3–4).
5. Founders review the 7 proposed decisions (D-007, D-021, D-023, D-026, D-027, D-028, D-030, D-032) and the light-mode colour changes (D-033).
