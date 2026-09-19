/**
 * CiNQ · Tailwind v3 preset
 *
 *   // tailwind.config.js
 *   module.exports = { presets: [require("./brand/design-system/tokens/tailwind-v3.cjs")], content: [...] };
 *
 * Every value points at the custom property from tokens.css, so the mode
 * switch (html.light) and the density attribute keep working. tokens.css
 * must still be imported once, before Tailwind's layers.
 */
const v = (name) => `var(--${name})`;

const ramp = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((s) => [s, v(`vermilion-${s}`)]),
);

module.exports = {
  darkMode: ["class", "html:not(.light)"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: v("accent"),
          hover: v("accent-hover"),
          active: v("accent-active"),
          deep: v("accent-deep"),
          text: v("accent-text"),
        },
        "on-accent": v("on-accent"),
        focus: v("focus-ring"),
        vermilion: ramp,
        canvas: { DEFAULT: v("canvas"), 2: v("canvas-2"), 3: v("canvas-3"), 4: v("canvas-4"), warm: v("canvas-warm") },
        app: {
          canvas: v("app-canvas"),
          surface: v("app-surface"),
          raised: v("app-raised"),
          sunken: v("app-sunken"),
          inverse: v("app-inverse"),
          "on-inverse": v("app-on-inverse"),
        },
        line: { DEFAULT: v("line"), strong: v("line-strong"), selected: v("line-selected") },
        text: { DEFAULT: v("text"), 2: v("text-2"), 3: v("text-3"), inverse: v("text-inverse") },
        ink: { DEFAULT: v("ink"), 2: v("ink-2"), 3: v("ink-3"), 4: v("ink-4"), warm: v("ink-warm") },
        bone: { DEFAULT: v("bone"), 2: v("bone-2"), 3: v("bone-3") },
        amber: v("amber"),
        positive: { DEFAULT: v("positive"), text: v("positive-text"), soft: v("positive-soft") },
        "on-positive": v("on-positive"),
        negative: { DEFAULT: v("negative"), text: v("negative-text"), soft: v("negative-soft") },
        "on-negative": v("on-negative"),
        attention: { DEFAULT: v("attention"), text: v("attention-text"), soft: v("attention-soft") },
        "on-attention": v("on-attention"),
        info: { DEFAULT: v("info"), text: v("info-text"), soft: v("info-soft") },
        "on-info": v("on-info"),
        footer: {
          bg: v("footer-bg"),
          text: v("footer-text"),
          "text-2": v("footer-text-2"),
          line: v("footer-line"),
          accent: v("footer-accent"),
        },
        chart: { 1: v("chart-1"), 2: v("chart-2"), 3: v("chart-3"), 4: v("chart-4"), 5: v("chart-5"), 6: v("chart-6"), grid: v("chart-grid") },
      },
      fontFamily: {
        display: v("font-display"),
        sans: v("font-sans"),
        mono: v("font-mono"),
      },
      fontSize: {
        display: [v("text-display"), { lineHeight: v("leading-display"), letterSpacing: v("tracking-display") }],
        hero: [v("text-hero"), { lineHeight: v("leading-display"), letterSpacing: v("tracking-display") }],
        title: [v("text-title"), { lineHeight: v("leading-tight"), letterSpacing: v("tracking-display") }],
        slab: [v("text-slab"), { lineHeight: v("leading-tight") }],
        section: [v("text-section"), { lineHeight: v("leading-tight") }],
        lead: [v("text-lead"), { lineHeight: v("leading-lead") }],
        subheading: [v("text-subheading"), { lineHeight: v("leading-body") }],
        body: [v("text-body"), { lineHeight: v("leading-body") }],
        label: [v("text-label"), { lineHeight: "1.5" }],
        nav: [v("text-nav"), { lineHeight: "1" }],
        kicker: [v("text-kicker"), { lineHeight: "1", letterSpacing: v("tracking-mono") }],
        eyebrow: [v("text-eyebrow"), { lineHeight: "1", letterSpacing: v("tracking-mono") }],
        "bottom-nav": [v("text-bottom-nav"), { lineHeight: "1" }],
        numeral: [v("text-numeral"), { lineHeight: "1", letterSpacing: v("tracking-display-tight") }],
      },
      borderRadius: {
        control: v("radius-control"),
        slab: v("radius-slab"),
        panel: v("radius-panel"),
        sheet: v("radius-sheet"),
        pill: v("radius-pill"),
        marketing: v("radius-marketing"),
        "marketing-sm": v("radius-marketing-sm"),
        card: v("radius-marketing"),
        "card-sm": v("radius-marketing-sm"),
      },
      boxShadow: {
        slab: v("shadow-slab"),
        strong: v("shadow-strong"),
        pressed: v("shadow-pressed"),
        sheet: v("shadow-sheet"),
        bezel: v("shadow-bezel"),
      },
      spacing: {
        pad: v("pad"),
        nav: v("nav-h"),
        sidebar: v("sidebar-w"),
        "bottom-nav": v("bottom-nav-h"),
        control: v("control-h"),
        "control-x": v("control-pad-x"),
        gap: v("gap"),
        "gap-lg": v("gap-lg"),
        row: v("row-h"),
        touch: v("touch-min"),
      },
      maxWidth: {
        page: v("page-max"),
        app: v("app-max"),
        nav: v("nav-max"),
        prose: v("prose-max"),
      },
      transitionTimingFunction: {
        out: v("ease-out"),
        io: v("ease-io"),
      },
      transitionDuration: {
        fast: v("dur-fast"),
        base: v("dur-base"),
        slow: v("dur-slow"),
        reveal: v("dur-reveal"),
        page: v("dur-page"),
      },
    },
  },
};
