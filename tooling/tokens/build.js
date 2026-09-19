#!/usr/bin/env node
/**
 * CiNQ token build.
 *
 *   node tooling/tokens/build.js          write every implementation file
 *   node tooling/tokens/build.js --check  regenerate in memory and fail if
 *                                         anything on disk is stale, a
 *                                         semantic colour lacks a light
 *                                         value, or an alias is unresolved
 *
 * Reads foundations/tokens.json (W3C DTCG) and writes:
 *   implementations/variables.css      custom properties, both modes, density, reduced motion, type roles
 *   implementations/tailwind.v4.css    Tailwind v4 @theme mapping
 *   implementations/tailwind.config.ts Tailwind v3 preset with keyframes and animation
 *   implementations/react_tokens.ts    typed values and Motion presets
 *   implementations/motion.css         @keyframes, utilities, view transitions, reduced motion
 *   implementations/flutter_theme.dart ThemeData + ThemeExtensions for gradients, motion, glow
 *   implementations/manifest.json      hashes, for --check
 *
 * No dependencies. Node 18+.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "foundations/tokens.json");
const OUT = path.join(ROOT, "implementations");
const CHECK = process.argv.includes("--check");

const tokens = JSON.parse(fs.readFileSync(SRC, "utf8"));
const errors = [];

/* ── walk ──────────────────────────────────────────────────────────────── */
const flat = new Map(); // "color.semantic.surface.canvas" -> token object
(function walk(node, p) {
  if (!node || typeof node !== "object") return;
  if ("$value" in node) {
    flat.set(p.join("."), node);
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    walk(v, [...p, k]);
  }
})(tokens, []);

const modeOf = (t, mode) =>
  mode === "dark" ? t.$value : t.$extensions?.["cinq.modes"]?.[mode];

/** Replace every {alias} in a value with the referenced token's value for this mode. */
function resolve(value, mode, depth = 0) {
  if (depth > 12) {
    errors.push(`alias depth exceeded: ${JSON.stringify(value)}`);
    return value;
  }
  if (typeof value === "string") {
    // A value that is exactly one alias returns the referenced value as is
    // (an array or object stays an array or object).
    const whole = value.match(/^\{([a-z0-9.\-]+)\}$/i);
    if (whole) {
      const t = flat.get(whole[1]);
      if (!t) {
        errors.push(`unresolved alias {${whole[1]}}`);
        return value;
      }
      return resolve(modeOf(t, mode) ?? t.$value, mode, depth + 1);
    }
    return value.replace(/\{([a-z0-9.\-]+)\}/gi, (_, ref) => {
      const t = flat.get(ref);
      if (!t) {
        errors.push(`unresolved alias {${ref}}`);
        return `{${ref}}`;
      }
      const v = modeOf(t, mode) ?? t.$value;
      const r = resolve(v, mode, depth + 1);
      return typeof r === "string" ? r : JSON.stringify(r);
    });
  }
  if (Array.isArray(value)) return value.map((v) => resolve(v, mode, depth + 1));
  if (value && typeof value === "object") {
    const o = {};
    for (const [k, v] of Object.entries(value)) o[k] = resolve(v, mode, depth + 1);
    return o;
  }
  return value;
}

/* ── naming ────────────────────────────────────────────────────────────── */
function cssName(p) {
  const parts = p.split(".");
  const [g, ...rest] = parts;
  switch (g) {
    case "color":
      return rest[0] === "semantic" ? rest.slice(1).join("-") : `color-${rest.slice(1).join("-")}`;
    case "font":
      if (rest[0] === "family") return `font-${rest[1]}`;
      if (rest[0] === "size") return `font-size-${rest[1]}`;
      if (rest[0] === "weight") return `font-weight-${rest[1]}`;
      if (rest[0] === "line-height") return `leading-${rest[1]}`;
      if (rest[0] === "letter-spacing") return `tracking-${rest[1]}`;
      if (rest[0] === "variation") return `font-variation-${rest[1]}`;
      return `font-${rest.join("-")}`;
    case "duration":
      return `dur-${rest.join("-")}`;
    case "easing":
      return `ease-${rest.join("-")}`;
    case "z-index":
      return `z-${rest.join("-")}`;
    case "density":
      return rest.slice(1).join("-"); // control-h etc.; level chosen by attribute
    case "typography":
      return null; // classes, not properties
    case "motion":
      return null;
    default:
      return `${g}-${rest.join("-")}`;
  }
}

/* ── value formatting ──────────────────────────────────────────────────── */
const bez = (a) => `cubic-bezier(${a.join(", ")})`;

function shadowCss(layers) {
  return layers
    .map((l) => `${l.inset ? "inset " : ""}${l.offsetX} ${l.offsetY} ${l.blur} ${l.spread} ${l.color}`)
    .join(", ");
}

function gradientCss(stops, ext) {
  const g = ext?.["cinq.gradient"] ?? {};
  const interp = g.interp && g.interp !== "srgb" ? ` in ${g.interp}` : "";
  const list = stops.map((s) => `${s.color} ${Math.round(s.position * 1000) / 10}%`).join(", ");
  if (g.shape === "radial") {
    const size = g.size ?? "closest-side";
    const at = g.at ?? "center";
    return `radial-gradient(${size} at ${at}${interp}, ${list})`;
  }
  const angle = g.angle ?? "180deg";
  return `linear-gradient(${angle}${interp}, ${list})`;
}

/** A damped spring sampled into a CSS linear() easing. */
function springLinear({ stiffness, damping, mass }) {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  // settle time: when the envelope drops below 1%
  const settle = zeta < 1 ? -Math.log(0.01) / (zeta * w0) : 6 / w0;
  const n = 24;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = (settle * i) / n;
    let x;
    if (zeta < 1) {
      const wd = w0 * Math.sqrt(1 - zeta * zeta);
      x = 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
    } else {
      x = 1 - Math.exp(-w0 * t) * (1 + w0 * t);
    }
    pts.push(Math.round(x * 1000) / 1000);
  }
  pts[n] = 1;
  return { css: `linear(${pts.join(", ")})`, duration: Math.round(settle * 1000) };
}

function transitionCss(v, mode) {
  const r = resolve(v, mode);
  const ease = Array.isArray(r.timingFunction) ? bez(r.timingFunction) : r.timingFunction;
  return `${r.duration} ${ease} ${r.delay}`;
}

