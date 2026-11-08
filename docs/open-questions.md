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
| 8 | **404 page.** The work order asks for a 404 page in the site's style; there is no text for it. | Two short new lines: "Page not found" and "The page you are looking for does not exist or has moved.", with a button to the home page. Change freely. | `pages/404.html` |
| 9 | **Colour contrast.** Lighthouse accessibility should reach 95. The live colours fail WCAG AA for normal text: white on the button green 3.5:1, the active green 3.4:1, the link blue 2.99:1. | Kept, because changing them changes what visitors see. Pages with blue links score about 94 to 96. Suggest for Phase B: a darker green and blue. | `_sass/_tokens.scss` |
| 10 | **Preview not indexed.** The github.io preview is a second public copy of the site. | The preview build marks every page noindex (`_config.preview.yml`); canonical links point to www.gbdi.io. Remove that config from the build when the domain switches. | `.github/workflows/pages.yml` |
| 11 | **Platform dashboard.** The panel between the carousel and the feature tiles looked empty in the captures. | It is a scroll-linked animation that rises into place; the captures froze it at the start. Rebuilt as one image of the finished mock-up per layout (with alt text), moved by CSS scroll-driven animation, still under reduced motion. | `pages/platform.html` |
| 12 | **Platform carousel.** The work order says to match the automatic advance. | The recording shows no automatic advance, so none is added. Arrows, dots, looping and swipe as live. | `assets/js/platform-carousel.js` |
