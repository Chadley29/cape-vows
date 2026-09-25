# Local SEO Audit — Cape Vows (capevows.co.za)
Date: 2026-09-18 · Scope: entity NAP consistency + multi-region service-area coverage
(Cape Vows is a 24-venue wedding directory, not a physical local business — classic
single-location GBP/NAP audit does not apply directly; this audit instead covers (a)
NAP/entity consistency for Cape Vows itself and (b) regional local-intent coverage.)

## Free-tier limitations (read this first)

- **DataForSEO: not installed.** No live GBP data, no local pack SERP position checks.
  Every finding below is derived from live HTML/JSON-LD fetch + source inspection only.
- **GA4: not configured** (no property ID). No on-site behavioural signal (e.g. which
  region pages get engagement) could be checked.
- **Bing Webmaster Tools: unavailable.** `python scripts/bing_webmaster.py counts
  capevows.co.za --json` returned `"error": "No Bing Webmaster API key configured. Run:
  python scripts/backlinks_auth.py --setup"`. Skipped per instructions, no referring-domain
  or Bing-indexation data available.
- **Common Crawl web graph: completed, negative result.** `python
  scripts/commoncrawl_graph.py capevows.co.za --json` finished (public S3 data, no auth
  needed) against release `cc-main-2026-jan-feb-mar`:
  ```json
  {"status": "success", "data": {"domain": "capevows.co.za", "in_crawl": false,
  "in_rankings": false, "pagerank": null, "harmonic_centrality": null,
  "top_referring_domains": [], "referring_domains_sample": 0,
  "note": "Domain not found in Common Crawl data. It may be too new, too small, or not yet crawled."}}
  ```
  This means **zero referring-domain / citation / backlink data is available for Cape Vows
  from Common Crawl** — the domain simply isn't in this quarterly graph release yet (the
  Astro migration and domain only went live ~3 Sep 2026, so this is plausibly a recency gap
  rather than a signal of zero backlinks). Treat citation/backlink presence for Cape Vows as
  **entirely unassessed** by any tool in this audit; a link/citation specialist with paid
  tooling (Ahrefs/Moz/DataForSEO backlinks) is the only way to get real data here.
- **Tier 1 citation directories (Yelp, BBB, etc.):** not checked. These are US/UK-centric
  directories with limited relevance to a South African wedding directory business; a
  citation check worth doing in a follow-up would target South African-specific and
  wedding-industry-specific directories instead.
- **GBP data:** no DataForSEO `local_business_data`, no manual Google Maps search performed
  — see Section 5 for the strategic question this leaves open.

---

## 1. NAP consistency for Cape Vows as an entity

Cape Vows has no street address or phone number in the conventional NAP sense (it is an
online-only directory business). The comparable entity signals are: **business name**,
**contact email**, and the **POPIA Information Officer registration**. Exact strings found
in each live/source location:

| Source | Business name string | Contact detail | File:line / URL |
|---|---|---|---|
| Footer (live HTML, all pages) | `Cape Vows` (logo) + `The Western Cape Wedding Directory · South Africa` (sub-line) | `hello@capevows.co.za` (Cloudflare email-obfuscated `mailto:` link, label text "Contact") | `astro-build/src/layouts/Base.astro:128-137`, confirmed live via `curl https://capevows.co.za/` |
| Nav logo (live HTML, all pages) | `Cape Vows` (split as "Cape" + span "Vows") | — | `astro-build/src/layouts/Base.astro:95` |
| WebSite JSON-LD (live, all pages) | `"name": "Cape Vows"`, nested `"publisher": {"@type": "Organization", "name": "Cape Vows", "url": "https://capevows.co.za"}` | none (no `email`, `telephone`, `sameAs`, or `address` property present) | `astro-build/src/layouts/Base.astro:75-89`, confirmed live |
| Homepage `<title>` / meta description / og:title / twitter:title (live) | `Cape Vows — Wedding Venues & Vendors in the Western Cape` | — | `astro-build/src/layouts/Base.astro:6-7`, `astro-build/src/pages/index.astro:40` |
| Privacy policy (`/privacy-policy.html`) | `Cape Vows` throughout; footer: `Cape Vows · The Western Cape Wedding Directory · South Africa` (identical sub-line to site footer) | `hello@capevows.co.za` (plain-text `mailto:`, NOT Cloudflare-obfuscated here) | `astro-build/public/privacy-policy.html:684-686`, `:227`, `:677` |
| Privacy policy "Information Officer" section | No personal name given | Registration Number `2026-013846`, Registration Date `10 May 2026`, Email `hello@capevows.co.za`, Website `capevows.co.za`, Location `Western Cape, South Africa` | `astro-build/public/privacy-policy.html:217-230` |
| CLAUDE.md (internal record, not public-facing) | — | "POPIA Information Officer registered: **Chadley Bissolati**, Reg. No. 2026-013846 (registered 10 May 2026)" | CLAUDE.md, "Legal / compliance" section |

