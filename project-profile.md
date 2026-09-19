# Project profile · <product name>

One per product. Copy this file, answer every field, commit it to the
product's repository. Every later agent session reads it before touching UI.
Nothing stays as a placeholder: if a field does not apply, write "none" and
why.

## Product

| Field | Answer |
|:---|:---|
| Name | <as written in the product, e.g. CiNQ RMS> |
| One line | <what it does, for whom> |
| Primary user | <role, device, how many hours a day> |
| Secondary user | <role, device> |
| Repository | <url> |
| Design system version | <from CHANGELOG.md> |
| Profile last reviewed | <date> |

## Surfaces in scope

One row per surface. Archetype from `layout-architecture/archetypes.md`.

| Surface | Archetype | Density | Canvas family | Primary device | Notes |
|:---|:---|:---|:---|:---|:---|
| <e.g. Owner back office> | dashboard | compact | app | desktop | |
| <e.g. Customer app> | mobile-app | comfortable | app | phone | |

## Stack

| Field | Answer |
|:---|:---|
| Framework | <Next.js 16 App Router / React Native / Expo / plain HTML / ...> |
| Styling | <Tailwind v4 / v3 / CSS modules / none> |
| Token import | <where tokens.css is imported> |
| Tailwind mapping | <tailwind-v4.css / tailwind-v3.cjs / none> |
| Motion | <GSAP + Motion / Motion only / CSS only / Reanimated> |
| Icons | <Phosphor regular / bold> |
| Fonts | <next/font/local from brand/fonts / @font-face / native> |
| Theme mechanism | <theme-init.ts as written / followSystem: true> |
| Custom CSS layer | <@layer components> |

## Locale

| Field | Answer |
|:---|:---|
| Language | <en> |
| Locale | <en-PK> |
| Currency | <PKR, shown as Rs 12,500> |
| Large sums | <digits / lakh and crore> |
| Dates | <d MMM yyyy> |
| Clock | <24-hour / 12-hour> |
| RTL | <none / Urdu planned: date> |

## Budgets

| Field | Answer |
|:---|:---|
| Motion budget | <the archetype's, or lower> |
| Performance | <Lighthouse targets from PRE-SHIP C1, or stricter> |
| Bundle | <if any> |

## Accessibility commitment

WCAG 2.1 AA at build time (the system floor). Note anything stricter or any
known constraint of the user base:

<e.g. cashiers use the till in bright daylight; the kitchen display is read from two metres>

## High-stakes data

| Field | Answer |
|:---|:---|
| Handles | <payments / medical records / none> |
| Confirmation rule | <review step before every irreversible action; toasts never the only success signal> |

## Deviation register

The most important section. Every departure from `DESIGN.md` or
`layout-architecture/archetypes.md`, with a reason and a review date. Hard constraints
(DESIGN.md §1) cannot be registered; they are bugs.

| ID | Rule | Deviation | Reason | Owner | Review |
|:---|:---|:---|:---|:---|:---|
| D-1 | | | | | |

## Adoption status

| Surface | Tokens | Type | Controls | Cards and tables | Navigation | Overlays | Motion | Copy | Gate |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| <surface> | not started / in progress / done | | | | | | | | |

## Product-specific decisions

Anything an agent would otherwise have to ask. Component compositions,
naming, domain vocabulary, the order of nav items, what the home screen is.

- <e.g. "Order" not "Ticket". "Table" not "Seat". The floor board is the home screen for waiters.>
