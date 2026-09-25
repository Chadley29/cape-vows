# Cape Vows audit briefing — shared ground truth (2026-09-18)

Read this FIRST. Then read `CLAUDE.md` at the repo root in full — it is the
source of truth for architecture and content rules. Do not re-derive facts
already stated here or in CLAUDE.md; cite them instead.

## Hard rules
- Read-only on the repo except: files you create under `audits/2026-09-18/`,
  and the gitignored `astro-build/dist/` (already built, do not rebuild).
- Do NOT edit any existing file. Do NOT run any git command. Do NOT touch
  `src/App.jsx` (legacy, undeployed, ignore it entirely).
- Audit the LIVE site `https://capevows.co.za` (that's what Google sees).
  Cross-reference `astro-build/dist/` (built output, matches production) and
  `astro-build/src/` (source, for exact file:line citations) for every finding.
- Every finding needs evidence: a URL + HTTP status, a GSC row, a file:line,
  or a rendered HTML excerpt. No assumptions, no invented numbers.
- If a tool/API is unavailable (no GA4 property ID configured, no DataForSEO
  installed), say so explicitly in your report and use the free fallback.
- Content-rule compliance for any copy fix you propose: SA English (favour,
  colour, kilometres), no em dashes anywhere, no exact venue count in social
  copy, never fabricate a venue, "Marriage Officer" not "officiant".

## Stack facts (verified, do not re-check)
- Astro 7 static output in `astro-build/`, React 19 islands, deployed to
  Vercel ~3 Sep 2026. `vercel.json` (repo root): buildCommand
  `cd astro-build && npm run build`, outputDirectory `astro-build/dist`,
  cleanUrls true, trailingSlash false. Cloudflare DNS in front.
- 39 built routes: `/`, `/venues`, `/venues/saved`, `/venues/<24 slugs>`,
  `/blog`, `/blog/<8 slugs>`, `/vendors` (noindex), `/admin` (noindex),
  `/404` (noindex, no canonical).
- `astro-build/public/sitemap.xml` has 35 `<loc>` entries (39 routes minus
  `/venues/saved`, `/vendors`, `/admin`, `/404`).
- Data: `astro-build/src/data/venues.js` (24 venues), `posts.js` (8 posts),
  `constants.js`. 5 regions: Cape Winelands, Constantia Valley, Cape Town
  City, Atlantic Seaboard, Overberg. Price tiers: 5 Luxury, 8 Mid-Range,
  2 Premium, 9 Contact Venue, 0 Budget. Premium+Luxury are Cape
  Winelands-only (no coastal/Constantia venue in either tier).
- GSC: Tier 1 service account already configured. Check with
  `cd "C:/Users/chadl/.claude/skills/seo" && python scripts/google_auth.py --check`.
  Scripts live in that same directory (`scripts/gsc_query.py`,
  `scripts/gsc_inspect.py`, `scripts/pagespeed_check.py`, etc.) — `cd` there
  before running them, or use full paths.
- GA4 is NOT configured (no property ID) — GA4-dependent checks are
  unavailable; say so, do not fabricate.
- DataForSEO is NOT installed — use free fallbacks only (Bing Webmaster,
  Common Crawl, Moz free tier) for anything that would normally use it.

## Already fixed — confirm with ONE live check each, then move on, do not re-audit
1. Empty-body SPA / body invisible to non-JS crawlers → fixed by Astro
   static output. Confirm: `curl -s https://capevows.co.za/venues/lanzerac-wine-estate`
   contains the venue name and FAQ text in raw HTML (no JS execution).
2. Homepage canonical/og:url leaking onto every sub-page → now per-page,
   self-referential. Confirm on one venue and one blog URL.
3. Apex 307 redirected to www → now apex serves 200 directly, www 301s to
   apex. Confirm: `curl -sI https://capevows.co.za/` is 200;
   `curl -sI https://www.capevows.co.za/` redirects to apex.
4. Stale `elgin-ridge-wines` slug in sitemap → now `elgin-vintners`.
   Confirm sitemap.xml has no `elgin-ridge-wines` and the venue is reachable
   at `/venues/elgin-vintners`.
5. Get Listed form, vendor contact form, cookie key migration (`cv_cookies`
   with `cv_cookies_accepted` legacy-key migration), How It Works homepage
   section, hero ghost button (now `btn btn-outline`), footer nav links (5
   links, all present) — these were built and verified in earlier sessions.
   Spot-check ONE (e.g. grep `astro-build/src/pages/vendors.astro` for
   `VendorContactForm`) and move on.
6. Global `a { text-decoration:none; color:inherit }` rule in
   `astro-build/src/styles/global.css` (near the top, after the `*` reset).
   Confirm it's there and that `.blog-venue-link` still shows explicit
   `text-decoration: underline` (higher specificity, survives).

## Known OPEN items — these need real depth, not a one-line mention
- 19 WCAG AA contrast failures: `--gold #A07840` on `--cream #FAF7F2` =
  3.73:1; `--muted #7A7266` on cream = 4.43:1 (target 4.5:1). Both are used
  in `astro-build/src/styles/global.css`. Full selector list + proposed
  fix goes in the action plan (Phase 2), but if you're the specialist who
  encounters contrast failures in your own audit area, log them with exact
  selector + file:line.
- Venue-page impressions: 2 of 24 venues had ANY GSC impressions
  pre-migration. As of the 2026-09-18 pull (28-day window ending
  2026-09-15), 8 of 24 register impressions: eikenhof-estate (137),
  lanzerac-wine-estate (26), la-paris-estate (11), groot-constantia (7),
  la-roche-estate (4), babylonstoren (2), boschendal-wine-estate (2),
  cape-point-vineyards (1). This is the migration's falsification test —
  trending right, not yet proven.
- www.capevows.co.za still appears in GSC (this pull: `https://www.capevows.co.za/`
  28 imp pos 25.8, `/blog` 1 imp, `/venues` — check). Expected to decay now
  the apex serves 200 directly; not yet confirmed via URL Inspection.
- Brand-confusion queries ("vows", "vow wedding venue", "the vow wedding
  venue", "drenched vow") total 62 impressions, 0 clicks, avg position
  6–16, over the last 28 days (2.4% of total impressions). CTR drag if
  excluded: 1.00% → 1.02%, i.e. negligible in aggregate — report this
  precisely, don't oversell it as a bigger problem than the data shows.
- Bottelary Road cluster is the strongest performer: "bottelary road
  venues" 98 imp pos 24.2, "bottelary road wedding venues" 97 imp pos 30.2,
  "wedding venue bottelary road" 64 imp pos 32.2, "venue hire bottelary
  road" 58 imp pos 37.0 — mostly ranking the BLOG POST
  (`/blog/wedding-venue-bottelary-road-stellenbosch`), with
  `/venues/eikenhof-estate` itself now also getting real traffic (137 imp,
  pos 40.8, plus "eikenhof estate" 11 imp pos 17.3, "eikenhof estate
  prices" 6 imp pos 8.0). Competing page: eurekafunctions.co.za "Best
  Bottelary Road Wedding Venues" (mid-2026) — check where it ranks.
- Interesting: "quoin rock wedding venue price" (36 imp, pos 28.5) maps to
  `/blog/wedding-venue-prices-stellenbosch-winelands`. Quoin Rock is NOT a
  venue in `venues.js` (confirmed by grep) — Google is surfacing Cape Vows
  content for a competitor-brand query. Note this as a GEO/AI-citation
  signal, not a defect to fix.
- "lanzerac wedding venue" (20 imp, pos 14.5) currently maps to
  `/blog/budget-friendly-winelands-venues`, NOT `/venues/lanzerac-wine-estate`
  itself — possible page-targeting mismatch, worth flagging in SXO.
- Unused JS baseline (pre-migration, Vite SPA): GTM 168 KB (70 KB unused),
  site bundle 84 KB (32 KB unused). Re-measure on the CURRENT Astro build.
- Em dash in `astro-build/src/layouts/Base.astro`'s WebSite JSON-LD
  `description` field — violates CLAUDE.md's "no em dashes anywhere in
  site content" rule. It's the ONLY em dash we've found site-wide in
  earlier passes; confirm and cite the exact line.
- Two hardcoded `24`s in `astro-build/src/layouts/Base.astro`: line 7
  (fallback meta description) and line 81 (WebSite JSON-LD description).
  Everything else uses `VENUES.length` dynamically. Not urgent (count
  hasn't changed) but log it as a maintenance trap.
- `getFeaturedVenues()` runs at BUILD time in
  `astro-build/src/pages/index.astro` frontmatter, seeded by ISO week — so
  the "weekly" rotation only actually rotates when Vercel rebuilds
  (on push), not automatically every week.
- 3 venues with NO verified source material: hawksmoor-house,
  the-cellars-hohenort, belmond-mount-nelson. `la-paris-estate` capacity
  is `"Contact venue"` pending direct confirmation (see CLAUDE.md
  Fact-check status section).
- `/venues` (`astro-build/src/pages/venues/index.astro`) ships the 24-venue
  dataset TWICE: once as a JSON script island for `VenuesApp.jsx`, once as
  static `<noscript>` cards. It also renders no filter bar before
  hydration (blank flash for JS users).
- Blog `summary` field is NOT rendered on the post page itself — only on
  `/blog` listing cards and in "Related Reading" blocks on venue pages. A
  post-page-only em-dash check will MISS a `summary` em dash. Audit ALL
  fields of all 8 posts: `summary`, `metaDesc`, `intro`, every
  `sections[].h2`/`paras`/`items[].desc`/`notice`.
- FAQPage rich results were retired by Google for all sites in May 2026 —
  this is NOT a defect. Keep the markup (GEO/AI-citation value), do not
  recommend removal, do not recommend NEW FAQPage for Google SERP benefit.

## GSC snapshot (28 days, 2026-08-21 to 2026-09-15, pulled 2026-09-18)
Full raw JSON at `audits/2026-09-18/_gsc_raw.json` (218 rows) if you need
per-query detail. Totals: 26 clicks, 2606 impressions, CTR 1.00%, avg
position 25.6. Compare against two earlier pulls: pre-migration baseline
(5–30 Aug: 1435 imp, 11 clicks, 0.77% CTR, pos 34.7, 2/24 venue pages with
impressions: la-roche-estate 6, la-paris-estate 2) and a mid-migration pull
(15 Aug–9 Sep: 1968 imp, 15 clicks, 0.76% CTR, pos 29.4, row-level detail
not preserved from that pull — re-derive venue-page count for that window
from `_gsc_raw.json` if you need it, or treat the 5–30 Aug and 21
Aug–15 Sep pulls as your two clean comparison points). Position and
impressions are both trending up across the pulls available.

Top 10 non-brand queries by impressions (this pull): wedding venues
western cape winelands (110), wedding venues cape winelands (108), wedding
venues stellenbosch (108), bottelary road venues (98), bottelary road
wedding venues (97), franschhoek wedding venues (90), stellenbosch wedding
venues (76), wedding venue bottelary road (64), venue hire bottelary road
(58), accommodation bottelary road (49), cheap wedding venues stellenbosch
(36), quoin rock wedding venue price (36).

## URL Inspection batch
Running in background, results will land at
`audits/2026-09-18/_inspect_raw.json` (42 URLs: all 39 routes + www apex +
www/venues + the stale `elgin-ridge-wines` check). If it's not done when
you need it, note that in your report and use what curl/live fetch tells
you instead — do not block on it.

## Output
Write your file to `audits/2026-09-18/01-<name>.md` exactly as named in
your task. Report back to the orchestrator (me) with: the file path, a
2-3 sentence summary, and the count of findings by severity. Do not
truncate your file for brevity — this is a paid audit deliverable, go deep.
