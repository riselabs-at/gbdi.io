# Capture tools (step 1 of the work order)

These capture the live Framer site before it is unpublished. They run on
GitHub's runner through `.github/workflows/capture.yml`, because the AI working
environment cannot reach www.gbdi.io or framerusercontent.com.

| Script | Work order | Writes |
| --- | --- | --- |
| `capture-assets.py` | 3.3, verbatim | `_source-assets/framer/*` (the CDN files) and `manifest.csv` |
| `capture-pages.mjs` | 3.1, 3.2, 3.4 | `docs/baseline/` and the subfolders of `_source-assets/framer/` |

## Running it

The workflow starts by itself when anything in `tools/capture/` changes on a
branch whose name starts with `step-1-`, and can be started by hand under
**Actions → Capture Framer site → Run workflow**. It commits what it captured
to the branch it ran on, and also keeps it as a 30-day artifact.

To run it on a computer that can reach the site, from the repository root:

```sh
python3 tools/capture/capture-assets.py
cd tools/capture && npm ci && npx playwright install chromium && cd ../..
node tools/capture/capture-pages.mjs https://www.gbdi.io
```

## What comes out

| Path | What |
| --- | --- |
| `docs/baseline/<page>-<width>.png` | Full-page screenshots at 1440, 1024 and 390 px |
| `docs/baseline/home-390-menu-open.png` | The phone menu, opened |
| `docs/baseline/recordings/*.webm` | Home hero, slow scrolls of home, platform and about, the FAQ accordion, the header on a phone while scrolling |
| `_source-assets/framer/html/<page>.html` | The page as Framer serves it, including its CSS |
| `_source-assets/framer/dom/<page>-<width>.html` | The page after its scripts ran, at each width |
| `_source-assets/framer/text/<page>-<width>.txt` | Visible text at each width |
| `_source-assets/framer/text/<page>-all.txt` | Every text node, including the hidden tablet and phone layouts |
| `_source-assets/framer/text/*-sampled.txt` | Home, platform, about: every line that showed over 20 seconds per screen (rotating headline, auto tabs, carousel, marquee) |
| `_source-assets/framer/text/*-clicked.txt` | FAQ after clicking each question; platform after clicking each audience tab |
| `_source-assets/framer/meta/<page>.json` | Title, meta tags, every link with its target, every image with its alt, iframes, headings |
| `_source-assets/framer/svg-inline/` | Inline SVGs (logo, icons, chart shapes), with `index.csv` saying where each appears |
| `_source-assets/framer/capture-report.md` | What worked and what did not |

## Limits

- Rotating and animated parts are caught at whatever moment the screenshot is
  taken. The recordings and the sampled text are the reference for them.
- The phone menu button and the FAQ questions are found by guessing: the
  smallest clickable thing at the top right, and text ending in a question
  mark. The report says how many were clicked; check it against the
  screenshots.
- Framer's 24 font files are deliberately not downloaded (work order 3.3).
