# Fonts

| File | Family | Used for | Source | Licence |
| --- | --- | --- | --- | --- |
| `sk-modernist-regular.woff` | Sk-Modernist Regular | Display text, figures, card titles | GBDI's own upload to the Framer project | **Missing** (H3) |
| `satoshi-400.woff2`, `-500`, `-700` | Satoshi | Body text, navigation, headings | Framer's copy from Fontshare | **Missing** (H3) |
| `satoshi-variable.woff2` | Satoshi Variable | Button labels, some body text | Framer's copy from Fontshare | **Missing** (H3) |
| `inter-400-latin.woff2`, `-700` | Inter (Latin subset) | Launch banner on the home page | Framer's copy of Inter | SIL Open Font License 1.1, `LICENSES/Inter-OFL.txt` |

**Stand-ins until GBDI's files arrive.** The work order (4.2) asks for GBDI's
own licensed font files with their licence texts. Until they arrive (open item
H3), the preview uses the files www.gbdi.io loads today, captured from Framer
on 8 Nov 2026 by `tools/capture/capture-fonts.py`. Martin confirmed on 6 Nov
2026 that GBDI holds licences for all fonts on the site. Decided in build
mode, 8 Nov 2026: see `docs/open-questions.md`.

Before the DNS switch, replace the Satoshi and Sk-Modernist files with GBDI's
own and put their licence texts in `LICENSES/`. Keep the file names, or update
`_sass/_fonts.scss`.

Inter appears only in the launch banner. The work order says to match it with
Satoshi unless the difference is visible; it is visible there (different
letter shapes and widths), and Inter is open source, so it is kept.
