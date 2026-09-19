# Marketing and demos

cinqstudios.com and any public product page. The one surface with the full motion and gradient budget. Canonical: `audit/BRAND_DNA.md` §5–7 (the site is the reference), `profiles/cinq-website.md`. Traces: every P and SM.

## 1. Page grammar (SM11, SM12)

Sections alternate layout families; no two adjacent share one. The site's order is canonical: full-bleed hero → marquee strip → horizontal pinned showcase → single statement → asymmetric bento → accordion list → sticky stack → strips (founders) → split form → footer. A product page uses a subset in the same spirit: hero → strip → showcase or statement → bento (≤ 1) → stack or accordion → contact → footer.

Every section: kicker (mono) → headline (display-m, ≤ 12 words, ≤ 3 lines) → lead (≤ 20 words) → the section's device. One section per viewport on desktop.

## 2. Hero

One left-aligned stack (canonical since 19 Sep): the mark (40/48), headline `display-l` ≤ 3 lines, one context line at `body` (never the lead size, so the headline reads first), two buttons (primary + ghost). Behind: the shader (five ribbons, vermilion → amber, ink base; paper mode draws vermilion ink) under `scrim-hero`. Reduced motion or tier 2 devices: a static poster of the shader. Scroll-out T7.8.

## 3. Devices in this platform

| Device | Spec |
|:--|:--|
| Preloader | Once per session (`sessionStorage`), M1; never under reduced motion |
| Marquee | One per page, 38s, follows scroll direction; ≤ 8 items with the mark as punctuation |
| Horizontal room | T7.6 at `lg`+; a deck (T7.4) below |
| Word fill | T7.7 on the statement |
| Count-up | T9.1 on ≤ 3 numbers |
| Bento | One, 7/5 with a 2× cell; on phones a compact list (canonical) |
| Spotlight cards | SM3 on the bento; inverse on an accent-washed card |
| Sticky stack | T7.4, alternating ink / accent / ink / accent (SM4) |
| Strips (founders) | flex-grow strips with duotone portraits and the one-element name morph (T5.4); a deck on phones |
| Split form | 5/7, the bezel, pill fields, `Send it to us` composing a mailto; a real backend later keeps the same form |
| Footer | Ink always; the wordmark at 30vw with weight-as-motion (SM8), a wave on touch; links in two columns on phones |
| Cursor glow | One, dark mode, pointer devices |
| Grain | Fixed layer, 0.06 overlay dark / 0.16 multiply light |
| Header pill | Glass, hides on scroll down |

## 4. Fluid type and the 3xl tier

Marketing uses the fluid roles at their full caps and the 3xl tier from 1920 (type one notch up, radii 36/20, work panels `min(80vw, 1900px)`, process column 1720). Apps do not.

## 5. Conversion anchors

One primary CTA per viewport (D-014) that always says the outcome (`Start a project`, `Book a clinic demo`); the header pill carries the same CTA; the contact section's needs are five pills; WhatsApp is one number; the studio email is a display-size link.

## 6. Interactive sandboxes (product demos)

A demo embeds a real, working slice of the product inside a device frame (`Browser`, `Phone`) on `surface-primary` with the archetype's density and no marketing motion inside the frame (the frame may parallax ±10%; the UI inside behaves like the product). Demo data is real-shaped and labelled `Demo` with a badge; a `Reset` control; keyboard accessible; the frame is the escape hatch container (`color-system.md` §10).

## 7. SEO and sharing

`metadataBase` from `NEXT_PUBLIC_SITE_URL`; OG image drawn from the same mark geometry and the two OG ribbons; sitemap and robots; sentence-case titles `CiNQ. Software your business actually runs on.`; JSON-LD Organization with the five founders.

## 8. Performance

Lighthouse mobile: Performance ≥ 90, others 100; the shader is `dynamic` with `ssr: false` and a poster; Three.js only in the hero chunk; videos `preload="metadata"` with posters; fonts preloaded; CLS ≤ 0.05 with `size-adjust` fallbacks.

## 9. Do / don't

Do: alternate families, one accent fill per viewport, the mark as punctuation, real screens in frames. Don't: two marquees, a second bento, a hero with three buttons, stock photos, gradient text, motion that hides content under reduced motion, a chatbot bubble over the footer wordmark.
