# 02 — Action Plan

Synthesizes `00-gsc.md` and all 11 files in `01-*.md`. Every row below traces
to a specific report; open the linked file for full evidence. Ranked by
impact/effort within each ship-window bucket, not globally — a Low-effort
Medium-impact item can and should ship before a High-impact Large-effort one.

## Ship this week (≤5 items)

| # | Finding | Evidence | Impact | Effort | File : line | Fix |
|---|---|---|---|---|---|---|
| 1 | **`/venues` desktop CLS = 0.881** (score 0.03) — the entire content `<section>` (4,134px tall) pops into existence when `VenuesApp` hydrates, causing an 88% viewport-height layout shift | `01-performance.md` Finding 1, independently reproduced live via `pagespeed_check.py` (CLS 0.8811, perf score 74); root element confirmed via `layout-shifts` PSI diagnostic: `<section style="padding-top: 3rem;">` | **High** — this is the single worst number in the entire audit; desktop `/venues` Performance score is 75 vs 97 on every other page, and `/venues` is the site's #2 highest-impression page (67 impressions/28d) after the homepage | **M** | `astro-build/src/pages/venues/index.astro`, `astro-build/src/components/VenuesApp.jsx` | Reserve layout space before hydration: give `#venues-app` a `min-height` matching the eventual card-grid height (or render the `<noscript>` card grid as the *default* visible state, hidden only once `VenuesApp` confirms it has mounted, rather than the current blank-until-hydrated pattern) |
| 2 | **Meta descriptions overflow 160 chars on 29 of 40 pages** — a hardcoded `.substring(0, 130)` doesn't account for the variable-length prefix sentence | `01-onpage.md` Finding 1, exact strings quoted, up to 227 chars observed | **Medium** — SERP snippets get Google-truncated mid-sentence on the majority of the site's pages | **S** | `astro-build/src/pages/venues/[slug].astro:31` | Replace the fixed `130` with a computed budget, e.g. `venue.description.substring(0, Math.max(40, 155 - prefix.length))` where `prefix` is the literal string already built |
| 3 | **FAQ answer text is absent from server-rendered HTML** — only present in `FAQPage` JSON-LD and an escaped hydration-props blob, not as real visible-text DOM | `01-geo.md` (High, prominently flagged) + `01-technical.md` (High, independently found from a different angle) — two agents converged on this from crawlability vs. GEO perspectives respectively; confirmed root cause: `FaqAccordion.jsx`'s `useState(null)` never renders `.faq-a` until a click | **High** — this is a GEO/AI-citation gap: any pipeline doing plain visible-text extraction (not JSON-LD-aware) gets 5 questions with zero answers per venue page, across all 24 venue pages | **S** | `astro-build/src/components/FaqAccordion.jsx` | Two options, pick one: (a) `useState(0)` so the first FAQ renders open by default, or (b) always render all 5 `.faq-a` divs in the DOM and toggle visibility with CSS (`max-height`/`display`) instead of conditional React unmounting — (b) is the more complete fix since it makes all 5 answers visible-text, not just the first |
| 4 | **Eikenhof Estate capacity stated as "up to 80 guests" in the live Bottelary Road post, contradicting the correct "Up to 180" in `venues.js` and a second, newer post on the same site** | Independently found and confirmed by **three separate methods**: `01-content-eeat.md` (Critical), `01-sxo.md` (flagged unprompted as a "live data-integrity issue"), and my own direct grep against `posts.js:327` vs `venues.js` (`capacity: "Up to 180"`) | **High** — this is the site's highest-traffic blog post (545 impressions/28d, the best-performing page on the whole site) stating a capacity that undersells the venue by more than half, and it directly contradicts CLAUDE.md's explicit fact-check record for this exact figure ("verified twice against source PDF") | **S** | `astro-build/src/data/posts.js:327` | Change `"up to 80 guests"` → `"up to 180 guests"` in that one paragraph. One-line fix, three independent confirmations, site's #1 traffic page — this is the highest-confidence, lowest-effort fix in the whole report |
| 5 | **`elgin-vintners` shows a stale "Redirect error" in Google's index**, frozen at the exact moment of the 3 Sept cutover, never recrawled since | `00-gsc.md` §3 — live `curl` confirms the URL serves a clean 200 today; the error record is dated `2026-09-03T10:08:34Z` and hasn't updated in 15 days while every neighbouring page has been recrawled multiple times | **Medium** — low risk of real harm (the URL works, and it has a redirecting-www variant that already 301s correctly) but an unresolved index error can suppress a page from ranking until cleared | **S** | n/a (no code fix — this is a Search Console action) | Request indexing for `https://capevows.co.za/venues/elgin-vintners` via the GSC UI or `scripts/indexing_notify.py`, to force a fresh crawl attempt |

