#!/usr/bin/env node
/**
 * Writes the ten archetype reference screens in showcase/archetypes/ from
 * one head/foot template so they always load the same generated CSS. The
 * bodies are authored here by hand; nothing in them is a literal value.
 *
 *   node tooling/showcase/build-archetypes.js
 */
const fs = require("fs");
const path = require("path");
const OUT = path.resolve(__dirname, "../../showcase/archetypes");
fs.mkdirSync(OUT, { recursive: true });

const head = (title, density) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0c0b0a">
<title>${title} · CiNQ archetype</title>
<link rel="icon" href="../mark.svg">
<link rel="stylesheet" href="../../implementations/variables.css">
<link rel="stylesheet" href="../../implementations/motion.css">
<link rel="stylesheet" href="../../code/react/primitives.css">
<link rel="stylesheet" href="../showcase.css">
<link rel="stylesheet" href="shell.css">
<script src="../showcase.js"></script>
</head>
<body${density ? ` data-density="${density}"` : ""} data-density-root>
<a class="cq-sr-only" href="#main">Skip to main</a>
<div class="sc-grain" aria-hidden="true"></div>
`;
const foot = `
<script>CQ.modebar({ home: "../index.html", density: true });</script>
</body>
</html>
`;

const sidebar = (current, product = "CiNQ RMS", items = [["Overview", "executive-dashboard.html"], ["Orders", "data-workspace.html"], ["Floor", "operational-console.html"], ["Menu", "data-workspace.html"], ["Staff", "data-workspace.html"], ["Reports", "executive-dashboard.html"], ["Settings", "settings.html"]]) => `
<aside class="cq-sidebar">
  <a class="sc-lockup" href="../index.html" aria-label="${product} home"><span class="sc-mark" style="width: 22px; height: 22px" data-mark></span><b>${product}</b></a>
  <nav aria-label="Main" style="display: flex; flex-direction: column; gap: var(--gap-lg)">
    <div class="cq-sidebar-group"><div class="cq-mono cq-sidebar-kicker">Branch 1</div>
      ${items.map(([l, h]) => `<a class="cq-sidebar-link" href="${h}"${l === current ? ' aria-current="page"' : ""}>${l}</a>`).join("\n      ")}
    </div>
  </nav>
  <div style="margin-top: auto; display: flex; align-items: center; gap: var(--space-3)"><span class="avatar" aria-hidden="true">H</span><div style="font-size: var(--font-size-body-s)"><b>Hamza</b><br><span style="color: var(--text-secondary)">Owner</span></div></div>
</aside>`;

const appbar = (crumbs, extra = "") => `
<header class="appbar">
  <div class="crumbs" aria-label="Breadcrumb">${crumbs.map((c, i) => (i === crumbs.length - 1 ? `<b>${c}</b>` : `<span>${c}</span><span aria-hidden="true">/</span>`)).join("")}</div>
  <span class="spacer"></span>
  ${extra}
  <div class="search" role="button" tabindex="0" aria-label="Search, Command K"><span aria-hidden="true">⌕</span><span>Search</span><kbd>⌘K</kbd></div>
  <span class="avatar" aria-label="Hamza, account menu" role="button" tabindex="0">H</span>
</header>`;

const btn = (label, v = "primary", extra = "") => `<button class="cq-btn cq-btn-${v} cq-btn-no-ico" type="button" ${extra}><span class="cq-btn-label">${label}</span></button>`;
const badge = (t, tone) => `<span class="cq-badge${tone ? ` cq-badge-${tone}` : ""}">${t}</span>`;
const mono = (t) => `<span style="font-family: var(--font-mono)">${t}</span>`;

const orders = [
  ["#415", "T9", "Naan × 6", "1m", "New", "accent", true],
  ["#414", "D", "Biryani × 2, Raita", "3m", "New", "accent"],
  ["#413", "T2", "Seekh kebab × 4", "6m", "Cooking", "info"],
  ["#412", "T4", "Chicken karahi × 2, Naan × 4, Raita", "12m", "Ready", "positive"],
  ["#411", "T7", "Chai × 3", "14m", "Served", ""],
  ["#410", "D", "Mutton karahi, Naan × 2", "18m", "Cooking", "info"],
  ["#409", "T1", "Paneer karahi", "21m", "Ready", "positive"],
];

/* 1 ── Operational console ─────────────────────────────────────────────── */
const console_ = head("Operational console", "dense") + `
<div class="app no-sidebar">
<div class="content">
<header class="appbar">
  <a class="sc-lockup" href="../index.html" aria-label="CiNQ RMS home"><span class="sc-mark" style="width: 20px; height: 20px" data-mark></span><b>CiNQ RMS</b></a>
  <div class="crumbs"><span>Branch 1</span><span aria-hidden="true">/</span><b>Floor</b></div>
  <span class="live"><i></i>Live · 14:05</span>
  <span class="spacer"></span>
  <div class="search" role="button" tabindex="0" aria-label="Search, Command K"><span aria-hidden="true">⌕</span><span>Order, table or dish</span><kbd>⌘K</kbd></div>
  ${btn("?", "ghost", 'aria-label="Keyboard shortcuts"')}
