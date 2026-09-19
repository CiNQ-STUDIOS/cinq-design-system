#!/usr/bin/env node
/**
 * CiNQ showcase build. Generates the three token-driven pages from
 * foundations/tokens.json so the living style guide, the motion lab and
 * the gradient lab can never fall behind the tokens:
 *
 *   showcase/index.html         every token and every component in every state
 *   showcase/motion-lab.html    every easing, spring, duration, transition and keyframe, with a reduced-motion toggle
 *   showcase/gradient-lab.html  every gradient, glow, ring, grain and glass surface, in both modes
 *
 *   node tooling/showcase/build.js
 *
 * The archetype screens in showcase/archetypes/ are hand-written.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, "foundations/tokens.json"), "utf8"));
const flat = new Map();
(function walk(n, p) {
  if (!n || typeof n !== "object") return;
  if ("$value" in n) return void flat.set(p.join("."), n);
  for (const [k, v] of Object.entries(n)) if (!k.startsWith("$")) walk(v, [...p, k]);
})(tokens, []);
const by = (prefix) => [...flat].filter(([p]) => p.startsWith(prefix));
const cssName = (p) => {
  const [g, ...rest] = p.split(".");
  if (g === "color") return rest[0] === "semantic" ? rest.slice(1).join("-") : `color-${rest.slice(1).join("-")}`;
  if (g === "duration") return `dur-${rest.join("-")}`;
  if (g === "easing") return `ease-${rest.join("-")}`;
  if (g === "z-index") return `z-${rest.join("-")}`;
  if (g === "font") return rest[0] === "size" ? `font-size-${rest[1]}` : `font-${rest.join("-")}`;
  return `${g}-${rest.join("-")}`;
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const desc = (t) => (t.$description ? esc(t.$description) : "");

function page({ title, kicker, lead, body, home = "index.html", density = false, extraHead = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0c0b0a">
<title>${esc(title)} · CiNQ design system</title>
<link rel="icon" href="mark.svg">
<link rel="stylesheet" href="../implementations/variables.css">
<link rel="stylesheet" href="../implementations/motion.css">
<link rel="stylesheet" href="../code/react/primitives.css">
<link rel="stylesheet" href="showcase.css">
<script src="showcase.js"></script>${extraHead}
</head>
<body>
<div class="sc-grain" aria-hidden="true"></div>
<main class="sc-page" id="main" ${density ? "data-density-root" : ""}>
<p class="sc-kicker">${esc(kicker)}</p>
<h1 class="sc-title">${esc(title)}</h1>
<p class="sc-lead">${lead}</p>
<nav class="sc-nav" aria-label="Showcase"><a href="index.html">Style guide</a><a href="motion-lab.html">Motion lab</a><a href="gradient-lab.html">Gradient lab</a><a href="archetypes/operational-console.html">Console</a><a href="archetypes/executive-dashboard.html">Dashboard</a><a href="archetypes/data-workspace.html">Workspace</a><a href="archetypes/setup-onboarding.html">Setup</a><a href="archetypes/detail-record.html">Detail</a><a href="archetypes/mobile-utility.html">Mobile</a><a href="archetypes/tablet-kiosk-pos.html">Till</a><a href="archetypes/settings.html">Settings</a><a href="archetypes/auth-entry.html">Sign in</a><a href="archetypes/rms-after.html">RMS after</a></nav>
${body}
</main>
<script>CQ.modebar({ home: "${home}", density: ${density} });</script>
</body>
</html>
`;
}

/* ── index.html ────────────────────────────────────────────────────────── */
function swatches(list) {
  return `<div class="sc-grid">${list.map(([p, t]) => `<div class="sc-swatch"><div class="chip" style="background: var(--${cssName(p)})"></div><b>${esc(p.split(".").slice(-2).join(" "))}</b><code>--${cssName(p)}</code><code>${esc(String(t.$value)).slice(0, 48)}</code></div>`).join("")}</div>`;
}

