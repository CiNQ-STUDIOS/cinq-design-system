# Screen inventory

Every screen type a CiNQ product ships, mapped to an archetype (`archetypes.md`) with the notes an agent needs to build it without asking. Numbers are archetype ids: 1 console · 2 dashboard · 3 workspace · 4 setup · 5 detail · 6 mobile utility · 7 kiosk · 8 settings · 9 auth.

| Screen | Archetype | Dominant region | Notes |
|:--|:--|:--|:--|
| **Auth** | | | |
| Sign in | 9 | The panel | Email or phone + password; magic link optional; "Forgot password?" as a link, never a button. |
| MFA code | 9 | The panel | Six OTP cells (`form-controls-advanced.md`), auto-advance, resend after 30s with a countdown. |
| Password reset / recovery | 9 | The panel | Two steps: request, then set; success routes to sign in with a toast. |
| Invite acceptance | 9 | The panel | Shows who invited, the role, the branch; one `Accept and set password`. |
| Session expiry | 9 (dialog over the app) | The dialog | Keeps unsaved work; password inline. |
| Device / PIN sign-in (till) | 9, touch | PIN pad | 3 × 4 grid, 64px keys, staff avatar row above. |
| **Onboarding** | | | |
| First-run setup (branch, clinic) | 4 | The column | Stepper; review step; success screen with the one next action. |
| Product tour | 6 or 2 (overlay) | A spotlight on one control | ≤ 4 steps, skippable, never on the console. |
| Permissions request (camera, notifications) | 6 | The sheet | Explain before the OS prompt; one `Allow` and `Not now`. |
| **Home** | | | |
| Owner home | 2 | Chart | The dashboard is the home; no "overview" of module cards. |
| Operator home | 1 | Queue | The console is the home. |
| Customer app home | 6 | The list | Summary (numeric) above. |
| **Lists** | | | |
| Orders, patients, products, staff, invoices | 3 | Table | Saved views in the toolbar; bulk bar on selection; drawer for detail. |
| Live queue (kitchen, dispatch) | 1 | Queue | Virtualised; live edge on new rows. |
| Menu / catalogue (choose to add) | 7 or 3 | Grid of peers | Cards permitted (R7); category chips above. |
| Appointment day view | 1 | Time grid | Columns per doctor/chair, rows per 15 min, now-line in `accent-fill`. |
| Search results | 3 | Result list | Grouped by type with `h6` headers; `⌘K` palette for quick jumps (`patterns/search-and-command.md`). |
| **Detail** | | | |
| Order, patient, product, invoice, staff member | 5 | Body 7/12 | Header with status badge and ≤ 3 actions; rail with facts and timeline. |
| Record inside a workspace | 5 in a drawer | Drawer body | Tabs allowed inside the drawer (Summary, history, bills). |
| **Create / edit** | | | |
| New record (simple, ≤ 8 fields) | 3 drawer or 6 sheet | The form | Inline validation; Save in the drawer footer. |
| New record (long) | 4 | The column | Sections as groups; sticky Save. |
| Bulk edit | 3 | Table + bulk bar | Changes preview in a dialog before apply. |
| **Settings** | | | |
| Profile, org, branch, roles, billing, integrations, API keys, notifications, appearance | 8 | Content 8/12 | Danger group last, rose text; API keys shown once with a copy button and a warning. |
| **Notifications** | | | |
| Notification centre / inbox | 3 (list) or 6 | The list | Grouped by day; unread dot in `accent-fill`; mark-all-read in the toolbar. |
| **Reports** | | | |
| Report builder | 2 | Chart/table | Filters in a rail; export to PDF/CSV via `patterns/documents-and-print.md`. |
| Exports | 3 | Table of exports | Status badges; download link; expiry note. |
| **Help and status** | | | |
| Help / support | 5-like single column | Article body | Search on top; contact at the end (`cinqdevstudio@gmail.com`, WhatsApp). |
| Keyboard shortcuts | dialog | The list | `?` opens it; two columns of shortcut + action. |
| System status | 5 | Status list | Per service; incidents as a timeline. |
| **System states (full page)** | | | |
| 404 | 9-like centred | The message | The mark, "We could not find that page.", one link home. |
| 500 | 9-like | The message | "Something broke on our side. It has been logged. Try again in a minute." + Retry. |
| Maintenance | 9-like | The message | The window in local time; the mark as loader. |
| Offline (whole app) | banner + last state | The last screen | Never a blank page; `patterns/realtime-and-offline.md`. |
| Permission denied (403) | 9-like inside the app shell | The message | "Only managers can open reports. Ask Hamza or Shahzaib." + Back. Never a 404. |
| **Print** | | | |
| Receipt, KOT, invoice, report PDF | `patterns/documents-and-print.md` | The document | Not an archetype; a print stylesheet or a PDF template. |
| **Marketing** | | | |
| Landing, product page, pricing, about, contact | `platforms/marketing-and-demos.md` | Section by section | Alternating families (SM12). |

Rule: a product's `project-profile.md` lists every screen it ships against this table; an unmapped screen is added here with its archetype before it is built.
