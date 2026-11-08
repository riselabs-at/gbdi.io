# Open questions

Decisions taken without Martin while the rebuild runs in build mode (see
`AGENTS.md`). Each row says what was unclear, which reading was taken, and
where. Martin reviews these together with the finished preview.

| # | Question | Reading taken | Where |
| --- | --- | --- | --- |
| 1 | **Fonts.** GBDI's licensed font files (H3) have not arrived. | The preview uses the files the live site loads (Sk-Modernist: GBDI's upload to Framer; Satoshi: Framer's Fontshare copy). Licence texts missing. Replace before the DNS switch. | `assets/fonts/README.md` |
| 2 | **Inter.** The work order says to replace Inter with Satoshi unless the difference is visible. | Kept: it is visible in the home launch banner, and Inter is open source (OFL licence included). | `assets/fonts/` |
| 3 | **Em-dashes in the copy.** The working agreements ban em-dashes; Phase A keeps the text verbatim. | Verbatim wins for GBDI's own text (one em-dash on `/launch-webinar`). The ban applies to everything written for the rebuild. Logged in `docs/content-issues.md`. | `pages/launch-webinar.html` |
| 4 | **Video.** The live page loads the YouTube player at once, behind a thumbnail. | Same video, same parameters and the same www.youtube.com domain, but the player loads on click. Looks the same; one less third-party load until then. | `_includes/youtube.html` |
| 5 | **Publishing.** The Pages source cannot be set from here. | The workflow pushes the built site to a `gh-pages` branch. If Pages does not start serving it, set Settings, Pages, Source: Deploy from a branch, `gh-pages`, `/ (root)`. | `.github/workflows/pages.yml` |
| 6 | **Analytics.** No Plausible account yet (H5). | Snippet in the layout, switched off (`plausible: false`) so the preview does not count as gbdi.io traffic. | `_config.yml` |
| 7 | **Links with stray spaces.** Several live links are `mailto: name@...` and one is ` https://se2050.org`. | Kept verbatim; browsers handle them. The link check skips mailto links. Logged for Phase B. | pages and data files |
