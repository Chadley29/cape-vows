# Technical SEO Audit — Cape Vows (capevows.co.za)
Date: 2026-09-18 · Live site audited directly (curl, no JS execution unless noted)

---

## Summary

| Category | Status |
|---|---|
| Crawlability | PASS |
| Sitemap | PASS |
| Security headers | PARTIAL (no CSP/X-Content-Type-Options/Referrer-Policy/Permissions-Policy; HSTS present) |
| Redirects | PASS |
| 404 behaviour | PASS (true 404 status) |
| Canonicals | PASS |
| hreflang | PASS (correctly absent) |
| JS rendering / SSR | PARTIAL (FAQ answers, filtered `/venues` views, and the enquiry form are not in the server-rendered DOM) |
| URL structure | PARTIAL (query-string filters produce byte-identical HTML — not distinctly indexable) |
| IndexNow | NOT IMPLEMENTED |

**Technical score: 84/100**

**Findings by severity: 0 Critical · 2 High · 5 Medium · 6 Low**

---

## 1. Crawlability — PASS

Live `curl -s https://capevows.co.za/robots.txt` (fetched 2026-09-18) returns exactly the repo copy, byte-for-byte. Full body:

```
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

All six named AI/search crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bingbot) have explicit `Allow: /` blocks, confirming Cloudflare's "Block AI Scrapers" / Managed robots.txt feature is currently NOT overriding the repo file (this has been a known risk per `CLAUDE.md`'s "Critical infrastructure note" — currently clean). `Sitemap:` directive present and correct. No `Disallow` anywhere. No noindex-by-robots.txt traps.

**No findings** — this category is clean.

---

## 2. Sitemap reachability — PASS

`curl -s -o /tmp/sitemap.xml -w "%{http_code}"` → **HTTP 200**, `Content-Type: application/xml`.

- Live `<loc>` count: **35** — matches the briefing's stated 35 and matches `astro-build/public/sitemap.xml` exactly (`diff` of sorted `<loc>` lists between live and repo copy returned zero differences, both files 35 lines).
- No `elgin-ridge-wines` in the sitemap (confirms fix #4, see Section 10).
- `/venues/saved`, `/vendors`, `/admin`, `/404` correctly excluded (all noindex/utility routes), consistent with 39 built routes − 4 = 35.

**No findings.**

---

## 3. Security headers — PARTIAL (informational, as scoped)

`curl -sI https://capevows.co.za/` and `curl -sI https://capevows.co.za/venues/lanzerac-wine-estate`, full header sets:

```
HTTP/1.1 200 OK
Date: Fri, 18 Sep 2026 13:22:57 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
access-control-allow-origin: *
Age: 1
Cache-Control: public, max-age=0, must-revalidate
content-disposition: inline
Nel: {"report_to":"cf-nel",...}
last-modified: Fri, 18 Sep 2026 13:22:55 GMT
Server: cloudflare
strict-transport-security: max-age=63072000
x-vercel-cache: HIT
x-vercel-id: cpt1::...
cf-cache-status: DYNAMIC
Report-To: {...}
CF-RAY: ...
alt-svc: h3=":443"; ma=86400
```

Venue page headers are identical in shape (only `content-disposition` filename and cache timestamps differ).

**Present:** `strict-transport-security: max-age=63072000` (HSTS, ~2 years, but no `includeSubDomains` or `preload` directive — Cloudflare-injected, not Vercel/app-level).

**Confirmed MISSING** (checked individually via `grep -i` against the live header dump, each returned no match):
- `Content-Security-Policy` — MISSING
- `X-Content-Type-Options` — MISSING (should be `nosniff`)
- `X-Frame-Options` — MISSING (no clickjacking protection; CSP `frame-ancestors` would also cover this)
- `Referrer-Policy` — MISSING
- `Permissions-Policy` — MISSING
- `X-XSS-Protection` — MISSING (deprecated header, its absence is not itself a problem)
- `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy` — MISSING

