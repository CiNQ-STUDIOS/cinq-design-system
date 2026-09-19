# Changelog

Semantic versions. Major for a renamed or removed token, component or rule.
Minor for a new one. Patch for a corrected value or wording. Every entry
says what changed and why, so two agents six months apart do not reinvent
the same token.

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
