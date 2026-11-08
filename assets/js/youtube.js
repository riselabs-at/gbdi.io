// Swaps the video poster for the YouTube player on click, with the
// parameters the live Framer embed used (iv_load_policy, rel,
// modestbranding, playsinline), plus autoplay so one click starts it.
document.querySelectorAll(".yt[data-yt]").forEach((box) => {
  const poster = box.querySelector(".yt__poster");
  poster.addEventListener("click", (event) => {
    event.preventDefault();
    const frame = document.createElement("iframe");
    frame.src = "https://www.youtube.com/embed/" + box.dataset.yt +
      "?iv_load_policy=3&rel=0&modestbranding=1&playsinline=1&autoplay=1";
    frame.title = box.dataset.title || "YouTube video";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.setAttribute("frameborder", "0");
    box.replaceChildren(frame);
    frame.focus();
  });
});
