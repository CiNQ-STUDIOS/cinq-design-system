# Accessibility

WCAG 2.1 AA is a build-time requirement; AAA for body text wherever the palette allows (it does: body text is ≥ 7:1 on every surface in every mode). Traces: P6 (reduced motion), P8 (plain copy). Measured values live in the generated `foundations/contrast-matrix.md` (`npm run contrast`), never asserted here.

## 1. Contrast

| Class | Requirement | Where measured |
|:--|:--|:--|
| Body and UI text | ≥ 4.5:1 (AA); `text-primary` ≥ 7:1 (AAA) on every surface | contrast-matrix "Text on surfaces" |
| Large text (≥ 24px, or ≥ 19px at weight 700) and mono labels | ≥ 3:1; the only tokens allowed at this level are `text-tertiary` and `chart-axis-text` | matrix, "large text only" |
| Text on fills (buttons, badges, tooltips, footer) | ≥ 4.5:1 | matrix "Text on fills" |
| UI boundaries (field borders, focus ring, chart marks) | ≥ 3:1 via `line-boundary`, `accent-ring`, `chart-*` | matrix "UI graphics" |
| Decorative lines (`line-hairline`, `line-standard`) | no requirement; they never carry meaning alone | informational rows |

Exceptions, documented: `accent-fill` on paper is 2.81:1 as a graphic. The control is identified by its ink label (5.78:1), its pill shape and its position, so the fill is not the sole boundary; keep the canonical fill. A compliant alternative for a fill that must pass 3:1 on paper (an icon-only vermilion button) is `accent-active` (`#dc4318`, 3.36:1). Light `chart-1` is vermilion 600, not the fill, for this reason.

High-contrast mode (`html.contrast`, D-008): secondary text → bone, tertiary → bone 2, accent text → vermilion 300, hairlines 30%, boundaries 70%. Offered in every app's appearance settings next to the light/dark toggle.

## 2. Focus

- Every focusable element shows a 2px `accent-ring` outline at 4px offset (`:focus-visible`, generated base rule). Never `outline: none` without an equivalent ring.
- Focus order follows reading order; no positive `tabindex`.
- Overlays trap focus (native `<dialog>` does; drawers and sheets use the same element), move focus to the first control or the title, and return it to the opener on close.
- Skip link to `#main` as the first focusable element on every page; a "skip to results" link above data tables in consoles.
- Roving tabindex in segmented controls, tab lists, menus and grids; arrow keys move, Home/End jump.
- A focused row in a table is visibly ringed (inset ring, since outline is clipped by `overflow: auto`).

## 3. Targets

- 44 × 44 css px minimum on any touch-capable device (`layout-touch-min`), 48 dp on Android, at every density: a 32px dense row pads its hit area to 44. Kiosk touch mode: 56 px controls, 64 px rows.
- Adjacent targets have ≥ 8 px between hit areas or a visible divider.
- Pointer: 24 × 24 minimum (WCAG 2.2 2.5.8) for desktop-only controls (table sort carets are 24 px hit areas around a 16 px glyph).

## 4. Screen readers

- Every control has an accessible name from a visible label (`<label for>`), `aria-label` for icon-only, or `aria-labelledby`. Placeholder is never the name.
- Live regions: toasts `role="status"`; validation summary `role="alert"`; async table updates `aria-live="polite"` on the `<tbody>`; the order queue in a console `aria-live="polite"` with `aria-relevant="additions"`; loading `aria-busy="true"` on the region.
- Component roles and keyboard maps are specified per component in `components/*` ("Accessibility" row); custom widgets follow WAI-ARIA APG patterns (switch, radiogroup, tablist, menu, combobox, dialog, tree, grid).
- Announcements: a state change that is only visual gets a visually hidden text update (`.cq-sr-only`): "Saved", "3 items selected", "Offline, changes will sync".
- Charts: an accessible table alternative (`<table class="cq-sr-only">`) or a text summary; never a canvas alone.
- Images: alt describes what the image shows; decorative → `alt=""`; icons `aria-hidden` unless they are the only content.

## 5. Keyboard

Everything works with a keyboard alone: Enter/Space activate; Escape closes the topmost overlay; arrow keys within composite widgets; `Cmd/Ctrl+K` opens the command palette; consoles list every shortcut in a `?` panel and never bind single letters without a modifier where a text field may be focused. No keyboard traps; no `onKeyDown` that swallows Tab.

## 6. Reduced motion and transparency

- `prefers-reduced-motion`: `motion.md` §6 and MP6; every transition's RM column in `transitions-and-choreography.md`.
- In-app setting `Motion: System / Full / Reduced` (`data-motion`).
- `prefers-reduced-transparency`: glass → solid (generated).
- `prefers-contrast: more` maps to `html.contrast` automatically on first run; the user can override.
- Nothing flashes more than three times a second; the live pulse is 0.42 Hz.

## 7. Forced colours (Windows high contrast)

- No `forced-color-adjust: none` except on the mark and the wordmark.
- Controls keep a real border (`line-boundary`) so they survive when backgrounds are removed; generated `@media (forced-colors: active)` maps lines to `CanvasText` and the ring to `Highlight`.
- Selected rows use a border, not only a background.
- Icons use `currentColor`.

## 8. Zoom and reflow

- 200% zoom: no loss; text roles are rem-based; layouts reflow.
- 320 px wide: no horizontal scroll (tables become card lists at ≤ 7 columns or scroll inside their own wrapper with a sticky first column).
- Fluid type never exceeds its clamp max and never drops below 13 px for any text that carries information.

## 9. Colour not sole signal

Every state has a second channel: badges carry a label; active nav has a bar or underline; invalid fields have a message and an icon; chart series have a legend and, on hover, a label; a selected row has a left edge and a checked checkbox; the live dot has a label "Live".

## 10. Content

Plain language, sentence case, errors that say what to do (`content-voice.md`). Reading level target: a sentence of ≤ 20 words in UI copy. Urdu with `lang="ur"` so screen readers switch voice.

## 11. Standing requirements (the gate)

1. Focus visible everywhere; 2. targets 44/48; 3. names on every control; 4. errors announced and focused; 5. overlays trap and return; 6. keyboard-only path complete; 7. 200% zoom and 320 px reflow; 8. forced colours survive; 9. reduced motion leaves a complete page; 10. no colour-only state; 11. live regions for async; 12. charts have a text alternative. `AGENT_RULES.md` repeats these as the per-screen checklist; `governance/TESTING.md` says how each is tested (axe, keyboard walk, VoiceOver/NVDA pass, Windows HC).