const indexBody = `
<section class="sc-section" id="colour">
<h2>Colour</h2>
<p>Semantic tokens are what a product uses; switch the mode bar to see every one re-resolve. Primitives are listed for reference and are banned in components.</p>
<h3 class="sc-h3">Surfaces</h3>${swatches(by("color.semantic.surface."))}
<h3 class="sc-h3">Text</h3>${swatches(by("color.semantic.text."))}
<h3 class="sc-h3">Accent (the split: fill vs text)</h3>${swatches(by("color.semantic.accent."))}
<h3 class="sc-h3">Lines and interaction</h3>${swatches([...by("color.semantic.line."), ...by("color.semantic.interaction.").filter(([, t]) => t.$type === "color")])}
<h3 class="sc-h3">Feedback</h3>${swatches(by("color.semantic.feedback."))}
<h3 class="sc-h3">Chart series, in order</h3>${swatches(by("color.semantic.chart."))}
<h3 class="sc-h3">Footer (never flips)</h3>${swatches(by("color.semantic.footer."))}
<h3 class="sc-h3">Primitives</h3>${swatches(by("color.primitive.").filter(([, t]) => t.$type === "color"))}
</section>

<section class="sc-section" id="type">
<h2>Typography</h2>
<p>Every role at its live size. Resize the window to watch the fluid roles move between their clamp bounds.</p>
${by("typography.").map(([p]) => { const r = p.split(".")[1]; return `<div class="sc-type-row"><span class="sc-mono">${r} · .t-${r}</span><span class="t-${r}">${/numeric/.test(r) ? "Rs 184,500" : /overline|badge|h6/.test(r) ? "Restaurant management" : /code/.test(r) ? "order/412 · 14:05 · T4" : "Software your business actually runs on."}</span></div>`; }).join("")}
<h3 class="sc-h3">Families and weights</h3>
<div class="sc-row"><span class="sc-tile" style="font-family: var(--font-display); font-weight: 700">Bricolage 700</span><span class="sc-tile" style="font-family: var(--font-display); font-weight: 800; font-variation-settings: var(--font-variation-display-tight)">Bricolage 800 · wdth 90</span><span class="sc-tile" style="font-family: var(--font-sans); font-weight: 400">Geist 400</span><span class="sc-tile" style="font-family: var(--font-sans); font-weight: 500">Geist 500</span><span class="sc-tile" style="font-family: var(--font-mono)">Geist Mono 400</span></div>
</section>

<section class="sc-section" id="space">
<h2>Space, radius, borders, layout</h2>
<p>4px base. Radii tight in apps, big on the site, round on every pill.</p>
<div class="sc-row">${by("space.").filter(([p]) => !/section|gutter/.test(p)).map(([p, t]) => `<div class="sc-swatch"><div style="width: var(--${cssName(p)}); height: var(--${cssName(p)}); min-width: 4px; min-height: 4px; background: var(--accent-fill); border-radius: 2px"></div><code>${p.split(".")[1]} · ${t.$value}</code></div>`).join("")}</div>
<div class="sc-row">${by("radius.").map(([p, t]) => `<div class="sc-swatch"><div style="width: 88px; height: 64px; background: var(--surface-raised); box-shadow: inset 0 0 0 1px var(--line-standard); border-radius: var(--${cssName(p)})"></div><code>${p.split(".")[1]} · ${t.$value}</code></div>`).join("")}</div>
<div class="sc-row">${by("border.").map(([p, t]) => `<div class="sc-swatch"><div style="width: 120px; height: 44px; border-radius: var(--radius-control); border: var(--${cssName(p)}); background: var(--surface-input)"></div><code>${p.split(".")[1]}</code></div>`).join("")}</div>
<table class="sc-table"><thead><tr><th>Layout token</th><th>Value</th><th>Use</th></tr></thead><tbody>${by("layout.").map(([p, t]) => `<tr><td><code>--${cssName(p)}</code></td><td><code>${esc(t.$value)}</code></td><td>${desc(t)}</td></tr>`).join("")}</tbody></table>
<table class="sc-table"><thead><tr><th>Breakpoint</th><th>Width</th><th>Note</th></tr></thead><tbody>${by("breakpoint.").map(([p, t]) => `<tr><td><code>${p.split(".")[1]}</code></td><td><code>${t.$value}</code></td><td>${desc(t)}</td></tr>`).join("")}</tbody></table>
</section>

<section class="sc-section" id="density">
<h2>Density</h2>
<p>Use the mode bar's Comfortable / Compact / Dense / Touch to re-size every control and row on this page. Hit areas on touch never drop below 44px.</p>
<div class="sc-density">
${["comfortable", "compact", "dense", "touch"].map((lvl) => `<div ${lvl === "comfortable" ? "" : `data-density="${lvl}"`}><span class="sc-mono">${lvl}</span><input class="cq-input" value="Rs 12,500" aria-label="${lvl} input"><div class="row">Row at --row-h</div><div class="row">Second row</div><div style="margin-top: var(--gap)"><button class="cq-btn cq-btn-primary cq-btn-no-ico"><span class="cq-btn-label">Send to kitchen</span></button></div></div>`).join("")}
</div>
</section>

<section class="sc-section" id="depth">
<h2>Depth</h2>
<p>Surface step + edge + shadow. Resting cards have no shadow; blur only on fixed chrome.</p>
<div class="sc-grid">${by("shadow.").map(([p, t]) => `<div class="sc-swatch"><div class="sc-shadow-demo" style="margin-top: 0; box-shadow: var(--${cssName(p)})"></div><b>${p.split(".")[1]}</b><code>${desc(t).slice(0, 60)}</code></div>`).join("")}</div>
<div class="sc-glass-demo" style="margin-top: var(--space-6)"><div class="behind"><b>Behind the glass</b></div><div class="pill"><span class="sc-mono" style="color: var(--text-primary)">.cq-glass · blur 20 · saturate 140%</span></div></div>
<div class="sc-z">${by("z-index.").map(([p, t]) => `<span>${p.split(".")[1]} ${t.$value}</span>`).join("")}</div>
<div class="sc-grid-2">
<div class="sc-spot"><div class="core"><span class="sc-mono">Spotlight card · hover</span><p style="margin-top: var(--space-3)">The 1px ring lights where the cursor is; the sheen follows behind it.</p></div><i class="ring"></i><i class="sheen"></i></div>
<div class="sc-spot inverse"><div class="core" style="background-image: var(--gradient-wash-accent)"><span class="sc-mono">Inverse · on an accent wash</span><p style="margin-top: var(--space-3)">Ink ring, shadow sheen: the reverse of the orange glow.</p></div><i class="ring"></i><i class="sheen"></i></div>
</div>
</section>

<section class="sc-section" id="components">
<h2>Components, every state</h2>
<p>From <code>code/react/primitives.css</code>. Hover, focus with the keyboard, and switch modes.</p>

<h3 class="sc-h3">Buttons</h3>
${["primary", "ghost", "bone", "destructive"].map((v) => `<div class="sc-states"><span class="sc-mono" style="grid-column: 1 / -1">${v}</span>
<div><button class="cq-btn cq-btn-${v}"><span class="cq-btn-label">Rest</span><span class="cq-btn-ico" aria-hidden="true">↗</span></button><span class="sc-mono">rest</span></div>
<div><button class="cq-btn cq-btn-${v} cq-btn-no-ico"><span class="cq-btn-label">No disc</span></button><span class="sc-mono">plain</span></div>
<div><button class="cq-btn cq-btn-${v} cq-btn-sm cq-btn-no-ico"><span class="cq-btn-label">Small</span></button><span class="sc-mono">sm</span></div>
<div><button class="cq-btn cq-btn-${v} cq-btn-no-ico" disabled><span class="cq-btn-label">Disabled</span></button><span class="sc-mono">disabled</span></div>
<div><button class="cq-btn cq-btn-${v} cq-btn-no-ico" aria-busy="true"><span class="cq-btn-label">Loading</span><span class="cq-btn-spinner"><span class="cq-loader" role="status" aria-label="Loading" style="width: 24px; height: 24px" data-mark></span></span></button><span class="sc-mono">loading</span></div>
</div>`).join("")}

<h3 class="sc-h3">Fields</h3>
<div class="sc-states">
<div class="cq-field"><label class="cq-label" for="f1">Your name</label><input id="f1" class="cq-input" placeholder="Ayesha Khan"><span class="sc-mono">rest</span></div>
<div class="cq-field"><label class="cq-label" for="f2">Email or phone <span class="cq-label-note">(optional)</span></label><input id="f2" class="cq-input" value="+92 320 2929511"><p class="cq-help">We only call if the order is late.</p><span class="sc-mono">filled + help</span></div>
<div class="cq-field"><label class="cq-label" for="f3">Password</label><input id="f3" class="cq-input" type="password" value="12345" aria-invalid="true" aria-describedby="f3e"><p class="cq-error" id="f3e" role="alert">Use at least 8 characters.</p><span class="sc-mono">invalid</span></div>
<div class="cq-field"><label class="cq-label" for="f4">Branch</label><input id="f4" class="cq-input" value="Branch 1" disabled><span class="sc-mono">disabled</span></div>
<div class="cq-field"><label class="cq-label" for="f5">Doctor</label><select id="f5" class="cq-select"><option>Dr Sara</option><option>Dr Bilal</option></select><span class="sc-mono">select</span></div>
<div class="cq-field" style="grid-column: span 2"><label class="cq-label" for="f6">In a sentence or two, what is the actual problem?</label><textarea id="f6" class="cq-textarea" rows="3"></textarea><span class="sc-mono">textarea</span></div>
</div>
<div class="sc-row">
<button class="cq-toggle" role="switch" aria-checked="true" type="button"><span class="cq-toggle-track" aria-hidden="true"><span class="cq-toggle-knob"></span></span><span>Notifications on</span></button>
<button class="cq-toggle" role="switch" aria-checked="false" type="button"><span class="cq-toggle-track" aria-hidden="true"><span class="cq-toggle-knob"></span></span><span>Off</span></button>
<button class="cq-toggle" role="switch" aria-checked="true" type="button" disabled><span class="cq-toggle-track" aria-hidden="true"><span class="cq-toggle-knob"></span></span><span>Disabled</span></button>
<div class="cq-segmented" role="radiogroup" aria-label="Period"><button class="cq-segment" role="radio" aria-checked="true" type="button">Today</button><button class="cq-segment" role="radio" aria-checked="false" type="button">Week</button><button class="cq-segment" role="radio" aria-checked="false" type="button">Month</button></div>
<label class="cq-check"><input type="checkbox" checked><span>Checked</span></label>
<label class="cq-check"><input type="checkbox"><span>Unchecked</span></label>
</div>

<h3 class="sc-h3">Badges, stat tile, loader</h3>
<div class="sc-row"><span class="cq-badge">Neutral</span><span class="cq-badge cq-badge-positive">Ready</span><span class="cq-badge cq-badge-negative">Declined</span><span class="cq-badge cq-badge-attention">Low stock</span><span class="cq-badge cq-badge-info">Pending sync</span><span class="cq-badge cq-badge-accent">New</span></div>
<div class="sc-grid" style="margin-top: var(--space-4)">
<div class="cq-slab cq-stat"><span class="cq-mono" style="color: var(--text-tertiary)">Revenue today</span><span class="cq-numeral cq-stat-value">Rs 184,500</span><span class="cq-tabular cq-stat-delta-up" style="font-size: var(--font-size-body-s)">▲ 12% vs last week</span></div>
<div class="cq-slab cq-stat"><span class="cq-mono" style="color: var(--text-tertiary)">Orders</span><span class="cq-numeral" style="color: var(--text-primary)">412</span><span class="cq-tabular cq-stat-delta-down" style="font-size: var(--font-size-body-s)">▼ 3% vs last week</span></div>
<div class="sc-tile" style="display: flex; gap: var(--space-4); align-items: center"><span class="cq-loader" role="status" aria-label="Loading" style="width: 24px; height: 24px" data-mark></span><span class="cq-loader" role="status" aria-label="Loading" style="width: 48px; height: 48px" data-mark></span><span class="sc-mono">the mark as loader</span></div>
<div class="sc-tile"><div class="cq-skeleton" style="height: 1em; width: 70%"></div><div class="cq-skeleton" style="height: 1em; width: 85%; margin-top: 8px"></div><div class="cq-skeleton cq-skeleton-shimmer" style="height: 1em; width: 55%; margin-top: 8px"></div><span class="sc-mono">skeleton</span></div>
</div>

<h3 class="sc-h3">Table</h3>
<div class="cq-table-wrap"><table class="cq-table"><caption class="cq-sr-only">Open orders</caption><thead><tr><th style="width: 1px"><label class="cq-check"><input type="checkbox" aria-label="Select all"></label></th><th aria-sort="ascending"><button type="button">Order <span aria-hidden="true" style="color: var(--text-secondary)">▲</span></button></th><th>Table</th><th>Items</th><th class="cq-num">Total</th><th>Status</th></tr></thead><tbody>
<tr class="cq-live-row"><td><label class="cq-check"><input type="checkbox" aria-label="Select row"></label></td><td style="font-family: var(--font-mono)">#415</td><td>T9</td><td>Naan × 6</td><td class="cq-num">Rs 600</td><td><span class="cq-badge cq-badge-accent">New</span></td></tr>
<tr aria-selected="true"><td><label class="cq-check"><input type="checkbox" checked aria-label="Select row"></label></td><td style="font-family: var(--font-mono)">#412</td><td>T4</td><td>Karahi +4</td><td class="cq-num">Rs 3,750</td><td><span class="cq-badge cq-badge-positive">Ready</span></td></tr>
<tr><td><label class="cq-check"><input type="checkbox" aria-label="Select row"></label></td><td style="font-family: var(--font-mono)">#413</td><td>D</td><td>Biryani</td><td class="cq-num">Rs 850</td><td><span class="cq-badge cq-badge-info">Pending sync</span></td></tr>
</tbody></table></div>
<div class="sc-grid-2">
<div class="cq-table-wrap"><div class="cq-table-state"><div class="cq-state"><span class="cq-state-mark" data-mark></span><h3 class="cq-state-title">No open orders</h3><p class="cq-state-body">New ones show up here as they come in.</p></div></div></div>
<div class="cq-table-wrap"><div class="cq-table-state"><div class="cq-state cq-state-error" role="alert"><span class="cq-state-mark" data-mark></span><h3 class="cq-state-title">The list did not load</h3><p class="cq-state-body">Lost connection to the kitchen display.</p><button class="cq-btn cq-btn-ghost cq-btn-sm cq-btn-no-ico"><span class="cq-btn-label">Try again</span></button></div></div></div>
</div>

<h3 class="sc-h3">Navigation</h3>
<div class="sc-grid-2">
<aside class="cq-sidebar" style="min-height: 0; border-radius: var(--radius-slab)"><a class="sc-lockup" href="#"><span class="sc-mark" style="width: 22px; height: 22px" data-mark></span><b>CiNQ RMS</b></a><nav aria-label="Main"><div class="cq-sidebar-group"><div class="cq-mono cq-sidebar-kicker">Branch 1</div><a class="cq-sidebar-link" href="#" aria-current="page">Overview</a><a class="cq-sidebar-link" href="#">Orders</a><a class="cq-sidebar-link" href="#">Menu</a><a class="cq-sidebar-link" href="#">Staff</a></div></nav></aside>
<div><ol class="cq-stepper" aria-label="Progress"><li class="cq-step" data-done="true"><span class="cq-step-num" aria-hidden="true">✓</span><span style="font-size: var(--font-size-body-s); font-weight: 500">Branch</span></li><li class="cq-step" aria-current="step"><span class="cq-step-num" aria-hidden="true">2</span><span style="font-size: var(--font-size-body-s); font-weight: 500">Menu</span></li><li class="cq-step"><span class="cq-step-num" aria-hidden="true">3</span><span style="font-size: var(--font-size-body-s); font-weight: 500">Staff</span></li></ol>
<div class="sc-row"><a class="cq-nav-link" href="#" aria-current="page">Work</a><a class="cq-nav-link" href="#">Products</a><a class="cq-nav-link" href="#">Services</a></div>
<nav class="cq-bottomnav cq-glass" aria-label="Main" style="position: relative; height: 64px; border-radius: var(--radius-slab); margin-top: var(--space-6)"><a class="cq-bottomnav-item" href="#" aria-current="page">Home</a><a class="cq-bottomnav-item" href="#">Receipts</a><a class="cq-bottomnav-item" href="#">Money</a><a class="cq-bottomnav-item" href="#">Profile</a></nav></div>
</div>

<h3 class="sc-h3">Overlays</h3>
<div class="sc-row"><button class="cq-btn cq-btn-ghost cq-btn-no-ico" type="button" onclick="document.getElementById('dlg').showModal()"><span class="cq-btn-label">Open a dialog</span></button><button class="cq-btn cq-btn-ghost cq-btn-no-ico" type="button" onclick="document.getElementById('sht').showModal()"><span class="cq-btn-label">Open a sheet</span></button></div>
<dialog id="dlg" class="cq-dialog" aria-labelledby="dlgt"><h2 id="dlgt" class="cq-display cq-dialog-title">Void order 412?</h2><div class="cq-dialog-body">The customer will not be charged. The kitchen ticket is cancelled.</div><div class="cq-dialog-actions"><button class="cq-btn cq-btn-ghost cq-btn-no-ico" type="button" onclick="this.closest('dialog').close()"><span class="cq-btn-label">Keep order</span></button><button class="cq-btn cq-btn-destructive cq-btn-no-ico" type="button" onclick="this.closest('dialog').close()"><span class="cq-btn-label">Void order</span></button></div></dialog>
<dialog id="sht" class="cq-sheet" aria-labelledby="shtt"><div class="cq-sheet-handle" aria-hidden="true"></div><h2 id="shtt" class="cq-display cq-dialog-title" style="font-size: var(--font-size-h3)">Filters</h2><div class="cq-dialog-body"><label class="cq-check"><input type="checkbox" checked><span>Ready</span></label><br><label class="cq-check"><input type="checkbox"><span>New</span></label></div><div class="cq-dialog-actions"><button class="cq-btn cq-btn-primary cq-btn-no-ico" type="button" onclick="this.closest('dialog').close()"><span class="cq-btn-label">Apply</span></button></div></dialog>
<div class="sc-stack"><div class="cq-toast cq-toast-positive" role="status"><span class="cq-toast-ico" aria-hidden="true">✓</span><span>Table 4 cleared</span><button class="cq-toast-action" type="button">Undo</button></div><div class="cq-toast cq-toast-negative" role="alert"><span class="cq-toast-ico" aria-hidden="true">!</span><span>Card declined. Try again or take cash.</span></div><div class="cq-tooltip" style="width: fit-content">Sort by time</div></div>
</section>
`;

