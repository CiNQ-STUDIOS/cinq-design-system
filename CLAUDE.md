# CiNQ design system · instructions for Claude Code

Read `AGENT_RULES.md` before any UI work; it is the contract. Then the product's `project-profile.md`, `DESIGN.md`, `layout-architecture/archetypes.md`, `layout-architecture/anti-bento-grammar.md`.

The name is `CiNQ`. Not Cinq, not CINQ.

Never: a colour, gradient, shadow, duration, easing, font or z-index literal in a component (tokens only via `implementations/variables.css`, `react_tokens.ts` or `flutter_theme.dart`); a primitive token (`--color-*`) in a component; a raw `@keyframes`; animating height/width/top/left; `backdrop-filter` off fixed chrome; a second accent; more than one vermilion fill per viewport; `accent-fill` as a text colour; bone text on vermilion; a generic card grid or equal-weight regions; a modal to view or edit a record; a screen with a missing state; framework default transitions; Title Case, em-dashes, `Submit`, invented facts; inline copy.

Always: one archetype per screen with a stated reading path and `data-density`; both modes plus high contrast and reduced motion; named transitions (`T1.1`…`T12`); geometry-matched skeletons and the mark as loader; sentence case, `Rs 12,500`, `19 Sep 2026`; focus visible, labels bound, 44px targets; `npm run verify` and `npm run lint` green; the per-screen checklist from `AGENT_RULES.md` §5 in your report; the reskin test (§6) answered before "done".

Token changes: edit `foundations/tokens.json` only, then `npm run tokens:build`, `npm run contrast`, log in `CHANGELOG.md` and `DECISIONS.md`.
