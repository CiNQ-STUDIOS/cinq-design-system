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
export const CONTRAST_KEY = "cinq-contrast";
export const MOTION_KEY = "cinq-motion";
export type Theme = "dark" | "light";
export type Motion = "system" | "full" | "reduced";

const CANVAS = { dark: "#0c0b0a", light: "#f4f1ea" } as const;

/** Runs before first paint. Adds `light`, `contrast` and `data-motion` to
    <html> only when remembered; high contrast also follows
    `prefers-contrast: more` on a first visit. */
export const themeInitScript = `(function(){try{var d=document.documentElement,g=function(k){return localStorage.getItem(k)};if(g(${JSON.stringify(
  THEME_KEY,
)})==="light"){d.classList.add("light");}var c=g(${JSON.stringify(
  CONTRAST_KEY,
)});if(c==="high"||(c===null&&matchMedia("(prefers-contrast: more)").matches)){d.classList.add("contrast");}var m=g(${JSON.stringify(
  MOTION_KEY,
)});if(m==="reduced"){d.setAttribute("data-motion","reduced");}}catch(e){}})();`;

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

export function applyContrast(high: boolean) {
  document.documentElement.classList.toggle("contrast", high);
  try {
    localStorage.setItem(CONTRAST_KEY, high ? "high" : "standard");
  } catch {}
}

/** The in-app motion setting, distinct from the OS preference. */
export function applyMotion(motion: Motion) {
  const el = document.documentElement;
  if (motion === "reduced") el.setAttribute("data-motion", "reduced");
  else el.removeAttribute("data-motion");
  try {
    localStorage.setItem(MOTION_KEY, motion);
  } catch {}
}

/** True when either the OS or the in-app setting asks for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    document.documentElement.getAttribute("data-motion") === "reduced" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
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