/* ── motion-lab.html ───────────────────────────────────────────────────── */
const easings = by("easing.");
const springs = by("spring.");
const durations = by("duration.");
const transitions = by("transition.");
const motions = by("motion.");
function curvePath(bz) {
  const [x1, y1, x2, y2] = bz;
  return `M 0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`;
}
const motionBody = `
<section class="sc-section" id="easings">
<h2>Easings</h2>
<p>The six library curves. Anything else fails <code>motion:check</code>. Press play to run every ball with its curve over <code>--dur-cinematic</code>.</p>
<div class="sc-lab-toggle"><button class="cq-btn cq-btn-primary cq-btn-no-ico" type="button" data-play=".sc-ease"><span class="cq-btn-label">Play all</span></button></div>
${easings.map(([p, t]) => `<div class="sc-ease" style="--e: var(--${cssName(p)})"><div><b style="font-size: var(--font-size-body-s)">${p.split(".")[1]}</b><br><code class="sc-mono" style="text-transform: none">cubic-bezier(${t.$value.join(", ")})</code><br><span style="font-size: var(--font-size-caption); color: var(--text-tertiary)">${desc(t)}</span></div><div class="track"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${curvePath(t.$value)}" fill="none" stroke="var(--line-standard)" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><div class="ball"></div></div></div>`).join("")}
</section>