</header>
<main id="main" class="page" style="max-width: none; display: grid; grid-template-columns: 62fr 38fr; gap: var(--gap); padding: var(--gap)">
  <section class="region" aria-labelledby="qh">
    <div class="region-h"><h2 id="qh">Open orders</h2><span class="cq-mono" style="color: var(--text-tertiary)">18 open · 3 ready · avg 9m</span></div>
    <div class="cq-table-wrap"><table class="cq-table"><caption class="cq-sr-only">Open orders, newest first</caption>
      <thead><tr><th class="cq-sticky">Order</th><th>Table</th><th>Items</th><th class="cq-num">Elapsed</th><th>Status</th></tr></thead>
      <tbody aria-live="polite" aria-relevant="additions">
        ${orders.map(([id, t, items, el, st, tone, live], i) => `<tr${live ? ' class="cq-live-row"' : ""}${i === 3 ? ' aria-selected="true"' : ""} tabindex="0"><td class="cq-sticky">${mono(id)}</td><td>${mono(t)}</td><td>${items}</td><td class="cq-num">${mono(el)}</td><td>${badge(st, tone)}</td></tr>`).join("\n        ")}
      </tbody></table></div>
  </section>
  <aside class="region" aria-labelledby="rh">
    <div class="panel">
      <div class="region-h"><h2 id="rh">${mono("#412")} · Table 4</h2>${badge("Ready", "positive")}</div>
      <ul style="list-style: none; padding: 0; margin: 0; font-size: var(--body-size)">
        <li style="display: flex; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--line-hairline)"><span>2 × Chicken karahi</span>${mono("Rs 3,200")}</li>
        <li style="display: flex; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--line-hairline)"><span>4 × Naan</span>${mono("Rs 400")}</li>
        <li style="display: flex; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--line-hairline)"><span>1 × Raita <small style="color: var(--text-secondary)">no onion</small></span>${mono("Rs 150")}</li>
        <li style="display: flex; justify-content: space-between; padding: var(--space-3) 0; font-weight: var(--font-weight-medium)"><span>Total</span>${mono("Rs 3,750")}</li>
      </ul>
      <div style="display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-4)">
        ${btn("Mark served")}
        <div style="display: flex; gap: var(--space-2)">${btn("Print KOT", "ghost")}${btn("Split", "ghost")}${btn("Void", "ghost", 'class="cq-btn cq-btn-ghost cq-btn-no-ico danger-text"')}</div>
      </div>
    </div>
    <div class="panel" style="margin-top: var(--gap)">
      <span class="cq-mono" style="color: var(--text-tertiary); display: block; margin-bottom: var(--space-3)">Stations</span>
      <div class="kv" style="grid-template-columns: 1fr auto"><dt>Grill</dt><dd>${mono("4 open")}</dd><dt>Tandoor</dt><dd>${mono("2 open")}</dd><dt>Curry</dt><dd>${mono("3 open")}</dd></div>
    </div>
  </aside>