function cssValue(p, t, mode) {
  const raw = modeOf(t, mode);
  if (raw === undefined) return undefined;
  const v = resolve(raw, mode);
  switch (t.$type) {
    case "color":
    case "dimension":
    case "duration":
    case "string":
      return String(v);
    case "number":
      return String(v);
    case "fontWeight":
      return String(v);
    case "fontFamily":
      return v.join(", ");
    case "cubicBezier":
      return bez(v);
    case "shadow":
      return shadowCss(v);
    case "gradient":
      return gradientCss(v, t.$extensions);
    case "border":
      return `${v.width} ${v.style} ${v.color}`;
    case "transition":
      return transitionCss(raw, mode);
    case "spring":
      return springLinear(v).css;
    default:
      return undefined;
  }
}

/* ── variables.css ─────────────────────────────────────────────────────── */
function buildVariablesCss() {
  const dark = [];
  const light = [];
  const contrast = [];
  const density = { comfortable: [], compact: [], dense: [], touch: [] };
  const semanticColorsMissingLight = [];

  for (const [p, t] of flat) {
    const name = cssName(p);
    if (!name) continue;
    if (p.startsWith("density.")) {
      const level = p.split(".")[1];
      density[level].push(`  --${name}: ${cssValue(p, t, "dark")};`);
      continue;
    }
    const d = cssValue(p, t, "dark");
    if (d !== undefined) dark.push(`  --${name}: ${d};`);
    const l = cssValue(p, t, "light");
    if (l !== undefined && l !== d) light.push(`  --${name}: ${l};`);
    const c = cssValue(p, t, "contrast");
    if (c !== undefined) contrast.push(`  --${name}: ${c};`);
    if (p.startsWith("color.semantic.") && t.$type === "color" && modeOf(t, "light") === undefined) {
      semanticColorsMissingLight.push(p);
    }
  }
  for (const p of semanticColorsMissingLight) errors.push(`semantic colour without a light value: ${p}`);

  // Legacy names from design system 1.0.0 and the website's globals.css.
  const legacy = {
    ink: "surface-canvas", "ink-2": "surface-primary", "ink-3": "surface-raised", "ink-4": "surface-bezel",
    "ink-warm": "surface-warm", bone: "text-primary", "bone-2": "text-secondary", "bone-3": "text-tertiary",
    accent: "accent-fill", "accent-text": "accent-text", "on-accent": "text-on-accent", "accent-deep": "accent-deep",
    "accent-hover": "accent-hover", "accent-active": "accent-active", amber: "color-amber",
    line: "line-hairline", "line-strong": "line-standard", "line-selected": "line-selected",
    canvas: "surface-canvas", "canvas-2": "surface-primary", "canvas-3": "surface-raised", "canvas-4": "surface-bezel",
    "canvas-warm": "surface-warm", text: "text-primary", "text-2": "text-secondary", "text-3": "text-tertiary",
    "text-inverse": "text-inverse", "focus-ring": "accent-ring", device: "surface-device", "device-screen": "surface-device-screen",
    "app-canvas": "surface-canvas", "app-surface": "surface-primary", "app-raised": "surface-raised", "app-sunken": "surface-sunken",
    "app-inverse": "surface-inverse", "app-on-inverse": "text-inverse",
    positive: "feedback-success-solid", "positive-text": "feedback-success-text", "positive-soft": "feedback-success-bg", "on-positive": "feedback-success-on-solid",
    negative: "feedback-danger-solid", "negative-text": "feedback-danger-text", "negative-soft": "feedback-danger-bg", "on-negative": "feedback-danger-on-solid",
    attention: "feedback-warning-solid", "attention-text": "feedback-warning-text", "attention-soft": "feedback-warning-bg", "on-attention": "feedback-warning-on-solid",
    info: "feedback-info-solid", "info-text": "feedback-info-text", "info-soft": "feedback-info-bg", "on-info": "feedback-info-on-solid",
    radius: "radius-marketing", "radius-sm": "radius-marketing-sm", pad: "space-gutter", "nav-h": "layout-nav-h", "nav-max": "layout-nav-max",
    "page-max": "layout-page-max", "app-max": "layout-app-max", "prose-max": "layout-prose-max", "sidebar-w": "layout-sidebar-w",
    "bottom-nav-h": "layout-bottom-nav-h", "touch-min": "layout-touch-min",
    "ease-out": "ease-out", "ease-io": "ease-in-out", "dur-fast": "dur-fast", "dur-base": "dur-base", "dur-slow": "dur-slow",
    "dur-reveal": "dur-reveal", "dur-page": "dur-page", stagger: "dur-stagger",
    "font-display": "font-display", "font-sans": "font-sans", "font-mono": "font-mono",
    "shadow-slab": "shadow-slab", "shadow-strong": "shadow-strong", "shadow-sheet": "shadow-sheet", "shadow-pressed": "shadow-pressed",
    "shadow-bezel": "shadow-bezel-shell", "shadow-bezel-top": "shadow-bezel-top",
    "text-display": "font-size-display-l", "text-hero": "font-size-display-m", "text-title": "font-size-display-s", "text-lead": "font-size-body-l",
    "text-body": "font-size-body", "text-label": "font-size-body-s", "text-kicker": "font-size-overline", "text-eyebrow": "font-size-overline",
    "text-numeral": "font-size-numeric", "text-nav": "font-size-nav", "text-bottom-nav": "font-size-bottom-nav",
    "weight-regular": "font-weight-regular", "weight-medium": "font-weight-medium", "weight-display": "font-weight-display", "weight-display-tight": "font-weight-display-tight",
    "leading-display": "leading-display", "leading-tight": "leading-tight", "leading-body": "leading-body", "leading-lead": "leading-lead",
    "tracking-display": "tracking-display", "tracking-display-tight": "tracking-display-tight", "tracking-mono": "tracking-mono",
    "chart-grid": "chart-grid",
  };
  const legacyLines = Object.entries(legacy)
    .filter(([a, b]) => a !== b)
    .map(([a, b]) => `  --${a}: var(--${b});`);

  const typeClasses = [];
  for (const [p, t] of flat) {
    if (!p.startsWith("typography.")) continue;
    const role = p.split(".")[1];
    const v = resolve(t.$value, "dark");
    const upper = /overline|badge|h6/.test(role) ? "\n  text-transform: uppercase;" : "";
    const tabular = role === "numeric" ? "\n  font-variant-numeric: tabular-nums;" : "";
    const variation = /display|h1|h2/.test(role)
      ? `\n  font-variation-settings: ${role === "numeric" ? "var(--font-variation-display-tight)" : "var(--font-variation-display)"};`
      : role === "numeric"
        ? "\n  font-variation-settings: var(--font-variation-display-tight);"
        : "";
    typeClasses.push(
      `.t-${role} {\n  font-family: ${v.fontFamily.join(", ")};\n  font-size: ${v.fontSize};\n  font-weight: ${v.fontWeight};\n  line-height: ${v.lineHeight};\n  letter-spacing: ${v.letterSpacing};${variation}${upper}${tabular}\n}`,
    );
  }

  return `/* ============================================================================
   CiNQ design tokens · variables.css · GENERATED from foundations/tokens.json
   by tooling/tokens/build.js. Do not edit; edit tokens.json and run
   \`npm run tokens:build\`.

   Modes: :root is dark (the brand). html.light is the opt-in light mode.
   html.contrast raises text and line contrast for people who need it.
   Density: [data-density="compact" | "dense" | "touch"]; comfortable is the
   default. Legacy names from design system 1.0.0 and the website are kept
   as aliases at the end of :root.
   ========================================================================== */

:root {
  color-scheme: dark;
${dark.join("\n")}

  /* density · comfortable (default) */
${density.comfortable.join("\n")}

  /* legacy aliases · design system 1.0.0 and cinq-website globals.css */
${legacyLines.join("\n")}
}

[data-density="compact"] {
${density.compact.join("\n")}
}
[data-density="dense"] {
${density.dense.join("\n")}
}
[data-density="touch"],
[data-input="touch"] {
${density.touch.join("\n")}
}

html.light {
  color-scheme: light;
${light.join("\n")}
}

html.contrast {
${contrast.join("\n")}
}

/* Large displays: the marketing radii grow one notch (canonical, 19 Sep). */
@media (min-width: 1920px) {
  :root {
    --radius-marketing: var(--radius-marketing-3xl);
    --radius-marketing-sm: var(--radius-marketing-sm-3xl);
    --layout-page-max: var(--layout-page-max-3xl);
  }
}

/* Reduced motion: every duration collapses, every travel is zero. Scroll
   and pointer effects must also not mount; see motion.md. */
@media (prefers-reduced-motion: reduce) {
  :root {
${[...flat].filter(([p]) => p.startsWith("duration.") && !/tooltip|toast-hold/.test(p)).map(([p]) => `    --${cssName(p)}: 0.001ms;`).join("\n")}
${[...flat].filter(([p]) => p.startsWith("travel.")).map(([p]) => `    --${cssName(p)}: 0px;`).join("\n")}
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

/* Reduced transparency: glass becomes a solid surface. */
@media (prefers-reduced-transparency: reduce) {
  :root {
    --blur-glass: 0px;
    --blur-glass-heavy: 0px;
    --opacity-glass-fill: 1;
    --opacity-menu-fill: 1;
  }
}

/* Forced colours: let the OS paint; keep borders so controls survive. */
@media (forced-colors: active) {
  :root {
    --line-hairline: CanvasText;
    --line-standard: CanvasText;
    --accent-ring: Highlight;
  }
}

/* ── Base ─────────────────────────────────────────────────────────────── */
html {
  background: var(--surface-canvas);
  -webkit-text-size-adjust: 100%;
}
body {
  background: var(--surface-canvas);
  color: var(--text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
::selection {
  background: var(--accent-fill);
  color: var(--text-on-accent);
}
:where(a, button, input, textarea, select, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--accent-ring);
  outline-offset: 4px;
  border-radius: 4px;
}

/* ── Type roles ───────────────────────────────────────────────────────── */
@layer components {
${typeClasses.join("\n")}
.t-display-l, .t-display-m, .t-display-s, .t-h1, .t-h2 {
  font-variation-settings: var(--font-variation-display);
  text-wrap: balance;
}
.t-body, .t-body-l, .t-body-s { text-wrap: pretty; }
/* the site's short names */
.font-display { font-family: var(--font-display); font-variation-settings: var(--font-variation-display); font-weight: var(--font-weight-display); letter-spacing: var(--tracking-display); line-height: var(--leading-display); }
.font-display-tight { font-family: var(--font-display); font-variation-settings: var(--font-variation-display-tight); font-weight: var(--font-weight-display-tight); letter-spacing: var(--tracking-display-tight); line-height: 0.9; }
.t-hero { font-size: var(--font-size-display-l); }
.t-h3 { font-size: var(--font-size-display-s); }
.t-lead { font-size: var(--font-size-body-l); line-height: var(--leading-lead); }
.t-small { font-size: var(--font-size-body-s); line-height: 1.5; }
.t-mono { font-family: var(--font-mono); font-size: var(--font-size-overline); letter-spacing: var(--tracking-mono); text-transform: uppercase; }
}
`;
}

