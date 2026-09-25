# Cape Vows — Backlink Profile Audit (Free Tier Only)

**Date:** 2026-09-18 · **Domain:** capevows.co.za · **Scope:** free-tier backlink data sources only (no DataForSEO installed, per briefing)

---

## 1. Credential / tier check (real data)

Ran `python scripts/backlinks_auth.py --check --json` from `C:/Users/chadl/.claude/skills/seo`. Output (verbatim, real):

```json
{
  "status": "success",
  "tier": {
    "tier": 0,
    "description": "Basic (Common Crawl + Verify only)",
    "missing": "Add Moz API key for DA/PA and spam scoring. Free at https://moz.com/products/api (2,500 rows/month)"
  },
  "services": {
    "moz": { "available": false, "error": "No Moz API key found..." },
    "bing": { "available": false, "error": "No Bing Webmaster API key found..." },
    "commoncrawl": { "available": true, "method": "none (public data)" },
    "verify": { "available": true, "method": "none (local crawler)" }
  }
}
```

**Confirmed: Tier 0.** Only Common Crawl (public web graph) and the local backlink-verification crawler are available. No Moz API key, no Bing Webmaster API key configured anywhere on this machine (checked `MOZ_API_KEY`/`BING_WEBMASTER_API_KEY` env vars and `C:\Users\chadl/.config/claude-seo/backlinks-api.json` via the script — neither present). This matches the briefing's statement that DataForSEO is not installed and free fallbacks only should be used.

## 2. Common Crawl domain graph — completed, real result: domain not found

Ran `python scripts/commoncrawl_graph.py capevows.co.za --json` in the background (it streams up to 500 MB of compressed Common Crawl web-graph data per lookup, so it runs several minutes on a cold cache). It was still running when this report was first drafted and was reported as abandoned at that point; it finished shortly afterward, and the real result is below (verbatim):

```json
{
  "status": "success",
  "data": {
    "domain": "capevows.co.za",
    "in_crawl": false,
    "in_rankings": false,
    "pagerank": null,
    "harmonic_centrality": null,
    "n_hosts": null,
    "top_referring_domains": [],
    "referring_domains_sample": 0,
    "note": "Domain not found in Common Crawl data. It may be too new, too small, or not yet crawled."
  },
  "metadata": {
    "source": "commoncrawl",
    "release": "cc-main-2026-jan-feb-mar",
    "from_cache": false,
    "timestamp": "2026-09-18T13:31:20Z"
  }
}
```

**capevows.co.za is not present at all in the Common Crawl web graph** (`in_crawl: false`, `in_rankings: false`) as of the `cc-main-2026-jan-feb-mar` release (the most recent quarterly release the script checked against). This is a genuine, measured result: the domain has zero recorded in-degree, no PageRank/harmonic-centrality value, and zero referring domains in Common Crawl's dataset, not because the query failed but because Common Crawl's crawler has not indexed any page linking to capevows.co.za as of that release. Given the Astro migration only deployed ~3 September 2026 (per the briefing) and Common Crawl releases are quarterly, this domain may simply not have been re-crawled since the migration, or may never have accumulated any external links at all. Both are consistent with this result, and this data alone cannot distinguish between them. Confidence: 0.50 per the skill's Tier 0 convention (domain-level Common Crawl data). Data freshness: quarterly (this release covers Jan-Mar 2026 crawls).

## 3. Known-backlink verification — not applicable

`verify_backlinks.py` checks a supplied list of known backlink source URLs against the live target. No such list exists anywhere in the repo or was provided for this audit, so there was nothing to verify. This is not a failed check, it's an unrun one for lack of an input.

## 4. Moz / Bing — confirmed unavailable, not attempted

Both `moz_api.py` and `bing_webmaster.py` require API keys that are not configured (see §1). Per the briefing and skill instructions, these were not run against invalid credentials (they would only return the same auth error already captured in §1).

## 5. Bottom line on real backlink data

