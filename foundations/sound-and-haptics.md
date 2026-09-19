# Sound and haptics

Tag: proposed (D-026). No source specifies sound or haptics; these defaults keep CiNQ quiet and make feedback physical only where a hand is on the glass.

## 1. Principles

- **Silence is the default.** No sound plays unless a setting enables it, except the accessibility screen-reader layer the OS provides.
- **Haptics confirm, never decorate.** A haptic fires when a state changes because of the user's touch, never on scroll, hover, arrival or animation.
- **One channel per event.** An event gets a haptic or a sound, not both, except the kitchen order-in cue which may use both because it is a call to attention across a room.

## 2. Haptic map

Web (`navigator.vibrate`, Android only), Flutter (`HapticFeedback.*`), iOS (`UIImpactFeedbackGenerator`, `UINotificationFeedbackGenerator`).

| Event | Haptic | Flutter | iOS |
|:--|:--|:--|:--|
| Toggle / switch on-off | light | `HapticFeedback.lightImpact()` | `.light` |
| Segment change, tab change | light | `selectionClick()` | `UISelectionFeedbackGenerator` |
| Sheet snap point reached | light | `lightImpact()` | `.light` |
| Swipe threshold crossed (dismiss, archive) | light | `lightImpact()` | `.light` |
| Pull-to-refresh threshold | medium | `mediumImpact()` | `.medium` |
| Primary confirm (Send to kitchen, Save) | medium | `mediumImpact()` | `.medium` |
| Long-press lift (drag) | medium | `mediumImpact()` | `.medium` |
| Destructive confirm (Void, Delete) | heavy | `heavyImpact()` | `.heavy` |
| Success (payment taken) | notification success | `HapticFeedback.vibrate()` short | `.success` |
| Error (payment declined, sync conflict) | notification error | `vibrate()` double | `.error` |
| Navigation, scroll, hover, reveal, toast arrival | none | | |

Web pattern lengths: light 10ms, medium 20ms, heavy 35ms, success `[10, 40, 10]`, error `[30, 60, 30]`. Never more than one haptic per 250ms.

## 3. Sound

Off by default in every product. Where it exists it is a setting under `Settings → Notifications → Sounds`, per event, with a volume slider and a "quiet hours" range.

| Event | Cue | Where |
|:--|:--|:--|
| New order on the kitchen display / till | A single 180ms two-note chime (E5 → A5, sine, −12 dBFS), repeated every 30s until acknowledged, capped at 5 | CiNQ RMS console and kitchen display, opt-in |
| Order ready (waiter app) | One 120ms note (A5) | RMS waiter app, opt-in |
| Payment taken | None (haptic success) | |
| Timer done (kitchen) | Three 80ms notes | Kitchen display, opt-in |
| Error | None | |
| Marketing site | None, ever | |

Assets are generated with the Web Audio API (`OscillatorNode`) or shipped as 48kHz mono `.m4a` ≤ 20KB; never autoplayed before a user gesture; respect `prefers-reduced-motion` as a hint to also reduce sound to the order-in cue only.

## 4. When silence is correct

Forms, settings, dashboards, data workspaces, detail views, onboarding, auth, the marketing site, and any customer-facing screen in a public place. A customer app never plays a sound for a promotion.

## 5. Verification

`components/*` "Haptic" rows name the event; `tooling/audit-script` flags `navigator.vibrate` or `HapticFeedback` calls outside the events in §2, and any `<audio autoplay>`.
