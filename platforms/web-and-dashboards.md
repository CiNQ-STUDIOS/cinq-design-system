# Web and dashboards

Archetypes 1, 2, 3, 5, 8 on the web. Stack defaults: Next.js App Router, Tailwind v4 via `implementations/tailwind.v4.css` (or v3 via `tailwind.config.ts`), Motion for component state, GSAP only where scroll motion is allowed (marketing), Phosphor icons, `next/font/local`, `code/theme-init.ts`.

## 1. Shell

```
<html class="[light] [contrast]" data-motion data-density>
  <body>
    <a class="cq-sr-only" href="#main">Skip to main</a>
    <div class="app">            grid: sidebar 264 | content
      <aside class="cq-sidebar">  archetype nav
      <div class="content">
        <header class="cq-topbar-app">   56 sticky
        <main id="main" data-density="compact">
          page header · regions
        <div class="cq-toast-region">
```

Sidebar collapses per `navigation.md`; content area max `layout-app-max` 1600 with `--gap-lg` gutters; the page header is part of `main`, not the app bar.

## 2. Density and text size

`data-density="compact"` on `main` for dashboards and workspaces; `dense` opt-in per table via a toolbar toggle (stored per user); `Text size: Large` raises `--body-size` and `--control-h`.

## 3. Tables

`components/data-surfaces.md`: virtualised, sticky header, pinned first column, drawer detail, bulk bar, saved views. Keyboard map from `patterns/search-and-command.md` §6.

## 4. Action drawers

Record view and edit in a 480 drawer (T3.3) over the table; creation of short records too; long records route to archetype 5.

## 5. Breadcrumbs and titles

Breadcrumbs in the app bar on desktop (≤ 4), the `<title>` is `Orders · Branch 1 · CiNQ RMS`; the page header carries the `h1`.

## 6. Performance

- Route-level code splitting; the console bundle excludes charts; charts lazy.
- Fonts: preload Geist 400 and Bricolage variable; `display: swap`.
- Images `next/image`, `sizes` set, `priority` only on the first screen's hero.
- `content-visibility: auto` on offscreen regions in long pages.
- Lighthouse (dashboard, throttled mobile): Performance ≥ 80, Accessibility 100, Best practices 100; console TTI ≤ 3s on a mid-range laptop.
- Motion budget per `foundations/motion.md` §5; no scroll-linked effects in apps.

## 7. Browser support

Last 2 versions of Chrome, Edge, Firefox, Safari; Safari 16.4+ for `color-mix`; `@supports` fallbacks for `backdrop-filter` (solid), View Transitions (opacity fade), `linear()` easings (the cubic-bezier `out`). No IE. Tills run Chrome in kiosk mode.

## 8. Dark/light in the browser

`color-scheme` set; native scrollbars and form controls follow; `<meta name="theme-color">` updated on toggle (`code/theme-init.ts`); favicon is the ink tile in both modes.

## 9. Do / don't

Do: one primary per view, tables over cards, drawers over modals, `⌘K`. Don't: a hero on a dashboard, bento module cards, glass on scrolling panels, Material/Bootstrap defaults surviving migration (see `MIGRATION_PLAYBOOK.md`).