**No positive backlink data (referring domain count, total backlinks, Domain Authority/Rating, or PageRank) was obtained from any source in this session, and the one source that did return a result (Common Crawl) came back empty.** capevows.co.za does not appear in the Common Crawl web graph at all (see §2), meaning Common Crawl's crawler has recorded zero external links to the domain as of its most recent quarterly release. Combined with Moz and Bing being unavailable (§1, §4), this is a real but thin data point, not a full picture: Common Crawl only reflects sites its own crawler visited, on a quarterly cadence, and it is plausible capevows.co.za (Astro-migrated approximately 3 September 2026, per the briefing) simply has not been re-crawled since gaining any links, if it has any. This is a young, single-operator local directory site with no prior off-site SEO campaign on record in this repo, so a genuinely empty or near-empty backlink profile is entirely plausible and consistent with this result, but Common Crawl's absence is not proof of zero backlinks industry-wide, only proof of zero in Common Crawl's own dataset. If a fuller picture matters for a future audit pass, get a free Moz API key (moz.com/products/api, 2,500 rows/month, roughly 10 second rate limit) which would give an instant DA/PA/spam-score/referring-domain read, cross-checkable against this Common Crawl null result.

---

## 6. Prioritised directory/citation targets (informed recommendation, not live backlink data)

**Method note:** No WebSearch/WebFetch tool was available in this session. Every URL below was, however, live-checked with `curl` (browser User-Agent, following redirects) against the actual domain to confirm reachability at the time of this audit — that HTTP-status check is real data. The *identity, relevance, and current submission process* of each listing is drawn from general/training knowledge and was **not** independently verified by reading the site's actual submission page in most cases (a few were). Treat every entry as "confirm before submitting," not "ready to submit blind." This matches the task's own framing: use general knowledge of well-known SA directories, flag anything uncertain.

Ranked by estimated value to a solo operator: a directory a real engaged Western Cape couple would actually browse ranks above a generic citation site, and low-effort/high-relevance beats an exhaustive spray list.