/* ── tailwind v4 ───────────────────────────────────────────────────────── */
function buildTailwindV4() {
  const lines = [];
  const add = (k, v) => lines.push(`  --${k}: ${v};`);
  for (const [p, t] of flat) {
    const name = cssName(p);
    if (!name) continue;
    if (p.startsWith("color.")) add(`color-${name}`, `var(--${name})`);
    else if (p.startsWith("font.family.")) add(`font-${p.split(".")[2]}`, `var(--${name})`);
    else if (p.startsWith("font.size.")) add(`text-${p.split(".")[2]}`, `var(--${name})`);
    else if (p.startsWith("font.line-height.")) add(`leading-${p.split(".")[2]}`, `var(--${name})`);
    else if (p.startsWith("font.letter-spacing.")) add(`tracking-${p.split(".")[2]}`, `var(--${name})`);
    else if (p.startsWith("radius.")) add(`radius-${p.split(".")[1]}`, `var(--${name})`);
    else if (p.startsWith("shadow.")) add(`shadow-${p.split(".")[1]}`, `var(--${name})`);
    else if (p.startsWith("blur.")) add(`blur-${p.split(".")[1]}`, `var(--${name})`);
    else if (p.startsWith("space.")) add(`spacing-${p.split(".")[1]}`, `var(--${name})`);
    else if (p.startsWith("layout.")) add(`container-${p.split(".")[1]}`, `var(--${name})`);
    else if (p.startsWith("breakpoint.")) add(`breakpoint-${p.split(".")[1]}`, cssValue(p, t, "dark"));
    else if (p.startsWith("duration.")) add(`duration-${p.split(".")[1]}`, `var(--${name})`);
    else if (p.startsWith("easing.")) add(`ease-${p.split(".")[1]}`, `var(--${name})`);
    else if (p.startsWith("gradient.")) add(`background-image-${p.split(".")[1]}`, `var(--${name})`);
    else if (p.startsWith("motion.")) add(`animate-${p.split(".")[1]}`, animationShorthand(t));
  }
  // density-driven spacing
  for (const k of ["control-h", "control-pad-x", "gap", "gap-lg", "row-h"]) add(`spacing-${k}`, `var(--${k})`);
  // legacy site utilities
  for (const [a, b] of [["color-ink", "ink"], ["color-ink-2", "ink-2"], ["color-ink-3", "ink-3"], ["color-ink-4", "ink-4"], ["color-ink-warm", "ink-warm"], ["color-bone", "bone"], ["color-bone-2", "bone-2"], ["color-bone-3", "bone-3"], ["color-accent", "accent"], ["color-accent-text", "accent-text"], ["color-on-accent", "on-accent"], ["color-accent-deep", "accent-deep"], ["color-amber", "amber"], ["color-line", "line"], ["color-line-strong", "line-strong"], ["color-device", "device"], ["color-device-screen", "device-screen"], ["radius-card", "radius-marketing"], ["radius-card-sm", "radius-marketing-sm"], ["spacing-pad", "space-gutter"], ["spacing-nav", "layout-nav-h"]]) add(a, `var(--${b})`);
  return `/* CiNQ · Tailwind v4 theme · GENERATED by tooling/tokens/build.js
   Import after variables.css:
     @import "tailwindcss";
     @import "./variables.css";
     @import "./tailwind.v4.css";
   Add \`@custom-variant light (&:where(.light, .light *));\` for light-only overrides. */
@theme inline {
${lines.join("\n")}
}
`;
}

