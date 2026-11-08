# Design system as built

How the rebuild matches the Framer site, and the tools that measure it. The
values come from the captured site (8 Nov 2026), measured element by element.
They replace the first estimates in section 4 of the work order where the two
differ.

## Where the numbers come from

The live site cannot be reached from the AI working environment, so the
measuring runs on the capture from step 1:

| Tool | What it does |
| --- | --- |
| `tools/reference/framer.mjs` | Renders a captured Framer page offline, with the captured images and fonts and without Framer's scripts |
| `tools/reference/measure.mjs` | Writes an outline of every visible box and text run: position, size, font, colour, background, border (including Framer's `::after` borders), radius |
| `tools/reference/richtext.mjs` | Prints every rich-text block as clean HTML, word for word. Page text is copied from this |
| `tools/preview/build.mjs`, `serve.mjs` | A stand-in for `jekyll build` and GitHub Pages, for checking where Jekyll cannot run. The real build is Jekyll in `.github/workflows/pages.yml` |
| `tools/visual/compare.mjs` | Screenshots the rebuild at 1440, 1024 and 390 px and compares it with `docs/baseline/`, or with `--offline` against the offline Framer render on the same machine |
| `tools/assets/web-images.py` | Makes the web versions of the captured images in `assets/img/framer/` |

Compare on one machine. The baseline screenshots were taken on GitHub's
Ubuntu runner; font hinting there differs from other machines enough to move
line breaks. `--offline` avoids that.

## Tokens

All in `_sass/_tokens.scss` as custom properties. Colours only through
tokens, no hex values in component rules.

Changes against the work order's table (4.1): `--green-alt` (#1B9A78) is the
primary button colour and is called `--green-button`; added `--link`
(#0099FF, inline links and email addresses, 60 uses), `--text-muted`
(#BEBFBF), `--divider` (#E5E7EB), the card outline greys and `--shade`
(5 % black, accordion lines).

## Type

| Use | Font | Size / line height | Weight |
| --- | --- | --- | --- |
| Hero headline | Sk-Modernist | 60 / 66 | 400 |
| Section titles, figures | Sk-Modernist | 50 / 55 | 400 |
| Resource page title | Satoshi | 24 / 21.6 | 500 |
| Resource text, FAQ | Satoshi | 18 / 23.4 desktop, 16 / 20.8 tablet and phone | 400 |
| Header navigation | Satoshi | 15 / 22.5 | 400 |
| Buttons | Satoshi Variable | 16 / 25.6, letter-spacing -0.32 px | 400 |
| Footer tagline | Satoshi | 24 / 31.2 | 500 |
| Footer small print | Satoshi | 12 / 15.6 | 500 |
| Launch banner (home) | Inter | 16 / 19.2 | 400, 700 |

The work order's "Body 16 / 25.6" is the button style; most body text is
Satoshi 16 / 20.8 or 18 / 23.4.

## Layout

- Breakpoints as Framer's: desktop from 1200 px, tablet 810 to 1199 px,
  phone below 810 px (`_sass/_mixins.scss`).
- Content 1136 px wide at desktop; 32 px side margins on tablet, 16 px on
  phone.
- Header: an 80 px panel. Framer styles it per page and layout (grey or
  white, rounded or joined to the panel below); pages set `header_desktop`,
  `header_tablet`, `header_phone` and `header_fixed` in front matter.
- Resource pages: 240 px menu, 600 px text column. The space below the text
  differs per page and layout on the live site and is set per page as
  `pad: [desktop, tablet, phone]`.
- Rich text follows Framer's spacing: 20 px between blocks, 40 px above a
  sub-heading, no gap above a list.
