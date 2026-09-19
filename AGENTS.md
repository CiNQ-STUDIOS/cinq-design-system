# CiNQ design system. Read this first.

You are an AI coding agent working on a CiNQ product. This folder is the
complete design system: tokens, specs, reference components, prompts and a
gate. Read what the table says to read, in order, before writing UI. Do not
ask the owner a design question this folder already answers.

The name is written `CiNQ`. Not Cinq, not CINQ.

## Load order

| Task | Read, in order |
|:---|:---|
| Any UI work, first time in a repo | this file → `project-profile.md` (or `profiles/<product>.md` if it exists) → `spec/DESIGN.md` → `spec/SURFACES.md` → `tokens/tokens.css` |
| Build a new screen | `prompts/new-surface.md` → `spec/SURFACES.md` (the archetype) → `code/react/primitives.tsx` → `spec/PRE-SHIP.md` |
| Convert an existing product | `prompts/audit-existing.md` first, then `prompts/restyle-existing.md` |
| Audit only | `prompts/audit-existing.md` |
| Touch a colour, size or motion value | `spec/DESIGN.md` §2, §3 or §6, then `tokens/tokens.css`. Never a literal. |
| Write copy | `spec/DESIGN.md` §8 |
| Add a token, component or archetype | `spec/DESIGN.md` §10 → `CHANGELOG.md` |
| Working in a tool that cannot read files | paste `prompts/standalone-system-prompt.md` |

`rules/cinq-design.mdc` is the short form of this file for Cursor, Windsurf
and Claude Code rule loaders.

## First run in a product

1. **Detect the stack.** Framework, styling (Tailwind v4, v3, none), motion library, icon set, font loading, theme mechanism. Do not change any of them to fit the system; the system fits them.
2. **Fill the profile.** Copy `project-profile.md` to the product root (or `profiles/<product>.md` here) and answer every field. Name every surface and its archetype from `spec/SURFACES.md`. Leave nothing as a placeholder.
3. **Install the tokens.** Import `tokens/tokens.css` once, before everything else. Then the Tailwind mapping for the version in use, or nothing if there is no Tailwind. Add the theme init script from `tokens/theme-init.ts` as the first child of `<head>`. Load the three fonts with the variable names in `spec/DESIGN.md` §3.
4. **Choose the archetype** for the surface at hand and set `data-density` on its root.
5. **Build** from `code/react/primitives.tsx` and `primitives.css` (copy them in; they have no dependencies). Compose; do not write a parallel button.
6. **Walk the gate** in `spec/PRE-SHIP.md` and report with its template.

## Standing rules

**Never**
- A colour, radius, shadow, font size or duration literal in a component. Tokens only.
- A second accent. Semantic colours are signals, not accents.
- Bone text on vermilion. Text on a vermilion fill is ink.
- `text-accent` for a word. Words are `text-accent-text`; fills, the mark and display numerals are `accent`.
- Pure black or pure white as canvas or type.
- Gradients or glass in UI, except glass on fixed chrome and the hero shader on the marketing site.
- A medium shadow. Large and soft, or none.
- Two motion libraries on one element, or scroll-linked motion under reduced motion.
- Title Case, em-dashes, exclamation marks, the banned words, or a button that says Submit.
- Invented numbers, names, addresses, logos or testimonials.
- Skipping a state. Every control has rest, hover, focus-visible, active, disabled, loading; every region has empty, loading, error.
- Reporting done without the pre-ship report.

**Always**
- Sentence case. Buttons say what happens.
- Both modes, every screen. Dark is default, `html.light` is the opt-in.
- Focus visible, labels bound, tap targets 44px, colour never the only signal.
- Tabular figures in number columns. `Rs 12,500`. `19 Sep 2026`.
- One archetype per screen, named in the profile.
- Copy in a content module, not inline.
- Custom CSS in `@layer components`.
- Deviations registered in the profile with a reason and a review date.

## What adapts and what does not

Does not change, ever, per product: the tokens' values, the hard constraints
in DESIGN.md §1, the accent split, the type faces and weights, the voice
rules, the accessibility floor, the wordmark.

Changes per product, and is written in the profile: the surfaces and their
archetypes, the density, the locale and currency, the motion budget within
the archetype's ceiling, the icon weight, the framework and how tokens are
consumed, product-specific components composed from the primitives.

## Retrofit procedure

For a product that already has UI:

1. Run `prompts/audit-existing.md`. Produce the written inventory. Do not touch code yet.
2. Land the tokens (step 3 above) behind the existing styles. Nothing should change visually yet.
3. Convert by surface, not by file: pick one archetype, convert every screen in it, gate it, ship it. Then the next.
4. Inside a surface, convert in this order: canvas and text colours → type scale → controls (buttons, fields) → cards and tables → navigation → overlays → motion → copy.
5. Delete the old styles only when nothing references them. Grep before every delete.
6. Every departure you could not resolve goes in the deviation register with a review date, not in a comment.

## Where things are

```
brand/design-system/
├── AGENTS.md                  this file
├── README.md                  for humans
├── CHANGELOG.md               every token and rule change
├── project-profile.md         template, one per product
├── profiles/cinq-website.md   the filled profile for cinqstudios.com
├── tokens/
│   ├── tokens.css             source of truth, both modes, all densities
│   ├── build-tokens.js        regenerates the two mirrors below
│   ├── tokens.ts              generated
│   ├── tokens.json            generated
│   ├── tailwind-v4.css        @theme mapping
│   ├── tailwind-v3.cjs        preset
│   └── theme-init.ts          pre-paint mode script, toggle, subscribe
├── spec/
│   ├── DESIGN.md              the visual language
│   ├── SURFACES.md            five archetypes, decision tree, product map
│   └── PRE-SHIP.md            the gate and its report template
├── code/react/
│   ├── primitives.css         token-bound classes
│   └── primitives.tsx         the components
├── prompts/
│   ├── new-surface.md
│   ├── restyle-existing.md
│   ├── audit-existing.md
│   └── standalone-system-prompt.md
└── rules/cinq-design.mdc
```