</main>
</div></div>` + foot;

/* 2 ── Executive dashboard ─────────────────────────────────────────────── */
const dashboard = head("Executive dashboard", "compact") + `
<div class="app">
${sidebar("Overview")}
<div class="content">
${appbar(["Branch 1", "Today"], `<div class="cq-segmented" role="radiogroup" aria-label="Period"><button class="cq-segment" role="radio" aria-checked="true" type="button">Today</button><button class="cq-segment" role="radio" aria-checked="false" type="button">Week</button><button class="cq-segment" role="radio" aria-checked="false" type="button">Month</button></div>`)}
<main id="main" class="page">
  <div class="page-header"><div><span class="kicker">Karahi House · Blue Area</span><h1>Today</h1><p>Friday 19 Sep 2026, 14:05. Numbers refresh every 30 seconds.</p></div><div class="actions">${btn("Export report", "ghost")}</div></div>
  <div class="regions">
    <section class="region span-12" aria-label="Key numbers"><div class="stat-row">
      <div class="cq-slab cq-stat"><span class="cq-mono" style="color: var(--text-tertiary)">Revenue</span><span class="cq-numeral cq-stat-value">Rs 184,500</span><span class="cq-tabular cq-stat-delta-up" style="font-size: var(--font-size-body-s)">▲ 12% vs last Friday</span></div>
      <div class="cq-slab cq-stat"><span class="cq-mono" style="color: var(--text-tertiary)">Orders</span><span class="cq-numeral" style="color: var(--text-primary)">412</span><span class="cq-tabular cq-stat-delta-up" style="font-size: var(--font-size-body-s)">▲ 4%</span></div>
      <div class="cq-slab cq-stat"><span class="cq-mono" style="color: var(--text-tertiary)">Average order</span><span class="cq-numeral" style="color: var(--text-primary)">Rs 448</span><span class="cq-tabular cq-stat-delta-down" style="font-size: var(--font-size-body-s)">▼ 2%</span></div>
      <div class="cq-slab cq-stat"><span class="cq-mono" style="color: var(--text-tertiary)">Time to serve</span><span class="cq-numeral" style="color: var(--text-primary)">9m</span><span class="cq-tabular cq-stat-delta-up" style="font-size: var(--font-size-body-s)">▲ 1m faster</span></div>
    </div></section>
    <section class="region span-8 panel" aria-labelledby="ch"><div class="region-h"><h2 id="ch">Revenue by hour</h2><a href="#">See the week →</a></div>
      <div class="chart"><svg viewBox="0 0 800 320" role="img" aria-label="Revenue by hour, peaking at 20:00 with Rs 24,000"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--chart-1)" stop-opacity="0.24"/><stop offset="1" stop-color="var(--chart-1)" stop-opacity="0"/></linearGradient></defs>
        ${[0, 1, 2, 3].map((i) => `<line x1="40" x2="800" y1="${40 + i * 70}" y2="${40 + i * 70}" stroke="var(--chart-grid)"/><text class="axis" x="0" y="${44 + i * 70}">${["24k", "16k", "8k", "0"][i]}</text>`).join("")}
        <path d="M40 250 L110 236 L180 220 L250 190 L320 200 L390 150 L460 120 L530 90 L600 60 L670 80 L740 110 L800 140 L800 250 Z" fill="url(#area)"/>
        <path d="M40 250 L110 236 L180 220 L250 190 L320 200 L390 150 L460 120 L530 90 L600 60 L670 80 L740 110 L800 140" fill="none" stroke="var(--chart-1)" stroke-width="2" stroke-linecap="round"/>
        <circle cx="600" cy="60" r="4" fill="var(--chart-1)" stroke="var(--surface-primary)" stroke-width="2"/>
        <line x1="40" x2="800" y1="250" y2="250" stroke="var(--line-hairline)"/>
        ${["11", "13", "15", "17", "19", "21", "23"].map((h, i) => `<text class="axis" x="${40 + i * 126}" y="275">${h}:00</text>`).join("")}
      </svg></div>
      <table class="cq-sr-only"><caption>Revenue by hour</caption><tr><th>Hour</th><th>Revenue</th></tr><tr><td>20:00</td><td>Rs 24,000</td></tr></table>
    </section>
    <section class="region span-4 panel" aria-labelledby="ti"><div class="region-h"><h2 id="ti">Top items</h2></div>
      <ol style="list-style: none; padding: 0; margin: 0; font-size: var(--body-size)">${[["Chicken karahi", 142], ["Biryani", 118], ["Naan", 96], ["Seekh kebab", 71], ["Chai", 64]].map(([n, c], i) => `<li style="display: flex; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--line-hairline)"><span style="font-family: var(--font-mono); color: var(--text-tertiary); width: 1.5em">${i + 1}</span><span style="flex: 1">${n}</span>${mono(c)}</li>`).join("")}</ol>
    </section>
    <section class="region span-12" aria-labelledby="ro"><div class="region-h"><h2 id="ro">Recent orders</h2><a href="data-workspace.html">See all →</a></div>
      <div class="cq-table-wrap"><table class="cq-table"><thead><tr><th>Order</th><th>Table</th><th>Items</th><th class="cq-num">Total</th><th>Status</th></tr></thead><tbody>
        ${orders.slice(0, 5).map(([id, t, items, , st, tone]) => `<tr><td>${mono(id)}</td><td>${mono(t)}</td><td>${items}</td><td class="cq-num">${mono("Rs " + (Math.floor(Math.random() * 3) + 1) * 850)}</td><td>${badge(st, tone)}</td></tr>`).join("")}
      </tbody></table></div>
    </section>
  </div>
