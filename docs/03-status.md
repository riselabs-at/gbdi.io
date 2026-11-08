# Phase A status, 8 November 2026

Where the rebuild stands against the definition of done (section 9 of
`docs/01-rebuild-work-order.md`). Written when build mode ended, for
Martin's review of the preview.

Preview: https://riselabs-at.github.io/gbdi.io/ (once GitHub Pages serves the
`gh-pages` branch, see below).

| Item | Status |
| --- | --- |
| All 13 pages at their current URLs, plus 404, sitemap and robots.txt | **Built**, on the preview. Live on www.gbdi.io only after the domain switch (step 6) |
| Text identical to the live site, except the allowed invisible changes | **Done.** `tools/visual/text-diff.mjs`: resource pages, Terms, About and Community match line for line apart from the new "Skip to content" link. Home and Platform differ only where Framer split words into separate elements, where a text is now part of the dashboard picture (its alt text carries it), and where off-screen carousel cards count as text |
| Visual comparison at 1440, 1024 and 390 px agreed with Martin | **Ready for review.** Against the captured pages on one machine: 0.3 to 2 % of pixels differ on most pages, page heights within 2 px. Moving parts differ by moment. Terms reflows on tablet and phone (allowed change) |
| Interactions work with mouse, touch and keyboard, respect reduced motion | **Done**, checked in Chrome: menu, FAQ, home tabs, platform carousel and tabs, video. Not checked on a real phone (step 5.5) |
| All Framer CDN files captured, launch PDF served from the repository | **Done.** 66 files in step 1 plus 3 that load only after interaction (`_source-assets/framer/late/`); PDF in `assets/files/` |
| Fonts self-hosted with licence files | **Partly.** Self-hosted, but the Satoshi and Sk-Modernist files are the ones the live site loads, without licence texts. Needs GBDI's files (H3) |
| Plausible receiving visits; no Framer scripts left | **Partly.** No Framer scripts. Plausible is in the layout but switched off until the account exists (H5) and the domain points here |
| GitHub Action checks green; Lighthouse targets met | Checks green on every pull request. Lighthouse: performance 94 to 100, best practices 96 to 100, SEO 100 on every page checked. Accessibility 92 to 97: **below 95** on CLEAR and Platform, because the live colours fail contrast (see `docs/open-questions.md`) |
| `docs/content-issues.md` lists everything noticed but not changed | **Done**, for Phase B |
| `README.md` and `AGENTS.md` | **Done** |
| Domain switched, HTTPS enforced, app.gbdi.io and mail unaffected | **Not started.** Needs Martin and DNS access (H6), after sign-off (H7) |

## Needs Martin

1. **Turn on GitHub Pages**, if the preview link does not open: repository
   Settings, Pages, Source "Deploy from a branch", branch `gh-pages`,
   folder `/ (root)`. It could not be set from the AI environment.
2. **Review the preview** against www.gbdi.io, and the readings taken in
   `docs/open-questions.md`.
3. **H3** GBDI's font files and licences, **H5** Plausible, **H6** DNS access.