| # | Target | Type | URL | Live check (this session) | Confidence |
|---|--------|------|-----|---------------------------|------------|
| 1 | Google Business Profile | Local SEO citation (essential, not a traditional "directory") | business.google.com/create | Not curl-checked (Google service, universally known) | High — do this first regardless of anything else |
| 2 | Bing Places for Business | Local SEO citation | bingplaces.com | `200 OK` | High |
| 3 | The Pretty Blog | SA wedding industry blog/directory, high organic traffic among SA brides | theprettyblog.com | `200 OK` (homepage live). Guessed submission paths `/vendors`, `/directory`, `/advertise`, `/listings` all `404` — exact submission page not found this session, likely reachable via on-site "Advertise" or "Contact" nav | Medium — site is real and relevant, submission URL needs manual confirmation |
| 4 | SouthBound Bride | SA wedding industry blog with a well-known venue/vendor directory | southboundbride.com | `503 Service Unavailable` (both apex and www, with browser UA, Cloudflare-fronted) at time of check | **Low right now** — genuinely uncertain whether this is a temporary outage or the site is down/inactive as of Sep 2026. Recheck before investing effort. |
| 5 | Cape Town Tourism | Official destination marketing organisation — "list your business" portal | capetown.travel | `200 OK` with browser UA (`403` without — likely bot-protection, not a sign it's fake) | Medium-High |
| 6 | Wesgro (Western Cape tourism/investment promotion agency) | Provincial tourism board | wesgro.co.za | `200 OK` | Medium — relevance and exact listing mechanism unconfirmed |
| 7 | Franschhoek Wine Valley / tourism association | Regional tourism directory, directly relevant (Franschhoek is a named venue region with 90 GSC impressions this pull) | franschhoek.org | `302 Found` (redirect, target not followed further this session) | Medium — domain resolves, exact current site/structure unconfirmed |
| 8 | TripAdvisor (Wedding Venues / Things to Do category) | Tourism directory, real consumer traffic | tripadvisor.com | `403` (both .com and .co.za, browser UA — Cloudflare/Akamai bot-blocking almost certainly, not evidence the listing category doesn't exist) | Medium-High — definitely real, listing process needs manual navigation |
| 9 | Brabys.com | Large general SA business directory, high domain authority | brabys.com | `200 OK` with browser UA (`403` without) | Medium |
| 10 | Hotfrog South Africa | General SA business directory | hotfrog.co.za | `200 OK` with browser UA (`403` without) | Medium |
| 11 | Yalwa South Africa | General SA business directory | yalwa.co.za | `403` with and without browser UA — could not confirm reachability this session | Low-Medium — unverified, check before relying on it |
| 12 | Cylex South Africa | General SA business directory | cylex.co.za | `403` with and without browser UA — could not confirm reachability this session | Low-Medium — unverified, check before relying on it |
| 13 | Brides of South Africa (or equivalent SA bridal magazine online directory) | SA wedding industry magazine/directory | not checked — exact current domain not confidently known | Not checked | **Low — unverified from memory only, confirm the publication and its current domain still exist before pursuing** |
| 14 | "Wedding Expo" style SA bridal show exhibitor directory | Wedding industry trade-show directory | attempted `weddingexpo.co.za` | `200 OK` but the page returned is a **Gauteng DJ / function DJ business**, not a bridal expo — this was the wrong domain guess | **Discard this URL.** The concept (South Africa's bridal expo circuit has an exhibitor/directory presence) is plausible from general knowledge but the correct current domain is unknown; needs a fresh search, don't submit anywhere based on this row |
| 15 | Stellenbosch / Cape Winelands wine-route tourism association | Regional tourism directory, relevant given several venues are wine estates | not checked — candidate domain(s) unconfirmed | Not checked | Low — concept plausible, no verified domain found this session (a guess at `westerncape.travel` failed DNS resolution entirely) |

### How to read this table
- Rows 1, 2, 5, 6, 9, 10 are the safest bets: real, live, reachable sites at the time of this check, with well-established categories (local SEO citation, general SA business directory, or official tourism board).
- Rows 3, 4, 7, 8 are real, relevant, wedding/tourism-specific sites, but this session could not confirm the exact submission mechanism (3, 7) or hit bot-protection on the check itself (4 returned a genuine 503, 8 returned 403 from anti-bot infrastructure that blocks most automated requests, including this one).
- Rows 11, 12 are known directory brand names from general knowledge but returned 403 on every attempt (with and without a browser User-Agent), so reachability could not be confirmed live this session — don't assume they're up.
- Rows 13, 14, 15 are the weakest: 14 is a confirmed wrong domain (actively discard), 13 and 15 are unverified guesses that need a fresh search with a working web-search tool before any outreach effort is spent on them.

### Recommended next action (lowest effort, highest confidence)
Given this is a solo-operator business, do rows 1, 2, 5, 6, 9, 10 first (all confirmed-live, well-understood categories, roughly 15-30 minutes each of profile/listing setup). Re-verify rows 3, 4, 7, 8 by hand in a browser (not curl) before spending time on them, since a couple of them may need JS or session cookies that curl doesn't provide. Do a fresh web search for "South Africa wedding venue directory" and "Cape Town bridal expo exhibitor" to replace rows 13, 14, 15 with real, current domains before pursuing them — do not submit to anything not personally confirmed to exist and accept listings.

---

## Data source summary

| Section | Data type | Confidence |
|---|---|---|
| §1 Tier/credential check | Real, direct script output | 1.00 (verbatim) |
| §2 Common Crawl | Attempted, no result — genuinely unknown, not a finding | N/A |
| §3 Backlink verification | Not applicable (no input list) | N/A |
| §4 Moz/Bing | Confirmed unavailable via real credential check | 1.00 (verbatim) |
| §6 Directory list — HTTP status column | Real, live `curl` checks performed this session | High (status codes are real; a 403 does not prove non-existence, it usually proves bot-protection) |
| §6 Directory list — relevance/identity/submission-process | General/training knowledge, not live-verified in most rows | Low-Medium — explicitly flagged per row, confirm before outreach |

**No numeric Backlink Health Score is reported.** Per the skill's own Tier 0 rule ("fewer than 4 scoring factors have data — report INSUFFICIENT DATA, not a numeric score"), and given that even the one Tier 0 data source available (Common Crawl) returned no result this session, a score would be entirely fabricated. This report deliberately contains **zero** backlink count, referring domain count, or authority score for capevows.co.za, because none was obtained.
