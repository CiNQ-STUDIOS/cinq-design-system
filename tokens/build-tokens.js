/**
 * Mirrors tokens.css into tokens.ts and tokens.json so the three can never
 * disagree. Run after any change to tokens.css:
 *
 *   node brand/design-system/tokens/build-tokens.js
 *
 * Parses the `:root`, `html.light` and `[data-density=...]` blocks. Values
 * are kept as CSS strings (a `var()` or `color-mix()` stays as written);
 * consumers that need a raw hex read the `raw` map, which resolves aliases
 * one level deep.
 */
const fs = require("fs");
const path = require("path");

const here = (...p) => path.resolve(__dirname, ...p);
const css = fs.readFileSync(here("tokens.css"), "utf8");

function block(selector) {
  const start = css.indexOf(selector + " {");
  if (start < 0) throw new Error("no block " + selector);
  const open = css.indexOf("{", start);
  let depth = 1;
  let i = open + 1;
  while (depth && i < css.length) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") depth--;
    i++;
  }
  return css.slice(open + 1, i - 1);
}

function parse(body) {
  const out = {};
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of clean.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

const dark = parse(block(":root"));
const light = parse(block("html.light"));
const compact = parse(block('[data-density="compact"]'));
const dense = parse(block('[data-density="dense"]'));

function resolve(map) {
  const raw = {};
  for (const [k, v] of Object.entries(map)) {
    const m = v.match(/^var\(--([a-z0-9-]+)\)$/);
    raw[k] = m && map[m[1]] ? map[m[1]] : v;
  }
  return raw;
}

const lightFull = { ...dark, ...light };
const json = {
  $schema: "cinq-tokens/1",
  version: "1.0.0",
  modes: { dark: resolve(dark), light: resolve(lightFull) },
  density: { comfortable: {}, compact, dense },
};
for (const k of Object.keys(compact)) json.density.comfortable[k] = dark[k];

fs.writeFileSync(here("tokens.json"), JSON.stringify(json, null, 2) + "\n");

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
function tsObject(map) {
  return (
    "{\n" +
    Object.entries(map)
      .map(([k, v]) => `  ${camel(k)}: ${JSON.stringify(v)},`)
      .join("\n") +
    "\n} as const"
  );
}
const ts = `/**
 * CiNQ design tokens · generated from tokens.css by build-tokens.js.
 * Do not edit by hand. Values are CSS strings; use \`cssVar\` in styles and
 * \`raw\` where a real colour is needed (charts, canvas, native).
 */

/** Every token name, as written in tokens.css (without the leading --). */
export const tokenNames = ${JSON.stringify(Object.keys(dark))} as const;
export type TokenName = (typeof tokenNames)[number];

/** var(--name) for use in inline styles and CSS-in-JS. */
export const cssVar = (name: TokenName) => \`var(--\${name})\`;

/** Dark mode (the default) with one level of alias resolution. */
export const dark = ${tsObject(resolve(dark))};

/** Light mode, complete: dark values overridden by the html.light block. */
export const light = ${tsObject(resolve(lightFull))};

export const density = {
  comfortable: ${tsObject(json.density.comfortable)},
  compact: ${tsObject(compact)},
  dense: ${tsObject(dense)},
} as const;

export type Mode = "dark" | "light";
export const raw = { dark, light } as const;

/** Chart series in their fixed order. Same data, same colour, everywhere. */
export const chartSeries = (mode: Mode = "dark") =>
  [1, 2, 3, 4, 5, 6].map((i) => raw[mode][\`chart\${i}\` as keyof typeof dark]);

/** The motion vocabulary as numbers, for GSAP and Motion. */
export const motion = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  reveal: 0.9,
  page: 0.7,
  stagger: 0.06,
} as const;
`;
fs.writeFileSync(here("tokens.ts"), ts);

console.log(
  `tokens.json and tokens.ts written: ${Object.keys(dark).length} tokens, ${Object.keys(light).length} light overrides`,
);
