# Forms and validation

Controls: `components/core-primitives.md`, `form-controls-advanced.md`. States: `global-states.md`. Archetypes 4 (long or linear), 3 (drawer forms), 8 (settings).

## 1. Shape

- One column (`layout-form-col` 560) in flows; drawer forms 480; settings groups 8/12.
- Label above the field, `body-s` 500 `text-secondary`; helper below in `text-tertiary`; error replaces the helper in `feedback-danger-text` with an icon.
- Groups: `h4` + one sentence + fields; `--gap` between fields, `--gap-lg × 2` between groups.
- Mark the minority: `(optional)` when most fields are required; `(required)` when most are optional; never an asterisk legend.
- Field widths match content: a postcode is 8ch, a phone 20ch, a name full width; never all fields full width in a workspace drawer.
- Order: what the user knows first; the primary action at the end (or sticky in long flows); destructive actions never in a form footer.

## 2. Validation timing

| When | What |
|:--|:--|
| On blur (after the user leaves a field they touched) | Format checks (email, phone, number range) |
| On change (after a first error) | Re-validate that field live so the error clears as soon as it is fixed |
| On submit | Everything; summary banner `role="alert"` "2 things need fixing." linking to each; focus to the first invalid field |
| Async (username taken, MRN exists) | Debounced 400ms after blur; the mark at 16 in the trailing slot; success check icon |
| Never | On first keystroke; on page load |

## 3. Messages

`content-voice.md` §3: what is wrong, then what to do, no blame. Field messages ≤ 12 words. One message per field. Examples: "Add a phone number we can reach you on." · "Use at least 8 characters." · "That MRN already belongs to Ayesha Khan. Open her record?" (with a link).

## 4. Multi-step wizards

Archetype 4. Validate per step before `Continue`; a step with async work shows the button loading; the review step lists every entry as a key-value grid with `Edit` links that jump back and return; the final action names the outcome.

## 5. Contextual feedback

- Character counts only with a limit, shown as `120 / 160` in mono, turning `feedback-warning-text` at 90%.
- Password strength: 4-segment line + the missing rule.
- Price fields show the computed total live in a metric indicator below the group.
- Dependent fields appear with T6.4 (expand) under their controller, never a page reload.

## 6. Saving

- Flows: explicit `Continue` / final action; autosave drafts every 30s with "Draft saved 14:05" in `text-tertiary`.
- Settings: explicit `Save` per page or group (sticky when the page is long), success morph + toast; switches apply immediately with "Saved".
- Drawer forms: `Save` in the sticky footer; `Cancel` asks only if dirty.
- Optimistic where the data is the user's own (notes, preferences); confirmed where money or other people are involved.

## 7. Errors on save

Banner at the top of the form: what happened and that entries are kept; fields keep values; the button returns from loading; retry available. Never clear a form on failure.

## 8. Accessibility

Labels bound; `aria-describedby`; `aria-invalid`; `autocomplete`; `inputmode`; error summary as `role="alert"`; required fields `aria-required` not just visual; fieldsets for groups of radios/checkboxes with a `<legend>`; the first field focused on open only in dialogs and drawers, not on page load.

## 9. Touch and till

56px controls, numeric keypad for amounts (`inputmode="decimal"`), a custom PIN pad for PINs, no hover-revealed helpers, larger tap targets on steppers, `enterkeyhint` set (`next`, `done`).
