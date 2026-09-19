# Global states

Five lifecycle states every region and every control declares. Traces: SM1 (the mark as loader and glyph), P8 (plain copy), MP6. Transitions cite `foundations/transitions-and-choreography.md`.

## 1. Idle

Rest. Affordances are quiet: hairline edges, `text-secondary` labels, `line-boundary` on fields, pills on buttons. Interactive things reveal themselves on hover (T1.1) or focus (ring) and, on touch, by shape and position alone (a pill is a button; a row with a chevron opens).

## 2. Loading

| Scope | Treatment | Transition |
|:--|:--|:--|
| App boot | Splash and boot sequence: the mark, one chase, skeleton beneath | T10 |
| Page / region first load | Geometry-matched skeleton: one block per line, image, control, at their real sizes; `surface-raised` on the region's surface; pulse 0.4↔0.8 over 1.6s in phase; shimmer optional on ≤ 8 blocks | T12, then T2.1 crossfade in place |
| Region refetch (data already shown) | Keep the content; `aria-busy`; a 2px progress line at the top of the region (`accent-fill`, `scaleX` linear) | T9.6 |
| Button action | Label hidden, the mark loader in the disc, `aria-busy`, the button keeps its width | T2.7 |
| Inline (a cell, a badge) | The mark at 16px in `text-tertiary` | |
| Slow (> 3s) | Add a line under the skeleton: "Still loading orders…" | |
| Timeout (> 8s) | Replace with the error state, Retry | |
| Optimistic | Show the result immediately with a `Pending` badge; confirm or roll back | T2.5 |

Never: a library spinner, a full-screen overlay for a region refetch, a progress percentage that is not real, generic grey rectangles of one size.

## 3. Empty

Centred in the region, max 36ch: the mark (48px, `text-tertiary`), a one-line title (`h3`), one sentence, one action at most.

| Variant | Title | Sentence | Action |
|:--|:--|:--|:--|
| First use | "No patients yet." | "Add the first one and their history starts here." | `New patient` (primary, the view's one fill) |
| No results | "No orders match." | "Try fewer filters or a different date." | `Clear filters` (ghost) |
| Cleared / all done | "All caught up." | "Ready orders are on the pass; new ones show up here." | none |
| No permission | "You cannot see reports." | "Only managers can. Ask Hamza or Shahzaib." | `Back` (ghost) |
| Offline, no cache | "Nothing saved on this device yet." | "Connect once and this list is kept for offline use." | `Retry` |

Console empty states carry no CTA when items arrive from elsewhere (orders from customers). Never an illustration.

## 4. Error and degraded

| Kind | Where | Treatment | Blocking? |
|:--|:--|:--|:--|
| Field validation | Under the field | `line-boundary` → `feedback-danger-solid` 2px; message in `feedback-danger-text` with an icon; `aria-invalid`, `aria-describedby`; first invalid field focused on submit | No |
| Form-level | Top of the form | Banner `feedback-danger-bg` + border, one sentence + what to do | No |
| Region load failure | Inside the region | The error state block: mark in `feedback-danger-text`, title, one sentence, `Try again` | No (other regions live) |
| Network lost | App-wide banner under the app bar, `feedback-warning-bg` | "Offline. Changes are saved on this device and will sync when you are back." | No |
| Sync conflict | Dialog | Both versions side by side, `Keep mine` / `Use theirs` (T3.1) | Yes (a decision) |
| Partial failure (bulk) | Toast with a count + a "Details" link to a dialog listing the failed rows | "12 of 14 archived. 2 could not be." | No |
| Permission | Full-region 403 state | see §3 | Yes for that region |
| 404 / 500 / maintenance | Full page | `screen-inventory.md` | Yes |
| Critical (payment failed, data loss risk) | Dialog | Rose icon, what happened, one safe action and one retry | Yes |

**Escalation rule**: inline (non-blocking) unless the user must decide something or the next action would lose data; then a dialog. Never a modal for "something went wrong" that the user can do nothing about; that is a banner.

Copy per `content-voice.md` §3: what happened, what we are doing, what you can do.

## 5. Success

| Scope | Treatment |
|:--|:--|
| A field | Inline check icon in `feedback-success-icon` after async validation; disappears on edit |
| A save | Button success morph (T2.4) then a toast "Saved" 5s |
| A reversible action | Toast with `Undo` (T3.5), 5s, the action is applied immediately (optimistic) |
| A flow's end (onboarding, checkout, payment) | A full success state: the mark in `feedback-success-text` at 48, "Branch 1 is set up.", what happens next, one action. On a till: 2s, then auto-advance |
| Realtime confirmation (order sent) | The row's status roll (T2.6) + haptic medium; no toast |

Never a success dialog for a routine action; never confetti; never a sound outside the kitchen cue.

## 6. Declaring states

Every component spec has a "States" row listing rest, hover, focus-visible, active, disabled, loading (and invalid for fields). Every region in a screen spec lists idle, loading, empty, error, success with copy. `AGENT_RULES.md` refuses a screen that omits one.
