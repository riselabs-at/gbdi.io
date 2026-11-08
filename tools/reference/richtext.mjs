// Extracts every rich-text block of a captured Framer page as clean HTML,
// word for word, with its position. Page text in the rebuild is copied from
// this output, so the wording, bold, links and lists match the live site
// exactly (work order 0.1 and 3.4).
//
//   node tools/reference/richtext.mjs <slug> [width] [--all]
//
// Prints one block per line group: "y x w" and the HTML. Hidden blocks (other
// layouts, closed accordions) are left out unless --all is given.

import { launch, openFramer } from "./framer.mjs";

const [slug, w = "1440", flag] = process.argv.slice(2);
const browser = await launch();
const { context, page } = await openFramer(browser, slug, Number(w));
const blocks = await page.evaluate((all) => {
  const keep = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "UL", "OL", "LI", "STRONG", "B", "EM", "I", "A", "BR", "IMG", "SUP", "SUB", "U"]);
  const clean = (node) => {
    if (node.nodeType === 3) return node.nodeValue.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
    if (node.nodeType !== 1) return "";
    const inner = [...node.childNodes].map(clean).join("");
    const tag = node.tagName;
    if (!keep.has(tag)) return inner;
    const t = tag.toLowerCase();
    if (t === "br") return "<br>";
    if (t === "img") {
      const src = (node.getAttribute("src") || "").split("/").pop().split("?")[0];
      return `<img src="${src}" width="${node.width}" height="${node.height}" alt="${node.getAttribute("alt") || ""}">`;
    }
    let attrs = "";
    if (t === "a") attrs = ` href="${node.getAttribute("href")}"`;
    // Framer marks bold and colour with spans and CSS; keep weight as <strong>.
    return `<${t}${attrs}>${inner}</${t}>`;
  };
  const boldSpans = (root) => {
    for (const s of root.querySelectorAll("span")) {
      const fw = parseInt(getComputedStyle(s).fontWeight, 10);
      const parentFw = parseInt(getComputedStyle(s.parentElement).fontWeight, 10);
      if (fw >= 600 && parentFw < 600) {
        const strong = document.createElement("strong");
        strong.innerHTML = s.innerHTML; s.replaceWith(strong);
      }
    }
  };
  const out = [];
  for (const el of document.querySelectorAll('[data-framer-component-type="RichTextContainer"]')) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const hidden = r.width === 0 || r.height === 0 || cs.visibility === "hidden" || el.closest("[hidden]");
    if (hidden && !all) continue;
    const copy = el.cloneNode(true);
    document.body.appendChild(copy); copy.style.position = "absolute"; copy.style.left = "-99999px";
    boldSpans(copy);
    const html = [...copy.childNodes].map(clean).join("").replace(/\s+/g, " ").replace(/<\/(p|h\d|li|ul|ol)>\s*/g, "</$1>\n").trim();
    copy.remove();
    out.push({ y: Math.round(r.top + scrollY), x: Math.round(r.left), w: Math.round(r.width), html });
  }
  return out.sort((a, b) => a.y - b.y || a.x - b.x);
}, flag === "--all");
for (const b of blocks) console.log(`--- ${b.y} ${b.x} ${b.w}\n${b.html}`);
await context.close();
await browser.close();