function animationShorthand(t) {
  const a = resolve(t.$extensions["cinq.animation"], "dark");
  const ease = Array.isArray(a.timingFunction) ? bez(a.timingFunction) : a.timingFunction;
  return `${t.$value} ${a.duration} ${ease}${a.iterationCount ? ` ${a.iterationCount}` : ""}${a.direction ? ` ${a.direction}` : ""}`;
}

/* ── tailwind v3 preset ────────────────────────────────────────────────── */
function buildTailwindConfig() {
  const v = (n) => `"var(--${n})"`;
  const colors = {};
  for (const [p] of flat) {
    if (!p.startsWith("color.")) continue;
    const name = cssName(p);
    colors[name] = `var(--${name})`;
  }
  for (const [a] of Object.entries({ ink: 1, "ink-2": 1, "ink-3": 1, "ink-4": 1, "ink-warm": 1, bone: 1, "bone-2": 1, "bone-3": 1, accent: 1, "accent-text": 1, "on-accent": 1, "accent-deep": 1, line: 1, "line-strong": 1, device: 1, "device-screen": 1 })) colors[a] = `var(--${a})`;
  const obj = (prefix, filter) => {
    const o = {};
    for (const [p] of flat) if (filter(p)) o[p.split(".").slice(1).join("-")] = `var(--${cssName(p)})`;
    return o;
  };
  const keyframes = {};
  const animation = {};
  for (const [p, t] of flat) {
    if (!p.startsWith("motion.")) continue;
    const kf = resolve(t.$extensions["cinq.keyframes"], "dark");
    keyframes[t.$value] = kf;
    animation[p.split(".")[1]] = animationShorthand(t);
  }
  const screens = {};
  for (const [p, t] of flat) if (p.startsWith("breakpoint.")) screens[p.split(".")[1]] = t.$value;
  const gradients = {};
  for (const [p, t] of flat) if (p.startsWith("gradient.")) gradients[p.split(".")[1]] = `var(--${cssName(p)})`;
  const fontSize = {};
  for (const [p, t] of flat) if (p.startsWith("typography.")) {
    const r = p.split(".")[1];
    const val = resolve(t.$value, "dark");
    fontSize[r] = [`var(--font-size-${r === "button" ? "nav" : r === "overline" ? "overline" : r})`, { lineHeight: String(val.lineHeight), letterSpacing: val.letterSpacing, fontWeight: String(val.fontWeight) }];
  }
  const j = (o) => JSON.stringify(o, null, 2).replace(/^/gm, "  ");
  return `// CiNQ · Tailwind v3 preset · GENERATED by tooling/tokens/build.js
// Every value points at a custom property from variables.css, so the mode
// switch (html.light) and the density attribute keep working. Import
// variables.css once before Tailwind's layers.
//
//   import cinq from "./brand/design-system/implementations/tailwind.config";
//   export default { presets: [cinq], content: [...] };

import type { Config } from "tailwindcss";

const preset = {
  darkMode: ["class", "html:not(.light)"],
  theme: {
    screens: ${j(screens).trim()},
    extend: {
      colors: ${j(colors).trim()},
      fontFamily: {
        display: ${v("font-display")},
        sans: ${v("font-sans")},
        mono: ${v("font-mono")},
        urdu: ${v("font-urdu")},
      },
      fontSize: ${j(fontSize).trim()},
      borderRadius: ${j(obj("radius", (p) => p.startsWith("radius."))).trim()},
      boxShadow: ${j(obj("shadow", (p) => p.startsWith("shadow."))).trim()},
      spacing: ${j({ ...obj("space", (p) => p.startsWith("space.")), ...Object.fromEntries(["control-h", "control-pad-x", "gap", "gap-lg", "row-h"].map((k) => [k, `var(--${k})`])), pad: "var(--space-gutter)", nav: "var(--layout-nav-h)" }).trim()},
      maxWidth: ${j(obj("layout", (p) => p.startsWith("layout."))).trim()},
      zIndex: ${j(obj("z", (p) => p.startsWith("z-index."))).trim()},
      opacity: ${j(obj("opacity", (p) => p.startsWith("opacity."))).trim()},
      backdropBlur: ${j(obj("blur", (p) => p.startsWith("blur."))).trim()},
      transitionDuration: ${j(obj("dur", (p) => p.startsWith("duration."))).trim()},
      transitionTimingFunction: ${j(obj("ease", (p) => p.startsWith("easing."))).trim()},
      backgroundImage: ${j(gradients).trim()},
      keyframes: ${j(keyframes).trim()},
      animation: ${j(animation).trim()},
    },
  },
} satisfies Partial<Config>;

export default preset;
`;
}

