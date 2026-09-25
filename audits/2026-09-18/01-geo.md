# GEO / AI-Search-Readiness Audit — Cape Vows (capevows.co.za)
Date: 2026-09-18 · Scope: live site fetched with plain `curl` (no JS execution), cross-referenced against `astro-build/src/` and `astro-build/dist/`.

---

## 0. Headline finding (flagged per instructions) — FAQ answer text and non-JS crawlers

**Verdict: FAQ answer text is NOT present anywhere in the visible/rendered HTML body. It exists in raw HTML in exactly one clean, semantically-labeled form (the `FAQPage` JSON-LD `script` block), and incidentally as an HTML-entity-escaped JSON blob inside the hydration `<astro-island props="...">` attribute. It is absent from the actual `<div class="faq-a">` accordion markup for every one of the 5 FAQ items tested, in both open and closed states, because the closed state is what gets server-rendered.**

Evidence chain:

1. **Component logic** (`astro-build/src/components/FaqAccordion.jsx:4-38`):
   ```jsx
   const [openIndex, setOpenIndex] = useState(null);
   ...
   {openIndex === i && (
     <div className="faq-a" style={{ color: "var(--muted)" }}>
       {faq.a}
     </div>
   )}
   ```
   `openIndex` initializes to `null`. Astro's server-side render of this island executes the component with that initial state, so **zero** `faq-a` divs are emitted server-side — not even the first FAQ item. The answer div is only mounted into the DOM client-side, after hydration, after a user click.

2. **Live curl of `/venues/lanzerac-wine-estate`** confirms this directly:
   ```
   $ curl -s https://capevows.co.za/venues/lanzerac-wine-estate | grep -o 'faq-q"[^<]*<span>[^<]*</span>'
   faq-q" type="button" aria-expanded="false"><span>How many guests can Lanzerac Wine Estate accommodate?</span>
   faq-q" type="button" aria-expanded="false"><span>Where is Lanzerac Wine Estate located?</span>
   faq-q" type="button" aria-expanded="false"><span>What type of venue is Lanzerac Wine Estate?</span>
   faq-q" type="button" aria-expanded="false"><span>What is the price range for a wedding at Lanzerac Wine Estate?</span>
   faq-q" type="button" aria-expanded="false"><span>Does Lanzerac Wine Estate have on-site accommodation?</span>

   $ curl -s https://capevows.co.za/venues/lanzerac-wine-estate | grep -o 'class="faq-a"' | wc -l
   0
   ```
   All 5 questions render as static text (good). All 5 `aria-expanded="false"`. **Zero** instances of `class="faq-a"` anywhere in the raw response — the answer text genuinely is not body copy in the HTML a non-JS crawler receives.

3. **But the same answer text IS present, twice, elsewhere in the same HTML document:**
   - Cleanly, in the `FAQPage` JSON-LD (`<script type="application/ld+json">`), e.g.:
     ```json
     {"@type":"Question","name":"How many guests can Lanzerac Wine Estate accommodate?","acceptedAnswer":{"@type":"Answer","text":"Lanzerac Wine Estate can accommodate up to 250 guests. Exact numbers can vary depending on the ceremony layout, whether you're using indoor or outdoor spaces, and the time of year. It's worth calling the venue directly to confirm what works for your specific guest count and format."}}
     ```
     All 5 Q/A pairs are present in full, well-formed schema.org markup.
   - Incidentally, as an HTML-entity-escaped JSON payload inside the hydration island's `props` attribute:
     ```html
     <astro-island uid="Z2pLF45" ... component-export="default" ... props="{&quot;faqs&quot;:[1,[[0,{&quot;q&quot;:[0,&quot;How many guests can Lanzerac Wine Estate accommodate?&quot;],&quot;a&quot;:[0,&quot;Lanzerac Wine Estate can accommodate up to 250 guests...&quot;]}], ...
     ```
     This is real bytes in the raw response, but it is not visible/semantic body text — it's an attribute value on a custom element, HTML-entity-encoded, meant for the client JS hydration runtime to consume, not for a text extractor.

