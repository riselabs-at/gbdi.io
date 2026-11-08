// Text comparison (work order 7.3): the visible text of each rebuilt page
// against the text captured from the live site in step 1
// (_source-assets/framer/text/<slug>-<width>.txt).
//
//   node tools/visual/text-diff.mjs <base-url> <out-dir> [slug ...]
//
// Writes <out-dir>/text-<slug>-<width>.diff and text-report.md. Lines are
// compared after collapsing white space. Text that only differs because a
// component shows another state (rotating headline, carousels, tabs) shows up
// here too and needs reading, not counting.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const [base, out, ...only] = process.argv.slice(2);
const SLUGS = { home: "/", about: "/about", community: "/community", platform: "/platform", resources: "/resources",
  clear: "/clear", "launch-webinar": "/launch-webinar", "the-importance-of-data": "/the-importance-of-data",
  "understanding-the-data-collection-process": "/understanding-the-data-collection-process",
  "open-data-format": "/open-data-format", "frequently-asked-questions": "/frequently-asked-questions",
  "job-opportunities": "/job-opportunities", termsandconditions: "/termsandconditions" };
fs.mkdirSync(out, { recursive: true });

const norm = (t) => t.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n") + "\n";

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const rows = ["| Page | Width | Lines live / rebuild | Lines only live | Lines only rebuild |", "| --- | --- | --- | --- | --- |"];
for (const [slug, url] of Object.entries(SLUGS)) {
  if (only.length && !only.includes(slug)) continue;
  for (const width of [1440, 1024, 390]) {
    const ref = path.join(ROOT, "_source-assets/framer/text", `${slug}-${width}.txt`);
    if (!fs.existsSync(ref)) continue;
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(base.replace(/\/$/, "") + url, { waitUntil: "load" });
    const text = await page.evaluate(() => document.body.innerText);
    await context.close();
    const a = path.join(out, `live-${slug}-${width}.txt`);
    const b = path.join(out, `rebuild-${slug}-${width}.txt`);
    fs.writeFileSync(a, norm(fs.readFileSync(ref, "utf8")));
    fs.writeFileSync(b, norm(text));
    let diff = "";
    try { execFileSync("diff", ["-u", a, b]); } catch (e) { diff = e.stdout.toString(); }
    fs.writeFileSync(path.join(out, `text-${slug}-${width}.diff`), diff);
    const minus = diff.split("\n").filter((l) => l.startsWith("-") && !l.startsWith("---")).length;
    const plus = diff.split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++")).length;
    const count = (f) => fs.readFileSync(f, "utf8").split("\n").filter(Boolean).length;
    rows.push(`| ${slug} | ${width} | ${count(a)} / ${count(b)} | ${minus} | ${plus} |`);
    console.log(rows.at(-1));
  }
}
await browser.close();
fs.writeFileSync(path.join(out, "text-report.md"), rows.join("\n") + "\n");
