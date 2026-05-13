# Cape Vows — Claude Code Context

**Site:** capevows.co.za · **Repo:** Chadley29/cape-vows · **Branch:** main

## What this project is

Cape Vows is a curated Western Cape wedding venue directory — 24 hand-verified venues across 8 regions. The site is built as a single-page React app deployed to Vercel. Domain managed via Cloudflare.

The owner-operator is Chadley Bissolati. The audience is engaged couples planning a wedding in the Western Cape, South Africa. The brand voice is warm, locally proud, romantic but practical — never generic wedding-industry fluff.

---

## Tech stack

- **Framework:** React 18 + Vite 5
- **Hosting:** Vercel (free tier) — auto-deploys on push to `main`
- **DNS:** Cloudflare
- **Email:** hello@capevows.co.za (Cloudflare routing → Gmail)
- **Analytics:** GA4 `G-70RTTPE121` — use the `track(eventName, params)` helper in App.jsx for new events
- **Form processing:** Formspree (endpoint: `mwvywnbp`)
- **Fonts:** Google Fonts CDN — Playfair Display, Cormorant Garamond, Jost

## Deploy process

Edit → commit → push to `main` → Vercel auto-deploys. There is no separate build step to run.

## Critical infrastructure note

Cloudflare Bot Fight Mode must remain **OFF**, otherwise Googlebot is blocked with 403s and the entire site is invisible to search engines. Re-enabling it would undo all SEO work.

---

## Architecture — read this before editing anything

### Single-file pattern
Everything lives in `src/App.jsx` in this order:

1. CSS injected via `<style>` tag at runtime (no separate `.css` files)
2. Constants: `TYPE_GRADIENTS`, `PRICE_RANGES`, `REGION_CONTEXT`, `VENUES_WITH_ACCOMMODATION`
3. Data arrays: `VENUES[]` (24 items), `POSTS[]` (5 blog posts), vendor data
4. Hooks: `useFavourites()`, `useRouter()`
5. Helper functions: `toSlug()`, `getGradient()`, `displayCapacity()`, `displayPrice()`, `getVenueFaqs()`, `linkifyVenues()`
6. Components in order: `VenueCard`, `VendorCard`, `VendorModal`, `VenuePage`, `ResearchPanel`, `FaqAccordion`, `HomePage`, `VenuesPage`, `SavedPage`, `VendorsPage`, `BlogPage`, `BlogPostPage`, `AdminPage`, `NotFound`
7. Root `App()` function with routing logic

**Do not split this file into multiple modules without explicit discussion.** The single-file pattern is a deliberate choice — it keeps the entire app readable in one pass and makes the AI workflow tractable.

### Routing pattern
No React Router. Custom `useRouter()` hook uses `window.history.pushState` and a `popstate` listener. Navigation via the `navigate(path)` function passed as prop through the component tree.

Route matching order matters — `/venues/saved` must come BEFORE the `/venues/:slug` regex match.

```
/             → "home"
/venues       → "venues"
/venues/saved → "saved"        ← must precede slug match
/vendors      → "vendors"
/blog         → "blog"
/admin        → "admin"
/venues/:slug → "venue"
/blog/:slug   → "blogpost"
```

### CSS pattern
All CSS is a single template literal injected via:

```js
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);
```

CSS variables are defined on `:root`. **Never use hardcoded hex colours in component JSX** — always reference `var(--green)` etc.

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

**Regions:** Cape Winelands · Constantia Valley · Cape Town City · Atlantic Seaboard · Overberg

**Types:** Wine Estate · Historic Manor · Boutique Hotel · Farm & Country · Garden Estate · Beach & Coastal · Mountain Retreat

**Price tiers:** `Budget (< R50k)` · `Mid-Range (R50–150k)` · `Premium (R150–300k)` · `Luxury (R300k+)` · `Contact Venue`

### Fallbacks
If `capacity === "Contact venue"` or `price === "Contact Venue"`, all UI must render "Enquire for…" instead of displaying the value. Never blank.

### Featured venues
Three slugs are hardcoded in `featuredSlugs` on the homepage:

```js
const featuredSlugs = ["eikenhof-estate", "la-paris-estate", "babylonstoren"];
```

Change these three to update the homepage featured section.

### Type-keyed gradients
`TYPE_GRADIENTS` provides distinct warm/cool palettes per venue type. Used in place of stock photos until venue-supplied photography is obtained. **Do not replace gradients with stock images** — this was a deliberate brand decision.

---

## Key feature patterns

### Favourites / save system
- Hook: `useFavourites()` reads/writes the `cv_saved` key in `localStorage`
- Heart button (card-save-btn) appears top-left of venue cards, top-right of venue detail card header
- Nav heart icon fills gold with a badge count when saves > 0
- GA4 event: `venue_save_toggle`