**Why this matters for GEO, precisely:**
- Crawlers/pipelines that parse structured data (Google's indexer, and most serious AI-citation crawlers that specifically look for `FAQPage`/`Answer` schema) **do** get the full answer text. This is the best-case outcome and is very likely why FAQPage markup was added in the first place.
- Crawlers/pipelines that do boilerplate-stripped **visible-text extraction** (e.g. trafilatura-style tools, and plausibly some LLM-training crawlers that discard `<script>` content and only keep rendered text nodes) will see the 5 questions as body copy but **will not see any answer text as body copy** — only the venue's answer-first paragraph and description higher up the page. This is a real gap, not a false alarm: a model asked "how many guests can Lanzerac Wine Estate hold" that only ingested visible text would have nothing to cite from the FAQ section specifically (it would have to fall back to the main description paragraph, which does happen to state capacity for this venue, but that's not true for every FAQ answer on every venue).
- **This is a construction issue, not a client-directive issue** — `client:visible` was presumably chosen for the interactivity, but the conditional-render-on-open pattern means even `client:load` wouldn't fix it; the fix has to be at the render level (render all `faq-a` divs statically, e.g. with a `hidden` attribute or `max-height:0` CSS toggle driven by a class, instead of conditionally not rendering the element at all).

**Recommended fix (not applied — audit is read-only):** Always render every `faq-a` div in the DOM (server + client), and toggle visibility with CSS (`display:none`/height collapse driven by a class tied to `openIndex`) rather than a JSX conditional that omits the element entirely when closed. This preserves the accordion UX for humans while making the answer text real, present, static HTML for every crawler regardless of whether it executes JS or parses `<script>` JSON-LD. Severity: **High** — this is the single biggest citability gap found on venue pages, Cape Vows' highest-value page type for AI answers.

---

## 1. Page-template fetch check (raw `curl`, no JS)

