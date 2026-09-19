# CiNQ design system. Read this first.

You are an AI coding agent working on a CiNQ product. This repository is the complete, enforceable design system: tokens, the layout grammar, archetypes, components, patterns, platforms, tooling and a showcase. Start with **`AGENT_RULES.md`**, which is the contract, then follow its load order. `DESIGN.md` is the index.

The name is written `CiNQ`. Not Cinq, not CINQ.

| Need | Go to |
|:--|:--|
| The rules and the per-screen checklist | `AGENT_RULES.md` |
| The index and the philosophy | `DESIGN.md` |
| A value (colour, size, motion) | `foundations/tokens.json` → `implementations/variables.css` (never a literal) |
| Which layout a screen uses | `layout-architecture/screen-inventory.md` → `archetypes.md` |
| Why bento is banned and what replaces it | `layout-architecture/anti-bento-grammar.md` |
| A component's states and motion | `components/*` and `foundations/transitions-and-choreography.md` |
| Converting an existing product | `MIGRATION_PLAYBOOK.md` |
| A task prompt | `prompts/` (`new-surface`, `restyle-existing`, `audit-existing`, `standalone-system-prompt` for tools without file access) |
| The per-product record | `project-profile.md` (template), `profiles/cinq-website.md` (filled) |
| Verification | `npm run verify`, `npm run lint`, `npm run audit -- <dir>` |
| See it | `showcase/index.html`, `motion-lab.html`, `gradient-lab.html`, `archetypes/*.html` (open from disk) |

First run in a product: detect the stack → fill `project-profile.md` (every screen mapped to an archetype) → import the tokens (`implementations/variables.css` + the Tailwind mapping, or `flutter_theme.dart`) and `code/theme-init.ts` → copy `code/react/primitives.*` → build on the archetype → walk the checklist → report with the template. Retrofitting an existing product: `MIGRATION_PLAYBOOK.md`, phase by phase.

`CLAUDE.md` and `.cursorrules` repeat the never/always lists for rule loaders; `rules/cinq-design.mdc` is the same for `.mdc` loaders.
