#!/usr/bin/env python3
"""Download every Framer-hosted image, SVG and PDF used on www.gbdi.io (full-size originals)."""
import csv
import pathlib
import re
import urllib.request

BASE = "https://www.gbdi.io"
PAGES = [
    "/", "/about", "/community", "/platform", "/resources", "/clear", "/launch-webinar",
    "/the-importance-of-data", "/understanding-the-data-collection-process",
    "/open-data-format", "/frequently-asked-questions", "/job-opportunities", "/termsandconditions",
]
PATTERN = re.compile(
    r"https://framerusercontent\.com/(?:images|assets)/[A-Za-z0-9_-]+\.(?:png|jpe?g|svg|webp|gif|pdf|mp4)"
)
HEADERS = {"User-Agent": "Mozilla/5.0 (gbdi.io rebuild asset capture)"}
OUT = pathlib.Path("_source-assets/framer")


def get(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS)) as response:
        return response.read()


OUT.mkdir(parents=True, exist_ok=True)
found: dict[str, list[str]] = {}
for page in PAGES:
    html = get(BASE + page).decode("utf-8", "replace")
    for url in sorted(set(PATTERN.findall(html))):
        found.setdefault(url, []).append(page)

with open(OUT / "manifest.csv", "w", newline="") as handle:
    writer = csv.writer(handle)
    writer.writerow(["file", "url", "pages"])
    for url, pages in sorted(found.items()):
        name = url.rsplit("/", 1)[1]
        target = OUT / name
        if not target.exists():
            target.write_bytes(get(url))
        writer.writerow([name, url, " ".join(pages)])

print(f"{len(found)} files saved to {OUT}")