<section class="sc-section" id="springs">
<h2>Springs</h2>
<p>The five springs as CSS <code>linear()</code> approximations (generated from stiffness, damping and mass). In Motion they are <code>springs.*</code>; in Flutter <code>CinqSpring.*</code>.</p>
<div class="sc-lab-toggle"><button class="cq-btn cq-btn-primary cq-btn-no-ico" type="button" data-play=".sc-spring"><span class="cq-btn-label">Play all</span></button></div>
${springs.map(([p, t]) => `<div class="sc-ease sc-spring" style="--e: var(--${cssName(p)})"><div><b style="font-size: var(--font-size-body-s)">${p.split(".")[1]}</b><br><code class="sc-mono" style="text-transform: none">${t.$value.stiffness} / ${t.$value.damping} / ${t.$value.mass}</code><br><span style="font-size: var(--font-size-caption); color: var(--text-tertiary)">${desc(t)}</span></div><div class="track"><div class="ball"></div></div></div>`).join("")}
</section>

<section class="sc-section" id="durations">
<h2>Durations</h2>
<p>Each bar fills over its token with <code>--ease-out</code>.</p>
<div class="sc-lab-toggle"><button class="cq-btn cq-btn-primary cq-btn-no-ico" type="button" data-play=".sc-dur"><span class="cq-btn-label">Play all</span></button></div>
${durations.map(([p, t]) => `<div class="sc-dur" style="--d: var(--${cssName(p)})"><span class="sc-mono">${p.split(".")[1]}</span><div class="bar"><i></i></div><code class="sc-mono" style="text-transform: none">${t.$value}</code></div>`).join("")}
</section>