/* ── react_tokens.ts ───────────────────────────────────────────────────── */
function buildReactTokens() {
  const raw = { dark: {}, light: {} };
  for (const [p, t] of flat) {
    const name = cssName(p);
    if (!name) continue;
    if (p.startsWith("density.")) continue;
    for (const mode of ["dark", "light"]) {
      const v = cssValue(p, t, mode) ?? cssValue(p, t, "dark");
      raw[mode][name] = v;
    }
  }
  const names = Object.keys(raw.dark);
  const easings = {};
  for (const [p, t] of flat) if (p.startsWith("easing.")) easings[camel(p.split(".")[1])] = t.$value;
  const durations = {};
  for (const [p, t] of flat) if (p.startsWith("duration.")) durations[camel(p.split(".")[1])] = parseFloat(t.$value) / 1000;
  const springs = {};
  for (const [p, t] of flat) if (p.startsWith("spring.")) springs[camel(p.split(".")[1])] = t.$value;
  const transitions = {};
  for (const [p, t] of flat) if (p.startsWith("transition.")) {
    const r = resolve(t.$value, "dark");
    transitions[camel(p.split(".")[1])] = { duration: parseFloat(r.duration) / 1000, ease: r.timingFunction, delay: parseFloat(r.delay) / 1000 };
  }
  const travel = {};
  for (const [p, t] of flat) if (p.startsWith("travel.")) travel[camel(p.split(".")[1])] = parseFloat(t.$value);
  const density = {};
  for (const [p, t] of flat) if (p.startsWith("density.")) {
    const [, level, key] = p.split(".");
    (density[level] ??= {})[camel(key)] = resolve(t.$value, "dark");
  }
  const j = (o) => JSON.stringify(o, null, 2);
  return `/**
 * CiNQ design tokens · react_tokens.ts · GENERATED by tooling/tokens/build.js
 * Do not edit. Values are resolved CSS strings; \`cssVar\` is for styles and
 * \`raw\` is for places that need a literal (charts, canvas, native).
 */

export const tokenNames = ${j(names)} as const;
export type TokenName = (typeof tokenNames)[number];
export type Mode = "dark" | "light";

/** var(--name) for inline styles and CSS-in-JS. */
export const cssVar = (name: TokenName) => \`var(--\${name})\`;

export const raw: Record<Mode, Record<TokenName, string>> = ${j(raw)};

/** Chart series in their fixed order. */
export const chartSeries = (mode: Mode = "dark") =>
  [1, 2, 3, 4, 5, 6].map((i) => raw[mode][\`chart-\${i}\` as TokenName]);

/* ── Motion presets, for Motion (motion/react) and GSAP ─────────────── */

/** Cubic-bezier arrays. Pass to Motion's \`ease\` or build a GSAP CustomEase. */
export const easings = ${j(easings)} as const;

/** Seconds. */
export const durations = ${j(durations)} as const;

/** Motion \`useSpring\` / \`type: "spring"\` options. */
export const springs = ${j(springs)} as const;

/** Ready-made Motion transitions: \`transition={transitions.dialogIn}\`. */
export const transitions = ${j(transitions)} as const;

/** Enter travel in px. */
export const travel = ${j(travel)} as const;

export const density = ${j(density)} as const;

/** GSAP names for the two canonical curves. */
export const gsapEase = { out: "expo.out", inOut: "power2.inOut", back: "back.out(1.6)", linear: "none" } as const;
`;
}
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/* ── motion.css ────────────────────────────────────────────────────────── */
function buildMotionCss() {
  const kfs = [];
  const utils = [];
  for (const [p, t] of flat) {
    if (!p.startsWith("motion.")) continue;
    const kf = resolve(t.$extensions["cinq.keyframes"], "dark");
    const body = Object.entries(kf)
      .map(([sel, decl]) => `  ${sel} {\n${Object.entries(decl).map(([k, v]) => `    ${k}: ${v};`).join("\n")}\n  }`)
      .join("\n");
    kfs.push(`@keyframes ${t.$value} {\n${body}\n}`);
    const a = resolve(t.$extensions["cinq.animation"], "dark");
    const ease = Array.isArray(a.timingFunction) ? bez(a.timingFunction) : a.timingFunction;
    utils.push(
      `.cq-anim-${p.split(".")[1]} {\n  animation: ${t.$value} ${a.duration} ${ease}${a.iterationCount ? ` ${a.iterationCount}` : ""}${a.direction ? ` ${a.direction}` : ""};\n}`,
    );
  }
  const transitions = [];
  for (const [p, t] of flat) {
    if (!p.startsWith("transition.")) continue;
    transitions.push(`.cq-transition-${p.split(".")[1]} {\n  transition-duration: ${resolve(t.$value.duration, "dark")};\n  transition-timing-function: ${bez(resolve(t.$value.timingFunction, "dark"))};\n  transition-delay: ${t.$value.delay};\n}`);
  }
  return `/* ============================================================================
   CiNQ motion.css · GENERATED by tooling/tokens/build.js from
   foundations/tokens.json (motion.*, transition.*, duration.*, easing.*).
   Import after variables.css. Every animation here animates only transform,
   opacity, clip-path, box-shadow (the live edge), background-position (the
   shimmer, on an oversized layer) or font-variation-settings (the wordmark).
   ========================================================================== */

/* ── Keyframes ────────────────────────────────────────────────────────── */
${kfs.join("\n\n")}

/* ── Utilities ────────────────────────────────────────────────────────── */
@layer components {
${utils.join("\n")}

${transitions.join("\n")}

/* The loader: five segments chase, the ring turns. Apply to the mark svg. */
.cq-loader svg, .mark-loader {
  animation: cq-mark-spin var(--dur-loader-spin) linear infinite;
  transform-origin: 50% 50%;
}
.cq-loader path, .mark-loader path {
  opacity: var(--opacity-loader-dim);
  animation: cq-mark-chase var(--dur-loader-chase) ease-in-out infinite;
}
.cq-loader path:nth-child(1), .mark-loader path:nth-child(1) { animation-delay: 0s; }
.cq-loader path:nth-child(2), .mark-loader path:nth-child(2) { animation-delay: -0.96s; }
.cq-loader path:nth-child(3), .mark-loader path:nth-child(3) { animation-delay: -0.72s; }
.cq-loader path:nth-child(4), .mark-loader path:nth-child(4) { animation-delay: -0.48s; }
.cq-loader path:nth-child(5), .mark-loader path:nth-child(5) { animation-delay: -0.24s; }

/* Skeleton: pulse plus a shimmer on an oversized gradient layer. */
.cq-skeleton {
  border-radius: var(--radius-control);
  background: var(--surface-raised);
  animation: cq-pulse var(--dur-count) cubic-bezier(0.65, 0, 0.35, 1) infinite;
}
.cq-skeleton-shimmer {
  background-image: var(--gradient-shimmer);
  background-size: 200% 100%;
  animation: cq-shimmer var(--dur-count) linear infinite;
}

/* Masked line reveal. Wrap each line in .cq-mask > .cq-line. */
.cq-mask { overflow: hidden; }
.cq-mask > .cq-line { display: block; will-change: transform; animation: cq-rise var(--dur-headline) var(--ease-out) both; }
.cq-mask > .cq-line:nth-child(2) { animation-delay: var(--dur-stagger-lines); }
.cq-mask > .cq-line:nth-child(3) { animation-delay: calc(var(--dur-stagger-lines) * 2); }
.cq-mask > .cq-line:nth-child(4) { animation-delay: calc(var(--dur-stagger-lines) * 3); }

/* Stagger helper: set --i on each sibling. */
.cq-stagger > * { animation-delay: calc(var(--i, 0) * var(--dur-stagger)); }

/* A new console row. */
.cq-live-row { animation: cq-live-edge var(--dur-live-fade) var(--ease-out) both; }

/* Press feedback, shared by every button. */
.cq-press { transition: transform var(--dur-press) var(--ease-out); }
.cq-press:active { transform: scale(0.97); }

/* Marquee: duplicate the track's children once. */
.cq-marquee { display: flex; width: max-content; animation: cq-marquee var(--dur-marquee) linear infinite; }
}

/* ── View transitions (route changes) ─────────────────────────────────── */
@view-transition { navigation: auto; }
::view-transition-old(root) {
  animation: cq-route-out var(--dur-base) var(--ease-in, cubic-bezier(0.7, 0, 0.84, 0)) both;
}
::view-transition-new(root) {
  animation: cq-route-in var(--dur-page) var(--ease-out) both;
}
@keyframes cq-route-out { to { opacity: 0; } }
@keyframes cq-route-in { from { opacity: 0; transform: translateY(var(--travel-route)); } }
/* A shared element: give both ends view-transition-name: <id>. */
::view-transition-group(*) { animation-duration: var(--dur-page); animation-timing-function: var(--ease-emphasized); }

/* ── Reduced motion ───────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .cq-mask > .cq-line, .cq-live-row, [class*="cq-anim-"] { animation: none !important; }
  .cq-skeleton, .cq-skeleton-shimmer { animation: none !important; opacity: var(--opacity-skeleton-hi); }
  .cq-loader path, .mark-loader path { animation: none !important; opacity: 1; }
  .cq-loader svg, .mark-loader { animation: none !important; }
  .cq-marquee { animation: none !important; }
  ::view-transition-old(root), ::view-transition-new(root) { animation: cq-route-fade 0.001ms both; }
  ::view-transition-group(*) { animation-duration: 0.001ms; }
}
@keyframes cq-route-fade { to { opacity: 1; } }
`;
}