Fetched with plain `curl -s <url>` (User-Agent default, i.e. simulating any non-browser fetcher including AI crawlers that don't execute JS):

| Template | URL | HTTP | Bytes | Answer-first paragraph present as real text? | astro-island count |
|---|---|---|---|---|---|
| Homepage | `/` | 200 | 26,495 | Yes | 1 (`NavSavedBadge`, header only) |
| Venue page | `/venues/lanzerac-wine-estate` | 200 | 30,811 | Yes | 6 (FaqAccordion, EnquiryModal, CookieBanner, 3× Favourites heart buttons) |
| Blog post | `/blog/wedding-venue-bottelary-road-stellenbosch` | 200 | 15,243 | Yes | not counted, main copy confirmed static |
| Venues listing | `/venues` | 200 | 52,535 | Yes (per-card descriptions render statically; see briefing's known-open item that the 24-venue dataset also ships twice, once as static `<noscript>` cards) | — |

**(a) Answer-first paragraph — confirmed present as real text on every template tested:**

Homepage `<h1>`/hero:
> "You've Found Each Other. Now Find the Venue." / "24 hand-researched venues across the Western Cape, from sun-drenched Winelands estates to hidden fynbos retreats, verified and curated for your Cape wedding."

Venue page (`/venues/lanzerac-wine-estate`):
> "Lanzerac Wine Estate is a wine estate wedding venue in Cape Winelands, Western Cape. A stately Cape Dutch manor at the foot of the Jonkershoek Mountains in Stellenbosch, with roots tracing back to 1692. The 5-star h[otel...]"

This follows the answer-first pattern documented in `CLAUDE.md` ("SEO / GEO architecture") exactly, and it is genuine static HTML, not behind an island.

Blog post (`/blog/wedding-venue-bottelary-road-stellenbosch`), `class="post-intro"`:
> "Eikenhof Estate sits on Fischers Road in the Bottelary Hills, a quieter, less-photographed corner of the Stellenbosch winelands just north of the town itself. If you've searched for a wedding venue on Bottelary Road, Eikenhof is the boutique farm estate hand-verified in our directory for this specific pocket of the Cape Winelands, and the Bottelary Hills area is worth understanding before you book anywhere nearby."

This is a strong, self-contained, citable passage (see citability scoring in section 4).

**(b) FAQ answers** — see Section 0 above (the headline finding). Questions are static text; answers are not, except inside JSON-LD and the raw hydration-props attribute.

**(c) JSON-LD presence in raw HTML — confirmed on all 4 templates:**

- Homepage: 1 block, `WebSite` (+ nested `Organization` as `publisher`). No standalone top-level `Organization` schema was found on the homepage in the current Astro build (differs slightly from the pattern CLAUDE.md describes for the legacy React app, where `Organization` was injected separately on mount — in the current static build it's nested inside `WebSite.publisher` instead). Not a defect, just noting the shape for anyone expecting a separate block.
- Venue page: 2 `<script type="application/ld+json">` blocks covering `EventVenue`, `FAQPage` (5× `Question`/`Answer` pairs, full text — see Section 0), `BreadcrumbList` (3-level), and a nested `PostalAddress`.
- Blog post: 1 block, `BlogPosting`, e.g.:
  ```json
  {"@type":"BlogPosting","headline":"Wedding Venues Near Bottelary Road, Stellenbosch","description":"Eikenhof Estate is a boutique wine and olive farm wedding venue on Fischers Road in the Bottelary Hills, Stellenbosch. Here's what makes the area special.","image":"https://images.unsplash.com/...","datePublished":"July 2026","url":"https://capevows.co.za/blog/wedding-venue-bottelary-road-stellenbosch","mainEntityOfPage":"...","publisher":{"@type":"Organization","name":"Cape Vows","url":"https://capevows.co.za"}}
  ```
  Two things worth flagging here (new findings, not in the briefing's known-open list):
  - **No `author` property on `BlogPosting`.** This is a real E-E-A-T/authorship gap: no byline entity in the structured data for any blog post, which weakens the "authorship" authority signal AI systems weight when deciding whether to trust/cite a source. Severity: Medium.
  - **`datePublished` is `"July 2026"`, not ISO 8601** (should be e.g. `"2026-07-01"`). Schema.org's `datePublished` expects an ISO date/datetime; a non-conformant string risks the freshness signal being silently dropped by parsers that validate the format. Severity: Medium, cheap to fix, applies to all 8 posts (needs checking whether all 8 use the same non-ISO format in `astro-build/src/data/posts.js`, not individually re-verified here due to time constraints — flag for a follow-up grep).
- Venues listing (`/venues`): 1 block, `WebSite` (same global block from `Base.astro`, no `ItemList`/`CollectionPage` schema for the 24-venue listing itself). Missing structured `ItemList` markup for a page whose entire purpose is a curated list is a missed opportunity for AI systems parsing "list of Western Cape wedding venues" queries. Severity: Low-Medium, worth considering for a future pass.

---

## 2. llms.txt

```
$ curl -s -o /dev/null -w "%{http_code}\n" https://capevows.co.za/llms.txt
404
```

Confirmed absent. Proposed content below (facts only: 24 venues, 5 regions, 8 blog posts — verified against `astro-build/src/data/venues.js`/`posts.js` counts stated in the briefing; not fabricated). **This is a proposal only — not written to `public/` or the live site.**

```markdown
# Cape Vows

> A curated, hand-verified directory of wedding venues in the Western Cape,
> South Africa. No paid placements, no listing fees. 24 venues across 5
> regions, plus planning guides for couples researching Cape wedding venues.

Cape Vows exists to give couples planning a Western Cape wedding a factual,
independently-verified starting point: every venue listed has been
fact-checked against venue-supplied source material (brochures, official
sites) rather than scraped or submitted. Descriptions are written to be
factual rather than promotional, which makes them well-suited for direct
citation.

## Venue directory

- [All venues](https://capevows.co.za/venues): the full directory of 24
  hand-verified Western Cape wedding venues, filterable by region, venue
  type, price tier and guest capacity.

Regions covered: Cape Winelands, Constantia Valley, Cape Town City, Atlantic
Seaboard, Overberg.

Venue types covered: Wine Estate, Historic Manor, Boutique Hotel, Farm &
Country, Garden Estate, Beach & Coastal, Mountain Retreat.

Price tiers: Mid-Range (R50-150k), Premium (R150-300k), Luxury (R300k+),
and venues where pricing is available on enquiry ("Contact Venue"). Note:
the directory currently has no venues in a sub-R50,000 "Budget" tier, and
the Premium/Luxury tiers are Cape Winelands-only (no coastal or Constantia
Valley venue currently sits in either tier).

Each venue page includes a direct-answer summary, capacity, price tier,
region, key features, and a five-question FAQ (capacity, location and
driving time from Cape Town, venue type, price, and on-site accommodation).

## Planning guides (blog)

- [All guides](https://capevows.co.za/blog)
- Best Wine Estate Venues in Franschhoek
- Budget-Friendly Winelands Venues
- Best Seasons for a Cape Wedding
- Marriage Officer Guide for Cape Weddings (legal requirements under the
  Marriage Act 25 of 1961 and Civil Union Act 17 of 2006)
- Mountain-Backdrop Wedding Venues in the Western Cape
- Wedding Venues Near Bottelary Road, Stellenbosch
- Wedding Venue Prices in Stellenbosch & the Winelands
- Coastal Wedding Venues on the Cape Peninsula

## Notes for AI systems / citation

- Venue facts (capacity, address, price tier, accommodation) are sourced
  from venue-supplied material where available; a small number of venues
  are flagged internally as unverified pending direct confirmation from the
  venue, and Cape Vows does not present unverified figures as confirmed.
- South African English and terminology is used throughout: "Marriage
  Officer" (not "officiant"), "Winelands" (not "wine country"), "fynbos"
  (not "local shrubs"), SA spelling (favour, colour, kilometres).
- Cape Vows does not charge venues to be listed and does not accept paid
  placement; no venue pays for featured positioning.

Contact: hello@capevows.co.za
```

---

## 3. Passage citability — 10 target queries

Method: for each query, identified the Cape Vows page GSC currently shows impressions for (from `audits/2026-09-18/_gsc_raw.json`, 28-day pull), then rated the single best-citable passage 1-5. **Two queries' ranking-page HTML was not independently re-fetched in this pass** (time-constrained by the orchestrator's stop instruction); those two are marked accordingly and should not be read as fully verified quotes — only the GSC page mapping is verified.

| Query | Ranking page (GSC, impressions/position) | Best-citable passage | Score |
|---|---|---|---|
| bottelary road wedding venues | `/blog/wedding-venue-bottelary-road-stellenbosch` (78 imp, pos 11.1 — best-ranking query in the set) | Verified via curl, `post-intro`: "If you've searched for a wedding venue on Bottelary Road, Eikenhof is the boutique farm estate hand-verified in our directory for this specific pocket of the Cape Winelands..." — names a specific venue, specific road, specific region, and is self-contained. | **5** |
| wedding venue bottelary road | `/blog/wedding-venue-bottelary-road-stellenbosch` (42 imp, pos 11.8) | Same passage as above. | **5** |
| cheap wedding venues stellenbosch | `/blog/budget-friendly-winelands-venues` (30 imp, pos 45.4) | Not independently re-fetched this pass. Per `CLAUDE.md`'s fact-check log this post's Nooitgedacht entry is corrected to Stellenbosch and the directory has zero Budget-tier venues, so the page's honest framing (no venue can be cited as truly "cheap"/Budget-tier) likely limits how directly citable any single passage is — the page has to caveat rather than assert. Recommend re-fetching directly to confirm. | **3 (provisional)** |
| wedding venue stellenbosch prices | `/blog/wedding-venue-prices-stellenbosch-winelands` (4 imp, pos 24 — best position for this query) | Not independently re-fetched this pass, but `CLAUDE.md` documents this post's verified tier claims precisely: "Lanzerac and Eikenhof are Mid-Range, Zorgvliet and La Paris are Premium, Babylonstoren and Boschendal are Luxury." A sentence built from these verified facts (e.g. "Lanzerac Wine Estate and Eikenhof Estate sit in the Mid-Range R50,000-150,000 tier for a Stellenbosch wedding") would be a strong 4-5 candidate if it appears verbatim on the page — flagged for direct confirmation. | **4 (provisional)** |
| small wedding venues cape winelands | `/blog/budget-friendly-winelands-venues` (25 imp, pos 66.7); also `/blog/wedding-venue-prices-stellenbosch-winelands` (5 imp, pos 50.8) | No page in the directory is purpose-built around "small"/low-capacity venues specifically — this is a content gap, not just a citability-wording issue. No verified passage identified. | **1 (no good passage identified; likely content gap)** |
| franschhoek wedding venues | `/blog/best-wine-estate-venues-franschhoek` (90 imp, pos 71.2 — high impressions, very weak position) | Not independently re-fetched this pass. Weak ranking position (71.2, i.e. page ~6-7) despite high impressions suggests either thin/generic content or a title-relevance mismatch; cannot rate a specific passage without re-fetching, flagged for follow-up. | **Not rated — needs direct fetch** |
| wedding venues cape winelands | Split across `/blog/wedding-venue-prices-stellenbosch-winelands` (18 imp, pos 35.6, best), `/blog/budget-friendly-winelands-venues` (76 imp, pos 45.9), `/venues/lanzerac-wine-estate` (5 imp, pos 83) | Cape Vows has no single canonical "Cape Winelands wedding venues" landing page ranking well for this broad regional query — impressions are fragmented across 3+ pages, none in a strong position. The venue page's own answer-first sentence ("Lanzerac Wine Estate is a wine estate wedding venue in Cape Winelands, Western Cape... a stately Cape Dutch manor at the foot of the Jonkershoek Mountains in Stellenbosch, with roots tracing back to 1692" — curl-verified, Section 1a) is a strong single-venue passage but not a broad-query answer. | **3** (strong single-venue passage exists; no strong broad-query passage exists) |
| wedding venues western cape winelands | Not confirmed in this pass — the GSC query-row lookup for this exact phrase was in progress when the orchestrator's stop instruction arrived (110 impressions per the briefing's top-10 summary, page-level split not re-derived here). | Not rated. | **Not rated — needs direct query lookup in `_gsc_raw.json`** |
| stellenbosch wedding venues | `/blog/wedding-venue-bottelary-road-stellenbosch` (36 imp, pos 30.9), `/blog/wedding-venue-prices-stellenbosch-winelands` (40 imp, pos 56.2) | Best-positioned page is the Bottelary Road post; its curl-verified intro paragraph (quoted above) is Stellenbosch-anchored and specific, though it is written around Bottelary Road/Eikenhof specifically rather than Stellenbosch broadly. | **4** (specific and citable, slightly narrower than the query's intent) |
| wedding venues stellenbosch | Row-level split for this exact word order was not fully captured before the pagination limit on the raw-JSON grep was hit (see limitation note below); the closely-related "stellenbosch wedding venues" mapping above is the best available proxy. | Not independently rated to avoid conflating the two distinct query strings. | **Not rated — needs direct query lookup** |

**Limitation, stated explicitly per the briefing's evidence rule:** `_gsc_raw.json` grep output was paginated at 250 lines during this session and was cut off before confirming page-level rows for "wedding venues western cape winelands" and "wedding venues stellenbosch" (as distinct from "stellenbosch wedding venues"), and three ranking pages (`best-wine-estate-venues-franschhoek`, `budget-friendly-winelands-venues`, `wedding-venue-prices-stellenbosch-winelands`) were not independently re-fetched with curl in this session to verify exact on-page passage wording — the citability scores for those are provisional, built from GSC position data (verified) plus `CLAUDE.md`'s already-fact-checked content notes (verified secondary source), not from a fresh curl quote. Recommend a short follow-up pass to close these three fetches and the two query lookups.

---

## 4. Brand-mention consistency (built HTML, `astro-build/dist/`)

```
$ grep -rl "CapeVows" astro-build/dist/
(no matches)
```

No instances of the no-space "CapeVows" variant or other fragmenting variants found anywhere in the built output. The nav logo markup splits the name across a `<span>` for styling (`Cape <span>Vows</span>`) but renders as the single string "Cape Vows" in the text/DOM — this does not fragment brand-entity text extraction. **No finding here** — brand name is consistent site-wide.

---

## 5. SA terminology consistency (built HTML, `astro-build/dist/`)

```
$ grep -rl "officiant" astro-build/dist/
astro-build/dist/blog/marriage-officer-guide-cape-weddings.html

$ grep -o '.\{80\}officiant.\{80\}' astro-build/dist/blog/marriage-officer-guide-cape-weddings.html
ficers registered under the Civil Union Act. The last category includes secular officiants, useful for couples who want a non-religious ceremony.

$ grep -rl "wine country" astro-build/dist/
(no matches)

$ grep -rl "local shrubs" astro-build/dist/
(no matches)
```

**Finding: one violation of the "Marriage Officer, not officiant" rule, in the live built HTML**, in `astro-build/dist/blog/marriage-officer-guide-cape-weddings.html` — "secular officiants." This is on the one blog post that CLAUDE.md flags as having fact-checked legal content sourced from the Marriage Act 25 of 1961 and Civil Union Act 17 of 2006, so the underlying legal facts should not be touched, but the word "officiants" itself should be replaced with "Marriage Officers" (or "secular Marriage Officers") to comply with the site's own terminology rule. This is the ironic single worst place for this violation to live, since it's the page whose entire subject is Marriage Officer terminology. Severity: Medium (one instance, easy fix, but undermines the exact page meant to be the authority on this term for both human readers and AI citation). No "wine country" or "local shrubs" violations found anywhere in the built output.

---

## 6. AI crawler access (live robots.txt)

```
$ curl -sI https://capevows.co.za/
HTTP/1.1 200 OK
Server: cloudflare
...
```

```
$ curl -s https://capevows.co.za/robots.txt
# Cape Vows robots.txt
# Strategic goal: AI / GEO citation — we explicitly welcome AI crawlers.
#
# IMPORTANT: Cloudflare's "Managed robots.txt" / "Block AI Scrapers and Crawlers"
# (AI Audit) feature can inject its own robots.txt at the edge and override this
# file. After deploying, verify with:  curl https://capevows.co.za/robots.txt
# If Disallow rules for AI bots still appear, disable that Cloudflare feature.

User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://capevows.co.za/sitemap.xml
```

**Confirmed live**: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, and Bingbot are all explicitly `Allow: /`, exactly as CLAUDE.md documents, and the file itself contains a self-check reminder about Cloudflare's AI Audit feature potentially overriding it at the edge — which is exactly the failure mode this curl just ruled out for right now (the file served is the repo's intended file, not a Cloudflare-injected block list).

**Sitemap directive**: present (`Sitemap: https://capevows.co.za/sitemap.xml`), which helps AI crawler discovery for engines that respect the `Sitemap:` directive the same way search engines do (most major AI crawlers with a stated citation/indexing purpose, e.g. OAI-SearchBot, do crawl sitemaps; pure training-data crawlers like the base GPTBot/CCBot entries may or may not, this varies by operator and isn't independently testable via curl).

**Known blind spot, stated explicitly**: this check cannot verify whether Cloudflare would issue a JS challenge / bot-fight-mode block to a *real* AI crawler user agent, because `curl` here was sent with a generic default UA, not a spoofed `GPTBot`/`ClaudeBot`/`PerplexityBot` UA string, and testing with a spoofed UA against a production Cloudflare deployment risks tripping abuse detection or WAF rules from this environment. CLAUDE.md already documents that Cloudflare Bot Fight Mode must remain OFF for Googlebot to pass, and the same edge configuration governs AI crawler UAs — the current `curl` results are consistent with Bot Fight Mode being off (plain 200, no challenge page, no CAPTCHA HTML observed), but this is inferred from a non-AI UA response, not a direct AI-UA test. Recommend a follow-up check using a proper AI-crawler UA string from an authorized testing context, or checking Cloudflare's dashboard "AI Audit" toggle directly rather than relying on curl.

---

## Findings summary by severity

**High (1):**
1. FAQ answer text is absent from the visible-text HTML/accordion markup on venue pages (present only in `FAQPage` JSON-LD and as an escaped hydration-props blob) — `astro-build/src/components/FaqAccordion.jsx:4,34-38`. See Section 0.

**Medium (4):**
2. `BlogPosting` JSON-LD has no `author` property on any post (authorship/E-E-A-T signal gap) — confirmed on `/blog/wedding-venue-bottelary-road-stellenbosch`, likely site-wide (not individually re-verified for all 8 posts).
3. `BlogPosting` JSON-LD `datePublished` uses a non-ISO-8601 string (`"July 2026"`) instead of a parseable date — same scope caveat as above.
4. `llms.txt` returns 404 (no llms.txt exists) — proposed content drafted in Section 2, not deployed.
5. "officiant" appears in the live built HTML of `astro-build/dist/blog/marriage-officer-guide-cape-weddings.html` ("secular officiants"), violating the site's own "Marriage Officer, not officiant" rule, on the one page most likely to be cited as the authority on this exact term.

**Low-Medium (1):**
6. `/venues` listing page has no `ItemList`/`CollectionPage` structured data for the 24-venue collection (only the global `WebSite` block) — a missed opportunity for AI systems parsing "list of venues" queries.

**Low / informational (2):**
7. Homepage has no standalone top-level `Organization` JSON-LD block distinct from the `WebSite.publisher` nesting — not a defect, just a shape note versus CLAUDE.md's description of the legacy pattern.
8. No brand-name fragmentation found ("CapeVows" variant absent site-wide) — confirms this is NOT a problem, included for completeness since it was explicitly in scope.

**Incomplete / needs follow-up (not counted as findings, logged for transparency):** 3 of the 10 target-query passage ratings in Section 3 are provisional or unrated because their ranking pages were not independently re-fetched and two exact-phrase GSC query rows were not confirmed before the session's time limit — see the explicit limitation note at the end of Section 3.

---

**File:** `c:\Users\chadl\Documents\GitHub\cape-vows\audits\2026-09-18\01-geo.md`