<section class="sc-section" id="transitions">
<h2>Transitions</h2>
<p>Named composites (duration, curve, delay). Components cite these by name; <code>.cq-transition-&lt;name&gt;</code> applies one.</p>
<div class="sc-lab-toggle"><button class="cq-btn cq-btn-primary cq-btn-no-ico" type="button" data-play=".sc-tr"><span class="cq-btn-label">Play all</span></button></div>
<div class="sc-grid">${transitions.map(([p, t]) => `<div class="sc-tile sc-tr" style="--tr: var(--${cssName(p)})"><span class="sc-mono">${p.split(".")[1]}</span><div class="sc-tr-box" style="margin-top: var(--space-3); width: 48px; height: 48px; border-radius: var(--radius-control); background: var(--accent-fill); transition: transform var(--tr), opacity var(--tr)"></div><code class="sc-mono" style="text-transform: none; display: block; margin-top: var(--space-2)">${esc(`${t.$value.duration} · ${t.$value.timingFunction} · ${t.$value.delay}`)}</code></div>`).join("")}</div>
<style>.sc-tr.play .sc-tr-box { transform: translateX(120px) rotate(90deg); opacity: 0.6; }</style>
</section>

<section class="sc-section" id="keyframes">
<h2>Keyframe animations</h2>
<p>Every <code>@keyframes</code> in <code>motion.css</code>, generated from <code>motion.*</code>. The reduced-motion button in the mode bar stops all of them.</p>
<div class="sc-grid">${motions.map(([p, t]) => `<div class="sc-tile"><span class="sc-mono">${p.split(".")[1]}</span><div style="margin-top: var(--space-3); height: 64px; display: grid; place-items: center; overflow: hidden">${p.endsWith("mark-chase") || p.endsWith("mark-spin") ? `<span class="cq-loader" style="width: 40px; height: 40px" role="status" aria-label="Loading" data-mark></span>` : p.endsWith("weight-wave") ? `<span style="font-family: var(--font-display); font-size: var(--font-size-display-s); font-weight: 800; font-variation-settings: var(--font-variation-display-tight); " class="cq-anim-weight-wave">CiNQ</span>` : p.endsWith("shimmer") ? `<div class="cq-skeleton cq-skeleton-shimmer" style="width: 100%; height: 16px"></div>` : p.endsWith("pulse") ? `<div class="cq-skeleton" style="width: 100%; height: 16px"></div>` : p.endsWith("live-edge") ? `<div class="cq-live-row" style="width: 100%; height: 40px; background: var(--surface-sunken); border-radius: var(--radius-control); animation-iteration-count: infinite"></div>` : p.endsWith("glow-breathe") ? `<span class="cq-anim-glow-breathe" style="width: 12px; height: 12px; border-radius: var(--radius-pill); background: var(--feedback-success-solid)"></span>` : p.endsWith("marquee") ? `<div style="width: 100%; overflow: hidden"><div class="cq-marquee" style="gap: 24px"><span>Restaurant systems</span><span>Clinic software</span><span>Restaurant systems</span><span>Clinic software</span></div></div>` : p.endsWith("gradient-drift") ? `<div style="width: 100%; height: 64px; position: relative; overflow: hidden; border-radius: var(--radius-control)"><i class="cq-anim-gradient-drift" style="position: absolute; inset: -8%; background: var(--gradient-ambience-accent)"></i></div>` : p.endsWith("menu-in") ? `<div class="cq-anim-menu-in" style="width: 100%; height: 56px; background: var(--surface-raised); border-radius: var(--radius-control); animation-iteration-count: infinite; animation-direction: alternate"></div>` : `<div class="cq-anim-${p.split(".")[1]}" style="width: 48px; height: 48px; border-radius: var(--radius-control); background: var(--accent-fill); animation-iteration-count: infinite; animation-direction: alternate"></div>`}</div><code class="sc-mono" style="text-transform: none; display: block; margin-top: var(--space-2)">${esc(t.$extensions["cinq.animation"].duration)} · ${esc(String(t.$extensions["cinq.animation"].timingFunction))}</code></div>`).join("")}</div>
</section>