### Venue enquiry modal
- Located in `VenuePage` component
- Two-CTA hierarchy: primary "Enquire About This Venue" (green), secondary "Visit Official Website" (ghost)
- Modal closes via ✕ button top-right
- Posts to Formspree endpoint `mwvywnbp`
- Requires consent checkbox (HTML5 `required` — POPIA/GDPR compliance)
- GA4 event: `venue_enquiry` on successful submit

### FAQ accordion (per venue page)
- `getVenueFaqs(venue)` generates 5 questions dynamically
- Topics: capacity, location (with driving times from `REGION_CONTEXT`), venue type, price, accommodation
- `VENUES_WITH_ACCOMMODATION` Set of 18 slugs controls the accommodation answer — keep this updated as new venues are added
- `FAQPage` JSON-LD injected per venue page on mount, removed on unmount

### Schema markup
**Per venue page** (id: `venue-jsonld`):
- `EventVenue`
- `FAQPage`
- `BreadcrumbList`

**Global** (id: `global-jsonld`, App mount):
- `Organization`
- `WebSite`

**Blog posts** (id: `blog-jsonld`):
- `BlogPosting`

All JSON-LD URLs use `https://capevows.co.za` (no www). Do not introduce www inconsistencies.

### Filter-aware blog CTAs
Blog post CTAs can pre-apply venue filters using `sessionStorage`:

```js
sessionStorage.setItem("cv_pending_filters", JSON.stringify({ price: "Mid-Range (R50–150k)" }));
navigate("/venues");
```

`VenuesPage` reads and clears `cv_pending_filters` on mount.

### Blog system
5 posts in `POSTS[]`. Shape:

```js
{
  slug, title, category, date, summary,
  heroImg, heroCredit, metaDesc, intro,
  sections: [{ h2, paras?, items?, venueLinks?, notice? }],
  cta: { label, path, filters? }
}
```

`venueLinks: [{ name, slug }]` on a section enables `linkifyVenues()` — replaces venue name strings in paragraph text with inline gold-underlined clickable buttons.

`items[].slug` adds a right-aligned "View venue →" button below each item.

### AI Research Tool (Admin, `/admin`)
Uses Anthropic API with `web_search` tool. Paste any Western Cape venue URL → extracts structured JSON → editable form → adds to `extraVenues` state. Session-only (no backend).

---

## SEO / GEO architecture

### Answer-first principle
Every venue page title follows: `[Venue Name] Wedding Venue — [Region] | Cape Vows`. Every meta description leads with: `[Name] is a [type] wedding venue in [region], Western Cape…`.

This is deliberate for AI search citation (Gemini, Perplexity will extract the first sentence as a snippet). Preserve this pattern.

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

- Blog posts may only reference the 24 venues in `VENUES[]` — never fabricate venues
- All blog images are sourced from Unsplash with photographer credit rendered below the hero
- Hero copy and section titles use `<em>` for the highlighted word (renders in gold italic)
- Marriage Act 25 of 1961 and Civil Union Act 17 of 2006 are the legal sources for the marriage officer blog post — facts here have been verified, do not regenerate from memory

---

## Files & their purpose

| File | Purpose |
|---|---|
| `src/App.jsx` | Entire application |
| `index.html` | Meta tags, OG tags, Pinterest verification, base JSON-LD, GA4 |
| `public/sitemap.xml` | All 24 venues + 5 blog posts + core pages |
| `public/privacy-policy.html` | POPIA/GDPR compliant standalone page |
| `vercel.json` | SPA rewrites |

---

## Currently pending (priority order)

1. Push all current local changes to GitHub (App.jsx, sitemap.xml, index.html, privacy-policy.html)
2. Request indexing via Google Search Console for 5 priority URLs
3. Replace gradient banners with venue photography (awaiting outreach)
4. New blog post: "Cape Town vs. Winelands: How to Choose"
5. Pinterest launch — 11 pins (intro + 10 from existing blog posts)

---

## Workflow conventions

- Commit messages: short, present tense, no prefix tags. "Add Formspree enquiry modal" not "feat: added Formspree modal"
- Don't run `npm run build` unless explicitly asked — Vercel handles it
- Don't introduce new dependencies without confirming first
- Don't suggest splitting App.jsx into separate files
- Read the existing route map before adding new routes (slug matches must come last)
- When adding new venues, also update `VENUES_WITH_ACCOMMODATION` if relevant, and the sitemap

## What NOT to touch without asking

- The single-file architecture pattern
- The custom `useRouter()` hook (don't suggest React Router)
- The CSS-in-template-literal pattern (don't suggest CSS modules or Tailwind)
- Venue descriptions and blog post content (they've been fact-checked)
- The Cape Vows colour palette (it's anchored in the privacy policy and Pinterest pins too)
- The Information Officer details in privacy-policy.html (Reg. No. 2026-013846)

---

*This file is read by Claude Code at the start of every session. Update it when architectural patterns change so future sessions stay aligned.*