## This month

| # | Finding | Evidence | Impact | Effort | File : line |
|---|---|---|---|---|---|
| 6 | Nooitgedacht Wine Estate called "A Mid-Range wine estate" in `budget-friendly-winelands-venues`, contradicting `venues.js`'s actual `"Contact Venue"` tier — also contradicted by the newer pricing post, which correctly treats it as quote-on-enquiry | `01-content-eeat.md` Critical #2, verified by direct grep | High (factual credibility) | S | `astro-build/src/data/posts.js:100` |
| 7 | 2 of 24 venue pages not yet recrawled by Google since migration (`belmond-mount-nelson`, `lourensford-wine-estate`), still showing the pre-migration homepage-canonical mismatch in Google's records | `00-gsc.md` §3 | Low (self-resolving) | S | n/a — optionally request indexing on both |
| 8 | `/venues/saved` has no `noindex` meta and no sitemap exclusion beyond omission — a thin (30-word), per-visitor page discoverable via the nav heart-icon link on every page | `01-onpage.md` Finding "Note on /venues/saved" | Low-Medium | S | `astro-build/src/pages/venues/saved.astro` — copy the existing `<meta name="robots" content="noindex" slot="head">` pattern from `vendors.astro`/`admin.astro` |
| 9 | `privacy-policy.html` has no canonical, no meta description, no OG tags, no JSON-LD, and one em dash — it's static HTML outside `Base.astro`'s head machinery | `01-onpage.md` Finding 3 | Low-Medium | S | `astro-build/public/privacy-policy.html` — **do not touch the Information Officer/compliance text without asking**, per CLAUDE.md's explicit "what NOT to touch" list; the canonical/description/em-dash fixes are cosmetic and don't touch legal content, but flag to the operator before editing this file at all |
| 10 | `BlogPosting.datePublished` emits raw strings like `"July 2026"` instead of ISO 8601 — likely silently dropped or misparsed by strict JSON-LD consumers; no `author` or `dateModified` on any post | `01-schema.md` Moderate #2 | Medium (E-E-A-T / rich-result eligibility) | M | `astro-build/src/pages/blog/[slug].astro` + `astro-build/src/data/posts.js` (would need a real ISO date added per post, not derived from the current display string) |
| 11 | Zero `sameAs` links (Pinterest, Instagram) and no standalone `Organization` node in site-wide JSON-LD, despite both social profiles being live and documented in CLAUDE.md | `01-schema.md` Moderate #3, `01-local.md` Medium #4 (two agents independently flagged the same gap) | Medium (entity consolidation, brand knowledge-graph signal) | S | `astro-build/src/layouts/Base.astro` |
| 12 | Cape Town City has zero blog-post coverage for either of its 2 venues (Hawksmoor House, Belmond Mount Nelson) — the weakest region in the directory by content depth | `01-local.md` High #1 | Medium | M (content writing, not code) | new/extended blog post, mirroring the Constantia Valley H2 pattern already used in `coastal-wedding-venues-cape-peninsula` |
| 13 | `?region=`/`?price=` filtered `/venues` URLs are byte-identical to bare `/venues` (only a random hydration `uid` differs) — confirmed no independent SEO/indexing value from query-param filtering alone | `01-technical.md` §9 (live `cmp -l` test) + `01-local.md` High #3 | Medium — directly informs item 14/strategic recommendation below | — | architecture decision, see Strategic Recommendation |
| 14 | The em-dash content rule has more live violations than previously known, **and a real internal contradiction in CLAUDE.md itself** — see "Em-dash inventory and the title-pattern contradiction" below | `01-schema.md`, `01-local.md`, `01-onpage.md` (three independent sources) | Medium | S once decided | multiple files, see below |

## Backlog

