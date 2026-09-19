# Onboarding flows

Archetype 4 (setup/onboarding) for the flow, archetype 6 or 2 for tours. Traces: P5, MP1.

## 1. First-run setup (an owner sets up a branch or a clinic)

Steps ≤ 6, each one screen, each with a title and one sentence: 1 Business (name, type) · 2 Branch (address, hours) · 3 Menu or services (import or add three) · 4 Staff (invite by phone, assign roles) · 5 Till or booking (payment methods, slots) · 6 Review (every choice, editable inline).

Rules: progress in a mono stepper; `Save & exit` always available and the state resumes; `Back` keeps data; defaults are pre-filled where CiNQ knows them (Pakistan, PKR, Asia/Karachi, 24-hour); each step's primary is `Continue`, the last is the outcome (`Open the till`); the success screen names what happens next and when; no marketing copy inside the app.

## 2. Account creation (staff invited by phone)

An SMS link → archetype 9: name, the invite's role and branch shown read-only, set a password or a 4-digit PIN for tills, then straight to their home (console for waiters, dashboard for managers). ≤ 90 seconds.

## 3. Customer onboarding (Qeemat, the customer app)

Three screens max before value: 1 what the app does in one sentence with a real screen behind a phone frame · 2 the one permission that matters (notification access for bank alerts) explained before the OS prompt, with `Not now` · 3 the first real screen with an inline hint. Sign-in is deferred until the first thing worth saving. No carousel of five benefits; no "Get started" button (the button says what happens: `Read my bank alerts`).

## 4. Product tour (an existing screen, first visit)

≤ 4 spotlights: a `surface-scrim` with a cut-out (`clip-path`) around one control, a popover (`surface-overlay`) beside it with one sentence and `Next` / `Skip tour`; keyboard and Escape skip; never on the console; shown once, re-openable from Help.

## 5. Empty-first design

Every new account lands on real screens with first-use empty states (`components/global-states.md` §3), never a blank dashboard with sample data. Sample data, if any, is labelled `Sample` with a badge and removable in one action.

## 6. Progress and motivation

A setup checklist on the dashboard rail until complete ("3 of 5 done"), items with checks, each a link; disappears when done. No gamification, no confetti.

## 7. Measuring

Each step logs start, complete, back, exit; the flow's target is a median under 6 minutes to `Open the till`. The profile records the actual.
