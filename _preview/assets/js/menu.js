// Phone and tablet menu: the button opens and closes the menu card. The
// button stays hidden until this script runs, so nobody is shown a control
// that cannot work. Escape and a click outside close it.
(() => {
  const toggle = document.querySelector(".site-header__toggle");
  const menu = document.getElementById("site-menu");
  if (!toggle || !menu) return;
  toggle.hidden = false;
  const set = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
  };
  toggle.addEventListener("click", () => set(menu.hidden));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) { set(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) set(false);
  });
})();
