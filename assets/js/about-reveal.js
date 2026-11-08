// About timeline: slides in from the right when it scrolls into view, as on
// the live site. Skipped under prefers-reduced-motion, and without
// JavaScript the timeline is simply shown.
(() => {
  const box = document.querySelector("[data-about-reveal]");
  if (!box || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = box.getBoundingClientRect();
  if (rect.top < window.innerHeight) return; // already on screen at load
  box.classList.add("is-hidden");
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    box.classList.add("is-shown");
    box.classList.remove("is-hidden");
    io.disconnect();
  }, { threshold: 0.2 });
  io.observe(box);
})();
