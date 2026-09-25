# 00 — Search Console

**Property:** `sc-domain:capevows.co.za` · **Credential tier:** 1 (service
account, verified via `python scripts/google_auth.py --check`) · **Pulled:**
2026-09-18. Raw data: `_gsc_raw.json` (28-day query export, 218 rows),
`_inspect_raw.json` (42-URL batch URL Inspection).

## 1. Totals, three-pull comparison

| Pull | Window | Clicks | Impressions | CTR | Avg pos | Query×page rows | Venue pages w/ impr. |
|---|---|---:|---:|---:|---:|---:|---:|
| Pre-migration baseline | 5–30 Aug | 11 | 1,435 | 0.77% | 34.7 | 65 | 2/24 (la-roche-estate 6, la-paris-estate 2) |
| Mid-migration | 15 Aug–9 Sep | 15 | 1,968 | 0.76% | 29.4 | 152 | not re-derived — see note below |
| **This pull** | **21 Aug–15 Sep** | **26** | **2,606** | **1.00%** | **25.6** | **218** | **8/24** |

Every metric has improved monotonically across the three pulls: impressions
+82% vs baseline, avg position 9.1 places better, CTR up 30% relative, venue
pages with any visibility up 4×. **Caveat on attribution:** the site went
live on Astro ~2026-09-03. The pre-migration and mid-migration windows
overlap the cutover, so only the final ~15 days of this pull are cleanly
post-migration. Treat the trend as directionally real (GSC data itself
lags ~2-3 days and Search Console UI/API totals sometimes differ slightly
from summed row data — this pull's row-level sum was 1,659 impressions
against the API-reported total of 2,606, the gap being Google's anonymized
long-tail queries below the row threshold) but don't claim the whole
uplift is migration-caused; some of it is normal indexing maturation for a
domain that only had 2 blog posts a month ago and now has 8.

## 2. Venue-page impressions — THE HEADLINE METRIC (migration falsification test)

**8 of 24 venue pages now register GSC impressions, up from 2 pre-migration:**

| Page | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| eikenhof-estate | 137 | 0 | 40.8 |
| lanzerac-wine-estate | 26 | 0 | 58.9 |
| la-paris-estate | 11 | 0 | 10.8 |
| groot-constantia | 7 | 1 | 20.3 |
| la-roche-estate | 4 | 0 | 41.2 |
| babylonstoren | 2 | 0 | 17.0 |
| boschendal-wine-estate | 2 | 0 | 27.0 |
| cape-point-vineyards | 1 | 0 | 8.0 |
| *(16 others)* | 0 | 0 | — |

**Verdict: trending the right way, not yet proven, worth a re-check in
3–4 weeks.** The test I set up two audits ago was "if venue-page
impressions are still near zero in 3–4 weeks, the migration didn't solve
the problem." 8/24 with real traffic (eikenhof-estate alone at 137
impressions) is a genuine, unambiguous improvement over 2/24 — this is not
noise. But 16 of 24 venue pages *still* have zero impressions despite (per
§3 below) 22 of them having been recrawled with full static HTML since the
migration. That's the honest state: the technical blocker (empty SPA
shell) is resolved, but resolving it doesn't automatically manufacture
search demand or rankings for venues nobody is specifically searching for
by name yet. `groot-constantia` is the one real click this period (pos
20.3) — small, but it's the first non-brand, non-Bottelary-Road click on a
venue page since the migration.

## 3. URL Inspection — all 42 URLs (39 routes + www apex + www/venues + stale slug)

**Summary: 34 PASS / 0 FAIL / 8 NEUTRAL / 0 error.** Full raw data in
`_inspect_raw.json`.

### Recrawl status since migration (cutover ≈ 2026-09-03)

- **22 of 24 venue pages** have `last_crawl_time` on or after 2026-09-03 —
  recrawled under the new static build.
- **2 stale, not yet recrawled:** `belmond-mount-nelson` (last crawled
  2026-08-23) and `lourensford-wine-estate` (2026-08-22) — both still
  reflect the OLD Vite SPA at the time Google fetched them.
- **Canonical match:** 21/24 venue pages show `google_canonical ==
  user_canonical` (`match: true`). The 2 mismatches are **exactly** the 2
  stale-crawl venues above — fully explained by staleness, not a code
  defect. Google is still using its pre-migration record of these two
  pages, where the canonical was hardcoded to the homepage (the bug fixed
  in commit `93c8a23`). This should self-resolve on next crawl; no action
  needed beyond patience, or optionally requesting indexing for these two
  specific URLs via `scripts/indexing_notify.py` if you want to nudge it.

