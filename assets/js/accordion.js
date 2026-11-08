// FAQ accordion: closed on load, as on the live site; each question toggles
// its own answer. The open and close animation is a CSS grid transition,
// switched off under prefers-reduced-motion by _base.scss.
document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  accordion.classList.add("is-ready");
  accordion.querySelectorAll(".accordion__button").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    const set = (open) => {
      button.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
    };
    set(false);
    button.addEventListener("click", () => set(button.getAttribute("aria-expanded") !== "true"));
  });
});
