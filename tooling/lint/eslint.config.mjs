/**
 * CiNQ ESLint flat config.
 *
 * One rule, `cinq/no-literal-design-values`, fails any string literal,
 * template literal or JSX style value in a component file that carries a
 * design value which should be a token: a hex or rgb colour, a gradient,
 * a shadow, a cubic-bezier, a raw duration inside a transition or
 * animation, a z-index integer, or a font family. It also fails the two
 * known reskin tells: `grid-template-columns: repeat(auto-fit` and a
 * primitive token (`--color-*`) used directly in a component.
 *
 *   npx eslint --config tooling/lint/eslint.config.mjs src
 *
 * Extend with your framework's config; keep this object first so its
 * rule applies everywhere. Copy into a product as `eslint.config.mjs`.
 */

import tsParser from "@typescript-eslint/parser";

const HEX = /#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;
const RGB = /\brgba?\(|\bhsla?\(|\boklch\(/i;
const GRADIENT = /\b(linear|radial|conic)-gradient\(/i;
const SHADOW = /\bbox-shadow\s*:\s*(?!var\()|\bshadow-\[|\bdrop-shadow\(/i;
const BEZIER = /cubic-bezier\(/i;
const DURATION = /\b(transition|animation)(-duration)?\s*:\s*[^;]*\b\d+(\.\d+)?m?s\b/i;
const TW_DURATION = /\b(duration|delay)-\[\d+m?s\]/i;
const TW_COLOR = /\b(bg|text|border|from|to|via|fill|stroke|ring|shadow|outline)-\[#|\b(bg|text|border)-\[(rgb|hsl)/i;
const ZINDEX = /\bz-index\s*:\s*\d+|\bz-\[\d+\]/i;
const FONT = /\bfont-family\s*:\s*(?!var\()|\bfont-\[/i;
const PRIMITIVE = /var\(--color-(neutral|vermilion|ink|bone|paper|graphite|mint|gold|rose|sky|lilac|amber)[-a-z0-9]*\)/i;
const BENTO = /grid-template-columns\s*:\s*repeat\(\s*auto-fit|\bgrid-cols-\[repeat\(auto-fit/i;
const BLUR_LITERAL = /backdrop-filter\s*:\s*blur\(\s*\d/i;
const ACCENT_FILL_TEXT = /\bcolor\s*:\s*var\(--accent-fill\)|\btext-accent-fill\b|\btext-accent\b(?!-text)/;

const ALLOWED_HEX_FILES = /(mark|logo|og|opengraph|hero-canvas|shader|tokens|variables|flutter_theme|tailwind|theme-init)/i;

function check(text, filename) {
  const hits = [];
  const test = (re, msg) => re.test(text) && hits.push(msg);
  if (!ALLOWED_HEX_FILES.test(filename)) {
    test(HEX, "hex colour; use a semantic token (var(--surface-*), var(--text-*), …)");
    test(RGB, "rgb/hsl/oklch colour; use a token or color-mix over a token");
  }
  test(GRADIENT, "raw gradient; use var(--gradient-<name>) from the catalog");
  test(SHADOW, "raw shadow; use var(--shadow-<name>)");
  test(BEZIER, "raw cubic-bezier; use var(--ease-<name>) or easings.* from react_tokens");
  test(DURATION, "raw duration in a transition/animation; use var(--dur-<name>)");
  test(TW_DURATION, "Tailwind arbitrary duration; use duration-<name> from the preset");
  test(TW_COLOR, "Tailwind arbitrary colour; use a token utility");
  test(ZINDEX, "numeric z-index; use var(--z-<layer>)");
  test(FONT, "raw font-family; use var(--font-<role>)");
  test(PRIMITIVE, "primitive colour token in a component; use the semantic layer");
  test(BENTO, "auto-fit card grid (the bento tell); see layout-architecture/anti-bento-grammar.md");
  test(BLUR_LITERAL, "raw backdrop blur; use var(--blur-glass) and only on fixed chrome");
  test(ACCENT_FILL_TEXT, "accent fill used as a text colour; words use var(--accent-text)");
  return hits;
}

const rule = {
  meta: {
    type: "problem",
    docs: { description: "Design values must come from CiNQ tokens" },
    schema: [],
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    const report = (node, text) => {
      for (const h of check(text, filename)) context.report({ node, message: `cinq: ${h}` });
    };
    return {
      Literal(node) {
        if (typeof node.value === "string" && node.value.length > 2) report(node, node.value);
      },
      TemplateElement(node) {
        if (node.value.cooked && node.value.cooked.length > 2) report(node, node.value.cooked);
      },
      JSXAttribute(node) {
        if (node.name?.name === "style" && node.value?.expression?.type === "ObjectExpression") {
          for (const p of node.value.expression.properties) {
            if (p.value?.type === "Literal" && typeof p.value.value === "string") report(p, `${p.key?.name ?? ""}: ${p.value.value}`);
          }
        }
      },
    };
  },
};

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    ignores: ["**/node_modules/**", "**/implementations/**", "**/tooling/**", "**/*.config.*"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { cinq: { rules: { "no-literal-design-values": rule } } },
    rules: { "cinq/no-literal-design-values": "error" },
  },
];

export { check };