| # | Finding | File |
|---|---|---|
| 15 | `EventVenue` schema lacks `addressLocality`, `postalCode`, `geo` — source data (`venues.js`) has no fields to populate them from; would need new data collection per venue | `01-schema.md` Moderate #1 |
| 16 | Venue `telephone` values in local SA format (`"021 863 3852"`), not E.164 (`+27218633852`) | `01-schema.md` Minor #2 |
| 17 | JSON-LD emitted as a bare array with repeated `@context` per node rather than a single `@graph` — both valid, `@graph` is more idiomatic if the `@id`/Organization work (item 11) happens | `01-schema.md` §10 |
| 18 | 18 of 40 page titles exceed 60 characters — mostly the documented, intentional venue-title pattern (leave alone), but 3 free-form blog titles (87, 86, 90 chars) are outliers worth trimming | `01-onpage.md` Finding 2 |
| 19 | `/404.html` has zero `<h1>` elements (uses a styled `div` instead) — low priority, page is noindexed | `01-onpage.md` Finding 4 |
| 20 | No `llms.txt` — proposed content drafted in `01-geo.md`, not yet added | `01-geo.md` |
| 21 | 8 blog hero images have no `width`/`height` HTML attributes (CSS already fixes the height, so no live CLS impact — confirmed via `global.css:116,125`) — defence-in-depth only | `01-images.md` Finding 1 |
| 22 | Re-download og-image.jpg and visually confirm no venue count is baked into the graphic (byte inspection alone can't answer this) | `01-images.md` Finding 4 |
| 23 | `web-app-manifest-192/512.png` and Google Fonts remain a render-blocking cost (~751ms wasted per `01-performance.md`); font subsetting or `font-display: optional` worth exploring | `01-performance.md` |
| 24 | Common Crawl has zero record of capevows.co.za in its current quarterly release — re-check against the next release; no Moz/Bing key configured for a fuller picture | `01-backlinks.md` |
| 25 | Two hardcoded `24`s in `Base.astro` (lines 7, 81) — no action needed while the count hasn't changed, already tracked in CLAUDE.md's pending list | `CLAUDE.md` (pre-existing, re-confirmed) |

---

## Em-dash inventory and the title-pattern contradiction

Three independent audit passes (`01-schema.md`, `01-local.md`, `01-onpage.md`)
converged on a fuller picture than the briefing's "only one known instance"
assumption. **Full live inventory, byte-confirmed:**

| Location | String | Rendered on |
|---|---|---|
| `Base.astro:6` (title default) | `"Cape Vows — Wedding Venues & Vendors in the Western Cape"` | Homepage `<title>`, `og:title`, `twitter:title` (fallback path) |
| `Base.astro:7` (description default) | `"...Western Cape — Franschhoek, Stellenbosch..."` | Every page that doesn't override description |
| `Base.astro:81` (WebSite JSON-LD `description`) | same string as above | Every page (global JSON-LD) |
| `astro-build/src/pages/index.astro:40` | `'Cape Vows — Wedding Venues & Vendors in the Western Cape'` | Homepage `<title>` (explicit override, duplicates the Base default) |
| `astro-build/src/pages/venues/[slug].astro:30` | `` `${venue.name} Wedding Venue — ${venue.region} \| Cape Vows` `` | All 24 venue page `<title>`, `og:title`, `twitter:title` |
| `astro-build/public/privacy-policy.html` | "Standard Contractual Clauses — we have executed..." | `/privacy-policy` body text |

**The genuine tension:** CLAUDE.md's Content rules section states *"No em
dashes anywhere in site content"* with no carve-out. But CLAUDE.md's own
SEO/GEO architecture section explicitly documents and mandates the venue
title pattern using an em dash: *"Every venue page title follows: [Venue
Name] Wedding Venue — [Region] | Cape Vows... This is deliberate for AI
search citation... Preserve this pattern."* These two rules directly
contradict each other for every one of the 24 venue titles plus the site's
own name-and-tagline string, which appears in six places above.

**I'm not resolving this unilaterally** — both the schema and content
agents independently declined to for the same reason: venue/title patterns
are explicitly listed in CLAUDE.md's "What NOT to touch without asking."
Two clean paths forward, either is a small, mechanical change once decided:

- **(a) Carve out title separators from the content rule.** Add one
  sentence to the Content rules section: *"The em dash rule applies to
  body prose (descriptions, blog paragraphs, UI copy); the `—` used as a
  title/tagline separator in venue titles and the site name is exempt."*
  Zero code changes. Cheapest, and matches how most style guides actually
  draw this line in practice.
- **(b) Change the separator.** Swap every em dash above for a colon or en
  dash (`:` or `–`) in the 6 locations listed, which also cascades into
  `privacy-policy.html`'s prose instance separately (that one has no
  title-pattern justification either way and should be fixed regardless
  of which path is chosen for (a) vs (b)).

