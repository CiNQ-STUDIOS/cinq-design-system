# Project profile · cinqstudios.com

The company site. The first adopter of the system, and the product the
tokens were lifted from. `docs/design-system.md` in the site repo is the
site-specific companion to this profile.

## Product

| Field | Answer |
|:---|:---|
| Name | CiNQ, the company site |
| One line | One page that says what the studio builds and gets a restaurant, clinic or founder to start a conversation. |
| Primary user | A buyer on a phone, one visit, two minutes. |
| Secondary user | A recruiter or a partner on a laptop. |
| Repository | https://github.com/CiNQ-STUDIOS/cinq-website |
| Design system version | 1.0.0 |
| Profile last reviewed | 19 Sep 2026 |

## Surfaces in scope

| Surface | Archetype | Density | Canvas family | Primary device | Notes |
|:---|:---|:---|:---|:---|:---|
| The page | marketing | comfortable | marketing | all | One page, ten sections, alternating layout families. |
| The contact form | form-flow inside marketing | comfortable | marketing | all | Single step; opens a mailto with everything filled in. |

## Stack

| Field | Answer |
|:---|:---|
| Framework | Next.js 16, App Router, Turbopack, static export |
| Styling | Tailwind v4 |
| Token import | `src/app/globals.css` (the site's own copy; converging on `tokens/tokens.css` is D-1) |
| Tailwind mapping | `@theme inline` in globals.css, same names as `tailwind-v4.css` |
| Motion | GSAP + ScrollTrigger + SplitText for scroll; Motion for component state; React Three Fiber for the hero; Lenis for scroll |
| Icons | Phosphor, regular for UI, bold inside button discs |
| Fonts | `next/font/local` from `brand/fonts/`, variables `--font-bricolage`, `--font-geist`, `--font-geist-mono` |
| Theme mechanism | `src/lib/theme.ts`, identical to `theme-init.ts`. Dark default, `html.light` opt-in, no system following. |
| Custom CSS layer | `@layer components` in globals.css |
| Hosting | Cloudflare Worker, static assets, from the Cinq Cloudflare account |

## Locale

| Field | Answer |
|:---|:---|
| Language | en |
| Locale | en-PK |
| Currency | none shown on the site |
| Dates | none shown |
| Clock | none |
| RTL | none |

## Budgets

| Field | Answer |
|:---|:---|
| Motion budget | Full (the marketing ceiling). Preloader once per session. Everything inside `gsap.matchMedia()`. |
| Performance | Lighthouse mobile: Performance 90+, the other three 100. |
| Bundle | Three.js is the largest dependency; the hero canvas is the only consumer. |

## Accessibility commitment

WCAG 2.1 AA. Under reduced motion the intro never plays and every
scroll-linked effect is skipped; the page is static and complete.

## High-stakes data

| Field | Answer |
|:---|:---|
| Handles | none. The contact form does not store anything; it opens the visitor's mail app. |
| Confirmation rule | n/a |

## Deviation register

| ID | Rule | Deviation | Reason | Owner | Review |
|:---|:---|:---|:---|:---|:---|
| D-1 | AGENTS.md first run, step 3 | The site keeps its own token block in `globals.css` instead of importing `tokens/tokens.css`. Names and values match. | The site predates the system; swapping the import is a mechanical change to do in one PR with a full visual check in both modes. | Sameer | 31 Oct 2026 |
| D-2 | DESIGN.md §1, no gradients in UI | The hero shader draws vermilion and amber ribbons; the OG image draws the same as soft gradients. | This is the permitted exception named in the rule itself. Recorded so nobody extends it. | Sameer | none |
| D-3 | DESIGN.md §7, one accent slab per viewport | The process stack alternates ink, accent, ink, accent as cards pin over each other. | Only one accent card is fully visible at a time; the pin makes this read as one. | Sameer | 31 Oct 2026 |
| D-4 | SURFACES.md marketing, no data tables | The CiNQ RMS visual in the work showcase draws a small floor-board table inside a device frame. | It is an illustration of the product, not UI of the site, and it is inside the escape hatch container. | Sameer | none |

## Adoption status

| Surface | Tokens | Type | Controls | Cards and tables | Navigation | Overlays | Motion | Copy | Gate |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| The page | done (own copy, D-1) | done | done | done | done | done (menu) | done | done | not yet run against PRE-SHIP.md v1.0.0 |

## Product-specific decisions

- The wordmark is `CiNQ` in `.font-display-tight`. The header uses the lockup, the footer the wordmark at full width, one letter per span so GSAP can address them.
- The mark is the loader, the favicon, the OG image and the empty-state glyph. Its geometry lives in `src/lib/mark.ts` and every consumer reads it from there.
- Section order is fixed: hero, marquee, work, studio, products, services, process, founders, contact, footer. No two adjacent sections share a layout family.
- Copy lives in `src/lib/content.ts`. Every string. Components never carry a sentence.
- Every claim on the site is limited to what the source material supports. No client is named without their product being real and shipped.
- The contact form has five needs and three timings; it composes a mailto to the studio inbox with the subject from the chosen need.
