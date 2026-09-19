# Gap analysis

What the sources can express, what they cannot, and what this system adds
to close each gap. "Covered by" names the file in this repository that
closes the gap; provenance tags follow DECISIONS.md.

## 1. The reskin failure, diagnosed

Design system 1.0.0 (S4) was applied to the RMS back office and produced
"same bento cards, same screens, new hex codes". The audit of 1.0.0 against
the RMS symptoms:

| Symptom in RMS | Why 1.0.0 allowed it | Closed by |
|:--|:--|:--|
| Equal-weight card grid on the dashboard | `SURFACES.md` named "dashboard" but never forbade a grid of equals; no weight ratio, no focal rule | `layout-architecture/anti-bento-grammar.md` rules R1–R9; P5 |
| Every screen a grid of `Slab` | Primitives shipped a card before a layout grammar existed | `layout-architecture/archetypes.md` (9 archetypes with wireframes and region roles); `screen-inventory.md` |
| Default framework transitions (fade 200ms) survived | Motion tokens existed but no transition catalog said which transition a modal, a route, a row uses | `foundations/transitions-and-choreography.md`; `implementations/motion.css`; `tooling/motion-check` |
| Orange everywhere: buttons, headers, badges, chart bars | 1.0.0 had the accent split but no per-view accent budget | `foundations/color-system.md` §Accent budget; `anti-bento-grammar.md` R6 |
| Generic grey skeletons | Loading state was described, not geometry-matched | `components/global-states.md` §Loading; `transitions-and-choreography.md` T2 |
| Table with no density, no pinning, no bulk actions | 1.0.0 `Table` was a marketing-grade table | `components/data-surfaces.md` |
| POS on a touch till unreadable in daylight | No touch/kiosk platform doc | `platforms/tablet-kiosk-pos.md` |
| Receipts printed from the browser default | No print/document pattern | `patterns/documents-and-print.md` |
| Agents "applied the tokens" and stopped | The gate (`PRE-SHIP.md`) checked tokens and states, not structure | `AGENT_RULES.md` reskin test; `COVERAGE_MATRIX.md`; acceptance tests |

## 2. Gaps by area

| Area | In the sources | Gap | Covered by | Tag |
|:--|:--|:--|:--|:--|
| Colour primitives | Ink ×5, bone ×3, vermilion ×3, amber, paper ×4 | No neutral ramp, no vermilion ramp beyond three stops, no semantic feedback set, no interaction tokens, no high-contrast mapping | `foundations/tokens.json` `color.primitive.*`, `color.semantic.*`; `foundations/color-system.md` | derived / proposed |
| Gradients | 17 instances, all alpha-over-token except the shader | No names, no catalog, no light-mode retune, no banding rule, no Flutter form | `foundations/gradients-and-effects.md`; `tokens.json` `gradient.*` | canonical values, derived catalog |
| Glow | Cursor glow, card ambience, phone backlight | No elevation mapping, no cap per view, no live-state pulse | `gradients-and-effects.md` §Glow; `elevation-depth.md` | derived |
| Type | Full marketing scale, three faces | No H4–H6, no functional roles (caption, overline, code, badge, tabular), no Urdu fallback, no loading strategy stated | `foundations/typography.md`; `tokens.json` `typography.*` | derived / proposed |
| Depth | Bezel, glass, four shadows | No level scale, no z-index names, no fallback without `backdrop-filter` | `foundations/elevation-depth.md` | derived |
| Motion | 30 inventoried animations, two easings, five springs | No named duration scale, no rule tying distance to duration, no interruption rule, no perf budget, no per-animation reduced-motion statement, no route transition | `foundations/motion.md`; `transitions-and-choreography.md`; `implementations/motion.css` | derived |
| Layout | Marketing rhythm and section families | No grid for apps, no density row heights, no reading path, no anti-bento rules | `layout-architecture/*` | derived / proposed |
| Components | Button, slab, field, toggle, segmented, table, nav, dialog, sheet, toast, states (S4) | No combobox, pickers, upload, slider, stepper, OTP, breadcrumbs, tabs, pagination, command bar, drawer, banner, notification centre, charts | `components/*` | proposed |
| Patterns | A mailto form | No onboarding, validation, search, realtime/offline, auth/permissions, print | `patterns/*` | proposed |
| Platforms | Next.js site; React primitives | No mobile, tablet/kiosk, Flutter, print | `platforms/*`; `implementations/flutter_theme.dart` | proposed |
| States | Empty, loading, error, success (S4, marketing-grade) | No first-use vs no-results vs no-permission, no optimistic/rollback, no degraded, no boot sequence | `components/global-states.md` | derived |
| Accessibility | Measured contrast for site pairs; 12 standing rules (S4) | No AAA target statement, no forced-colours mapping, no reduced-transparency, no SR announcement map per component | `foundations/accessibility.md`; `tooling/contrast-check` | derived |
| Voice | Kit voice rules; `content.ts` | No i18n, RTL (Urdu), number/date formats beyond S4's locale note | `foundations/content-voice.md` | derived |
| Sound/haptics | None | Nothing | `foundations/sound-and-haptics.md` | proposed |
| Theming | Dark default, light opt-in | No high-contrast, no white-label bounds for client products (SpiceHUT) | `foundations/theming-and-whitelabel.md` | proposed |
| Tooling | `build-tokens.js` (css → ts/json) | Source of truth was CSS, not DTCG; no check, no lint, no audit, no contrast or motion verifiers | `foundations/tokens.json`; `tooling/*`; `package.json` scripts | proposed |
| Governance | CHANGELOG, deviation register | No versioning policy, contributing, testing | `governance/*` | proposed |
| Showcase | `brand-kit.html` (identity only) | No living style guide, no motion or gradient lab, no reference screens | `showcase/*` | proposed |

