# Iconography and imagery

Traces: SM1 (the five-segment C), SM9 (grain and duotone), P1 (one accent). Tokens: `density.*.icon`, `color.semantic.*`.

## 1. The mark

A C built from five arcs: on a 100-unit grid, centre (50, 50), radius 33, stroke 20, opening 78°, gap 7°, five equal segments. Geometry lives in one module (`src/lib/mark.ts` on the site; `code/react/primitives.tsx` `Mark` carries a copy) and every rendering reads it: logo, favicon, OG image, loader, empty-state glyph, section punctuation, pull-to-refresh, the splash.

| Use | Size | Colour |
|:--|:--|:--|
| Favicon / app icon | mark at 64 on a 100 tile, ink tile, accent mark, tile radius 22 | `accent-fill` on `#0c0b0a` |
| Lockup | mark as tall as the capitals, gap 0.34 × ascent | bone/ink wordmark, accent mark; mono variants for single-plate print |
| Loader | 20–96px | `accent-fill`; bone on accent; ink on paper |
| Empty state | 48px | `text-tertiary` |
| Error state | 48px | `feedback-danger-text` |
| Section punctuation (marquee) | 20–28px | `accent-fill` |
| Print (receipts) | 24px bitmap, 1-bit | black |

Minimum 16px. Clear space one fifth of the mark's height. Never recoloured outside bone, ink, vermilion; never rotated as decoration (it turns only as a loader or on hover); never outlined, gradient-filled or stretched. The wordmark is `CiNQ` in Bricolage 800 / wdth 90 / opsz 96 / −4.5%, always from the outlined files.

## 2. Icon library

Phosphor Icons, one weight per surface:

| Surface | Weight | Size (density) |
|:--|:--|:--|
| Marketing, mobile utility, detail, settings, auth, onboarding | `regular` (1.5px at 24) | comfortable 20, touch 24 |
| Dashboard, data workspace | `regular` | compact 18 |
| Console, kiosk | `bold` | dense 16, touch 24 |
| Inside a button disc | `bold` at 16 | |
| Bottom nav | `regular`, `fill` when active | 24 |

Rules: icons sit on the text baseline area and are sized by `--icon` (density token); colour is `currentColor`; an icon never carries meaning alone (label, tooltip or `aria-label`); decorative icons are `aria-hidden`; no icon fonts; no emoji in UI; no custom icons unless Phosphor lacks the concept, in which case the icon is drawn on Phosphor's 256-unit grid at 1.5 stroke and added to `code/icons/`.

Directional icons mirror in RTL (`ArrowRight` → `ArrowLeft`, `CaretRight` → `CaretLeft`); non-directional (search, settings) do not.

## 3. Illustration

CiNQ does not use illustration systems, mascots or stock vectors. The permitted illustrative devices are: the mark, device frames with real screens, the shader ribbons (marketing), colour blocks (SM4), and the mono-labelled wireframe mocks used in the work showcase for products that cannot show a real screen. An empty state is the mark and a sentence, never a picture of an empty box.

## 4. Photography

- Founders: portraits under `.duotone` (grayscale 1, contrast 1.08, brightness 0.92) with an accent multiply wash (0.85 closed, 0.55 open) and `portrait-fade` for text. Framed `object-position: 50% 28%`.
- Product photography (food, clinics) in client products: natural colour, inside a `surface-primary` container at the surface's radius, `aspect-ratio` fixed per component (4:3 list thumbnails, 16:10 hero cards, 1:1 avatars), `object-fit: cover`.
- No stock photography of people at laptops. No filters other than duotone on portraits.

## 5. Device frames

`Phone`: 9:19.5, radius `2.6rem`, bezel 6px `surface-device`, screen radius `2.2rem` on `surface-device-screen`, notch 34% wide × 22px, `shadow-device`. `Browser`: 16:10, radius `1.25rem`, 36px title bar with a mono title. Frames stay dark in both modes (they are objects). Screens inside are real captures or working slices; never a placeholder gradient.

## 6. Avatars

Round, sizes 24 / 32 / 40 / 56. Fallback: initials in Geist 500 on `surface-raised`, colour `text-primary`; never a random colour per user (P1). Status dot 8px at the bottom-right in a `feedback-*-solid`, with a 2px `surface-primary` ring. Group avatars overlap by 8px with the same ring, max 4 then `+n` in a `Badge`.

## 7. Imagery in data

Product thumbnails in tables: 32px square, radius `radius-control` / 2, `surface-raised` behind. Never a photo behind text in a console.

## 8. Verification

The showcase renders the mark at every listed size and colour, the icon weights per density, and an avatar row. `tooling/lint` flags `<img>` without `alt` and icon components without `aria-hidden` or a label.
