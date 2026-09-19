# Changelog

Semantic versions (`governance/VERSIONING.md`). Newest first. Sections: Added, Changed, Deprecated, Removed, Fixed, Decisions.

## 2.0.0 · 19 Sep 2026

The system that restructures a product instead of recolouring it. Built from the master prompt (`Cinq-Design-Update.zip`, 19 Sep) on top of 1.0.0; `PROGRESS.md` carries the phase log and the final report.

### Added
- `audit/BRAND_DNA.md` (every value with provenance, 8 principles, 12 signature moves, the full gradient and motion inventories) and `audit/GAP_ANALYSIS.md`.
- `foundations/tokens.json`, W3C DTCG, the only hand-authored token file: 416 tokens across colour, type, space, radius, border, shadow, blur, opacity, z-index, breakpoint, layout, density, gradient, duration, easing, spring, transition and keyframe references; light and high-contrast values on the same token.
- `tooling/tokens/build.js` and the generated `implementations/`: `variables.css`, `tailwind.v4.css`, `tailwind.config.ts`, `react_tokens.ts`, `motion.css`, `flutter_theme.dart`, `manifest.json`; `npm run tokens:build` and `tokens:check`.
- Eleven foundation specifications, including `gradients-and-effects.md` (the catalog, illuminated borders, glow caps, glass, grain, quality and paint budgets), `motion.md`, `transitions-and-choreography.md` (T1–T14), `sound-and-haptics.md`, `theming-and-whitelabel.md`; the generated `contrast-matrix.md` (273 pairs).
- `layout-architecture/`: grid and spacing with four densities, the anti-bento grammar (R1–R9), nine archetypes with wireframes and lifecycle states, the screen inventory.
- Seven component specifications in one fixed format; six patterns; four platform documents.
- `tooling/lint` (ESLint rule + Stylelint config), `audit-script` (scored report), `contrast-check`, `motion-check` (+ `--gradients`), `coverage`, `showcase` builders.
- `governance/` (versioning, contributing, testing); `AGENT_RULES.md`, `CLAUDE.md`, `.cursorrules`; `MIGRATION_PLAYBOOK.md` with the RMS case study; `COVERAGE_MATRIX.md` (generated, 63 items).
- `showcase/`: the living style guide, the motion lab, the gradient lab, ten reference screens, bundled fonts.
- `code/theme-init.ts`: contrast and in-app motion settings alongside the theme.

### Changed
- Semantic token names are canonical (`--surface-*`, `--text-*`, `--accent-*`, `--line-*`, `--feedback-*`); the 1.0.0 names (`--ink`, `--bone`, `--accent`, `--canvas`, `--text`, `--positive`, `--radius`, `--pad`, …) are generated as aliases.
- Paper is `#efe9dd` with 16% multiply grain (canonical, D-004); light-mode text and feedback colours deepened to keep AA on the darker paper (D-033); a `line-boundary` token for field borders; pressed accent fills `#e8521f` / `#dc4318`.
- `code/react/primitives.css` binds to `variables.css` and `motion.css` (its own keyframes removed); the dialog scrim is `--surface-scrim`.
- Prompts, profiles and the `.mdc` rule point at the new structure.

### Deprecated
- The 1.0.0 alias names listed above; removed in 3.0.0 once the website imports the shared tokens (D-032).

### Removed
- `spec/` (superseded by `DESIGN.md`, `foundations/`, `layout-architecture/`, `components/`, `AGENT_RULES.md`) and `tokens/` (superseded by `foundations/tokens.json` and `implementations/`).

### Decisions
- D-001 to D-033 in `DECISIONS.md`: 5 canonical, 21 derived, 7 proposed (see the final report in `PROGRESS.md`).

## 1.0.0 · 19 Sep 2026

First release. Lifted from cinqstudios.com (`src/app/globals.css`,
`docs/design-system.md`, `brand/brand-kit.html`) and generalised to every
surface the studio builds.

### The name

`CiNQ`, three capitals and one lowercase i, replaces `Cinq` in prose and
the lowercase `cinq` wordmark. The site, the logo files, the brand kit and
the business cards were regenerated in the same change.

### Lifted as-is from the site

