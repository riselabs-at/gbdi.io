// Saves the inline SVG at a point of a captured Framer page as a standalone
// file. Framer draws many illustrations as <svg><use href="#id"></svg> with
// the shapes defined elsewhere in the page; this replaces each <use> with a
// copy of what it points to, so the file works on its own.
//
//   node tools/reference/svg-at.mjs <slug> <width> <x,y> <out.svg> [x,y out.svg ...]
//
// x,y are page coordinates as printed by measure.mjs.

import fs from "node:fs";
import { launch, openFramer } from "./framer.mjs";

const [slug, width, ...rest] = process.argv.slice(2);
const browser = await launch();
const { context, page } = await openFramer(browser, slug, Number(width));
for (let i = 0; i < rest.length; i += 2) {
  const [x, y] = rest[i].split(",").map(Number);
  const out = rest[i + 1];
  const svg = await page.evaluate(([x, y]) => {
    window.scrollTo(0, Math.max(0, y - 200));
    const hit = document.elementsFromPoint(x + 2, y + 2 - scrollY).find((e) => e.closest("svg"));
    if (!hit) return null;
    let svg = hit.closest("svg");
    while (svg.parentElement?.closest("svg")) svg = svg.parentElement.closest("svg");
    const copy = svg.cloneNode(true);
    const r = svg.getBoundingClientRect();
    // Resolve <use> references, repeatedly, since symbols can use others.
    for (let pass = 0; pass < 5; pass++) {
      const uses = copy.querySelectorAll("use");
      if (!uses.length) break;
      for (const u of uses) {
        const id = (u.getAttribute("href") || u.getAttribute("xlink:href") || "").replace(/^#/, "");
        const target = document.getElementById(id);
        if (!target) continue;
        const clone = target.cloneNode(true);
        clone.removeAttribute("id");
        if (clone.tagName.toLowerCase() === "svg" || clone.tagName.toLowerCase() === "symbol") {
          const g = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          for (const a of ["viewBox", "preserveAspectRatio", "fill", "stroke"]) if (clone.getAttribute(a)) g.setAttribute(a, clone.getAttribute(a));
          for (const a of ["x", "y", "width", "height"]) if (u.getAttribute(a)) g.setAttribute(a, u.getAttribute(a));
          if (!g.getAttribute("width")) { g.setAttribute("width", "100%"); g.setAttribute("height", "100%"); }
          g.innerHTML = clone.innerHTML;
          // Framer colours some shapes through CSS variables; bake in the value.
          u.replaceWith(g);
        } else {
          for (const a of ["fill", "stroke", "transform"]) if (u.getAttribute(a) && !clone.getAttribute(a)) clone.setAttribute(a, u.getAttribute(a));
          u.replaceWith(clone);
        }
      }
    }
    copy.removeAttribute("style");
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    if (!copy.getAttribute("viewBox")) copy.setAttribute("viewBox", `0 0 ${Math.round(r.width)} ${Math.round(r.height)}`);
    copy.setAttribute("width", Math.round(r.width));
    copy.setAttribute("height", Math.round(r.height));
    let html = copy.outerHTML;
    // Replace var(--token-..., fallback) with the fallback colour.
    html = html.replace(/var\(--[a-z0-9-]+,\s*(rgba?\([^)]*\)|#[0-9a-fA-F]+)\)/g, "$1");
    return html;
  }, [x, y]);
  if (!svg) { console.log(`no svg at ${x},${y}`); continue; }
  fs.writeFileSync(out, svg + "\n");
  console.log(`${out}: ${svg.length} bytes`);
}
await context.close();
await browser.close();
