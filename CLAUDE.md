# Cape Vows — Claude Code Context

**Site:** capevows.co.za · **Repo:** Chadley29/cape-vows · **Branch:** main

## What this project is

Cape Vows is a curated Western Cape wedding venue directory — 24 hand-verified venues across 5 regions. The site is built as a single-page React app deployed to Vercel. Domain managed via Cloudflare.

The owner-operator is Chadley Bissolati. The audience is engaged couples planning a wedding in the Western Cape, South Africa. The brand voice is warm, locally proud, romantic but practical — never generic wedding-industry fluff.

---

## Tech stack

- **Framework:** React 18 + Vite 5
- **Hosting:** Vercel (free tier) — auto-deploys on push to `main`
- **DNS:** Cloudflare (Bot Fight Mode OFF, AI crawlers explicitly allowed in `public/robots.txt`)
- **Email:** hello@capevows.co.za (Cloudflare routing → Gmail)
- **Analytics:** GA4 `G-70RTTPE121` — use the `track(eventName, params)` helper in App.jsx for new events
- **Form processing:** Formspree, single endpoint `mwvywnbp` shared across venue enquiries, "Get Listed," and "Get in Touch" forms — each distinguished by a hidden `_subject` and `type` field, not separate endpoints
- **Fonts:** Google Fonts CDN — Playfair Display, Cormorant Garamond, Jost (preconnect hints added in `index.html` for first-paint performance)

## Deploy process

Edit → commit → push to `main` → Vercel auto-deploys. There is no separate build step to run. (A future build-time prerender via GitHub Actions — "Path B" — is scoped and parked, not yet implemented; see Pending section.)

## Critical infrastructure note

Cloudflare Bot Fight Mode must remain **OFF**, otherwise Googlebot is blocked with 403s and the entire site is invisible to search engines. `public/robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, and Bingbot (GEO/AI-citation strategy) and includes the sitemap directive. If `curl https://capevows.co.za/robots.txt` ever shows these blocked again, check Cloudflare's "AI Audit" / "Block AI Scrapers" dashboard toggle — it can silently override the repo's robots.txt.

---

## Architecture — read this before editing anything

### Single-file pattern

Everything lives in `src/App.jsx` in this order:

1. CSS injected via `<style>` tag at runtime (no separate `.css` files)
2. Constants: `TYPE_GRADIENTS`, `PRICE_RANGES`, `REGION_CONTEXT`, `VENUES_WITH_ACCOMMODATION`
3. Data arrays: `VENUES[]` (24 items), `POSTS[]` (6 blog posts), vendor data
4. Hooks: `useFavourites()`, `useRouter()`, `useScrollReveal()` (IntersectionObserver-based fade/rise on scroll, respects `prefers-reduced-motion`)
5. Helper functions: `toSlug()`, `getGradient()`, `displayCapacity()`, `displayPrice()`, `getVenueFaqs()`, `linkifyVenues()`, `getISOWeek()`, `getFeaturedVenues()`
6. Components in order: `VenueCard`, `VendorCard`, `VendorModal`, `VenuePage`, `ResearchPanel`, `FaqAccordion`, `HomePage`, `VenuesPage`, `SavedPage`, `VendorsPage`, `BlogPage`, `BlogPostPage`, `AdminPage`, `NotFound`
7. Root `App()` function with routing logic

**Do not split this file into multiple modules without explicit discussion.** The single-file pattern is a deliberate choice — it keeps the entire app readable in one pass and makes the AI workflow tractable.

### Routing pattern

No React Router. Custom `useRouter()` hook uses `window.history.pushState` and a `popstate` listener. Navigation via the `navigate(path)` function passed as prop through the component tree.

Route matching order matters — `/venues/saved` must come BEFORE the `/venues/:slug` regex match.

```
/             → "home"
/venues       → "venues"       (reads/writes filters as URL query params, see below)
/venues/saved → "saved"        ← must precede slug match
/vendors      → "vendors"      (noindex meta injected while active; not in sitemap)
/blog         → "blog"
/admin        → "admin"
/venues/:slug → "venue"
/blog/:slug   → "blogpost"
```