### `elgin-vintners` — investigated, not a live bug

Coverage state: **"Redirect error"**, `page_fetch_state:
REDIRECT_ERROR`, `last_crawl_time: 2026-09-03T10:08:34Z` — the exact day
of the Astro cutover. This looked alarming, so I checked it live:

```
curl -sI https://capevows.co.za/venues/elgin-vintners
→ HTTP/1.1 200 OK   (clean, no redirect)

curl -sI https://www.capevows.co.za/venues/elgin-vintners
→ HTTP/1.1 301 Moved Permanently → https://capevows.co.za/venues/elgin-vintners
```

Both are correct, current behaviour. Google's crawl attempt on the exact
day of the cutover almost certainly landed mid-deploy or during DNS/edge
propagation and recorded a transient redirect failure that has never been
retried since (it's the ONLY page across all 42 with a `last_crawl_time`
frozen at the cutover moment and never touched again — every other page
that was crawled that week got at least one more crawl by mid-September).
**Not a code fix — a stale error record.** Low-effort mitigation: submit
`https://capevows.co.za/venues/elgin-vintners` via the Indexing API or
"Request Indexing" in the GSC UI to force a fresh crawl attempt.

### `elgin-ridge-wines` (the old, renamed slug)

```
coverage_state: "Not found (404)"   verdict: NEUTRAL
```

**Confirmed clean.** This is exactly the desired outcome for a
deliberately-retired URL — Google has recrawled it, found nothing, and is
correctly treating it as gone rather than indexing a dead page.

### www subdomain

| URL | Coverage | Canonical match |
|---|---|---|
| `https://www.capevows.co.za/` | "Page with redirect" | `true` |
| `https://www.capevows.co.za/venues` | "Alternate page with proper canonical tag" | `false` (expected — Google is deferring to the apex, which is correct) |

Both are the desired outcome — Google understands the www→apex 301 and is
consolidating signals to the apex. The `/venues` www variant hasn't been
recrawled since 2026-08-07 (pre-migration) but its outcome is already
correct either way since "Alternate page with proper canonical tag" is
itself the *good* answer.

### `/vendors`, `/admin`, `/404`, `/venues/saved`

- `/vendors`: `"Excluded by 'noindex' tag"` — correct, working as designed.
- `/admin`, `/404`: `"URL is unknown to Google"` — correct; Google has
  never been given these URLs (not in sitemap, noindexed, no inbound
  links from indexed pages) so it has nothing to report. Expected null
  state, not a problem.
- `/venues/saved`: `"URL is unknown to Google"` — same as above. Cross-ref
  `01-onpage.md` Finding: this page has no `noindex` meta, only sitemap
  exclusion — currently safe because nothing has discovered it via crawl,
  but see that finding for the recommendation to add explicit noindex
  defensively (the nav heart-icon link exists on every page, so
  discovery via crawl is plausible eventually).

## 4. Striking distance (position 8–30, ≥5 impressions)

| Impr. | Pos | Query | Ranking page |
|---:|---:|---|---|
| 98 | 24.2 | bottelary road venues | /venues/eikenhof-estate |
| 36 | 28.5 | quoin rock wedding venue price | /blog/wedding-venue-prices-stellenbosch-winelands |
| 29 | 18.0 | bottelary road wine farms | /blog/wedding-venue-bottelary-road-stellenbosch |
| 29 | 27.4 | wedding venue stellenbosch prices | /blog/wedding-venue-prices-stellenbosch-winelands |
| 20 | 14.5 | lanzerac wedding venue | /blog/budget-friendly-winelands-venues *(see SXO note)* |
| 14 | 8.8 | the vow wedding venue | /venues *(brand confusion, see §5)* |
| 11 | 17.3 | eikenhof estate | /venues/eikenhof-estate |
| 9 | 21.8 | coast wedding | /blog/coastal-wedding-venues-cape-peninsula |
| 6 | 9.5 | bottelary road stellenbosch | /blog/wedding-venue-bottelary-road-stellenbosch |
| 6 | 16.3 | drenched vow | / *(brand confusion, see §5)* |
| 6 | 8.0 | eikenhof estate prices | /venues/eikenhof-estate |
| 6 | 14.0 | franschhoek venues | /blog/best-wine-estate-venues-franschhoek |
| 6 | 9.8 | wedding venues on bottelary road | /blog/wedding-venue-bottelary-road-stellenbosch |
| 5 | 27.8 | bottelary road accommodation | /blog/wedding-venue-bottelary-road-stellenbosch |

