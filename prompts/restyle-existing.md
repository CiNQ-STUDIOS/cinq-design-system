# Prompt · convert an existing product

For a product that already has UI and is moving onto the system. Run the
audit prompt first; this prompt assumes its inventory exists.

```
Convert <product> to the CiNQ design system, surface by surface.

Read brand/design-system/AGENTS.md and follow the retrofit procedure. The audit inventory is at <path>. The product profile is at <path>; if it is not filled in, fill it before anything else.

Order of work, and do not skip ahead:

1. Land the tokens with nothing changing visually.
   - Import tokens/tokens.css before all other styles, and the Tailwind mapping for the version in use.
   - Add the theme init script as the first child of <head>.
   - Load the three fonts with the system's variable names.
   - Build and look. If anything moved, the import order is wrong. Fix that before continuing.

2. Convert one surface at a time. Take the surfaces from the profile in this order: the one users see most, then the rest. For each surface:
   a. Confirm the archetype and set data-density on its root.
   b. Canvas and text colours: replace every literal with a token. The audit lists them.
   c. Type: map every size to a --text-* role; every weight to 400, 500, 700 or 800.
   d. Controls: replace buttons, fields, toggles with the primitives. Keep the product's handlers; change only the presentation.
   e. Cards and tables: replace with Slab and Table. Add the empty, loading and error states the audit found missing.
   f. Navigation: the archetype's pattern.
   g. Overlays: Dialog, BottomSheet, Toast. Native <dialog> replaces any custom trap.
   h. Motion: strip anything outside the archetype's budget. Put remaining scroll effects inside matchMedia.
   i. Copy: sentence case, no em-dashes, buttons say what happens, banned words out, CiNQ spelled correctly. Move strings to the content module.
   j. Walk spec/PRE-SHIP.md for this surface and write the report. Ship the surface. Then the next.

3. Delete old styles only when a grep shows nothing references them.

Rules while converting:
- Do not change behaviour. If a handler, a route, a data shape or a validation rule must change to fit the system, stop and list it as a question instead.
- Do not merge two surfaces to save time.
- Every rule you could not follow goes in the profile's deviation register with a reason and a review date. Not a code comment, not a TODO.
- Hard constraints (DESIGN.md §1) cannot be registered as deviations. Fix them.

Report after each surface with the PRE-SHIP template, and at the end with a summary: surfaces converted, deviations registered, old styles deleted, open questions.
```
