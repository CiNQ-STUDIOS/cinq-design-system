# CiNQ design system

The portable, agent-readable universal design system for every CiNQ product. Drop
this folder into any product repository at `brand/design-system/`, point an AI coding agent at `brand/design-system/AGENTS.md`, and
it has everything it needs to build or convert any screen without asking a
design question: the colours in both modes, the type, the shapes, the
motion, the components, the copy rules, the accessibility floor and a gate
to walk before it says it is done.

It is not the brand kit. `brand/brand-kit.html` is the mark, the wordmark,
the swatches and the cards, for people. This is the same brand written as
rules and code, for software.

---

## Adding to any product repository

To use this design system in your product repo, pull it into `brand/design-system/`:

### Method 1: Git Submodule (Recommended)

Keeps the design system versioned and cleanly updatable across products:

```bash
# In your product repo root:
git submodule add https://github.com/CiNQ-STUDIOS/cinq-design-system.git brand/design-system
git submodule update --init --recursive
```

To pull the latest updates whenever the design system changes:
```bash
git submodule update --remote --merge
```

### Method 2: Direct Clone / Vendor

If your product does not use submodules:

```bash
# Clone directly into brand/design-system
git clone https://github.com/CiNQ-STUDIOS/cinq-design-system.git brand/design-system

# (Optional) Remove nested .git folder if committing directly to your repo
rm -rf brand/design-system/.git
# On Windows PowerShell:
Remove-Item -Recurse -Force brand/design-system/.git
```

---

## Driving your AI coding agent

Once `brand/design-system` is in your product folder, launch your AI coding agent (Claude Code, Cursor, Windsurf, Antigravity, Copilot, etc.) and give it this starting prompt:

```markdown
Read brand/design-system/AGENTS.md first and follow its first-run procedure exactly.

This is a new product: <name>, <one line on what it does and for whom>.
Stack: <Next.js 16 / Expo / plain HTML>, <Tailwind v4 / none>.
Primary surface: <dashboard / mobile app / console / form flow>. Others: <list, or none>.
Locale: en-PK, PKR, unless told otherwise.

Before building anything:
1. Fill project-profile.md for this product. Every field, nothing left as a placeholder. Name every surface and its archetype from spec/SURFACES.md.
2. Install the tokens, the Tailwind mapping, the theme init script and the three fonts per AGENTS.md step 3.
3. Copy code/react/primitives.tsx and primitives.css in. Compose from them; do not write a parallel button, input, dialog, table or nav.

Then build these screens, in this order: <list>.

Content and data I am giving you: <paste real copy, data shapes, anything the screens show>. Anything not in that material is not on the screen. Ask, do not invent.

When done, walk spec/PRE-SHIP.md and answer with its report template. Register any deviation in the profile with a reason and a review date. Do not report done without the report.
```

---

## What is in it

| Path | What | Who reads it |
|:---|:---|:---|
| `AGENTS.md` | Load order, first-run procedure, standing rules, retrofit procedure | Every agent, first |
| `project-profile.md` | Per-product template: surfaces, stack, locale, deviations | Copied and filled once per product |
| `profiles/cinq-website.md` | The filled profile for cinqstudios.com | Anyone working on the site |
| `tokens/tokens.css` | Every value, both modes, three densities. The source of truth. | Every product |
| `tokens/tokens.ts`, `tokens.json` | Generated mirrors for TypeScript and for non-web targets | Charts, React Native, Figma, email |
| `tokens/tailwind-v4.css`, `tailwind-v3.cjs` | Tailwind mappings | Tailwind products |
| `tokens/theme-init.ts` | Dark by default, light opt-in, no flash | Every web product |
| `spec/DESIGN.md` | The visual language: identity, colour, type, shape, density, motion, components, voice, accessibility, extension | Agents making visual decisions |
| `spec/SURFACES.md` | The five archetypes, a decision tree, the product map | Agents building a screen |
| `spec/PRE-SHIP.md` | The gate and the report template | Agents before reporting done |
| `code/react/primitives.tsx`, `primitives.css` | Copy-in components with every state, zero dependencies | React products |
| `prompts/` | Task prompts for a new screen, a conversion, an audit, and a self-contained prompt for tools without file access | Whoever is driving the agent |
| `rules/cinq-design.mdc` | The short rule file for Cursor, Windsurf, Claude Code | Repo-aware agents |
| `CHANGELOG.md` | Every change to a token or a rule | Everyone, when something looks different |

---

## Keeping it alive

- **A new token** goes in `tokens.css` in both modes with a comment, then `node tokens/build-tokens.js`, then the two Tailwind files, then `DESIGN.md`, then `CHANGELOG.md`.
- **A deviation** goes in the product's profile with a reason and a review date. It never goes in a code comment.
- **A new product** gets a filled profile committed to its own repository, and a row in `SURFACES.md`'s product map.
- **A breaking change** (a renamed token, a removed component) is a major version. A new token or component is a minor. A corrected value is a patch.

## Where the values came from

The site at cinqstudios.com. Its `globals.css` was the first token file and
its `docs/design-system.md` the first spec. This folder generalises both to
every surface the studio builds, adds what the site never needed (an app
canvas, semantic colours, chart series, three densities, five archetypes,
a gate) and measures every text pair. Decisions that were derived rather
than lifted are listed in `CHANGELOG.md` under 1.0.0 so they can be
overruled.