<section class="sc-section" id="catalog">
<h2>The transition catalog, live</h2>
<p>Ids from <code>foundations/transitions-and-choreography.md</code>. Each demo uses only generated classes.</p>
<div class="sc-grid-2">
<div class="sc-tile"><span class="sc-mono">T1.2 · button hover</span><div class="sc-row" style="margin-top: var(--space-3)"><button class="cq-btn cq-btn-primary"><span class="cq-btn-label">Hover me</span><span class="cq-btn-ico" aria-hidden="true">↗</span></button></div></div>
<div class="sc-tile"><span class="sc-mono">T1.5 · toggle</span><div class="sc-row" style="margin-top: var(--space-3)"><button class="cq-toggle" role="switch" aria-checked="false" type="button" onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') === 'true' ? 'false' : 'true')"><span class="cq-toggle-track" aria-hidden="true"><span class="cq-toggle-knob"></span></span><span>Tap to toggle</span></button></div></div>
<div class="sc-tile"><span class="sc-mono">T3.1 · dialog</span><div class="sc-row" style="margin-top: var(--space-3)"><button class="cq-btn cq-btn-ghost cq-btn-no-ico" type="button" onclick="document.getElementById('d1').showModal()"><span class="cq-btn-label">Open</span></button></div><dialog id="d1" class="cq-dialog" aria-labelledby="d1t"><h2 id="d1t" class="cq-display cq-dialog-title">Dialog in</h2><div class="cq-dialog-body">opacity 0→1, scale 0.98→1, base, out. Exit is fast, in.</div><div class="cq-dialog-actions"><button class="cq-btn cq-btn-primary cq-btn-no-ico" type="button" onclick="this.closest('dialog').close()"><span class="cq-btn-label">Close</span></button></div></dialog></div>
<div class="sc-tile"><span class="sc-mono">T3.2 · sheet</span><div class="sc-row" style="margin-top: var(--space-3)"><button class="cq-btn cq-btn-ghost cq-btn-no-ico" type="button" onclick="document.getElementById('s1').showModal()"><span class="cq-btn-label">Open</span></button></div><dialog id="s1" class="cq-sheet" aria-labelledby="s1t"><div class="cq-sheet-handle" aria-hidden="true"></div><h2 id="s1t" class="cq-display cq-dialog-title" style="font-size: var(--font-size-h3)">Sheet in</h2><div class="cq-dialog-body">translateY 100%→0, press, emphasized.</div><div class="cq-dialog-actions"><button class="cq-btn cq-btn-primary cq-btn-no-ico" type="button" onclick="this.closest('dialog').close()"><span class="cq-btn-label">Close</span></button></div></dialog></div>
<div class="sc-tile"><span class="sc-mono">T7.1 · masked line reveal</span><div class="cq-mask" style="margin-top: var(--space-3)" data-replay><span class="cq-line t-display-s">Software your business</span><span class="cq-line t-display-s">actually runs on.</span></div><div class="sc-row"><button class="cq-btn cq-btn-ghost cq-btn-sm cq-btn-no-ico" type="button" data-play=".cq-mask"><span class="cq-btn-label">Replay</span></button></div><style>.cq-mask.play > .cq-line { animation-name: cq-rise; }</style></div>
<div class="sc-tile"><span class="sc-mono">T12 · skeleton to content</span><div style="margin-top: var(--space-3); position: relative; min-height: 60px"><div id="sk" style="position: absolute; inset: 0; transition: opacity var(--dur-fast) var(--ease-out)"><div class="cq-skeleton" style="height: 1em; width: 70%"></div><div class="cq-skeleton" style="height: 1em; width: 85%; margin-top: 8px"></div></div><div id="ct" style="opacity: 0; transition: opacity var(--dur-base) var(--ease-out)"><b>Chicken karahi</b><br><span style="color: var(--text-secondary)">2 × Rs 1,600</span></div></div><div class="sc-row"><button class="cq-btn cq-btn-ghost cq-btn-sm cq-btn-no-ico" type="button" onclick="var s=document.getElementById('sk'),c=document.getElementById('ct');s.style.opacity=0;c.style.opacity=1;setTimeout(function(){s.style.opacity=1;c.style.opacity=0},2500)"><span class="cq-btn-label">Load</span></button></div></div>
</div>
</section>
`;

/* ── gradient-lab.html ─────────────────────────────────────────────────── */
const gradients = by("gradient.");
const gradientBody = `
<section class="sc-section" id="catalog">
<h2>The catalog</h2>
<p>Every gradient token, drawn on the surface it is meant for. Switch to light mode: the geometry stays, the base colour re-resolves. All are one colour to transparent except the two OG ribbons.</p>
<div class="sc-grid">${gradients.map(([p, t]) => { const g = t.$extensions["cinq.gradient"]; const name = p.split(".")[1]; const surface = /og-|scrim-hero|glow-cursor|backlight/.test(name) ? "on-canvas" : ""; const style = /dots/.test(name) ? `background-image: var(--gradient-${name}); background-size: 18px 18px; opacity: 0.4` : /shimmer/.test(name) ? `background-image: var(--gradient-${name}); background-size: 200% 100%; animation: cq-shimmer var(--dur-count) linear infinite` : /ring-spotlight/.test(name) ? `--mx: 50%; --my: 50%; background: var(--gradient-${name}); padding: 1px; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; border-radius: var(--radius-slab)` : /sheen/.test(name) ? `--mx: 50%; --my: 50%; background: var(--gradient-${name})` : /glow-cursor/.test(name) ? `background: var(--gradient-${name}); mix-blend-mode: screen` : /live-edge/.test(name) ? `inset: 0 auto 0 0; width: 2px; background: var(--gradient-${name})` : `background: var(--gradient-${name})`; return `<div class="sc-swatch"><div class="sc-grad ${surface}"><i style="${style}"></i></div><b>${name}</b><code>${esc(g.shape)} · ${esc(g.angle ?? g.size ?? "")}${g.at ? " at " + esc(g.at) : ""} · ${esc(g.interp)}</code><code>${desc(t).slice(0, 80)}</code></div>`; }).join("")}</div>
</section>

