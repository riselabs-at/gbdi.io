// Home platform steps: three tabs that switch the chart panel, cycling every
// 3 s as on the live site. Autoplay stops for good once someone uses the
// tabs, pauses while the pointer or focus is inside, and never starts under
// prefers-reduced-motion. Arrow keys, Home and End move between tabs.
(() => {
  const root = document.querySelector("[data-home-tabs]");
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  let current = 0;
  let timer = null;
  let stopped = false;
  let paused = false;

  const select = (i, focus) => {
    current = (i + tabs.length) % tabs.length;
    tabs.forEach((t, n) => {
      const on = n === current;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[n].hidden = !on;
    });
    // Restart the bar animation in the newly shown panel.
    panels[current].classList.remove("is-shown");
    void panels[current].offsetWidth;
    panels[current].classList.add("is-shown");
    if (focus) tabs[current].focus();
  };

  const stop = () => { stopped = true; clearInterval(timer); };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => { stop(); select(i); });
    tab.addEventListener("keydown", (e) => {
      const moves = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in moves) { e.preventDefault(); stop(); select(current + moves[e.key], true); }
      if (e.key === "Home") { e.preventDefault(); stop(); select(0, true); }
      if (e.key === "End") { e.preventDefault(); stop(); select(tabs.length - 1, true); }
    });
  });
  ["mouseenter", "focusin"].forEach((ev) => root.addEventListener(ev, () => { paused = true; }));
  ["mouseleave", "focusout"].forEach((ev) => root.addEventListener(ev, () => { paused = false; }));

  select(0);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    timer = setInterval(() => { if (!stopped && !paused && !document.hidden) select(current + 1); }, 3000);
  }
})();
