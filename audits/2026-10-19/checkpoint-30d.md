# 30-day checkpoint — Search Console

**Property:** `sc-domain:capevows.co.za` · **Pulled:** 2026-10-19 · **Window:**
2026-09-21 → 2026-10-16 (28 days; GSC lags ~3 days) · **Baseline:**
`audits/2026-09-18/` (window 2026-08-21 → 2026-09-15)

## Executive summary

**Overall verdict: site-level growth continues, but the 30-day tests are
mixed and two regressions need action.** Impressions rose 26% to 3,275 and
average position improved from 25.6 to 21.9, but clicks only went from 26 to
29 and CTR slipped to 0.89%. Of the four 30-day tests: `/venues` CLS is
**CONFIRMED**. Venue-page visibility is **FALSIFIED** as written (still 8/24
like-for-like), and the metric itself was mis-specified: page-level data
shows 23/24 venue pages already get impressions. `elgin-vintners` and www
consolidation are **INCONCLUSIVE**, because Google hasn't recrawled the URLs
that matter. Two problems the plan didn't anticipate: the Bottelary Road post
lost its query cluster on 16–17 Sep (596 → 18 impressions), *before* the
Stellenbosch-town post existed, and Google hasn't recrawled it since 6 Sep.
Three venue pages (Belmond Mount Nelson, Saronsberg, La Petite Ferme)
dropped to "Crawled – currently not indexed".

---

## 0. Method notes (read before comparing numbers)

- **Commands.** Run exactly as in the plan, via
  `~/.claude/skills/seo/scripts/` using `py -3.13`. The default `python`
  (3.11) lacks `google-api-python-client`, which is why the first attempt
  failed. Nothing was installed.
- **Totals are comparable.** `gsc_query.py` reports site totals from a
  dimensionless aggregate query, which is the same method as the 2026-09-18
  pull. As a check, re-pulling the baseline window at page level today gives
  exactly 2,606 / 26 / 25.6.
