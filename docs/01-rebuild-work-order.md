# gbdi.io rebuild – work order, Phase A (like-for-like)

- **Issued:** 6 Nov 2026, by Martin Röck (prepared with Claude)
- **For:** Mel and the comms team, and any AI agent working in this repository
- **Place this file at:** `docs/01-rebuild-work-order.md` in the new GitHub repository
- **Background review:** gbdi.io website review and GitHub Pages migration, 4 Nov 2026 (Claude Doc, ask Martin for the link)

## 0. Goal and ground rules

Rebuild www.gbdi.io, now on Framer, as a static site on GitHub Pages. A visitor should not notice the switch: same pages, same text, same look, same behaviour.

1. **Text stays verbatim.** Copy every word as it is on the live site today, including known errors (wrong figures, stale banners, typos, the "Terms and conditions" text). Content corrections are Phase B, a separate job.
2. **Log, don't fix.** Anything that looks wrong goes into `docs/content-issues.md` (page, what, why). Do not change it.
3. **Allowed invisible improvements.** These change nothing a visitor sees, so do them now:
   - one `<h1>` per page and a sensible heading order (the home headline is currently split into about 48 separate headings);
   - a unique `<title>` and meta description per page, written from the page's own heading and first sentence (the job page's browser title "Join the GBDI Team! - My Framer Site" becomes "Join the GBDI Team! – Global Building Data Initiative");
   - `alt` text on every image (names for people and partners, a short description for photos, empty `alt=""` for decorative shapes);
   - `lang="en"` and a normal responsive viewport on every page (the Terms page is currently fixed at 1200 px wide);
   - `prefers-reduced-motion` support for all animations.
4. **Same URLs.** All 13 paths below stay exactly as they are, without `.html` and without a trailing slash, as today.
5. **Licences and consent.** Martin confirms that GBDI holds licences or consent for all fonts, photos, logos and portraits currently on the site. Keep the licence files for the fonts in the repository (see 4.2).
6. **Ask before you invent.** If something cannot be seen on the live site (for example a tablet layout detail), ask Martin rather than guess.

## 1. Pages in scope

| # | URL | Template | Main parts, top to bottom |
| --- | --- | --- | --- |
| 1 | `/` | home | Header · hero panel (rotating "Open Data, Better …" headline, 4 arrow lines, globe-in-hands illustration, green launch banner) · 3 statistic cards with footnote links · "Better buildings" mission block · 3 feature cards (Better Decisions, Materials, Design) · "A platform built for climate action" with auto-cycling 3-step tabs and animated chart panel · photo strip (5 photos) · scrolling text marquee · "A community initiative" block with GLOBE logo · footer |
| 2 | `/about` | page | Intro paragraph (dark words then grey) · Our Objectives (3 stat cards) · Our Approach (3 columns) · phase timeline (Phase 1–3 with tick-mark ruler) · Team & Organization (9 cards: photo, name, role, email) · Former collaborators · GLOBE block with logo · Address · footer |
| 3 | `/community` | page | Photo collage (6 photos) · "A global community for better buildings" + Join community button · logo walls: Lead Partners, Development Partners, Research partners, Sponsors and Funding Partners |
| 4 | `/platform` | page | Intro + Sign up / Sign in · dashboard illustration · benefit card carousel (3 cards, back/next arrows) · dashboard mock-up panel · 6 feature tiles · "From Portfolio to Policy" with 3 audience tabs (Policy Makers, Portfolio Managers, Building Designers) and "Get in touch" |
| 5 | `/resources` | resource | Resources overview text |
| 6 | `/clear` | resource | CLEAR project profile (logo, Info, Summary, Key goals, GBDI experts, Partners, Related documents) |
| 7 | `/launch-webinar` | resource | Launch Event Feb. 26th 2025, agenda, fact sheet, YouTube embed, "Download Presentation (pdf)" |
| 8 | `/the-importance-of-data` | resource | Four short sections |
| 9 | `/understanding-the-data-collection-process` | resource | Steps, platform description, guidance-document link, Go to the Platform |
| 10 | `/open-data-format` | resource | openBDF text, figure, "Review GBDI on Github" button |
| 11 | `/frequently-asked-questions` | resource | 7-question accordion |
| 12 | `/job-opportunities` | resource | No open positions text, LinkedIn and Bluesky buttons |
| 13 | `/termsandconditions` | page | Long legal text (keep verbatim) |

Also create: `404.html` in the site's style, `sitemap.xml` (13 URLs), `robots.txt` (allow all, point to the sitemap).

Pages 5 to 12 share a left-hand Resources menu with 8 links (Resources overview, CLEAR, Launch Event, Data Reporting, Data Collection, Open Data Format, FAQ, Job Opportunities) and an active state for the current page.

