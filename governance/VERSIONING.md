# Versioning

SemVer for the whole repository, with tokens and components versioned together (one `package.json` version, one git tag `v2.0.0`).

## What bumps what

| Change | Bump | Examples |
|:--|:--|:--|
| A token removed or renamed; a semantic token's meaning changed; a component prop removed; a rule in `AGENT_RULES.md` that makes previously passing code fail; an archetype removed | **Major** | Dropping the `--ink` aliases; renaming `feedback-danger` to `feedback-error`; forbidding the bezel in apps after allowing it |
| A token added; a light value changed within its contrast band; a component or prop added; a new archetype, pattern or transition; a new lint rule that is `warn` first | **Minor** | Adding `line-boundary`; adding the OTP input; T3.7 command palette |
| A value corrected (a hex within the same role and band, a wording fix, a doc clarification); a bug in a generator or check | **Patch** | Deepening `accent-text` on paper (D-033) would have been a patch had it not shipped; fixing the Dart `const` output |

Generated files (`implementations/*`, `foundations/contrast-matrix.md`, `COVERAGE_MATRIX.md`) never bump on their own; they follow `tokens.json` and the docs.

## Deprecation

- A token or component is deprecated for at least one minor version before removal: it keeps working, gains `$deprecated: "use X"` in `tokens.json` (or a `@deprecated` JSDoc), emits a lint warning, and is listed in `CHANGELOG.md` under Deprecated.
- The 1.0.0 aliases (`--ink`, `--bone`, `--accent`, `--canvas`, `--text`, …) are deprecated as of 2.0.0 and removed in 3.0.0 (D-032: once the website imports the shared tokens).
- Removal happens only in a major.

## Changelog format

`CHANGELOG.md`, newest first, one section per version with the date, grouped **Added / Changed / Deprecated / Removed / Fixed / Decisions** (decision ids). Every token change names the token path; every rule change names the file and section. Derived and proposed decisions list how to overrule them.

## Release procedure

1. `npm run verify` green (tokens, contrast, motion, coverage, typecheck) and `npm run lint` green.
2. `CHANGELOG.md` section written; `DECISIONS.md` updated; `PROGRESS.md` final report for the release.
3. Bump `package.json`; commit `release: vX.Y.Z`; tag `vX.Y.Z`.
4. Products pin a tag in their `project-profile.md` ("Design system version") and update deliberately; `scripts/install-to-product.sh` checks out that tag when vendoring.

## Compatibility promise

Within a major: a product that uses only semantic tokens, `code/react/primitives.*`, and the documented archetypes keeps building and keeps passing lint when it updates to any later minor. Anything reaching into primitives (`--color-*`) or `implementations/` internals is outside the promise.
