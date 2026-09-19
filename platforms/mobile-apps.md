# Mobile apps

Archetype 6 (mobile utility), 4 on phones, 9 on phones. Stack: Flutter (`implementations/flutter_theme.dart`) or a React Native/Expo app consuming `react_tokens.ts` (D-009: Flutter is the named native target). Traces: P7, MP1, T8.

## 1. Shell

Safe areas respected on every edge (`SafeArea` / `env(safe-area-inset-*)`); a dynamic top bar 56 (title, one action) that compresses on scroll (T7.2) in feeds; bottom tabs 64 + inset, 4–5 items, glass on iOS, solid on low-end Android; a FAB (56, `accent-fill`, the mark-style round) only in utility apps that create constantly, bottom-inline-end above the tabs.

## 2. Targets and density

44 × 44 pt iOS, 48 × 48 dp Android, comfortable density; rows 52; sheets over dialogs; text ≥ 13 (labels) and 15 body; `Text size` follows the OS (Dynamic Type / font scale) up to 130%, then the layout reflows (two-line rows).

## 3. Navigation

Tabs for top-level; push for detail (T4.4 forward rise); modal sheets for create/edit and filters; the back gesture works everywhere (iOS edge swipe, Android predictive back); no hamburger drawer.

## 4. Gestures

`transitions-and-choreography.md` T8: swipe-to-dismiss on sheets and toasts, swipe actions on list rows (archive/delete revealed behind, with the feedback colour), pull-to-refresh with the mark, long-press to reorder; haptics per `sound-and-haptics.md`.

## 5. Offline

Utility apps cache the last 30 days; writes queue with a `Pending sync` badge; a banner when offline; the Live dot in the top bar for apps with realtime (`patterns/realtime-and-offline.md`).

## 6. Motion budget

Reduced: T3.2 sheets, T6.1 list enter (stagger 60 ≤ 8), T9.1 count-up once, T1.5 toggles, route T4.4. No pointer effects, no scroll-linked effects, no ambient motion except one `ambience-accent` behind the summary. Honour the OS reduce-motion and the in-app setting.

## 7. Flutter specifics

- `MaterialApp(theme: CinqTheme.dark(), darkTheme: CinqTheme.dark(), themeMode: user)`, light via `CinqTheme.light()`.
- `splashFactory: NoSplash` (no Material ripple; press feedback is T1.3 scale or T1.7 ring); `ButtonStyle` shapes `StadiumBorder`; `InputDecorationTheme` per `core-primitives.md`.
- Page transitions `CinqPageTransitionsBuilder`; sheets `showModalBottomSheet(shape: RoundedRectangleBorder(top 28))` with `CinqCurve.emphasized`; dialogs `Dialog(shape: 20)`.
- Gradients from `CinqGradientsDark/Light`; glow via `CinqGlow` extension; shadows from `CinqShadowDark/Light`; never `elevation:` > 0.
- Fonts bundled (Bricolage variable with `FontVariation('wght', 800)`, Geist, Geist Mono, Noto Nastaliq Urdu); `TextTheme` from `CinqTheme._text`.
- Icons: `phosphor_flutter`, regular weight.
- Reduced motion: `MediaQuery.disableAnimations` or the in-app setting → `Duration.zero` via `CinqMotion`.

## 8. React Native / Expo (if a product uses it)

`react_tokens.ts` `raw[mode]` for colours, `springs` for Reanimated (`withSpring({ stiffness, damping, mass })`), `durations` for `withTiming`, `easings` via `Easing.bezier(...)`; Phosphor via `phosphor-react-native`; fonts via `expo-font`.

## 9. Store and system

App icon: the ink tile with the accent mark (kit `icon.svg`, no rounded corners on Android adaptive, foreground the mark at 66%); splash `surface-canvas` with the mark at 64 (`T10`); notification icon the mark in white mono (Android); status bar icons light on ink, dark on paper.

## 10. Do / don't

Do: sheets, thumb-zone actions, decks for repeated content (P7), offline queueing. Don't: tables wider than the screen, hover-only affordances, a sidebar, a dialog where a sheet works, text under 13, Material ripples, OS pickers for calendars that need context.
