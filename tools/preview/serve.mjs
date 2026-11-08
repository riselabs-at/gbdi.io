// Serves the preview build the way GitHub Pages serves a site: /about answers
// with about.html, /about/ with about/index.html, unknown paths with 404.html.
//
//   node tools/preview/serve.mjs [dir] [port] [baseurl]

import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.argv[2] || "_preview");
const port = Number(process.argv[3] || 4000);
const base = (process.argv[4] || "").replace(/\/$/, "");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".woff2": "font/woff2", ".woff": "font/woff", ".pdf": "application/pdf", ".xml": "application/xml",
  ".txt": "text/plain", ".ico": "image/x-icon" };

function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (base) { if (!p.startsWith(base)) return null; p = p.slice(base.length) || "/"; }
  const file = path.join(dir, p);
  if (!file.startsWith(dir)) return null;
  const tries = p.endsWith("/") ? [path.join(file, "index.html")] : [file, file + ".html", path.join(file, "index.html")];
  return tries.find((f) => fs.existsSync(f) && fs.statSync(f).isFile()) || null;
}

http.createServer((req, res) => {
  const file = resolve(req.url);
  if (!file) {
    res.writeHead(404, { "content-type": TYPES[".html"] });
    const nf = path.join(dir, "404.html");
    return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : "not found");
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
}).listen(port, () => console.log(`serving ${dir} on http://localhost:${port}${base}/`));