Ink and bone canvases and text in both modes; the vermilion accent and the
accent split (`--accent` for fills, `--accent-text` deepened on paper);
amber as a shader-only colour; the three faces and their weights; the
fluid type scale (`display`, `hero`, `title`, `lead`, `body`, `small`,
`mono`); 28px and 16px marketing radii and full-round pills; the double
bezel card; glass on fixed chrome only; large soft ink-tinted shadows and no
medium shadow; the two easing curves; the library ownership rule (GSAP for
scroll, Motion for state, R3F for the hero); the reduced-motion rule; the
voice rules; sentence case; no em-dashes; the banned-word list; dark by
default with `html.light` opt-in and no OS following.

### Derived, and how to overrule each

These were decided without a brief. Each is a defensible default, not a
brand decision. To change one, edit `tokens/tokens.css`, run
`tokens/build-tokens.js`, update the Tailwind files and `spec/DESIGN.md`,
and add a 1.x entry here.

| # | Decision | Why | Overrule by |
|:---|:---|:---|:---|
| 1 | Role names (`--canvas`, `--text`) are canonical; `--ink`, `--bone` are aliases. | "Ink" turning into paper in light mode confuses new readers; roles do not. The site keeps working. | Drop the aliases in 2.0 once the site imports the shared tokens. |
| 2 | Vermilion ramp of eleven steps at OKLCH hue 36°, `500` = the accent. | Charts, tints and hover math need a family; the brand had one hex. | Regenerate with different lightness or chroma stops; keep `500` fixed. |
| 3 | Semantic colours: positive mint `#4fcf8e`, negative rose `#ff5c7c`, attention gold `#f2c14e`, info sky `#7db3ff` on ink; deepened on paper. | The brand had none. Negative is a rose so it never reads as the accent. All measured 4.5:1 or better as text on their canvas. | Any hex that passes 4.5:1 on both canvases; re-measure and update §9. |
| 4 | Attention as UI colour, distinct from `--amber`. | The kit says amber is never UI. Attention needs a yellow. They are different hexes on purpose. | Merge them if the shader-only rule is dropped. |
| 5 | Chart order: vermilion, sky, mint, gold, lilac, bone-2. | The first series should be the brand. The rest are spaced for colour vision deficiency. | Reorder or replace; keep series 1 vermilion. |
| 6 | App canvas family with `--app-sunken` `#080807` and `--app-inverse`. | Dashboards need an input well darker than the panel and a tooltip that reads as an object. The site had neither. | Set `--app-sunken` to `--app-canvas` for a flatter look. |
| 7 | `--app-surface` is `#ffffff` on paper. | Inputs on paper need a surface lighter than paper. The one permitted white. | Set it to `--canvas-2` and accept lower input contrast. |
| 8 | App radii 12 / 16 / 20 / 28. | Tight in tools, big on the site. Nested radii step down by padding. | Change the four values; keep pills round. |
| 9 | Three densities: comfortable 44px, compact 36px, dense 32px controls. | Marketing and phones, dashboards, consoles. | Change the numbers per level; keep 44px touch targets. |
| 10 | Layout: app max 1600px, sidebar 264px, bottom nav 64px, prose 68ch. | Common defaults that fit the type scale. | Any value. |
| 11 | Duration tokens 150 / 300 / 600 / 900 / 700ms and 60ms stagger. | Named from what the site does (`0.5s` colour, `0.6s` transform, ~1s reveals). | Any value; keep the two curves. |
| 12 | Five archetypes and the product map in `SURFACES.md`. | RMS, Dentisto and Qeemat each have several surfaces; the archetype answers most questions before a component is placed. | Add or merge archetypes per §10 of DESIGN.md. |
| 13 | Locale `en-PK`, `Rs 12,500`, `19 Sep 2026`, 24-hour in tools. | The studio is in Islamabad; the products are for Pakistani businesses. SpiceHUT (Canada) overrides in its profile. | Per product, in the profile. |
| 14 | Phosphor icons, one weight per surface. | The site uses Phosphor. | Per product, in the profile. |
| 15 | Native `<dialog>` for Dialog and BottomSheet. | Focus trap, Escape and focus return for free; no dependency. | Replace in a product with a headless library that provides the same. |
| 16 | Light mode does not follow the OS. | The brand is dark. The site already works this way. `themeInitScriptFollowingSystem` exists for products that disagree. | Set `followSystem` in the profile and use the other script. |
| 17 | The report template in `PRE-SHIP.md` is mandatory. | "All good" is not a report. | Do not. |
