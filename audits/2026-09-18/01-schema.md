# Cape Vows — JSON-LD Schema Audit
2026-09-18

Scope: live site `https://capevows.co.za` (raw curl, no JS), cross-referenced against `astro-build/src/layouts/Base.astro`, `astro-build/src/pages/venues/[slug].astro`, `astro-build/src/pages/blog/[slug].astro`, `astro-build/src/data/venues.js`, `astro-build/src/data/posts.js`.

Pages fetched (raw HTML, curl, no JS execution):
- `https://capevows.co.za/` → 200
- `https://capevows.co.za/venues/lanzerac-wine-estate` → 200
- `https://capevows.co.za/blog/wedding-venue-bottelary-road-stellenbosch` → 200

All three were parsed with `JSON.parse()` per block. Every block on every page is **syntactically valid JSON** — no `JSON.stringify` bug found on any of the three page types checked.

---

## 1. Detection results — what ships today

| Page type | JSON-LD blocks present | `<script>` count |
|---|---|---|
| Homepage `/` | `WebSite` (with `Organization` nested as `publisher`) | 1 |
| Venue page `/venues/lanzerac-wine-estate` | `WebSite` (global, inherited from layout) + a JSON **array** of `[EventVenue, FAQPage, BreadcrumbList]` | 2 |
| Blog post `/blog/wedding-venue-bottelary-road-stellenbosch` | `WebSite` (global) + `BlogPosting` | 2 |

Source of each block:
- `WebSite`: `astro-build/src/layouts/Base.astro:75-89` — injected into every page via the shared layout (confirmed present verbatim on all three fetched URLs).
- `EventVenue` / `FAQPage` / `BreadcrumbList`: `astro-build/src/pages/venues/[slug].astro:47-95`, built with `JSON.stringify([...])` at line 47 and injected at line 99.
- `BlogPosting`: `astro-build/src/pages/blog/[slug].astro:67-81`, built with `JSON.stringify({...})` and injected at line 85.

No Microdata or RDFa detected on any of the three pages — JSON-LD only, as CLAUDE.md states.

---

## 2. Critical finding: CLAUDE.md's "Global schema" description is stale / describes legacy App.jsx, not the live Astro site

CLAUDE.md's "Schema markup" section states:

> **Global** (id: `global-jsonld`, App mount): `Organization` (description now uses dynamic `${VENUES.length}`) · `WebSite`

This does **not** match what `astro-build/src/layouts/Base.astro` actually ships. Live/built reality:

- There is **no standalone `Organization` JSON-LD node** anywhere on the site. `Organization` only appears **nested inside `WebSite.publisher`** (`Base.astro:83-87`), with just `name` and `url` — no `@id`, no `logo`, no `sameAs`, no `description`.
- The `id: "global-jsonld"` DOM id CLAUDE.md references does not exist in `Base.astro` at all (`grep -n 'global-jsonld' astro-build/src/` returns nothing) — that id, and the standalone `Organization` block, belong to the legacy `src/App.jsx` SPA, which CLAUDE.md itself says is "no longer deployed."
- The `${VENUES.length}` dynamic-description claim is also false for the live JSON-LD: the `WebSite.description` string is **hardcoded** to `24 hand-verified venues` (`Base.astro:81`), not derived from `VENUES.length`. `VENUES.length` dynamism applies to on-page copy (hero, `/venues` heading) per CLAUDE.md's own "Venue count" section, not to this JSON-LD field.

**Severity: Info** (no user-facing defect, but this is a documentation/architecture drift that will mislead the next session working from CLAUDE.md alone — worth a CLAUDE.md correction).