**Findings:**

1. **[PASS] Business name string is consistent everywhere it appears** — "Cape Vows" and
   the descriptor "The Western Cape Wedding Directory · South Africa" match exactly between
   the live footer and the privacy policy footer. No discrepancy found.

2. **[MEDIUM] Information Officer's name is not published anywhere public-facing.** CLAUDE.md
   records the registered Information Officer as **Chadley Bissolati**, but the live privacy
   policy's "Information Officer" section (`privacy-policy.html:217-230`) lists only the
   Registration Number, Registration Date, Email, Website and Location — the individual's
   name is absent. POPIA doesn't strictly require the name to be public if the Regulator has
   it on file, but for entity/E-E-A-T signals (and for a couple wanting to know who is
   behind the directory before submitting personal data) naming a real person materially
   strengthens trust and is a common Google local-entity trust signal ("who runs this").
   Recommend adding "Information Officer: Chadley Bissolati" to that section for consistency
   with the internal record and stronger E-E-A-T.

3. **[LOW] Contact email is inconsistently rendered between the two surfaces.** On the main
   site, the footer "Contact" link is passed through Cloudflare's email-obfuscation script
   (`href="/cdn-cgi/l/email-protection#..."`, decoded client-side by
   `/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js`) — confirmed live on
   both the homepage and `/venues/elgin-vintners` fetches. The plain email string
   `hello@capevows.co.za` is **not present in the raw HTML** a non-JS-executing crawler or
   bot would see on the main site. On `/privacy-policy.html`, by contrast, the email appears
   as a plain, un-obfuscated `mailto:hello@capevows.co.za` link seven times. This isn't a
   defect exactly (Cloudflare obfuscation is anti-spam-harvesting, and Googlebot/most modern
   crawlers do execute JS), but it is a genuine **inconsistency in how the same NAP fact is
   exposed to machines** across the two surfaces, and any crawler/tool that doesn't run the
   Cloudflare decode script (e.g. simple `curl`, some AI crawlers, Common Crawl's own
   fetcher — confirmed above that Common Crawl hasn't even indexed the domain yet) will see
   the email on the privacy policy page but not on the main site footer. Given the site's
   explicit GEO/AI-citation strategy (robots.txt welcomes GPTBot, ClaudeBot, PerplexityBot,
   CCBot — none of which are guaranteed to execute the Cloudflare JS decoder), this is worth
   a conscious decision rather than an accidental split.

4. **[LOW] No `sameAs` property anywhere in JSON-LD.** Grepped the entire `astro-build/src/`
   tree for `sameAs` — zero matches. The WebSite/Organization JSON-LD
   (`astro-build/src/layouts/Base.astro:75-89`) has no links to the Instagram
   (@capevows) or Pinterest profiles documented in CLAUDE.md's Social Media section. For an
   online-only entity with no physical NAP, `sameAs` linking to verified social profiles is
   one of the few remaining signals available to consolidate the "Cape Vows" entity in
   Google's Knowledge Graph. Recommend adding
   `"sameAs": ["https://www.instagram.com/capevows/", "https://za.pinterest.com/0t84vkqdc2vm2cbzbuh7w1cjgtd0p3/"]`
   to the Organization block.

5. **[INFORMATIONAL, cross-reference for other specialists] Em dash count in Base.astro is
   larger than the briefing's known-open-items list states.** The briefing says: "It's the
   ONLY em dash we've found site-wide in earlier passes" referring to
   `astro-build/src/layouts/Base.astro:81` (WebSite JSON-LD description). Live-fetch
   confirms that line, but this audit also found the same em dash character duplicated in:
   - `astro-build/src/layouts/Base.astro:6` — default `title` prop:
     `"Cape Vows — Wedding Venues & Vendors in the Western Cape"`
   - `astro-build/src/layouts/Base.astro:7` — default `description` prop:
     `"...across the Western Cape — Franschhoek, Stellenbosch..."`
   - `astro-build/src/pages/index.astro:40` — homepage's own `title` const, which duplicates
     the Base default verbatim: `const title = 'Cape Vows — Wedding Venues & Vendors in the
     Western Cape';`
   Because the homepage does not override `description`, the em dash from Base.astro:7
   propagates live into `<title>`, `<meta name="description">`, `<meta property="og:title">`,
   `<meta property="og:description">`, `<meta name="twitter:title">`, and
   `<meta name="twitter:description">` simultaneously — confirmed via live `curl` of
   `https://capevows.co.za/`. That's six separate rendered tags carrying the em dash from two
   source lines, on top of the previously-known JSON-LD instance. This directly affects how
   "Cape Vows" as an entity is represented in every search snippet and social share card
   site-wide, so it's flagged here even though the general em-dash sweep is presumably
   another specialist's remit. Separately, `astro-build/src/pages/venues/[slug].astro:30`
   (`` `${venue.name} Wedding Venue — ${venue.region} | Cape Vows` ``) also uses an em dash,
   but that one is explicitly specified as the intended format by CLAUDE.md's own
   "Answer-first principle" section — worth flagging as a **self-contradiction inside
   CLAUDE.md** (the Answer-first section mandates an em dash in all 24 venue titles; the
   Content rules section says "No em dashes anywhere in site content"), not as an
   undocumented bug. Recommend the operator resolve the contradiction one way (e.g. switch
   the Answer-first template to a colon: `"[Venue Name] Wedding Venue: [Region] | Cape
   Vows"`) rather than leaving both rules live and contradictory.

---

## 2. Service-area signals for the 5 regions

**Region-filter mechanism:** `/venues` supports `?region=` as a client-side filter only.
Confirmed in `astro-build/src/pages/venues/index.astro:33-41`: the full 24-venue dataset is
serialized into a `<script type="application/json" id="venues-data">` island and hydrated by
`VenuesApp.jsx`, which reads `URLSearchParams(window.location.search).get("region")` on
mount (`astro-build/src/components/VenuesApp.jsx:47-52`) and pre-selects that region in the
filter dropdown. This **does** work for JS-executing crawlers (Googlebot renders JS), but:

- The `<noscript>` fallback (`astro-build/src/pages/venues/index.astro:43-71`) renders the
  **full unfiltered 24-venue list** regardless of the `?region=` query string — there is no
  server-side filtering, so a non-JS client visiting `/venues?region=Overberg` sees the same
  markup as `/venues` with no region param.
- The canonical tag is hardcoded and query-string-agnostic:
  `const canonical = 'https://capevows.co.za/venues';` (`astro-build/src/pages/venues/index.astro:15`).
  Any region-filtered URL that might get shared, linked, or indexed self-canonicalises back
  to the unfiltered `/venues` page, meaning Google is explicitly told **not** to treat
  `/venues?region=Overberg` as a distinct indexable entity even if it existed. There is
  currently **no dedicated, indexable landing page per region** (no `/venues/overberg`,
  `/regions/overberg`, etc.) — all five regions rely entirely on the single `/venues` page
  plus whatever blog content mentions them by name.
- The homepage's "Explore by Region" section does link to all five region-filtered URLs
  equally (`<a href="/venues?region=Overberg">Overberg</a>` etc., confirmed live at
  `https://capevows.co.za/`), so internal linking to the concept of each region is present
  and equal-weighted at the homepage level — the gap is in *dedicated, indexable content
  depth* per region, not in internal link discovery.

**Answer-first title pattern uses region correctly.** Confirmed live and in source
(`astro-build/src/pages/venues/[slug].astro:30-31`): every venue page title is
`[Venue Name] Wedding Venue — [Region] | Cape Vows` and every meta description opens
`[Name] is a [type] wedding venue in [Region], Western Cape...`. Live-verified on
`/venues/elgin-vintners`: `<title>Elgin Vintners Wedding Venue — Overberg | Cape Vows</title>`.
This is the strongest per-region signal on the site and is applied consistently across all
24 venue pages (one per venue, so the number of pages carrying this signal per region is
directly proportional to venue count per region — see Section 3).

**Blog post regional targeting — by title/H2, cross-referenced against `posts.js`:**

| Region | Dedicated post title? | Dedicated H2 section(s)? | Verdict |
|---|---|---|---|
| Cape Winelands | Yes — 5 of 8 posts are Winelands/Stellenbosch/Franschhoek-titled (`best-wine-estate-venues-franschhoek`, `budget-friendly-winelands-venues`, `wedding-venue-bottelary-road-stellenbosch`, `wedding-venue-prices-stellenbosch-winelands`, plus partial coverage in `mountain-backdrop-wedding-venues-western-cape`) | Multiple | Dominant coverage |
| Atlantic Seaboard | No dedicated post title, but `coastal-wedding-venues-cape-peninsula` has a full dedicated H2 "Atlantic Seaboard: Drama at Altitude" (`posts.js:488-497`) plus a partial section in `mountain-backdrop-wedding-venues-western-cape` ("Atlantic Drama: The Twelve Apostles Mountain Range", `posts.js:263-269`). The `coastal-...` post's CTA also filters `region: "Atlantic Seaboard"` (`posts.js:528-532`) | Yes (2 posts) | Reasonably covered despite only 2 venues |
| Constantia Valley | No dedicated post title, but `coastal-wedding-venues-cape-peninsula` has a full dedicated H2 "Constantia Valley: Coastal Adjacent" (`posts.js:507-516`) naming all 3 Constantia venues | Yes (1 post, all 3 venues named) | Adequately covered |
| **Cape Town City** | **None.** Searched all 8 posts' titles, H2s, and `venueLinks` arrays for "Cape Town City" or either of the 2 venues in that region — zero matches | **None** | **Zero blog coverage** — Hawksmoor House and Belmond Mount Nelson are never linked or named in any of the 8 posts |
| **Overberg** | **None.** No post title or H2 names "Overberg" | Elgin Vintners (the only Overberg venue) appears in exactly one `venueLinks` array, inside `wedding-venue-prices-stellenbosch-winelands` — a **Stellenbosch/Winelands-titled** post, in the "Under R50,000" section as an example of a small-capacity venue, not as regional coverage (`posts.js:403-406`) | **Effectively zero dedicated blog coverage** — the only mention is incidental to a different region's post |

---

## 3. Weakest regions for local-intent coverage (venue count + blog evidence)

Tallied directly from `astro-build/src/data/venues.js` (24 venues, all read and counted by
region field):

| Region | Venue count | % of directory | Price tiers present | Dedicated blog H2s | Verdict |
|---|---|---|---|---|---|
| Cape Winelands | 16 | 67% | Budget: 0, Mid-Range: 8+, Premium: 2, Luxury: 5, plus several Contact Venue | 5+ posts | Strongest by far |
| Constantia Valley | 3 (Groot Constantia, Steenberg Farm, The Cellars-Hohenort) | 12.5% | All 3 are "Contact Venue" tier | 1 dedicated H2 | Moderate |
| Cape Town City | 2 (Hawksmoor House, Belmond Mount Nelson) | 8% | Mid-Range + Contact Venue | **0** | **Weak — no blog support at all** |
| Atlantic Seaboard | 2 (The 12 Apostles Hotel, Cape Point Vineyards) | 8% | Contact Venue + Mid-Range | 2 (1 full, 1 partial) | Weak on venue count, partially offset by content |
| **Overberg** | **1 (Elgin Vintners only)** | **4%** | Mid-Range only | **0 dedicated (1 incidental mention)** | **Weakest overall** |

**Conclusion:** Overberg and Cape Town City are the two weakest regions for "wedding venues
in [region]" local search intent, but for different reasons:

- **Overberg** is weak on every axis simultaneously: 1 venue (versus 16 for Winelands), no
  dedicated blog content, and (per the briefing's confirmed stack facts) the entire
  Premium/Luxury price tier is Cape Winelands-only, so Overberg cannot currently serve
  higher-budget local search intent at all. The only per-region descriptive copy that exists
  for Overberg (`REGION_CONTEXT.Overberg` in `astro-build/src/data/constants.js:119-125`,
  used to generate FAQ answers) appears on exactly one page site-wide: `/venues/elgin-vintners`.
- **Cape Town City** has 2 venues but literally zero blog reinforcement — neither Hawksmoor
  House nor Belmond Mount Nelson has ever been linked from any of the 8 posts, despite Cape
  Town City being one of the 5 regions named in the homepage hero, meta description, and
  Explore by Region tags. This is a lower-effort fix than Overberg's venue-count problem: a
  single blog post or H2 section naming both venues (in the same pattern as the Constantia
  Valley H2 in the coastal post) would close the gap without needing new venue data.
- Atlantic Seaboard, despite also having only 2 venues, is comparatively better served
  because two separate posts give it dedicated H2 treatment — this shows content depth can
  partially compensate for thin venue-count regions, which is directly actionable for both
  Overberg and Cape Town City.

---

## 4. Free-tier backlink/citation check (Bing Webmaster Tools / Common Crawl)

- `python scripts/bing_webmaster.py counts capevows.co.za --json` → `{"status": "error",
  "error": "No Bing Webmaster API key configured. Run: python scripts/backlinks_auth.py
  --setup"}`. **No credentials available; skipped per instructions.**
- `python scripts/commoncrawl_graph.py capevows.co.za --json` → **completed successfully**
  (public data, no auth needed), release `cc-main-2026-jan-feb-mar`:
  `"in_crawl": false, "in_rankings": false, "top_referring_domains": []`,
  note: `"Domain not found in Common Crawl data. It may be too new, too small, or not yet
  crawled."` capevows.co.za is simply absent from this quarterly graph release — most
  plausibly because the Astro-migrated domain only went fully live ~3 Sep 2026 and this
  graph release's crawl window predates or narrowly missed that. **This should NOT be read
  as "zero backlinks confirmed"** — it means no data exists either way from this source.
  Worth re-checking against the next quarterly Common Crawl release once available.
- **Tier 1 directories (Yelp, BBB):** not checked at all this pass — these are low-relevance
  for a South African wedding directory in any case; a citation check worth doing in a
  follow-up would target South African-specific and wedding-industry-specific directories
  (e.g. local wedding portals, Google Business Profile) rather than Yelp/BBB.

---

## 5. Google Business Profile — strategic question, not a defect

Cape Vows itself very likely has **no GBP listing** (no evidence of one was found in any
source file, JSON-LD, or live page — no `place_id`, no Maps embed, no "find us" CTA
anywhere in `astro-build/src/`). This is **expected and plausible** for an online-only
directory business with no public office — Cape Vows doesn't obviously fit GBP's
eligibility model as a standard storefront or service-area business that visits customers.

**Strategic recommendation:** a GBP listing under a category like "Wedding Service" or
"Wedding Planner" *could* still be viable if Cape Vows can satisfy Google's requirement of
"qualifying, in-person contact with customers during stated business hours" or otherwise
qualifies as a legitimate service-area business — worth investigating specifically for
queries like "wedding venue directory western cape" where a local pack result (even one
pointing to a directory rather than a single venue) could capture intent Cape Vows currently
cedes entirely to individual venues' own GBP listings. This is a genuinely open strategic
question rather than a clear-cut recommendation — GBP's guidelines are stricter about
directory/aggregator businesses than single-location businesses, and a listing later
suspended for guideline violations would be worse than no listing. **Recommend the operator
research GBP's current (2026) policy on directory/marketplace businesses specifically before
pursuing this**, rather than treating it as a standard "add a GBP listing" action item.

## 6. Ambiguity flag: does a Cape Vows GBP already exist or is one planned?

CLAUDE.md's "Currently pending" section, item 4, lists as ongoing work: "Instagram posting
cadence, Pinterest pin scheduling, **Google Business Profile posts**, venue photography
outreach." The phrase "Google Business Profile posts" implies a GBP listing may already
exist (you can't post to a GBP listing that hasn't been created and verified) — but no other
part of the repo checked this pass (source code, JSON-LD, live pages, robots.txt, sitemap)
confirms or denies this. **This audit could not resolve the ambiguity** — it may mean (a) a
GBP listing already exists and is being posted to, (b) it's aspirational/planned work not
yet started, or (c) it's a documentation carry-over error. **Flagging this as a direct
question for the human operator (Chadley) rather than asserting an answer.** If a GBP
listing does exist, it should be added to this audit's scope in a follow-up pass (live Maps
search, category check, review count) since it would materially change several findings
above (particularly Section 5).

---

## Prioritised action items (Local SEO scope only)

**Critical**
- None identified in this scope. (No broken NAP, no missing required schema properties for
  the entity itself, since LocalBusiness schema correctly does not apply to Cape Vows.)

**High**
1. Close the Cape Town City blog gap: write or extend a post with a dedicated H2 naming
   both Hawksmoor House and Belmond Mount Nelson, mirroring the Constantia Valley H2 pattern
   in `coastal-wedding-venues-cape-peninsula` (`posts.js:507-516`). Zero venue-count cost,
   directly closes the weakest content gap found in this audit.
2. Resolve whether a Cape Vows GBP listing exists (Section 6) — this blocks an accurate
   answer to the Section 5 strategic recommendation and should be confirmed by the operator
   directly, not inferred.
3. Give `?region=` URLs a real indexable target: either server-render a canonical per-region
   view (e.g. `/venues?region=Overberg` with its own self-referential canonical instead of
   the current hardcoded `https://capevows.co.za/venues`), or accept the current design and
   compensate entirely through blog content — right now it does neither consistently.

**Medium**
4. Add `sameAs` (Instagram, Pinterest) to the Organization JSON-LD block in
   `astro-build/src/layouts/Base.astro:83-87`.
5. Name the Information Officer ("Chadley Bissolati") in the public
   `privacy-policy.html:217-230` section to match the internal CLAUDE.md record and
   strengthen entity trust signals.
6. Resolve the CLAUDE.md self-contradiction on em dashes in venue page titles (Answer-first
   principle vs. "no em dashes anywhere") — pick one pattern and update whichever section is
   wrong; this cascades into `[slug].astro:30` and all 24 rendered venue titles.
7. Fix the two additional un-flagged em dash instances in `Base.astro:6` and `:7` (and their
   duplicate in `index.astro:40`), which propagate into six live meta tags on the homepage
   alone.

**Low**
8. Consider whether Cloudflare's email obfuscation on the main-site footer (vs. plain-text
   on the privacy policy) is an intentional trade-off given the site's explicit AI-crawler
   welcome strategy in `robots.txt` — several of the explicitly-welcomed bots (GPTBot,
   ClaudeBot, PerplexityBot, CCBot) are not guaranteed to execute the Cloudflare JS decoder.
