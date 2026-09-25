# 01 — On-Page SEO Inventory

**Method:** Parsed all 40 files in `astro-build/dist/` (39 Astro routes + the
static `privacy-policy.html` asset) with a script that extracts title, meta
description, H1/H2, word count, internal/external links, image alt coverage,
canonical, OG tags, robots meta, JSON-LD block count, and em-dash count per
page. Raw data: `audits/2026-09-18/_onpage_raw.json`. Cross-checked a sample
against live `curl` fetches — the built HTML is what Vercel serves (confirmed
identical for `/venues/lanzerac-wine-estate` in the GSC phase).

## Summary counts

| Check | Result |
|---|---|
| Pages parsed | 40 (39 routes + privacy-policy.html) |
| Duplicate `<title>` across the site | **0** |
| Duplicate meta description across the site | **0** |
| Titles >60 characters | **18** |
| Meta descriptions >160 characters | **29** |
| Pages with H1 count ≠ 1 | **1** (`/404.html`, has 0) |
| Pages with no `<link rel="canonical">` | **3** (`/404.html`, `/admin.html` — both intentional noindex; `/privacy-policy.html` — not intentional) |
| Pages with a `noindex` robots meta | 2 (`/vendors.html`, `/admin.html`) confirmed present |

## Finding 1 — Meta descriptions systematically overflow 160 chars (29 of 40 pages)