/* ── flutter_theme.dart ────────────────────────────────────────────────── */
function hexToDart(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return `Color(0xFF${full.toUpperCase()})`;
}
/** Resolve a CSS colour string to a Dart Color expression. Handles hex,
    rgb(r g b / a) and color-mix(in srgb, <hex|rgb> N%, transparent). */
function dartColor(css) {
  css = css.trim();
  let m;
  if ((m = css.match(/^#([0-9a-f]{3,8})$/i))) return hexToDart(css);
  if ((m = css.match(/^rgb\((\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\)$/))) {
    return `Color.fromRGBO(${m[1]}, ${m[2]}, ${m[3]}, ${m[4]})`;
  }
  if ((m = css.match(/^color-mix\(in srgb,\s*(#[0-9a-f]{6}|rgb\([^)]+\))\s+([\d.]+)%,\s*transparent\)$/i))) {
    // Alpha over a base colour, as a const-constructible Color.
    const a = (parseFloat(m[2]) / 100).toFixed(2);
    let r, g, b, inner;
    if ((inner = m[1].match(/^#([0-9a-f]{6})$/i))) {
      r = parseInt(inner[1].slice(0, 2), 16); g = parseInt(inner[1].slice(2, 4), 16); b = parseInt(inner[1].slice(4, 6), 16);
    } else {
      inner = m[1].match(/rgb\((\d+)\s+(\d+)\s+(\d+)/); r = inner[1]; g = inner[2]; b = inner[3];
    }
    return `Color.fromRGBO(${r}, ${g}, ${b}, ${a})`;
  }
  if (css === "transparent") return "Colors.transparent";
  errors.push(`flutter: cannot express colour "${css}"`);
  return "Colors.transparent";
}
const pxOf = (v) => {
  // clamp(min, pref, max) -> min in px (phones). rem at 16.
  const m = String(v).match(/^clamp\(([^,]+),/);
  const s = m ? m[1].trim() : String(v);
  if (s.endsWith("rem")) return parseFloat(s) * 16;
  if (s.endsWith("px")) return parseFloat(s);
  return parseFloat(s);
};

function buildFlutter() {
  const colorLines = (mode) =>
    [...flat]
      .filter(([p, t]) => p.startsWith("color.semantic.") && t.$type === "color")
      .map(([p, t]) => `  static const ${camel(cssName(p))} = ${dartColor(cssValue(p, t, mode))};`)
      .join("\n");
  const prim = [...flat]
    .filter(([p, t]) => p.startsWith("color.primitive.") && t.$type === "color")
    .map(([p, t]) => `  static const ${camel(cssName(p).replace(/^color-/, ""))} = ${hexToDart(t.$value)};`)
    .join("\n");
  const radii = [...flat].filter(([p]) => p.startsWith("radius.") && !/rem|device|browser/.test(p)).map(([p, t]) => `  static const ${camel(p.split(".")[1])} = ${pxOf(t.$value) >= 9999 ? "999.0" : pxOf(t.$value).toFixed(1)};`).join("\n");
  const space = [...flat].filter(([p]) => p.startsWith("space.") && !/section|gutter/.test(p)).map(([p, t]) => `  static const s${p.split(".")[1]} = ${pxOf(t.$value).toFixed(1)};`).join("\n");
  const durations = [...flat].filter(([p]) => p.startsWith("duration.")).map(([p, t]) => `  static const ${camel(p.split(".")[1])} = Duration(milliseconds: ${parseInt(t.$value)});`).join("\n");
  const curves = [...flat].filter(([p]) => p.startsWith("easing.")).map(([p, t]) => `  static const ${camel(p.split(".")[1])} = Cubic(${t.$value.map((n) => n.toFixed(2)).join(", ")});`).join("\n");
  const springs = [...flat].filter(([p]) => p.startsWith("spring.")).map(([p, t]) => `  static const ${camel(p.split(".")[1])} = SpringDescription(mass: ${t.$value.mass}, stiffness: ${t.$value.stiffness}, damping: ${t.$value.damping});`).join("\n");
  const sizes = [...flat].filter(([p]) => p.startsWith("font.size.")).map(([p, t]) => `  static const ${camel(p.split(".")[2])} = ${pxOf(t.$value).toFixed(1)};`).join("\n");
  const shadows = (mode) => [...flat].filter(([p]) => p.startsWith("shadow.") && !/bezel|glass|print/.test(p)).map(([p, t]) => {
    const layers = resolve(modeOf(t, mode) ?? t.$value, mode).filter((l) => !l.inset);
    return `  static const ${camel(p.split(".")[1])} = [${layers.map((l) => `BoxShadow(color: ${dartColor(l.color)}, offset: Offset(${parseFloat(l.offsetX)}, ${parseFloat(l.offsetY)}), blurRadius: ${parseFloat(l.blur)}, spreadRadius: ${parseFloat(l.spread)})`).join(", ")}];`;
  }).join("\n");
  const gradients = (mode) => [...flat].filter(([p]) => p.startsWith("gradient.") && !/dots|shimmer|og-|scrim-sheet/.test(p)).map(([p, t]) => {
    const g = t.$extensions["cinq.gradient"];
    const stops = resolve(modeOf(t, mode) ?? t.$value, mode);
    const colors = stops.map((s) => dartColor(s.color)).join(", ");
    const pos = stops.map((s) => Number(s.position).toFixed(2)).join(", ");
    if (g.shape === "radial") return `  static const ${camel(p.split(".")[1])} = RadialGradient(colors: [${colors}], stops: [${pos}], radius: 0.7);`;
    const angle = g.angle === "to top" ? 90 : g.angle === "to bottom" ? 270 : (parseFloat(g.angle) || 180);
    const rad = ((90 - angle) * Math.PI) / 180;
    const bx = Math.cos(rad).toFixed(3), by = (-Math.sin(rad)).toFixed(3);
    return `  static const ${camel(p.split(".")[1])} = LinearGradient(colors: [${colors}], stops: [${pos}], begin: Alignment(${(-bx)}, ${(-by)}), end: Alignment(${bx}, ${by}));`;
  }).join("\n");

  return `// CiNQ design tokens · flutter_theme.dart · GENERATED by tooling/tokens/build.js
// Do not edit. Fluid web sizes (clamp) are exported at their phone minimum.
// Alpha colours are Color.fromRGBO so every table is const.
//
//   MaterialApp(theme: CinqTheme.dark(), darkTheme: CinqTheme.dark(), ...)
//   final g = Theme.of(context).extension<CinqGradients>()!;

import 'package:flutter/material.dart';
import 'package:flutter/physics.dart';

/// Primitive colours. Never used directly; see CinqColorsDark / CinqColorsLight.
class CinqPrimitive {
${prim}
}

/// Semantic colours, dark mode (the default).
class CinqColorsDark {
${colorLines("dark")}
}

/// Semantic colours, light mode (opt-in).
class CinqColorsLight {
${colorLines("light")}
}

class CinqRadius {
${radii}
}

class CinqSpace {
${space}
}

class CinqFontSize {
${sizes}
}

class CinqDuration {
${durations}
}

class CinqCurve {
${curves}
}

class CinqSpring {
${springs}
}

class CinqShadowDark {
${shadows("dark")}
}

class CinqShadowLight {
${shadows("light")}
}

/// Every alpha gradient in the catalog. One colour to transparent.
class CinqGradients extends ThemeExtension<CinqGradients> {
  const CinqGradients({required this.dark});
  final bool dark;
  @override
  CinqGradients copyWith({bool? dark}) => CinqGradients(dark: dark ?? this.dark);
  @override
  CinqGradients lerp(ThemeExtension<CinqGradients>? other, double t) => this;
}

class CinqGradientsDark {
${gradients("dark")}
}

class CinqGradientsLight {
${gradients("light")}
}

/// Motion vocabulary as a theme extension so widgets never carry a literal.
class CinqMotion extends ThemeExtension<CinqMotion> {
  const CinqMotion({
    this.fast = CinqDuration.fast,
    this.base = CinqDuration.base,
    this.slow = CinqDuration.slow,
    this.press = CinqDuration.press,
    this.reveal = CinqDuration.reveal,
    this.page = CinqDuration.page,
    this.out = CinqCurve.out,
    this.inOut = CinqCurve.inOut,
    this.emphasized = CinqCurve.emphasized,
    this.snappy = CinqSpring.snappy,
    this.soft = CinqSpring.soft,
  });
  final Duration fast, base, slow, press, reveal, page;
  final Curve out, inOut, emphasized;
  final SpringDescription snappy, soft;
  @override
  CinqMotion copyWith() => this;
  @override
  CinqMotion lerp(ThemeExtension<CinqMotion>? other, double t) => this;
}

/// Glow: one ambient glow per view (D-017). Pass to a DecoratedBox behind
/// the focal element.
class CinqGlow extends ThemeExtension<CinqGlow> {
  const CinqGlow({required this.ambient, required this.backlight});
  final RadialGradient ambient;
  final RadialGradient backlight;
  @override
  CinqGlow copyWith({RadialGradient? ambient, RadialGradient? backlight}) =>
      CinqGlow(ambient: ambient ?? this.ambient, backlight: backlight ?? this.backlight);
  @override
  CinqGlow lerp(ThemeExtension<CinqGlow>? other, double t) => this;
}

class CinqTheme {
  static TextTheme _text(Color primary, Color secondary) => TextTheme(
        displayLarge: TextStyle(fontFamily: 'Bricolage Grotesque', fontSize: CinqFontSize.displayL, fontWeight: FontWeight.w700, height: 0.95, letterSpacing: -0.03 * CinqFontSize.displayL, color: primary),
        displayMedium: TextStyle(fontFamily: 'Bricolage Grotesque', fontSize: CinqFontSize.displayM, fontWeight: FontWeight.w700, height: 0.95, letterSpacing: -0.03 * CinqFontSize.displayM, color: primary),
        displaySmall: TextStyle(fontFamily: 'Bricolage Grotesque', fontSize: CinqFontSize.displayS, fontWeight: FontWeight.w700, height: 1.1, letterSpacing: -0.03 * CinqFontSize.displayS, color: primary),
        headlineLarge: TextStyle(fontFamily: 'Bricolage Grotesque', fontSize: CinqFontSize.h1, fontWeight: FontWeight.w700, height: 1.1, color: primary),
        headlineMedium: TextStyle(fontFamily: 'Bricolage Grotesque', fontSize: CinqFontSize.h2, fontWeight: FontWeight.w700, height: 1.1, color: primary),
        headlineSmall: TextStyle(fontFamily: 'Geist', fontSize: CinqFontSize.h3, fontWeight: FontWeight.w500, height: 1.25, color: primary),
        titleLarge: TextStyle(fontFamily: 'Geist', fontSize: CinqFontSize.h4, fontWeight: FontWeight.w500, height: 1.25, color: primary),
        titleMedium: TextStyle(fontFamily: 'Geist', fontSize: CinqFontSize.h5, fontWeight: FontWeight.w500, height: 1.25, color: primary),
        titleSmall: TextStyle(fontFamily: 'Geist Mono', fontSize: CinqFontSize.h6, fontWeight: FontWeight.w400, height: 1, letterSpacing: 0.08 * CinqFontSize.h6, color: secondary),
        bodyLarge: TextStyle(fontFamily: 'Geist', fontSize: CinqFontSize.bodyL, fontWeight: FontWeight.w400, height: 1.45, color: primary),
        bodyMedium: TextStyle(fontFamily: 'Geist', fontSize: CinqFontSize.body, fontWeight: FontWeight.w400, height: 1.6, color: primary),
        bodySmall: TextStyle(fontFamily: 'Geist', fontSize: CinqFontSize.bodyS, fontWeight: FontWeight.w400, height: 1.5, color: secondary),
        labelLarge: TextStyle(fontFamily: 'Geist', fontSize: CinqFontSize.nav, fontWeight: FontWeight.w500, height: 1, letterSpacing: -0.01 * CinqFontSize.nav, color: primary),
        labelMedium: TextStyle(fontFamily: 'Geist Mono', fontSize: CinqFontSize.overline, fontWeight: FontWeight.w400, height: 1, letterSpacing: 0.08 * CinqFontSize.overline, color: secondary),
        labelSmall: TextStyle(fontFamily: 'Geist Mono', fontSize: CinqFontSize.badge, fontWeight: FontWeight.w400, height: 1, letterSpacing: 0.08 * CinqFontSize.badge, color: secondary),
      );

  static ThemeData dark() => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: CinqColorsDark.surfaceCanvas,
        canvasColor: CinqColorsDark.surfaceCanvas,
        cardColor: CinqColorsDark.surfacePrimary,
        dividerColor: CinqColorsDark.lineHairline,
        colorScheme: const ColorScheme.dark(
          primary: CinqColorsDark.accentFill,
          onPrimary: CinqColorsDark.textOnAccent,
          secondary: CinqColorsDark.accentText,
          surface: CinqColorsDark.surfacePrimary,
          onSurface: CinqColorsDark.textPrimary,
          error: CinqColorsDark.feedbackDangerSolid,
          onError: CinqColorsDark.feedbackDangerOnSolid,
          outline: CinqColorsDark.lineStandard,
        ),
        textTheme: _text(CinqColorsDark.textPrimary, CinqColorsDark.textSecondary),
        splashFactory: NoSplash.splashFactory,
        pageTransitionsTheme: const PageTransitionsTheme(builders: {
          TargetPlatform.android: CinqPageTransitionsBuilder(),
          TargetPlatform.iOS: CinqPageTransitionsBuilder(),
        }),
        extensions: [
          const CinqMotion(),
          const CinqGradients(dark: true),
          const CinqGlow(ambient: CinqGradientsDark.ambienceAccent, backlight: CinqGradientsDark.backlightAccent),
        ],
      );

  static ThemeData light() => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        scaffoldBackgroundColor: CinqColorsLight.surfaceCanvas,
        canvasColor: CinqColorsLight.surfaceCanvas,
        cardColor: CinqColorsLight.surfacePrimary,
        dividerColor: CinqColorsLight.lineHairline,
        colorScheme: const ColorScheme.light(
          primary: CinqColorsLight.accentFill,
          onPrimary: CinqColorsLight.textOnAccent,
          secondary: CinqColorsLight.accentText,
          surface: CinqColorsLight.surfacePrimary,
          onSurface: CinqColorsLight.textPrimary,
          error: CinqColorsLight.feedbackDangerSolid,
          onError: CinqColorsLight.feedbackDangerOnSolid,
          outline: CinqColorsLight.lineStandard,
        ),
        textTheme: _text(CinqColorsLight.textPrimary, CinqColorsLight.textSecondary),
        splashFactory: NoSplash.splashFactory,
        pageTransitionsTheme: const PageTransitionsTheme(builders: {
          TargetPlatform.android: CinqPageTransitionsBuilder(),
          TargetPlatform.iOS: CinqPageTransitionsBuilder(),
        }),
        extensions: [
          const CinqMotion(),
          const CinqGradients(dark: false),
          const CinqGlow(ambient: CinqGradientsLight.ambienceAccent, backlight: CinqGradientsLight.backlightAccent),
        ],
      );
}

/// The route transition: fade + 24px rise over \`page\` with the out curve;
/// the outgoing page fades over \`base\`. Matches motion.css view transitions.
class CinqPageTransitionsBuilder extends PageTransitionsBuilder {
  const CinqPageTransitionsBuilder();
  @override
  Widget buildTransitions<T>(PageRoute<T> route, BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
    final curved = CurvedAnimation(parent: animation, curve: CinqCurve.out);
    return FadeTransition(
      opacity: curved,
      child: SlideTransition(
        position: Tween<Offset>(begin: const Offset(0, 0.03), end: Offset.zero).animate(curved),
        child: child,
      ),
    );
  }
}
`;
}

/* ── write / check ─────────────────────────────────────────────────────── */
const outputs = {
  "variables.css": buildVariablesCss(),
  "tailwind.v4.css": buildTailwindV4(),
  "tailwind.config.ts": buildTailwindConfig(),
  "react_tokens.ts": buildReactTokens(),
  "motion.css": buildMotionCss(),
  "flutter_theme.dart": buildFlutter(),
};
const hash = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
outputs["manifest.json"] =
  JSON.stringify(
    {
      source: hash(fs.readFileSync(SRC, "utf8")),
      tokens: flat.size,
      files: Object.fromEntries(Object.entries(outputs).map(([k, v]) => [k, hash(v)])),
    },
    null,
    2,
  ) + "\n";

if (errors.length) {
  console.error("tokens: errors");
  for (const e of [...new Set(errors)]) console.error("  " + e);
  process.exit(1);
}

if (CHECK) {
  const stale = [];
  for (const [name, content] of Object.entries(outputs)) {
    const f = path.join(OUT, name);
    if (!fs.existsSync(f)) stale.push(`${name} missing`);
    else if (fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n") !== content) stale.push(`${name} stale`);
  }
  if (stale.length) {
    console.error("tokens:check failed");
    for (const s of stale) console.error("  " + s);
    process.exit(1);
  }
  console.log(`tokens:check ok · ${flat.size} tokens · ${Object.keys(outputs).length} files current`);
} else {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, content] of Object.entries(outputs)) fs.writeFileSync(path.join(OUT, name), content);
  console.log(`tokens:build · ${flat.size} tokens → ${Object.keys(outputs).join(", ")}`);
}
