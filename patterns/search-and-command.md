# Search and command

## 1. Where search lives

| Surface | Search |
|:--|:--|
| Workspace (tables) | A search input in the table toolbar, scoped to that table; `⌘K` for everything |
| Console | `⌘K` only, plus type-to-find on the queue (typing a table number or order id jumps) |
| Dashboard | `⌘K` |
| Mobile | A search field at the top of lists; a search tab in the bottom nav if the app is search-heavy |
| Marketing | None (one page) |

## 2. Command palette (`⌘K` / `Ctrl+K`)

**Anatomy**: dialog at the top centre (T3.7), 640 wide, `surface-overlay`, `radius-panel`, `shadow-strong`; a search input (`search` style, 48 tall, no border, hairline below) with a leading magnifier and a trailing `Esc` hint in mono; results grouped with `h6` kickers: **Actions** (verbs the user can do here: "New order", "Print today's KOTs", "Switch to Branch 2"), **Pages** (routes), **Orders**, **Patients**, **Products** (typed entities); each result: icon 18, primary `body`, secondary `body-s` `text-secondary`, a mono shortcut or id at the end; ≤ 8 per group, "Show all 42 in Orders" at the group end; footer line with `↑↓` `↵` `Esc` hints in mono.
**Behaviour**: opens with the last query cleared; typing searches all groups with a 120ms debounce (async groups show the mark inline); ArrowUp/Down moves across groups; Enter runs or navigates; `Tab` cycles group filters (`> ` prefix for actions, `# ` for ids, `@ ` for people); Escape closes; recent items shown when empty (≤ 5); results announce "8 results" via a live region; on phones the palette is a full-screen sheet with the input at the top.
**Match rendering**: matched characters `text-primary` on a `text-secondary` string; never highlighted in vermilion.
**Motion**: T3.7 in, `fast` out; result list updates crossfade `fast`; no per-row animation.

## 3. Table search

Scoped, live (200ms), `Enter` submits for server search; the filter chips reflect the query (`Search: "karahi" ✕`); no results → the no-results empty state with `Clear search`.

## 4. Filters

Chips in the toolbar (`Doctor ▾`, `Status ▾`, `Date ▾`); a chip opens a popover with checkboxes/radios/date picker; active chips show the value (`Status: Due`) with ✕; more than 4 active → `Filters (6)` chip that opens a drawer listing them; saved views capture the set. On phones: a `Filters (2)` button → sheet.

## 5. Sorting

Column headers; the active sort shown as a chip on phones (`Sort: Newest ▾`).

## 6. Keyboard shortcuts (consoles and workspaces)

| Key | Action |
|:--|:--|
| `⌘K` | Command palette |
| `/` | Focus the table search |
| `N` | New (order, patient) in this context |
| `↑ ↓` | Move the focused row / queue anchor |
| `↵` | Open the focused row (drawer / rail) |
| `Space` | Select the focused row |
| `Esc` | Close the topmost overlay, clear selection |
| `?` | Shortcuts dialog |
| `1–9` | Jump to sidebar items 1–9 (with `⌘` on desktop) |
| `⌘S` | Save (forms) |

Single letters are ignored while an input has focus. The shortcuts dialog lists all of them in two columns (`kbd` styled: mono, `surface-raised`, `radius-check`, hairline).

## 7. Empty and error

Palette with no matches: "No matches for 'karahi'. Try an order number or a name." Search service down: the palette still shows Pages and Actions (client-side) with a banner row "Search is offline; pages and actions still work."

## 8. Flutter

A `showGeneralDialog` anchored to the top with the same anatomy; `Shortcuts`/`Actions` for the key map; on phones a full-screen route with a `TextField` autofocused.