<section class="sc-section" id="ring">
<h2>Illuminated border and sheen</h2>
<p>Move the pointer. The ring is a 1px mask; the sheen sits behind it. The inverse pair belongs on an accent-washed card.</p>
<div class="sc-grid-2">
<div class="sc-spot"><div class="core"><span class="sc-mono">ring-spotlight + sheen</span></div><i class="ring"></i><i class="sheen"></i></div>
<div class="sc-spot inverse"><div class="core" style="background-image: var(--gradient-wash-accent)"><span class="sc-mono">inverse, over wash-accent</span></div><i class="ring"></i><i class="sheen"></i></div>
</div>
</section>

<section class="sc-section" id="wash">
<h2>The wash and its reverse</h2>
<p>Hover: the accent wash fades out from the top-left while the ink wash comes in from the bottom-right, over <code>--transition-wash</code>.</p>
<div class="sc-grid-2">
<div class="sc-grad" style="height: 200px; position: relative" onmouseenter="this.classList.add('h')" onmouseleave="this.classList.remove('h')"><i style="background: var(--gradient-wash-accent); transition: opacity var(--transition-wash)" class="a"></i><i style="background: var(--gradient-wash-ink-reverse); opacity: 0; transition: opacity var(--transition-wash)" class="b"></i><style>.sc-grad.h .a { opacity: 0 } .sc-grad.h .b { opacity: 1 }</style></div>
<div class="sc-grad on-accent" style="height: 200px; display: grid; place-items: center"><span style="color: var(--text-on-accent); font-family: var(--font-display); font-weight: 700; font-size: var(--font-size-display-s)">A colour block is flat</span></div>
</div>
</section>