Note: `/job-opportunities` currently shows a different header (menu order Home, Platform, Community, About, Resources; "Join community"; "Sign up / sign in"; Resources links to this page). Use the standard header there and log the difference in `docs/content-issues.md`.

## 2. Stack and repository

- **Generator:** Jekyll, built and deployed by a GitHub Actions workflow to GitHub Pages (the same approach as riselabs.at; reuse its patterns, checker and visual-check tool where they fit).
- **Styles:** Sass partials compiled by Jekyll. No CSS framework.
- **Scripts:** plain JavaScript, one small file per behaviour, no framework. No external CDN scripts except Plausible and the YouTube embed.
- **Repository visibility:** GitHub Pages from a private repository needs a paid GitHub plan for the organisation. Confirm with Martin which applies before the first deploy.
- **Links:** while the site runs on its github.io preview address it lives under `/<repo-name>/`. Use Jekyll's `relative_url` filter for every internal link and asset so the same build works on the preview and on www.gbdi.io.

Suggested structure:

```
_config.yml
_data/        nav.yml, resources_nav.yml, team.yml, partners.yml, faq.yml
_includes/    header.html, footer.html, button.html, stat-card.html, team-card.html,
              logo-wall.html, accordion.html, tabs.html, carousel.html, marquee.html, timeline.html
_layouts/     default.html, home.html, page.html, resource.html
_sass/        tokens, base, layout, components (one partial each)
_source-assets/   originals as downloaded from Framer (not published; underscore folders are skipped)
assets/       css/, js/, img/, fonts/, files/
docs/         this work order, content-issues.md, baseline screenshots, editing guide
pages/        one Markdown or HTML file per page, with permalink set to the exact URL
```

## 3. Step 1 – Capture the current site (do this first)

Framer serves all images, the openBDF figure and the launch PDF from its own CDN. They disappear when the Framer site is unpublished, so capture everything before any other work.

### 3.1 Baseline screenshots

Take full-page screenshots of all 13 pages at three widths: 1440 px (desktop), 1024 px (tablet) and 390 px (phone). Store them in `docs/baseline/` with names like `home-1440.png`. These are the reference for the visual check in step 6. Framer uses three separately designed layouts with breakpoints at 810 px and 1200 px, so check the tablet and phone versions carefully: they are not just squeezed desktop layouts.

### 3.2 Screen recordings of the moving parts

Record a few seconds of each, so timing and easing can be matched:

- home: rotating headline; auto-cycling 3-step tabs with the animated chart; the photo strip; the text marquee;
- platform: benefit card carousel (automatic and with arrows); audience tabs;
- about: intro paragraph (check whether the grey words darken on scroll); phase timeline;
- FAQ: accordion opening and closing;
- header: behaviour on scroll and the phone menu.

### 3.3 Download the assets

Run this script from the repository root (Python 3, no extra packages). It reads all 13 pages, finds every file hosted on Framer's CDN, downloads the full-size original and writes a manifest.

```python
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
```

Expected result on 6 Nov 2026: **66 files** (20 JPG, 28 PNG, 17 SVG, 1 PDF). If the count differs, compare with the pages and note why. The script deliberately skips Framer's 24 font files; use GBDI's own licensed font files instead (4.2).

Then:

- make web versions of the photos in `assets/img/` (longest side about 2000 px, WebP, with JPG fallback only if needed); keep SVG and PNG logos as they are unless they are very large;
- copy the launch presentation PDF to `assets/files/` and point the "Download Presentation (pdf)" link at it;
- copy the inline SVGs that are not files (the GBDI logo in header and footer, arrow and icon glyphs, LinkedIn and Bluesky icons, the chart shapes in the home tabs) from the browser's developer tools into `_includes/svg/`.

### 3.4 Capture the text

Copy every page's text into the page files or data files, word for word. Include text that is hidden until clicked or rotated: the 7 FAQ answers, all carousel cards, all tab panels, every rotating headline line, the marquee text, the mobile menu labels and all link targets (the Google Form, app.gbdi.io, the Google Drive link, the YouTube video, partner websites, mailto links exactly as they are).

## 4. Step 2 – Design system

Values were measured on the live home page at desktop width on 6 Nov 2026. Check them against the other pages and the tablet and phone layouts, and correct this table if you find differences.

### 4.1 Colours

The "Probable use" column is inferred from where the colour appears; confirm it per element in the browser's developer tools.

