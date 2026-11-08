# Content issues: noticed, not changed

Phase A copies the live Framer site as it is. Anything that looks wrong is
logged here instead of fixed, and is dealt with in Phase B (see section 0 of
`docs/01-rebuild-work-order.md`).

Add a row whenever you notice something. Say which page, what you saw, and why
it looks wrong. Leave the fix to Phase B.

The first rows come from the website review of 4 November 2026 (ask Martin for
the link). They were found on desktop in Chrome. Rows marked "capture 8 Nov"
were checked against, or found in, the step 1 capture of 8 November 2026.

| Page | What | Why it looks wrong | Source |
| --- | --- | --- | --- |
| `/` | Statistic card 2, "50-90% embodied", cites Röck et al. 2020 | The cited paper gives 20-25%, 45-50% and more than 90% only in extreme cases | Review 4 Nov |
| `/` | 42% figure attributed to Architecture 2030 | That figure includes infrastructure; UNEP Global Status Report 2025-26 gives about 37% | Review 4 Nov |
| `/` and others | Launch banners from February 2025 | Stale, and the dates disagree (17 vs 26 February) | Review 4 Nov |
| `/termsandconditions` | Privacy-policy template left unfilled | Operator blank, refers to a Cookies Policy that does not exist, gives info@ while the site uses office@; there is no legal notice | Review 4 Nov |
| `/understanding-the-data-collection-process` | Link to the Platform Guidance Document | Google Drive link is dead | Review 4 Nov |
| `/understanding-the-data-collection-process` | Data template | Promised on the page but not provided | Review 4 Nov |
| `/job-opportunities` | Browser title "Join the GBDI Team! - My Framer Site" | Seen on 4 Nov. Gone in the capture of 8 Nov: every page now has the same title, "Global Building Data Initiative". Unique titles are an allowed invisible change in Phase A | Review 4 Nov, capture 8 Nov |
| `/job-opportunities` | Different header from all other pages (menu order Home, Platform, Community, About, Resources; "Join community"; "Sign up / sign in") | Not seen in the capture of 8 Nov: the page is now on the same Framer build as the others (49ba03b) and shows the standard desktop header. That menu order and those labels are what the phone menu shows on every page (`docs/baseline/home-390-menu-open.png`) | Work order 6 Nov, capture 8 Nov |
| Site-wide | Two different Join targets | Flagged in the review; which links point where is to be confirmed from the capture | Review 4 Nov |
| Join form (Google Form) | No privacy text | Personal data is collected without saying how it is used | Review 4 Nov |
| `/about` | Objectives | No target year or method given | Review 4 Nov |
| `/about` | Phase timeline | Skips 2026 | Review 4 Nov |
| `/frequently-asked-questions` | Scope described as "upfront embodied" | Flagged in the review; see the review for the reasoning | Review 4 Nov |
| All pages | No `<h1>`, one shared title, images without `alt`, no `lang` | Confirmed 8 Nov: no `<h1>` and no `lang` on any page; for example 11 of 13 images on `/` and 12 of 12 on `/about` have no `alt`. Fixed in Phase A as allowed invisible changes | Review 4 Nov, capture 8 Nov |
| `/` | Launch banner text differs between desktop and phone | Desktop: "The Open Building Data Platform is now live! Take a sneak-peek or try it out. Missed the Online Launch Event? Watch it here." Phone: "...is now live February 17th! Take a sneak-peek." Copy each layout as it is | Capture 8 Nov |
| Site-wide | Phone menu differs from the desktop header | Phone: Sign up, Join Community, then Home, Platform, Community, About, Resources. Desktop: Home, About, Community, Platform, Resources, Join, Sign in. Copy each layout as it is | Capture 8 Nov |
| `/frequently-asked-questions` | Answer 3 says "A free data template is available for download on the Open Data Format page" | Matches the review's point that the promised template is missing; to check on `/open-data-format` | Capture 8 Nov |
| Tablet header | "Join" links to app.gbdi.io on tablet, to the Google Form on desktop | Same label, different target depending on screen width. Copied as it is | Capture 8 Nov |
| `/job-opportunities`, `/about` and others | Email links written `mailto: name@...` with a space | Works in most mail programs but is not a valid address; copied as it is | Capture 8 Nov |
| `/community` | SE2050 link is " https://se2050.org" with a leading space | Copied as it is | Capture 8 Nov |
| `/launch-webinar` | The sentence after "Beta" is joined with an em-dash (U+2014) | House style for new writing avoids em-dashes; GBDI's text is copied as it is | Capture 8 Nov |
| `/clear` | "Founded by RICS, WBSCD, and GBDI" | "WBSCD" looks like a typo for WBCSD (spelled WBCSD elsewhere on the page) | Capture 8 Nov |
| `/clear` | "Category of activity : collaboration", "Harmonized WLCA framework : " | Space before the colon | Capture 8 Nov |
| `/open-data-format` | Email address office@gbdi.io in plain text, not a link | Inconsistent with other pages | Capture 8 Nov |
| `/understanding-the-data-collection-process` | Link to the Open Data Format page uses the full address https://www.gbdi.io/open-data-format and opens in a new tab | Other internal links are relative and open in the same tab | Capture 8 Nov |
| `/community` | BECD logo has no link | Every other logo links to its partner. Kept without a link | Capture 8 Nov |
| `/community` | EPFL and USP appear twice, in Lead Partners and in Research partners | USP uses a different logo file each time. Possibly intended | Capture 8 Nov |
| `/community` | "Research partners" in lower case | The other three wall titles are capitalised | Capture 8 Nov |
| `/community` | RISE logo links to riseregenerate.com | Confirms the review: it is in Lead Partners on this page | Review 4 Nov, capture 8 Nov |
| `/platform` | "Get in touch" links to `mailto: office@gbdi.io` (space after the colon) | Same as the other mailto links; copied as it is | Capture 8 Nov |
| `/platform` | Policy Makers text: "exchange  of" with a double space | Not visible in HTML; copied as it is | Capture 8 Nov |
| `/about` (tablet) | The Address email reads office@gbdi.io but links to `mailto: info@gbdi.io` | Text and link disagree, on the tablet layout only. Copied as it is | Capture 8 Nov |
| `/about` (tablet) | The GLOBE block has no "GLOBE" title | Desktop and phone have it. Copied as it is | Capture 8 Nov |
| `/about` | Address uses line-separator characters (U+2028): "LMC  Station 12" shows a double space | Copied as it is | Capture 8 Nov |
| `/about` | Son Pham-Ba, Pierre Guilbert and Yannick Marcon all list enacit4research@epfl.ch | A shared group address, not personal ones | Capture 8 Nov |
