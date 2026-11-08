// A small stand-in for `jekyll build`, for checking the site where Jekyll
// cannot run.
//
// Why it exists: the AI working environment cannot install Ruby gems
// (rubygems.org is blocked by its proxy), so Jekyll cannot run there. This
// renders the same templates with liquidjs and compiles the same Sass with
// dart-sass (the compiler Jekyll's sass converter uses), so pages can be
// screenshotted and compared before pushing. The real build is Jekyll, in
// .github/workflows/pages.yml; if the two ever differ, Jekyll is right.
//
// It supports only what this site uses: front matter, layouts that chain,
// Jekyll-style includes with parameters, _data, `permalink` without trailing
// slash, the relative_url / absolute_url / jsonify / markdownify /
// xml_escape filters, and .scss files with front matter. Keep templates
// inside that set.
//
//   node tools/preview/build.mjs [--baseurl /gbdi.io] [--out _preview]

import fs from "node:fs";
import path from "node:path";
import { Liquid } from "liquidjs";
import * as sass from "sass";
import yaml from "js-yaml";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const args = process.argv.slice(2);
const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const OUT = path.resolve(ROOT, opt("--out", "_preview"));

const config = yaml.load(fs.readFileSync(path.join(ROOT, "_config.yml"), "utf8"));
config.baseurl = opt("--baseurl", config.baseurl || "");
const exclude = new Set([...(config.exclude || []), "_site", "_preview", "node_modules", ".git", ".github", ".visual"]);

const data = {};
for (const f of fs.readdirSync(path.join(ROOT, "_data"))) {
  if (/\.ya?ml$/.test(f)) data[f.replace(/\.ya?ml$/, "")] = yaml.load(fs.readFileSync(path.join(ROOT, "_data", f), "utf8"));
}
const site = { ...config, data, time: new Date() };

const engine = new Liquid({
  root: [path.join(ROOT, "_includes")],
  extname: "",
  jekyllInclude: true,
  dynamicPartials: false,
  strictFilters: true,
});
const join = (a, b) => (a.replace(/\/$/, "") + "/" + String(b).replace(/^\//, "")).replace(/\/+/g, "/");
engine.registerFilter("relative_url", (v) => join(site.baseurl || "/", v ?? ""));
engine.registerFilter("absolute_url", (v) => site.url.replace(/\/$/, "") + join(site.baseurl || "/", v ?? ""));
engine.registerFilter("jsonify", (v) => JSON.stringify(v));
engine.registerFilter("markdownify", (v) => marked.parse(String(v ?? "")));
engine.registerFilter("xml_escape", (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"));
engine.registerFilter("date_to_xmlschema", (v) => new Date(v).toISOString());

function layoutFile(name) {
  return path.join(ROOT, "_layouts", name + ".html");
}

// Every page and static file, as Jekyll would see them.
function walk(dir, rel = "") {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = path.join(rel, entry.name);
    if (exclude.has(entry.name) || exclude.has(r)) continue;
    if (/^[_.]/.test(entry.name) && !rel) continue;
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) out.push(...walk(path.join(dir, entry.name), r));
    else out.push(r);
  }
  return out;
}

fs.rmSync(OUT, { recursive: true, force: true });
const files = walk(ROOT);
const pages = [];
for (const rel of files) {
  const abs = path.join(ROOT, rel);
  const raw = fs.readFileSync(abs);
  const hasFront = raw.slice(0, 4).toString() === "---\n" || raw.slice(0, 5).toString() === "---\r\n";
  if (!hasFront) {
    fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
    fs.copyFileSync(abs, path.join(OUT, rel));
    continue;
  }
  const { data: front, content } = matter(raw.toString());
  pages.push({ rel, front, content });
}

function urlOf(p) {
  if (p.front.permalink) return p.front.permalink;
  const ext = path.extname(p.rel);
  const base = "/" + p.rel.replace(/\\/g, "/").replace(/\.(md|html|scss)$/, "");
  if (ext === ".scss") return base + ".css";
  if (ext === ".md") return base + ".html";
  if (base.endsWith("/index")) return base.slice(0, -5);
  return base + ext;
}
function destOf(url) {
  if (url.endsWith("/")) return url + "index.html";
  if (path.extname(url)) return url;
  return url + ".html";
}

const pageVars = pages.map((p) => ({ ...p.front, url: urlOf(p), path: p.rel }));
site.pages = pageVars;

for (const [i, p] of pages.entries()) {
  const page = pageVars[i];
  const ext = path.extname(p.rel);
  let output;
  if (ext === ".scss") {
    const scss = await engine.parseAndRender(p.content, { site, page });
    output = sass.compileString(scss, {
      loadPaths: [path.join(ROOT, "_sass")],
      style: config.sass?.style === "compressed" ? "compressed" : "expanded",
    }).css;
  } else {
    let body = await engine.parseAndRender(p.content, { site, page });
    if (ext === ".md") body = marked.parse(body);
    let layout = p.front.layout;
    let layoutVars = {};
    while (layout) {
      const { data: lf, content: lc } = matter(fs.readFileSync(layoutFile(layout), "utf8"));
      layoutVars = { ...lf, ...layoutVars };
      body = await engine.parseAndRender(lc, { site, page, layout: layoutVars, content: body });
      layout = lf.layout;
    }
    output = body;
  }
  const dest = path.join(OUT, destOf(page.url));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, output);
}
console.log(`${pages.length} pages and ${files.length - pages.length} files written to ${path.relative(ROOT, OUT)}`);
