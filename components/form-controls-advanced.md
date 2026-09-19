# Advanced form controls

Combobox, date and time pickers, range, file upload, sliders, steppers, OTP, rich inputs. Same spec format as `core-primitives.md`. All inherit Input's tokens and states.

## Combobox (searchable select, multi-select)

**Anatomy**: Input with a trailing chevron · listbox popover (`surface-raised`, `radius-panel`, `shadow-strong`, max 8 rows visible, virtualised beyond 100) · option (`--control-h` − 4, leading check when multi, secondary text in `text-tertiary`) · empty row "No matches" · optional "Create '…'" row · selected chips inside the field (multi).
**Behaviour**: `role="combobox"` + `aria-expanded` + `aria-controls`; typing filters (debounce 120ms, highlight the match with `text-primary` on `text-secondary`); ArrowDown opens and moves `aria-activedescendant`; Enter selects; Escape closes; Backspace on an empty multi input removes the last chip; async options show the mark at 16 in the list; on phones ≤ 12 options → native select, otherwise a full-screen sheet with the search at the top.
**Motion**: T3.4 popover, chips T6.1.
**Flutter**: `Autocomplete` with a custom `optionsViewBuilder` on `surfaceRaised`; phones → `showModalBottomSheet` with a search field.
**Don't**: a combobox for ≤ 5 known options (use a segmented control or radios).

## Date picker

**Anatomy**: Input `19 Sep 2026` (typed or picked) with a trailing calendar icon · popover calendar: month header with ◀ ▶ and a month/year select, weekday row in `h6` mono, 7 × 6 grid of 36px cells (44 on touch), today ringed with `line-boundary`, selected `accent-fill` with ink digit, disabled dates `text-tertiary` with no hover, range days `accent-soft`.
**Behaviour**: typing accepts `19 Sep 2026`, `19/09/2026`, `2026-09-19`; arrow keys move a day, PageUp/Down a month, Home/End week edges, Enter selects, Escape closes; `aria-label` on each cell "Friday 19 September 2026"; min/max and disabled predicates; on phones a bottom sheet with the same grid at 44px cells (never the OS wheel for dates that need a calendar; the OS picker is allowed for birthdays).
**Range**: two inputs `From` / `To` sharing one popover; presets on the left rail (Today, This week, Last 7 days, This month, Custom).
**Time**: Input `14:05` with a popover list of 15-minute steps (`--control-h` − 8 rows), typing accepts `2:05 pm` and `14:05`; 24-hour in tools.
**Motion**: T3.4; month change crossfade `fast`.
**Flutter**: `showDatePicker` replaced by a custom `CalendarDatePicker` styled with the same tokens (the Material dialog's shape and colours are not CiNQ); time as a list sheet.

## Slider

**Anatomy**: track 4px `text 18%`, filled part `accent-fill`, thumb 20px round `surface-inverse` with a 2px `surface-primary` ring (28px on touch), value bubble above on drag (`surface-inverse`, `body-s`).
**Behaviour**: `<input type="range">` styled, or `role="slider"` with `aria-valuenow/min/max/valuetext`; arrow keys ±step, Shift ±10 steps; ticks optional for ≤ 10 steps; dual-thumb for ranges.
**Don't**: a slider for precise values (use a number input beside it).

## Stepper (numeric)

`[−] 2 [+]`: two icon buttons `--control-h` and a number input between, tabular; long-press repeats after 400ms every 80ms; min/max disable a side; on the till 56px touch version. `aria-label="Quantity"`, live region announces the value.

## File upload

**Anatomy**: dropzone (dashed `line-boundary` 1px, `radius-slab`, `surface-sunken`, the mark at 32 in `text-tertiary`, "Drop files here or browse", accepted types and size in `text-tertiary`) · file rows (icon, name, size, progress line 2px `accent-fill`, ✕) · image previews 64px square with `radius-control`.
**States**: rest · drag-over (`line-selected`, `accent-soft`) · uploading (progress, T9.6) · done (check) · failed (rose text + Retry).
**Behaviour**: `<input type="file">` behind a labelled button; keyboard opens it; paste supported; on phones camera capture for receipts (`capture="environment"`).
**Flutter**: `file_picker` / `image_picker`; the dropzone becomes a tap target.

## OTP / code input

Six cells (4 for PINs), each `--control-h` square, `numeric` typography at 24px, `radius-control`, `line-boundary`; one hidden `<input inputmode="numeric" autocomplete="one-time-code">` drives all cells; typing advances, Backspace retreats, paste fills; filled cell shows the digit, active cell has the ring; error turns all borders rose and shakes nothing (T2.3); resend link with a 30s countdown in mono.

## Rich text (notes, descriptions)

A textarea-styled editor (`surface-input`, `radius-control`) with a minimal toolbar on focus: bold, italic, list, link; no headings, no colours, no images inline (attachments use upload). Output is sanitised HTML or Markdown per product. Keyboard: `⌘B/I/K`.

## Search input

Pill (`radius-pill`), leading magnifier 18, trailing ✕ when filled, `⌘K` hint in mono at the right on desktop; Enter submits, Escape clears; debounce 200ms for live results; results in a popover (T3.4) grouped by type, or the command palette (`patterns/search-and-command.md`).

## Toggle group (multi-select segmented)

As segmented control but `aria-pressed` per button, ≤ 6 options; selected options `surface-primary` + `shadow-pressed`.

## Password with strength

Input (password) + a 4-segment strength line (2px, `feedback-danger` → `warning` → `success`) + a `body-s` hint naming the missing rule ("Add a number"); never a percentage.

## Address / phone

Phone: country code select (flag as text `+92`, not an image) + tel input with `inputmode="tel"`, formats on blur to `+92 320 2929511`. Address: single textarea plus city select; no separate line 1/line 2 fields in Pakistan.

## Field groups and sections (forms)

A group: `h4` heading, one sentence in `text-secondary`, its fields with `--gap`; groups separated by `--gap-lg × 2`; never two columns of inputs in a form flow; a short related pair (city, postcode) may share a row only on desktop workspaces.

## Validation summary

On submit with errors: a banner at the top (`feedback-danger-bg`) "2 things need fixing." with links to each field, `role="alert"`; focus moves to the first invalid field. Inline messages stay.