| Token | Value | Probable use |
| --- | --- | --- |
| `--text` | #3D3D3D | Body text, most headings |
| `--text-strong` | #000000 | Some headings and labels |
| `--green` | #189D7E | Primary buttons, link highlights in the hero, statistic 1 |
| `--green-alt` | #1B9A78 | Button and panel variants |
| `--green-deep` | #206D59 | Accent text |
| `--panel` | #F6F8F8 | Header and hero panel, other light panels |
| `--white` | #FFFFFF | Page background, secondary buttons, cards |
| `--mint` | #A6DBC9 | Chart bars and accents |
| `--lavender` | #BAAEF6 | Chart bars and accents |
| `--tint-green` | #EAFAF0 | Statistic card 1 background |
| `--tint-blue` | #E9F7FE | Statistic card 2 background |
| `--tint-purple` | #EFECFE | Statistic card 3 background |
| `--blue` | #3592E3 | Statistic card 2 figure |
| `--blue-deep` | #31658D | Accent text |
| `--purple` | #8671EF | Statistic card 3 figure |
| `--purple-deep` | #5C5CAE | Accent text |

### 4.2 Typography

Fonts: **Sk-Modernist Regular** for large display text and figures, **Satoshi** (static and variable) for everything else. Inter appears in a few small components; match those with Satoshi unless the difference is visible. Put GBDI's licensed `.woff2` files in `assets/fonts/` and their licence texts in `assets/fonts/LICENSES/`, load them with `@font-face` and `font-display: swap`.

| Use | Font | Size / line height | Weight |
| --- | --- | --- | --- |
| Hero headline | Sk-Modernist | 60 / 66 px | 400 |
| Statistic figures, section titles | Sk-Modernist | 50 / 55 px | 400 |
| Card titles, rotating lines, intro text | Sk-Modernist | 22 / 26.4 px | 400 |
| Card headings | Satoshi | 24 / 31.2 px | 500 |
| Lead text | Satoshi | 20 / 24 px | 400 |
| Large body | Satoshi | 18 / 23.4 px | 400 |
| Body | Satoshi | 16 / 25.6 px, letter-spacing −0.32 px | 400 (bold 700) |
| Navigation, buttons | Satoshi | 14–16 px | 400 |
| Small labels | Satoshi | 12 / 15.6 px | 500 |

### 4.3 Shape and layout

