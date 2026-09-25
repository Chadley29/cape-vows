# SXO / SERP-Intent Audit — Cape Vows (capevows.co.za)

**Date:** 2026-09-18 · **Scope:** 10 target queries from live GSC (28 days ending 2026-09-15) · **Method note below — read before the findings.**

---

## Method / limitations (read first)

- **Direct Google SERP scraping did not work.** `WebFetch` against `google.com/search?q=...` returned Google's bot-block/consent error page, not real results (confirmed live during this audit — see Limitations). This is expected and matches the briefing's SSRF/anti-bot notes.
- **Primary SERP evidence in this report comes from the `WebSearch` tool**, which returns a live organic result set (title/URL/snippet) but is **not confirmed to be a 1:1 mirror of Google's exact SERP ordering** — it appears to return roughly the top ~9 organic results with no explicit rank numbers and no SERP-feature metadata (no featured snippet / PAA / ads flags were exposed). Every page-type classification below is built from these real, live URLs — this is real evidence, not invented data — but "where it ranks relative to Cape Vows" statements are inference from (a) whether Cape Vows appears in the returned set at all, cross-referenced against (b) Cape Vows's own GSC position for that exact query. Treat any specific numeric rank claim for a third-party site as an inference, labelled as such, not a confirmed SERP position.
- **GSC page-level data is the ground truth for Cape Vows's own performance** and is used in preference to the briefing's query-level blended averages wherever the two diverge (see the Bottelary Road section — the discrepancy is material and explained there). All GSC figures below are re-derived directly from `audits/2026-09-18/_gsc_raw.json` (218 rows, 28 days, 2026-08-21 to 2026-09-15), not copied from the briefing without verification.
- No DataForSEO, no GA4 — per briefing, not used.
- Live HTML was spot-checked with `curl` for the specific claims in the "Findings by severity" data-quality flag below (not a full re-audit of already-confirmed items 1–6 in the briefing).

---

## Query-by-query verdicts

For each query: GSC ground truth (page + impressions + GSC-reported position, re-derived from `_gsc_raw.json`), the SERP-dominant page type (from live `WebSearch` evidence), the intent-match score, and the decisive build-or-don't-build call.

### 1. "wedding venues western cape winelands" — 110 imp (28d)

