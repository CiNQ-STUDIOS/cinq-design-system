# CiNQ. Surface archetypes.

A product is made of surfaces, and each surface is one of five archetypes.
Pick the archetype first; it answers the canvas, density, radius ceiling,
width, navigation, type lead, motion budget and shadow rules before a single
component is placed. A product can have several surfaces (CiNQ RMS has a
customer mobile app, an owner dashboard and a cashier console). One screen
never mixes two archetypes.

## Decision tree

```
Is it public, for someone who has not signed in?
├─ yes → MARKETING
└─ no
   Is it one linear task with a beginning and an end (checkout, onboarding, booking, a wizard)?
   ├─ yes → FORM FLOW
   └─ no
      Is the primary device a phone?
      ├─ yes → MOBILE APP
      └─ no
         Is it tables and logs most of the time, used by an operator for hours?
         ├─ yes → CONSOLE
         └─ no → DASHBOARD
```

If a surface sits on the line between two, choose the plainer one
(dashboard over marketing, console over dashboard) and record the choice in
the profile.

---

## Marketing

The public site and any public product page. Display-led, cinematic, the
full brand.

| Field | Value |
|:---|:---|
| Canvas | `--canvas` family. Dark by default, `html.light` opt-in toggle in the header. |
| Density | Comfortable |
| Radius ceiling | `--radius-marketing` (28px) on cards, pill on controls |
| Width | `--page-max` (1280px) inside `--pad` gutters; header pill `--nav-max` |
| Navigation | Fixed glass top-bar pill that hides on scroll down; full-screen menu on mobile |
| Type lead | Display: one `--text-display` hero headline, `--text-hero` section titles, kickers in mono above each |
| Motion budget | Full: preloader once per session, pinned and scrubbed sections, one marquee, text masks, magnetic buttons, tilt and spotlight cards, shader hero. All inside `matchMedia`. |
| Shadows | None at rest, `--shadow-slab` on hover, `--shadow-strong` on the menu |
| Sections per viewport | One. Each section owns the viewport it is in. |
| Signature moves | The double bezel card. The colour-block panel (accent, deep, bone) alternating with ink. The mark as loader. The wordmark at footer scale. |
| Never here | Data tables. More than two buttons in a hero. A second marquee. A stock photo. Lorem ipsum. A carousel that auto-advances. |

Adjacent sections never share a layout family. The families are: full-bleed
hero, marquee strip, horizontal pinned showcase, single statement,
asymmetric bento, accordion list, sticky stack, split form, footer.

---

## Dashboard

An authenticated desktop tool. The owner's view of CiNQ RMS, the clinic
admin in Dentisto, an analytics page.

| Field | Value |
|:---|:---|
| Canvas | `--app-*` family. Same mode toggle, in the sidebar footer. |
| Density | Compact (`data-density="compact"` on the app root) |
| Radius ceiling | `--radius-panel` (20px) on dialogs, `--radius-slab` on cards, `--radius-control` on inputs |
| Width | `--app-max` (1600px) content beside a `--sidebar-w` sidebar; gutters `--gap-lg` |
| Navigation | Sidebar, collapsing to icons at `lg` and a drawer below; a slim top bar for the page title, search and the account |
| Type lead | `--text-title` page title in display 700, `--text-section` headings in Geist 500, numerals in `--text-numeral` on stat tiles |
| Motion budget | Reduced: enter reveals on first mount only (`--dur-base`, `--travel-sm`), component state motion, no scroll effects, no pointer effects |
| Shadows | `--shadow-strong` on popovers and dialogs only. Cards have a hairline, never a shadow. |
| Sections per viewport | Two to four regions: a stat row, a chart, a table, a side list |
| Signature moves | Stat tiles with a vermilion numeral. The first chart series is always vermilion. A selected row with an accent left edge. |
| Never here | The bezel card. A hero. Display type over `--text-title`. Marketing copy. A glass panel that scrolls. More than one primary button per region. |

---

## Mobile app

Phone-first, signed in. The Qeemat app, the RMS customer app, the waiter
app, the Dentisto patient app.