- Content width: 1136 px maximum, centred, with 32 px side padding.
- Header: a #F6F8F8 panel 80 px tall, starting 32 px below the top of the page, top corners 8 px, joined seamlessly to the hero panel below it (bottom corners 8 px).
- Corner radius: 4 px for buttons and small cards, 8 px for panels.
- Breakpoints: desktop 1200 px and up, tablet 810–1199 px, phone below 810 px (Framer's own breakpoints; match the baseline screenshots at each).

## 5. Step 3 – Build

1. **Base layout:** header, footer, page container, fonts, tokens. The header holds the logo, Home, About, Community, Platform, Resources, "Join" (to the Google Form) and "Sign in" (to app.gbdi.io), plus the phone menu. The footer holds the logo, the two-line tagline, Sign up, Join community, LinkedIn, Bluesky, "© 2026 GBDI · All rights reserved" and the Terms link.
2. **Data files:** `team.yml` (9 people plus former collaborators), `partners.yml` (name, logo file, link, group), `faq.yml` (7 questions and answers), `resources_nav.yml` (8 links), `nav.yml`. Content in data files can be edited later without touching HTML.
3. **Templates and components** as listed in section 2.
4. **Pages** in this order: Home, About, Community, Platform, then the resource pages, then Terms.
5. **Interactions** (all plain JavaScript, each in its own file, each disabled or reduced under `prefers-reduced-motion`):

| Component | Where | Behaviour to match |
| --- | --- | --- |
| Rotating headline | Home hero | "Better Buildings / Business / Planet" cycle after "Open Data," |
| Auto-cycling tabs | Home platform block | Three steps highlight in turn; the chart panel changes with each; clicking a step selects it |
| Photo strip | Home | Five photos in a row (check whether it moves) |
| Text marquee | Home | "Open Data · Better Buildings · …" scrolls continuously |
| Carousel | Platform benefit cards | Back and next arrows, automatic advance as on the live site |
| Audience tabs | Platform "From Portfolio to Policy" | Three tabs switch the text panel |
| Accordion | FAQ | Plus becomes a cross; one or several open, as on the live site; must work with keyboard |
| Timeline | About phases | Static tick-mark ruler with three highlighted phase marks |
| Scroll text reveal | About intro | Check against the recording; reproduce only if the live site does it |

Use real buttons and ARIA attributes for tabs, carousel and accordion so they work with a keyboard and screen readers.

6. **Video:** keep the YouTube embed exactly as it is (same video). Changing it to the privacy-enhanced domain is a Phase B decision.

## 6. Step 4 – Analytics

- Add the Plausible script to every page, for the domain `gbdi.io` (Martin provides the account or adds the site to RISE's account).
- No other analytics, no cookies, no cookie banner.
- Goals (outbound clicks, PDF downloads) are Phase B.

## 7. Step 5 – Checks before sign-off

1. **Automatic, on every pull request (GitHub Action):** Jekyll build; HTML checks with html-proofer (internal links, images, alt attributes, valid HTML); external link check (report only, do not block). A failing internal link or missing image blocks the merge.
2. **Visual comparison:** screenshots of the preview at 1440, 1024 and 390 px next to the baseline screenshots from 3.1, page by page. Differences should be limited to sub-pixel font rendering and animation timing. List any other differences and agree them with Martin.
3. **Text comparison:** for each page, compare the visible text of the preview with the live site (a simple diff of the extracted text is enough). Only the allowed invisible changes from section 0 may differ.
4. **Lighthouse** on every page: accessibility, best practices and SEO at 95 or more; performance at 90 or more on desktop.
5. **Manual run-through** on a real phone and a desktop browser: every link, button, tab, accordion, carousel, the Join form, Sign in, the video and the PDF download.
6. **Sign-off:** Martin reviews the preview on github.io and approves the switch.

## 8. Step 6 – Switch the domain (with Martin and whoever manages DNS)

Only after sign-off.

1. **Before:** export the complete DNS zone of gbdi.io and keep it. One day ahead, lower the TTL of the `gbdi.io` and `www` records to 300 seconds.
2. **Verify the domain** for the GitHub organisation (organisation settings → Pages → verified domains, a TXT record). This stops anyone else from claiming it.
3. **Set the custom domain** `www.gbdi.io` in the repository's Pages settings. `www.gbdi.io` stays the main address, as today; `gbdi.io` redirects to it.
4. **Change only these DNS records:**
   - `www` → CNAME to `<organisation>.github.io`;
   - `gbdi.io` (apex) → the four GitHub Pages A records and four AAAA records listed in GitHub's documentation "Managing a custom domain for your GitHub Pages site" (check the current values there on the day).
5. **Do not touch:** `app.gbdi.io`, MX records (mail for office@gbdi.io), SPF, DKIM, DMARC and any other TXT or CNAME records.
6. Remove the custom domain from the Framer project once DNS points to GitHub. Leave the Framer site published on its Framer subdomain for 30 days as a fallback.
7. When GitHub shows the certificate as issued, turn on **Enforce HTTPS**.
8. **After:** all 13 URLs answer with status 200 on https://www.gbdi.io; http and the apex redirect to https://www.gbdi.io; Plausible shows visits; submit `sitemap.xml` in Google Search Console if GBDI uses it.
9. **Rollback:** if something breaks, restore the exported DNS records and re-add the domain in Framer.

Framer is cancelled by Martin at the next renewal after 30 days without problems.

## 9. Definition of done

- [ ] All 13 pages live at their current URLs on https://www.gbdi.io, plus 404, sitemap and robots.txt
- [ ] Text identical to the live Framer site, except the allowed invisible changes in section 0
- [ ] Visual comparison at 1440, 1024 and 390 px agreed with Martin
- [ ] All interactions work with mouse, touch and keyboard, and respect reduced motion
- [ ] All 66 Framer CDN files captured in `_source-assets/framer/` with `manifest.csv`; the launch PDF served from the repository
- [ ] Fonts self-hosted with licence files in the repository
- [ ] Plausible receiving visits; no Framer scripts left
- [ ] GitHub Action checks green; Lighthouse targets met
- [ ] `docs/content-issues.md` lists everything noticed but not changed
- [ ] `README.md` with how to run the site locally and how to edit text, team, partners and FAQ
- [ ] `AGENTS.md` (or `CLAUDE.md`) for AI agents: the ground rules from section 0, the repo structure, house style, and that every change goes through a pull request with checks
- [ ] Domain switched, HTTPS enforced, app.gbdi.io and mail unaffected

## 10. Not in this job (Phase B)

Content corrections from the review of 4 Nov 2026, including: the home statistics and their sources, the privacy notice and legal notice, stale launch banners, the dead guidance-document link and missing data template, the About objectives and phases, the FAQ scope, contact addresses, the Join form text, partner alt texts and links, news or project templates. Martin will issue these as a separate work order.

## 11. What the team needs from Martin

| # | Item | Needed for |
| --- | --- | --- |
| H1 | Access to the new GitHub repository (and organisation Pages settings) | Step 2 onwards |
| H2 | Repository visibility decision (public, or private with a paid plan) | First deploy |
| H3 | Licensed Satoshi and Sk-Modernist font files with licence texts | Step 2 |
| H4 | Editor access to the Framer project (to check layouts and originals) | Step 1 |
| H5 | Plausible account, or gbdi.io added to RISE's account | Step 4 |
| H6 | Name and access of whoever manages gbdi.io DNS | Step 6 |
| H7 | Sign-off on the preview | Before step 6 |
