// Visual check against the Framer baseline (work order 7.2).
//
//   node tools/visual/compare.mjs <base-url> <out-dir> [--offline] [slug ...]
//
// --offline compares with the captured Framer pages rendered on this machine
// (tools/reference/framer.mjs) instead of the baseline screenshots. Use it
// where the baseline was shot on a different system: font hinting differs
// between machines and moves line breaks, which hides real differences.
//
// Takes full-page screenshots of the rebuilt site at 1440, 1024 and 390 px,
// compares each with docs/baseline/<slug>-<width>.png, and writes for each:
//   <slug>-<width>.png        the rebuild
//   <slug>-<width>-side.png   baseline left, rebuild right, differences red
// plus report.md with the share of differing pixels and the height change.
// Moving parts (rotating headline, marquee, carousels) differ by nature;
// read the side-by-side images, not only the numbers.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const args = process.argv.slice(2);
const offline = args.includes("--offline");
const [base, out, ...only] = args.filter((a) => a !== "--offline");
const framer = offline ? await import("../reference/framer.mjs") : null;
const PAGES = [
  ["/", "home"], ["/about", "about"], ["/community", "community"], ["/platform", "platform"],
  ["/resources", "resources"], ["/clear", "clear"], ["/launch-webinar", "launch-webinar"],
  ["/the-importance-of-data", "the-importance-of-data"],
  ["/understanding-the-data-collection-process", "understanding-the-data-collection-process"],
  ["/open-data-format", "open-data-format"], ["/frequently-asked-questions", "frequently-asked-questions"],
  ["/job-opportunities", "job-opportunities"], ["/termsandconditions", "termsandconditions"],
];
const WIDTHS = [1440, 1024, 390];
fs.mkdirSync(out, { recursive: true });

function pad(png, w, h) {
  const p = new PNG({ width: w, height: h });
  p.data.fill(255);
  PNG.bitblt(png, p, 0, 0, Math.min(png.width, w), Math.min(png.height, h), 0, 0);
  return p;
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const rows = ["| Page | Width | Differing pixels | Height baseline / rebuild |", "| --- | --- | --- | --- |"];
for (const [url, slug] of PAGES) {
  if (only.length && !only.includes(slug)) continue;
  for (const width of WIDTHS) {
    const ref = path.join(ROOT, "docs/baseline", `${slug}-${width}.png`);
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto(base.replace(/\/$/, "") + url, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    // Scroll through once, as the baseline capture did, so lazy images load.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400));
    });
    const shot = path.join(out, `${slug}-${width}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    await context.close();
    let a;
    if (offline) {
      const { context: c2, page: p2 } = await framer.openFramer(browser, slug, width);
      a = PNG.sync.read(await p2.screenshot({ fullPage: true }));
      await c2.close();
    } else {
      if (!fs.existsSync(ref)) { rows.push(`| ${slug} | ${width} | no baseline | |`); continue; }
      a = PNG.sync.read(fs.readFileSync(ref));
    }
    const b = PNG.sync.read(fs.readFileSync(shot));
    const h = Math.max(a.height, b.height);
    const pa = pad(a, width, h), pb = pad(b, width, h);
    const diff = new PNG({ width, height: h });
    const n = pixelmatch(pa.data, pb.data, diff.data, width, h, { threshold: 0.15, alpha: 0.3 });
    const side = new PNG({ width: width * 3, height: h });
    side.data.fill(255);
    PNG.bitblt(pa, side, 0, 0, width, h, 0, 0);
    PNG.bitblt(pb, side, 0, 0, width, h, width, 0);
    PNG.bitblt(diff, side, 0, 0, width, h, width * 2, 0);
    fs.writeFileSync(path.join(out, `${slug}-${width}-side.png`), PNG.sync.write(side));
    rows.push(`| ${slug} | ${width} | ${((100 * n) / (width * h)).toFixed(2)} % | ${a.height} / ${b.height} |`);
    console.log(rows.at(-1));
  }
}
await browser.close();
fs.writeFileSync(path.join(out, "report.md"), rows.join("\n") + "\n");