My recommendation, offered but not acted on: **(a)**. The title pattern
predates and was a deliberate SEO/AI-citation decision with its own
documented rationale; the content rule reads as aimed at prose, and
retrofitting 24+ titles to avoid a separator that's already working (per
`01-sxo.md` and `00-gsc.md`, these exact titles are ranking and
occasionally clicking) risks disturbing something that isn't broken to
satisfy a rule that most likely wasn't written with titles in mind.

---

## Contrast fix proposal

Both failing tokens computed against `--cream` (`#FAF7F2`) using the real
WCAG 2.1 relative-luminance contrast formula, with CIEDE2000 (the modern
perceptual-distance standard) computed between each original and proposed
color. Method: uniform-scale darkening (reduce all three RGB channels by
the same fraction, preserving hue and saturation ratio) until the *rounded
integer hex* clears 4.5:1 — not just the pre-rounding float, so the shipped
value is guaranteed to pass, not just theoretically close.

| Token | Original | Contrast (orig) | Proposed | Contrast (new) | ΔE2000 |
|---|---|---:|---|---:|---:|
| `--gold` | `#A07840` | 3.74:1 | **`#8F6B39`** | 4.54:1 | 5.57 |
| `--muted` | `#7A7266` | 4.44:1 | **`#797165`** | 4.50:1 | 0.40 |

`--muted` needs almost no visible change (ΔE 0.40 — below the ~1.0
"just noticeable difference" threshold most colorists use; this will read
as identical to anyone not doing a side-by-side pixel comparison).
`--gold` needs a more visible shift (ΔE 5.57 — clearly perceptible in a
direct comparison, though still recognizably the same warm brass/gold
hue family, not a different color).

