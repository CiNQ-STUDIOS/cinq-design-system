# Content and voice

Traces: P8 (sentence case, said plainly), SM11 (kicker · headline · lead). Canonical sources: the kit's "Voice", `content.ts` (every string on the site lives in one module), the site copy itself.

## 1. Tone

Direct, plain, specific. CiNQ says what the customer gets, not what the software has. It names things ("Delete table 4?"), gives numbers as digits, and stops when the sentence is done. It does not sell, exclaim, or hedge. In tools it is terse and consistent; in marketing it is confident and short; in errors it is calm and useful.

| Do | Don't |
|:--|:--|
| One place where the floor, the kitchen and the till agree. | Integrated multi-module POS solution. |
| Add your name and an email or phone number. | Invalid input. / Oops, something went wrong! |
| No orders yet today. They will show up here as they come in. | Nothing to see here 🙁 |
| Delete table 4? · Delete table / Keep it | Are you sure? · Yes / No |
| Book a clinic demo | Submit / Get started / Learn more |

## 2. Mechanics

- **Sentence case** everywhere: headings, labels, buttons, nav, table headers, tabs, badges' text (the badge's mono uppercase is a style, the string is written in sentence case).
- **Punctuation**: periods and commas. No em-dashes (`—`), no en-dashes as separators (use `·` in metadata: `19 Sep · 14:05`), no semicolons in UI, no exclamation marks, no Oxford comma, no ellipsis except a literal "Loading…" on the mark's label.
- **Numbers**: digits (`5 founders`, `3 items`), spelled only at sentence start. Tabular figures in columns.
- **Names**: the studio is `CiNQ`; products are `CiNQ RMS`, `Dentisto`, `Qeemat`, `SpiceHUT` (their own spelling). `you` for the reader, `we` for the studio, `it` for a product.
- **Banned words**: leverage, seamless, cutting-edge, world-class, next-gen, revolutionise, empower, unlock, robust, innovative, solution (as a noun for software), synergy, delight, effortless, powerful, smart (as a feature adjective), simply, just (as minimisers).
- **Claims**: limited to what the source material supports. No invented numbers, clients, testimonials, addresses, ratings.

## 3. Microcopy by element

| Element | Rule | Example |
|:--|:--|:--|
| Page title | Noun or noun phrase, ≤ 4 words | `Orders`, `Branch 1 settings` |
| Kicker (overline) | Category or context, ≤ 3 words | `Restaurant management`, `Today` |
| Button | Verb + object; says what happens; ≤ 4 words | `Send to kitchen`, `Book a clinic demo`, `Keep it` |
| Destructive button | The verb and the thing | `Delete table`, `Void order 412` |
| Link | The destination | `Order history`, not `Click here` |
| Field label | Noun; `(optional)` on the minority of fields | `Email or phone`, `Notes (optional)` |
| Placeholder | An example, never an instruction, never the label | `+92 3xx xxxxxxx` |
| Helper text | One sentence, the why | `We only call if the order is late.` |
| Error (field) | What is wrong, then what to do; no blame; no "invalid" | `Add a phone number we can reach you on.` |
| Error (system) | What happened, what we are doing, what you can do | `The kitchen display is offline. Orders are queued and will print when it reconnects. Retry now.` |
| Empty state | What will be here, how to make it appear; one CTA | `No appointments today. Booked ones show up here as they come in.` · `Book an appointment` |
| Confirmation | Name the thing; buttons are the outcomes | `Void order 412? The customer will not be charged.` · `Void order` / `Keep order` |
| Toast (success) | Past tense, the thing | `Table 4 cleared`, `Saved` |
| Toast (undo) | The thing + Undo | `Order 412 voided · Undo` |
| Badge / status | One or two words, a noun or an adjective | `Ready`, `New`, `Low stock`, `Pending sync` |
| Tooltip | The name of the control, or a one-line fact; never instructions to read | `Sort by time` |
| Loading | The mark; text only for waits > 3s | `Still loading orders…` |
| Offline | State + what is preserved | `Offline. Your changes are saved on this device and will sync when you are back.` |
| Permission | What you cannot do and who can | `Only managers can change prices. Ask Hamza or Shahzaib.` |
| 404 | `We could not find that page.` + the one link home | |
| 500 | `Something broke on our side. It has been logged. Try again in a minute.` | |

## 4. Formats (D-025)

| Item | en-PK default | Notes |
|:--|:--|:--|
| Money | `Rs 12,500` · `-Rs 400` · paisa on invoice lines only `Rs 1,250.50` | `Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 })`. Lakh/crore only if the product profile says the audience reads them, then everywhere. |
| Other currencies | `$12.50` CAD (SpiceHUT), `£`, `€` per profile | ISO code shown once in a header when mixed. |
| Date | `19 Sep 2026` | Never `09/19/26`. |
| Timestamp | `19 Sep, 14:05` | 24-hour in tools; customer apps may use `2:05 pm` by profile. |
| Schedule | `Fri 19 Sep` · `Fri 19 Sep, 14:05` | |
| Relative time | `2 min ago`, `Just now` | Feeds only, under one hour, then absolute. |
| Duration | `1h 20m`, `45s` | |
| Phone | `+92 320 2929511` | Always international format. |
| Quantity | `3 × Karahi`, `2.5 kg` | |
| Table / seat | `Table 4`, `T4` in dense consoles | |
| Order id | `#412` mono | |
| Percent | `12.5%` | |

## 5. Internationalisation

- All strings in a content module (`content.ts`, Flutter `.arb`), never inline; keys are English phrases with context (`order.void.confirm`).
- No string concatenation; use ICU messages with plurals (`{count, plural, one {# item} other {# items}}`).
- Text expansion budget: 35% (Urdu and German both run long); buttons wrap to two lines at `touch` density only, otherwise widen.
- Dates and numbers through `Intl`, never hand-formatted.
- Urdu: `lang="ur"` `dir="rtl"`, Nastaliq faces, logical CSS properties, mirrored directional icons (`typography.md` §7). Latin numerals unless the profile sets Eastern Arabic.
- Product names and `CiNQ` are not translated. Units follow locale (kg, km).

## 6. Marketing copy shape (SM11)

Every marketing section: kicker (mono, ≤ 3 words) → headline (display, ≤ 12 words, ≤ 3 lines) → lead (≤ 20 words) → body or components. The hero: headline ≤ 3 lines, one context line ≤ 20 words, two buttons at most. One marquee of ≤ 8 items.

## 7. Verification

`tooling/audit-script` greps UI strings for em-dashes, exclamation marks, Title Case, the banned list, `Submit`/`OK`/`Learn more`, and misspellings of `CiNQ`; `AGENT_RULES.md` requires copy in a content module.
