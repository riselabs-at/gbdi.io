#!/usr/bin/env node
// Step 1 of docs/01-rebuild-work-order.md: capture the live Framer site.
//
// capture-assets.py (section 3.3, verbatim from the work order) downloads the
// files on Framer's CDN. This script captures everything else the rebuild
// needs and cannot get once Framer is unpublished:
//
//   docs/baseline/<page>-<width>.png        full-page screenshots (3.1)
//   docs/baseline/recordings/*.webm          the moving parts (3.2)
//   _source-assets/framer/html/<page>.html   the HTML as Framer serves it, with its CSS
//   _source-assets/framer/dom/<page>-<w>.html the page after scripts ran, at each width
//   _source-assets/framer/text/...           visible text, all text, and text that
//                                            only shows when rotated or clicked (3.4)
//   _source-assets/framer/meta/<page>.json   title, meta tags, every link and image
//   _source-assets/framer/svg-inline/        inline SVGs that are not files (3.3)
//   _source-assets/framer/capture-report.md  what worked, what did not
//
// Why it runs as a GitHub Action: the AI working environment cannot reach
// www.gbdi.io or framerusercontent.com (6 Nov 2026), the Actions runner can.
//
// Usage, from the repository root:
//   node tools/capture/capture-pages.mjs [base-url]
// CHROME_PATH=/path/to/chrome uses an installed browser instead of
// Playwright's own (only needed for testing the script locally).

import { chromium } from "playwright";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const BASE = (process.argv[2] || "https://www.gbdi.io").replace(/\/$/, "");

// The 13 pages of section 1 of the work order, with the file name used for each.
const PAGES = [
  ["/", "home"],
  ["/about", "about"],
  ["/community", "community"],
  ["/platform", "platform"],
  ["/resources", "resources"],
  ["/clear", "clear"],
  ["/launch-webinar", "launch-webinar"],
  ["/the-importance-of-data", "the-importance-of-data"],
  ["/understanding-the-data-collection-process", "understanding-the-data-collection-process"],
  ["/open-data-format", "open-data-format"],
  ["/frequently-asked-questions", "frequently-asked-questions"],
  ["/job-opportunities", "job-opportunities"],
  ["/termsandconditions", "termsandconditions"],
];

// Desktop, tablet and phone, as in section 3.1. Framer switches layouts at
// 810 px and 1200 px, so each of these shows a different design.
const WIDTHS = [1440, 1024, 390];
const HEIGHT = 900;

const SHOTS = "docs/baseline";
const SRC = "_source-assets/framer";
for (const dir of [
  SHOTS, `${SHOTS}/recordings`, `${SRC}/html`, `${SRC}/dom`, `${SRC}/text`, `${SRC}/meta`, `${SRC}/svg-inline`,
]) fs.mkdirSync(dir, { recursive: true });

const report = [];
const note = (line) => { report.push(line); console.log(line); };

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });

// --- helpers -------------------------------------------------------------

async function newPage(width, extra = {}) {
  const context = await browser.newContext({
    viewport: { width, height: HEIGHT },
    deviceScaleFactor: 1,
    isMobile: false,
    reducedMotion: "no-preference",
    ...extra,
  });
  const page = await context.newPage();
  return { context, page };
}

async function open(page, url) {
  // "load" rather than "networkidle": Framer keeps connections open, so the
  // network may never go quiet.
  const response = await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  return response;
}

// Scroll to the bottom in steps, so lazy images load and appear-on-scroll
// effects run, then back to the top.
async function scrollThrough(page, { step = 400, pause = 150 } = {}) {
  await page.evaluate(async ({ step, pause }) => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await wait(pause);
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await wait(800);
  }, { step, pause });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
}

const visibleText = (page) => page.evaluate(() => document.body.innerText);

// Every text node in the body, hidden or not, one per line. Framer renders
// all three breakpoint layouts into the page and hides two with CSS, so this
// also holds the tablet and phone wording.
const allText = (page) => page.evaluate(() => {
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement && /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement.tagName))
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  while (walker.nextNode()) {
    const t = walker.currentNode.nodeValue.replace(/\s+/g, " ").trim();
    if (t) out.push(t);
  }
  return out.join("\n");
});

