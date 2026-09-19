# CiNQ design system

The canonical, multi-platform design system for every CiNQ product: cinqstudios.com, CiNQ RMS, Dentisto, Qeemat and client work. Version 2.0.0.

It is not a brand kit and not a theme. It is a system an AI coding agent or a person can drop into a repository and use to build or convert any screen so that it is structurally CiNQ: the right archetype, one dominant region, the right density, the named transitions, every state, the tokens. Applying only the token layer to a generic app visibly fails to look finished, and the tooling says so with a score.

## Start here

- People: `DESIGN.md` (the index and the philosophy), then the showcase: open `showcase/index.html` from disk (no network needed).
- Agents: `AGENTS.md` → `AGENT_RULES.md`.
- Migrating a product: `MIGRATION_PLAYBOOK.md`.
- Every decision and its provenance: `DECISIONS.md`; the source audit: `audit/`.

## Layout

```
DESIGN.md · DECISIONS.md · AGENT_RULES.md · COVERAGE_MATRIX.md · MIGRATION_PLAYBOOK.md · PROGRESS.md · CHANGELOG.md
audit/                 BRAND_DNA.md, GAP_ANALYSIS.md
foundations/           tokens.json (source of truth) + eleven specifications + the generated contrast matrix
layout-architecture/   grid and spacing, anti-bento grammar, nine archetypes, screen inventory
components/            global states, core primitives, advanced form controls, navigation, data surfaces, data visualisation, overlays and feedback
patterns/              onboarding, forms and validation, search and command, realtime and offline, auth and permissions, documents and print
platforms/             web and dashboards, mobile apps, tablet/kiosk/POS, marketing and demos
implementations/       GENERATED: variables.css, tailwind.v4.css, tailwind.config.ts, react_tokens.ts, motion.css, flutter_theme.dart
code/                  react/primitives.tsx + primitives.css, theme-init.ts
tooling/               tokens build, lint, audit script, contrast check, motion and gradient check, coverage check, showcase build
governance/            VERSIONING.md, CONTRIBUTING.md, TESTING.md
showcase/              index.html, motion-lab.html, gradient-lab.html, archetypes/ (ten reference screens), bundled fonts
prompts/ · profiles/ · project-profile.md · rules/ · scripts/
```

## Commands

```
npm install
npm run build      tokens → implementations · showcase pages · contrast matrix · coverage matrix
npm run verify     tokens:check · contrast · motion:check · coverage · typecheck
npm run lint       the cinq ESLint rule on code/ and showcase/
npm run audit -- path/to/product/src --report audit.md
```

## Installing into a product

```
./scripts/install-to-product.sh path/to/product --submodule
```

vendors this repository at `brand/design-system/`. Import `implementations/variables.css` first, then `tailwind.v4.css` (or use the `tailwind.config.ts` preset), `motion.css`, and `code/react/primitives.css`; add `code/theme-init.ts`'s script as the first child of `<head>`; Flutter apps use `implementations/flutter_theme.dart`. Then point the agent at `AGENT_RULES.md`.

## Where the values come from

The brand kit (`cinq-website/brand/brand-kit.html`, 19 Sep 2026) and the site's source are canonical; `audit/BRAND_DNA.md` lists every value with its file and line. Everything derived or proposed on top of them is tagged in `DECISIONS.md` with how to overrule it.