9. Re-check Common Crawl (`scripts/commoncrawl_graph.py capevows.co.za --json`) against the
   next quarterly release — this audit's citation/backlink assessment is unresolved (domain
   absent from the current release), not confirmed-zero.
10. Once resolved, add a South African wedding-directory-relevant citation check (rather
    than Yelp/BBB, which are low-relevance here) as a follow-up scoped item.

---

## Evidence appendix — live checks performed

- `curl -s https://capevows.co.za/` — full homepage HTML, footer/nav/JSON-LD/region-tags
  confirmed as quoted above.
- `curl -s https://capevows.co.za/venues/elgin-vintners` — venue title, EventVenue JSON-LD,
  FAQPage JSON-LD, BreadcrumbList JSON-LD, region-driven FAQ copy all confirmed live.
- `curl -s https://capevows.co.za/robots.txt` — confirmed AI-crawler allow rules and
  sitemap directive live, matches `astro-build/public/robots.txt` intent.
- `curl -s https://capevows.co.za/sitemap.xml` — confirmed present, core pages listed
  (full 35-entry check deferred to the technical-SEO specialist's pass per briefing).
- `python scripts/google_auth.py --check` — confirms GSC Tier 1 auth is live (used by other
  specialists), GA4 unconfigured (confirmed unavailable for this audit).
- `python scripts/bing_webmaster.py counts capevows.co.za --json` — confirmed no API key,
  skipped.
- `python scripts/commoncrawl_graph.py --info` / `capevows.co.za --json` — confirmed no
  auth required; completed with a negative/no-data result (domain not in current release).
