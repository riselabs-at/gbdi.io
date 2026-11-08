#!/usr/bin/env python3
"""Make web versions of the captured Framer files (work order 3.3).

Reads _source-assets/framer/manifest.csv and writes assets/img/framer/:
- JPG photos, and PNGs over 250 KB: WebP, longest side at most 2000 px;
- smaller PNGs (logos) and SVGs: copied unchanged;
- the launch presentation PDF: copied to assets/files/.

File names keep Framer's ids, so every file can be traced back to the
manifest. Run from the repository root; needs Pillow.
"""
import csv
import pathlib
import shutil

from PIL import Image

SRC = pathlib.Path("_source-assets/framer")
IMG = pathlib.Path("assets/img/framer")
FILES = pathlib.Path("assets/files")
LIMIT = 2000
BIG_PNG = 250 * 1024

IMG.mkdir(parents=True, exist_ok=True)
FILES.mkdir(parents=True, exist_ok=True)
for row in csv.DictReader(open(SRC / "manifest.csv")):
    src = SRC / row["file"]
    ext = src.suffix.lower()
    if ext == ".pdf":
        shutil.copy(src, FILES / src.name)
        continue
    if ext == ".svg" or (ext == ".png" and src.stat().st_size <= BIG_PNG):
        shutil.copy(src, IMG / src.name)
        continue
    image = Image.open(src)
    image.thumbnail((LIMIT, LIMIT), Image.LANCZOS)
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
    image.save(IMG / (src.stem + ".webp"), "WEBP", quality=82, method=6)
print("done")
