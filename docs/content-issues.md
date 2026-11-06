# Content issues: noticed, not changed

Phase A copies the live Framer site as it is. Anything that looks wrong is
logged here instead of fixed, and is dealt with in Phase B (see section 0 of
`docs/01-rebuild-work-order.md`).

Add a row whenever you notice something. Say which page, what you saw, and why
it looks wrong. Leave the fix to Phase B.

The first rows come from the website review of 4 November 2026 (ask Martin for
the link). They were found on desktop in Chrome and are to be confirmed against
the captured text from step 1.

| Page | What | Why it looks wrong | Source |
| --- | --- | --- | --- |
| `/` | Statistic card 2, "50-90% embodied", cites Röck et al. 2020 | The cited paper gives 20-25%, 45-50% and more than 90% only in extreme cases | Review 4 Nov |
| `/` | 42% figure attributed to Architecture 2030 | That figure includes infrastructure; UNEP Global Status Report 2025-26 gives about 37% | Review 4 Nov |
| `/` and others | Launch banners from February 2025 | Stale, and the dates disagree (17 vs 26 February) | Review 4 Nov |
| `/termsandconditions` | Privacy-policy template left unfilled | Operator blank, refers to a Cookies Policy that does not exist, gives info@ while the site uses office@; there is no legal notice | Review 4 Nov |
| `/understanding-the-data-collection-process` | Link to the Platform Guidance Document | Google Drive link is dead | Review 4 Nov |
| `/understanding-the-data-collection-process` | Data template | Promised on the page but not provided | Review 4 Nov |
| `/job-opportunities` | Browser title "Join the GBDI Team! - My Framer Site" | Framer default site name left in. Fixed in Phase A as an allowed invisible change | Review 4 Nov |
| `/job-opportunities` | Different header from all other pages (menu order Home, Platform, Community, About, Resources; "Join community"; "Sign up / sign in"; Resources links to this page) | Built on a different Framer version. Phase A uses the standard header here, as the work order says | Work order 6 Nov |
| Site-wide | Two different Join targets | Flagged in the review; which links point where is to be confirmed from the capture | Review 4 Nov |
| Join form (Google Form) | No privacy text | Personal data is collected without saying how it is used | Review 4 Nov |
| `/about` | Objectives | No target year or method given | Review 4 Nov |
| `/about` | Phase timeline | Skips 2026 | Review 4 Nov |
| `/frequently-asked-questions` | Scope described as "upfront embodied" | Flagged in the review; see the review for the reasoning | Review 4 Nov |
| To confirm from the capture | RISE logo | Links to riseregenerate.com | Review 4 Nov |
| All pages | No `<h1>`, no unique titles, no `alt`, no `lang` | Fixed in Phase A as allowed invisible changes | Review 4 Nov |