// Lines in order of first appearance, over several samples.
function mergeLines(samples) {
  const seen = new Set();
  const out = [];
  for (const s of samples) for (const line of s.split("\n").map((l) => l.trim())) {
    if (line && !seen.has(line)) { seen.add(line); out.push(line); }
  }
  return out.join("\n");
}

const metaOf = (page) => page.evaluate(() => {
  const attr = (sel, a) => document.querySelector(sel)?.getAttribute(a) ?? null;
  const metas = [...document.querySelectorAll("meta")].map((m) => ({
    name: m.getAttribute("name"), property: m.getAttribute("property"), content: m.getAttribute("content"),
  })).filter((m) => m.name || m.property);
  const links = [...document.querySelectorAll("a[href]")].map((a) => ({
    text: a.innerText.replace(/\s+/g, " ").trim(),
    label: a.getAttribute("aria-label"),
    href: a.getAttribute("href"),
    target: a.getAttribute("target"),
    rel: a.getAttribute("rel"),
  }));
  const images = [...document.querySelectorAll("img")].map((i) => ({
    src: i.getAttribute("src"), srcset: i.getAttribute("srcset"), alt: i.getAttribute("alt"),
    width: i.naturalWidth, height: i.naturalHeight,
  }));
  const backgrounds = [...document.querySelectorAll("*")]
    .map((e) => getComputedStyle(e).backgroundImage)
    .filter((b) => b && b !== "none" && b.includes("url("));
  const iframes = [...document.querySelectorAll("iframe")].map((f) => ({ src: f.getAttribute("src"), title: f.title }));
  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
    level: h.tagName, text: h.innerText.replace(/\s+/g, " ").trim(),
  }));
  return {
    title: document.title,
    lang: document.documentElement.getAttribute("lang"),
    viewport: attr('meta[name="viewport"]', "content"),
    canonical: attr('link[rel="canonical"]', "href"),
    favicon: attr('link[rel~="icon"]', "href"),
    generator: attr('meta[name="generator"]', "content"),
    metas,
    links,
    images,
    backgrounds: [...new Set(backgrounds)],
    iframes,
    headings,
  };
});

// Inline <svg> elements, deduplicated across pages and widths.
const svgIndex = new Map(); // hash -> { pages:Set, label, href, w, h }
async function collectSvgs(page, slug, width) {
  const svgs = await page.evaluate(() => [...document.querySelectorAll("svg")].map((s) => {
    const r = s.getBoundingClientRect();
    const a = s.closest("a");
    let html = s.outerHTML;
    if (!/xmlns=/.test(html.slice(0, 200))) html = html.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    return {
      html,
      label: s.getAttribute("aria-label") || a?.getAttribute("aria-label") || a?.innerText?.trim() || "",
      href: a?.getAttribute("href") || "",
      w: Math.round(r.width), h: Math.round(r.height),
    };
  }));
  for (const s of svgs) {
    if (s.html.length < 60) continue;
    const hash = crypto.createHash("sha1").update(s.html).digest("hex").slice(0, 12);
    if (!svgIndex.has(hash)) {
      fs.writeFileSync(`${SRC}/svg-inline/${hash}.svg`, s.html + "\n");
      svgIndex.set(hash, { pages: new Set(), label: s.label, href: s.href, w: s.w, h: s.h });
    }
    svgIndex.get(hash).pages.add(`${slug}@${width}`);
  }
}

async function attempt(what, fn) {
  try { return await fn(); }
  catch (e) { note(`- **failed:** ${what}: ${String(e.message || e).split("\n")[0]}`); return null; }
}

// --- 1. Screenshots, DOM, text and metadata, every page at every width ----

note(`# Capture report\n\nSource: ${BASE}\nCaptured: ${new Date().toISOString()}\n`);
note("## Pages\n");
note("| Page | Status | Title | Height at 1440 / 1024 / 390 |");
note("| --- | --- | --- | --- |");

