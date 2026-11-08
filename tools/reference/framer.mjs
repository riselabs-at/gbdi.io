// Renders the captured Framer pages locally, offline, from _source-assets/framer/.
//
// Why: www.gbdi.io cannot be reached from the AI working environment, and the
// live screenshots in docs/baseline/ miss parts that only appear on scroll
// (the platform dashboard panel, the about timeline). The DOM captured in
// step 1 holds those parts in their final state. Loading it with the captured
// images and fonts, and with Framer's scripts blocked, gives a static copy
// that can be measured element by element and screenshotted at any width.
//
// Used by measure.mjs and by the visual check. Not published.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const SRC = path.join(ROOT, "_source-assets/framer");

export const PAGES = [
  ["/", "home"], ["/about", "about"], ["/community", "community"], ["/platform", "platform"],
  ["/resources", "resources"], ["/clear", "clear"], ["/launch-webinar", "launch-webinar"],
  ["/the-importance-of-data", "the-importance-of-data"],
  ["/understanding-the-data-collection-process", "understanding-the-data-collection-process"],
  ["/open-data-format", "open-data-format"], ["/frequently-asked-questions", "frequently-asked-questions"],
  ["/job-opportunities", "job-opportunities"], ["/termsandconditions", "termsandconditions"],
];
export const WIDTHS = [1440, 1024, 390];

const TYPES = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
  ".pdf": "application/pdf", ".woff2": "font/woff2", ".woff": "font/woff", ".webp": "image/webp" };

function localFile(url) {
  const name = new URL(url).pathname.split("/").pop();
  for (const dir of [SRC, path.join(SRC, "fonts"), path.join(SRC, "late")]) {
    const file = path.join(dir, name);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

export async function launch() {
  return chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
}

// Opens one captured page at one width. `which` picks the DOM captured at
// the nearest width (the layouts differ per breakpoint).
export async function openFramer(browser, slug, width, height = 900) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const domWidth = WIDTHS.reduce((a, b) => (Math.abs(b - width) < Math.abs(a - width) ? b : a));
  const html = fs.readFileSync(path.join(SRC, "dom", `${slug}-${domWidth}.html`), "utf8")
    // Framer's scripts are blocked anyway; dropping them keeps the page from
    // trying to hydrate and stops "load" waiting on them.
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const missing = new Set();
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.startsWith("https://www.gbdi.io/")) {
      return route.fulfill({ status: 200, contentType: "text/html", body: html });
    }
    if (url.includes("framerusercontent.com")) {
      const file = localFile(url);
      if (file) return route.fulfill({ status: 200, contentType: TYPES[path.extname(file)] || "application/octet-stream", body: fs.readFileSync(file) });
      missing.add(url);
    }
    return route.abort();
  });
  const url = "https://www.gbdi.io" + (PAGES.find(([, s]) => s === slug)[0]);
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  return { context, page, missing };
}
