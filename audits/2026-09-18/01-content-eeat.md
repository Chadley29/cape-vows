# Content Quality & E-E-A-T Audit — Cape Vows
Date: 2026-09-18 · Scope: all 8 blog posts (`astro-build/src/data/posts.js`), all 24 venues (`astro-build/src/data/venues.js`), 6 sampled live venue pages.

Method note: em-dash and SA-English scans were run with `Grep` directly against the raw `posts.js` source (every field: `summary`, `metaDesc`, `intro`, `sections[].h2`, `sections[].paras[]`, `sections[].items[].desc`, `sections[].notice`), not the rendered page, per the briefing's warning that `summary` never renders on the post page itself. Venue-page checks used live `curl`/`render_page.py` fetches of `https://capevows.co.za`, cross-referenced against `astro-build/src/data/venues.js`.

**Scope gap, disclosed up front:** task item 8 (passage-level AI-citability for 3 target queries) and item 9 (readability spot-check) were cut short by a time/turn budget interrupt before dedicated analysis passes were run on them. Everything else in the brief (items 1–7, 10) is complete. Item 8 is partially covered as a byproduct of the answer-first check (item 5) — see that section. Item 9 is not covered; flag as a follow-up if a dedicated readability pass is wanted.

---

## Summary of findings by severity