</main></div></div>` + foot;

/* 3 ── Data workspace ──────────────────────────────────────────────────── */
const patients = [["Ayesha Khan", "00412", "19 Sep 2026", "Dr Sara", "Rs 0", "Active", "positive"], ["Bilal Ahmed", "00398", "12 Sep 2026", "Dr Sara", "Rs 4,500", "Due", "attention"], ["Fatima Noor", "00377", "2 Sep 2026", "Dr Bilal", "Rs 0", "Active", "positive"], ["Hassan Raza", "00351", "28 Aug 2026", "Dr Bilal", "Rs 12,000", "Due", "attention"], ["Maryam Ali", "00340", "20 Aug 2026", "Dr Sara", "Rs 0", "Archived", ""], ["Omar Farooq", "00322", "15 Aug 2026", "Dr Sara", "Rs 0", "Active", "positive"]];
const workspace = head("Data workspace", "compact") + `
<div class="app">
${sidebar("Patients", "Dentisto", [["Today", "operational-console.html"], ["Patients", "data-workspace.html"], ["Appointments", "operational-console.html"], ["Treatments", "data-workspace.html"], ["Bills", "data-workspace.html"], ["Reports", "executive-dashboard.html"], ["Settings", "settings.html"]])}
<div class="content">
${appbar(["Clinic", "Patients"])}
<main id="main" class="page">
  <div class="page-header"><div><span class="kicker">812 patients</span><h1>Patients</h1></div><div class="actions">${btn("Import", "ghost")}${btn("New patient")}</div></div>
  <div class="toolbar" role="toolbar" aria-label="Filters">
    <select class="cq-select" aria-label="Saved view" style="width: 160px; min-height: 32px"><option>All patients</option><option>Due balances</option><option>Seen this month</option></select>
    <input class="cq-input" type="search" placeholder="Search name, MRN, phone" aria-label="Search patients" style="width: 260px; min-height: 32px; border-radius: var(--radius-pill)">
    <button class="chip" type="button" aria-pressed="true">Doctor: Dr Sara ✕</button>
    <button class="chip" type="button" aria-pressed="false">Status ▾</button>
    <button class="chip" type="button" aria-pressed="false">Last visit ▾</button>
    <span class="spacer" style="margin-left: auto"></span>
    <button class="chip" type="button" aria-label="Columns">⋯</button>
  </div>
  <div class="cq-table-wrap">
    <table class="cq-table"><caption class="cq-sr-only">Patients</caption>
      <thead><tr><th style="width: 1px"><label class="cq-check"><input type="checkbox" aria-label="Select all"></label></th><th aria-sort="ascending"><button type="button">Name <span aria-hidden="true" style="color: var(--text-secondary)">▲</span></button></th><th>MRN</th><th>Last visit</th><th>Doctor</th><th class="cq-num">Balance</th><th>Status</th></tr></thead>
      <tbody>${patients.map(([n, m, d, doc, b, s, tone], i) => `<tr${i === 1 ? ' aria-selected="true"' : ""}><td><label class="cq-check"><input type="checkbox"${i === 1 ? " checked" : ""} aria-label="Select ${n}"></label></td><td><a href="detail-record.html" style="text-decoration: none; font-weight: var(--font-weight-medium)">${n}</a></td><td>${mono(m)}</td><td>${mono(d)}</td><td>${doc}</td><td class="cq-num${b !== "Rs 0" ? " danger-text" : ""}">${mono(b)}</td><td>${badge(s, tone)}</td></tr>`).join("")}</tbody>
    </table>
    <div class="bulkbar"><b>1 selected</b>${btn("Message", "ghost", 'class="cq-btn cq-btn-ghost cq-btn-sm cq-btn-no-ico"')}${btn("Export", "ghost", 'class="cq-btn cq-btn-ghost cq-btn-sm cq-btn-no-ico"')}${btn("Archive", "ghost", 'class="cq-btn cq-btn-ghost cq-btn-sm cq-btn-no-ico danger-text"')}<span class="spacer">1–50 of 812</span></div>
  </div>
</main></div></div>` + foot;

/* 4 ── Setup / onboarding ──────────────────────────────────────────────── */
const setup = head("Setup", "") + `
<div class="app no-sidebar"><div class="content">
<header class="appbar"><a class="sc-lockup" href="../index.html" aria-label="CiNQ RMS"><span class="sc-mark" style="width: 20px; height: 20px" data-mark></span><b>CiNQ RMS</b></a><span class="spacer"></span>${btn("Save & exit", "ghost")}</header>
<main id="main" class="page" style="padding-top: var(--space-12)">
  <ol class="cq-stepper" aria-label="Progress" style="justify-content: center; margin-bottom: var(--space-10)">
    ${["Business", "Branch", "Menu", "Staff", "Till", "Review"].map((s, i) => `<li class="cq-step"${i === 1 ? ' aria-current="step"' : i < 1 ? ' data-done="true"' : ""}><span class="cq-step-num" aria-hidden="true">${i < 1 ? "✓" : i + 1}</span><span style="font-size: var(--font-size-body-s); font-weight: 500">${s}</span></li>`).join("")}
  </ol>
  <form class="form-col panel" style="padding: var(--space-8)" onsubmit="return false">
    <h1 class="t-h1" style="font-family: var(--font-display); font-weight: 700; font-size: var(--font-size-h1); letter-spacing: var(--tracking-display); line-height: var(--leading-tight)">Set up Branch 1</h1>
    <p style="color: var(--text-secondary); margin-top: var(--space-2); margin-bottom: var(--space-8)">Where it is and when it opens. You can add more branches later.</p>
    <div class="fields">
      <div class="cq-field"><label class="cq-label" for="bn">Branch name</label><input id="bn" class="cq-input" value="Branch 1"></div>
      <div class="cq-field"><label class="cq-label" for="ad">Address</label><textarea id="ad" class="cq-textarea" rows="2">Shop 4, Blue Area, Islamabad</textarea></div>
      <div class="cq-field"><label class="cq-label" for="ph">Phone</label><input id="ph" class="cq-input" inputmode="tel" value="+92 320 2929511"><p class="cq-help">Printed on receipts.</p></div>
      <div class="cq-field"><label class="cq-label">Opening hours</label><div style="display: flex; gap: var(--space-3); align-items: center"><input class="cq-input" value="11:00" aria-label="Opens at" style="width: 120px"><span style="color: var(--text-tertiary)">to</span><input class="cq-input" value="23:00" aria-label="Closes at" style="width: 120px"></div></div>
      <div class="cq-field"><label class="cq-label" for="tz">Time zone</label><select id="tz" class="cq-select"><option>Asia/Karachi (PKT)</option></select></div>
    </div>
    <div class="form-actions">${btn("Back", "ghost")}${btn("Continue")}</div>
  </form>