- **Two levels of data, and they disagree a lot.** Query×page rows (the
  plan's basis) drop Google's anonymised long-tail queries. This pull's
  rows sum to 2,188 of 3,275 impressions and **only 3 of 29 clicks**.
  Page-dimension data keeps the anonymised impressions. I pulled both, for
  both windows, so every comparison below is like-for-like and labelled.
- **Baseline correction.** Two baseline figures in `00-gsc.md` were
  artefacts of using query×page rows. Venue pages with impressions were
  **22/24** at page level, not 8/24. Venue pages with clicks were **5** at
  page level, not 1. This matters for the 60/90-day plan (§8).

## 1. The 30-day tests

| Metric | Baseline | Now | Plan's threshold | Verdict |
|---|---|---|---|---|
| Venue pages with any impressions | 8/24 (query×page) | **8/24** (query×page) · 23/24 (page-level) | Confirms 12+, falsifies ≤8 | **FALSIFIED** (as written) |
| `elgin-vintners` index status | "Redirect error", crawled 2026-09-03 | **"Redirect error", crawled 2026-09-03**, unchanged | Confirms "Submitted and indexed" | **INCONCLUSIVE** |
| www rows in GSC | "2 of 218" | 19 of 256 rows, 1 URL · 2.2% of page-level impressions (was 3.4%) | Confirms continued decline | **INCONCLUSIVE** |
| `/venues` desktop CLS | 0.881 | **0.018** (lab, already confirmed, not re-run) | Confirms <0.1 | **CONFIRMED** |

### 1a. Venue pages with impressions — FALSIFIED (as written)

Like-for-like (query×page rows), the count is **still 8/24**, and it is
the *same eight pages* as the baseline: Eikenhof, La Paris, Lanzerac,
Boschendal, Babylonstoren, Groot Constantia, Cape Point Vineyards and La
Roche. That meets the plan's falsification condition exactly.

Two things change the reading:

1. **Volume on those eight grew sharply:** 190 → 1,083 query-row
   impressions. At page level, all venue pages together went from 529 to
   1,807 impressions (×3.4) and from 5 to 11 clicks.
2. **The threshold was mis-specified.** At page level, 22/24 venue pages
   already had impressions in the baseline window, and 23/24 do now (only
   `elgin-vintners` has none). Most of these are anonymised queries at
   positions 7–10, almost certainly venue-name searches too small to be
   reported.

**What the falsification actually tells us:** the static-HTML fix did its
job. Every venue page except one is indexed and being shown. But the set
of venue pages that surface for a *reportable* query hasn't widened in a
month. The plan's stated implication holds: the blocker for the other 16
is ranking and demand for non-brand queries (internal linking, content
depth), not crawlability. The three new de-indexings in §6 point the same
way.

### 1b. `elgin-vintners` — INCONCLUSIVE

The record is byte-for-byte the same as September: `REDIRECT_ERROR`, last
crawl `2026-09-03T10:08:34Z` (cutover day). **Google hasn't re-fetched the
URL in 46 days.** Live checks today:

```
https://capevows.co.za/venues/elgin-vintners      → 200 OK
https://www.capevows.co.za/venues/elgin-vintners  → 301 → apex
sitemap.xml                                       → listed
```

The only referring URL Google records is
`/blog/wedding-venue-prices-stellenbosch-winelands`. The plan's falsifier
was conditional on an indexing request being made first. I can't tell from
the API whether one was made. Either way, with no recrawl there is no new
evidence. **Next step: "Request Indexing" on this URL in the GSC UI**, then
re-inspect in a week. If it still shows `REDIRECT_ERROR` *after a fresh
crawl date*, treat it as a live bug.

### 1c. www consolidation — INCONCLUSIVE

The baseline's "2 of 218" can't be reproduced as a row count: the baseline
file has **10** www query rows across **2** distinct www URLs. "2" was
evidently the URL count. The current signals point in different
directions:

| Measure | Baseline | Now | Direction |
|---|---:|---:|---|
| www query rows | 10 | 19 | ▲ worse |
| Distinct www URLs in query rows | 2 | 1 | ▼ better |
| Distinct www URLs, page level | 6 | 4 | ▼ better |
| www share of page-level impressions | 3.4% | 2.2% | ▼ better |
| `www.capevows.co.za/` impressions | 51 | 71 | ▲ worse |

**Reading:** the inner-page www URLs are draining as hoped (`/blog` 24 → 0,
`/privacy-policy.html` 10 → 0, `/venues/elgin-ridge-wines` 7 → 1). The
**www homepage is the holdout**, and it is growing. Its 19 rows are almost
all 1-impression long-tail queries at positions 30–257, plus "vows" brand
confusion. Inspection shows Google understands the redirect: "Page with
redirect", recrawled 2026-10-10, Google canonical = apex. So this is
Google still displaying the old URL during consolidation, not a site
defect. Re-check at 60 days. No action recommended.

### 1d. `/venues` CLS — CONFIRMED

0.881 → 0.018 (lab, desktop), noted as already confirmed. Field (CrUX)
data wasn't checked; the site's traffic is likely below CrUX's threshold.

## 2. Trend across all four pulls

| Pull | Window | Impressions | Clicks | CTR | Avg position |
|---|---|---:|---:|---:|---:|
| Pre-migration | 5–30 Aug | 1,435 | 11 | 0.77% | 34.7 |
| Mid-migration | 15 Aug–9 Sep | 1,968 | 15 | 0.76% | 29.4 |
| Audit baseline | 21 Aug–15 Sep | 2,606 | 26 | 1.00% | 25.6 |
| **30-day checkpoint** | **21 Sep–16 Oct** | **3,275** | **29** | **0.89%** | **21.9** |
| Δ vs baseline | | +25.7% | +11.5% | −0.11 pp | 3.7 places better |

This is the **first window that is entirely post-migration and doesn't
overlap the previous pull**, so it is the cleanest comparison in the
series. Impressions and position keep improving monotonically. Clicks are
lagging: the extra impressions arrived mostly at positions 30–60 for broad
Winelands/Stellenbosch terms, which don't click. At the 90-day pull,
watch clicks, not impressions.

## 3. Pages changed since the audit

### 3a. `/blog/wedding-venue-bottelary-road-stellenbosch` — REGRESSION

| | Baseline | Now |
|---|---:|---:|
| Page-level impressions | 596 | **18** |
| Page-level clicks | 1 | 0 |
| Query rows attributed to this page | 37 | **0** |
| Last crawled by Google | 2026-09-06 | **2026-09-06** (unchanged) |
| Coverage / canonical | Indexed, match | Indexed, match |

**Bottelary cluster: best-ranking Cape Vows page per query**

| Query | Baseline (Bottelary post) | Now: best page | Now: position |
|---|---:|---|---:|
| bottelary road venues | 9.7 | `/venues/eikenhof-estate` | 31.8 |
| bottelary road wedding venues | 11.1 | `/blog/wedding-venues-stellenbosch-town` | 17.3 (Eikenhof page: 43.7) |
| venue hire bottelary road | 11.1 | `/venues/eikenhof-estate` | 29.5 |
| wedding venue bottelary road | 11.8 | `/blog/wedding-venues-stellenbosch-town` | 32.8 (Eikenhof page: 33.8) |
| accommodation bottelary road | 21.3 | `/venues/eikenhof-estate` | 32.3 |
| bottelary road wine farms | 18.0 | `/venues/eikenhof-estate` | **11.0** (improved) |

Demand is intact: 418 → 394 impressions on Bottelary queries. But Google
now serves those queries with the Eikenhof venue page and the new
Stellenbosch-town post, both ranking 6–22 places worse than the post did.
**The cluster has lost its 9.7–11.8 positions.**

**When it happened (daily page-level impressions, `_gsc_page_date_raw.json`):**

| Date | Bottelary post | Eikenhof venue page | Stellenbosch-town post |
|---|---|---|---|
| 6–15 Sep | 17–94/day @ pos 16–22 | 0–3/day | — |
| 13–14 Sep | 69, 94 | **36, 82** (first real volume) | — |
| 16 Sep | 11 | 58 | — |
| 17 Sep onward | 0–3/day | 15–51/day @ pos 17–39 | — |
| 25 Sep | — | — | first impressions |

**Conclusions the data supports:**

- **The Stellenbosch-town post did not cause this.** The swap happened 16–17
  Sep, nine days before the new post's first impression.
- **The post-audit Eikenhof fix and hero-image fix also did not cause it,
  and Google hasn't seen them.** Both shipped after the 18 Sep audit, and
  the page's last crawl is still 6 Sep.
- Google moved the Bottelary queries from the blog post to the Eikenhof
  venue page around 13–16 Sep. The pricing and budget posts shed their
  broad head terms in the same week (§3d). The data shows *what* happened
  but not *why*. I won't guess at an algorithm update.

**Low-cost steps (none taken, since this pull is read-only):** Request
Indexing for this URL, so Google evaluates the corrected version. Also, the
sitemap still shows `lastmod 2026-07-07` for this post despite the
September edits, so updating it is a cheap freshness signal.

### 3b. `/blog/wedding-venues-stellenbosch-town` (new, live ~25 Sep)

- **Indexed:** "Submitted and indexed", last crawl 2026-10-18, canonical
  matches.
- **Impressions:** 714 page-level, avg position 38.2, 1 click. It is the
  **#2 page on the site** by impressions after three weeks.
- **Top queries:** wedding venues stellenbosch (103 @ 43.5), stellenbosch
  wedding venues (82 @ 43.8), venues in stellenbosch (68 @ 42.7), bottelary
  road wedding venues (64 @ 17.3), eikenhof estate (35 @ 20.4), hudson's
  wedding venue stellenbosch (28 @ 22.8), venue hire stellenbosch (28 @
  55.4), lanzerac wedding venue (15 @ **8.4**).

**Has it taken "wedding venues stellenbosch" from the Bottelary and pricing
posts?** Yes, almost entirely. But it hasn't ranked any better:

| Query | Baseline (impr @ weighted pos) | Baseline pages | Now | Now: share on town post |
|---|---|---|---|---|
| wedding venues stellenbosch | 108 @ 44.1 | Bottelary 33.6, pricing 55.4 | 105 @ 43.3 | 103 of 105 |
| stellenbosch wedding venues | 76 @ 44.2 | Bottelary 30.9, pricing 56.2 | 83 @ 43.3 | 82 of 83 |
| venues in stellenbosch | 28 @ 38.6 | Bottelary 35.0, pricing 47.5 | 68 @ 42.7 | 68 of 68 |

Google now treats the town post as *the* Stellenbosch page, which is the
intended consolidation. But the baseline's best single-page positions for
these queries came from the Bottelary post (30.9–35.0), and the town post
sits at 42.7–43.8. Consolidation is working; ranking gain hasn't happened
yet. That's the 60-day test ("moves into top 20").

**Side signal:** the post surfaces for venues that aren't in `VENUES[]`
(Hudson's 46 impr, La Pineta 7, Quoin Rock 9, Knorhoek 2). This is the same
pattern as the baseline's Quoin Rock/pricing-post signal. Note it for
content strategy, but don't add those venues to copy.

### 3c. `/blog/coastal-wedding-venues-cape-peninsula`

25 → **95** page-level impressions, 2 → 2 clicks, position 14.3 → 21.5.
Recrawled 2026-09-26. Its reach widened: new rows include "beach wedding
venues western cape" (18 @ 66.9) and "wedding venues near the beach" (6 @
**3.0**). Those broad terms dilute the average position. Healthy
early-stage growth.

### 3d. `/blog/wedding-venue-prices-stellenbosch-winelands`

| | Baseline | Now |
|---|---:|---:|
| Page-level impressions | 520 | 217 |
| Clicks | 5 | **7** |
| Avg position | 33.3 | **7.6** |
| CTR | 0.96% | **3.2%** |

Between 9 and 12 Sep it shed the broad Stellenbosch head terms it ranked
50+ for (those now go to the town post). What's left ranks top-10 and
converts: this is now **the best-converting page on the site**. Recrawled
2026-10-05. Almost all remaining traffic is anonymised: only 8 query rows.
"quoin rock wedding venue price" no longer lands here.

### 3e. Lanzerac cannibalisation

**"lanzerac wedding venue" (42 impr):** a blog post still wins, and the
split is now three ways.

| Page | Baseline | Now |
|---|---|---|
| `/blog/wedding-venues-stellenbosch-town` | — | **15 @ 8.4** |
| `/blog/budget-friendly-winelands-venues` | 13 @ 8.8 | 14 @ 34.2 |
| `/venues/lanzerac-wine-estate` | 7 @ 20.1 | 13 @ 36.1 |

"lanzerac wedding": town post 16.2, budget post 28.2, venue page 57.7. The
venue page has gone backwards (20.1 → 36.1) and is now the weakest of the
three. Last crawled 2026-09-16. The SXO cannibalisation flag from the
audit is now worse.

## 4. Striking distance (position 4–20, ≥5 impressions)

| Impr. | Pos | Clk | Query | Page |
|---:|---:|---:|---|---|
| 64 | 17.3 | 0 | bottelary road wedding venues | /blog/wedding-venues-stellenbosch-town |
| 45 | 8.4 | 0 | la paris wedding venue | /venues/la-paris-estate |
| 42 | 11.0 | 0 | bottelary road wine farms | /venues/eikenhof-estate |
| 22 | 5.0 | 0 | farm wedding venues | /venues/eikenhof-estate |
| 20 | 8.2 | 2 | cape point vineyards wedding | /venues/cape-point-vineyards |
| 18 | 8.3 | 0 | la paris estate wedding | /venues/la-paris-estate |
| 16 | 10.4 | 0 | boschendal wedding venue | /venues/boschendal-wine-estate |
| 16 | 11.9 | 0 | la paris estate wedding packages | /venues/la-paris-estate |
| 15 | 10.6 | 0 | babylonstoren wedding venue | /venues/babylonstoren |
| 15 | 8.4 | 0 | lanzerac wedding venue | /blog/wedding-venues-stellenbosch-town |
| 14 | 6.4 | 0 | groot constantia wedding venue | /venues/groot-constantia |
| 13 | 7.2 | 0 | vows *(brand confusion)* | www.capevows.co.za/ |
| 12 | 7.5 | 0 | the vow wedding venue *(brand confusion)* | / |
| 12 | 7.3 | 0 | vow wedding venue *(brand confusion)* | / |
| 10 | 6.8 | 0 | la paris wine estate | /venues/la-paris-estate |
| 8 | 17.9 | 0 | jonkershoek wedding venue | /blog/wedding-venues-stellenbosch-town |
| 7 | 7.3 | 0 | groot constantia wedding | /venues/groot-constantia |
| 6 | 12.2 | 0 | la paris estate | /venues/la-paris-estate |
| 6 | 6.7 | 0 | la paris estate franschhoek | /venues/la-paris-estate |
| 6 | 11.5 | 0 | wedding venues cape winelands | /venues/babylonstoren |
| 6 | 14.7 | 0 | wedding venues stellenbosch winelands | /venues/eikenhof-estate |
| 5 | 8.4 | 0 | cape point vineyard wedding | /venues/cape-point-vineyards |
| 5 | 9.4 | 0 | franschhoek venues | /blog/best-wine-estate-venues-franschhoek |
| 5 | 9.0 | 0 | wedding venue cape winelands | /venues/babylonstoren |
| 5 | 4.2 | 0 | wedding venue stellenbosch prices | /venues/babylonstoren |

**Pattern:** 14 of 25 rows are venue-name queries hitting venue pages at
positions 6–12. That is the expected slot for a directory beneath the
venue's own site, and the expected CTR is low. La Paris Estate alone has
five rows (101 impr) and is the strongest venue-name performer.

**Just outside the band, worth a look:** "farm wedding venue" sends **50
impressions at position 2.7 with 0 clicks** to `/venues/eikenhof-estate`.
A top-3 position with no clicks usually points to a title/snippet mismatch
with the query.

Brand confusion ("vow"/"vows") is shrinking: 11 rows, 50 impr, 0 clicks
(was 13 rows, 62 impr).

## 5. Venue pages with zero impressions + URL Inspection

At page level, **only `elgin-vintners` has zero impressions** (see §1b).
At query level, 16 pages have no reportable query, and all 16 were
inspected (`_inspect_raw.json`):

| Venue | Coverage | Last crawl | Canonical match | Change since Sep |
|---|---|---|---|---|
| elgin-vintners | Redirect error | 2026-09-03 | — | none, not recrawled |
| **belmond-mount-nelson** | **Crawled – currently not indexed** | 2026-08-23 | ✗ (stale: user canonical = homepage) | **dropped from index** |
| **saronsberg-wine-estate** | **Crawled – currently not indexed** | 2026-09-05 | ✓ | **dropped from index** |
| **la-petite-ferme** | **Crawled – currently not indexed** | 2026-09-04 | ✓ | **dropped from index** |
| lourensford-wine-estate | Submitted and indexed | 2026-08-22 | ✗ (stale: user canonical = homepage) | none, not recrawled |
| hawksmoor-house | Submitted and indexed | 2026-10-19 | ✓ | recrawled |
| steenberg-farm | Submitted and indexed | 2026-10-18 | ✓ | recrawled |
| mont-rochelle | Submitted and indexed | 2026-10-18 | ✓ | recrawled |
| the-12-apostles-hotel | Submitted and indexed | 2026-09-09 | ✓ | none |
| cavalli-estate | Submitted and indexed | 2026-09-08 | ✓ | none |
| nooitgedacht-wine-estate | Submitted and indexed | 2026-09-07 | ✓ | none |
| zorgvliet-wines | Submitted and indexed | 2026-09-07 | ✓ | none |
| holden-manz | Submitted and indexed | 2026-09-07 | ✓ | none |
| vrede-en-lust | Submitted and indexed | 2026-09-07 | ✓ | none |
| la-cotte-farm | Submitted and indexed | 2026-09-06 | ✓ | none |
| the-cellars-hohenort | Submitted and indexed | 2026-09-05 | ✓ | none |

**Totals:** 12 indexed (11 with matching canonical), 3 crawled-not-indexed,
1 redirect error. **Only 3 of 16 have been recrawled in the past month.**
Google's crawl rate on low-demand venue pages is slow: most were last
fetched in the first week after the migration.

## 6. New issue: three venue pages de-indexed without a recrawl

Belmond Mount Nelson, Saronsberg and La Petite Ferme were "Submitted and
indexed" on 18 Sep and are now "Crawled – currently not indexed". **None
was recrawled in between**, so Google re-evaluated pages it already held
and decided not to keep them. They still logged a few impressions until
1–15 Oct, which suggests the drop is very recent.

- **Belmond Mount Nelson** (with Lourensford) is one of the two pages the
  audit flagged as stale. Google's copy is still the 23 Aug Vite-SPA
  version, whose canonical pointed at the homepage. Of the two, it's the
  one that has now fallen out. It is also one of the three venues whose
  data is unverified.
- **Saronsberg** and **La Petite Ferme** were crawled under the new static
  build and have correct canonicals. "Crawled – currently not indexed" on
  correct pages is a value judgement, not a technical failure.

This supports the 1a reading: technical access is solved, and the
remaining constraint is how much distinct value each templated venue page
carries. **If more venue pages follow by the 60-day pull, treat it as a
content-depth signal, not noise.**

**Suggested next actions** (not taken, since this pull is read-only): GSC UI
"Request Indexing" for `belmond-mount-nelson`, `lourensford-wine-estate`,
`elgin-vintners`, `saronsberg-wine-estate`, `la-petite-ferme` and
`/blog/wedding-venue-bottelary-road-stellenbosch`. Belmond and Lourensford
in particular need a fresh crawl to replace the pre-migration canonical.

## 7. Early reads on 60/90-day metrics (informational, not verdicts)

| Metric | Baseline | Now | Note |
|---|---|---|---|
| "wedding venues stellenbosch" position | 44.1 (weighted) | 43.3 | flat; target top 20 |
| "wedding venues western cape winelands" | 43.1 | 61.8 | **worse** |
| "wedding venues cape winelands" | 47.0 | 54.9 | **worse** |
| Total impressions (28d) | 2,606 | 3,275 | growing |
| Site avg position | 25.6 | 21.9 | improving toward <20 |
| Venue pages with ≥1 click | 1 (query×page) / **5** (page-level) | 0 (query×page) / **7** (page-level) | target "5+" was already met at baseline on page-level data |

## 8. Recommended measurement fixes for the 60/90-day pulls

1. **Redefine venue-page metrics on the page dimension**
   (`--dimensions page`). Query×page rows drop 90% of clicks on this site
   and undercounted the baseline 22 → 8 and 5 → 1. Suggested replacement
   60-day test: "venue pages with ≥5 *named* (query-row) impressions",
   which tracks non-brand discovery directly.
2. **Track indexed venue pages** (URL Inspection, all 24) as a standing
   metric: 20/24 now (counting elgin-vintners as not indexed).
3. **Re-baseline the www metric** as "www share of page-level impressions"
   (3.4% → 2.2%) plus "www homepage impressions" (51 → 71).
4. **Always use `py -3.13`** for these scripts on this machine.

## Files in this folder

| File | Contents |
|---|---|
| `_gsc_raw.json` | 28-day query×page export (256 rows), the plan's command verbatim |
| `_gsc_pages_raw.json` | 28-day page-dimension export, current window |
| `_gsc_pages_baseline_raw.json` | Page-dimension re-pull of the baseline window (21 Aug–15 Sep) |
| `_gsc_page_date_raw.json` | Daily page series, 21 Aug–16 Oct (used for the §3a timing) |
| `_inspect_urls.txt` / `_inspect_raw.json` | 23-URL batch inspection: 16 venue pages, 4 changed blog posts, Lanzerac, www apex, www `/venues` |
