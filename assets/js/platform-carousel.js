// Benefit card carousel on /platform: back and next arrows, dots and swipe,
// looping endlessly as on the live site. The track holds three copies of
// the cards; after moving into the first or last copy it jumps back to the
// middle one without animation. Arrows and dots stay hidden until this
// script runs. Under reduced motion, cards change without sliding.
document.querySelectorAll("[data-carousel]").forEach((root) => {
  const track = root.querySelector(".pf-carousel__track");
  const viewport = root.querySelector(".pf-carousel__viewport");
  const dots = [...root.querySelectorAll(".pf-carousel__dot")];
  const n = dots.length;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pos = n; // first card of the middle copy
  let busy = false;

  const render = (animate) => {
    track.classList.toggle("is-animated", animate && !reduce.matches);
    track.style.setProperty("--pos", pos);
    root.style.setProperty("--pos", pos);
    const active = ((pos - n) % n + n) % n;
    dots.forEach((d, i) => d.setAttribute("aria-current", String(i === active)));
  };
  const settle = () => {
    if (pos >= 2 * n || pos < n) { pos = ((pos - n) % n + n) % n + n; render(false); }
    busy = false;
  };
  const go = (next) => {
    if (busy) return;
    busy = !reduce.matches;
    pos = next;
    render(true);
    if (reduce.matches) settle();
    else setTimeout(settle, 550); // the slide takes 0.5 s
  };

  viewport.setAttribute("aria-live", "polite");
  root.querySelector(".pf-carousel__arrow--prev").addEventListener("click", () => go(pos - 1));
  root.querySelector(".pf-carousel__arrow--next").addEventListener("click", () => go(pos + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => go(n + i)));

  // Swipe on touch screens and drag with a mouse.
  let startX = null;
  viewport.addEventListener("pointerdown", (e) => { startX = e.clientX; });
  viewport.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(pos + (dx < 0 ? 1 : -1));
  });

  root.querySelectorAll("[hidden]").forEach((el) => { el.hidden = false; });
  render(false);
});
