# Contributing

How a token, component, pattern, archetype or rule gets into the system. Humans and agents follow the same steps; the review checklist is the same.

## 1. Before proposing

Search first: `foundations/`, `components/`, `patterns/`, `DECISIONS.md`. If the thing exists under another name, use it. If a rule forbids what you need, propose changing the rule (with a `DECISIONS.md` entry) rather than working around it in a product; a product-local workaround is a deviation and goes in that product's profile with a review date.

## 2. Adding a token

1. Add it to `foundations/tokens.json` in the right group with `$type`, `$description` (tag it `derived` or `proposed` and name what it rests on) and, for any semantic colour, a `light` value in `$extensions["cinq.modes"]`.
2. `npm run tokens:build`, then `npm run tokens:check` and `npm run contrast` (a text token must pass on every surface it may sit on; add pairs to `tooling/contrast-check/check.js` if the token creates new pairs).
3. Reference it from the spec that owns it (`color-system.md`, `motion.md`, …) with its use and its limits.
4. Add it to `showcase/index.html` (a swatch, a type row, a duration bar) so it is visible.
5. `CHANGELOG.md` Added; `DECISIONS.md` if it is a choice someone could disagree with.

Never: a token for one screen; a token that duplicates a primitive under a new name; a semantic token without a light value.

## 3. Adding a component

1. Spec first, in the fixed format (`components/core-primitives.md` header): anatomy, variants, sizes, tokens, behaviour, all states, motion (named transitions), gradient/glow, accessibility (roles, keys, announcements), platforms, do/don't, example.
2. Implement in `code/react/primitives.tsx` + `primitives.css` (no dependencies, every value a token, `@layer components`) and, when a Flutter product needs it, in that product's widget library following `flutter_theme.dart`.
3. Add it to `showcase/index.html` with every state rendered, and to the archetype reference screen where it belongs.
4. `npm run lint`, `npm run motion:check`, `npm run typecheck`.
5. `CHANGELOG.md` Added.

Never: a component that hardcodes a value; a component without a loading, empty or error state where those apply; a second component that does what an existing one does with a prop.

## 4. Adding a transition

Name it `T<group>.<n>` in `foundations/transitions-and-choreography.md` with anatomy, tokens, RM behaviour and platform mapping; add any new keyframes to `tokens.json` `motion.*` (never hand-written in a stylesheet); build; add it to `showcase/motion-lab.html`.

## 5. Adding an archetype or pattern

Only when no existing one fits a whole surface (not a screen). Fill every field of the archetype table, the wireframe and the five lifecycle states; add a branch to the decision tree; add a reference screen in `showcase/archetypes/`; map the affected screens in `screen-inventory.md`; `DECISIONS.md`.

## 6. Changing a rule

Open a change with: the rule, the proposed wording, which principle (P) or signature move (SM) it traces to, what it would have caught or allowed in an existing product, and the `DECISIONS.md` entry. A rule that cannot be tested is not a rule.

## 7. Review checklist

- [ ] Traces to a P or SM (or adds one to `audit/BRAND_DNA.md` with a source).
- [ ] Every value is a token; `npm run verify` and `npm run lint` are green.
- [ ] Both modes rendered in the showcase; contrast matrix regenerated if colours changed.
- [ ] All states specified; motion named; RM behaviour stated.
- [ ] Accessibility row complete (role, keyboard, announcement).
- [ ] Copy follows `content-voice.md` (sentence case, no em-dashes, `CiNQ`).
- [ ] `CHANGELOG.md` and, where a choice was made, `DECISIONS.md` updated with a tag.
- [ ] No placeholder text anywhere (`npm run coverage` checks).
- [ ] Squint and greyscale screenshots attached for any screen-level change.

## 8. Ownership

The design system is owned by the CPO (Sameer) with the CTO (Hamood) for `implementations/` and `tooling/`; any founder may approve a patch; a major needs two founders. Products vendor a tag; upgrades are a PR in the product with the changelog diff.