## 3. Things marketing styling cannot express, and the rule that replaces it

| Need | Marketing answer | Product answer (this system) |
|:--|:--|:--|
| 400 orders on one screen | 28px cards, 44px controls | Console archetype: dense mode, 32px rows, `--radius-control` 12px, no bezel, sunken table well, sticky first column |
| A form with 30 fields | A pill field with a glow | Form flow: 12px-radius fields in a 560px column, section groups, inline validation on blur, a review step |
| A till in daylight, greasy fingers | Ink canvas with vermilion accents | Touch mode: 56px targets, `--text-body` 1.0625rem minimum, paper canvas permitted for glare, no hover states, no ambient glow |
| Offline for two hours at a restaurant | n/a | Realtime/offline pattern: queue indicator, optimistic rows with a pending badge, conflict dialog on reconnect |
| A permission-denied page | n/a | Global states: no-permission empty variant, never a 404 for a 403 |
| A thermal receipt | n/a | Documents/print: 80mm and 58mm stylesheets, mono, no colour, the mark as a 24px bitmap |
| A phone with one thumb | Hover cards, marquee, magnetic buttons | Mobile utility archetype: bottom nav, sheets, 44px, no pointer effects, deck for repeated content |
| A chart of daily sales | n/a | Data visualisation: series 1 vermilion, area fill = G-area (accent 24% → 0), 400ms draw-in, tabular axis labels |

## 4. Acceptance criteria this analysis commits to

Each maps to §10 of the master prompt and to a script or a documented
manual test in `governance/TESTING.md`.

1. Swap test: `MIGRATION_PLAYBOOK.md` §1 shows the token-only RMS and names what is still wrong.
2. Greyscale, squint: `showcase/archetypes/*` screenshots pass; procedure in `TESTING.md`.
3. Trace: every rule in `layout-architecture/`, `components/`, `patterns/` cites a P- or SM- id from `BRAND_DNA.md`.
4. Parity: `npm run tokens:check`.
5. Compile: `npm run tokens:build` type-checks `tailwind.config.ts` and `react_tokens.ts`; `dart analyze` when a Dart SDK is present.
6. Contrast: `npm run contrast`.
7. Motion: `npm run motion:check`.
8. Gradient: `npm run gradient:check` (part of `motion:check`).
9. Coverage: `npm run coverage`.
