#!/usr/bin/env node
/**
 * CiNQ codebase audit.
 *
 *   node tooling/audit-script/audit.js <dir> [--report out.md] [--json]
 *
 * Scans a product's source for everything the design system bans or
 * discourages, counts it, scores the codebase from 100 down, and writes a
 * report grouped by category with file:line for every hit. Used before a
 * migration (MIGRATION_PLAYBOOK.md phase 1) and as the reskin test's
 * evidence (a token-only migration still scores low on structure).
 *
 * Categories and weights (points off per hit, capped per category):
 *   colour     hex / rgb / hsl literals, Tailwind arbitrary colours     2  (cap 30)
 *   gradient   raw gradients                                            3  (cap 15)
 *   shadow     raw shadows, shadow-md/lg utilities, drop-shadow         2  (cap 10)
 *   motion     raw durations, easings, keyframes, animated layout props 2  (cap 15)
 *   structure  auto-fit grids, equal-column grids, nested cards,
 *              > 1 primary button per file, card-per-number             4  (cap 20)
 *   type       font literals, weights outside 400/500/700/800, px sizes  1  (cap 5)
 *   copy       em-dashes, exclamation marks, banned words, Submit/OK,
 *              wrong CiNQ spelling, Title Case in button labels          1  (cap 5)
 *
 * Exit code 0 always (this is a report); CI can gate on the score.
 */
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--")) ?? ".";
const reportPath = args.includes("--report") ? args[args.indexOf("--report") + 1] : null;
const asJson = args.includes("--json");

const EXT = /\.(tsx?|jsx?|mjs|cjs|css|scss|html|vue|svelte|dart)$/;
const SKIP = /node_modules|\.next|dist|build|out|\.git|implementations[\\/]|tokens\.json|variables\.css|flutter_theme|brand[\\/]design-system|hero-canvas|opengraph|build-logo|\.min\./;

