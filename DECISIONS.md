# Decision log

Every token, rule and component decision carries one of three tags.

- **canonical**: found in a source (brand kit, the brand conversation, the site, design system 1.0.0). Cited.
- **derived**: extended logically from canonical decisions. The canonical decisions it rests on are named.
- **proposed**: an addition with no source. Kept as a default until a founder confirms or overrules it.

Precedence: brand kit and the brand conversation > `universal_design_system_guide.md` > the 1.0.0 repo > inference. A canonical decision is never silently changed; a proposal to change one is logged here and the original stays the default.

| ID | Decision | Tag | Rests on / rationale | Where |
|:--|:--|:--|:--|:--|
| D-001 | The 19 Sep 2026 `brand-kit.html` (`CiNQ`, `cinqdevstudio@gmail.com`) is the canonical kit, not the 11 Sep copy in the update zip. | canonical | The founders chose the `CiNQ` wordmark (option A) on 19 Sep; the kit was rebuilt from that decision. The zip's copy is the same document before it. | `audit/BRAND_DNA.md` §Sources |
| D-002 | The name is written `CiNQ` everywhere, including in this repository; the master prompt's `CINQ` is read as the same name. | canonical | Kit: "Always written this way, in running text as much as in the mark." | everywhere |
| D-003 | Dark is the default; light is an opt-in that does not follow the OS. | canonical | Kit: "Dark is the brand and the default. Light mode exists as an opt-in." `theme.ts`. | `foundations/theming-and-whitelabel.md` |
| D-004 | Paper is `#efe9dd` with 16% multiply grain, not `#f4f1ea`. | canonical | Founders' 19 Sep request: "textured, creamy off-white / grainy neutral". | `tokens.json` `color.primitive.paper` |
| D-005 | 1.0.0 is retained and restructured, not restarted. `spec/` and `tokens/` are superseded by `foundations/`, `layout-architecture/`, `components/` and `implementations/`; `code/react`, `prompts/`, `profiles/`, `project-profile.md` stay. | derived | Master prompt §12 "refactor and expand rather than restart". | `CHANGELOG.md` 2.0.0 |
| D-006 | `foundations/tokens.json` (DTCG) is the only hand-authored token file; `tokens/tokens.css` from 1.0.0 is replaced by the generated `implementations/variables.css`, which is a superset with the same names. | derived | Master prompt §3. Names kept so the website's `globals.css` still maps 1:1. | `implementations/` |
| D-007 | Light-mode values live on the same token under `$extensions["cinq.modes"].light`; a semantic colour without one fails `tokens:check`. | proposed | DTCG has no mode syntax yet; one file, one token, both modes keeps parity checkable. | `tooling/tokens/build.js` |
| D-008 | Modes are `:root` (dark) and `html.light`; high-contrast is `html.contrast`; density is `[data-density]`; touch is `[data-input="touch"]`. | derived | D-003 and the site's existing `html.light` and `data-density` conventions. | `variables.css` |
| D-009 | Native targets are web and Flutter. SwiftUI and Compose stubs are not generated. | derived | The master prompt names Flutter explicitly; no source names Swift or Kotlin. Add when a product does. | `implementations/` |
| D-010 | Neutral ramp: 11 warm steps from `#f7f4ee` to `#0c0b0a` built around ink and bone. | derived | Ink `#0c0b0a` and bone `#f3efe7` are canonical endpoints; steps interpolate in OKLCH at the same hue. | `color-system.md` |
| D-011 | Vermilion ramp: 11 steps, hue locked at OKLCH 36°, `500` = `#f9633a`. | derived | Carried from 1.0.0; the accent is canonical. | `color-system.md` |
| D-012 | Semantic feedback: success mint `#4fcf8e`, warning gold `#f2c14e`, danger rose `#ff5c7c`, info sky `#7db3ff` on ink; deepened on paper. Danger is a rose so it never reads as the accent. | derived | Carried from 1.0.0 (there D-3). Amber is fenced to the shader by the kit, so warning cannot be amber. | `color-system.md` |
| D-013 | Chart series order: vermilion, sky, mint, gold, lilac, bone-2. | derived | Carried from 1.0.0; series 1 is the brand. | `data-visualization.md` |
| D-014 | Accent budget per view: one vermilion fill region (a primary button or one colour block), unlimited vermilion text/icon signals within contrast rules. | derived | P1 "one accent"; RMS symptom "orange everywhere". | `color-system.md`, `anti-bento-grammar.md` R6 |
| D-015 | Every UI gradient is one token colour to transparent (alpha gradient). Two-hue gradients are the shader and the OG image only. | canonical | Inventory G1–G17; kit: "Amber … never as UI", "Vermilion deep: gradients and print shadows only". | `gradients-and-effects.md` |
| D-016 | Gradients interpolate `in oklch` when they cross a hue (shader stand-ins) and `in srgb` for alpha fades, matching `color-mix(in srgb …)` on the site. | derived | Keeps generated CSS byte-compatible with the site's existing alpha gradients. | `gradients-and-effects.md` |
| D-017 | Glow cap: one ambient glow per viewport; illuminated borders unlimited but only on hover/focus; live-state pulse only in consoles. | derived | P1; SM7; RMS symptom. | `gradients-and-effects.md` |
| D-018 | Elevation levels 0–5 with fixed blur, shadow and border per level; glass only at levels 4–5 and only on fixed chrome. | derived | P4; the site's `.glass` and `.bezel`. | `elevation-depth.md` |
| D-019 | Duration scale: 100, 150, 300, 500, 600, 900, 1200 ms named `instant`, `fast`, `base`, `slow`, `press`, `reveal`, `cinematic`; the site's existing values map onto it. | derived | Inventory §6 durations. | `motion.md` |
| D-020 | Easing library: `out` `[0.16,1,0.3,1]`, `in-out` `[0.65,0,0.35,1]`, `in` `[0.7,0,0.84,0]`, `emphasized` `[0.2,0,0,1]`, `back` `[0.34,1.56,0.64,1]`, `linear`. Springs `snappy 180/16/0.4`, `soft 140/18/1`, `glow 120/20/1`, `ambient 60/20/0.8`. | derived | Two canonical curves plus the springs in use; `in` and `emphasized` added for exits and emphasized moves. | `motion.md` |
| D-021 | Route transitions on the web use the View Transitions API with a 700ms crossfade + 24px travel; fallback is an opacity fade. | proposed | The site has one page; products will have routes. | `transitions-and-choreography.md` T4 |
| D-022 | Nine archetypes replace the five surfaces of 1.0.0: operational console, executive dashboard, data workspace, setup/onboarding, detail/record, mobile utility, tablet/kiosk, settings, auth/entry. Marketing keeps its own platform doc. | derived | Master prompt §7; the five of 1.0.0 map onto these. | `archetypes.md` |
| D-023 | Anti-bento rules R1–R9 (dominant region ≥ 40% of content area, ≤ 4 regions per view, weight ratio ≥ 2:1, one focal region, cards only for repeated peers). | proposed | The RMS symptom; P5. | `anti-bento-grammar.md` |
| D-024 | Density: compact 36px controls / 40px rows, comfortable 44 / 52, touch 56 / 64. | derived | 1.0.0 had comfortable/compact/dense; kiosk needs touch. Dense (32px) survives as an opt-in on consoles. | `grid-and-spacing.md` |
| D-025 | Locale defaults `en-PK`, `Rs 12,500`, `19 Sep 2026`, 24-hour in tools; Urdu (RTL) planned with Noto Nastaliq Urdu fallback. | derived | Carried from 1.0.0; the studio and its first products are in Pakistan. | `content-voice.md` |
| D-026 | Haptics: light on toggle, medium on confirm, heavy on destructive confirm, none on navigation. No audio by default; an optional order-in chime on the kitchen display. | proposed | No source. | `sound-and-haptics.md` |
| D-027 | White-label: a client product may swap the accent hue and the wordmark; it may not change ink, bone, radii, type, or motion. | proposed | SpiceHUT exists as a client product with its own brand. | `theming-and-whitelabel.md` |
| D-028 | Web lint is an ESLint flat config plus a Stylelint config; the audit script is Node with no dependencies; contrast, motion and coverage checks are Node with no dependencies. | proposed | Keeps the repo installable with `npm install` and nothing global. | `tooling/` |
| D-029 | Tailwind output is a v4 `@theme` CSS file plus a v3-compatible `tailwind.config.ts` preset, both generated. | derived | The site is on v4; RMS may be on v3. | `implementations/` |
| D-030 | The showcase uses only `implementations/variables.css` and `motion.css`; no framework. | derived | The kit opens without a network; the showcase should too. | `showcase/` |
| D-031 | `AGENTS.md` stays as the file agents read first and points at `AGENT_RULES.md`; `CLAUDE.md` and `.cursorrules` are emitted. | derived | Claude Code reads `AGENTS.md`/`CLAUDE.md` by name. | root |
| D-032 | The website's vendored `brand/design-system/` is to be replaced by this repo via `scripts/install-to-product.sh --submodule`. Not done in this pass. | proposed | Avoids two diverging copies. | `MIGRATION_PLAYBOOK.md` |

Counts are kept current in the final report of each release in `PROGRESS.md`.
