#!/usr/bin/env node
// Captures Framer files that load only after the page starts: the images
// behind auto-cycling tabs, carousel slides and other states that were not
// showing when step 1 ran (found 8 Nov 2026: two home tab images missing).
//
// Listens to every request to framerusercontent.com while it scrolls each
// page, waits for automatic tabs and carousels to cycle, and clicks every
// tab, arrow and button that does not leave the page. Saves files that are
// not already in _source-assets/framer/ to _source-assets/framer/late/ with
// late-manifest.csv. Runs as a GitHub Action (capture-late.yml).

import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.argv[2] || "https://www.gbdi.io";
const PAGES = ["/", "/about", "/community", "/platform", "/resources", "/clear", "/launch-webinar",
  "/the-importance-of-data", "/understanding-the-data-collection-process", "/open-data-format",
  "/frequently-asked-questions", "/job-opportunities", "/termsandconditions"];
const SRC = "_source-assets/framer";
const OUT = `${SRC}/late`;
fs.mkdirSync(OUT, { recursive: true });
const have = new Set([...fs.readdirSync(SRC), ...fs.readdirSync(`${SRC}/fonts`)]);
const found = new Map(); // name -> {url, pages:Set}

const browser = await chromium.launch();
for (const width of [1440, 1024, 390]) {
  for (const path of PAGES) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.on("response", async (res) => {
      const url = res.url().split("?")[0];
      const m = url.match(/^https:\/\/framerusercontent\.com\/(images|assets)\/([A-Za-z0-9_-]+\.(png|jpe?g|svg|webp|gif|pdf|mp4))$/);
      if (!m || have.has(m[2])) return;
      if (!found.has(m[2])) found.set(m[2], { url, pages: new Set() });
      found.get(m[2]).pages.add(`${path}@${width}`);
    });
    try {
      await page.goto(BASE + path, { waitUntil: "load", timeout: 60000 });
      await page.evaluate(async () => {
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { window.scrollTo(0, y); await wait(250); }
      });
      // Let automatic tabs and carousels run, at each screen height.
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 900) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(5000); }
      // Click things that stay on the page: elements with a pointer cursor
      // that are not links away.
      const n = await page.evaluate(() => {
        const els = [...document.querySelectorAll("body *")].filter((e) => {
          const cs = getComputedStyle(e);
          const a = e.closest("a[href]");
          const r = e.getBoundingClientRect();
          return cs.cursor === "pointer" && !a && r.width > 0 && r.height > 0 && r.width < 700;
        });
        els.forEach((e, i) => e.setAttribute("data-late-click", i));
        return els.length;
      });
      for (let i = 0; i < Math.min(n, 80); i++) {
        await page.locator(`[data-late-click="${i}"]`).click({ timeout: 2000, force: true }).catch(() => {});
        await page.waitForTimeout(400);
      }
      await page.waitForTimeout(2000);
    } catch (e) { console.log(`failed ${path}@${width}: ${e.message.split("\n")[0]}`); }
    await context.close();
  }
}
await browser.close();

const rows = ["file,url,pages"];
for (const [name, { url, pages }] of [...found].sort()) {
  const res = await fetch(url);
  if (res.ok) fs.writeFileSync(`${OUT}/${name}`, Buffer.from(await res.arrayBuffer()));
  rows.push(`${name},${url},${[...pages].join(" ")}`);
}
fs.writeFileSync(`${OUT}/late-manifest.csv`, rows.join("\n") + "\n");
console.log(`${found.size} files not in the step 1 capture saved to ${OUT}`);