**MEDIUM — Finding:** No security headers are being set at the application/Vercel level. HSTS is Cloudflare's own default injection, not something the app configured (there is no `vercel.json` `headers` block — confirmed by inspecting `vercel.json` at repo root, which only contains `buildCommand`/`outputDirectory`/`cleanUrls`/`trailingSlash`). CSP, X-Content-Type-Options, Referrer-Policy and Permissions-Policy are all straightforward to add via a `headers` array in `vercel.json` and carry no SEO downside; they are a standard trust-signal and reduce clickjacking/MIME-sniffing/referrer-leak surface. Not urgent (this is a static content site with no user data entry points beyond Formspree-hosted forms), but worth doing since it's low-effort.

**LOW — Finding:** `access-control-allow-origin: *` is present on the HTML document response itself (not just static assets). This is a Vercel platform default for static hosting and is not a vulnerability for public read-only content, but it's unusual to see a wildcard CORS header on an HTML document rather than scoped to `/_astro/*` assets. Informational only, no action required.

---

## 4. Redirect chains — PASS (all behave correctly)

All six required live tests, `curl -sI`:

| # | URL | Status | Location header |
|---|---|---|---|
| 1 | `https://capevows.co.za/` | **200 OK** | — |
| 2 | `https://www.capevows.co.za/` | **301 Moved Permanently** | `location: https://capevows.co.za/` |
| 3 | `http://capevows.co.za/` | **308 Permanent Redirect** | `Location: https://capevows.co.za/` (plus `Refresh: 0;url=...`) |
| 4 | `https://capevows.co.za/venues/lanzerac-wine-estate` | **200 OK** | — |
| 5 | `https://capevows.co.za/venues/lanzerac-wine-estate.html` | **308 Permanent Redirect** | `location: /venues/lanzerac-wine-estate` |
| 6 | `https://capevows.co.za/venues/lanzerac-wine-estate/` (trailing slash) | **308 Permanent Redirect** | `location: /venues/lanzerac-wine-estate` |