</main></div></div>` + foot;

/* 5 ── Detail / record ─────────────────────────────────────────────────── */
const detail = head("Detail record", "") + `
<div class="app">
${sidebar("Orders")}
<div class="content">
${appbar(["Orders", "#412"])}
<main id="main" class="page">
  <div class="page-header"><div><span class="kicker">Order · Table 4 · 14:05 · Hamza</span><h1>${mono("#412")} Chicken karahi and more</h1><p style="display: flex; gap: var(--space-2); align-items: center">${badge("Ready", "positive")}<span>Placed 12 minutes ago</span></p></div><div class="actions">${btn("Void", "ghost", 'class="cq-btn cq-btn-ghost cq-btn-no-ico danger-text"')}${btn("Print receipt", "ghost")}${btn("Mark served")}</div></div>
  <div class="regions">
    <section class="region span-7 panel" aria-labelledby="it"><div class="region-h"><h2 id="it">Items</h2><span class="cq-mono" style="color: var(--text-tertiary)">3 lines</span></div>
      <table class="cq-table" style="font-size: var(--body-size)"><thead><tr><th>Item</th><th class="cq-num">Qty</th><th class="cq-num">Unit</th><th class="cq-num">Amount</th></tr></thead><tbody>
        <tr><td>Chicken karahi</td><td class="cq-num">2</td><td class="cq-num">${mono("1,600")}</td><td class="cq-num">${mono("3,200")}</td></tr>
        <tr><td>Naan</td><td class="cq-num">4</td><td class="cq-num">${mono("100")}</td><td class="cq-num">${mono("400")}</td></tr>
        <tr><td>Raita <small style="color: var(--text-secondary)">no onion</small></td><td class="cq-num">1</td><td class="cq-num">${mono("150")}</td><td class="cq-num">${mono("150")}</td></tr>
      </tbody><tfoot><tr><td colspan="3" style="font-weight: var(--font-weight-medium)">Total</td><td class="cq-num" style="font-weight: var(--font-weight-medium)">${mono("Rs 3,750")}</td></tr></tfoot></table>
    </section>
    <aside class="region span-5 panel" aria-label="Details">
      <span class="cq-mono" style="color: var(--text-tertiary); display: block; margin-bottom: var(--space-3)">Customer</span>
      <dl class="kv"><dt>Name</dt><dd>Ayesha Khan</dd><dt>Phone</dt><dd>${mono("+92 300 1234567")}</dd><dt>Visits</dt><dd>${mono("14")}</dd></dl>
      <div class="kv-group"><span class="cq-mono">Payment</span><dl class="kv"><dt>Method</dt><dd>Cash</dd><dt>Paid</dt><dd>${mono("Rs 3,750")} ✓</dd></dl></div>
      <div class="kv-group"><span class="cq-mono">Timeline</span><ol class="timeline">
        <li><i></i><div>Marked ready by Kitchen<time>14:17</time></div></li>
        <li><i></i><div>Sent to Grill and Tandoor<time>14:06</time></div></li>
        <li><i></i><div>Placed by Hamza at Table 4<time>14:05</time></div></li>
      </ol></div>
    </aside>
  </div>
