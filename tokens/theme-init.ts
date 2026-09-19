/**
 * CiNQ · theme bootstrap
 *
 * Dark is the brand and the default. Light is an opt-in the user makes once
 * and the product remembers. This module gives every product the same three
 * things the website has: a pre-paint script so there is never a flash of
 * the wrong mode, a read/apply pair for a toggle, and a subscription for
 * anything (a shader, a chart) that must redraw on switch.
 *
 * Usage, Next.js App Router:
 *   <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
 *
 * Usage, plain HTML: paste the value of `themeInitScript` into a <script>
 * as the first child of <head>.
 *
 * The system preference is deliberately not consulted. The brand is dark;
 * a light OS does not make the site light. Products that want to honour
 * the OS preference on first run may set `followSystem: true` in the
 * product profile and use `themeInitScriptFollowingSystem` instead. Record
 * that in the deviation register.
 */

export const THEME_KEY = "cinq-theme";
export type Theme = "dark" | "light";

const CANVAS = { dark: "#0c0b0a", light: "#f4f1ea" } as const;

/** Runs before first paint. Adds `light` to <html> only when remembered. */
export const themeInitScript = `(function(){try{if(localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)})==="light"){document.documentElement.classList.add("light");}}catch(e){}})();`;

/** Same, but a first visit follows the OS preference. Opt in per product. */
export const themeInitScriptFollowingSystem = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});var l=s?s==="light":matchMedia("(prefers-color-scheme: light)").matches;if(l){document.documentElement.classList.add("light");}}catch(e){}})();`;

export function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = CANVAS[theme];
}

export function toggleTheme() {
  applyTheme(readTheme() === "light" ? "dark" : "light");
}

const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

/** Subscribe to mode changes by watching the root class list. */
export function subscribeTheme(cb: () => void) {
  listeners.add(cb);
  if (!observer && typeof document !== "undefined") {
    observer = new MutationObserver(() => listeners.forEach((l) => l()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }
  return () => {
    listeners.delete(cb);
  };
}
