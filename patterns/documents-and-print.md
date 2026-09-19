# Documents and print

Thermal receipts, kitchen order tickets (KOT), invoices, PDF exports, print stylesheets, email templates. Traces: SM1 (the mark), P1, P8. Print has no gradients, no shadows, no glass; colour is dropped except one accent element on colour printers.

## 1. Thermal receipt (80mm and 58mm)

Printable width 72mm (80mm paper) or 48mm (58mm). Monospace bitmap fonts on the printer; the layout is text with fixed columns.

```
        [C]  CiNQ RMS · Karahi House
        Blue Area, Islamabad
        +92 320 2929511
------------------------------------------
Order #412          19 Sep 2026  14:05
Table 4             Server: Hamza
------------------------------------------
2  Chicken karahi                  3,200
4  Naan                              400
1  Raita                             150
------------------------------------------
Subtotal                           3,750
Tax 16%                              600
TOTAL                           Rs 4,350
Cash                            Rs 5,000
Change                          Rs   650
------------------------------------------
      Thank you. cinqstudios.com
        [QR: order/412]
```

Rules: the mark as a 24 × 24 1-bit bitmap centred at the top (the kit's mark, no wordmark on 58mm); the business name in double-height; item lines qty (2ch) · name (wrapped at 26ch on 80mm, 18ch on 58mm) · amount right-aligned; totals block with `TOTAL` in double-height; money `Rs 4,350` with no decimals unless paisa; a QR (order link) at 96px; cut after 4 blank lines. Language: the branch's; Urdu receipts print Naskh from the printer's font set, right-aligned amounts stay Latin.

## 2. Kitchen order ticket (KOT)

80mm, largest type the printer has: order id and table in double-height and double-width, a `NEW` / `MODIFIED` / `VOID` line in inverse (black band), time, then items with qty in double-width and modifiers indented (`  no onion`), one ticket per station (Grill, Tandoor) with the station name at the top; no prices, no logo. Kitchen displays render the same content on screen as operational cards (`data-surfaces.md`).

## 3. Invoice (A4, PDF)

```
┌────────────────────────────────────────────────────────────┐
│ [C] CiNQ RMS · Karahi House                 INVOICE        │
│ Blue Area, Islamabad · NTN 1234567-8        #INV-2026-0412 │
│                                              19 Sep 2026   │
│ Bill to                                                    │
│ Ayesha Khan · +92 …                                        │
│ ──────────────────────────────────────────────────────────  │
│ Item                          Qty     Unit        Amount   │
│ Chicken karahi                  2    1,600         3,200   │
│ Naan                            4      100           400   │
│ ──────────────────────────────────────────────────────────  │
│                                          Subtotal  3,750   │
│                                          Tax 16%     600   │
│                                          TOTAL  Rs 4,350   │  the one accent line (vermilion deep) on colour
│ Paid · Cash · 19 Sep 2026                                  │
│ Thank you. cinqstudios.com · cinqdevstudio@gmail.com       │
└────────────────────────────────────────────────────────────┘
```

Type: Geist 10pt body, 9pt table, Bricolage 700 18pt for the title and the business name, Geist Mono for ids and amounts (tabular); margins 18mm; a hairline table (0.3pt `#14120f` at 30%); the one accent is the total rule in `accent-deep` `#c9330c` (canonical "print shadows only" reads as: the deep vermilion is for print); greyscale printers get a 0.6pt black rule. Page numbers `1 / 2` in mono at the foot. Generated server-side (Puppeteer from the print stylesheet, or a PDF library with the same measures).

## 4. Reports (PDF export)

A4 landscape for tables, portrait for summaries; the report title, the date range and the branch in the header of every page; charts rendered at 2× as PNG with the light chart palette and no area gradients (flat fills at 100% of the series colour at 24% is replaced by a solid `#e6dfd1` band); tables repeat their header row per page; footer "Generated 19 Sep 2026 14:05 · CiNQ RMS".

## 5. Print stylesheet (web)

`@media print`: canvas white, `--text-primary: #14120f`, every `--gradient-*: none`, every `--shadow-*: none`, `backdrop-filter: none`, grain hidden, sidebar/app bar/bottom nav/toasts `display: none`, the page header and the dominant region printed, tables with `break-inside: avoid` on rows and repeated `<thead>`, links show their URL only in reports, the accent reduced to `accent-deep` on rules and badges as outlined text. `@page { margin: 18mm }`.

## 6. Email templates

600px single column, table-based HTML, system fonts (Geist not guaranteed; `font-family: Geist, -apple-system, Segoe UI, Roboto, sans-serif`), the mark as a 48px PNG, canvas `#efe9dd` (paper) with a white content card at radius 16 (email clients), text `#14120f`, one vermilion button (`#ef5a2f` with `#0c0b0a` text, 44px tall, radius 999), footer in `#5a554d` with the studio address and an unsubscribe link for marketing mail (transactional mail has none). Dark-mode email: `prefers-color-scheme` block swaps to ink and bone. Subject lines in sentence case, no emoji, ≤ 50 characters.

| Email | Subject | Body |
|:--|:--|:--|
| Invite | `Hamza invited you to CiNQ RMS` | Who, role, branch, one button `Accept the invite`, expiry |
| Password reset | `Reset your CiNQ RMS password` | One button, 30-minute expiry, "If you did not ask for this, ignore it." |
| Receipt / invoice | `Your receipt from Karahi House` | Summary table + PDF attached |
| Daily report | `Karahi House · 19 Sep · Rs 184,500` | Three numbers, one chart image, a link |
| Appointment reminder (Dentisto) | `Tomorrow 10:30 with Dr Sara` | Time, address, `Reschedule` link |

## 7. SMS / WhatsApp

≤ 160 characters, no links shortened beyond recognisability, the business name first: `Karahi House: your order #412 is ready. Table 4.` · `Dentisto: reminder, tomorrow 10:30 with Dr Sara. Reply 1 to confirm.`

## 8. Verification

Print a receipt on an 80mm and a 58mm printer from the console reference screen; print the invoice PDF and the dashboard page via the print stylesheet; render the invite email in a dark-mode client. Checklist in `governance/TESTING.md`.