</main></div></div>` + foot;

/* 6 ── Mobile utility ──────────────────────────────────────────────────── */
const mobile = head("Mobile utility", "") + `
<main id="main" style="min-height: 100dvh; display: grid; place-items: start center; padding: 0 var(--space-4)">
<div class="phone" role="region" aria-label="Qeemat, a phone">
<div class="screen">
  <div class="topbar"><span>Qeemat</span><span class="live"><i></i>Synced</span></div>
  <div class="body">
    <div class="summary"><span class="cq-mono" style="color: var(--text-tertiary); position: relative">Across all accounts</span><div class="cq-numeral" style="color: var(--accent-fill); position: relative; margin-top: var(--space-2)">Rs 100,000</div><div style="position: relative; display: flex; gap: var(--space-4); margin-top: var(--space-3); font-size: var(--font-size-body-s); color: var(--text-secondary)"><span>Income <b style="color: var(--text-primary)">${mono("Rs 100,000")}</b></span><span>Spent <b style="color: var(--text-primary)">${mono("Rs 5,350")}</b></span></div></div>
    <span class="cq-mono" style="color: var(--text-tertiary); display: block; margin: var(--space-4) 0 var(--space-2)">Today</span>
    ${[["🏦", "Salary", "HBL · bank alert", "+Rs 100,000"], ["⛽", "Fuel", "PSO · receipt", "−Rs 4,500"], ["🚗", "Careem", "SMS alert", "−Rs 850"]].map(([ic, n, s, v]) => `<div class="row"><span class="ic" aria-hidden="true">${ic}</span><div class="t"><b>${n}</b><small>${s}</small></div><span class="v${v.startsWith("−") ? " danger-text" : ""}">${mono(v)}</span></div>`).join("")}
    <span class="cq-mono" style="color: var(--text-tertiary); display: block; margin: var(--space-4) 0var(--space-2)">Yesterday</span>
    ${[["🛒", "Groceries", "Imtiaz · receipt", "−Rs 6,200"], ["☕", "Chai", "Cash", "−Rs 300"]].map(([ic, n, s, v]) => `<div class="row"><span class="ic" aria-hidden="true">${ic}</span><div class="t"><b>${n}</b><small>${s}</small></div><span class="v danger-text">${mono(v)}</span></div>`).join("")}
  </div>
  <button class="fab" type="button" aria-label="Add an entry">+</button>
  <nav class="cq-bottomnav cq-glass" aria-label="Main"><a class="cq-bottomnav-item" href="#" aria-current="page"><span aria-hidden="true">●</span>Home</a><a class="cq-bottomnav-item" href="#"><span aria-hidden="true">▤</span>Receipts</a><a class="cq-bottomnav-item" href="#"><span aria-hidden="true">◔</span>Money</a><a class="cq-bottomnav-item" href="#"><span aria-hidden="true">◯</span>Profile</a></nav>
</div></div>
</main>` + foot;

/* 7 ── Tablet / kiosk / POS ────────────────────────────────────────────── */
const till = head("Till", "touch") + `
<main id="main" class="till" data-input="touch">
  <section class="menu" aria-label="Menu">
    <div class="cats" role="tablist"><button class="chip" role="tab" aria-selected="true" aria-pressed="true" type="button">Karahi</button><button class="chip" role="tab" type="button">BBQ</button><button class="chip" role="tab" type="button">Rice</button><button class="chip" role="tab" type="button">Bread</button><button class="chip" role="tab" type="button">Drinks</button></div>
    <div class="dishes">${[["Chicken karahi", "Rs 1,600"], ["Mutton karahi", "Rs 2,200"], ["Paneer karahi", "Rs 1,200"], ["Chicken white karahi", "Rs 1,700"], ["Half chicken karahi", "Rs 900"], ["Half mutton karahi", "Rs 1,200"], ["Kofta karahi", "Rs 1,400"], ["Daal", "Rs 400"]].map(([n, p]) => `<button class="dish" type="button"><b>${n}</b><span>${p}</span></button>`).join("")}</div>
  </section>
  <aside class="order" aria-label="Order">
    <div class="region-h"><h2 style="font-size: var(--font-size-h3); font-weight: 500">Table 4</h2>${badge("Dine in")}</div>
    <div class="ticket">
      <div class="row"><span>Chicken karahi</span><div class="cq-segmented" style="padding: 2px"><button class="cq-segment" type="button" aria-label="Fewer">−</button><span class="cq-segment" aria-checked="true" role="status" style="min-width: 36px; text-align: center">2</span><button class="cq-segment" type="button" aria-label="More">+</button></div>${mono("3,200")}</div>
      <div class="row"><span>Naan</span><div class="cq-segmented" style="padding: 2px"><button class="cq-segment" type="button" aria-label="Fewer">−</button><span class="cq-segment" aria-checked="true" style="min-width: 36px; text-align: center">4</span><button class="cq-segment" type="button" aria-label="More">+</button></div>${mono("400")}</div>
      <div class="row"><span>Raita</span><div class="cq-segmented" style="padding: 2px"><button class="cq-segment" type="button" aria-label="Fewer">−</button><span class="cq-segment" aria-checked="true" style="min-width: 36px; text-align: center">1</span><button class="cq-segment" type="button" aria-label="More">+</button></div>${mono("150")}</div>
    </div>
    <div class="total"><span style="color: var(--text-secondary)">Total</span><b>Rs 3,750</b></div>
    <div class="actions">${btn("Send to kitchen")}<div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3)">${btn("Pay", "ghost")}${btn("Hold", "ghost")}</div></div>
  </aside>
