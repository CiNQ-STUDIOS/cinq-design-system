/**
 * CiNQ Stylelint config. Install stylelint in the product and point it here:
 *   npx stylelint --config brand/design-system/tooling/lint/stylelint.config.cjs "src/**/*.css"
 * Every rule mirrors tooling/lint/eslint.config.mjs for stylesheets: no
 * literal colours, gradients, shadows, easings, durations, z-indexes or
 * font families; no auto-fit grids; backdrop-filter only via the token.
 */
module.exports = {
  rules: {
    "color-no-hex": true,
    "function-disallowed-list": ["rgb", "rgba", "hsl", "hsla", "oklch", "linear-gradient", "radial-gradient", "conic-gradient", "cubic-bezier"],
    "declaration-property-value-disallowed-list": {
      "/^(transition|animation)(-duration)?$/": ["/\b\d+(\.\d+)?m?s\b/"],
      "box-shadow": ["/^(?!var\().+/"],
      "z-index": ["/^\d+$/"],
      "font-family": ["/^(?!var\().+/"],
      "grid-template-columns": ["/repeat\(\s*auto-fit/"],
      "backdrop-filter": ["/blur\(\s*\d/"],
      "color": ["/var\(--accent-fill\)/"],
    },
    "declaration-property-value-allowed-list": {
      "font-weight": ["400", "500", "700", "800", "/^var\(/"],
    },
    "selector-max-id": 0,
    "declaration-no-important": true,
  },
  ignoreFiles: ["**/implementations/**", "**/node_modules/**"],
};