| Field | Value |
|:---|:---|
| Canvas | `--app-*` family; `--app-canvas` for the page, `--app-surface` for cards |
| Density | Comfortable. Tap targets `--touch-min` always. |
| Radius ceiling | `--radius-sheet` (28px) on sheets, `--radius-slab` on cards, pill on buttons |
| Width | Full width inside 20px gutters (`--pad` at its minimum); content max 560px on tablets, centred |
| Navigation | Bottom nav, four or five items, glass. A top bar with the screen title and one action. Back is the platform gesture plus a chevron. |
| Type lead | `--text-title` for the screen title, `--text-slab` for card headings, `--text-numeral` for a balance or a total |
| Motion budget | Reduced: sheet and toggle motion, list item enter (`--dur-base`, stagger), pull-to-refresh with the mark loader. No scroll-linked, no pointer. |
| Shadows | `--shadow-sheet` on sheets. Nothing else. |
| Sections per viewport | One primary region and the nav. A summary card above a list is the common shape. |
| Signature moves | Bottom sheets for every secondary action. A big display numeral for the number that matters. The mark as pull-to-refresh. |
| Never here | Hover states as the only affordance. Tables wider than the screen (use a card list). A sidebar. A dialog where a sheet would do. Text under 0.8125rem. |

---

## Form flow

One linear task with an end: onboarding, checkout, booking an appointment,
setting up a branch, a multi-step order.

| Field | Value |
|:---|:---|
| Canvas | Inherits the host (marketing or app). A single centred column on `--canvas-2` or `--app-surface`. |
| Density | Comfortable, even inside a compact dashboard |
| Radius ceiling | `--radius-panel` on the column, `--radius-control` on fields |
| Width | 560px column, centred. One column of inputs, always. |
| Navigation | A stepper at the top. Back and Continue at the bottom, Continue primary and right. No sidebar, no bottom nav, no other links. |
| Type lead | `--text-title` for the step title, one lead sentence, then fields |
| Motion budget | Reduced: step transitions slide `--travel-lg` over `--dur-base`, field state only |
| Shadows | None |
| Sections per viewport | One step. If a step needs scrolling on a phone, it is two steps. |
| Signature moves | The stepper in mono. A summary panel on the last step that repeats every choice. A success state that says what happens next and when. |
| Never here | Two columns of inputs. Optional steps (make them a later setting). A step without a title. Losing entered data on Back. A `Submit` button. |

Sensitive flows (payments, medical records, deleting a branch) confirm on
a review step before the action, name the thing in the confirmation, and
never rely on a toast alone to report success.

---

## Console

Operator tooling used for hours: the cashier's till, the kitchen display,
a log viewer, bulk edit, the receptionist's day view.

| Field | Value |
|:---|:---|
| Canvas | `--app-*` family, `--app-sunken` for table bodies and the main well |
| Density | Dense (`data-density="dense"`). Tap targets still `--touch-min` on a touch till. |
| Radius ceiling | `--radius-control` (12px) everywhere. Pill on buttons only. |
| Width | Full viewport, no max. Gutters `--gap`. |
| Navigation | A slim top bar or a narrow icon rail. Keyboard shortcuts for every frequent action, listed in a `?` panel. |
| Type lead | Geist 500 `--text-section` for region titles, mono for IDs, timestamps, order numbers and statuses. No display face. |
| Motion budget | Minimal: opacity on hover and state, a `--dur-fast` colour change on a new row. Nothing positional, no reveals, no stagger. |
| Shadows | `--shadow-strong` on a popover. Nothing else. |
| Sections per viewport | As many as the operator needs to see at once. Panes, not pages. |
| Signature moves | A new order row lands with a vermilion left edge that fades over 2s. Status as a pill in a semantic soft fill with a mono label. Everything has a shortcut. |
| Never here | Display type. Reveals. Pagination where a virtual list would do. A modal for a routine action. Hiding a column to fit; scroll horizontally instead, with the first column sticky. Sound without a setting. |

---

## Product map

The surfaces CiNQ owns today and their archetypes. Keep this current.

| Product | Surface | Archetype | Device |
|:---|:---|:---|:---|
| cinqstudios.com | The site | Marketing | All |
| CiNQ RMS | Customer app (menu, ordering, delivery, loyalty) | Mobile app | Phone |
| CiNQ RMS | Owner and manager back office | Dashboard | Desktop |
| CiNQ RMS | Cashier till, kitchen display | Console | Desktop, touch |
| CiNQ RMS | Waiter app | Mobile app | Phone |
| CiNQ RMS | Branch setup, onboarding | Form flow | Desktop |
| Dentisto | Front desk and dentist workspace | Dashboard | Desktop |
| Dentisto | Day view, appointment board | Console | Desktop |
| Dentisto | Patient booking | Form flow | Phone, desktop |
| Qeemat | The app | Mobile app | Phone |
| Qeemat | Onboarding, permissions | Form flow | Phone |
| Qeemat | Marketing page | Marketing | All |
