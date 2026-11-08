// About intro: the sentence darkens in three steps as the page scrolls, as
// on the live site, where Framer switches variants when four trigger points
// at the top of the page scroll out of view (after 32, 64 and 96 px).
// Scrolling back up returns to the earlier state, as Framer does.
(() => {
  const intro = document.querySelector("[data-about-intro]");
  if (!intro) return;
  const steps = [32, 64, 96];
  const update = () => {
    const y = window.scrollY;
    steps.forEach((at, i) => intro.classList.toggle(`s${i + 1}`, y >= at));
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
})();