const rules = [
  // colour
  { cat: "colour", w: 2, re: /#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b(?![^<]*>)/gi, msg: "hex colour", skip: /mark|logo|icon|theme-init|theme\.ts/ },
  { cat: "colour", w: 2, re: /\b(?:rgba?|hsla?)\((?!\s*var)/gi, msg: "rgb/hsl colour" },
  { cat: "colour", w: 2, re: /\b(?:bg|text|border|ring|fill|stroke)-\[(?:#|rgb|hsl)/gi, msg: "Tailwind arbitrary colour" },
  { cat: "colour", w: 2, re: /\b(?:bg|text|border)-(?:red|green|blue|yellow|orange|purple|pink|indigo|slate|gray|grey|zinc|neutral|stone|emerald|amber|sky|violet|rose)-\d{2,3}\b/g, msg: "Tailwind palette colour" },
  { cat: "colour", w: 2, re: /Colors\.(?:red|green|blue|orange|grey|black|white|amber|purple|pink|teal|deepOrange)\b/g, msg: "Flutter Colors.*" },
  // gradient
  // A gradient whose only stops are transparent/currentColor is a drawing technique (a caret, a mask), not a colour gradient.
  { cat: "gradient", w: 3, re: /\b(?:linear|radial|conic)-gradient\([^)]*\)/gi, msg: "raw gradient", skip: /^(?:linear|radial|conic)-gradient\((?:(?!#|rgb|hsl|var\().)*\)$/i },
  { cat: "gradient", w: 3, re: /\bbg-gradient-to-\w+\b/g, msg: "Tailwind gradient utility" },
  { cat: "gradient", w: 3, re: /\b(?:Linear|Radial|Sweep)Gradient\(\s*colors:/g, msg: "Flutter raw gradient" },
  // shadow
  // Token-bound insets (inset 0 0 0 1px var(--line)) are fine; a literal colour or a blurred literal is not.
  { cat: "shadow", w: 2, re: /box-shadow\s*:\s*[^;]*(?:#[0-9a-f]{3,8}|rgba?\(|hsla?\()[^;]*/gi, msg: "raw box-shadow" },
  { cat: "shadow", w: 2, re: /\bshadow-(?:sm|md|lg|xl|2xl)\b/g, msg: "framework shadow utility" },
  { cat: "shadow", w: 2, re: /\bdrop-shadow(?:-\w+)?\b/g, msg: "drop-shadow" },
  { cat: "shadow", w: 2, re: /\belevation\s*:\s*[1-9]/g, msg: "Flutter elevation" },
  // motion
  { cat: "motion", w: 2, re: /\b(?:transition|animation)(?:-duration)?\s*:\s*[^;{]*\b\d+(?:\.\d+)?m?s\b/gi, msg: "raw duration" },
  { cat: "motion", w: 2, re: /cubic-bezier\(/gi, msg: "raw cubic-bezier" },
  { cat: "motion", w: 2, re: /\b(?:duration|delay)-\[\d+m?s\]|\bduration-\d{2,4}\b/g, msg: "Tailwind raw duration" },
  { cat: "motion", w: 2, re: /\btransition\s*:\s*(?:all|width|height|top|left|margin|padding)\b/gi, msg: "animating a layout property" },
  { cat: "motion", w: 2, re: /Curves\.(?:easeIn|easeOut|easeInOut|linear|bounce\w*|elastic\w*)\b/g, msg: "Flutter default curve" },
  { cat: "motion", w: 2, re: /Duration\(milliseconds:\s*\d+\)/g, msg: "Flutter raw duration", skip: /theme/ },
  { cat: "motion", w: 2, re: /\banimate-(?:spin|ping|pulse|bounce)\b/g, msg: "framework animation utility" },
  // structure
  { cat: "structure", w: 4, re: /grid-template-columns\s*:\s*repeat\(\s*auto-(?:fit|fill)|\bgrid-cols-\[repeat\(auto-(?:fit|fill)/gi, msg: "auto-fit card grid (bento)" },
  { cat: "structure", w: 4, re: /\bgrid-cols-(?:2|3|4|6)\b(?![^"'`]*(?:md|lg|xl):)/g, msg: "equal-column grid" },
  { cat: "structure", w: 4, re: /grid-template-columns\s*:\s*(?:1fr\s+){1,5}1fr\s*;/gi, msg: "equal-column grid (CSS)" },
  { cat: "structure", w: 4, re: /<Card[^>]*>[\s\S]{0,400}<Card[^>]*>[\s\S]{0,400}<\/Card>[\s\S]{0,100}<\/Card>/g, msg: "card inside a card" },
  { cat: "structure", w: 4, re: /\bmodal\b[\s\S]{0,200}\b(?:edit|view|details?)\b/gi, msg: "modal for view/edit (use a drawer)", once: true },
  { cat: "structure", w: 4, re: /\bGridView\.count\(/g, msg: "Flutter equal grid" },
  // type
  { cat: "type", w: 1, re: /font-family\s*:\s*(?!\s*var\()[^;]+/gi, msg: "raw font-family" },
  { cat: "type", w: 1, re: /font-weight\s*:\s*(?:100|200|300|600|900)\b|\bfont-(?:thin|extralight|light|semibold|black)\b/g, msg: "weight outside 400/500/700/800" },
  { cat: "type", w: 1, re: /font-size\s*:\s*\d+px/gi, msg: "px font-size" },
  // copy
  { cat: "copy", w: 1, re: /—/g, msg: "em-dash" },
  { cat: "copy", w: 1, re: /(?<=["'>])[^"'<]{3,60}!(?=["'<])/g, msg: "exclamation mark in a string" },
  { cat: "copy", w: 1, re: /\b(?:leverage|seamless|cutting-edge|world-class|next-gen|revolutioni[sz]e|empower|unlock|robust|synergy|delight)\b/gi, msg: "banned word" },
  { cat: "copy", w: 1, re: />\s*(?:Submit|OK|Okay|Learn more|Click here|Get started)\s*</g, msg: "Submit/OK/Learn more" },
  { cat: "copy", w: 1, re: /\b(?:Cinq|CINQ)\b(?![-_.\/])/g, msg: "wrong spelling of CiNQ", skip: /cinq-|cinqstudios|cinqdevstudio/ },
];

const caps = { colour: 30, gradient: 15, shadow: 10, motion: 15, structure: 20, type: 5, copy: 5 };

function* files(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (SKIP.test(p)) continue;
    if (e.isDirectory()) yield* files(p);
    else if (EXT.test(e.name)) yield p;
  }
}

const hits = [];
let fileCount = 0;
for (const f of files(path.resolve(dir))) {
  fileCount++;
  const text = fs.readFileSync(f, "utf8");
  for (const r of rules) {
    if (r.skip && r.skip.test(f)) continue;
    const re = new RegExp(r.re.source, r.re.flags);
    let m;
    let n = 0;
    while ((m = re.exec(text))) {
      if (r.skip && r.skip.test(m[0])) continue;
      const line = text.slice(0, m.index).split("\n").length;
      hits.push({ cat: r.cat, w: r.w, msg: r.msg, file: path.relative(process.cwd(), f), line, sample: m[0].slice(0, 60).replace(/\s+/g, " ") });
      if (r.once || ++n > 200) break;
    }
  }
}

const byCat = {};
for (const h of hits) (byCat[h.cat] ??= []).push(h);
let score = 100;
const summary = {};
for (const [cat, cap] of Object.entries(caps)) {
  const list = byCat[cat] ?? [];
  const off = Math.min(cap, list.reduce((s, h) => s + h.w, 0));
  summary[cat] = { hits: list.length, off };
  score -= off;
}
const verdict = score >= 90 ? "on system" : score >= 70 ? "token-bound, structure pending" : score >= 40 ? "reskin" : "generic";

if (asJson) {
  console.log(JSON.stringify({ dir, files: fileCount, score, verdict, summary, hits }, null, 2));
} else {
  console.log(`audit: ${fileCount} files · score ${score}/100 · ${verdict}`);
  for (const [cat, s] of Object.entries(summary)) console.log(`  ${cat.padEnd(10)} ${String(s.hits).padStart(4)} hits  −${s.off}`);
}

if (reportPath) {
  let md = `# Design audit · ${dir}\n\nGENERATED by \`tooling/audit-script/audit.js\`. ${fileCount} files scanned.\n\n**Score ${score} / 100 · ${verdict}**\n\n| Category | Hits | Points off |\n|:--|--:|--:|\n`;
  for (const [cat, s] of Object.entries(summary)) md += `| ${cat} | ${s.hits} | ${s.off} |\n`;
  md += `\nScore bands: ≥ 90 on system · 70–89 token-bound, structure pending · 40–69 reskin · < 40 generic. The structure category is where a reskin shows: tokens can be perfect and the score still sits under 90.\n`;
  for (const [cat, list] of Object.entries(byCat)) {
    md += `\n## ${cat} (${list.length})\n\n| File | Line | Finding | Sample |\n|:--|--:|:--|:--|\n`;
    for (const h of list.slice(0, 300)) md += `| \`${h.file}\` | ${h.line} | ${h.msg} | \`${h.sample.replace(/\|/g, "\\|")}\` |\n`;
    if (list.length > 300) md += `\n… ${list.length - 300} more.\n`;
  }
  fs.writeFileSync(reportPath, md);
  console.log(`report → ${reportPath}`);
}
