# CiNQ brand DNA

Phase 0 extraction. Every value here was read from a source file; the
file and line are given. Nothing in this document is invented. Where a
value is stated as a rule it is quoted or paraphrased from the source and
the source is named.

Sources, in precedence order:

| # | Source | Read as |
|:--|:--|:--|
| S1 | `brand/brand-kit.html` in `cinq-website` (built 19 Sep 2026 from `brand/build-kit.js`) | Canonical visual identity |
| S2 | The brand conversation of 19 Sep 2026 (the `CiNQ` naming decision, wordmark option A, the founders' change list) | Canonical, recorded in DECISIONS.md D-001 to D-004 |
| S3 | `universal_design_system_guide.md` | Prior specification of what a UDS must contain |
| S4 | `design-system.zip` = this repository at `1e3dc31` (design system 1.0.0) | Prior work, retained and extended |
| S5 | `cinq-website` source at `5be363f`: `src/app/globals.css`, `src/components/**`, `docs/design-system.md` | Where the brand is implemented and moves |

The `brand-kit.html` inside the zip is dated 11 Sep and predates S2; it
spells the name `cinq` and carries an old inbox. The 19 Sep build of the
same document is used (DECISIONS D-001).

---

## 1. Colour, as found

| Token | Hex | Provenance | Note from source |
|:--|:--|:--|:--|
| Ink | `#0c0b0a` | S1 swatches; S5 `globals.css:9` | "The canvas. Not pure black: it carries a little warmth." |
| Ink 2 | `#141311` | S1; `globals.css:10` | "Raised surfaces: cards, panels, the header pill." |
| Ink 3 | `#1d1b18` | S1; `globals.css:11` | "A second step up, used sparingly." |
| Ink 4 | `#2a2723` | `globals.css:12` | "Device bezels only." (`docs/design-system.md`) |
| Ink warm | `#1a1410` | `globals.css:22` | The warm panel in the work showcase |
| Bone | `#f3efe7` | S1; `globals.css:15` | "Type and the wordmark. Never pure white." |
| Bone 2 | `#aca69b` | S1; `globals.css:16` | "Secondary text. 6.4:1 on Ink." |
| Bone 3 | `#6f6a62` | `globals.css:17` | "Mono labels and quiet metadata. 3.4:1: large or uppercase mono only." |
| Vermilion | `#f9633a` | S1; `globals.css:18` | "The one accent. Buttons, the mark, highlights. 6.5:1 on Ink." |
| Vermilion deep | `#c9330c` | S1; `globals.css:21` | "Gradients and print shadows only." |
| Amber | `#ffb020` | S1; `globals.css:20` | "Only inside the hero light and the OG image. Never as UI." |
| Rose (shader only) | `vec3(0.96,0.22,0.34)` ≈ `#f53857` | S5 `hero-canvas.tsx:68` | Fourth ribbon colour, never a UI token |
| Paper | `#efe9dd` | `globals.css` light block (19 Sep) | Light canvas. Was `#f4f1ea` until the founders asked for "creamy, grainy" (S2) |
| Paper 2 / 3 / 4 | `#e6dfd1` / `#dcd4c4` / `#c9c0ae` | `globals.css` light block | Light mode steps |
| Light text | `#14120f` / `#5a554d` / `#857f74` | `globals.css` light block | Bone roles inverted |
| Vermilion on paper | `#ef5a2f` | S1 | "Fills in light mode. Ink text on it is 5.8:1." |
| Vermilion as text | `#b8360f` | S1 | "Small type on paper. 5.1:1." |
| Line | bone at 10% / 18% | `globals.css:13-14` | Hairlines, via `color-mix` so they invert |
| Device | `#2a2723` / `#0c0b0a` | `globals.css` (19 Sep) | Frames stay dark in both modes |
| Selection | vermilion fill, ink text | `globals.css` `::selection` | |
| Focus ring | vermilion, 2px, 4px offset | `globals.css :focus-visible` | |

Rules stated in S1: "Dark is the brand and the default. Light mode exists as
an opt-in." "Ink text on accent is 5.9:1; ink on bone is 17:1. Bone on
accent fails and is never used." "Hard-coded colours are banned in
components." (`docs/design-system.md` §1)

Semantic feedback colours, chart series and the vermilion ramp were not in
S1 or S5; they were derived in S4 1.0.0 and are carried forward (DECISIONS
D-010 to D-014).

## 2. Type, as found

| Role | Value | Provenance |
|:--|:--|:--|
| Display face | Bricolage Grotesque, variable TTF, `opsz 96` | S1 "Type"; `globals.css .font-display` |
| Headings | weight 700, `wdth 100`, tracking −0.03em, line-height 0.95 | `globals.css:120-126` |
| Wordmark, product names, numerals | weight 800, `wdth 90`, tracking −0.045em, line-height 0.9 | `globals.css:127-133`; S1 "The wordmark" |
| Body | Geist 400, 500 for UI | S1; `docs/design-system.md` §2 "400 and 500 only" |
| Labels | Geist Mono 0.75rem, uppercase, tracking 0.08em | `globals.css .t-mono` |
| Hero | `clamp(2.75rem, 6.6vw, 7.5rem)` | `.t-hero` |
| H2 | `clamp(2.25rem, 5.2vw, 5.5rem)` | `.t-h2` |
| H3 | `clamp(1.5rem, 2.6vw, 2.5rem)` | `.t-h3` |
| Lead | `clamp(1.0625rem, 1.35vw, 1.375rem)` / 1.45 | `.t-lead` |
| Body | `clamp(0.9375rem, 1.05vw, 1.0625rem)` / 1.6 | `.t-body` |
| Small | 0.8125rem / 1.5 | `.t-small` |
| Large-display tier | from 1920px every role grows one notch (`.t-hero` to 10rem cap, etc.) | `globals.css @media (min-width: 1920px)` (19 Sep) |
| Marquee | `clamp(1.75rem, 4vw, 3.5rem)` display | `marquee.tsx:56` |
| Footer wordmark | `30vw`, line-height 0.8, weight 300–800 on cursor | `footer.tsx:150-160` |

Rules: "Headlines are sentence case. No em-dashes anywhere on the site."
(`docs/design-system.md` §2). "Sentence case everywhere, including
buttons." (S1 "Voice").

## 3. Shape and surfaces, as found

| Item | Value | Provenance |
|:--|:--|:--|
| Card radius | 28px (`--radius`), 36px from 1920px | `globals.css:26`, 3xl block |
| Small radius | 16px (`--radius-sm`), 20px from 1920px | `globals.css:27` |
| Pills | 9999px on every button, toggle, badge | `.btn`, S1 |
| Double bezel | 6px shell `bone 4%` + inset hairline `bone 8%`, core `ink-2` with 1px top light `bone 6%` | `globals.css .bezel` |
| Bezel on paper | shell fill removed, hairline `bone 12%` | `globals.css html.light .bezel` (19 Sep) |
| Glass | `ink 55%` + `blur(20px) saturate(140%)` + inset hairline 10% + top light 8% | `globals.css .glass`; rule "fixed elements only" |
| Menu glass | `ink/90` + `backdrop-blur-2xl` | `menu.tsx:47` |
| Phone bezel | `--device` frame, 6px, `rounded-[2.6rem]`, screen `rounded-[2.2rem]`, notch 34% wide | `devices.tsx` |
| Browser frame | `rounded-[1.25rem]`, 36px title bar | `devices.tsx` |
| Kit tile | radius 24px, inset hairline `bone 8%` | S1 `build-kit.js:102` |
| Business card | 85 × 55 mm, radius 1.5mm, shadow `0 8px 30px rgb(0 0 0/.45)` | `build-kit.js:50` |

Rules: "Shadows are large, soft and tinted to ink. No `shadow-md`."
"Never put `backdrop-filter` on something that scrolls."
(`docs/design-system.md` §3)

## 4. Shadows, blur, grain, as found

| Item | Value | Provenance |
|:--|:--|:--|
| Card hover | `0 24px 60px -24px rgb(0 0 0/.55)` | S4 tokens (derived from site usage) |
| Phone drop | `0 40px 80px -20px rgb(0 0 0/.6)` + inset top `rgb(243 239 231/.18)` | `devices.tsx:18` |
| Browser drop | `0 40px 80px -24px rgb(0 0 0/.6)` | `devices.tsx:45` |
| Qeemat screens | `0 40px 60px -20px rgb(0 0 0/.7)` | `products.tsx:58,68` |
| Step card stack | `0 -20px 60px -30px rgb(0 0 0/.7)` | `process.tsx:68` |
| Grain | fixed layer, SVG `feTurbulence` 0.9 / 2 octaves, 220px tile, opacity 0.06 overlay (dark), 0.16 multiply (light) | `globals.css .grain` |
| Duotone | `grayscale(1) contrast(1.08) brightness(0.92)` under an accent multiply wash at 55% open / 85% closed | `globals.css .duotone`; `founders.tsx:88-93` |
| Stack recede | `scale 0.92` + `blur(2px)` + inner veil to 0.6 | `process.tsx:47-48` |
| Deck recede (mobile) | `scale 0.94` + veil 0.55 (work), 0.5 (founders) | `work.tsx`, `founders.tsx` (19 Sep) |

## 5. Gradients, as found (the complete inventory)

Every gradient in S1 and S5. Interpolation is sRGB unless stated (`color-mix(in srgb …)`).

| # | Where | Type | Exact definition | Communicates |
|:--|:--|:--|:--|:--|
| G1 | `hero.tsx:112` | radial | `120% 80% at 0% 100%`, `ink 85%` → `ink 35%` at 45% → transparent at 70% | Scrim for legibility under the hero copy |
| G2 | `hero-canvas.tsx` | shader | Five ribbons of fbm noise; colour `mix(verm, amber, k)`; ink base; light mode `mix(paper, hue·(0.93,0.5,0.3))`; dithered | The brand's one piece of light |
| G3 | `cursor-glow.tsx:54` | radial | `closest-side`, `accent 16%` → `accent 5%` at 45% → transparent at 70%; 52vmax disc; `mix-blend: screen`; hidden in light | Cursor ambience, dark only |
| G4 | `spotlight-card.tsx:47` | radial | `260px circle at cursor`, `accent ⟨0..90⟩%` → transparent 65%; masked to a 1px ring | Illuminated border that follows the cursor |
| G5 | `spotlight-card.tsx:48` | radial | `420px circle at cursor`, `bone 6%` → transparent 60% (inverse: `ink 14%`) | Sheen |
| G6 | `founders.tsx:122` | linear | `to top`, `ink 95%` 0% → `ink 35%` 45% → transparent 80% | Legibility gradient over a portrait |
| G7 | `products.tsx:62` | radial | `70% 50% at 80% 100%`, `accent 35%` → transparent 70% | Qeemat card ambience |
| G8 | `products.tsx:102` | linear | `135deg`, `accent 22%` → transparent 55% | RMS card wash, fades out on hover |
| G9 | `products.tsx:104` | linear | `315deg`, `ink 70%` → transparent 60%, in on hover | The reverse of G8 (S2, founders' request) |
| G10 | `products.tsx:123` | radial dots | `bone 18%` 1px on 18px grid, opacity 0.4 | Dentisto card texture |
| G11 | `products.tsx:126` | radial | `60% 60% at 100% 0%`, transparent → `ink-2` at 70% | Fades G10 toward the corner |
| G12 | `visuals.tsx:32` | radial | `60% 60% at 50% 70%`, `accent 32%` → transparent 70% | Behind the Qeemat phones |
| G13 | `visuals.tsx:250` | radial | `60% 50% at 50% 80%`, `rgb(255 176 32/.22)` → transparent 70% | Behind the SpiceHUT phones (amber, illustration only) |
| G14 | `opengraph-image.tsx:46` | radial | `closest-side`, `rgba(249,99,58,.55)` → `rgba(255,176,32,.25)` 55% → transparent | OG ribbon 1 |
| G15 | `opengraph-image.tsx:59` | radial | `closest-side`, `rgba(255,176,32,.35)` → transparent | OG ribbon 2 |
| G16 | `spotlight-card.tsx:81` | mask | `linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)`, composite exclude | The ring-mask technique for G4 |
| G17 | `globals.css .grain` | noise | see §4 | Grain |

What the inventory says: CiNQ gradients are **always alpha over a flat
token colour**, never two hues. The only two-hue gradients are the shader
and its OG stand-in (vermilion → amber), which the kit fences off: "Amber:
only inside the hero light and the OG image. Never as UI." There is no
gradient-filled text, no gradient button, no gradient in a table.

## 6. Motion, as found (the complete inventory)

Ownership (`docs/design-system.md` §4): GSAP + ScrollTrigger + SplitText for
everything scroll-linked; Motion for component state; React Three Fiber
for the hero; Lenis drives scroll and GSAP's ticker drives Lenis. "Never
animate one element with two of them." "Only `transform`, `opacity`,
`filter` and `clip-path` animate." "Every scroll-linked effect is inside
`gsap.matchMedia()` or checks `prefers-reduced-motion`; under reduced
motion the page is static and complete. The intro never plays there."

| # | Element | Trigger | Parameters | Provenance |
|:--|:--|:--|:--|:--|
| M1 | Preloader | first visit per session | word lines `yPercent 110→0` 0.9s `expo.out` stagger 0.09; mark scale 0.92 0.6s `power2.inOut`; lip `scaleY 0→1` 0.9s `power4.inOut`; curtain `yPercent −100` 1.05s `power4.inOut`; copy out 0.7s `power3.in` | `preloader.tsx:32-65` |
| M2 | Hero headline | intro done | SplitText lines `yPercent 110`, `rotate 2`, 1.4s, stagger 0.09, `expo.out` | `hero.tsx:33-43` |
| M3 | Hero fades | intro done | `y 28`, alpha, 1.2s, stagger 0.1, delay 0.45 | `hero.tsx:45-52` |
| M4 | Hero mark | intro done / hover | segments `scale 0→1` 1s stagger 0.06 `back.out(1.6)`; hover `rotation +=360` 1.4s stagger 0.07 `expo.inOut` | `hero.tsx:53-59, 82-92` |
| M5 | Hero copy out | scroll | `yPercent −18`, alpha 0, scrub, `top top` → `bottom 40%` | `hero.tsx:63-74` |
| M6 | Header | scroll | `quickTo yPercent` 0.55s `expo.out`; hidden after 200px on scroll down; entrance 1.1s delay 0.5 | `header.tsx:41-77` |
| M7 | Marquee | always | `x −50%` 38s linear loop; timeScale ±1 over 0.9s with scroll direction | `marquee.tsx:20-38` |
| M8 | Work room | scroll ≥1024 | track `x −dist` scrub 1, pinned; panel copy `y 40` alpha 1s stagger 0.08 at `left 75%`; visual parallax `xPercent 10→−10`; progress bar `scaleX` | `work.tsx:46-105` |
| M9 | Work deck | scroll <1024 | each panel pins at `top 10%`, recedes `scale 0.94` + veil 0.55 as the next arrives | `work.tsx` (19 Sep) |
| M10 | Studio words | scroll | opacity 0.16→1 stagger 0.04 scrub 0.6, `top 78%` → `bottom 45%` | `studio.tsx:22-34` |
| M11 | Count-up | in view | 0→n 1.6s `expo.out`, once | `studio.tsx:37-51` |
| M12 | Reveal text | in view | SplitText lines 1.3s stagger 0.09 `expo.out` at `top 85%`, once | `reveal-text.tsx:44-48` |
| M13 | Product cards | in view | `y 40`, alpha, `blur 6px→0`, 1s, delays 0.05/0.12/0.18 | `products.tsx:20-23` |
| M14 | Spotlight card | pointer | tilt ±6° spring `140/18`; glow spring `120/20`; springs only, no state | `spotlight-card.tsx:31-36` |
| M15 | RMS wash reverse | hover | G8 out, G9 in, 0.7s `--ease-out` | `products.tsx:102-104` |
| M16 | Services accordion | click | `height 0→auto` + opacity (the one permitted layout animation, Motion `layout`), item reveal 0.9s stagger 0.06 | `services.tsx:48-89` |
| M17 | Process stack | scroll | card pins `top 12%`; next arrival scrubs `scale 0.92`, `blur 2px`, veil 0.6 | `process.tsx:29-49` |
| M18 | Founders strips | hover / mid-band on phones | `flex-grow` 900ms `--ease-out`; image `scale 1.1→1` 1200ms; wash 0.85→0.55 1000ms | `founders.tsx:63-93` |
| M19 | Founder name | open | one element: translate + rotate 90→0 + scale 0.5→1 + clip, 0.9s `[0.16,1,0.3,1]`, geometry re-read per frame | `founders.tsx FounderName` (19 Sep) |
| M20 | Founders deck (mobile) | scroll | pin `top 14%`, recede `scale 0.94`, veil 0.5 | `founders.tsx` (19 Sep) |
| M21 | Menu | open | clip-path `inset(0 0 100% 0 round 0 0 40px 40px)` → open, 0.8s; links `y 110%→0` 0.9s delay 0.12 + 0.06i; note fade 0.8s delay 0.4 | `menu.tsx:47-80` |
| M22 | Roll text | hover | two copies translate 100% over 600ms, per-letter delay 18–25ms | `roll-text.tsx` |
| M23 | Magnetic | pointer | offset × 0.35 (0.25 secondary), spring `180/16/0.4` | `magnetic.tsx:12-31` |
| M24 | Cursor glow | pointer | spring `60/20/0.8`, opacity spring `80/20` | `cursor-glow.tsx:15-18` |
| M25 | Send burst | submit | particles `scale 0.4→1`, 1.2–1.6s `power3.out`; mailto after 650ms | `send-burst.tsx:31-39`; `contact.tsx:45` |
| M26 | Buttons | hover / press | colour 0.5s, transform 0.6s `--ease-out`; press `scale 0.97`; icon disc `translate(2px,−2px) scale 1.06` | `globals.css .btn` |
| M27 | Footer wordmark | pointer / touch | weight 300–800 per letter eased 0.16/frame; on touch a wave 300↔800 0.55s per letter, 0.14s apart, repeat 1.1s | `footer.tsx` |
| M28 | Animated mark | in view / hover | segments 0.7s stagger 0.09 `power3.inOut`; hover spin 1.4s `expo.inOut` | `animated-mark.tsx` |
| M29 | Loader | always | segment opacity chase 1.2s, ring rotate 2.4s linear | `globals.css .mark-loader`; S1 "As a loading indicator" |
| M30 | Theme toggle | click | `color-scheme` swap, no transition | `theme.ts` |

Easings in use: `expo.out` = `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`,
everywhere), `cubic-bezier(0.65, 0, 0.35, 1)` (`--ease-io`), `power3.inOut`,
`power4.inOut`, `power2.inOut`, `power3.in`, `back.out(1.6)`, `expo.inOut`,
`sine.inOut`, linear (scrub and marquee only). Springs: `140/18`, `120/20`,
`180/16/0.4`, `60/20/0.8`, `80/20`.

Durations in use, ms: 150 (colour, S4), 300, 500, 550, 600, 700, 800, 900,
1000, 1050, 1100, 1200, 1300, 1400, 1600; loops 1200, 2400, 38000.
Staggers: 40, 60, 70, 80, 90, 100 ms; letters 18–25 ms.

## 7. Layout, as found

- Page gutter `--pad: clamp(20px, 4.2vw, 64px)`; content 1280px (1720px on 3xl for the process); header pill 1120px, 56px tall (`h-14`), 72px `--nav-h` reserved. (`globals.css`, `header.tsx`)
- "Sections alternate layout families on purpose: full-bleed hero, marquee, horizontal pinned showcase, single statement, asymmetric bento, accordion list, sticky stack, accordion slider, split form, footer. No two adjacent sections share a family." (`docs/design-system.md` §5)
- "Hero copy is a headline of three lines at most, a sub of at most twenty words, and two buttons." (§5). Since 19 Sep the hero is one left stack (S2).
- The products bento: 7/5 columns, Qeemat spans two rows; on phones a three-row list (S2).
- Founders: five strips in a 640px row, open strip `flex 3.4`, others `flex 1`.
- Work: title card `38vw`, panels `min(84vw, 1240px)`, gap 20px, one viewport tall (1200px cap on 3xl).

## 8. Voice, as found

From S1 "Voice" and `content.ts` header: sentence case everywhere including
buttons; "say what the customer gets, not what the software has"; no
em-dashes, periods and commas; banned "leverage, seamless, cutting-edge,
world-class, next-gen, revolutionise"; buttons say what happens ("Book a
clinic demo", not "Submit"); "Claims are limited to what the source
material supports. Do not add a capability to a card without something to
back it up." (`content.ts:82`). The name is `CiNQ` in running text (S1,
19 Sep: "Always written this way, in running text as much as in the mark:
CiNQ, never Cinq or CINQ.").

---

## 9. Design ethos: eight falsifiable principles

Each can be checked on a screenshot or in code. Each is traced.

| # | Principle | Test | Traced to |
|:--|:--|:--|:--|
| P1 | **One accent, one light.** Vermilion is the only hue used as UI; every other colour is ink, bone or a signal. Light (glow, ribbons, amber) exists in exactly one place per page. | Count hues in fills and text: ≤1 besides neutrals and semantic signals. Count elements with ambient light: ≤1 per viewport. | S1 "one colour on ink"; `globals.css` comment "a single vermilion accent"; G2/G3 |
| P2 | **Gradients are alpha, not hue.** Every UI gradient is one token colour fading to transparent. Two-hue gradients exist only in the hero light and its OG stand-in. | Parse every gradient: exactly one non-transparent colour stop family, except G2/G14/G15. | §5 inventory |
| P3 | **Surfaces are objects.** Cards read as physical things: a shell, a core, a top light, a large soft shadow when lifted, never a medium shadow, never a border as decoration. | Every card has either the bezel or a hairline; no `box-shadow` with blur < 40px on a resting element. | `.bezel`, S1 tiles, `docs` §3 |
| P4 | **Glass is chrome.** `backdrop-filter` appears only on elements fixed to the viewport. | Grep `backdrop` → every match is `position: fixed` or inside one. | `docs` §3 rule; `header.tsx`, `menu.tsx` |
| P5 | **One thing reads first.** Each viewport has one dominant region by area × contrast; the hero is a headline, a line, two buttons; a card has one heading. | Squint test: one focal region. Hero has ≤3 headline lines, ≤20-word sub, ≤2 buttons. | `docs` §5; S2 hero change |
| P6 | **Motion is scroll or state, never both.** An element is driven by GSAP (scroll) or Motion/CSS (state), not both; only transform, opacity, filter, clip-path animate; nothing moves under reduced motion. | Static analysis: no element with both a ScrollTrigger and a Motion animate; property allow-list; matchMedia guards. | `docs` §4; every M-row |
| P7 | **Decks, not lists, on a phone.** Repeated full-height content pins and recedes; a phone never scrolls five screens of the same thing. | Work and founders sections ≤ 3 viewports tall on a 390×844 phone. | S2 request; M9, M20 |
| P8 | **Sentence case, said plainly.** Headings, labels and buttons are sentence case; buttons name the outcome; no em-dashes, no banned words, no invented facts. | Regex over content: no Title Case in UI strings, no `—`, no banned list, no `Submit`. | S1 Voice; `content.ts` |

## 10. Signature moves

The devices that make a screen unmistakably CiNQ. Every later spec traces
to one of these.

| # | Move | Definition | Source |
|:--|:--|:--|:--|
| SM1 | **The five-segment C** | The mark: a ring cut into five, one wide opening; used as logo, favicon, loader (segments chase, ring turns), empty-state glyph, and section punctuation. | S1 "The mark", "As a loading indicator"; `mark.ts` |
| SM2 | **The double bezel** | 6px translucent shell + concentric core + 1px top light. The card that reads as an object. | `.bezel`; S1 tiles |
| SM3 | **Illuminated border** | A 1px ring lit by a 260px radial at the cursor, masked with `mask-composite: exclude`, with a 420px sheen behind it; springs, no state. Inverse on accent-washed cards. | G4/G5/G16; M14 |
| SM4 | **Vermilion colour blocks** | Whole panels flood in the accent with ink text, alternating with ink panels: process steps 2 and 4, the RMS work panel, the card back. | `process.tsx tones`; `work.tsx tones`; S1 cards |
| SM5 | **Ink veil recession** | A pinned card stays opaque and darkens through an inner veil while it scales back under the next. | M17, M9, M20 |
| SM6 | **Masked line reveals** | Headlines rise out of per-line masks with `yPercent 110`, `expo.out`, 0.09s stagger. | M2, M12, M21 |
| SM7 | **Ambient vermilion** | One radial alpha glow per viewport: cursor glow, card ambience, phone backlight. Never two. | G3, G7, G12 |
| SM8 | **Weight as motion** | Text animates on the `wght` axis (footer wordmark 300–800), not by scaling. | M27 |
| SM9 | **Grain and duotone** | A fixed film-grain layer; portraits in grayscale under an accent multiply. | G17; `.duotone` |
| SM10 | **The pill and the disc** | Every button is a pill with a round icon disc that lifts `(2px, −2px)` on hover; every field on the site is a pill. | `.btn`; `contact.tsx Field` |
| SM11 | **Kicker · headline · lead** | Every section opens with a mono uppercase kicker, a display headline, then a lead. | every section component |
| SM12 | **Alternating families** | No two adjacent sections share a layout family. | `docs` §5 |

## 11. What the sources do not cover

Stated here so §GAP_ANALYSIS.md can be traced.

- No dense data surface, table, form field state set, or operational screen exists in S1/S5. The site's only form is a five-field mailto composer.
- No semantic feedback colours, chart palette, or numeric formatting in S1/S5 (derived in S4).
- No mobile app, tablet, kiosk, print or email artefact.
- No offline, permission, error, or auth state.
- No Flutter, SwiftUI or Compose implementation; the only code targets are Next.js + Tailwind v4 (S5) and the React primitives (S4).
- No haptic, sound, or high-contrast mode guidance.