Homepage `WebSite` block as actually served:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Cape Vows",
  "url": "https://capevows.co.za",
  "description": "The Western Cape wedding venue and vendor directory — 24 hand-verified venues across Franschhoek, Stellenbosch, Cape Town, Constantia and the Overberg.",
  "inLanguage": "en-ZA",
  "publisher": {
    "@type": "Organization",
    "name": "Cape Vows",
    "url": "https://capevows.co.za"
  }
}
```

---

## 3. `EventVenue` validation (venue pages)

Rendered block for `/venues/lanzerac-wine-estate` (from `astro-build/src/pages/venues/[slug].astro:47-61`):

```json
{
  "@context": "https://schema.org",
  "@type": "EventVenue",
  "name": "Lanzerac Wine Estate",
  "description": "A stately Cape Dutch manor at the foot of the Jonkershoek Mountains in Stellenbosch, with roots tracing back to 1692. The 5-star hotel and wine estate offers multiple event spaces, manicured gardens, and all the grandeur of Cape Winelands heritage.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1 Lanzerac Rd, Stellenbosch",
    "addressRegion": "Western Cape",
    "addressCountry": "ZA"
  },
  "telephone": "021 887 1132",
  "url": "https://lanzerac.co.za/weddings/"
}
```

**Present:** `name` ✅, `description` ✅, `address` as a proper `PostalAddress` type ✅, `telephone` ✅, `url` ✅ (points to the venue's own site, not Cape Vows — correct for `EventVenue`).

**Missing (confirmed against both rendered JSON and source data):**

- **`addressLocality`** — absent. `streetAddress` conflates the street and town into one string (`"1 Lanzerac Rd, Stellenbosch"`) instead of splitting `Stellenbosch` out into its own `addressLocality` field, which is the schema.org-recommended structure for `PostalAddress` and improves Google/AI parsing of "where is this."
- **`postalCode`** — absent. Confirmed at the data level: `grep -n "postalCode\|postcode\|zip" astro-build/src/data/venues.js` returns zero hits — the `venues.js` object shape (`id, slug, name, region, type, capacity, price, address, phone, website, description, features[], highlight`) has no postal code field to even source from.
- **`geo` (GeoCoordinates: `latitude`/`longitude`)** — absent, same story: no lat/long field exists anywhere in `venues.js` (`grep -n "latitude\|longitude\|geo"` → zero hits). This is the highest-value gap of the three: `geo` is what would let Google/Maps and AI assistants place the venue on a map and answer "venues near X" queries with precision, and `EventVenue` (a `Place` subtype) explicitly supports it.

Severity: **Moderate** (recommended-not-required properties; doesn't break existing rich results but limits map/local-intent surfaces and AI geo-grounding). Same gap applies to all 24 venue pages, not just Lanzerac, since the shape is uniform.

**Proposed enrichment** (illustrative, using Lanzerac's real address parts — would need per-venue `postalCode`/`geo` sourcing before landing, not fabricated placeholders):

```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "1 Lanzerac Rd",
  "addressLocality": "Stellenbosch",
  "addressRegion": "Western Cape",
  "postalCode": "7599",
  "addressCountry": "ZA"
}
```
Adding `geo` would require sourcing real coordinates per venue (not present in `_local/venue-details/` fact-check material per CLAUDE.md — this is new data collection, not a copy-edit).

---

## 4. `telephone` format

`venues.js` stores phone as local South African strings, e.g. `phone: "021 887 1132"` (`astro-build/src/data/venues.js:319`, Lanzerac), and this is emitted verbatim into `EventVenue.telephone`. Sampled across the file (`grep -n "phone:"` → 24 rows), all follow the same local pattern: `"021 863 3852"`, `"071 761 1354"`, `"064 782 9864"`, etc. — spaces as separators, no `+27` country code, no E.164.

Schema.org's `telephone` property accepts free text, so this is not strictly invalid, but Google's structured data guidance and most `LocalBusiness`/`Place`-adjacent validators recommend full international format for unambiguous machine parsing (e.g. `+27218871132` or `+27 21 887 1132`). Since `telHref` in `venues/[slug].astro:45` already does `'tel:' + venue.phone.split(' ').join('')` (producing `tel:0218871132` — a **local-only** `tel:` link, not internationally dialable either), this is a two-for-one fix opportunity: normalizing `phone` to E.164 in `venues.js` would fix both the `tel:` link and the JSON-LD telephone property at once, without adding a new field.

Severity: **Minor**.

---

## 5. `BlogPosting` validation (blog posts)

Rendered block for `/blog/wedding-venue-bottelary-road-stellenbosch` (from `astro-build/src/pages/blog/[slug].astro:67-81`):

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Wedding Venues Near Bottelary Road, Stellenbosch",
  "description": "Eikenhof Estate is a boutique wine and olive farm wedding venue on Fischers Road in the Bottelary Hills, Stellenbosch. Here's what makes the area special.",
  "image": "https://images.unsplash.com/photo-1706700700231-91a762a35531?auto=format&fit=crop&w=1400&q=80",
  "datePublished": "July 2026",
  "url": "https://capevows.co.za/blog/wedding-venue-bottelary-road-stellenbosch",
  "mainEntityOfPage": "https://capevows.co.za/blog/wedding-venue-bottelary-road-stellenbosch",
  "publisher": {
    "@type": "Organization",
    "name": "Cape Vows",
    "url": "https://capevows.co.za"
  }
}
```

