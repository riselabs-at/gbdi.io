#!/usr/bin/env python3
"""Download the font files www.gbdi.io loads from Framer, with their @font-face rules.

The work order (3.3) skips Framer's font files and asks for GBDI's own
licensed files instead (open item H3). Until those arrive, the github.io
preview uses these: Sk-Modernist is GBDI's own upload to Framer, Satoshi is
Framer's copy from Fontshare. Decided in build mode, 8 Nov 2026; see
docs/open-questions.md. Replace them with GBDI's files before the DNS switch.

Reads the HTML saved by the step 1 capture, so it needs no page requests.
Writes _source-assets/framer/fonts/ and fonts.csv there.
"""
import csv
import pathlib
import re
import urllib.request

SRC = pathlib.Path("_source-assets/framer")
OUT = SRC / "fonts"
HEADERS = {"User-Agent": "Mozilla/5.0 (gbdi.io rebuild font capture)"}
FACE = re.compile(r"@font-face\s*\{([^}]*)\}")


def prop(block: str, name: str) -> str:
    match = re.search(name + r"\s*:\s*([^;]+)", block)
    return match.group(1).strip().strip('"') if match else ""


OUT.mkdir(parents=True, exist_ok=True)
rows = {}
for page in sorted((SRC / "html").glob("*.html")):
    for block in FACE.findall(page.read_text("utf-8", "replace")):
        url = re.search(r"url\(\"?([^\")]+)\"?\)", block)
        if not url or "framerusercontent.com" not in url.group(1):
            continue
        url = url.group(1)
        key = (prop(block, "font-family"), prop(block, "font-weight"), prop(block, "font-style"),
               prop(block, "unicode-range"), url)
        rows.setdefault(key, set()).add(page.stem)

with open(OUT / "fonts.csv", "w", newline="") as handle:
    writer = csv.writer(handle)
    writer.writerow(["family", "weight", "style", "unicode_range", "file", "url", "pages"])
    for (family, weight, style, urange, url), pages in sorted(rows.items()):
        name = url.rsplit("/", 1)[1].split("?")[0]
        target = OUT / name
        if not target.exists():
            with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS)) as response:
                target.write_bytes(response.read())
        writer.writerow([family, weight, style, urange, name, url, " ".join(sorted(pages))])

print(f"{len({k[4] for k in rows})} font files saved to {OUT}")