const rows = [];
for (const [url, slug] of PAGES) {
  const heights = [];
  let status = "", title = "";
  for (const width of WIDTHS) {
    const { context, page } = await newPage(width);
    await attempt(`${url} at ${width}`, async () => {
      const response = await open(page, BASE + url);
      if (width === WIDTHS[0]) {
        status = String(response?.status() ?? "");
        // The HTML as served, before scripts: it carries Framer's CSS.
        fs.writeFileSync(`${SRC}/html/${slug}.html`, await response.text());
      }
      await scrollThrough(page);
      heights.push(await page.evaluate(() => document.documentElement.scrollHeight));
      await page.screenshot({ path: `${SHOTS}/${slug}-${width}.png`, fullPage: true });
      fs.writeFileSync(`${SRC}/dom/${slug}-${width}.html`, await page.content());
      fs.writeFileSync(`${SRC}/text/${slug}-${width}.txt`, (await visibleText(page)) + "\n");
      if (width === WIDTHS[0]) {
        fs.writeFileSync(`${SRC}/text/${slug}-all.txt`, (await allText(page)) + "\n");
        const meta = await metaOf(page);
        title = meta.title;
        fs.writeFileSync(`${SRC}/meta/${slug}.json`, JSON.stringify(meta, null, 2) + "\n");
      }
      await collectSvgs(page, slug, width);
    });
    await context.close();
  }
  rows.push(`| \`${url}\` | ${status} | ${title.replace(/\|/g, "\\|")} | ${heights.join(" / ")} |`);
}
for (const r of rows) note(r);

// --- 2. Text that only shows when it rotates or is clicked (3.4) ----------

note("\n## Hidden and rotating text\n");

// Rotating headline, auto-cycling tabs, carousel, marquee: sample the visible
// text once a second for 20 seconds, at each position on the page where
// something moves, and keep every line that ever showed.
async function sampleText(slug, seconds = 20) {
  const { context, page } = await newPage(1440);
  await attempt(`sampling ${slug}`, async () => {
    const url = PAGES.find(([, s]) => s === slug)[0];
    await open(page, BASE + url);
    await scrollThrough(page);
    const samples = [];
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += HEIGHT) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      for (let i = 0; i < seconds; i++) {
        samples.push(await visibleText(page));
        await page.waitForTimeout(1000);
      }
    }
    fs.writeFileSync(`${SRC}/text/${slug}-1440-sampled.txt`, mergeLines(samples) + "\n");
    note(`- ${slug}: sampled ${samples.length} times over ${Math.ceil(height / HEIGHT)} screen heights`);
  });
  await context.close();
}
await sampleText("home");
await sampleText("platform");
await sampleText("about", 6);

// Click everything that reads like a question (the FAQ accordion) and every
// audience tab on the platform page, keeping the text after each click.
async function clickTexts(slug, matcher, label) {
  const { context, page } = await newPage(1440);
  await attempt(`clicking ${label} on ${slug}`, async () => {
    const url = PAGES.find(([, s]) => s === slug)[0];
    await open(page, BASE + url);
    await scrollThrough(page);
    const targets = page.getByText(matcher);
    const n = await targets.count();
    const samples = [await visibleText(page)];
    let clicked = 0;
    for (let i = 0; i < n; i++) {
      const t = targets.nth(i);
      if (!(await t.isVisible())) continue;
      await t.scrollIntoViewIfNeeded();
      await t.click({ timeout: 5000 }).then(() => clicked++).catch(() => {});
      await page.waitForTimeout(800);
      samples.push(await visibleText(page));
    }
    fs.writeFileSync(`${SRC}/text/${slug}-1440-clicked.txt`, mergeLines(samples) + "\n");
    note(`- ${slug}: clicked ${clicked} of ${n} ${label}`);
  });
  await context.close();
}
await clickTexts("frequently-asked-questions", /\?\s*$/, "questions");
await clickTexts("platform", /^(Policy Makers|Portfolio Managers|Building Designers)$/, "audience tabs");

// --- 3. Phone menu ---------------------------------------------------------