**Present:** `headline`, `description`, `image`, `datePublished`, `url`, `mainEntityOfPage`, `publisher` (as `Organization`).

**Confirmed defects/gaps:**

- **`datePublished` is not ISO 8601.** It's emitted directly from `post.date` (`blog/[slug].astro:73`), and `astro-build/src/data/posts.js` stores that field as a bare month-string: `date: "May 2026"` (posts.js:9, 75, 134, 184, 251), `date: "July 2026"` (posts.js:306, the Bottelary Road post confirmed live), `date: "September 2026"` (posts.js:379, 468). Schema.org's `datePublished` expects ISO 8601 (`2026-07-01` or similar) — Google's rich-result validator and most structured-data parsers will either reject this value or fail to parse it as a date at all, silently dropping the property's value for date-sensitive display/freshness signals. This is a genuine defect, not a style nit: `"July 2026"` is not a valid `xsd:date`/`xsd:dateTime` token.
- **`dateModified` is absent entirely.** No `dateModified` field is emitted for any blog post, and `posts.js` has no field to source one from (only a single `date`). This matters for AI/GEO citation freshness signals (LLMs weight recency) and for any future Article rich-result eligibility.
- **`author` is absent entirely.** There is no `Person` or `Organization` author entity on `BlogPosting` — only `publisher` (the site `Organization`). `grep -n "author"` on the file returns nothing.

**E-E-A-T recommendation:** Yes, adding an `author` `Person` entity for Chadley Bissolati (the named owner-operator per CLAUDE.md) would help — Google's E-E-A-T guidance and most AI citation pipelines weight a named, consistent author across content. Minimal viable addition, without inventing unverifiable claims:

```json
"author": {
  "@type": "Person",
  "name": "Chadley Bissolati",
  "url": "https://capevows.co.za"
}
```
This requires no new field in `posts.js` (name is a constant, not per-post data) — it could be added as a static object literal directly in `blog/[slug].astro`'s `jsonLd` construction. Do not add `sameAs`, `jobTitle`, or biographical claims not already verified/published elsewhere on the site (no author bio page currently exists per the routes CLAUDE.md documents) — adding unverifiable Person claims would itself be a content-policy risk (no fabrication).

**Proposed `dateModified`/`datePublished` fix** (requires a `posts.js` data-shape change, flagged here for the action plan, not applied): convert `date: "July 2026"` to an ISO field (e.g. `date: "2026-07-01"` or a separate `dateISO` field) while keeping a human-readable display string for the on-page byline if the current display relies on the month-year format — check where `post.date` is rendered in the blog list/post template before changing its type, since it may be dual-purposed for display copy today.

Severity: **Moderate** (`datePublished` format is a genuine spec violation likely to be silently dropped by parsers; `author`/`dateModified` are recommended-not-required, E-E-A-T-relevant additions).

---

## 6. `@id` consistency

**No `@id` field is used anywhere** in any of the three JSON-LD blocks checked (`WebSite`, `EventVenue`, `FAQPage`, `BreadcrumbList`, `BlogPosting`) — confirmed by inspecting every rendered block above; none contains an `@id` key.

