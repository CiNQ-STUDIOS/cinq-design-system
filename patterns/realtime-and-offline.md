# Realtime and offline

A restaurant loses the internet for twenty minutes on a Friday night. A clinic's front desk shares a tab with the dentist. The system states how live data arrives, what happens when it cannot, and how conflicts resolve. Traces: MP1, MP7, `global-states.md` §4.

## 1. Live updates

| Element | Arrival treatment |
|:--|:--|
| New queue row (console) | Inserted at its sorted position (T6.1), `live-edge` for 2s, no sound unless the kitchen cue is on, `aria-live="polite"` "New order 415, table 9" |
| Status change on a visible row | Badge crossfade `fast`, elapsed timer continues, T2.6 for numbers |
| A row the user is editing changes remotely | The field is not overwritten; a banner in the drawer "Hamza changed this order 10s ago. Reload or keep editing." |
| Dashboard numbers | T2.6 roll every refresh (≥ 30s); charts T9.4 |
| Presence (who else is here) | Avatars (24) in the page header, max 4 + n; a coloured status dot is `feedback-success-solid` only |
| Connection state | The Live dot: green breathing (`glow-breathe`) when the socket is open; grey static "Reconnecting…" in mono when not; the banner appears after 5s |

Transport is the product's (WebSocket, SSE, polling); the UI treats every update the same way. Updates are batched per animation frame; never more than one insert animation per 300ms (extra rows insert instantly).

## 2. Degraded connectivity

Detected by socket close + failed heartbeat 2× or `navigator.onLine` false.

- App-wide banner (`feedback-warning-bg`, sticky under the app bar): "Offline. Your changes are saved on this device and will sync when you are back." with a `Retry` link and the count of queued changes.
- The Live dot turns grey.
- Reads: show cached data with a "Showing data from 14:05" line in `text-tertiary` on each region that is stale.
- Writes: queued locally with a `Pending sync` badge (`feedback-info`) on each affected row and the toast "Saved on this device".
- Actions that cannot be queued (payments by card, sending SMS) are disabled with a tooltip/helper "Needs a connection".

## 3. Offline-first surfaces

The console and the till must work fully offline for at least a shift: menu, prices, tables, open orders and the last 24h of history are cached; new orders, status changes and cash payments queue; KOT printing works on the LAN. The dashboard is online-only (a stale banner is fine). Mobile utility apps cache the last 30 days.

## 4. Sync and reconciliation

On reconnect: a toast "Back online. Syncing 6 changes…" with a progress line; changes replay in order; success toast "Synced"; each conflict opens a dialog (one at a time, queued):

```
Order #412 was changed while you were offline.
┌── Yours (offline) ─────────┐ ┌── Theirs (Hamza, 14:12) ───┐
│ 2 × Chicken karahi         │ │ 1 × Chicken karahi         │
│ 4 × Naan                   │ │ 4 × Naan · 1 × Raita       │
└────────────────────────────┘ └────────────────────────────┘
[Use theirs]                              [Keep mine] (primary)
```

Field-level merges where safe (notes append with an author line); money and quantities never auto-merge. A conflict the user does not resolve within the session stays in a "Needs attention" list on the dashboard rail.

## 5. Optimistic UI rules (T2.5)

Apply immediately for: status changes, notes, preferences, reorders. Confirm before applying for: payments, refunds, deleting, anything with a legal or money consequence. On failure: revert with a rose flash (`feedback-danger-bg` for `fast`), a toast with the reason and `Retry`.

## 6. Timers and clocks

Elapsed timers on tickets tick every second in mono, tabular; colour turns `feedback-warning-text` at the branch's SLA (default 15 min) and `feedback-danger-text` at 2× SLA; server time is authoritative, the client shows drift > 60s as a warning in settings.

## 7. Background and multi-tab

A background tab pauses animations and reduces polling to 60s; on focus, it refetches and shows a `fast` crossfade of changed rows (no insert animations for a backlog). Two tabs share a `BroadcastChannel` so a queued write in one is not duplicated in the other.

## 8. Testing

`governance/TESTING.md` §Offline: throttle to offline mid-order, place three changes, reconnect, expect one toast, three synced rows, zero duplicates, and a conflict dialog when a remote change is injected.