### Filters in the URL

`VenuesPage` mirrors filter state (region, type, price, capacity, search, sort) to URL query params via `navigate` (debounced for text/slider inputs, immediate for dropdowns), and reads them back on mount. The existing `sessionStorage` `cv_pending_filters` mechanism (used by blog CTAs) still works and takes precedence on first mount if present. A URL like `/venues?region=Franschhoek&price=Luxury` reproduces that filtered view — useful for future targeted sharing/SEO landing pages.

### CSS pattern

All CSS is a single template literal injected via:

```js
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);
```

CSS variables are defined on `:root`. **Never use hardcoded hex colours in component JSX** — always reference `var(--green)` etc.

### Hero + trust strip viewport pattern

`.hero-viewport` is a flex wrapper (`min-height: calc(100vh - 64px)`, 64px = sticky nav height) containing `.hero` (`flex: 1`, grows to fill remaining space) and `.trust-strip` (fixed natural height, pinned at the bottom). Together with the nav, they sum to exactly 100vh with no gap on first load. Uses `min-height` not `height` so short viewports grow past 100vh rather than clipping hero content — don't change this to a rigid height.

---

## Design tokens

```
--cream:  #FAF7F2   (page background)
--cream2: #F3EDE3   (card/section backgrounds)
--green:  #2D4A3E   (primary — headings, CTAs)
--gold:   #A07840   (accent — links, highlights, eyebrows)
--gold2:  #C49A5A   (lighter gold — footer logo)
--text:   #1C1C1A   (body copy)
--muted:  #7A7266   (secondary text, captions)
--border: #DDD4C8   (dividers, input borders)

--ff-serif: 'Playfair Display'    (headings, titles)
--ff-body:  'Cormorant Garamond'  (body copy, descriptions)
--ff-sans:  'Jost'                (labels, eyebrows, CTAs, nav)
```

`<em>` inside headings renders in the gold/italic style — used for the highlighted word in every section title and the hero.

---

## Venue data structure

```js
{
  id, slug, name, region, type, capacity, price,
  address, phone, website, description, features[], highlight
}
```

**Regions:** Cape Winelands · Constantia Valley · Cape Town City · Atlantic Seaboard · Overberg (5 regions — not 8; older content/social copy referencing "8 regions" is wrong and should be corrected if found)

**Types:** Wine Estate · Historic Manor · Boutique Hotel · Farm & Country · Garden Estate · Beach & Coastal · Mountain Retreat

**Price tiers:** `Budget (< R50k)` · `Mid-Range (R50–150k)` · `Premium (R150–300k)` · `Luxury (R300k+)` · `Contact Venue`

**Known data gap:** there are currently zero Budget-tier venues, and the entire Premium/Luxury bucket is Cape Winelands-only (no coastal/Constantia luxury venue exists in the data yet). This constrains the featured-venue rotation's regional variety — not a bug, a real content gap worth closing if a suitable venue is added later.

### Fallbacks

If `capacity === "Contact venue"` or `price === "Contact Venue"`, all UI must render "Enquire for…" instead of displaying the value. Never blank. Note the exact casing: `"Contact venue"` (lowercase v) is the string the fallback checks match — using `"Contact Venue"` will silently break the check.

### Venue count — dynamic, not hardcoded

`VENUES.length` is used dynamically in on-site copy (hero subtitle, Organization JSON-LD description, VenuePage meta-description fallback, VenuesPage heading) so the count is always accurate and never goes stale. **Never hardcode a venue count in JSX going forward.**

Static assets outside React's reach still have the count hardcoded and require manual updates whenever the venue count changes:

- `index.html`: meta description, `og:description`, `twitter:description`, and the inline JSON-LD `description` field
- `og-image.jpg` (check if it has a count baked into the graphic — current version's trust line is "NO ADS · NO FEES · HAND-VERIFIED" with no number, so likely fine)
- Instagram and Pinterest bio text (external, not in this repo)

**Content policy:** don't state an exact venue count in social copy (Instagram captions, Pinterest pin descriptions) since these can't be kept in sync automatically — use general phrasing ("hand-verified venues across the Western Cape") instead.

### Featured venues — weekly rotation, not a static list

`featuredSlugs` (a hardcoded 3-slug array) has been **replaced** by `getFeaturedVenues(allVenues)`, a pure deterministic function:

- Seeded by `getISOWeek()` (current ISO week number) — same week always produces the same 3 venues, different weeks produce different combinations
- No `Math.random`, no state — safe against render flicker; **if the future prerender work (Path B) is implemented, verify server/client agree on the date** to avoid a hydration mismatch, since this wasn't a concern when client-side-only
- Venues are grouped into price-tier buckets (lower/Mid-Range, higher/Premium-Luxury, "Contact Venue" tier) and one is deterministically picked per bucket per week, so every week guarantees one from each tier by construction — duplicates are structurally impossible
- Region variance is attempted but constrained by the data gap noted above (Premium/Luxury bucket is Winelands-only)

The section itself is titled **"A Few We'd Start With"** (not "Featured Venues" — the word "featured" reads as paid placement to most visitors) with a micro-disclosure line directly beneath the heading: "No venue pays to appear here. These rotate periodically and span different budgets and regions." (no em dash — see content policy below).

### Type-keyed gradients

`TYPE_GRADIENTS` provides distinct warm/cool palettes per venue type. Used in place of stock photos until venue-supplied photography is obtained. **Do not replace gradients with stock images** — this was a deliberate brand decision. Venue cards show a border/box-shadow ring matching the card's own gradient colour on hover/focus (accessibility: applies on keyboard focus too, not just mouse hover).

---

## Key feature patterns

### Favourites / save system

- Hook: `useFavourites()` reads/writes the `cv_saved` key in `localStorage`
- Heart button (`card-save-btn`) appears top-left of venue cards, top-right of venue detail card header
- Nav heart icon fills gold with a badge count when saves > 0
- GA4 event: `venue_save_toggle`

### Venue enquiry modal

- Located in `VenuePage` component
- Two-CTA hierarchy: primary "Enquire About This Venue" (green), secondary "Visit Official Website" (ghost)
- Modal closes via ✕ icon button top-right (not a text "Close" button)
- Posts to Formspree endpoint `mwvywnbp`
- Requires consent checkbox (HTML5 `required` — POPIA/GDPR compliance), links to `/privacy-policy.html`
- Success state includes an expectation-setting line ("we typically respond within 1–2 business days") and a forward path (browse more venues in the same region, using the existing `sessionStorage` filter pattern)
- GA4 event: `venue_enquiry` on successful submit
- **Mobile:** a sticky bottom bar (≤960px) shows the venue name + an Enquire button that opens this same modal — reuses existing state/handlers, doesn't duplicate logic

### "Get Listed" and "Get in Touch" forms

Both were mailto links, now inline forms revealed via progressive disclosure (button click reveals the form in place, no modal). Same Formspree endpoint (`mwvywnbp`) as venue enquiries, distinguished by a hidden `_subject` (e.g. "Get Listed Request — Cape Vows") and a `type` field. Same consent checkbox pattern, same success-state styling as the venue enquiry form. GA4 events: `get_listed_submit`, `contact_submit`.

### Cookie banner

Both buttons previously called `acceptCookies()` regardless of label — fixed so decline is a genuine decline (no GA4 tracking fired) rather than a disguised accept. Check the current implementation before assuming which of the two documented fix approaches was used.

### Related Reading (venue pages)

Placed between the FAQ accordion and the "More venues in [region]" section. Derived by filtering `POSTS[]` for any post whose `sections[].venueLinks` includes the current venue's slug — **no new data field**, purely derived from the existing blog `venueLinks` structure. Reuses the existing `.blog-card` markup verbatim. Renders nothing if there are no matches (currently true for 16 of 24 venues).

### FAQ accordion (per venue page)

- `getVenueFaqs(venue)` generates 5 questions dynamically
- Topics: capacity, location (with driving times from `REGION_CONTEXT`), venue type, price, accommodation
- `VENUES_WITH_ACCOMMODATION` is a Set of slugs controlling the accommodation answer — membership has changed since initial launch (see fact-check history below) and should be kept in sync with verified venue facts, not just a static count
- `FAQPage` JSON-LD injected per venue page on mount, removed on unmount
- Because FAQs are fully derived from `VENUES[]` fields, correcting a venue's data (capacity, accommodation Set membership, etc.) automatically corrects its FAQ answers — no separate FAQ edit needed

### Schema markup

**Per venue page** (id: `venue-jsonld`):

- `EventVenue`
- `FAQPage`
- `BreadcrumbList`

**Global** (id: `global-jsonld`, App mount):

- `Organization` (description now uses dynamic `${VENUES.length}`)
- `WebSite`

**Blog posts** (id: `blog-jsonld`):

- `BlogPosting`

All JSON-LD URLs use `https://capevows.co.za` (no www). Do not introduce www inconsistencies.

### Filter-aware blog CTAs

Blog post CTAs can pre-apply venue filters using `sessionStorage`:

```js
sessionStorage.setItem(
  "cv_pending_filters",
  JSON.stringify({ price: "Mid-Range (R50–150k)" }),
);
navigate("/venues");
```

`VenuesPage` reads and clears `cv_pending_filters` on mount (see "Filters in the URL" above for how this now interacts with URL query params).

### Blog system

6 posts in `POSTS[]` (see table below). Shape:

```js
{
  slug, title, category, date, summary,
  heroImg, heroCredit, metaDesc, intro,
  sections: [{ h2, paras?, items?, venueLinks?, notice? }],
  cta: { label, path, filters? }
}
```

`venueLinks: [{ name, slug }]` on a section enables `linkifyVenues()` — replaces venue name strings in paragraph text with inline gold-underlined clickable buttons, and also powers the Related Reading section on venue pages.

`items[].slug` adds a right-aligned "View venue →" button below each item.

### AI Research Tool (Admin, `/admin`)

Uses Anthropic API with `web_search` tool. Paste any Western Cape venue URL → extracts structured JSON → editable form → adds to `extraVenues` state. Session-only (no backend).

---

## SEO / GEO architecture

### Answer-first principle

Every venue page title follows: `[Venue Name] Wedding Venue — [Region] | Cape Vows`. Every meta description leads with: `[Name] is a [type] wedding venue in [region], Western Cape…`.

This is deliberate for AI search citation (Gemini, Perplexity will extract the first sentence as a snippet). Preserve this pattern.

### robots.txt and AI crawlers

`public/robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, and Bingbot, and includes `Sitemap: https://capevows.co.za/sitemap.xml`. This is a deliberate GEO/AI-citation strategy choice — don't add `Disallow` rules for these without discussion.

### Body-content visibility limitation (known, unresolved)

The site is a client-side-rendered SPA — non-JS crawlers (most AI bots, social link-preview scrapers) see an empty shell before React populates it, meaning canonical/OG tags and body prose aren't visible to them, though JSON-LD facts and page titles/meta descriptions ARE already correctly set per-route via existing `useEffect` hooks. A full fix (build-time prerendering, "Path B": a custom Puppeteer script run via GitHub Actions, deploying prebuilt output to Vercel) is scoped and plan-approved but **not yet implemented** — parked for a future dedicated session. Do not attempt Vercel-native prerendering or `@sparticuz/chromium` — both were tested and confirmed not to work in Vercel's build container (Chromium cannot launch there). A Cloudflare Worker + Prerender.io "dynamic rendering" alternative was also evaluated and rejected due to Prerender.io no longer offering a free tier (min. $49/mo as of late 2025) and documented aggressive repricing.

### South African terminology — non-negotiable

- "Marriage Officer" not "Officiant"
- "Winelands" not "wine country"
- "fynbos" not "local shrubs"
- "favour" not "favor"
- "colour" not "color"
- "kilometres" not "kilometers"

### Venue descriptions

Factual, not promotional. AI search engines prefer to cite factual sources. Avoid adjective inflation.

---

## Content rules

- Blog posts may only reference the 24 venues in `VENUES[]` — never fabricate venues. If a search-demand area only has one verified venue nearby (e.g. Bottelary Road → Eikenhof Estate only), write an honest single-venue-anchored piece rather than padding with unlisted venues.
- **No em dashes anywhere in site content** (venue descriptions, blog posts, UI copy). Rewrite using a full stop, colon, comma, or restructured sentence depending on context — never a blanket find-replace.
- **No exact venue count in copy that can't be kept in sync automatically** (see "Venue count — dynamic, not hardcoded" above).
- All blog images are sourced from Unsplash with photographer credit rendered below the hero
- Hero copy and section titles use `<em>` for the highlighted word (renders in gold italic)
- Marriage Act 25 of 1961 and Civil Union Act 17 of 2006 are the legal sources for the marriage officer blog post — facts here have been verified, do not regenerate from memory

### Blog posts (6, as of this update)

| Slug                                            | Category          | Notes                                                                                                                                                                                                          |
| ----------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `best-wine-estate-venues-franschhoek`           | Venue Guides      |                                                                                                                                                                                                                |
| `budget-friendly-winelands-venues`              | Budget Planning   | Nooitgedacht entry corrected to Stellenbosch (was incorrectly "Paarl")                                                                                                                                         |
| `best-seasons-cape-wedding`                     | Planning Guides   |                                                                                                                                                                                                                |
| `marriage-officer-guide-cape-weddings`          | Legal & Practical | No venue links — legal content only                                                                                                                                                                            |
| `mountain-backdrop-wedding-venues-western-cape` | Venue Guides      | "Banghoek" corrected to "Banhoek" throughout                                                                                                                                                                   |
| `wedding-venue-bottelary-road-stellenbosch`     | Venue Guides      | New. Anchored on Eikenhof Estate (the only verified venue in that specific area) with an honest note about not padding the list; secondary mention of Nooitgedacht for the broader Koelenhof/Stellenbosch area |

---

## Fact-check status (source-verified against venue-supplied material)

21 of 24 venues have been cross-checked against official PDFs/web content saved in `_local/venue-details/` (see below). **3 venues remain unverified — no source material available:** Hawksmoor House (site has a form-gated brochure, extraction failed), The Cellars-Hohenort (only a thin third-party booking widget exists), Belmond Mount Nelson (marketing copy only, no concrete facts). Treat any data for these three as unverified until sourced.

**Corrections already applied from this process:**

- "Elgin Ridge Wines" renamed to **"Elgin Vintners"** (correct real name; slug changed from `elgin-ridge-wines` to `elgin-vintners` — check for stray old-slug references before assuming this is fully propagated)
- La Cotte Farm capacity: 100 → 80
- Lourensford Wine Estate capacity: 120 → 200; removed from `VENUES_WITH_ACCOMMODATION` (source explicitly contradicts on-site accommodation)
- Elgin Vintners and La Paris Estate added to `VENUES_WITH_ACCOMMODATION`
- Eikenhof Estate capacity: corrected to "Up to 180" (verified twice against source PDF — this is a real reception/lawn figure, not an error)
- La Paris Estate capacity: changed to "Contact venue" (only a 50-guest "Intimate Package" was evidenced in the available source; asserting 200 was unverified — needs a direct follow-up with the venue to confirm their full range)
- Nooitgedacht Wine Estate address/phone corrected via Google Business listing: `R304 Koelenhof Rd, Stellenbosch, 7605` / `021 865 2407`
- "Banghoek" → "Banhoek" spelling standardized (Zorgvliet Wines entry + mountain-backdrop blog post)

**Stale-source flags (worth requesting updated brochures):** Lanzerac's source PDF is dated for the 2025–2026 season (others are 2026–2027 or later); Steenberg Farm's is dated August 2024; Cape Point Vineyards' source (a Canva deck, not a PDF) is titled "2025" and only 3 of 4 named packages were captured.

---

## Legal / compliance

- POPIA Information Officer registered: Chadley Bissolati, Reg. No. 2026-013846 (registered 10 May 2026)
- `public/privacy-policy.html` references a signed Formspree DPA + Standard Contractual Clauses covering the US cross-border data transfer
- Enquiry, Get Listed, and Get in Touch forms all require the consent checkbox linking to the privacy policy

---

## Files & their purpose

| File                         | Purpose                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `src/App.jsx`                | Entire application                                                                                                             |
| `index.html`                 | Meta tags, OG tags, Pinterest verification, base JSON-LD, GA4, font preconnects                                                |
| `public/sitemap.xml`         | All 24 venues + 6 blog posts + core pages (`/vendors` deliberately excluded, noindexed)                                        |
| `public/privacy-policy.html` | POPIA/GDPR compliant standalone page                                                                                           |
| `public/robots.txt`          | Explicit AI-crawler allowances + sitemap directive                                                                             |
| `vercel.json`                | SPA rewrites                                                                                                                   |
| `.gitignore`                 | Standard Vite ignores (`node_modules/`, `dist/`, etc.) + `/_local/`                                                            |
| `_local/`                    | **Not tracked by git.** Contains this file, venue source material, and other local-only working notes. See `_local/README.md`. |
| `_local/venue-details/`      | Source PDFs and `.md` reference docs used for the fact-check pass (21 of 24 venues covered)                                    |

---

## Currently pending (priority order)

1. Path B — build-time prerender via GitHub Actions (scoped, plan-approved, not started; see SEO/GEO architecture note above)
2. Source material for the 3 remaining unverified venues (Hawksmoor House, The Cellars-Hohenort, Belmond Mount Nelson) — likely needs direct outreach, not web research
3. Confirm La Paris Estate's actual full capacity range directly with the venue (currently "Contact venue" pending this)
4. Manually update the 4 static `index.html` venue-count references if the real count ever changes (see "Venue count" section above)
5. Ongoing: Instagram posting cadence, Pinterest pin scheduling, Google Business Profile posts, venue photography outreach

---

## Workflow conventions

- Commit messages: short, present tense, no prefix tags. "Add Formspree enquiry modal" not "feat: added Formspree modal"
- Don't run `npm run build` unless explicitly asked — Vercel handles it
- Don't introduce new dependencies without confirming first
- Don't suggest splitting App.jsx into separate files
- Read the existing route map before adding new routes (slug matches must come last)
- When adding new venues, also update `VENUES_WITH_ACCOMMODATION` if relevant, and the sitemap
- When making multi-part changes, show diffs incrementally (one logical change at a time) rather than batching everything into one uneditable diff — this has been the working pattern throughout and should continue
- Don't run git commands (add/commit/push) unless explicitly asked — commits are made via GitHub Desktop after manual review

## What NOT to touch without asking

- The single-file architecture pattern
- The custom `useRouter()` hook (don't suggest React Router)
- The CSS-in-template-literal pattern (don't suggest CSS modules or Tailwind)
- Venue descriptions and blog post content (they've been fact-checked — re-verify against `_local/venue-details/` sources before changing facts, don't regenerate from memory)
- The Cape Vows colour palette (it's anchored in the privacy policy and Pinterest/Instagram assets too)
- The Information Officer details in privacy-policy.html (Reg. No. 2026-013846)
- The featured-venue rotation algorithm's bucket logic (price-tier balance is structurally guaranteed by design — don't "simplify" it back to a static list)

---

_This file is read by Claude Code at the start of every session. Update it when architectural patterns change so future sessions stay aligned._