Consequences:
- `WebSite` and the nested `Organization` (`publisher`) have no `@id`, so there's no way for Google/AI knowledge-graph tooling to definitively merge "Cape Vows the WebSite" and "Cape Vows the Organization" as the same entity across pages, or to cross-reference the `BlogPosting.publisher` (also an inline, `@id`-less `Organization`) back to the same node. Each page currently emits its own fresh, disconnected `Organization` literal.
- Standard practice for a small site like this is a single canonical `@id` for the `Organization` (e.g. `https://capevows.co.za/#organization`) and `WebSite` (e.g. `https://capevows.co.za/#website`), with `WebSite.publisher` referencing the `Organization` via `{"@id": "https://capevows.co.za/#organization"}` instead of repeating the literal object, and `BlogPosting.publisher` doing the same. This is a structural improvement, not required for validity — Google does not currently penalize the id-less version, but it's the correct target state if a standalone `Organization` block is added (see §7).

Severity: **Info / enhancement**, not a defect.

---

## 7. Proposed Organization/LocalBusiness enrichment (homepage)

Currently the homepage has no dedicated `Organization` block, no `logo`, and no `sameAs`. Confirmed via source: `grep -rn "sameAs" astro-build/src/` → zero hits; `grep -rin "pinterest\|instagram" astro-build/src/` → zero hits anywhere in the Astro source, including `Base.astro`'s footer (which lists only Venues/Vendors/Blog/Privacy Policy/Contact — no social links at all, not even as plain `<a>` tags). CLAUDE.md's Social Media section documents live Pinterest (`https://za.pinterest.com/0t84vkqdc2vm2cbzbuh7w1cjgtd0p3/`) and Instagram (`https://www.instagram.com/capevows/`) accounts, so this is a real, actionable gap, not a hypothetical.

**Important distinction to flag per the task brief:** Cape Vows is a directory, not a physical venue — it should **not** get a `PostalAddress`/`LocalBusiness` treatment implying a bookable physical premises. The correct type is plain `Organization` (or `WebSite.publisher`, upgraded to a full standalone node), with no `address` property at all. Do not add a fabricated business address.

