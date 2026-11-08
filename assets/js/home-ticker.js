// Home photo strip and text marquee: a slow, continuous drift to the left,
// as on the live site (about 14 px per second). Each ticker holds two copies
// of its content; the animation moves by exactly one copy and loops. The
// duration follows the measured width so the speed stays the same at every
// screen size. Under prefers-reduced-motion nothing moves (_base.scss).
(() => {
  const SPEED = 14; // px per second
  const set = () => {
    document.querySelectorAll("[data-ticker]").forEach((t) => {
      const first = t.querySelector(".h-ticker__set");
      const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
      const distance = first.getBoundingClientRect().width + gap;
      t.style.setProperty("--ticker-distance", `${-distance}px`);
      t.style.setProperty("--ticker-duration", `${distance / SPEED}s`);
      t.classList.add("is-running");
    });
  };
  if (document.readyState === "complete") set(); else window.addEventListener("load", set);
  let resize;
  window.addEventListener("resize", () => { clearTimeout(resize); resize = setTimeout(set, 200); });
})();