</main>` + foot;

/* 8 ── Settings ────────────────────────────────────────────────────────── */
const settings = head("Settings", "") + `
<div class="app">
${sidebar("Settings")}
<div class="content">
${appbar(["Settings", "Roles and permissions"])}
<main id="main" class="page">
  <div class="regions">
    <nav class="region span-4 setting-nav" aria-label="Settings sections">${["Profile", "Branch", "Roles and permissions", "Billing", "Integrations", "API keys", "Notifications", "Appearance"].map((s) => `<a href="#"${s.startsWith("Roles") ? ' aria-current="page"' : ""}>${s}</a>`).join("")}</nav>
    <div class="region span-8">
      <div class="group"><h2>Roles and permissions</h2><p>Who can do what at Branch 1. Changes apply the next time each person signs in.</p>
        <div class="cq-table-wrap"><table class="cq-table"><thead><tr><th>Role</th><th>Can</th><th class="cq-num">People</th></tr></thead><tbody>
          ${[["Owner", "Everything, billing, roles", 1], ["Manager", "Orders, menu, staff, reports, prices", 2], ["Waiter", "Orders on the floor, tables", 6], ["Cashier", "Till, payments, refunds under Rs 5,000", 2], ["Kitchen", "Order statuses", 3]].map(([r, c, n]) => `<tr><td style="font-weight: 500">${r}</td><td style="color: var(--text-secondary)">${c}</td><td class="cq-num">${mono(n)}</td></tr>`).join("")}
        </tbody></table></div>
      </div>
      <div class="group"><h2>Refund limit</h2><p>Refunds above this need a manager's PIN.</p>
        <div class="fields" style="max-width: 320px"><div class="cq-field"><label class="cq-label" for="rl">Cashier refund limit</label><input id="rl" class="cq-input" inputmode="decimal" value="Rs 5,000"></div></div>
      </div>
      <div class="group"><h2>Appearance</h2><p>Per person; these are your own.</p>
        <div class="fields">
          <button class="cq-toggle" role="switch" aria-checked="false" type="button"><span class="cq-toggle-track" aria-hidden="true"><span class="cq-toggle-knob"></span></span><span>Light mode</span></button>
          <button class="cq-toggle" role="switch" aria-checked="false" type="button"><span class="cq-toggle-track" aria-hidden="true"><span class="cq-toggle-knob"></span></span><span>High contrast</span></button>
          <div class="cq-field"><label class="cq-label">Motion</label><div class="cq-segmented" role="radiogroup" aria-label="Motion"><button class="cq-segment" role="radio" aria-checked="true" type="button">System</button><button class="cq-segment" role="radio" aria-checked="false" type="button">Full</button><button class="cq-segment" role="radio" aria-checked="false" type="button">Reduced</button></div></div>
        </div>
      </div>
      <div class="group"><h2 class="danger-text">Danger</h2><p>These cannot be undone.</p>
        <div style="display: flex; gap: var(--space-3)">${btn("Archive Branch 1", "ghost", 'class="cq-btn cq-btn-ghost cq-btn-no-ico danger-text"')}${btn("Delete Branch 1", "destructive")}</div>
      </div>
      <div style="position: sticky; bottom: 0; padding: var(--space-4) 0; margin-top: var(--space-8); background: var(--surface-canvas); border-top: 1px solid var(--line-hairline); display: flex; justify-content: flex-end; gap: var(--space-2)">${btn("Discard", "ghost")}${btn("Save")}</div>
    </div>
  </div>
</main></div></div>` + foot;

/* 9 ── Auth / entry ────────────────────────────────────────────────────── */
const auth = head("Sign in", "") + `
<main id="main" class="centered">
  <form class="auth-panel" onsubmit="return false">
    <div class="auth-brand"><span class="sc-mark" data-mark></span><span>CiNQ RMS</span></div>
    <h1 style="font-family: var(--font-display); font-weight: 700; font-size: var(--font-size-h2); letter-spacing: var(--tracking-display); line-height: var(--leading-tight); margin-bottom: var(--space-6)">Sign in</h1>
    <div class="fields">
      <div class="cq-field"><label class="cq-label" for="em">Email or phone</label><input id="em" class="cq-input" autocomplete="username" inputmode="email"></div>
      <div class="cq-field"><label class="cq-label" for="pw">Password</label><input id="pw" class="cq-input" type="password" autocomplete="current-password" aria-invalid="true" aria-describedby="pwe" value="········"><p class="cq-error" id="pwe" role="alert">That password is not right. Try again or reset it.</p></div>
    </div>
    <div style="margin-top: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4)">${btn("Continue")}<a href="#" style="font-size: var(--font-size-body-s); color: var(--accent-text); text-align: center; text-decoration: none">Forgot password?</a></div>
  </form>
  <p class="cq-mono" style="position: fixed; bottom: var(--space-6); left: 0; right: 0; text-align: center; color: var(--text-tertiary)">Branch 1 · Islamabad</p>
</main>` + foot;

/* 10 ── RMS after: the case study's "after" screen (console + touch) ───── */
const rmsAfter = head("RMS after", "dense") + `
<div class="app no-sidebar"><div class="content">
<header class="appbar">
  <a class="sc-lockup" href="../index.html" aria-label="CiNQ RMS home"><span class="sc-mark" style="width: 20px; height: 20px" data-mark></span><b>CiNQ RMS</b></a>
  <div class="crumbs"><span>Branch 1</span><span aria-hidden="true">/</span><b>Orders and inventory</b></div>
  <span class="live"><i></i>Live · 14:05</span>
  <span class="spacer"></span>
  <div class="banner banner-warning" style="margin: 0; padding: var(--space-1) var(--space-3)"><span>Low stock: naan dough for ~40 more.</span><a href="#">Receive stock</a></div>
  <div class="search" role="button" tabindex="0" aria-label="Search, Command K"><span aria-hidden="true">⌕</span><span>Order, table or dish</span><kbd>⌘K</kbd></div>
