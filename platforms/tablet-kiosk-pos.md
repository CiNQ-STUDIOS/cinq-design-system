# Tablet, kiosk and POS

Archetype 7 and the touch variants of 1 and 9. The till at a window in daylight, the kitchen display two metres away above a grill, the self-order kiosk in a queue. Traces: P5, MP7, `sound-and-haptics.md`.

## 1. Conditions the design assumes

| Condition | Response |
|:--|:--|
| Glare and daylight | Paper canvas permitted per branch setting; high contrast recommended; `text-primary` only for content, `text-secondary` never below 15px |
| Greasy or wet hands, gloves | 56px controls, 64px rows, 16px gaps, no drag as the only method, no long-press as the only method; every gesture has a button |
| Viewing distance 1.5–2.5m (kitchen display) | Ticket ids 32px, items 24px, `bold` icons 32; status by colour block and text; no hover; auto-scroll paused when touched |
| Shared device | PIN sign-in, 15-minute idle lock on tills (60s on kiosks), no personal data in the top bar |
| Mounted landscape 1280 × 800 or 1920 × 1080 | Fixed splits (60/40); no responsive reflow below 1024 (the app refuses portrait on mounted tills with a message) |
| Handheld tablet portrait | Menu on top 60vh, order as a persistent bottom panel |
| No mouse, sometimes a barcode scanner or keyboard | Scanner input goes to a hidden field; `F`-keys mapped to till actions |

## 2. Touch mode

`data-input="touch"` on the root (set when `pointer: coarse`): density touch (56/64/17px), icons 24 `bold`, no glass, no hover states (`:hover` styles gated behind `@media (hover: hover)`), press feedback T1.7 (ring 60% + `interaction-pressed`), haptics on confirm.

## 3. Till (POS)

Archetype 7 wireframe: menu 60 (category chips 56 tall, dish tiles 160 × 120 with name `h4`, price mono, one-tap adds, long-press opens modifiers), order 40 (ticket rows 64, qty steppers 56, running total `numeric` 40px, one primary `Send to kitchen` 64 tall, `Pay` and `Hold` ghosts). Payment: a sheet with method buttons 64 (Cash, Card, Wallet), a numeric keypad 3 × 4 of 72px keys, change computed live; success: full-panel 2s with the mark in `feedback-success`, haptic success, then a new order. Refunds above the limit need a manager PIN (`auth-and-permissions.md`). Receipt prints on the LAN (`documents-and-print.md`).

## 4. Kitchen display (KDS)

Archetype 1 at distance: columns per station, operational cards 320 wide with ids in double size, elapsed timers, `NEW` in inverse; tapping a card advances status with a haptic (if the screen supports) and the optional chime for new orders; colour thresholds at the SLA; a "bump" bar at the bottom with 64px buttons for the selected card; no sidebar, no app bar beyond a slim status line (branch, time, connection).

## 5. Customer kiosk (self-order)

Portrait 1080 × 1920: attract screen (the mark, "Tap to order", one `ambience-accent` allowed), category rail on the left 240 wide with 96px tiles, dish grid 2 columns with 220px tiles and photos (4:3), a persistent cart bar at the bottom 96 tall with the total and `Checkout`; type at 120% (`body` 20px); 60s idle → attract; language toggle (English / اردو) in the top bar; accessibility mode button that drops the reachable area to the lower 60% of the screen.

## 6. Printing and hardware

Receipt and KOT via the printer's LAN address; cash drawer kick on cash payment; barcode scanner as keyboard input; card terminal via the payment provider's SDK with the "Waiting for card…" state on the payment sheet (the mark loader, `Cancel` available).

## 7. Offline

The till and KDS work a full shift offline (`realtime-and-offline.md` §3); the status line shows the queued count; card payments disabled offline with the reason.

## 8. Do / don't

Do: buttons for everything, 56px, text ≥ 17, paper or high contrast in daylight, one primary. Don't: hover, glass, small text, modals over the order, gestures-only, ambient motion, sound without a setting.
