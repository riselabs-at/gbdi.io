# Working in this repository

This repository will hold www.gbdi.io, rebuilt from Framer as a static Jekyll
site on GitHub Pages. It is written for anyone changing it, human or AI. Read
it, and `docs/01-rebuild-work-order.md`, before starting.

## The job right now

Phase A of the rebuild: a like-for-like copy of the live Framer site. The work
order is `docs/01-rebuild-work-order.md`. Work through its steps in order.
Phase B (content corrections) is a separate work order that does not exist yet.

### Ground rules for Phase A (from section 0 of the work order)

1. **Text stays verbatim.** Copy every word as it is on the live site,
   including known errors, stale banners and typos.
2. **Log, don't fix.** Anything that looks wrong goes into
   `docs/content-issues.md` (page, what, why). Do not change it.
3. **Allowed invisible improvements only:** one `<h1>` per page and a sensible
   heading order; a unique `<title>` and meta description per page; `alt` on
   every image (empty for decorative shapes); `lang="en"` and a responsive
   viewport; `prefers-reduced-motion` for every animation.
4. **Same URLs.** All 13 paths stay exactly as they are, without `.html` and
   without a trailing slash.
5. **Fonts:** GBDI's licensed files only, with their licence texts in
   `assets/fonts/LICENSES/`. Never Framer's copies.
6. **Ask before you invent.** If something cannot be seen on the live site or
   in the captured material, ask Martin rather than guess.

## Pushing, pull requests and who merges

### Build mode: in force now (Martin, 8 Nov 2026)

Martin's instruction: "go ahead without me giving any clearance until you have
rebuilt the whole gbdi.io page as github page and I can review the outcome."
Until that review, this section overrides the standing rules below:

- **Merge your own pull requests** once their checks have run and you have
  read the result. Do not wait for Martin's clearance, including for changes a
  visitor sees on the github.io preview.
- **Still one branch and one pull request per step,** with a body written as
  below, so the history can be reviewed and reverted step by step.
- **Questions do not stop the work.** Take the most reasonable reading, record
  it at the top of the pull request and in `docs/open-questions.md`, and carry
  on. Martin reviews them together with the result.
- **Phase A ground rules still apply in full.** Text stays verbatim; log,
  don't fix.
- **Still stop before anything irreversible or outside the repository:** the
  DNS switch (step 6 of the work order), anything at the domain registrar,
  removing the domain from Framer, cancelling Framer.
- **Build mode ends** when the whole site is live on the github.io preview
  and Martin has been told it is ready to review. From then on the standing
  rules below apply again. Update this section when that happens.

### Standing rules

These follow the working agreements of the riselabs.at repository (6 Nov 2026).

- **The test is whether Martin has already said what the result should be.**
  A step of a written work order, built as written, a fix Martin named, a
  refactor with no visible change, or a bug whose correct behaviour is
  obvious: push it once the checks are clean. New public copy, a design
  decision, anything irreversible (deleting content, taking a page down,
  changing a URL, DNS) or anything beyond what was asked: ask first.
- **One branch and one pull request per step** of the work order. Do not
  bundle unrelated changes: a mixed pull request cannot be reverted without
  losing the parts that were fine.
- **Martin merges anything that changes what a visitor sees.** You may merge
  refactor-only work once its check report shows no differences at all.
- **Nothing is committed straight to `main`.** The only exception was the
  first commit, which created the branch (docs only).
- **Never chain a push behind a check you have not read.** Run the check, read
  the verdict, then push.
- **Never claim a change is invisible without the screenshots.**
- **When Martin is not there,** take the most reasonable reading, say at the
  top of the pull request which reading you took, and carry on. A decision that
  cannot be undone and could reasonably go either way: prepare it, set it out,
  and stop.
- **Ask one question, not four.**

## Reporting back

- Give every pull request as a link Martin can tap.
- List all open pull requests and the order to merge them in.
- End with what comes next.
- Pull `main` and list open pull requests before saying what is outstanding;
  Martin often merges mid-turn.
- Say what you could not verify, and give the one-line check he can run.
- Write pull request bodies for someone deciding whether to merge: lead with
  what changes on screen, name what you could not settle, and say plainly when
  something must not be merged yet and why.

## Writing

- **No em-dashes, anywhere:** page copy, code comments, commit messages, pull
  request bodies. Use a hyphen with spaces, a colon, or two sentences.
- **Invent nothing that carries a name, a number or a DOI.** Leave a gap and
  say what is missing.
- **Other people's details are theirs.** Names and addresses from a forwarded
  message or screenshot do not go into the site without being asked for.
- Comments in templates, styles and `_config.yml` say why something is as it
  is, who decided it and when. Update the comment when the decision changes.

## Facts about the working environment

- **Jekyll cannot run in the AI working environment** (rubygems.org is
  blocked by its proxy), and neither www.gbdi.io nor framerusercontent.com is
  reachable from it. Anything that needs the live site or a real build runs
  as a GitHub Action, where the network is open.
- **A failed GitHub Pages build is silent.** The previous version keeps being
  served. If a merge does not show up, check the Actions tab first.

## Repository layout

The structure is set out in section 2 of the work order and is filled in step
by step. Update this table whenever a step adds a folder.

| Path | What it is |
| --- | --- |
| `docs/01-rebuild-work-order.md` | Phase A work order (6 Nov 2026) |
| `docs/content-issues.md` | Everything noticed on the live site but not changed |
| `docs/open-questions.md` | Decisions taken without Martin in build mode, for his review |
| `docs/baseline/` | Screenshots and recordings of the Framer site (step 1), the reference for every visual check |
| `_source-assets/framer/` | Everything captured from the Framer site (step 1): CDN files, HTML, text, metadata, inline SVGs. Not published |
| `tools/capture/` | The capture scripts (step 1); see its README |
| `.github/workflows/capture.yml` | Runs the capture on GitHub's runner and commits the result |
