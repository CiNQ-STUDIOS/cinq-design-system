# Auth and permissions

Archetype 9 for entry screens; permission behaviour applies everywhere. Traces: P8 (plain copy), `global-states.md`.

## 1. Sign-in

- One panel (400), the mark and the product name above, `Email or phone` + `Password`, `Continue` primary, `Forgot password?` link, nothing else. Social sign-in (if a product needs it) is a ghost button with the provider's mark in `text-primary` and the label `Continue with Google`; never the provider's brand colour (P1).
- Tills: staff avatar row + a 4-digit PIN pad (3 × 4, 64px keys, `numeric` digits), the PIN masked as four 12px dots; a wrong PIN turns the dots rose for `base` and clears; three wrong → 30s lock with a countdown.
- Errors: "That password is not right. Try again or reset it." (never "invalid credentials", never say which of the two was wrong for security, but do say the account exists when the user is resetting).
- Rate limit: banner "Too many attempts. Try again at 14:20."

## 2. MFA

Six OTP cells (`form-controls-advanced.md`), auto-submit on the sixth digit, `Resend code` after 30s with a mono countdown, "Use a backup code" link, `Remember this device for 30 days` checkbox (default off on shared tills, on for personal phones).

## 3. Recovery

Request: one field, one button, success copy that does not confirm the account exists: "If that email is registered, a reset link is on its way." Set: password + strength line + the missing-rule hint; success → sign-in with a toast "Password changed."

## 4. Sessions

- Apps: 8h for operators, 30 days for owners on personal devices, 12h on tills; expiry shows the session-expiry dialog over the app with the password field inline and keeps unsaved work.
- "Signed in elsewhere" → a toast with `Sign out other devices`.
- Sign out in the user menu (last item, `text-secondary`); confirm only if there are queued offline changes ("2 changes have not synced. Sign out anyway?").

## 5. Roles (RMS defaults; Dentisto analogous)

| Role | Can | Sees |
|:--|:--|:--|
| Owner | Everything, billing, roles | Dashboard home |
| Manager | Orders, menu, staff, reports, prices | Dashboard home |
| Waiter | Orders on the floor, tables | Console (floor) home, no sidebar items for menu/reports |
| Cashier | Till, payments, refunds under a limit | Console (till) home |
| Kitchen | Order statuses | Kitchen display only |

## 6. Role-gated UI

- **Hide** what the role can never do (menu editing for a waiter): the sidebar item does not exist.
- **Disable with a reason** what the role could do with approval or a limit (a cashier refunding above Rs 5,000): the control is disabled and a tooltip/helper says "Refunds over Rs 5,000 need a manager." with `Ask a manager` that pings them.
- **Never** show a control that fails on click with a permission error.
- Read-only views for observers: fields render as key-value grids, not disabled inputs.
- A permission change while signed in: a toast "Your role changed to Manager. Some screens moved." and the sidebar updates.

## 7. No-permission states

Region: the no-permission empty state ("Only managers can see reports. Ask Hamza or Shahzaib."). Page: the 403 screen inside the app shell with `Back`. Deep link to a forbidden page: the 403, never a 404, never a redirect to home without a message.

## 8. Sensitive actions

Typed confirmation for deleting a branch or a patient record; re-authentication (password or PIN) for refunds above the limit, exporting all patient data, changing billing; every sensitive action written to an audit timeline visible to owners (`data-surfaces.md` Timeline).

## 9. Accessibility and security copy

Password fields have a show/hide button (`aria-pressed`); `autocomplete="current-password"` / `new-password`; OTP `one-time-code`; no CAPTCHA on tills; error copy never blames ("You entered…" → "That password…").