Observations:
- Apex serves 200 directly (confirms fix #3 — no more 307-to-www).
- `www` → apex is a single-hop 301 (permanent, correct signal for consolidating link equity).
- HTTP → HTTPS is a 308 (permanent, method-preserving — correct choice over 301 for this).
- `cleanUrls: true` in `vercel.json` is doing exactly what's documented: the `.html` variant 308s to the clean URL rather than 404ing, and it's a single hop (not a chain through an intermediate).
- `trailingSlash: false` (repo's `vercel.json`) and `trailingSlash: 'never'` (`astro-build/astro.config.mjs`, confirmed by direct read) are consistently enforced at the edge/platform level, not just at build time — the trailing-slash URL doesn't 404, it redirects, which is the correct behaviour for preserving inbound links/backlinks that might use a trailing slash.
- No redirect in this set is a chain (redirect-to-redirect) — every case is exactly one hop to a 200.

**No findings** — this category is clean and correctly configured.

---

## 5. 404 behaviour — PASS

`curl -sI https://capevows.co.za/this-page-does-not-exist-xyz123`:

```
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8
content-disposition: inline; filename="404"
last-modified: Sat, 12 Sep 2026 04:34:09 GMT
```

This is a genuine HTTP 404 status code, not a soft-404 (200 with "not found" content). `content-disposition: inline; filename="404"` confirms Vercel is serving the static `404.html` build output with the correct status. Per the briefing, `/404` is also excluded from the sitemap and (per `CLAUDE.md`/route table) carries noindex/no canonical — correctly not indexable.

**No findings.**

---

## 6. Canonical consistency — PASS (fix #2 confirmed, no leak)

Spot-checked live `<link rel="canonical">` and `<meta property="og:url">` on 5 page types:

| Page | Canonical | og:url | robots |
|---|---|---|---|
| `/` (home) | `https://capevows.co.za` | `https://capevows.co.za` | — |
| `/venues/lanzerac-wine-estate` | `https://capevows.co.za/venues/lanzerac-wine-estate` | same | — |
| `/blog/wedding-venue-bottelary-road-stellenbosch` | `https://capevows.co.za/blog/wedding-venue-bottelary-road-stellenbosch` | same | — |
| `/venues` (listing) | `https://capevows.co.za/venues` | same | — |
| `/vendors` | `https://capevows.co.za/vendors` | same | `noindex` |

Every canonical is self-referential and URL-correct (no `www`, no trailing slash, no leaked homepage URL). `/vendors` also correctly emits `<meta name="robots" content="noindex">` in the live HTML, consistent with `CLAUDE.md`'s note that it's excluded from indexing while the vendor directory is pre-launch. **Fix #2 confirmed** — no re-audit needed.

**MEDIUM — Finding (Section 9 overlap, listed once here for canonical-specific framing):** `/venues?region=Franschhoek&price=Luxury` also emits canonical `https://capevows.co.za/venues` (verified live) — correctly self-canonicalising to the unfiltered listing rather than leaking a query-string canonical. This is the *correct* behaviour given that the filtered HTML is byte-identical (see Section 9), but it does mean filtered URLs have zero independent indexing value by design — noted here as context, full detail in Section 9.

---

## 7. hreflang — PASS (correctly absent, not a defect)

`curl -s <url> | grep -io hreflang` returned zero matches on `/`, `/venues/lanzerac-wine-estate`, and `/blog`. Cape Vows is a single-market, single-language (en-ZA) site targeting Western Cape, South Africa only — hreflang is correctly not implemented. Per scope instructions, this is confirmed as correct, not flagged as a gap.

---

## 8. JavaScript rendering — PARTIAL — two real findings

**What IS server-rendered (visible in raw `curl` HTML, no JS needed):**
- Venue `<h1>` (`<h1 class="venue-banner-title">Lanzerac Wine Estate</h1>`), full description text as static markup: `<p class="venue-desc">A stately Cape Dutch manor at the foot of the Jonkershoek Mountains...` — confirmed present verbatim in raw HTML, not just as a React prop.
- All three JSON-LD blocks (`EventVenue`, `FAQPage`, `BreadcrumbList` — each confirmed present exactly once via `grep -c` on the venue page) render server-side and are fully parseable without JS.
- FAQ **questions** are server-rendered as real DOM text: `<button class="faq-q" type="button" aria-expanded="false"><span>How many guests can Lanzerac Wine Estate accommodate?</span>...`
- Enquiry CTA button text (`Enquire About This Venue`, `Visit Official Website`) is present as static text.
- Blog post body, hero image, and blog listing cards are fully static HTML.

**HIGH — Finding: FAQ answer text is NOT in the server-rendered DOM, only in JSON-LD + a hydration-attribute JSON blob.** Traced to `astro-build/src/components/FaqAccordion.jsx`:
```jsx
const [openIndex, setOpenIndex] = useState(null);   // line 4 — defaults closed
...
{openIndex === i && (                                 // line 34
  <div className="faq-a" style={{ color: "var(--muted)" }}>
    {faq.a}
  </div>
)}
```
Because `openIndex` defaults to `null`, the `.faq-a` answer `<div>` is never rendered during Astro's SSR pass (confirmed: zero occurrences of `.faq-a` class in the raw HTML of `/venues/lanzerac-wine-estate`, verified via `grep -o 'faq-a[a-z]*"[^>]*>'`). The answer text exists in the raw HTML source ONLY as (a) the `FAQPage` JSON-LD `<script>` block, and (b) inside the `props="{...}"` attribute of the `<astro-island>` element that hydrates `FaqAccordion` (`client:visible`, confirmed at `astro-build/src/pages/venues/[slug].astro:123`). Both are technically present in the byte stream a `curl`-style fetch receives, but:
- The JSON-LD copy is valid structured data and IS reliably parsed by Google and most AI citation engines — this is a legitimate mitigating factor, not a false claim.
- The `props` attribute copy is HTML-entity-escaped JSON embedded in a tag attribute, not a semantic text node. Crawlers that do DOM-based or boilerplate-stripped text extraction (rather than raw byte-string matching) will typically not surface attribute JSON as body prose — meaning the FAQ answers are effectively invisible as *natural-language page content* to any crawler that doesn't execute JS and doesn't specifically parse JSON-LD.
- Net effect: FAQ answers ARE machine-citable (via JSON-LD) but are NOT part of the page's readable prose for a non-JS text-extraction pass, which matters for the GEO/AI-citation strategy `CLAUDE.md` explicitly prioritises (`robots.txt` welcomes GPTBot/ClaudeBot/PerplexityBot specifically to read and cite this content).
- **Recommendation:** render the first FAQ answer open by default (`useState(0)` instead of `useState(null)`), or render all `.faq-a` divs server-side with `max-height:0;overflow:hidden` CSS collapse instead of a conditional React unmount — either preserves the accordion UX while making answer text present as real DOM text pre-hydration.

**HIGH — Finding: The venue enquiry form has zero server-rendered form markup.** `grep -c '<input\|<textarea\|<form'` on the raw HTML of `/venues/lanzerac-wine-estate` returned **0** — no `<form>`, `<input>`, or `<textarea>` tags exist anywhere in the raw HTML, even in hidden/collapsed form. `EnquiryModal` is `client:load` (`astro-build/src/pages/venues/[slug].astro:187`) and builds its entire form DOM client-side after hydration. This is defensible UX (it's a modal, intentionally hidden until triggered) and doesn't affect the venue's core indexable content, but it does mean: (a) the form fields themselves have zero presence for any crawler/tool that doesn't execute JS, and (b) there is no `noscript` fallback contact method (e.g., a plain `mailto:` or phone link) for a hypothetical non-JS user, though the venue's own phone number and website are separately present as static text elsewhere on the page, so this is a minor UX gap rather than a content-loss issue.

**MEDIUM — Finding: `/venues` listing renders zero venue cards before hydration in the primary DOM (only in `<noscript>`).** `astro-build/src/pages/venues/index.astro:33-41` — the `#venues-app` div's only server-rendered content is a `<script type="application/json" id="venues-data">` data island and the `VenuesApp client:load` island tag; the actual visible card grid only exists inside a separate `<noscript>` block (lines 43-71) which is a parallel, duplicate render of all 24 cards (confirmed live: `grep -c noscript` = 1, and the noscript block's `cards-grid` contains all 24 venue names/descriptions as static `<a>` cards). This matches the "Known OPEN item" already logged in the briefing (ships the dataset twice, blank flash pre-hydration for JS users) — confirmed live, not re-litigated at length per instructions, but flagged here since it's directly relevant to JS-rendering scope. Non-JS crawlers get the full unfiltered 24-venue list via `<noscript>` (good, this is genuinely crawlable), but JS-executing crawlers/real users see a blank `#venues-app` div until `VenuesApp.jsx` hydrates and paints — a CWV/INP-adjacent concern more than an indexability one.

---

## 9. URL structure — PARTIAL

**No query-string-dependent canonical leakage** — confirmed above (Section 6), `/venues?region=X&price=Y` canonicalises to bare `/venues`.

**MEDIUM — Finding: filtered `/venues?region=...&price=...` URLs are not distinctly crawlable content — they return byte-identical HTML to `/venues`.** Live test: fetched `https://capevows.co.za/venues` and `https://capevows.co.za/venues?region=Franschhoek&price=Luxury`, saved both, then:
- `wc -c`: both exactly **52535 bytes**.
- `cmp -l`: only **42 differing bytes** total, isolated to what is almost certainly a per-request-random hydration `uid` attribute on an `<astro-island>` tag (not query-string-dependent content) — not a real content difference.
- The `#venues-data` JSON script island is the full unfiltered 24-venue array in both cases; the `<noscript>` card grid is the full unfiltered 24-venue grid in both cases.

This confirms the mechanism described in `CLAUDE.md`'s "Filters in the URL" section: filtering is entirely client-side (`VenuesApp.jsx` reads `location.search` after hydration and re-renders). The URL pattern is real and shareable for a *human* (a link like `/venues?region=Franschhoek&price=Luxury` will correctly restore that filtered view for a JS-executing visitor), but it has **no independent SEO value** — a search engine crawling that URL receives the same content, same canonical, and same 24-venue payload as the bare `/venues` URL, so it cannot rank or be indexed as a distinct "Franschhoek Luxury venues" landing page. This is consistent with `CLAUDE.md`'s own framing of the feature as "useful for future targeted sharing" rather than an SEO play — not a bug, but worth stating precisely: **if programmatic SEO from filter combinations is ever desired, it would need dedicated server-rendered pages/routes, not query-param client filtering.**

**LOW — Finding:** URL structure itself (`/venues/<slug>`, `/blog/<slug>`) is otherwise clean: no trailing slashes, no case inconsistency, no unnecessary parameters, no session IDs, all lowercase hyphenated slugs. No issues found here.

---

## 10. "Already fixed" — one confirmation each (per briefing instruction, not re-audited)

1. **Body content visible to non-JS crawlers** — CONFIRMED. Raw `curl` of `/venues/lanzerac-wine-estate` contains `<h1 class="venue-banner-title">Lanzerac Wine Estate</h1>` and the full `<p class="venue-desc">` description text as static markup (see Section 8).
2. **Homepage canonical/og:url leak** — CONFIRMED FIXED. All 5 spot-checked page types self-canonicalise (Section 6).
3. **Apex 307→www, now apex 200 / www 301** — CONFIRMED. `https://capevows.co.za/` is `200 OK`; `https://www.capevows.co.za/` is `301` to apex (Section 4).
4. **Stale `elgin-ridge-wines` slug** — CONFIRMED FIXED. Live sitemap.xml has zero occurrences of `elgin-ridge-wines`; `/venues/elgin-vintners` is `200 OK`; `/venues/elgin-ridge-wines` is `404 Not Found`.
5. **VendorContactForm on `/vendors`** — CONFIRMED. `astro-build/src/pages/vendors.astro:3` imports it, `:85` renders `<VendorContactForm client:visible />`.
6. **Global `a { text-decoration:none; color:inherit }` + `.blog-venue-link` override** — CONFIRMED. `astro-build/src/styles/global.css:2` has the reset; `:139` has `.blog-venue-link { ... text-decoration: underline; text-decoration-color: var(--gold); ... }`, which survives via higher specificity as documented.

---

## 11. Additional findings surfaced during this audit (outside the 9 numbered items, but evidenced)

**MEDIUM — Render-blocking Google Fonts stylesheet, no preload.** `astro-build/src/layouts/Base.astro:23-28` loads Playfair Display/Cormorant Garamond/Jost via a synchronous `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...&display=swap">`, preceded by two `preconnect` hints (`:23-24`). The `&display=swap` parameter is good practice (prevents invisible-text FOIT), but the stylesheet itself is still render-blocking with no `rel="preload"` + `onload` swap pattern. On a slow connection this is a real LCP-delay contributor since body text can't paint in its final font until this external stylesheet resolves. Low-effort fix: switch to the preload-then-swap pattern, or self-host the three font files.

**LOW (informational, correctly mitigated) — Blog images lack HTML `width`/`height` but CSS reserves fixed dimensions, so CLS risk is low in practice.** `<img class="blog-post-hero">` (e.g. on `/blog/wedding-venue-bottelary-road-stellenbosch`) and `<img class="blog-card-img">` have no `width`/`height` attributes and the hero image has no `loading` attribute at all. However, `astro-build/src/styles/global.css:116` (`.blog-card-img { height: 200px; ...background: var(--cream2); }`) and `:125` (`.blog-post-hero { height: 380px; ...background: var(--cream2); }`, `:146` responsive override to `240px`) both set a fixed CSS height with a placeholder background colour — meaning space is reserved before the image loads regardless of missing HTML attributes, so actual CLS exposure is low. Still worth adding explicit `width`/`height` as belt-and-suspenders (avoids relying on CSS being fully parsed before the image tag is encountered) and adding `loading="eager" fetchpriority="high"` to the blog hero specifically, since it is the likely LCP element on blog post pages.

**LOW — No IndexNow implementation found.** Searched `astro-build/` for any `indexnow` reference (key file, API push script, `vercel.json` route) — no matches. A broader whole-repo search timed out before completing and was not re-run per the time-boxing instruction from the orchestrator, so this should be treated as "not found in the primary app directory," not an exhaustive negative. Given the site is small (39 routes) and already submits a sitemap that Bing/GSC will crawl on a normal schedule, IndexNow is a nice-to-have (faster Bing/Yandex pickup on new/changed pages, e.g. the weekly featured-venue rotation or new blog posts) rather than urgent. Low priority, cheap to add (a single static key file + a ping on deploy).

**LOW — HSTS present but not `preload`-eligible.** `strict-transport-security: max-age=63072000` has no `includeSubDomains` or `preload` directive. This appears to be Cloudflare's own edge default rather than an app-level header (no `vercel.json` headers block exists). Not urgent; note only if HSTS preload list submission is ever desired.

**Not checked — ran out of budget:** full mobile-friendliness CSS audit (touch target sizes beyond the nav, which showed `min-height: 44px` on `.nav-logo`/`.nav-link`), full IndexNow whole-repo search, and Core Web Vitals field data (no PageSpeed Insights / CrUX pull was run in this session — only source-level static risk inspection as scoped). These should be picked up by whichever specialist owns CWV field data / Lighthouse in this audit round, per the "Cross-Skill Delegation" note in the technical-SEO skill.

---

## Findings index by severity

**Critical:** none.

**High (2):**
1. FAQ answer text absent from server-rendered DOM (only in JSON-LD + hydration-attribute JSON) — `astro-build/src/components/FaqAccordion.jsx:4,34-38`.
2. Enquiry form has zero server-rendered markup, entirely client-built — `astro-build/src/pages/venues/[slug].astro:187`.

**Medium (5):**
1. No CSP / X-Content-Type-Options / Referrer-Policy / Permissions-Policy headers (Section 3).
2. `/venues?region=...&price=...` filtered URLs are byte-identical to `/venues` — no independent indexing value by design (Section 9).
3. `/venues` listing renders no visible cards in the primary (non-noscript) DOM before hydration — `astro-build/src/pages/venues/index.astro:33-41` (Section 8).
4. Render-blocking Google Fonts stylesheet with no preload pattern — `astro-build/src/layouts/Base.astro:23-28` (Section 11).
5. Canonical on filtered `/venues` URLs collapses filter intent to the base listing (same root cause as Medium #2, listed once for canonical-specific context in Section 6).

**Low (6):**
1. `access-control-allow-origin: *` on HTML documents (Vercel default, not a real risk).
2. Blog images missing explicit `width`/`height` HTML attributes (CSS mitigates CLS risk in practice).
3. No IndexNow implementation found in `astro-build/` (search incomplete for rest of repo).
4. HSTS present without `includeSubDomains`/`preload`.
5. URL structure otherwise clean (no issues, noted for completeness).
6. Enquiry modal has no non-JS fallback contact method inline (phone/website links exist elsewhere on the page, so impact is minor).

---

_Live checks performed via `curl` against `https://capevows.co.za` on 2026-09-18. File:line citations verified against `astro-build/src/` in the repository working tree at the same date. Cross-skill note: detailed hreflang validation is out of scope per this skill's delegation rule (confirmed absent only, per Section 7); Core Web Vitals field data and full Lighthouse/PSI audit were not run in this session (see "Not checked" note, Section 11)._