- **Critical (factual errors on live content):** 2
- **High (internal-linking / discoverability gaps, doc staleness affecting future audits):** 3
- **Medium (terminology consistency, unverifiable claims, regional scope mismatch):** 4
- **Low / informational (confirmations of what's already correct):** several, listed inline

---

## 1–2. Em-dash scan and SA-English scan (all 8 posts, every field)

**Em dash (U+2014, "—"): ZERO found in `astro-build/src/data/posts.js`.**

Method: `Grep` for the literal `—` character across the entire file (all 534 lines, every field including `summary` and `metaDesc`). No matches. This confirms CLAUDE.md's content rule ("No em dashes anywhere in site content") holds for the blog post dataset specifically. Note this does **not** cover `Base.astro`'s `WebSite` JSON-LD `description` field, which the briefing already flags as a known, separate em-dash violation outside this audit's file scope (posts.js only) — that one belongs to whichever specialist covers `layouts/Base.astro`.

**American spellings ("favor", "color", "kilometer(s)"): ZERO found.** Grep for `favor|color|kilometer` across posts.js returned no matches. SA spellings (colour, favour, kilometres) are not tested by absence-of-error alone since none of the 8 posts happen to use those words at all — this is a pass by non-occurrence, not a confirmed correct usage in context.

**"Officiant" vs "Marriage Officer": 2 occurrences, both in `marriage-officer-guide-cape-weddings`.** CLAUDE.md states "Marriage Officer" not "Officiant" as a non-negotiable SA-terminology rule. Two lowercase, generic uses of "officiant" appear in the post that is specifically about Marriage Officer terminology:

- `posts.js:198` — "...private civil Marriage Officers registered under the Civil Union Act. The last category includes secular **officiants**, useful for couples who want a non-religious ceremony."
- `posts.js:199` — "Always ask to see your **officiant's** appointment certificate (Form BI-30) before the ceremony..."

Severity: **Medium**. This is not a factual error (the legal content itself is correct and CLAUDE.md says not to re-verify the underlying law), and the first instance is arguably legitimate generic vocabulary describing a category of Marriage Officer. But the second instance ("your officiant's appointment certificate") directly substitutes "officiant" where "Marriage Officer" is the house term used everywhere else in the same post, in the single highest-authority piece of legal content on the site. Recommend swapping both to "Marriage Officer" / "Marriage Officer's appointment certificate" for terminology consistency, not fact accuracy.

---

## 4. Factual cross-check: every `venueLinks` entry vs `venues.js`

Full table of every `venueLinks` entry across all 8 posts, what the surrounding prose claims, and whether `venues.js` confirms it.

| Post slug | Section | Venue slug | Post claims | venues.js confirms? |
|---|---|---|---|---|
| best-wine-estate-venues-franschhoek | Planning Tips | la-paris-estate | No numeric claim in this para; adjacent item (line 37) claims "confirmed Intimate Wedding Package for up to 50 guests... larger events available on enquiry" | Yes — matches `capacity: "Contact venue"` + descriptive note in venues.js:242-245 |
| best-seasons-cape-wedding | Summer | la-paris-estate | Descriptive only ("mature tree cover and garden structure") | No numeric claim to check; region correct |
| best-seasons-cape-wedding | Winter | lanzerac-wine-estate | "5-star hotel... foot of the Jonkershoek Mountains" | Yes — matches venues.js:322 description exactly |
| mountain-backdrop-...western-cape | Atlantic Drama | the-12-apostles-hotel | Camps Bay, between mountains and ocean | Yes — matches address "Victoria Rd, Camps Bay" |
| mountain-backdrop-...western-cape | Winelands Intimacy | zorgvliet-wines | Banhoek Valley, "Blue Ridge mountain views" | Region/valley match; "Blue Ridge" is not a phrase present in venues.js's description — **unverifiable addition**, not necessarily wrong but not sourced in the data (Medium, informational) |
| mountain-backdrop-...western-cape | Hidden Valleys | lanzerac-wine-estate | "foot of the Jonkershoek Mountains" | Yes — exact match |
| mountain-backdrop-...western-cape | Hidden Valleys | saronsberg-wine-estate | "cradled by the Obiqua and Winterhoek mountain ranges" | Yes — verbatim match to venues.js:438 |
| mountain-backdrop-...western-cape | Peninsula Views | cape-point-vineyards | Noordhoek, Chapman's Peak, Atlantic | Yes — matches venues.js:461 |
| wedding-venue-bottelary-road-stellenbosch | section 2 | eikenhof-estate | "offering an exclusive-use setting for **up to 80 guests**" (posts.js:327) | **NO — MISMATCH.** venues.js:548 sets `capacity: "Up to 180"`. **Critical factual error**, see below. |
| wedding-venue-bottelary-road-stellenbosch | section 3 | nooitgedacht-wine-estate | "capacity for up to 300 guests" | Yes — matches venues.js:127 |
| wedding-venue-prices-stellenbosch-winelands | Why Confusing | nooitgedacht-wine-estate | "quotes on enquiry... capacity runs to 300 guests" | Yes — matches (Contact Venue, 300) |
| wedding-venue-prices-stellenbosch-winelands | Under R50k | la-petite-ferme | "caps at 45 guests" | Yes — matches venues.js:478 |
| wedding-venue-prices-stellenbosch-winelands | Under R50k | elgin-vintners | "at 50" guests | Yes — matches venues.js:502 |
| wedding-venue-prices-stellenbosch-winelands | Mid-Range | eikenhof-estate | "accommodation on site, and capacity for up to 180 guests" | Yes — matches venues.js:548 exactly, AND `eikenhof-estate` is confirmed in `VENUES_WITH_ACCOMMODATION` (constants.js:153), so the "accommodation on site" claim is also correct |
| wedding-venue-prices-stellenbosch-winelands | Mid-Range | lanzerac-wine-estate | "seating up to 250" | Yes — matches venues.js:316 |
| wedding-venue-prices-stellenbosch-winelands | Premium | zorgvliet-wines | "seating up to 140" | Yes — matches venues.js:173 exactly |
| wedding-venue-prices-stellenbosch-winelands | Premium | la-paris-estate | "quotes capacity on enquiry rather than publishing a single figure" | Yes — matches the pending "Contact venue" state |
| wedding-venue-prices-stellenbosch-winelands | Luxury | babylonstoren | "seats up to 100" | Yes — matches venues.js:11 |
| wedding-venue-prices-stellenbosch-winelands | Luxury | boschendal-wine-estate | "up to 200" | Yes — matches venues.js:34 |
| wedding-venue-prices-stellenbosch-winelands | Luxury | cavalli-estate | "in the mid-range tier, seats up to 400" | Yes — matches venues.js:57-58 exactly |
| coastal-wedding-venues-cape-peninsula | Atlantic Seaboard | the-12-apostles-hotel | "Capacity is available on enquiry" | Yes — matches `Contact venue` |
| coastal-wedding-venues-cape-peninsula | Atlantic Seaboard | cape-point-vineyards | "seats up to 200 guests... mid-range tier" | Yes — matches venues.js:455-456 exactly |
| coastal-wedding-venues-cape-peninsula | Constantia Valley | the-cellars-hohenort | Descriptive only, no numeric claim | No numeric claim to check; **this venue is on CLAUDE.md's unverified-source list**, and the post's language ("one of the most photographed settings," "a level of service that matches its reputation") is unsourced promotional framing on an unverified venue — already flagged in CLAUDE.md's own blog table, confirmed present as written |
| coastal-wedding-venues-cape-peninsula | Constantia Valley | steenberg-farm | "17th-century wine estate... golf course" | Yes — matches "historic 1682 farm" + "Golf Course" feature |
| coastal-wedding-venues-cape-peninsula | Constantia Valley | groot-constantia | "oldest wine estate... established in 1685" | Yes — verbatim match to venues.js:96 |

### Critical finding 1 — Eikenhof Estate capacity contradicts itself across posts and venues.js

`wedding-venue-bottelary-road-stellenbosch` (posts.js:327) states Eikenhof offers "an exclusive-use setting for **up to 80 guests**." `venues.js:548` sets Eikenhof's capacity to `"Up to 180"`. The newer post `wedding-venue-prices-stellenbosch-winelands` (posts.js:421) correctly states Eikenhof's "capacity for up to 180 guests" for the same venue. So the site currently publishes two different capacity figures for the same venue across two live blog posts, one of which is wrong.

This is high-stakes: per the briefing's GSC snapshot, the Bottelary Road cluster is the site's **strongest-performing content** ("bottelary road venues" 98 imp, "bottelary road wedding venues" 97 imp, "wedding venue bottelary road" 64 imp, "venue hire bottelary road" 58 imp — mostly ranking this exact post), and `eikenhof-estate` itself is now drawing 137 impressions. An 80-vs-180 guest discrepancy on the page driving the most real traffic is a correction worth prioritising, and it's also a live risk for AI-citation accuracy (Gemini/Perplexity could cite either figure).

### Critical finding 2 — Nooitgedacht price tier contradicts venues.js and a newer post

`budget-friendly-winelands-venues` (posts.js:100) describes Nooitgedacht as "**A Mid-Range wine estate** with genuine Cape Dutch charm..." `venues.js:128` sets Nooitgedacht's price to `"Contact Venue"`, not Mid-Range. The later post `wedding-venue-prices-stellenbosch-winelands` (posts.js:398) gets this right: "Nooitgedacht Wine Estate near Koelenhof **quotes on enquiry** rather than advertising a package price... Its capacity runs to 300 guests." So again, two posts disagree, and the older one is wrong.

Compounding effect: `budget-friendly-winelands-venues`' own CTA (posts.js:123-127) is "Browse Mid-Range Venues" filtering `price: "Mid-Range (R50–150k)"` — a reader who clicks through expecting to find Nooitgedacht in that filtered list won't, because it's actually tagged `Contact Venue` in the live filter data. That's a direct, checkable broken-promise between blog copy and the venues filter.

### Medium finding — Elgin Vintners regional scope mismatch

`wedding-venue-prices-stellenbosch-winelands` is titled and scoped as "Wedding Venue Prices in **Stellenbosch and the Winelands**," but its "Under R50,000" section (posts.js:403-406) cites Elgin Vintners as a comparison point. `venues.js:500` places Elgin Vintners in the **Overberg** region, not Cape Winelands, and CLAUDE.md's own `REGION_CONTEXT` data (constants.js:119-124) describes the Overberg as "approximately 60–90 minutes from Cape Town, over the Hottentots Holland Mountains" — i.e., a genuinely different region from Stellenbosch. The post never flags that Elgin Vintners sits outside the Winelands proper, which is a minor but real scope/precision issue for a post positioned as a Stellenbosch/Winelands pricing guide.

---

## 5. Answer-first compliance (6 sampled venue pages, live fetch)

All 6 sampled pages confirm CLAUDE.md's answer-first pattern in both `<title>`/meta description and (per template inspection) the first body content, generated by the shared `[slug].astro` template from `venues.js` fields — so the pattern is structurally guaranteed for all 24 venues, not just these 6. Live meta-description excerpts (`curl https://capevows.co.za/venues/<slug>`):

- **babylonstoren**: `"Babylonstoren is a wine estate wedding venue in Cape Winelands, Western Cape. A magnificently restored Cape Dutch farm with a historic homestead, eight themed gardens..."`
- **eikenhof-estate**: `"Eikenhof Estate is a farm & country wedding venue in Cape Winelands, Western Cape. A privately-owned wine and olive farm nestled in the scenic Bottelary Hills..."`
- **lanzerac-wine-estate**: `"Lanzerac Wine Estate is a wine estate wedding venue in Cape Winelands, Western Cape. A stately Cape Dutch manor at the foot of the Jonkershoek Mountains..."`
- **cape-point-vineyards**: `"Cape Point Vineyards is a wine estate wedding venue in Atlantic Seaboard, Western Cape. A working vineyard on the slopes of the Cape Peninsula at Noordhoek..."`
- **elgin-vintners**: `"Elgin Vintners is a wine estate wedding venue in Overberg, Western Cape. A characterful wine estate in the cool-climate Elgin Valley..."`
- **the-cellars-hohenort**: `"The Cellars-Hohenort is a boutique hotel wedding venue in Constantia Valley, Western Cape. Two magnificently restored Cape Dutch manor houses..."`

All 6 follow "[Name] is a [type] wedding venue in [region], Western Cape…" exactly, verbatim, with no drift. This is a **clean pass** — the templated generation in `[slug].astro` makes this structurally reliable across all 24 pages, not just the sample. This also doubles as a partial answer for task item 8 (citability): each of these opening sentences is a self-contained, fully-formed factual sentence (subject + venue type + region named explicitly) that could be lifted verbatim by an AI Overview or Perplexity without needing surrounding context — strong AI-citation design.

---

## 6. Thin-content risk (6 sampled + 3 unverified-source venues)

Two measurements taken per page: (a) the editorial `description` field word count (the only genuinely unique prose on each page — confirmed via `trafilatura` boilerplate-stripped `extracted_text`, which isolated almost exactly the `description` field as "main content" and treated the feature-tag grid, FAQ accordion, and related-venues grid as boilerplate/navigation), and (b) total visible body word count from raw HTML (includes FAQ answers, address, features — everything a non-JS crawler sees).

| Venue | Verified? | Description word count | Total visible body word count |
|---|---|---|---|
| babylonstoren | Yes | 42 | 367 |
| eikenhof-estate | Yes | 51 | 437 |
| lanzerac-wine-estate | Yes | 43 | 483 |
| cape-point-vineyards | Yes | 49 | 347 |
| elgin-vintners | Yes | 46 | 214 |
| the-cellars-hohenort | **No (unverified)** | 40 | 338 |
| hawksmoor-house | **No (unverified)** | 34 | 239 |
| belmond-mount-nelson | **No (unverified)** | 44 | 258 |

Assessment: **the unverified venues do not read as noticeably thinner or more generic than the verified ones by word count alone** — all 8 descriptions sit in the same tight 34–51-word band, because every venue page uses the same fixed-length descriptive-paragraph template regardless of source depth. The difference is qualitative, not quantitative: `hawksmoor-house`'s description ("A beautiful Victorian manor house... with manicured gardens, a sparkling pool, and the sense of stepping back in time") and `belmond-mount-nelson`'s ("has defined gracious hospitality since 1899... pairs iconic architecture with impeccable service") lean on generic luxury-hospitality adjectives ("beautiful," "gracious," "impeccable," "grand") with fewer concrete, checkable specifics (no capacity figure stated in prose for either — both show `"Contact venue"` in the filter data) compared to verified pages like `eikenhof-estate` or `lanzerac-wine-estate`, which anchor on dated, sourced facts ("roots tracing back to 1692," "Bottelary Hills between Stellenbosch and Cape Town"). `the-cellars-hohenort` sits in between: concrete ("Liz McGrath hotel collection") but the blog post's promotional framing about it (see factual cross-check above) is the clearer symptom of thin sourcing, not the venue page description itself.

Against CLAUDE.md's Content Minimums table, venue pages don't map cleanly to any listed page type (closest analogues are "Location page" 500-600 words or "Product page" 300-400+ words). By the "total visible body" measure, 5 of 8 sampled pages (babylonstoren, eikenhof-estate, lanzerac-wine-estate, cape-point-vineyards, the-cellars-hohenort) clear 300 words; elgin-vintners (214), hawksmoor-house (239), and belmond-mount-nelson (258) fall short of even the lower "product page" floor, and all 8 fall short of the 500-600 "location page" floor. This is a directory-page format (not blog/service/product), so CLAUDE.md's minimums are a loose proxy at best — flagging as informational context, not a rule violation, since Google's own guidance (quoted in this skill's brief) says word count isn't a direct ranking factor. The FAQ accordion (5 auto-generated Q&As per page) is doing real work padding topical coverage; it's templated and derived, not hand-written, but it is genuinely relevant Q&A content, not filler.

---

## 7. Internal linking depth (all 8 posts, outbound + inbound)

Outbound counts include both `sections[].venueLinks` (which power `linkifyVenues()` inline text links and also drive Related Reading) and `sections[].items[].slug` (which render a separate "View venue →" button but do **not** feed Related Reading — see code citation below).

| Post | Distinct venues linked (venueLinks) | Distinct venues linked (items[].slug) | CTA target |
|---|---|---|---|
| best-wine-estate-venues-franschhoek | 1 (la-paris-estate) | 5 (Boschendal, La Paris, La Roche, Mont Rochelle, Vrede en Lust) | /venues?region=Cape Winelands |
| budget-friendly-winelands-venues | **0** | 3 (Nooitgedacht, Eikenhof, Lanzerac) | /venues?price=Mid-Range |
| best-seasons-cape-wedding | 2 (La Paris, Lanzerac) | 0 | /venues |
| marriage-officer-guide-cape-weddings | 0 (by design — legal content only) | 0 | /venues |
| mountain-backdrop-...western-cape | 5 (12 Apostles, Zorgvliet, Lanzerac, Saronsberg, Cape Point Vineyards) | 0 | /venues |
| wedding-venue-bottelary-road-stellenbosch | 2 (Eikenhof, Nooitgedacht) | 0 | direct link to /venues/eikenhof-estate + /venues?region=Cape Winelands |
| wedding-venue-prices-stellenbosch-winelands | 10 (Nooitgedacht, La Petite Ferme, Elgin Vintners, Eikenhof, Lanzerac, Zorgvliet, La Paris, Babylonstoren, Boschendal, Cavalli) | 0 | /venues?price=Mid-Range |
| coastal-wedding-venues-cape-peninsula | 5 (12 Apostles, Cape Point Vineyards, Cellars-Hohenort, Steenberg Farm, Groot Constantia) | 0 | /venues?region=Atlantic Seaboard |

**High finding — `budget-friendly-winelands-venues` has zero Related Reading inbound presence despite naming 3 venues.** Related Reading is generated in `astro-build/src/pages/venues/[slug].astro:37-41` via `POSTS.filter((post) => post.sections.some((sec) => sec.venueLinks?.some((link) => link.slug === venue.slug)))` — it only reads `sections[].venueLinks`, never `items[].slug`. Because `budget-friendly-winelands-venues` uses only `items[].slug` (no `venueLinks` array anywhere in the post object), it will **never** appear in the Related Reading block on the Nooitgedacht, Eikenhof, or Lanzerac venue pages, even though it's substantively about all three. This is a real, fixable internal-linking gap — adding a `venueLinks` array mirroring the existing `items` would close it with no new data field, consistent with CLAUDE.md's own stated pattern for Related Reading.

**Inbound Related Reading coverage, computed from the same filter logic:**

16 of 24 venues currently have at least one post pointing to them via `venueLinks` (la-paris-estate: 3 posts; lanzerac-wine-estate: 3 posts; zorgvliet-wines, the-12-apostles-hotel, cape-point-vineyards, eikenhof-estate, nooitgedacht-wine-estate: 2 posts each; saronsberg-wine-estate, la-petite-ferme, elgin-vintners, babylonstoren, boschendal-wine-estate, cavalli-estate, the-cellars-hohenort, steenberg-farm, groot-constantia: 1 post each). **8 of 24 venues have zero inbound Related Reading**: `la-roche-estate`, `mont-rochelle`, `vrede-en-lust`, `hawksmoor-house`, `holden-manz`, `la-cotte-farm`, `belmond-mount-nelson`, `lourensford-wine-estate`.

**High finding — CLAUDE.md's own Related Reading note is now stale.** CLAUDE.md states "Renders nothing if there are no matches (currently true for 16 of 24 venues)." Based on the current 8-post `posts.js` (which already includes the 3 newest posts per CLAUDE.md's own blog table), the real number is the **inverse**: only 8 of 24 render nothing, 16 of 24 now have matches. This note was evidently written before posts 6-8 were added and never updated. Worth a one-line fix in CLAUDE.md so future sessions don't cite a stale figure. Flagging here since it directly affects how any future audit interprets internal-linking coverage.

Notable overlap with the GSC snapshot: `la-roche-estate` has 4 impressions (per the briefing's GSC data) but zero Related Reading inbound links — a live, checkable venue with search visibility that isn't being reinforced by any blog content. `lourensford-wine-estate` (Luxury tier, Cape Winelands) also has zero inbound coverage, notable given CLAUDE.md's own flagged data gap that Premium/Luxury venues are Winelands-only and scarce, making this a venue worth linking from the existing `wedding-venue-prices-stellenbosch-winelands` Luxury section.

---

## 10. Marriage Act / Civil Union Act citation check

Confirmed present and correctly phrased in `marriage-officer-guide-cape-weddings`. Per the task instructions, the underlying legal facts are not re-verified here (already verified per CLAUDE.md); only the citation's presence and phrasing is confirmed.

> `posts.js:193` — "...ensuring your marriage is legally valid in South Africa requires specific steps. Missing any of them can cause real problems later. Here's what you need, based on **the Marriage Act 25 of 1961 and the Civil Union Act 17 of 2006**."

Both Acts are named with their correct year and number, in the `intro` field, framed as the sourcing basis for the whole post. No other explicit Act citation appears later in the post body (later sections reference "Form BI-30," "Form BI-31," "Form BI-130," DHA, and DIRCO by name, which is consistent supporting detail, not a re-citation of the Acts). This is a clean pass.

---

## Items not completed (disclosed, not silently dropped)

- **Item 8 (passage-level AI-citability for "wedding venues stellenbosch," "bottelary road wedding venues," "wedding venue stellenbosch prices"):** not run as a dedicated pass. Partial signal only from item 5's answer-first confirmation (the opening sentence template is self-contained and citation-ready by design). A follow-up pass should identify the single best-candidate paragraph on `/blog/wedding-venue-bottelary-road-stellenbosch` and `/blog/wedding-venue-prices-stellenbosch-winelands` specifically, since those are the two pages actually ranking for the top query cluster per the GSC snapshot.
- **Item 9 (readability/voice spot-check across 2-3 posts):** not run. Worth noting as an open item since brand voice drift ("warm, locally proud, romantic but practical, never generic wedding-industry fluff") is easy to spot-check quickly in a follow-up pass — `wedding-venue-prices-stellenbosch-winelands` and `coastal-wedding-venues-cape-peninsula` (both newest, September 2026) would be the highest-value posts to check first since they're the least battle-tested.
