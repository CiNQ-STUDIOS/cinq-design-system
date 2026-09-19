# Overlays and feedback

Modals, drawers, sheets, toasts, banners, popovers, the notification centre, progress. Traces: MP1 (origin-aware), MP2 (exit faster), P4. Transitions from `foundations/transitions-and-choreography.md` T3.

## Dialog (modal)

**Anatomy**: `<dialog>` (native: focus trap, Escape, `::backdrop`), `surface-overlay`, `radius-panel` 20, `shadow-strong`, hairline, width `min(480px, 100% − 2 × gutter)`, padding `space-6`; title `display-s`/`h2`; body `body` `text-secondary`; actions right-aligned, primary last, ≤ 3; a ✕ only when the dialog is informational.
**Use**: a decision (confirm, choose), a short form (≤ 5 fields), a critical error. Not for viewing a record (drawer), not for a long form (route), not for routine actions.
**Variants**: confirm (title names the thing, body one sentence of consequence, `Keep it` ghost + the verb primary or destructive) · form · alert (icon in `feedback-*`, one `OK`-free action like `Retry`) · full-screen on phones for forms (T3.2 sheet instead).
**Motion**: T3.1; scrim `surface-scrim` fades `base`.
**Accessibility**: `aria-labelledby` the title, `aria-describedby` the body, initial focus on the first field or the primary action for confirms (the safe action for destructive), focus returns to the opener, Escape closes unless a submit is in flight.
**Flutter**: `showDialog` with a `Dialog(shape: RoundedRectangleBorder(20), backgroundColor: surfaceOverlay)`; `barrierColor: surfaceScrim`; transition per `CinqPageTransitionsBuilder`-style fade+scale.
**Don't**: "Are you sure?"; stacking dialogs; a dialog for a toast's job.

## Bottom sheet (phones and touch)

`radius-sheet` 28 top corners, `surface-overlay`, `shadow-sheet`, drag handle 40 × 4 `line-standard`, padding `space-6` + safe area, max 90dvh, snap points content / 50% / 90% (T8.2), T3.2 in/out, scrim; title `h3`; a list or a short form; a sticky footer action on forms. Dismiss: handle drag, scrim tap, Escape/back. Never nested; never on desktop (use a dialog or drawer).

## Drawer (side panel)

`data-surfaces.md` Detail drawer: 480 from the inline-end edge, T3.3. Also used for filters on desktop workspaces and for the settings-style edit of a record.

## Popover

`surface-raised`, `radius-panel`, `shadow-strong`, hairline, `z-dropdown`, anchored with 8px offset, flips to stay on screen, T3.4, closes on outside click/Escape/scroll of the page; contains a menu, a picker, a small form (≤ 3 fields) or a preview; on phones becomes a sheet.

## Tooltip

`core-primitives.md`.

## Toast

**Anatomy**: `surface-raised`, `radius-slab`, `shadow-strong`, hairline, `body-s`, leading icon in the tone (`feedback-*-icon` or the mark for neutral), text, one action (`accent-text`, e.g. `Undo`, `Open`), optional ✕.
**Placement**: bottom centre on phones (above the bottom nav), bottom inline-end on desktop; stack ≤ 3, newest at the bottom, older ones move up (T3.5); `z-toast`.
**Timing**: `toast-hold` 5s; pauses on hover/focus; a toast with `Undo` holds 8s; errors do not auto-dismiss.
**Accessibility**: `role="status"` (errors `role="alert"`), region `aria-live="polite"`, focusable action, Escape dismisses the focused toast.
**Don't**: a toast as the only success signal for a payment; a toast for routine console changes; more than one toast per action.

## Banner (inline, page or region)

Full width of its region, `feedback-*-bg` + 1px `feedback-*-border` (or `surface-raised` + hairline for neutral), `radius-control`, padding `space-3 space-4`, leading icon, `body-s`, optional action link, optional ✕ (only if the condition is not persistent). Used for: offline (warning), a degraded service, an unpaid invoice (warning), a permission note (info), a validation summary (danger, `role="alert"`). Sticky under the app bar for app-wide conditions. Never for success (toast) and never stacked more than two.

## Notification centre

A popover (desktop, 400 wide, max 70vh) or a full page (phones) from the bell: header "Notifications" + `Mark all read`; groups by day (`h6`); items as list rows (icon in tone, `body`, time mono, unread dot `accent-fill` 8px at the start); tapping opens the target and marks read; empty state "You are up to date."; settings link at the bottom. Badge on the bell = unread count, `accent-fill`, max 99+.

## Progress

Determinate: a 2px line (`accent-fill` on `text 10%` track) at the top of a region or inside a file row, `scaleX` linear (T9.6); a ring only inside a circular control (upload avatar). Indeterminate: the `shimmer` on the track, never a spinner. Steps: the stepper. Never a percentage without a real total.

## Command palette

`patterns/search-and-command.md`: a dialog at the top (T3.7), 640 wide.

## Confirmation patterns

| Action | Pattern |
|:--|:--|
| Reversible (archive, mark read, void within a window) | Do it, toast with `Undo` 8s |
| Irreversible, low stakes (delete a draft) | Dialog: `Delete draft?` · `Keep it` / `Delete draft` |
| Irreversible, high stakes (delete a branch, refund) | Dialog with the consequence sentence and a typed confirmation of the thing's name; destructive button enabled only when it matches; heavy haptic on touch |
| Leaving with unsaved changes | Dialog `Leave without saving?` · `Keep editing` / `Leave` |

## Platforms

Flutter: `showModalBottomSheet(shape: top 28, backgroundColor: surfaceOverlay, isScrollControlled: true)`; toasts via an `Overlay` entry, not `SnackBar` (its shape and timing are Material); banners as widgets in the page tree.