{
  const { context, page } = await newPage(390);
  await attempt("opening the phone menu", async () => {
    await open(page, BASE + "/");
    // The menu button is not known in advance: take the small clickable
    // thing nearest the top right corner that is not a link. Small, because
    // children inherit the pointer cursor from wide clickable rows.
    const point = await page.evaluate(() => {
      const hits = [...document.querySelectorAll("body *")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.width < innerWidth * 0.4 && r.top < 150
          && !e.closest("a") && getComputedStyle(e).cursor === "pointer";
      }).map((e) => e.getBoundingClientRect());
      if (!hits.length) return null;
      const r = hits.sort((a, b) => (b.right - a.right) || (a.top - b.top))[0];
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (!point) throw new Error("no menu button found in the top 150 px");
    await page.mouse.click(point.x, point.y);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SHOTS}/home-390-menu-open.png` });
    fs.writeFileSync(`${SRC}/text/home-390-menu.txt`, (await visibleText(page)) + "\n");
    note(`- phone menu opened by clicking at ${Math.round(point.x)},${Math.round(point.y)}; check home-390-menu-open.png`);
  });
  await context.close();
}

// --- 4. Recordings of the moving parts (3.2) --------------------------------

note("\n## Recordings\n");

async function record(name, width, url, script) {
  const size = { width: Math.round(width * 2 / 3), height: Math.round(HEIGHT * 2 / 3) };
  const opened = await attempt(`recording ${name}`, () =>
    newPage(width, { recordVideo: { dir: `${SHOTS}/recordings/tmp`, size } }));
  if (!opened) return;
  const { context, page } = opened;
  const ok = await attempt(`recording ${name}`, async () => {
    await open(page, BASE + url);
    await script(page);
    return true;
  });
  const video = page.video();
  await context.close();
  if (video) {
    const target = `${SHOTS}/recordings/${name}.webm`;
    await video.saveAs(target).catch(() => {});
    await video.delete().catch(() => {});
    if (ok) note(`- ${name}.webm`);
  }
}

const slowScroll = (page, seconds) => page.evaluate(async (seconds) => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const steps = seconds * 4;
  const max = document.documentElement.scrollHeight - innerHeight;
  for (let i = 0; i <= steps; i++) { window.scrollTo(0, (max * i) / steps); await wait(250); }
}, seconds);

await record("home-hero-1440", 1440, "/", (p) => p.waitForTimeout(15000));
await record("home-scroll-1440", 1440, "/", (p) => slowScroll(p, 40));
await record("platform-scroll-1440", 1440, "/platform", (p) => slowScroll(p, 30));
await record("about-scroll-1440", 1440, "/about", (p) => slowScroll(p, 25));
await record("faq-accordion-1440", 1440, "/frequently-asked-questions", async (p) => {
  const q = p.getByText(/\?\s*$/);
  const n = Math.min(await q.count(), 7);
  for (let i = 0; i < n; i++) {
    if (await q.nth(i).isVisible()) await q.nth(i).click({ timeout: 5000 }).catch(() => {});
    await p.waitForTimeout(1200);
  }
  await p.waitForTimeout(2000);
});
await record("header-scroll-390", 390, "/", async (p) => {
  await p.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y <= 2000; y += 100) { window.scrollTo(0, y); await wait(100); }
    await wait(1000);
    for (let y = 2000; y >= 1000; y -= 100) { window.scrollTo(0, y); await wait(100); }
    await wait(1500);
  });
});
fs.rmSync(`${SHOTS}/recordings/tmp`, { recursive: true, force: true });

// --- 5. Inline SVG index -----------------------------------------------------

const lines = ["file,label,link,width,height,where"];
const csv = (v) => `"${String(v).replace(/"/g, '""')}"`;
for (const [hash, s] of [...svgIndex].sort()) {
  lines.push([`${hash}.svg`, s.label, s.href, s.w, s.h, [...s.pages].join(" ")].map(csv).join(","));
}
fs.writeFileSync(`${SRC}/svg-inline/index.csv`, lines.join("\n") + "\n");
note(`\n## Inline SVGs\n\n${svgIndex.size} distinct inline SVGs, listed in \`svg-inline/index.csv\`.`);

await browser.close();
fs.writeFileSync(`${SRC}/capture-report.md`, report.join("\n") + "\n");
console.log("done");
