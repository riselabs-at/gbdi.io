// Dumps an outline of a captured Framer page: every visible box and text run
// with its position, size, font, colour, background, border and radius.
// The rebuild's CSS is written from these numbers.
//
//   node tools/reference/measure.mjs <out-dir> [slug ...]
//
// Writes <out-dir>/<slug>-<width>.txt for 1440, 1024 and 390 px.

import fs from "node:fs";
import { launch, openFramer, PAGES, WIDTHS } from "./framer.mjs";

const out = process.argv[2] || ".visual/measure";
const only = process.argv.slice(3);
fs.mkdirSync(out, { recursive: true });

const browser = await launch();
for (const [, slug] of PAGES) {
  if (only.length && !only.includes(slug)) continue;
  for (const width of WIDTHS) {
    const { context, page } = await openFramer(browser, slug, width);
    const lines = await page.evaluate(() => {
      const rgb = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return c;
        const [r, g, b, a] = m[1].split(",").map((v) => parseFloat(v));
        if (a === 0) return "";
        const hex = "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
        return a !== undefined && a < 1 ? `${hex}/${a}` : hex;
      };
      const short = (f) => f.split(",")[0].replace(/"/g, "").replace(" Regular", "").replace(" Variable", "-V");
      const seen = [];
      const visible = (e) => {
        const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
        return true;
      };
      const walk = (e, depth) => {
        if (!visible(e)) return;
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) { for (const c of e.children) walk(c, depth); return; }
        const cs = getComputedStyle(e);
        const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join("").replace(/\s+/g, " ").trim();
        const bg = rgb(cs.backgroundColor);
        const bgi = cs.backgroundImage !== "none" ? "bgimg" : "";
        const border = cs.borderTopWidth !== "0px" || cs.borderBottomWidth !== "0px" || cs.borderLeftWidth !== "0px"
          ? `border:${cs.borderTopWidth}/${cs.borderRightWidth}/${cs.borderBottomWidth}/${cs.borderLeftWidth} ${rgb(cs.borderTopColor)}${cs.borderTopColor !== cs.borderBottomColor ? "|" + rgb(cs.borderBottomColor) : ""}` : "";
        const shadow = cs.boxShadow !== "none" ? "shadow:" + cs.boxShadow.replace(/rgba?\([^)]+\)/g, (m) => rgb(m)) : "";
        const radius = cs.borderRadius !== "0px" ? "r:" + cs.borderRadius : "";
        const op = parseFloat(cs.opacity) < 1 ? "op:" + cs.opacity : "";
        const tag = e.tagName.toLowerCase();
        const media = tag === "img" ? "img:" + (e.getAttribute("src") || "").split("/").pop().split("?")[0] + (e.style.objectFit || cs.objectFit ? " fit:" + cs.objectFit : "")
          : tag === "svg" ? "svg" : tag === "iframe" ? "iframe:" + e.src : "";
        const href = tag === "a" ? "href:" + e.getAttribute("href") : "";
        const text = own ? `"${own.slice(0, 90)}" ${short(cs.fontFamily)} ${cs.fontSize}/${cs.lineHeight} w${cs.fontWeight}${cs.letterSpacing !== "normal" ? " ls" + cs.letterSpacing : ""} ${rgb(cs.color)}${cs.textAlign !== "start" ? " " + cs.textAlign : ""}${cs.textDecorationLine !== "none" ? " " + cs.textDecorationLine : ""}${cs.textTransform !== "none" ? " " + cs.textTransform : ""}` : "";
        // Framer draws most borders on ::after (and some on ::before).
        const pseudo = ["::before", "::after"].map((p) => {
          const ps = getComputedStyle(e, p);
          if (!ps.content || ps.content === "none") return "";
          const w = [ps.borderTopWidth, ps.borderRightWidth, ps.borderBottomWidth, ps.borderLeftWidth];
          const parts = [];
          if (w.some((v) => v !== "0px")) parts.push(`${p.slice(2)}-border:${w.join("/")} ${rgb(ps.borderTopColor)}${ps.borderTopColor !== ps.borderBottomColor ? "|" + rgb(ps.borderBottomColor) : ""}`);
          if (ps.boxShadow !== "none") parts.push(`${p.slice(2)}-shadow:${ps.boxShadow.replace(/rgba?\([^)]+\)/g, (m) => rgb(m))}`);
          if (rgb(ps.backgroundColor)) parts.push(`${p.slice(2)}-bg:${rgb(ps.backgroundColor)}`);
          return parts.join(" ");
        }).filter(Boolean).join(" ");
        const box = [bg && "bg:" + bg, bgi, border, pseudo, radius, shadow, op].filter(Boolean).join(" ");
        const interesting = text || box || media || href || ["h1", "h2", "h3", "h4", "h5", "h6", "p", "button", "input"].includes(tag);
        if (interesting) {
          const pos = `${Math.round(r.left)},${Math.round(r.top + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}`;
          seen.push(`${"  ".repeat(Math.min(depth, 12))}${tag} ${pos} ${[media, href, box, text].filter(Boolean).join(" ")}`);
        }
        if (tag === "svg") return;
        for (const c of e.children) walk(c, depth + (interesting ? 1 : 0));
      };
      walk(document.body, 0);
      return seen;
    });
    fs.writeFileSync(`${out}/${slug}-${width}.txt`, lines.join("\n") + "\n");
    console.log(slug, width, lines.length, "lines");
    await context.close();
  }
}
await browser.close();