Recommended standalone `Organization` block to add to `Base.astro` (replacing the current inline `publisher` literal with an `@id` reference to this node, per §6):

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://capevows.co.za/#organization",
  "name": "Cape Vows",
  "url": "https://capevows.co.za",
  "logo": "https://capevows.co.za/og-image.jpg",
  "description": "The Western Cape wedding venue and vendor directory.",
  "sameAs": [
    "https://za.pinterest.com/0t84vkqdc2vm2cbzbuh7w1cjgtd0p3/",
    "https://www.instagram.com/capevows/"
  ]
}
```

Notes:
- `logo` currently has no dedicated logo asset confirmed in `astro-build/public/` beyond `og-image.jpg` (1200x630 OG image, not a square logo) — using it as a stand-in `logo` value is a compromise; a proper square/transparent logo asset would be better if one exists or can be produced.
- Do **not** add `telephone` for the Organization (Cape Vows has no public phone number per any file reviewed) or a fabricated `address`.
- This is additive and independent of the `WebSite` block — both can coexist with `WebSite.publisher` pointing at the `Organization`'s `@id`.

Severity: **Moderate opportunity** (currently zero `sameAs` signal tying the site to its own social profiles — a straightforward, low-risk win for entity consolidation in Google's Knowledge Graph and AI citation).

---

## 8. Em dash confirmation (Base.astro WebSite JSON-LD description)

Confirmed exactly as flagged in the briefing. `astro-build/src/layouts/Base.astro:81`:

```
"description": "The Western Cape wedding venue and vendor directory — 24 hand-verified venues across Franschhoek, Stellenbosch, Cape Town, Constantia and the Overberg.",
```

Byte-level confirmation (`xxd` on line 81) shows the character between "directory" and "24" is `e2 80 94` = **U+2014 EM DASH** (not an en dash or hyphen substitute) — a direct violation of CLAUDE.md's "No em dashes anywhere in site content" rule. This is the only em dash inside a JSON-LD block found in the three pages/files audited here.

**Additional em dash found (outside JSON-LD, but in the same file family, worth flagging alongside):** `astro-build/src/pages/venues/[slug].astro:30`:

```js
const title = `${venue.name} Wedding Venue — ${venue.region} | Cape Vows`;
```
Byte-confirmed as the same U+2014 em dash. This string feeds `<title>`, `og:title`, and `twitter:title` on all 24 venue pages (not JSON-LD, so outside this audit's primary JSON-LD scope, but it is rendered site content and is a second, previously-undetected instance of the "only em dash we've found site-wide" claim in the briefing being incomplete). Note CLAUDE.md's own SEO section documents this exact title pattern using an em dash in its prose example ("`[Venue Name] Wedding Venue — [Region] | Cape Vows`"), so this may be an intentional documented pattern rather than an oversight — flagging for the orchestrator to reconcile against the no-em-dash content rule, not silently resolving it myself since venue descriptions/title patterns are explicitly in the "what not to touch without asking" list.

Severity: **Minor** (single-field policy violation, confirmed) + **Info** (second instance for awareness/reconciliation).

---

## 9. FAQPage — informational note only

`FAQPage` JSON-LD is present and valid on venue pages (`venues/[slug].astro:62-70`). Per the standing quality-gate rule already in scope: Google retired FAQ rich results for all sites in May 2026. This is **not** a defect. No removal is recommended — the markup retains GEO/AI-citation value (LLM extraction of Q&A pairs). No new `FAQPage` markup is recommended anywhere for Google SERP benefit. No action needed here beyond this note.

---

## 10. Structural note: array-of-nodes vs `@graph`

The venue-page JSON-LD is emitted as a bare JSON **array** of three objects, each carrying its own repeated `"@context": "https://schema.org"` (`venues/[slug].astro:47-95`), rather than a single object with `"@context"` once at the top and a `"@graph": [...]` wrapper. Both forms are valid JSON-LD 1.1 and both are accepted by Google's Rich Results Test, so this is **not a validity defect** — noting it only as a minor cleanliness/consistency opportunity if the `Organization`/`@id` linking work in §6-7 is undertaken, since `@graph` makes cross-node `@id` references more idiomatic to read and maintain.

---

## Items not independently re-checked (out of this audit's fetched sample)

- Only one venue page (`lanzerac-wine-estate`) and one blog post (`wedding-venue-bottelary-road-stellenbosch`) were fetched and parsed in full per the task's minimum scope; the other 23 venue pages and 7 blog posts were **not** individually re-fetched, since `venues/[slug].astro` and `blog/[slug].astro` are shared templates — the structural findings (missing `postalCode`/`geo`, non-ISO `datePublished`, no `author`) apply uniformly by construction, but per-venue data quirks (e.g. the 9 "Contact Venue"/"Contact venue" price-tier venues, or the 3 unverified venues per CLAUDE.md's fact-check section) were not spot-checked for schema-specific edge cases in this pass.
- `astro-build/dist/` built output was not diffed against the live-fetched HTML byte-for-byte; live curl output was treated as authoritative per the briefing's own hard rule ("Audit the LIVE site... that's what Google sees").

---

## Summary of findings by severity

- **Critical:** 0
- **Moderate:** 3 — (1) missing `EventVenue` address granularity (`addressLocality`, `postalCode`, `geo`) across all 24 venue pages, source data has no fields to populate them from; (2) `BlogPosting.datePublished` not ISO 8601 (genuine spec violation, likely silently dropped by parsers), plus absent `dateModified`/`author`; (3) zero `sameAs`/`Organization` entity consolidation site-wide despite live, documented Pinterest and Instagram profiles.
- **Minor:** 2 — (1) confirmed em dash in `Base.astro:81`'s `WebSite` JSON-LD description (exact policy violation as flagged in the briefing); (2) venue `telephone` values in local SA format, not E.164.
- **Info / documentation drift:** 3 — (1) CLAUDE.md's "Global: Organization + WebSite" schema description matches legacy `App.jsx`, not the live Astro `Base.astro` (no standalone `Organization`, no `${VENUES.length}` dynamism in the JSON-LD description, no `global-jsonld` id) — worth a CLAUDE.md correction; (2) no `@id` fields used anywhere, so `WebSite`/`Organization`/`BlogPosting.publisher` are not cross-referenced as the same entity; (3) second, previously-unflagged em dash in the venue-page `<title>` template literal (`venues/[slug].astro:30`), which may be an intentional documented pattern per CLAUDE.md's own SEO section rather than an oversight — needs reconciliation, not a unilateral fix.
- **FAQPage note:** informational only, no action, per standing instructions.
