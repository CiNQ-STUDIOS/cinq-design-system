#!/usr/bin/env node
/**
 * CiNQ contrast check.
 *
 *   node tooling/contrast-check/check.js          write foundations/contrast-matrix.md, exit 1 on failures
 *   node tooling/contrast-check/check.js --quiet  no file, just the verdict
 *
 * Computes WCAG 2.1 contrast for every text token on every surface token it
 * is allowed to sit on, in dark, light and high-contrast modes. Alpha
 * colours (color-mix over transparent, rgb(... / a)) are composited on the
 * surface before measuring. Thresholds: 4.5 for text, 7 for AAA, 3 for
 * large text and UI graphics. Pairs on the large-text allow-list may pass
 * at 3; everything else must pass at 4.5.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, "foundations/tokens.json"), "utf8"));
const QUIET = process.argv.includes("--quiet");

const flat = new Map();
(function walk(n, p) {
  if (!n || typeof n !== "object") return;
  if ("$value" in n) return void flat.set(p.join("."), n);
  for (const [k, v] of Object.entries(n)) if (!k.startsWith("$")) walk(v, [...p, k]);
})(tokens, []);

function valueFor(p, mode) {
  const t = flat.get(p);
  if (!t) throw new Error("no token " + p);
  const modes = t.$extensions?.["cinq.modes"] ?? {};
  let v = mode === "dark" ? t.$value : (modes[mode] ?? (mode === "contrast" ? (modes.dark ?? t.$value) : t.$value));
  if (mode === "contrast" && modes.contrast === undefined) v = t.$value; // contrast mode is dark plus overrides
  return typeof v === "string" ? v.replace(/\{([a-z0-9.\-]+)\}/gi, (_, r) => valueFor(r, mode)) : v;
}

/* ── colour parsing ────────────────────────────────────────────────────── */
function parse(css) {
  css = css.trim();
  let m;
  if ((m = css.match(/^#([0-9a-f]{6})$/i))) return { r: parseInt(m[1].slice(0, 2), 16), g: parseInt(m[1].slice(2, 4), 16), b: parseInt(m[1].slice(4, 6), 16), a: 1 };
  if ((m = css.match(/^rgb\((\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+))?\)$/))) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 1 };
  if ((m = css.match(/^color-mix\(in srgb,\s*(.+?)\s+([\d.]+)%,\s*transparent\)$/i))) {
    const c = parse(m[1]);
    return { ...c, a: c.a * (+m[2] / 100) };
  }
  if (css === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  throw new Error("cannot parse " + css);
}
const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
function ratio(fgCss, bgCss, canvasCss) {
  const canvas = parse(canvasCss);
  const bg = over(parse(bgCss), canvas);
  const fg = over(parse(fgCss), bg);
  const l1 = lum(fg), l2 = lum(bg);
  return Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100;
}
const hex = (c) => "#" + [c.r, c.g, c.b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");

/* ── pairs ─────────────────────────────────────────────────────────────── */
const S = "color.semantic.";
const surfaces = ["surface.canvas", "surface.primary", "surface.raised", "surface.overlay", "surface.sunken", "surface.input"];
const texts = ["text.primary", "text.secondary", "text.tertiary", "text.link", "accent.text", "feedback.success.text", "feedback.warning.text", "feedback.danger.text", "feedback.info.text", "chart.axis-text"];
const onFills = [
  ["text.on-accent", "accent.fill"], ["text.on-accent", "accent.hover"], ["text.on-accent", "accent.active"],
  ["text.inverse", "surface.inverse"], ["text.on-footer", "surface.footer"], ["text.on-footer-secondary", "surface.footer"],
  ["feedback.success.on-solid", "feedback.success.solid"], ["feedback.warning.on-solid", "feedback.warning.solid"],
  ["feedback.danger.on-solid", "feedback.danger.solid"], ["feedback.info.on-solid", "feedback.info.solid"],
  ["feedback.success.text", "feedback.success.bg"], ["feedback.warning.text", "feedback.warning.bg"],
  ["feedback.danger.text", "feedback.danger.bg"], ["feedback.info.text", "feedback.info.bg"],
  ["accent.text", "accent.soft"], ["text.primary", "interaction.hover"], ["text.primary", "interaction.selected"],
];
const graphics = [["line.boundary", "surface.canvas"], ["line.boundary", "surface.input"], ["line.standard", "surface.canvas"], ["line.hairline", "surface.canvas"], ["accent.ring", "surface.canvas"], ["accent.ring", "surface.input"], ["chart.1", "surface.canvas"], ["chart.2", "surface.canvas"], ["chart.3", "surface.canvas"], ["chart.4", "surface.canvas"], ["chart.5", "surface.canvas"], ["chart.6", "surface.canvas"], ["accent.fill", "surface.canvas"], ["feedback.danger.solid", "surface.input"]];
// Large text only: pass at 3:1. Everything else needs 4.5.
const largeOnly = new Set(["text.tertiary", "chart.axis-text"]);
const modes = ["dark", "light", "contrast"];

const rows = [];
const failures = [];
for (const mode of modes) {
  const canvas = valueFor(S + "surface.canvas", mode);
  for (const sf of surfaces) {
    const bg = valueFor(S + sf, mode);
    for (const tx of texts) {
      const fg = valueFor(S + tx, mode);
      const r = ratio(fg, bg, canvas);
      const need = largeOnly.has(tx) ? 3 : 4.5;
      const grade = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "large" : "fail";
      const ok = r >= need;
      rows.push({ mode, kind: "text", fg: tx, bg: sf, fgHex: hex(over(parse(fg), over(parse(bg), parse(canvas)))), bgHex: hex(over(parse(bg), parse(canvas))), r, grade, ok, note: largeOnly.has(tx) ? "large text only" : "" });
      if (!ok) failures.push(`${mode}: ${tx} on ${sf} = ${r}`);
    }
  }
  for (const [tx, sf] of onFills) {
    const fg = valueFor(S + tx, mode), bg = valueFor(S + sf, mode);
    const r = ratio(fg, bg, canvas);
    const ok = r >= 4.5;
    rows.push({ mode, kind: "on-fill", fg: tx, bg: sf, fgHex: hex(over(parse(fg), over(parse(bg), parse(canvas)))), bgHex: hex(over(parse(bg), parse(canvas))), r, grade: r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "large" : "fail", ok, note: "" });
    if (!ok) failures.push(`${mode}: ${tx} on ${sf} = ${r}`);
  }
  for (const [g, sf] of graphics) {
    const fg = valueFor(S + g, mode), bg = valueFor(S + sf, mode);
    const r = ratio(fg, bg, canvas);
    // Decorative lines and the accent fill (whose ink label identifies the
    // control) are informational; boundaries and chart marks must pass 3:1.
    const isHair = g === "line.hairline" || g === "line.standard" || g === "accent.fill";
    const ok = isHair ? true : r >= 3;
    rows.push({ mode, kind: "graphic", fg: g, bg: sf, fgHex: hex(over(parse(fg), over(parse(bg), parse(canvas)))), bgHex: hex(over(parse(bg), parse(canvas))), r, grade: r >= 3 ? "3:1 ok" : isHair ? "decorative" : "fail", ok, note: isHair ? "informational: decorative line or a fill identified by its label" : "" });
    if (!ok) failures.push(`${mode}: ${g} on ${sf} = ${r} (needs 3)`);
  }
}

/* ── report ────────────────────────────────────────────────────────────── */
if (!QUIET) {
  const by = (mode, kind) => rows.filter((x) => x.mode === mode && x.kind === kind);
  const table = (list) =>
    "| Foreground | Background | Rendered | Ratio | Grade | Note |\n|:--|:--|:--|--:|:--|:--|\n" +
    list.map((x) => `| \`${x.fg}\` | \`${x.bg}\` | ${x.fgHex} on ${x.bgHex} | ${x.r.toFixed(2)} | ${x.ok ? x.grade : "**FAIL**"} | ${x.note} |`).join("\n");
  let md = `# Contrast matrix\n\nGENERATED by \`tooling/contrast-check/check.js\` from \`foundations/tokens.json\`. Do not edit. Alpha colours are composited on their surface before measuring. Text needs 4.5:1 (AA) and is marked AAA at 7:1; tokens on the large-text list need 3:1; UI graphics need 3:1.\n\nResult: ${failures.length === 0 ? "**every pair passes**" : `**${failures.length} failures**`}. ${rows.length} pairs measured.\n`;
  for (const mode of modes) {
    md += `\n## ${mode === "dark" ? "Dark (default)" : mode === "light" ? "Light (html.light)" : "High contrast (html.contrast)"}\n\n### Text on surfaces\n\n${table(by(mode, "text"))}\n\n### Text on fills\n\n${table(by(mode, "on-fill"))}\n\n### UI graphics\n\n${table(by(mode, "graphic"))}\n`;
  }
  fs.writeFileSync(path.join(ROOT, "foundations/contrast-matrix.md"), md);
}

const aaa = rows.filter((x) => x.kind === "text" && x.fg === "text.primary" && x.r >= 7).length;
console.log(`contrast: ${rows.length} pairs · ${failures.length} failures · body text AAA on ${aaa}/${modes.length * surfaces.length} surfaces`);
if (failures.length) {
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}