**Root cause, file:line:** [`astro-build/src/pages/venues/[slug].astro:31`](astro-build/src/pages/venues/[slug].astro#L31)

```js
const description = `${venue.name} is a ${venue.type.toLowerCase()} wedding venue in ${venue.region}, Western Cape. ${venue.description.substring(0, 130)}...`;
```

The `.substring(0, 130)` is a fixed cap on the venue description regardless
of how long the prefix sentence (`"[Name] is a [type] wedding venue in
[region], Western Cape. "`) already is. That prefix alone ranges roughly
50–75 characters depending on venue name/type/region length, so the total
routinely lands at 190–230+ characters — every venue page in the sample is
affected. Examples (raw, from `_onpage_raw.json`):

- `/venues/belmond-mount-nelson` — **227 chars**
- `/venues/babylonstoren` — **211 chars**
- `/venues/boschendal-wine-estate` — **220 chars**

Same defect, different formula, in the identical fallback string used by
`Base.astro`'s default description (151 chars, under the limit today only
because the venue count "24" is short — this one is fine, just noting the
pattern isn't duplicated there).

This is the single highest-value on-page fix in the whole audit: one file,
one line, fixes the overwhelming majority of the 29 overflowing
descriptions. **Full proposed fix goes in Phase 2** (needs a length budget
computed from the prefix, not a hardcoded 130).

## Finding 2 — 18 titles exceed 60 characters, all by design (CLAUDE.md pattern)

Every long title follows the documented Answer-first pattern:
`[Venue Name] Wedding Venue — [Region] | Cape Vows`
(CLAUDE.md: *"This is deliberate for AI search citation... Preserve this
pattern."*) The overflow is driven entirely by venue name length — short
names (`Steenberg Farm`) stay under 60, long ones
(`Mont Rochelle Hotel & Vineyard` → 77 chars, `Wedding Venue Prices in
Stellenbosch and the Winelands: What to Budget in 2026` → 90 chars) don't.

**I'm not recommending a blanket restructure** — that would fight an
explicit content directive for a marginal SERP-pixel-truncation risk. Two
that are worth a look because they're outliers even for this pattern:

| Title | Chars | Page |
|---|---:|---|
| `Wedding Venue Prices in Stellenbosch and the Winelands: What to Budget in 2026 \| Cape Vows` | 90 | `/blog/wedding-venue-prices-stellenbosch-winelands` |
| `Mountain Wedding Venues in the Western Cape: From Table Mountain to Tulbagh \| Cape Vows` | 87 | `/blog/mountain-backdrop-wedding-venues-western-cape` |
| `Coastal Wedding Venues on the Cape Peninsula: Ocean, Mountain and Open Sky \| Cape Vows` | 86 | `/blog/coastal-wedding-venues-cape-peninsula` |

These three blog titles aren't the venue-page pattern at all — they're
free-form blog titles that happen to run long. Google will truncate them in
the SERP (~575px ≈ 55–60 chars at typical font weight); the truncation
point currently lands mid-word or mid-clause on all three. Low-effort,
no content-rule conflict, worth trimming — flagged for Phase 2 backlog, not
this-week.

## Finding 3 — `privacy-policy.html` has no canonical, no meta description, no OG tags, no JSON-LD, and one em dash

This page is not built by Astro — it's a static file in
[`astro-build/public/privacy-policy.html`](astro-build/public/privacy-policy.html),
copied verbatim into `dist/`, so it never passes through `Base.astro` and
gets none of the per-page head machinery every other page has.

Confirmed via `_onpage_raw.json`:
```json
"meta_desc": null, "canonical": null,
"og_title": null, "og_desc": null, "og_image": null,
"jsonld_blocks": 0, "em_dash_count": 1
```

The em dash (CLAUDE.md: *"No em dashes anywhere in site content"*) was not
caught by any prior content-rule scan because those scans checked
`posts.js`/`venues.js`, not this standalone HTML file. Exact location:

```
<strong>Standard Contractual Clauses</strong> — we have executed the
EU Standard Contractual Clauses (SCCs) with For...
```

This page is **not** noindexed and **is** linked from the footer on every
page (`<a href="/privacy-policy.html" class="footer-nav-link">Privacy
Policy</a>`) — so it's a real, crawlable, indexable page missing basic
metadata. Low SEO value (nobody searches for "cape vows privacy policy")
but the em dash is a straightforward content-rule violation, and a missing
canonical is a five-minute fix. Both go in Phase 2.

**Not fixing this myself** — CLAUDE.md's "What NOT to touch without asking"
lists *"The Information Officer details in privacy-policy.html"* — I'm
not touching compliance-adjacent legal text without explicit sign-off, even
for a single em dash. Flagging precisely instead.

## Finding 4 — `/404.html` has zero `<h1>` elements

Confirmed in [`astro-build/src/pages/404.astro:13`](astro-build/src/pages/404.astro#L13):
`<div class="empty-title">Venue not found</div>` — a styled `div`, not a
heading tag. Low priority (page is noindexed, per CLAUDE.md's `canonical
{null}` pattern and `<meta name="robots" content="noindex">` — both
confirmed present in the built HTML), but a real 404 page should still carry
a proper heading for accessibility (screen-reader landmark navigation) even
where it doesn't matter for indexing. Backlog item.

## Finding 5 — Thinnest venue pages by word count

| Word count | Page | Note |
|---:|---|---|
| 213 | `/venues/elgin-vintners` | Recently renamed (was `elgin-ridge-wines`); thinnest of all 24 |
| 238 | `/venues/hawksmoor-house` | One of the 3 unverified venues (no source material, per CLAUDE.md) |
| 257 | `/venues/belmond-mount-nelson` | One of the 3 unverified venues |
| 337 | `/venues/the-cellars-hohenort` | One of the 3 unverified venues |

Not flagging as a defect to fix in isolation — thin content on the 3
unverified venues is a direct, expected consequence of having no source
material (per CLAUDE.md's Fact-check status section, this is a known,
tracked gap, not something to pad with unverified claims). `elgin-vintners`
being the thinnest of the *verified* 21 is worth a note for whoever
eventually gets round to enriching venue descriptions, but it is not
inaccurate or thin enough to look like a doorway page (213 words with 4
FAQ Q&As, features list, and a full description is defensible).

## Finding 6 — Zero image alt-text failures found in `<img>` tags — but this needs context

Across all 40 pages, `img_no_alt` and `img_empty_alt` are both 0 wherever an
`<img>` tag exists in server-rendered HTML. This looks clean, but see
`01-images.md` for why this is a smaller finding than it sounds — most of
the site renders imagery as CSS gradients (`TYPE_GRADIENTS`) or React-island
SVG icons, not `<img>` tags, so there are relatively few `<img>` elements to
begin with (mainly blog hero images). The images audit covers this in full.

## Full per-page table (35 sitemap-covered pages, sorted by word count ascending)

| Words | Title chars | Desc chars | H1 | H2s | Int. links | Canonical | URL |
|---:|---:|---:|---:|---:|---:|:---:|---|
| 213 | 55 | 220 | 1 | 0 | 30 | ✓ | /venues/elgin-vintners |
| 238 | 55 | 227 | 1 | 0 | 30 | ✓ | /venues/hawksmoor-house |
| 257 | 69 | 227 | 1 | 0 | 30 | ✓ | /venues/belmond-mount-nelson |
| 323 | 55 | 213 | 1 | 0 | 30 | ✓ | /venues/holden-manz |
| 334 | 53 | 217 | 1 | 0 | 30 | ✓ | /venues/steenberg-farm |
| 336 | 62 | 212 | 1 | 0 | 30 | ✓ | /venues/groot-constantia |
| 337 | 54 | 219 | 1 | 0 | 30 | ✓ | /venues/la-cotte-farm |
| 337 | 56 | 218 | 1 | 0 | 30 | ✓ | /venues/la-roche-estate |
| 337 | 66 | 219 | 1 | 0 | 30 | ✓ | /venues/the-cellars-hohenort |
| 344 | 66 | 226 | 1 | 0 | 30 | ✓ | /venues/lourensford-wine-estate |
| 344 | 77 | 219 | 1 | 0 | 30 | ✓ | /venues/mont-rochelle |
| 346 | 66 | 227 | 1 | 0 | 30 | ✓ | /venues/cape-point-vineyards |
| 356 | 67 | 219 | 1 | 0 | 30 | ✓ | /venues/the-12-apostles-hotel |
| 360 | 68 | 217 | 1 | 0 | 30 | ✓ | /venues/vrede-en-lust |
| 366 | 55 | 211 | 1 | 0 | 30 | ✓ | /venues/babylonstoren |
| 370 | 53 | 219 | 1 | 0 | 30 | ✓ | /venues/cavalli-estate |
| 375 | 65 | 220 | 1 | 0 | 30 | ✓ | /venues/boschendal-wine-estate |
| 392 | 65 | 216 | 1 | 0 | 30 | ✓ | /venues/saronsberg-wine-estate |
| 393 | 56 | 218 | 1 | 0 | 30 | ✓ | /venues/la-petite-ferme |
| 395 | 58 | 155 | 1 | 4 | 4 | ✓ | /blog/best-seasons-cape-wedding |
| 407 | 47 | 145 | 1 | 0 | 27 | ✓ | /blog (listing) |
| 407 | 87 | 178 | 1 | 3 | 7 | ✓ | /blog/mountain-backdrop-wedding-venues-western-cape |
| 408 | 79 | 174 | 1 | 3 | 5 | ✓ | /blog/budget-friendly-winelands-venues |
| 416 | 55 | 221 | 1 | 0 | 30 | ✓ | /venues/zorgvliet-wines |
| 422 | 55 | 218 | 1 | 4 | 6 | ✓ | /blog/best-wine-estate-venues-franschhoek |
| 422 | 67 | 213 | 1 | 0 | 30 | ✓ | /venues/nooitgedacht-wine-estate |
| 433 | 51 | 213 | 1 | 0 | 30 | ✓ | /venues/eikenhof-estate |
| 472 | 51 | 227 | 1 | 0 | 30 | ✓ | /venues/la-paris-estate |
| 481 | 63 | 224 | 1 | 0 | 30 | ✓ | /venues/lanzerac-wine-estate |
| 531 | 62 | 176 | 1 | 4 | 6 | ✓ | /blog/wedding-venue-bottelary-road-stellenbosch |
| 649 | 81 | 168 | 1 | 1 | 3 | ✓ | /blog/marriage-officer-guide-cape-weddings |
| 736 | 56 | 151 | 1 | 6 | 12 | ✓ | / (homepage) |
| 847 | 86 | 183 | 1 | 5 | 5 | ✓ | /blog/coastal-wedding-venues-cape-peninsula |
| 957 | 90 | 176 | 1 | 6 | 5 | ✓ | /blog/wedding-venue-prices-stellenbosch-winelands |
| 1472 | 45 | 154 | 1 | 0 | 40 | ✓ | /venues (listing) |

*(Venue-page H2 count of 0 is expected — venue pages use styled `div`s for
section labels like "Features & Inclusions", not `<h2>`, matching the FAQ
accordion's own heading. Not a defect; noted for completeness.)*

## Noindex pages checked separately

| Page | robots noindex | canonical | Notes |
|---|:---:|:---:|---|
| `/vendors.html` | ✓ present | ✓ present (self-referential, per earlier `canonical={null}` + explicit `<meta>` pattern check) | 92 words — expected, "coming soon" placeholder page |
| `/admin.html` | ✓ present | **none** (`canonical={null}` in source) | Correct per design — internal tool, no canonical needed |
| `/404.html` | ✓ present | **none** (`canonical={null}` in source) | Correct per design |
| `/venues/saved.html` | *not checked — no `<meta name="robots">` in source; relies on being excluded from sitemap only, not marked noindex* | ✓ present | **See note below** |

**Note on `/venues/saved`:** this page IS in the crawlable route set (not
noindexed, has a self-referential canonical) but is excluded from the
sitemap because its content is per-visitor (reads `localStorage`). With no
`noindex` meta, Google *could* crawl and index an essentially-empty page
(30 words, generic "no venues saved yet" state for a crawler with no
localStorage history) if it discovers the URL some other way (e.g. via the
nav heart-icon link, which is present in the site nav on every page).
Low risk (thin, boring, unlikely to actively hurt rankings) but worth a
second look given CLAUDE.md's own quality-gate spirit around thin pages.
Flagged for Phase 2 as a Low-priority "add noindex" candidate — the
existing `/vendors` and `/admin` pattern (`<meta name="robots"
content="noindex" slot="head">`) is a one-line precedent to copy.