- **GSC page split:** `/blog/budget-friendly-winelands-venues` 73 imp, pos 36.1 · `/blog/wedding-venue-prices-stellenbosch-winelands` 17 imp, pos 64.4 · `/venues/eikenhof-estate` 12 imp, pos 41.4 · `/venues` (the actual directory/catalog page) **only 7 imp, pos 73.0** · `/venues/la-paris-estate` 1 imp, pos 4.0.
- **SERP-dominant type (WebSearch, live):** broad regional directory/hub pages — pink-book.co.za `/wedding-venues/cape-winelands/`, sa-venues.com equivalent, southafrica.net's official tourism regional guide "weddings in the winelands", plus a couple of third-party blog roundups (discoverafrica.com, tamlynamberwanderlust.com). No single-venue pages and no budget-angled content appeared in the returned set.
- **Cape Vows's actual ranking page:** a *budget-tier-specific* blog post — the wrong angle for a generic, non-budget head term — plus a nearly-invisible `/venues` catalog.
- **Score: 1/5 — CRITICAL mismatch.** Wrong type (blog listicle answering a directory-hub query) and wrong intent angle (budget-framed post capturing spillover from a query with no budget signal in it).
- **Decisive call: NON-EXISTENT page.** `/venues` is the only page on the site built as a directory/hub, and it is functionally invisible for this term (pos 73, i.e. off any realistic results page). Evidence for why: `astro-build/src/pages/venues/index.astro` lines 20-33 — the H1 is generic ("Western Cape Venues"), the only static copy is one description sentence, there are no regional sub-sections, no per-region anchor copy, and the full card grid only renders via `VenuesApp.jsx` (`client:load`) with a `<noscript>` fallback duplicate underneath (per briefing's open item, no filter bar before hydration). This page cannot compete against dedicated regional hub pages because it isn't structured as one — it's a flat, undifferentiated catalog trying to rank for many different regional head terms at once with zero region-specific on-page signal. **Recommend building this out as a genuine regional-hub page** (static per-region intro copy blocks, e.g. an H2 + a paragraph for "Cape Winelands wedding venues", "Stellenbosch wedding venues", etc., crawlable without JS) rather than a brand-new URL — this is an enhancement to `/venues`, not necessarily a new route.

### 2. "franschhoek wedding venues" — 90 imp

- **GSC page:** `/blog/best-wine-estate-venues-franschhoek` — 90 imp (100% of query volume), pos **71.2** — every single impression, one page, and it's essentially off the results entirely.
- **SERP-dominant type:** mixed — some regional hubs (franschhoek.org.za's official "Weddings" tourism page, weddingconcepts.co.za's `/wedding-venues-franschhoek/` planner hub) but **also multiple third-party blog listicles in the exact same format Cape Vows already uses**: goldotter.co.za "Franschhoek Wedding Venues & Packages: Top Picks for 2026", zara-zoo.com "Top 5 Wedding Venues in Franschhoek". Individual venue sites (grandeprovence.co.za) and directory profiles (pink-book.co.za, thewhiteedit.com) also appear.
- **Score: 3/5 — MEDIUM mismatch.** The *type* is right (Cape Vows's post is structurally the same pattern as the two competing "Top 5" listicles that do appear in the result set) — this is not a page-type problem. It's an **authority/comprehensiveness gap**: Cape Vows's post covers 5 venues from a small 24-venue directory against pink-book's full profile network and an official town tourism board page, in one of South Africa's single most contested wedding-venue keywords.
- **Decisive call: EXISTING pattern (blog post), not a new page type.** Building a second Franschhoek asset or a new page type won't fix this — it needs off-page authority (backlinks, GEO citations) that no on-page SXO fix can substitute for. Flag as a "don't over-invest here" case for Phase 2: this is the one query in the batch where the honest recommendation is to not chase it hard with more content, because the format is already correct and the gap is competitive authority, not intent-match.

### 3. "wedding venues cape winelands" — 108 imp

- **GSC page split:** `/blog/budget-friendly-winelands-venues` 76 imp, pos 45.9 · `/blog/wedding-venue-prices-stellenbosch-winelands` 18 imp, pos 35.6 · `/venues/eikenhof-estate` 9 imp, pos 58.6 · `/venues/lanzerac-wine-estate` 5 imp, pos 83.0. **`/venues` itself does not appear at all for this exact query** (0 rows).
- **SERP-dominant type:** identical result set to query 1 (pink-book.co.za, sa-venues.com-style regional directory, southafrica.net regional guide, capetownmagazine.com roundup) — this is effectively the same search intent as "wedding venues western cape winelands" with the word order/inclusion of "western" dropped.
- **Score: 1/5 — CRITICAL mismatch.** Same diagnosis as query 1: a budget-angled post and an individual farm-venue page are absorbing impressions for a broad, non-budget, non-venue-specific head term, and `/venues` — the only correctly-typed page — isn't even registering.
- **Decisive call: NON-EXISTENT page** — same fix as query 1 (this is realistically the same target page; "wedding venues cape winelands" and "wedding venues western cape winelands" should be treated as one keyword cluster served by one strengthened regional hub, not two separate builds).

### 4. "cheap wedding venues stellenbosch" — 36 imp

- **GSC page split:** `/blog/budget-friendly-winelands-venues` 30 imp, pos 45.4 · `/blog/wedding-venue-prices-stellenbosch-winelands` 3 imp, pos 36.7 · `/venues/eikenhof-estate` 3 imp, pos 79.0.
- **SERP-dominant type:** budget/affordability-focused listicles — pink-book.co.za "Affordable Wedding Venues in Stellenbosch", saweddings.co.za's matching affordability article, plus travel-booking noise (Expedia/Travelocity hotel-wedding packages, not true competitors) and TikTok content.
- **Score: 4/5 — MEDIUM-LOW mismatch, right pattern.** This is the one broad-ish query where Cape Vows's budget-angled post is *exactly* the right type and angle — it matches pink-book's own "Affordable Wedding Venues in Stellenbosch" piece almost format-for-format. Position (45.4) is still weak, but that's an authority/depth problem, not an intent-match problem.
- **Decisive call: EXISTING pattern (blog post) — already the correct page.** No new page needed here; this is a content-depth/on-page-strength case for the "content" workstream (`/seo content` per skill routing), not an SXO structural fix.

### 5. "wedding venue stellenbosch prices" — 29 imp

- **GSC page split:** `/blog/budget-friendly-winelands-venues` 25 imp, pos 30.7 · `/blog/wedding-venue-prices-stellenbosch-winelands` 4 imp, pos 24.0.
- **SERP-dominant type:** mixed — individual venues' own pricing/wedding pages ranking directly by brand (eikenhofestate.co.za's own `/weddings/` page titled "Wedding venues Stellenbosch: Celebrate at Eikenhof", lanzerac.co.za/weddings) plus one third-party affordability article (pink-book/saweddings) and irrelevant hotel-booking-aggregator noise (Expedia/Travelocity/Hotwire, not real competitors for this intent).
- **Score: 3/5 — MEDIUM.** The *purpose-built* page for this query already exists — `wedding-venue-prices-stellenbosch-winelands` is literally a pricing-tier guide per CLAUDE.md — but it's getting only 4 of the 29 impressions, while the more general `budget-friendly-winelands-venues` post (a different post, different angle) is capturing 25. That's **internal cannibalization between two similarly-themed posts**, not a missing page type.
- **Decisive call: EXISTING pattern — but fix internal linking/differentiation, don't build a new page.** The prices post and the budget-friendly post are functionally competing for the same "how much does it cost" intent cluster (also see Finding 5b below, the Quoin Rock case, and Finding 8, the Lanzerac case — this is a recurring pattern across the account, not a one-off).

### 6. "bottelary road wedding venues" — 97 imp

See the dedicated **Bottelary Road cluster analysis** section below for full detail (task items 6 and 7). Summary: **Score: 5/5 — ALIGNED.** The blog post `wedding-venue-bottelary-road-stellenbosch` ranks at a genuinely good position (pos 11.1 on the row that carries 78 of the 97 impressions) — this is the single best-performing content pattern on the whole site.

### 7. "small wedding venues cape winelands" — 25 imp (matched rows; briefing lists other variants too)

- **GSC page split:** `/blog/budget-friendly-winelands-venues` 25 imp, pos 66.7 · `/blog/wedding-venue-prices-stellenbosch-winelands` 5 imp, pos 50.8 · `/venues/eikenhof-estate` 4 imp, pos 56.8.
- **SERP-dominant type:** broad regional directories again (capetownmagazine.com "Top Wedding Venues in the Cape Winelands", sa-venues.com, pink-book.co.za, topweddingsuppliers.co.za) **plus one venue explicitly marketed around small/intimate capacity** (lalapanzilodge.co.za, "personalised wedding packages for 8–24 guests").
- **Score: 1/5 — CRITICAL mismatch, on two axes.** Type mismatch (blog listicle vs. regional directory) *and* intent-angle mismatch: "small/intimate" is a **capacity** intent, not a **budget** intent, and Cape Vows is answering it with its budget post purely because that's the closest topically-adjacent page it has, not because it's actually about capacity.
- **Decisive call: neither existing pattern fits well, and volume (25 imp/28d) does not independently justify a new standalone page.** Do not build a dedicated "small wedding venues" page. Fold this into the same regional-hub fix recommended for queries 1/3 — e.g. a short "for smaller, more intimate weddings" callout section within the strengthened `/venues` hub, possibly linking a capacity-filtered `/venues?capacity=...` view (the filter-to-URL-param mechanism already exists per CLAUDE.md's "Filters in the URL" pattern) rather than commissioning new content.

### 8. "wedding venues stellenbosch" — 108 imp

- **GSC page split:** `/blog/wedding-venue-bottelary-road-stellenbosch` 56 imp, pos 33.6 · `/blog/wedding-venue-prices-stellenbosch-winelands` 52 imp, pos 55.4. **No row for `/venues` at all.**
- **SERP-dominant type:** the **clearest regional-hub signal in the entire batch**. pink-book.co.za has a literal dedicated page at `/wedding-venues/stellenbosch/`; topweddingsuppliers.co.za has `/stellenbosch-wedding-venues/`; capetownmagazine.com runs a broad roundup. Alongside these, several individual venues rank directly by brand for this exact town-wide query — including **Nooitgedacht Estate** (`nooitgedachtestate.co.za`), which is already in Cape Vows's own 24-venue directory, and Alluvia, Lanzerac, and Deannie Landgoed (not in the directory).
- **Score: 1/5 — CRITICAL mismatch.** This is the single highest-volume non-brand, non-Bottelary query in the whole 28-day pull (108 imp, tied with "wedding venues western cape winelands" for the top spot) and Cape Vows has **no page whatsoever attempting to answer it directly** — a hyper-local Bottelary post and a pricing post are absorbing all the impressions purely by keyword-string overlap ("Stellenbosch" appears in both), not by genuine topical fit.
- **Decisive call: NON-EXISTENT page.** This is the **single highest-confidence "build" recommendation in this entire audit.** Unlike the Franschhoek case (query 2, where competing pages have real domain authority Cape Vows can't easily match), the direct competitors here for a dedicated Stellenbosch hub are the same mid-authority directory sites (pink-book, topweddingsuppliers) Cape Vows is already competitive against elsewhere in the account (e.g. beating similar sites on the Bottelary cluster). A dedicated Stellenbosch regional landing page — either `/venues?region=Cape%20Winelands` strengthened with Stellenbosch-specific static copy, or a genuinely new route — is the clearest, best-evidenced Phase 2 candidate: highest volume, zero current page-type competition internally, and a beatable competitive set externally.

### 9. "venue hire bottelary road" — 58 imp

Part of the Bottelary Road cluster, see dedicated section below. **Score: 5/5 — ALIGNED** (blog post pos 11.1 on the 46-of-58-impression row).

### 10. "quoin rock wedding venue price" — 36 imp

- **GSC page split:** `/blog/budget-friendly-winelands-venues` 30 imp, pos 34.5 · `/blog/wedding-venue-prices-stellenbosch-winelands` 6 imp, pos 22.5. **Correction to the briefing's framing:** the briefing describes this query as mapping to the prices post; the page-level GSC data shows the *budget-friendly* post is actually the larger driver (30 of 36 impressions), with the prices post a smaller secondary contributor. Both readings support the same underlying finding below, but the primary carrying page is the budget post, not the prices post.
- **Grep confirms neither post ever names "Quoin Rock"** (`grep -n -i "quoin rock" astro-build/src/data/posts.js` returns zero matches) — Google is surfacing this purely on general Winelands-pricing topical relevance, not because Cape Vows mentions the venue.
- **SERP-dominant type:** single-venue-specific editorial/portfolio coverage of Quoin Rock itself (quoinrock.co.za's own venue page, tourismtattler.com, insideguide.co.za, dorpie.co.za, wezoree.com, theweddingfairy.co.za) — i.e. the query's true intent is "tell me about this one specific venue's pricing," a venue that is **confirmed not in `venues.js`** (per briefing).
- **Score: 1/5 — mismatch by definition, but not a fixable one.** Cape Vows cannot legitimately serve this query's actual intent without fabricating pricing data for a venue it has never verified — which CLAUDE.md's content policy explicitly forbids ("Blog posts may only reference the 24 venues in VENUES[] — never fabricate venues").
- **Decisive call: neither existing pattern nor a new page — do not target this query.** This is GEO/AI-citation spillover (Cape Vows's general pricing-topic authority getting incidentally surfaced), exactly as the briefing frames it, not a content gap to close. Any temptation to "just add a line about Quoin Rock's estimated pricing to capture this" should be resisted — it would require fabricating a number for an unverified competitor venue.

---

## Bottelary Road cluster deep-dive (task items 6 and 7)

### GSC ground truth, re-derived page-by-page from `_gsc_raw.json`

| Query | Page | Impressions | GSC position |
|---|---|---:|---:|
| bottelary road venues | `/blog/wedding-venue-bottelary-road-stellenbosch` | 79 | **9.7** |
| bottelary road venues | `/venues/eikenhof-estate` | 19 | 38.8 |
| bottelary road wedding venues | `/blog/wedding-venue-bottelary-road-stellenbosch` | 78 | **11.1** |
| bottelary road wedding venues | `/venues/eikenhof-estate` | 17 | 44.9 |
| bottelary road wedding venues | `/blog/wedding-venue-prices-stellenbosch-winelands` | 1 | 4.0 |
| bottelary road wedding venues | `https://www.capevows.co.za/blog` | 1 | 61.0 |
| wedding venue bottelary road | `/blog/wedding-venue-bottelary-road-stellenbosch` | 42 | **11.8** |
| wedding venue bottelary road | `/venues/eikenhof-estate` | 11 | 44.6 |
| wedding venue bottelary road | `/venues` | 9 | 68.1 |
| wedding venue bottelary road | `/blog/wedding-venue-prices-stellenbosch-winelands` | 2 | 5.0 |
| venue hire bottelary road | `/blog/wedding-venue-bottelary-road-stellenbosch` | 46 | **11.1** |
| venue hire bottelary road | `/venues/eikenhof-estate` | 12 | 63.0 |
| accommodation bottelary road | `/blog/wedding-venue-bottelary-road-stellenbosch` | 40 | 21.3 |
| accommodation bottelary road | `/venues/eikenhof-estate` | 9 | 54.1 |

**Important discrepancy to flag:** the briefing's query-level blended averages (e.g. "bottelary road wedding venues... pos 30.2") are noticeably worse than what the page-level rows above actually show for the *blog post specifically* (pos 9.7–21.3 across all five query variants). Re-summing the raw rows for "bottelary road wedding venues" gives an impression-weighted average of ~17.5, not 30.2 — the blended number is being dragged down by the much-worse-performing `/venues/eikenhof-estate` and `/venues` rows sharing the same query. **The takeaway changes materially depending on which number you use:** at the query-blended level this cluster looks like a mid-page-3 performer; at the page level, the actual asset doing the work (`wedding-venue-bottelary-road-stellenbosch`) is sitting at the very bottom of page 1 / top of page 2 across every variant — genuinely close to breaking into strong visibility. Report both, but weight the page-level figures more heavily for strategic decisions, since they isolate which *asset* to invest further in.

### Competing page: eurekafunctions.co.za "Best Bottelary Road Wedding Venues"

Live-fetched (`WebFetch`) on 2026-09-18:

- **Title:** "Bottelary Road Wedding Venues: A Technical Guide"
- **Format:** multi-venue listicle covering **four** venues (Eikenhof Estate, Klein Bottelary, Fort Simon Wine Estate, Meerdam Farm) — i.e. broader coverage than Cape Vows's single-venue-anchored post, which deliberately covers only Eikenhof Estate plus a brief secondary mention of Nooitgedacht for the wider area.
- **Structure:** ~1,800–2,000 words, six H2-level sections including "Technical Infrastructure and Logistics: A Framework for High-Performance Event Execution" and an FAQ section (4 questions: pricing, backup power, guest capacity, airport proximity).
- **In the live `WebSearch` result set for "bottelary road wedding venues"**, eurekafunctions.co.za appeared at position 2 of the 9 returned organic results (directly after eikenhofestate.co.za's own site at position 1). **Cape Vows did not appear anywhere in that 9-result set.**
- **Inference (labelled, not confirmed):** GSC shows Cape Vows's blog post at genuine live position ~9.7–11.8 for these exact query variants. If `WebSearch`'s roughly-top-9 result set is a reasonable proxy for page-1 Google, this is consistent with Cape Vows sitting right at the boundary — just outside what `WebSearch` returned, while eurekafunctions sits comfortably inside it. **Best-supported read: eurekafunctions.co.za currently outranks Cape Vows for this specific query variant**, likely in the 3–9 range against Cape Vows's ~10–12, though this is inferred from the combination of two different data sources, not read directly off one SERP screenshot.
- **What explains the gap, if real:** broader venue coverage (4 venues vs. 1) and an FAQ block addressing more query variants (pricing, capacity, logistics) in one page — i.e. eurekafunctions is hedging across more of the keyword cluster within a single asset, where Cape Vows deliberately narrowed to one verified venue per CLAUDE.md's content-integrity rule.

### Verdict on the "narrow, single-venue-anchored blog post" pattern (task item 7)

**Working, and working unambiguously better than the broad-regional alternative — this is the strongest evidence in the whole account for a specific, narrow strategy over a broad one.**

- The Bottelary Road post (one venue, honestly scoped, explicit "we won't pad this guide" disclosure per CLAUDE.md) sits at GSC position **~10–12** across four different query variants totalling 245 impressions this pull (79+78+42+46, ignoring the smaller secondary rows).
- The broadest head terms in the account ("wedding venues western cape winelands," "wedding venues cape winelands," "wedding venues stellenbosch" — 326 combined impressions) are served by **no purpose-built page at all** and sit at GSC positions in the **36–73** range.
- This is not simply "narrow beats broad" as a universal SEO law — it's that **narrow content matched to a narrow, low-competition query wins**, while **broad content (or worse, off-angle content like a budget post) matched to a broad, high-competition query loses**, because the broad query's SERP is dominated by dedicated regional-hub pages Cape Vows doesn't have an equivalent of. The pattern's success is intent-match, not narrowness per se — the Franschhoek case (query 2) shows narrow-but-thin content losing badly even against a moderately competitive broad term, because comprehensiveness there is table stakes.
- **Recommendation for Phase 2:** keep commissioning single-venue-anchored posts for other micro-location queries with a similar profile (low competition, one verified venue, honest scope) — this pattern has now proven itself once with real data, it isn't a hopeful theory. Separately and in parallel, close the broad-regional-hub gap (queries 1, 3, 8 above) — these are two different problems requiring two different fixes, not one fix scaled up or down.

---

## Lanzerac cannibalization check (task item 8)

- **GSC ground truth:** for the query "lanzerac wedding venue" (20 imp per briefing), the page split is `/blog/budget-friendly-winelands-venues` 13 imp at pos **8.8**, and `/venues/lanzerac-wine-estate` 7 imp at pos **20.1**. **Both pages rank for the identical query, and the wrong one (the blog post) ranks better.**
- Separately, the brand-adjacent query "eikenhof estate" (11 imp, pos 17.3) and "eikenhof estate prices" (6 imp, pos 8.0) both correctly resolve to `/venues/eikenhof-estate` with no blog-post competition — so this is not a systemic problem across every venue, it's specific to Lanzerac (and, per Finding 5/10 above, a related pattern for "Stellenbosch prices"-type queries generally).
- **Is this a cannibalization problem, or fine?** **It's a real, low-severity cannibalization problem — not "fine," but not urgent either.** A user searching "lanzerac wedding venue" has unambiguous single-venue intent: they want Lanzerac's own page (contact details, capacity, the enquiry modal, the FAQ accordion with Lanzerac-specific answers), not a 3-venue budget comparison post that happens to mention Lanzerac in passing. Sending that searcher to `budget-friendly-winelands-venues` first is a worse on-site experience even where it technically "ranks," and it caps how well `/venues/lanzerac-wine-estate` itself can ever perform for its own brand-adjacent query, because Google is splitting relevance signal across two Cape Vows pages instead of consolidating it on one.
- **Specific recommendation:** add an explicit internal link from the relevant `budget-friendly-winelands-venues` section back to `/venues/lanzerac-wine-estate` with anchor text close to the query ("see full pricing and availability for Lanzerac Wine Estate") using the existing `venueLinks`/`linkifyVenues()` and item-level `slug` ("View venue →" button) mechanisms already present in `posts.js` — confirm the Lanzerac item inside `budget-friendly-winelands-venues` (around line 109 of `astro-build/src/data/posts.js`) already carries a `slug` field for this button pattern, and add one if it doesn't. That, combined with normal query-specific consolidation over time, should let `/venues/lanzerac-wine-estate` absorb more of this query's signal without needing to suppress or rewrite the blog post (which still legitimately serves the broader "budget" query it was built for).

---

## Summary scorecard

| # | Query | 28d imp | Best GSC page | GSC pos | SERP type Google rewards | Score /5 | Severity | Right target |
|---|---|---:|---|---:|---|---:|---|---|
| 1 | wedding venues western cape winelands | 110 | budget-friendly post | 36.1 | Broad regional directory/hub | 1 | CRITICAL | Non-existent — strengthen `/venues` into a real hub |
| 2 | franschhoek wedding venues | 90 | best-wine-estate-venues-franschhoek | 71.2 | Regional hub + blog listicles (mixed) | 3 | MEDIUM | Existing blog pattern — needs authority, not a new type |
| 3 | wedding venues cape winelands | 108 | budget-friendly post | 45.9 | Broad regional directory/hub | 1 | CRITICAL | Non-existent — same hub as #1 |
| 4 | cheap wedding venues stellenbosch | 36 | budget-friendly post | 45.4 | Budget/affordability listicle | 4 | LOW-MED | Existing blog pattern — already correct |
| 5 | wedding venue stellenbosch prices | 29 | budget-friendly post (should be prices post) | 30.7 | Venue-brand pages + affordability article | 3 | MEDIUM | Existing blog pattern — fix internal cannibalization |
| 6 | bottelary road wedding venues | 97 | wedding-venue-bottelary-road-stellenbosch | 11.1 (page-level) | Hyper-local micro-location content | 5 | ALIGNED | Existing blog pattern — already working |
| 7 | small wedding venues cape winelands | 25 | budget-friendly post | 66.7 | Regional directory + capacity-specific venue page | 1 | CRITICAL | Neither — fold into hub, don't build standalone |
| 8 | wedding venues stellenbosch | 108 | bottelary-road post (wrong page) | 33.6 | Dedicated town-level regional hub | 1 | CRITICAL | Non-existent — highest-confidence build in this audit |
| 9 | venue hire bottelary road | 58 | wedding-venue-bottelary-road-stellenbosch | 11.1 (page-level) | Hyper-local micro-location content | 5 | ALIGNED | Existing blog pattern — already working |
| 10 | quoin rock wedding venue price | 36 | budget-friendly post | 34.5 | Single-venue editorial (venue not in directory) | 1 | N/A — don't target | Neither — cannot legitimately serve intent |

---

## Overall verdict on regional landing pages (feeds Phase 2 directly)

**Build one broad Winelands/regional hub asset, and build one dedicated Stellenbosch town-level asset — both as enhancements to the existing `/venues` architecture, not brand-new one-off routes.** The evidence is decisive and consistent across three independent queries (1, 3, 8) totalling 326 of this pull's 2,606 impressions (12.5% of all impressions, concentrated in exactly the query type Cape Vows has zero purpose-built page for):

1. Every broad head-term query in this batch is currently answered by an off-angle blog post (usually the budget-friendly post, regardless of whether budget is even implied by the query) rather than the directory page — this is a genuine, fixable page-type mismatch, not a content-depth problem.
2. `/venues`, the one page structurally capable of being the regional hub, is nearly invisible in GSC for these exact terms (pos 58–73, or not appearing at all) because it has no static per-region/per-town copy for crawlers to match against — confirmed by direct inspection of `astro-build/src/pages/venues/index.astro`.
3. The competitive set for a Stellenbosch-specific hub (pink-book.co.za, topweddingsuppliers.co.za) is the same tier of mid-authority directory site Cape Vows is already beating on the Bottelary Road cluster — this is a winnable build, not a moonshot against Franschhoek-level competition.
4. Do **not** extend this to every micro-intent variation — "small wedding venues cape winelands" (query 7) and "quoin rock wedding venue price" (query 10) both fail the volume/legitimacy bar for a standalone page and should be folded into the hub or deliberately not targeted, respectively. The recommendation is two focused builds (a strengthened Winelands-wide hub, a new Stellenbosch-specific hub), not a proliferation of new regional pages.

---

## Findings by severity (count)

- **CRITICAL: 4** — queries 1, 3, 7, 8 (broad regional head terms with no matching page type; query 7 additionally has no viable standalone fix)
- **MEDIUM: 3** — query 2 (authority gap, not type gap), query 5 (internal cannibalization between two price-themed posts), the Lanzerac cannibalization finding (task item 8)
- **LOW/ALIGNED: 3** — query 4 (right pattern, needs depth), queries 6 and 9 (Bottelary Road cluster — genuinely working, evidence for the single-venue-blog strategy)
- **Not applicable / don't-fix: 1** — query 10 (Quoin Rock spillover — correctly not a target)
- **Data-quality flag (non-severity-scored):** live HTML contradiction on Cape Vows's own best-performing page — `astro-build/src/data/posts.js` line 327 states Eikenhof Estate is "an exclusive-use setting for up to 80 guests" (confirmed live in rendered HTML at `https://capevows.co.za/blog/wedding-venue-bottelary-road-stellenbosch`, HTTP 200), while `astro-build/src/data/venues.js` line 548 gives Eikenhof's capacity as `"Up to 180"` (also confirmed live on `https://capevows.co.za/venues/eikenhof-estate`, HTTP 200). Per CLAUDE.md's fact-check log, the "Up to 180" figure was deliberately corrected and verified twice against the source PDF — meaning the blog post's "80" figure predates that correction and was never updated. This sits on the single highest-traffic content asset in the entire account and directly touches E-E-A-T/trust signal quality; flagging for the content workstream (`/seo content`) since it is a factual-consistency fix, not a structural SXO fix, but it's material enough to note here given the page's traffic share.

---

## Cross-skill references

- Authority/comprehensiveness gaps on Franschhoek (query 2) and the broad regional-hub build recommendation → `/seo content` for depth planning, and standard backlink/off-page work outside this skill's scope.
- The Eikenhof capacity data contradiction above → flag for whichever workstream owns `astro-build/src/data/posts.js` copy fixes (content integrity, not schema).
- No local-pack/GBP intent signals observed in any of the 10 SERPs pulled (no map pack, no "near me" pattern) — `/seo local` not indicated for this query set.

---

## Limitations

- `WebFetch` against Google's own SERP HTML returned only Google's anti-bot error/consent interstitial (confirmed live, 2026-09-18) — no direct Google SERP scrape was possible. All SERP-type classifications rely on the `WebSearch` tool's live result set as the best available proxy, explicitly labelled throughout.
- `WebSearch` results carry no explicit numeric rank, no SERP-feature flags (featured snippet / PAA / ads / AI Overview presence could not be confirmed either way for any of the 10 queries) and appear capped at roughly 9 organic results per query — any claim about a competitor's exact position, or about SERP features being present/absent, is an inference or an explicit "not observed," never a confirmed absence.
- Bing Webmaster / Common Crawl / Moz free-tier fallbacks (suggested in the briefing as DataForSEO substitutes) were not additionally queried for this report — GSC ground truth plus live `WebSearch` were judged sufficient and more directly relevant to the specific 10-query brief; flagging the omission per the pre-delivery checklist rather than silently skipping it.
- The `_inspect_raw.json` URL Inspection batch's completion state was not checked for this report (not needed for any of the 10 query findings above — it covers indexing status, not SERP-intent matching).
- Position-30.2-vs-~17.5 discrepancy for "bottelary road wedding venues" (see Bottelary Road section) was investigated but its root cause (GSC's blended-average calculation across the underlying query+page rows) was not fully resolved beyond confirming the total-impression figures tie out exactly (97=97) while the average-position figures do not reconcile by simple impression-weighting of the rows in `_gsc_raw.json`. Reported transparently rather than silently adopting either number as sole truth.