</header>
<main id="main" class="page" style="max-width: none; display: grid; grid-template-columns: 62fr 38fr; gap: var(--gap); padding: var(--gap)">
  <section class="region" aria-labelledby="q2">
    <div class="region-h"><h2 id="q2">Order queue</h2><div class="cq-segmented" role="radiogroup" aria-label="Station"><button class="cq-segment" role="radio" aria-checked="true" type="button">All</button><button class="cq-segment" role="radio" aria-checked="false" type="button">Grill</button><button class="cq-segment" role="radio" aria-checked="false" type="button">Tandoor</button><button class="cq-segment" role="radio" aria-checked="false" type="button">Curry</button></div></div>
    <div class="cq-table-wrap"><table class="cq-table"><caption class="cq-sr-only">Order queue</caption>
      <thead><tr><th class="cq-sticky">Order</th><th>Table</th><th>Items</th><th>Station</th><th class="cq-num">Elapsed</th><th>Status</th></tr></thead>
      <tbody aria-live="polite">${orders.map(([id, t, items, el, st, tone, live], i) => `<tr${live ? ' class="cq-live-row"' : ""}${i === 3 ? ' aria-selected="true"' : ""} tabindex="0"><td class="cq-sticky">${mono(id)}</td><td>${mono(t)}</td><td>${items}</td><td>${["Tandoor", "Curry", "Grill", "Curry", "Bar", "Curry", "Curry"][i]}</td><td class="cq-num${el.replace("m", "") > 15 ? " danger-text" : ""}">${mono(el)}</td><td>${badge(st, tone)}</td></tr>`).join("")}</tbody>
    </table></div>
    <div class="region-h" style="margin-top: var(--gap-lg)"><h2>Inventory, today</h2><a href="data-workspace.html">All items →</a></div>
    <div class="cq-table-wrap"><table class="cq-table"><thead><tr><th>Item</th><th class="cq-num">On hand</th><th class="cq-num">Par</th><th>State</th></tr></thead><tbody>
      ${[["Naan dough", "40 pcs", "200 pcs", "Low", "attention"], ["Chicken", "18 kg", "20 kg", "OK", "positive"], ["Mutton", "6 kg", "10 kg", "Low", "attention"], ["Rice", "45 kg", "30 kg", "OK", "positive"], ["Cooking oil", "12 L", "15 L", "OK", "positive"]].map(([n, h, p, s, tone]) => `<tr><td>${n}</td><td class="cq-num">${mono(h)}</td><td class="cq-num">${mono(p)}</td><td>${badge(s, tone)}</td></tr>`).join("")}
    </tbody></table></div>
  </section>
  <aside class="region" aria-label="Selected order">
    <div class="panel">
      <div class="region-h"><h2>${mono("#412")} · Table 4</h2>${badge("Ready", "positive")}</div>
      <ul class="op-card" style="box-shadow: none; padding: 0; background: transparent"><li><b>2 ×</b> Chicken karahi</li><li><b>4 ×</b> Naan</li><li><b>1 ×</b> Raita <span style="color: var(--text-secondary)">no onion</span></li></ul>
      <div style="display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-4)">${btn("Mark served")}<div style="display: flex; gap: var(--space-2)">${btn("Print KOT", "ghost")}${btn("Receipt", "ghost")}${btn("Void", "ghost", 'class="cq-btn cq-btn-ghost cq-btn-no-ico danger-text"')}</div></div>
    </div>
    <div class="panel" style="margin-top: var(--gap)"><span class="cq-mono" style="color: var(--text-tertiary); display: block; margin-bottom: var(--space-3)">Shortcuts</span>
      <dl class="kv" style="grid-template-columns: auto 1fr">${[["↑ ↓", "Move"], ["↵", "Open"], ["S", "Served"], ["K", "Print KOT"], ["N", "New order"], ["?", "All shortcuts"]].map(([k, a]) => `<dt><kbd style="font-family: var(--font-mono); font-size: var(--font-size-caption); padding: 2px 6px; border-radius: var(--radius-check); background: var(--surface-raised)">${k}</kbd></dt><dd>${a}</dd>`).join("")}</dl>
    </div>
  </aside>
</main></div></div>` + foot;

const pages = { "operational-console.html": console_, "executive-dashboard.html": dashboard, "data-workspace.html": workspace, "setup-onboarding.html": setup, "detail-record.html": detail, "mobile-utility.html": mobile, "tablet-kiosk-pos.html": till, "settings.html": settings, "auth-entry.html": auth, "rms-after.html": rmsAfter };
for (const [name, html] of Object.entries(pages)) fs.writeFileSync(path.join(OUT, name), html);
console.log(`archetypes: ${Object.keys(pages).length} screens written`);
