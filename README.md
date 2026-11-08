# gbdi.io

The website of the Global Building Data Initiative, www.gbdi.io: a static
[Jekyll](https://jekyllrb.com) site, built and published by GitHub Actions.

**Status (Phase A):** a like-for-like rebuild of the Framer site. While the
domain still points to Framer, the rebuild is published as a preview at
https://riselabs-at.github.io/gbdi.io/ (not indexed by search engines).
Switching the domain is step 6 of `docs/01-rebuild-work-order.md`.

## Editing the site

Every change goes through a pull request. The checks run on it and the
preview updates when it is merged. Small text changes can be made in the
browser: open the file on github.com, click the pencil, and choose
"Create a new branch" when committing.

| To change | Edit |
| --- | --- |
| Text on a page | `pages/<page>.html`. Each page's file name matches its address |
| Team members (About) | `_data/team.yml` |
| Partner logos (Community) | `_data/partners.yml`; logo files in `assets/img/` |
| FAQ questions and answers | `_data/faq.yml` |
| Platform page cards, tiles and audience texts | `_data/platform.yml` |
| Header and phone menu links | `_data/nav.yml` |
| Resources menu | `_data/resources_nav.yml` |
| Links used everywhere (Join form, app, LinkedIn, Bluesky) | `links:` in `_config.yml` |
| Colours, fonts, spacing | `_sass/_tokens.scss` (see `docs/02-design-system.md`) |

Page text in Phase A is copied word for word from the live site. Problems
noticed but not fixed are listed in `docs/content-issues.md`; corrections are
Phase B.

## Running it locally

With Ruby 3.3:

```sh
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>. Pages answer without `.html`, as on the
live site (`/about`).

Without Ruby, `tools/preview/` builds a close stand-in with Node:

```sh
cd tools/preview && npm ci && cd ../..
node tools/preview/build.mjs && node tools/preview/serve.mjs _preview 4000
```

## Checks

On every pull request `.github/workflows/pages.yml` builds the site and runs
html-proofer: a broken internal link, a missing image or a missing alt text
fails the check. External links are reported, not enforced.

Other tools, run by hand: `tools/visual/compare.mjs` (screenshots against the
Framer baseline), `tools/visual/text-diff.mjs` (visible text against the live
text). See `docs/02-design-system.md`.

## Where things are

| Path | What |
| --- | --- |
| `docs/` | Work order, content issues, open questions, design system, baseline screenshots |
| `AGENTS.md` | Rules for anyone, human or AI, changing this repository |
| `pages/`, `_layouts/`, `_includes/`, `_data/`, `_sass/`, `assets/` | The site |
| `_source-assets/framer/` | Everything captured from the Framer site on 8 Nov 2026. Not published |
| `tools/` | Capture, measuring, preview and check tools. Not published |