**Every selector affected** (from `global.css`, text-color usage only —
border/background/accent-color/box-shadow uses of these tokens are
unaffected by this fix and don't need to change):

`--gold` (17 selectors): `.nav-logo span`, `.btn-green:focus-visible`
(outline), `.trust-strip-item::before`, `.section-eyebrow`, `.card-region`,
`.card-link`, `.blog-card-cat`, `.blog-card-read`, `.blog-post-cat`,
`.blog-venue-btn:hover`, `.blog-venue-link:hover`, `.faq-q:hover`,
`.faq-chevron`, `.venue-details-card-region`, `.filter-select:focus`
(outline), `.filter-input:focus` (outline), `.modal-eyebrow`,
`.research-result-title`.

`--muted` (13 selectors): `.trust-strip-item`, `.section-desc`,
`.card-desc`, `.blog-card-summary`, `.blog-hero-credit`, `.faq-title`,
`.faq-a`, `.venue-detail-label`, `.venue-desc`, `.venue-features-title`,
`.filter-label`, `.modal-desc`, `.modal-detail-label`, `.research-sub`,
`.research-field label`, `.empty-sub`, `.results-count`.

**Implementation note:** since `--gold`/`--muted` are single CSS custom
properties defined once on `:root` (`global.css`), fixing the two
`--root` declarations fixes all 30 selectors above in one two-line change
— no per-selector edits needed. **Not applying this myself** — CLAUDE.md
explicitly lists the colour palette as "What NOT to touch without asking"
(anchored in the privacy policy and Pinterest/Instagram brand assets), so
this needs the operator's sign-off before the two-line `:root` change,
even though the fix itself is mechanically trivial.

---

## Strategic recommendation: regional landing pages vs. directory expansion

**Checked first, as instructed:** `enrich.mjs` does not exist anywhere in
the repository (`find . -iname "enrich.mjs"` returns zero results,
searched excluding `node_modules`). The only existing venue-research
tooling is `/admin`'s `ResearchPanel.jsx`, and it has a hard limitation
that materially affects this decision: **its `onAddVenue` callback
defaults to a no-op in the Astro build**
(`astro-build/src/components/ResearchPanel.jsx:7`, with the comment *"the
static admin page has no such store, so they default to no-ops and
results stay session-local"*). In plain terms: `/admin` can research and
extract structured venue data from a URL, but there is **no automated
path from that extraction into `venues.js`** — every new venue, today,
requires a human to manually copy the researched fields into the data
file by hand. Any plan to grow the directory has this manual step as a
hard floor on effort per venue, regardless of how good the research tool
gets.

### The decision

**Build the two SXO-identified regional hub enhancements first. Treat
directory expansion as a separate, slower-moving, ongoing track — not
an alternative to choose instead of the hubs.** These aren't competing
options; they answer different problems.

**Why the hubs win the "what to build next" question:**

1. **`01-sxo.md`'s query-by-query SERP analysis is decisive, not
   suggestive.** 4 of 10 target queries scored CRITICAL (intent-match 1/5)
   — every one of them a broad or town-level head term (`wedding venues
   western cape winelands`, `wedding venues cape winelands`, `wedding
   venues stellenbosch`, `small wedding venues cape winelands`) currently
   answered by an off-angle blog post because `/venues` has no static,
   crawlable per-region content. These 4 queries alone total 326
   impressions in the last 28 days (12.5% of site-wide impressions) at
   average positions in the 33–67 range — real, sizeable, currently-wasted
   demand.
2. **The technical and local audits independently confirm the mechanism,
   not just the symptom.** `01-technical.md` proved via live `curl`/`cmp`
   that `?region=`/`?price=` filtered URLs are byte-identical to bare
   `/venues` — the filtering is 100% client-side with zero independent
   crawlable content per region. `01-local.md` reached the same
   conclusion from the local-intent angle. Three specialists, three
   methods, one root cause: `/venues` has never had static regional copy.
3. **The Bottelary Road result is the proof-of-concept, already running
   in production.** `00-gsc.md` and `01-sxo.md` both show the single
   micro-location-anchored blog post (Bottelary Road) at position 9.7–11.1
   for its cluster of queries — Cape Vows's best result on the entire
   site, beating a live named competitor (eurekafunctions.co.za) per the
   SXO check. This isn't a hypothesis; a narrower, more specific page
   already outperforms every broad page on the site. The two proposed hub
   builds are this same proven pattern, scaled up one level from
   "road" to "town" and "region."
4. **This is honest within the no-fabrication rule.** A Stellenbosch hub
   or a strengthened Winelands hub aggregates *existing, already-verified*
   venues by region — it needs zero new venue research, zero new
   fact-checking, zero risk of the kind of factual drift found in items
   4/6 above. It's a restructuring/writing task on data Cape Vows already
   owns and trusts.

**Why directory expansion is real but slower, and shouldn't compete for
this month's attention:**

- **The manual-entry floor is real and currently unautomated.** Every one
  of the 9 `Contact Venue` / 0 `Budget`-tier / Winelands-only
  Premium-Luxury gaps that CLAUDE.md documents can only be closed by
  finding, verifying, and manually entering new venues — there's no
  scripted pipeline today, confirmed above.
- **3 of the current 24 venues still lack verified source material**
  (Hawksmoor House, The Cellars-Hohenort, Belmond Mount Nelson) — the
  no-fabrication rule means expansion work has a backlog *within the
  existing 24* before "grow to ~100" is even the right next unit of work.
- **The tier/region gaps the audit surfaced (0 Budget-tier, Premium/Luxury
  Winelands-only, Cape Town City's zero blog coverage) are real content
  gaps** but they're not currently costing Cape Vows measurable search
  visibility the way the missing regional hubs are — nobody is searching
  "budget wedding venue Western Cape" at the volume "wedding venues
  stellenbosch" gets (108 impressions/28d), so closing the tier gap is
  lower-urgency than the hub build even though it's also worth doing
  eventually.
- **A solo operator has finite research hours.** Fact-checking one new
  venue to Cape Vows's existing standard (source PDF, phone/address
  verification, capacity cross-check) took real, documented effort for
  each of the current 24 — CLAUDE.md's own fact-check history records
  multiple corrections per venue found during that process. Multiplying
  that by ~76 new venues to reach "~100" is a multi-month undertaking
  regardless of tooling; it should be sequenced, not rushed to compete
  with a two-week content build.

### Phased sequence

**Phase A (this month, ~1–2 weeks of writing/restructuring, zero new
research):**
1. Strengthen `/venues` into a real Winelands-wide hub: add static,
   server-rendered intro copy above the filter UI naming the 5 regions
   and linking to (or embedding a static preview of) each — this alone
   gives crawlers something to match against for queries 1 and 3 above,
   independent of the `VenuesApp` hydration issue.
2. Build one new page or a dedicated, deeply-linked section specifically
   for "Stellenbosch wedding venues" — per `01-sxo.md`, this is *"the
   single highest-confidence build in this audit"* (query 8, 108
   impressions/28d, currently answered by the wrong page entirely).
   Whether this is a new Astro route (`/venues/stellenbosch` or similar)
   or a substantially rewritten/retitled existing post is an editorial
   call; either way it needs static body copy, not client-side filtering.
3. Fix the internal cannibalization flagged in item 6/13 above (`wedding
   venue stellenbosch prices` currently ranking the wrong post) as part
   of the same pass, since it touches the same pages.

**Phase B (ongoing, starts once Phase A ships):**
1. Resume the 3-venue verification backlog (Hawksmoor House, The
   Cellars-Hohenort, Belmond Mount Nelson) — closes the existing
   no-fabrication gap before any net-new venue research begins.
2. Confirm La Paris Estate's real capacity range directly with the venue
   (already item 2 on CLAUDE.md's pending list).
3. Only after both of the above: begin sourcing new venues, prioritising
   the tier/region gaps this audit reconfirmed (any Budget-tier venue;
   any Premium/Luxury venue outside Cape Winelands) since those close a
   real, named content gap rather than adding volume for its own sake.

### First 3 concrete tasks (start Monday)

1. Write the static Winelands-hub intro copy for `/venues`
   (`astro-build/src/pages/venues/index.astro`) — no new data, no new
   research, purely restructuring existing region/venue facts into
   crawlable prose.
2. Draft the Stellenbosch-specific page/section outline, reusing the
   Bottelary Road post's proven structure (single clear H1/title match to
   the query, named verified venues, honest "we don't pad the list"
   framing) as the template.
3. In parallel (different skill, no dependency): ship items 1–5 from
   "Ship this week" above — none of them touch the hub build, and item 1
   (the CLS fix) directly improves the `/venues` page the hub work is
   about to make more important.

---

## 30/60/90-day measurement plan

Every metric below is a real GSC field, re-pullable with the exact
commands used in this audit (`scripts/gsc_query.py`,
`scripts/gsc_inspect.py`) — no new tooling required.

### 30 days (re-pull ~2026-10-18)

| Metric | Current | Falsifies if | Confirms if |
|---|---|---|---|
| Venue pages with any GSC impressions | 8/24 | Still ≤8/24 despite 22/24 having been recrawled a month ago — would mean the static-HTML fix alone isn't sufficient, something else (internal linking, content depth) is the blocker | Rises to 12+/24 |
| `/venues` desktop CLS | 0.881 | Still >0.25 after the fix ships — means the fix didn't address the real shifting element | <0.1 ("Good") |
| `elgin-vintners` index status | "Redirect error" (stale) | Still showing the error after an indexing request — would mean it's a live bug, not a stale record | "Submitted and indexed" |
| www-subdomain rows in GSC | 2 of 218 query rows | Materially unchanged or growing | Continued decline toward zero |

### 60 days (re-pull ~2026-11-17)

| Metric | Current | Falsifies if | Confirms if |
|---|---|---|---|
| Position, "wedding venues stellenbosch" | 33.6–44.5 (varies by page) | No movement after the Stellenbosch hub ships and gets ~4-6 weeks to be crawled/evaluated | Moves into top 20 |
| Position, "wedding venues western cape winelands" / "wedding venues cape winelands" | 43.8 / 44–55.8 | No movement after the `/venues` hub copy ships | Combined average position improves 10+ places |
| Eikenhof Estate capacity/Nooitgedacht tier fixes | Live errors | N/A (this is a correctness fix, not a ranking bet — just confirm the corrected text is live) | Corrected text confirmed live via `curl` |

### 90 days (re-pull ~2026-12-17)

| Metric | Current | Falsifies if | Confirms if |
|---|---|---|---|
| Total site impressions (28-day) | 2,606 | Flat or declining vs. this pull | Sustained growth beyond the 3-pull trend already observed (1,435 → 1,968 → 2,606) |
| Site-wide avg. position | 25.6 | No further improvement, or regression | Continues the trend toward <20 |
| Venue pages with any clicks (not just impressions) | 1 (`groot-constantia`) | Still ≤2 pages with clicks | 5+ venue pages register at least one click |
| Phase A hub pages: indexed + ranking | N/A (don't exist yet) | Not indexed within 90 days, or indexed but position >50 | Indexed and inside top 30 for their target queries |

**The single most important falsification test carried over from the
last audit remains open:** venue-page impressions were the migration's
proof point, went from 2/24 to 8/24 this pull, and the 30-day check above
is the next real test of whether that keeps climbing or plateaus.
