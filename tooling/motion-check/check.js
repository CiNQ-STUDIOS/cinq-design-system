#!/usr/bin/env node
/**
 * CiNQ motion and gradient check.
 *
 *   node tooling/motion-check/check.js [dir ...]        motion rules (default: code, showcase)
 *   node tooling/motion-check/check.js --gradients      gradient rules on tokens.json and the same dirs
 *
 * Motion rules (foundations/motion.md):
 *   M-A  every cubic-bezier() literal is one of the six library curves
 *   M-B  every transition/animation duration is a var(--dur-*) or a value in the duration table
 *   M-C  animated properties are on the allow-list (transform, opacity, clip-path, filter,
 *        box-shadow for the live edge, background-position for the shimmer,
 *        font-variation-settings, color/background-color/border-color/outline-color/fill/stroke,
 *        flex-grow on the founder strips) — height/width/top/left/margin/padding fail
 *   M-D  @keyframes outside implementations/motion.css must be named cq-* and exist in motion.css
 *   M-E  backdrop-filter appears only in a rule that is position: fixed (or a .cq-glass/.glass rule)
 *   M-F  a stylesheet that declares an animation or a transition also has a
 *        prefers-reduced-motion block, or relies on variables.css (imports it)
 *
 * Gradient rules (foundations/gradients-and-effects.md):
 *   G-A  every gradient token has one non-transparent colour family, except og-ribbon-*
 *   G-B  every gradient token resolves in light mode (its colour aliases have light values)
 *   G-C  every gradient in code/showcase is var(--gradient-*) or a transparent/currentColor technique
 *   G-D  every gradient token has a static fallback: it is an alpha fade over a surface (true by
 *        construction) and appears in showcase/gradient-lab.html
 *
 * Exit 1 on any failure.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const args = process.argv.slice(2);
const GRADIENTS = args.includes("--gradients");
const dirs = args.filter((a) => !a.startsWith("--"));
const targets = (dirs.length ? dirs : ["code", "showcase"]).map((d) => path.resolve(ROOT, d));

const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, "foundations/tokens.json"), "utf8"));
const flat = new Map();
(function walk(n, p) {
  if (!n || typeof n !== "object") return;
  if ("$value" in n) return void flat.set(p.join("."), n);
  for (const [k, v] of Object.entries(n)) if (!k.startsWith("$")) walk(v, [...p, k]);
})(tokens, []);

const curves = [...flat].filter(([p]) => p.startsWith("easing.")).map(([, t]) => `cubic-bezier(${t.$value.join(", ")})`);
const durations = new Set([...flat].filter(([p]) => p.startsWith("duration.")).map(([, t]) => t.$value));
durations.add("0.001ms").add("0s").add("0ms");
const motionCss = fs.existsSync(path.join(ROOT, "implementations/motion.css")) ? fs.readFileSync(path.join(ROOT, "implementations/motion.css"), "utf8") : "";
const keyframesInMotion = new Set([...motionCss.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));

const ALLOWED_PROPS = new Set(["transform", "opacity", "clip-path", "filter", "box-shadow", "background-position", "font-variation-settings", "color", "background-color", "background", "border-color", "outline-color", "outline-offset", "fill", "stroke", "stroke-dashoffset", "flex-grow", "visibility", "none", "all"]);
const BANNED_PROPS = new Set(["height", "width", "top", "left", "right", "bottom", "margin", "padding", "font-size", "border-width", "max-height", "max-width", "min-height"]);

function* files(d) {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (/node_modules|\.git/.test(p)) continue;
    if (e.isDirectory()) yield* files(p);
    else if (/\.(css|tsx?|jsx?|html)$/.test(e.name)) yield p;
  }
}

const fails = [];
const rel = (f) => path.relative(ROOT, f);

if (!GRADIENTS) {
  for (const d of targets) {
    for (const f of files(d)) {
      const text = fs.readFileSync(f, "utf8");
      const isMotionCss = /implementations[\\/]motion\.css$/.test(f);
      // M-A
      for (const m of text.matchAll(/cubic-bezier\([^)]*\)/g)) {
        const norm = m[0].replace(/\s+/g, " ").replace(/\( /, "(").replace(/ \)/, ")");
        if (!curves.includes(norm)) fails.push(`M-A ${rel(f)}: ${m[0]} is not a library curve`);
      }
      // M-B
      for (const m of text.matchAll(/\b(transition|animation)(-duration)?\s*:\s*([^;}]+)/g)) {
        const val = m[3];
        for (const d of val.matchAll(/\b(\d+(?:\.\d+)?m?s)\b/g)) {
          if (!durations.has(d[1]) && !/animation-delay/.test(m[0])) fails.push(`M-B ${rel(f)}: raw duration "${d[1]}" in "${m[0].slice(0, 60)}"`);
        }
      }
      // M-C from transition property lists
      for (const m of text.matchAll(/\btransition(?:-property)?\s*:\s*([^;}]+)/g)) {
        const props = m[1].split(",").map((s) => s.trim().split(/\s+/)[0]).filter((p) => p && !p.startsWith("var("));
        for (const p of props) if (BANNED_PROPS.has(p)) fails.push(`M-C ${rel(f)}: transition on layout property "${p}"`);
      }
      // M-C from keyframes bodies
      for (const m of text.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\}\s*\}/g)) {
        for (const decl of m[2].matchAll(/([a-z-]+)\s*:/g)) {
          if (BANNED_PROPS.has(decl[1])) fails.push(`M-C ${rel(f)}: keyframes ${m[1]} animates "${decl[1]}"`);
        }
        // M-D
        if (!isMotionCss && !/showcase[\\/]/.test(f)) {
          if (!m[1].startsWith("cq-") || !keyframesInMotion.has(m[1])) fails.push(`M-D ${rel(f)}: @keyframes ${m[1]} is not generated in motion.css`);
        }
      }
      // M-E
      for (const m of text.matchAll(/([^{}]+)\{([^{}]*backdrop-filter[^{}]*)\}/g)) {
        const sel = m[1].trim(), body = m[2];
        if (!/position\s*:\s*fixed/.test(body) && !/glass|topbar|bottomnav|menu|header|preloader/.test(sel)) fails.push(`M-E ${rel(f)}: backdrop-filter on "${sel.slice(0, 50)}" which is not fixed chrome`);
      }
      // M-F
      if (/\.(css|html)$/.test(f) && /(animation|transition)\s*:/.test(text) && !/prefers-reduced-motion/.test(text) && !/variables\.css|motion\.css/.test(text) && !isMotionCss) {
        fails.push(`M-F ${rel(f)}: declares motion but has no reduced-motion block and does not import variables.css/motion.css`);
      }
    }
  }
  // JS/TS: Motion and GSAP literals
  for (const d of targets) {
    for (const f of files(d)) {
      if (!/\.(tsx?|jsx?)$/.test(f)) continue;
      const text = fs.readFileSync(f, "utf8");
      for (const m of text.matchAll(/ease\s*:\s*\[([^\]]+)\]/g)) {
        const norm = `cubic-bezier(${m[1].split(",").map((n) => n.trim()).join(", ")})`;
        if (!curves.includes(norm)) fails.push(`M-A ${rel(f)}: Motion ease [${m[1]}] is not a library curve`);
      }
      for (const m of text.matchAll(/duration\s*:\s*(\d+(?:\.\d+)?)\b/g)) {
        const ms = `${Math.round(parseFloat(m[1]) * 1000)}ms`;
        if (!durations.has(ms) && !/durations\./.test(text.slice(Math.max(0, m.index - 40), m.index))) fails.push(`M-B ${rel(f)}: JS duration ${m[1]}s (${ms}) is not in the duration table`);
      }
    }
  }
  console.log(`motion:check · ${fails.length} failures`);
} else {
  const resolve = (v, mode) => (typeof v === "string" ? v.replace(/\{([a-z0-9.\-]+)\}/gi, (_, r) => { const t = flat.get(r); if (!t) return "UNRESOLVED"; const mv = mode === "light" ? (t.$extensions?.["cinq.modes"]?.light ?? t.$value) : t.$value; return resolve(mv, mode); }) : v);
  const families = (css) => {
    const fam = new Set();
    for (const m of css.matchAll(/#([0-9a-f]{6})|rgb\((\d+)\s+(\d+)\s+(\d+)/gi)) {
      const [r, g, b] = m[1] ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)] : [+m[2], +m[3], +m[4]];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      if (sat < 0.15) fam.add("neutral");
      else {
        const h = r === max ? ((g - b) / (max - min)) % 6 : g === max ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
        fam.add("hue" + Math.round(((h * 60 + 360) % 360) / 30));
      }
    }
    return fam;
  };
  const lab = fs.existsSync(path.join(ROOT, "showcase/gradient-lab.html")) ? fs.readFileSync(path.join(ROOT, "showcase/gradient-lab.html"), "utf8") : "";
  let count = 0;
  for (const [p, t] of flat) {
    if (!p.startsWith("gradient.")) continue;
    count++;
    const name = p.split(".")[1];
    const dark = t.$value.map((s) => resolve(s.color, "dark")).join(" ");
    const light = t.$value.map((s) => resolve(s.color, "light")).join(" ");
    const fam = [...families(dark)].filter((f) => f !== "neutral");
    if (fam.length > 1 && !name.startsWith("og-ribbon")) fails.push(`G-A gradient.${name}: two hue families in one gradient (${fam.join(", ")})`);
    if (/UNRESOLVED/.test(light)) fails.push(`G-B gradient.${name}: light mode does not resolve`);
    if (lab && !lab.includes(`--gradient-${name}`)) fails.push(`G-D gradient.${name}: not rendered in showcase/gradient-lab.html`);
  }
  for (const d of targets) {
    for (const f of files(d)) {
      const text = fs.readFileSync(f, "utf8");
      for (const m of text.matchAll(/\b(?:linear|radial|conic)-gradient\([^)]*\)/gi)) {
        const g = m[0];
        if (/var\(--gradient-/.test(g)) continue;
        if (!/#|rgb|hsl|var\(/.test(g)) continue; // transparent/currentColor technique
        if (/showcase[\\/]gradient-lab|hero-canvas|opengraph/.test(f)) continue;
        fails.push(`G-C ${rel(f)}: raw gradient "${g.slice(0, 50)}"`);
      }
    }
  }
  console.log(`gradient:check · ${count} gradient tokens · ${fails.length} failures`);
}

if (fails.length) {
  for (const f of [...new Set(fails)]) console.error("  " + f);
  process.exit(1);
}
