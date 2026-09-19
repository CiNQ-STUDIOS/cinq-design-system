/* CiNQ showcase behaviour: the mode bar (dark / light / contrast / reduced
   motion / density), the mark, the spotlight pointer, and the labs'
   play buttons. No dependencies. The pre-paint part mirrors
   code/theme-init.ts. */
(function () {
  var d = document.documentElement;
  try {
    if (localStorage.getItem("cinq-theme") === "light") d.classList.add("light");
    if (localStorage.getItem("cinq-contrast") === "high") d.classList.add("contrast");
    if (localStorage.getItem("cinq-motion") === "reduced") d.setAttribute("data-motion", "reduced");
  } catch (e) {}
})();

window.CQ = (function () {
  var d = document.documentElement;
  var MARK = { size: 100, cx: 50, cy: 50, r: 33, stroke: 20, opening: 78, gap: 7, segments: 5 };
  function pt(deg) { var a = (deg * Math.PI) / 180; return [MARK.cx + MARK.r * Math.cos(a), MARK.cy - MARK.r * Math.sin(a)]; }
  function markSvg(cls) {
    var sweep = 360 - MARK.opening, seg = (sweep - MARK.gap * (MARK.segments - 1)) / MARK.segments, paths = "";
    for (var i = 0; i < MARK.segments; i++) {
      var a0 = MARK.opening / 2 + i * (seg + MARK.gap), a1 = a0 + seg, p0 = pt(a0), p1 = pt(a1);
      paths += '<path d="M ' + p0[0].toFixed(3) + " " + p0[1].toFixed(3) + " A 33 33 0 0 0 " + p1[0].toFixed(3) + " " + p1[1].toFixed(3) + '"/>';
    }
    return '<svg viewBox="0 0 100 100" class="' + (cls || "") + '" fill="none" stroke="currentColor" stroke-width="20" aria-hidden="true">' + paths + "</svg>";
  }
  function set(key, on, cls) { d.classList.toggle(cls, on); try { localStorage.setItem(key, on ? (cls === "light" ? "light" : "high") : (cls === "light" ? "dark" : "standard")); } catch (e) {} sync(); }
  function setMotion(reduced) { if (reduced) d.setAttribute("data-motion", "reduced"); else d.removeAttribute("data-motion"); try { localStorage.setItem("cinq-motion", reduced ? "reduced" : "full"); } catch (e) {} sync(); }
  function setDensity(v) { var main = document.querySelector("[data-density-root]") || document.body; if (v === "comfortable") main.removeAttribute("data-density"); else main.setAttribute("data-density", v); sync(); }
  function sync() {
    document.querySelectorAll("[data-mode]").forEach(function (b) {
      var m = b.getAttribute("data-mode"), on = false;
      if (m === "light") on = d.classList.contains("light");
      if (m === "contrast") on = d.classList.contains("contrast");
      if (m === "reduced") on = d.getAttribute("data-motion") === "reduced";
      if (m.indexOf("density:") === 0) { var root = document.querySelector("[data-density-root]") || document.body; on = (root.getAttribute("data-density") || "comfortable") === m.slice(8); }
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(d).getPropertyValue("--surface-canvas").trim();
  }
  function modebar(opts) {
    opts = opts || {};
    var bar = document.createElement("div");
    bar.className = "sc-modebar";
    bar.setAttribute("aria-label", "Appearance");
    var html = '<a href="' + (opts.home || "index.html") + '" aria-label="Showcase home" title="Showcase home">' + markSvg("") + "</a>";
    html += '<button type="button" data-mode="light" aria-pressed="false">Light</button>';
    html += '<button type="button" data-mode="contrast" aria-pressed="false">Contrast</button>';
    html += '<button type="button" data-mode="reduced" aria-pressed="false">Reduced motion</button>';
    if (opts.density) html += '<button type="button" data-mode="density:comfortable">Comfortable</button><button type="button" data-mode="density:compact">Compact</button><button type="button" data-mode="density:dense">Dense</button><button type="button" data-mode="density:touch">Touch</button>';
    bar.innerHTML = html;
    bar.querySelector("a").style.color = "var(--accent-fill)";
    bar.querySelector("a svg").style.width = "18px";
    bar.querySelector("a svg").style.height = "18px";
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-mode]"); if (!b) return;
      var m = b.getAttribute("data-mode");
      if (m === "light") set("cinq-theme", !d.classList.contains("light"), "light");
      else if (m === "contrast") set("cinq-contrast", !d.classList.contains("contrast"), "contrast");
      else if (m === "reduced") setMotion(d.getAttribute("data-motion") !== "reduced");
      else if (m.indexOf("density:") === 0) setDensity(m.slice(8));
    });
    document.body.appendChild(bar);
    document.querySelectorAll("[data-mark]").forEach(function (el) { el.innerHTML = markSvg(el.getAttribute("data-mark")); });
    sync();
  }
  // Spotlight: pointer position into --mx/--my on any .sc-spot (no state, direct style writes).
  document.addEventListener("pointermove", function (e) {
    var el = e.target.closest && e.target.closest(".sc-spot"); if (!el || e.pointerType !== "mouse") return;
    var r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) + "px");
    el.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
  // Labs: replay a .sc-dur / .sc-ease / [data-replay] block.
  function replay(el) { el.classList.remove("play"); void el.offsetWidth; el.classList.add("play"); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-play]"); if (!b) return;
    var sel = b.getAttribute("data-play");
    document.querySelectorAll(sel).forEach(replay);
  });
  return { markSvg: markSvg, modebar: modebar, replay: replay };
})();
