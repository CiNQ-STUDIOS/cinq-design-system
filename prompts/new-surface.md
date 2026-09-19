# Prompt · build a new screen

Paste the block below, fill the angle brackets, and give it to an agent that
can read the repository.

```
Build <the screen> for <product>.

Before writing anything:
1. Read brand/design-system/AGENTS.md and follow its load order.
2. Read the product profile (project-profile.md or profiles/<product>.md). If none exists, stop and run the first-run procedure in AGENTS.md; do not build on an unprofiled product.
3. Name the archetype for this screen from layout-architecture/archetypes.md and say why in one line. If it sits between two, take the plainer one.
4. List which primitives from code/react/primitives.tsx you will compose and which product-specific compositions you need. Do not write a new button, input, dialog, table or nav if a primitive exists.

Then build it:
- Bind every colour, size, radius, shadow and duration to a token. No literals.
- Set data-density on the surface root per the archetype.
- Implement every state: for each control rest, hover, focus-visible, active, disabled, loading (and invalid for fields); for each region empty, loading, error.
- Write copy per DESIGN.md §8 and put it in the product's content module, not inline. Sentence case, no em-dashes, buttons say what happens, no banned words, no invented numbers or names.
- Format money and dates per the profile's locale.
- Stay inside the archetype's motion budget. Scroll effects only on marketing and only inside matchMedia. Nothing positional under reduced motion.
- Both modes. Check dark and html.light before you say it works.

Content I am giving you: <paste the real copy, data shapes and any source material>.
Anything not in that material is not on the screen. Ask, do not invent.

When done, walk AGENT_RULES.md §5 and answer with its report template. Register any deviation in the profile with a reason and a review date. Do not report done without the report.
```
