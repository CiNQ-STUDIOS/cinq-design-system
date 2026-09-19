# Prompt · audit an existing product

Produces the written inventory that the restyle prompt works from. Read
only; nothing is changed.

```
Audit <product> against the CiNQ design system. Do not change any file. Produce a written inventory at <path>/design-audit.md.

Read brand/design-system/AGENTS.md, DESIGN.md and layout-architecture/archetypes.md first.

Inventory, in this order, with file paths and line numbers for every finding:

1. Surfaces. List every screen or route. Group them into surfaces and name the archetype each should be. Flag any screen that mixes two.

2. Literals. Grep and count:
   - colours: #hex, rgb(, hsl(, named colours
   - radii: border-radius with a px or rem value
   - shadows: box-shadow with a value
   - durations: transition or animation with ms or s
   - font sizes and families
   For each, list the distinct values and how many times each occurs. Map each distinct value to the nearest token, or mark it "no token" with a proposal.

3. Colour rules. Any text on a fill that fails 4.5:1 (measure it). Any bone-on-vermilion. Any second accent. Any pure black or white canvas. Any gradient or glass in UI. Any dark-only colour that will break in light mode.

4. Type. Every weight in use. Every uppercase use outside mono labels. Any Title Case headings or buttons. Any body text wider than 68ch. Any non-tabular number column.

5. Components. For each button, field, card, table, nav, overlay: which primitive it maps to, and which states are missing (rest, hover, focus-visible, active, disabled, loading, invalid; empty, loading, error).

6. Navigation. The pattern in use versus the archetype's. Bottom navs with more than five items. Sidebars on phones. Missing aria-current.

7. Motion. Every library in use and what it animates. Any element animated by two. Anything animating height, width, top or left. Anything scroll-linked without a reduced-motion check. Anything over the archetype's budget.

8. Accessibility. Missing labels, missing alt, removed outlines, tap targets under 44px, colour-only states, custom widgets without roles, dialogs without focus management, forms that do not announce errors.

9. Copy. Every string with an em-dash, an exclamation mark, Title Case, a banned word, a "Submit" / "OK" / "Learn more", or "Cinq" / "CINQ" spelled wrong. Strings living inline in components rather than a content module. Any number, name, address or logo that cannot be traced to source material.

10. Locale. Money and date formats in use versus the profile.

Close with:
- A count of findings per section.
- The three changes that would fix the most findings at once.
- A proposed conversion order by surface.
- Questions for the owner, only where the material does not answer.

Do not soften findings and do not pad them. A finding is a path, a line, what it is, and what it should be.
```