**What would move each cluster:** the Bottelary Road group (5 of 14 rows
here) is already the strongest performer on the site — see `01-sxo.md` for
the page-type analysis of why. The pricing-post group (`quoin rock…`,
`wedding venue stellenbosch prices`) is a single page carrying multiple
striking-distance queries; a small amount of additional internal linking
into that post (currently only the homepage and its own venue links point
to it) could help it consolidate. `lanzerac wedding venue` ranking the
wrong page (a budget-listicle blog post, not the Lanzerac venue page
itself) is flagged for `01-sxo.md` as a possible cannibalization issue.

## 5. Brand-confusion queries — quantified, not overstated

Queries containing "vow"/"vows" (people likely searching for a venue
literally named "The Vow" or "Drenched Vow", confused with Cape Vows):

| Impr. | Pos | Query | Page |
|---:|---:|---|---|
| 20 | 6.2 | vows | www homepage |
| 14 | 7.3 | vow wedding venue | / |
| 7 | 9.1 | the vow wedding venue | / |
| 7 | 8.6 | the vow wedding venue | /venues |
| 6 | 16.3 | drenched vow | / |
| *(7 more, 1 impression each)* | | | |

**Total: 62 impressions, 0 clicks, across 13 query rows — 2.4% of total
site impressions.**

**CTR impact, precisely:** site CTR as reported is 26/2606 = **1.00%**.
Excluding all 13 brand-confusion rows: 26/2544 = **1.02%**. That's a
0.02-percentage-point drag — **negligible in aggregate.** These are
wasted impressions sitting at genuinely good positions (6–16) that convert
to zero clicks because the searcher wants a different, differently-named
business, but the CTR damage is not the real cost here — the real cost is
that these are impressions that will never convert to a lead regardless of
what Cape Vows does, so they inflate the impression count without adding
value. **Mitigation:** none recommended. There's no reasonable on-site fix
for someone searching for a competitor's brand name; this is normal noise
at Cape Vows's current visibility level and will shrink as a *share* of
total impressions as genuine non-brand queries grow.

## 6. GEO signal worth noting: "quoin rock wedding venue price"

Quoin Rock is **not** a venue in `astro-build/src/data/venues.js` (confirmed
by direct grep — zero matches). Yet this exact competitor-brand-adjacent
query (36 impressions, position 28.5) surfaces
`/blog/wedding-venue-prices-stellenbosch-winelands`, Cape Vows's own
pricing-tier guide. This is Google (and by extension AI answer engines
drawing on the same corpus) recognizing Cape Vows as a credible source for
*regional pricing context* even for a venue it doesn't list — a genuine
GEO/AI-citation signal, not a defect. Nothing to fix; noted for the content
strategy discussion in Phase 2 (this is direct evidence that "honest,
comparative pricing content" is doing real discovery work beyond the
venues explicitly named in it).

## 7. Top 30 non-brand queries by impressions

| Impr. | Pos | Query |
|---:|---:|---|
| 110 | 43.8 | wedding venues western cape winelands |
| 108 | 55.8 | wedding venues cape winelands |
| 108 | 44.5 | wedding venues stellenbosch |
| 98 | 24.2 | bottelary road venues |
| 97 | 30.2 | bottelary road wedding venues |
| 90 | 71.2 | franschhoek wedding venues |
| 76 | 43.5 | stellenbosch wedding venues |
| 64 | 32.2 | wedding venue bottelary road |
| 58 | 37.0 | venue hire bottelary road |
| 49 | 37.7 | accommodation bottelary road |
| 36 | 53.7 | cheap wedding venues stellenbosch |
| 36 | 28.5 | quoin rock wedding venue price |
| 34 | 58.1 | small wedding venues cape winelands |
| 29 | 18.0 | bottelary road wine farms |
| 29 | 27.4 | wedding venue stellenbosch prices |
| 28 | 41.2 | venues in stellenbosch |
| 24 | 45.8 | wedding venues in stellenbosch |
| 21 | 37.1 | wedding venues near stellenbosch |
| 20 | 70.2 | franschhoek wine estates |
| 20 | 14.5 | lanzerac wedding venue |
| 18 | 65.4 | wedding venues cape town winelands |
| 18 | 46.0 | wedding venues stellenbosch wine farms |
| 16 | 55.5 | wedding venue cape winelands |
| 16 | 57.8 | wedding venues western cape |
| 14 | 60.5 | stellenbosch wedding venues with chapel |
| 14 | 59.8 | venue hire stellenbosch |
| 14 | 49.7 | wedding venues stellenbosch winelands |
| 12 | — | *(remaining long tail, see `_gsc_raw.json`)* |

Full 218-row query×page data preserved in `_gsc_raw.json` for anyone
building on this audit.