<section class="sc-section" id="glows">
<h2>Ambient glows and their cap</h2>
<p>One ambient glow per viewport. Left: allowed (one). Right: the same two cards with two glows, which fails D-017 and reads as noise.</p>
<div class="sc-grid-2">
<div class="sc-tile" style="position: relative; overflow: hidden; min-height: 200px"><i style="position: absolute; inset: 0; background: var(--gradient-ambience-accent)"></i><b style="position: relative">One focal card</b></div>
<div class="sc-tile" style="position: relative; overflow: hidden; min-height: 200px"><i style="position: absolute; inset: 0; background: var(--gradient-ambience-accent)"></i><i style="position: absolute; inset: 0; background: var(--gradient-backlight-accent); transform: scaleX(-1)"></i><b style="position: relative; color: var(--feedback-danger-text)">Two glows (fails)</b></div>
</div>
</section>

<section class="sc-section" id="surfaces">
<h2>Glass, grain, bezel, duotone</h2>
<p>Glass only on fixed chrome (the mode bar on this page is the real thing). The grain layer sits over everything at 0.06 overlay on ink and 0.16 multiply on paper.</p>
<div class="sc-grid-2">
<div class="sc-glass-demo"><div class="behind"><b>Text behind</b></div><div class="pill"><span class="sc-mono" style="color: var(--text-primary)">glass · 55% canvas · blur 20</span></div></div>
<div class="sc-spot"><div class="core"><span class="sc-mono">the double bezel</span><p style="margin-top: var(--space-3)">6px shell at 4%, hairline 8%, core with a 1px top light.</p></div></div>
<div class="sc-grad" style="height: 220px; background: var(--surface-device); border-radius: var(--radius-device); padding: 6px; box-shadow: var(--shadow-device)"><div style="height: 100%; border-radius: var(--radius-device-screen); background: var(--surface-device-screen)"></div></div>
<div class="sc-grad" style="height: 220px; position: relative; overflow: hidden"><i style="background: var(--surface-raised); filter: grayscale(1) contrast(1.08) brightness(0.92)"></i><i style="background: var(--accent-fill); mix-blend-mode: multiply; opacity: var(--opacity-wash-closed)"></i><i style="background: var(--gradient-portrait-fade)"></i><span style="position: absolute; left: var(--space-4); bottom: var(--space-4); font-family: var(--font-display); font-weight: 700; font-size: var(--font-size-h2)">Duotone + portrait fade</span></div>
</div>
</section>

<section class="sc-section" id="data">
<h2>Gradients in data</h2>
<p>Area under series 1 and 2 only; bars flat; a sequential ramp for heatmaps with the value also labelled.</p>
<div class="sc-grid-2">
<div class="sc-tile"><svg viewBox="0 0 320 120" width="100%" aria-label="Revenue by hour, an area chart" role="img"><defs><linearGradient id="a1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--chart-1)" stop-opacity="0.24"/><stop offset="1" stop-color="var(--chart-1)" stop-opacity="0"/></linearGradient></defs><path d="M0 90 L40 70 L80 78 L120 40 L160 48 L200 20 L240 34 L280 26 L320 44 L320 120 L0 120 Z" fill="url(#a1)"/><path d="M0 90 L40 70 L80 78 L120 40 L160 48 L200 20 L240 34 L280 26 L320 44" fill="none" stroke="var(--chart-1)" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="119" x2="320" y2="119" stroke="var(--line-hairline)"/></svg></div>
<div class="sc-tile"><div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px">${[100, 200, 300, 500, 700].map((s, i) => `<div style="height: 48px; border-radius: 6px; background: var(--color-vermilion-${s}); display: grid; place-items: center; font-family: var(--font-mono); font-size: var(--font-size-badge); color: ${i > 2 ? "var(--color-bone-1)" : "var(--color-ink-1)"}">${[12, 34, 56, 78, 91][i]}</div>`).join("")}</div><span class="sc-mono" style="display: block; margin-top: var(--space-2)">sequential ramp, values labelled</span></div>
</div>
</section>
`;

fs.writeFileSync(path.join(ROOT, "showcase/index.html"), page({ title: "The living style guide", kicker: "CiNQ design system · 2.0.0", lead: "Every token and every component in every state, rendered from <code>implementations/variables.css</code>, <code>motion.css</code> and <code>code/react/primitives.css</code>. Use the mode bar for light, high contrast, reduced motion and density. Nothing here needs a network.", body: indexBody, density: true }));
fs.writeFileSync(path.join(ROOT, "showcase/motion-lab.html"), page({ title: "Motion lab", kicker: "CiNQ design system · motion", lead: "Every easing, spring, duration, transition and keyframe animation the system owns, playable. The Reduced motion button in the mode bar applies <code>html[data-motion=\"reduced\"]</code> and everything here stops or becomes a fade, which is what a product must do.", body: motionBody }));
fs.writeFileSync(path.join(ROOT, "showcase/gradient-lab.html"), page({ title: "Gradient lab", kicker: "CiNQ design system · gradients and effects", lead: "Every gradient, glow, illuminated border, wash, grain and glass surface, in both modes. One colour to transparent, always, except the two OG ribbons.", body: gradientBody }));
console.log("showcase: index.html, motion-lab.html, gradient-lab.html written");
