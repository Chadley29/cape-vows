# Performance / Core Web Vitals Audit — Cape Vows (capevows.co.za)

Audit date: 2026-09-18. Tool: `python scripts/pagespeed_check.py <url> --json` (run from
`C:/Users/chadl/.claude/skills/seo`), which combines PageSpeed Insights v5 (Lighthouse lab
data, both mobile and desktop strategies by default) with the CrUX field-data API in a single
call. All four target URLs were tested successfully at both strategies (8/8 data points
collected). Raw JSON saved during this session at
`%LOCALAPPDATA%\Temp\claude\...\scratchpad\ps_{home,venues,lanzerac,blog}.json` (session temp,
not part of the repo — re-run the command above to reproduce).

Core Web Vitals thresholds used throughout: LCP good ≤2.5s / poor >4.0s; INP good ≤200ms / poor
>500ms (INP is the sole interactivity metric — FID is fully retired, not referenced anywhere
below); CLS good ≤0.1 / poor >0.25. **Important caveat: CrUX field data (real 28-day Chrome user
percentiles) is unavailable for all four URLs (see Finding 4), so everything below is Lighthouse
LAB data from a single simulated run** — directionally useful, not the 75th-percentile field
measurement Google actually uses for ranking/Core Web Vitals report purposes.

---

## 1. Scores and lab metrics per URL per strategy

### Homepage — `https://capevows.co.za/`

| Metric | Mobile | Desktop |
|---|---|---|
| Performance score | **77** | **97** |
| Accessibility score | 95 | 95 |
| Best Practices score | 100 | 100 |
| SEO score | 100 | 100 |
| FCP | 3.7 s (3687.9 ms, score 0.30) | 0.7 s (693.7 ms, score 0.98) |
| LCP | 4.3 s (4316.9 ms, score 0.41) | 1.2 s (1152.7 ms, score 0.91) |
| TBT | 0 ms (score 1.0) | 70 ms (score 0.99) |
| CLS | 0 (score 1.0) | 0.000257 (score 1.0) |
| Speed Index | 3.7 s (score 0.85) | 0.8 s (score 0.99) |
| Time to Interactive | 4.3 s (score 0.84) | 1.2 s (score 1.0) |

### Venues listing — `https://capevows.co.za/venues`

| Metric | Mobile | Desktop |
|---|---|---|
| Performance score | **74** | **75** |
| Accessibility score | 80 | 80 |
| Best Practices score | 100 | 100 |
| SEO score | 100 | 100 |
| FCP | 3.9 s (3862.4 ms, score 0.26) | 0.7 s (730.2 ms, score 0.97) |
| LCP | 4.5 s (4465.4 ms, score 0.38) | 0.8 s (812.4 ms, score 0.98) |
| TBT | 0 ms (score 1.0) | 47 ms / displayed "50 ms" (score 1.0) |
| CLS | 0 (score 1.0) | **0.881 (score 0.03)** |
| Speed Index | 4.8 s (4784.9 ms, score 0.67) | 0.7 s (score 1.0) |
| Time to Interactive | 4.5 s (score 0.83) | 0.9 s (score 1.0) |

**Desktop CLS of 0.881 is a hard fail (poor >0.25, this is 3.5x that threshold)** despite mobile
CLS being a clean 0. This is new/notable and was not called out in the pre-migration baseline
(which reported CLS 0.011). Root cause is very likely the `/venues` page's documented "no filter
bar before hydration" issue (briefing item: `VenuesApp.jsx` hydrates with `client:load`, and the
static `<noscript>` fallback cards render before the JS filter UI mounts, per
`astro-build/src/pages/venues/index.astro`) — a late-injected filter bar or grid re-layout after
`VenuesApp` hydrates would produce exactly this signature (near-zero on mobile if the layout
happens to settle before mobile's slower FCP, high on desktop where hydration completes fast but
still after first paint). This needs lab confirmation with a Lighthouse trace/DevTools
Performance panel layout-shift overlay — flagging as **High severity, root cause not fully
proven from PSI JSON alone**, but the CLS number itself is directly quoted from the API response
above and is not in dispute.

### Venue detail — `https://capevows.co.za/venues/lanzerac-wine-estate`

| Metric | Mobile | Desktop |
|---|---|---|
| Performance score | **70** | **97** |
| Accessibility score | 93 | 93 |
| Best Practices score | 100 | 100 |
| SEO score | 100 | 100 |
| FCP | 3.7 s (3704.1 ms, score 0.29) | 0.9 s (902.4 ms, score 0.91) |
| LCP | 4.9 s (4948.4 ms, score 0.28) | 1.1 s (1066.4 ms, score 0.93) |
| TBT | 110 ms (113.8 ms, score 0.97) | 20 ms (20.3 ms, score 1.0) |
| CLS | 0 (score 1.0) | 0.0035 (score 1.0) |
| Speed Index | 5.0 s (4964.0 ms, score 0.64) | 1.1 s (score 0.95) |
| Time to Interactive | 5.0 s (score 0.77) | 1.1 s (score 1.0) |

### Blog post — `https://capevows.co.za/blog/wedding-venue-bottelary-road-stellenbosch`

| Metric | Mobile | Desktop |
|---|---|---|
| Performance score | **72** | **97** |
| Accessibility score | 91 | 91 |
| Best Practices score | 100 | 100 |
| SEO score | 100 | 100 |
| FCP | 3.7 s (3691.4 ms, score 0.30) | 0.9 s (884.7 ms, score 0.92) |
| LCP | 4.9 s (4894.4 ms, score 0.29) | 1.2 s (1191.4 ms, score 0.90) |
| TBT | 85 ms (score 0.99) | 11 ms (score 1.0) |
| CLS | 0 (score 1.0) | 0.000257 (score 1.0) |
| Speed Index | 4.9 s (4863.2 ms, score 0.66) | 0.9 s (884.7 ms, score 0.98) |
| Time to Interactive | 4.9 s (score 0.78) | 1.2 s (score 1.0) |

### LCP element identification

The PSI script's JSON does not surface a dedicated "LCP element" audit field (no `lcp-element`
key was present in `audit_details` for any of the 4 pages — checked explicitly). The closest
evidence is the `image-delivery-insight` diagnostic, which lists the largest/most-wasteful
images actually painted on each page:

- **Lanzerac venue page (mobile)**: two large Unsplash images flagged, both from
  "Related Reading" blog cards further down the page, not a true above-the-fold hero:
  `https://images.unsplash.com/photo-1640029415046-27115baeb07d?w=1200&q=80` (218,648 bytes,
  170,028 wasted) and `https://images.unsplash.com/photo-1580060839134-75a5edca2e99?...`
  (198,072 bytes, 149,470 wasted). Lanzerac itself has no photography (brand decision — venue
  cards use `TYPE_GRADIENTS`, not stock photos, per CLAUDE.md), so its own hero is a CSS
  gradient, not an image. **Most likely LCP element on the Lanzerac page is therefore the H1
  venue name text node or the gradient hero block itself, not an image** — text/gradient LCP
  elements are consistent with the fact this page still scores worst of the four on mobile LCP
  (4.9s) despite shipping no venue photography.
- **Blog post (mobile)**: one hero image flagged directly —
  `https://images.unsplash.com/photo-1706700700231-91a762a35531?auto=format&fit=crop&w=1400&q=80`
  (92,746 bytes, 70,687 wasted/oversized for its rendered box). This is almost certainly the
  actual LCP element for the blog post (hero image at the top of the article, `boundingRect`
  positioned near the top of the page: `top: 337, height: 240`).
- **Home and Venues pages**: no `image-delivery-insight` items returned at all (field was
  `null`), consistent with these pages using CSS gradients rather than a large hero photo — LCP
  is almost certainly a text node (H1/hero heading) on both.

**Recommendation for follow-up**: run `npx lighthouse <url> --output json` locally and inspect
`audits['largest-contentful-paint-element'].details.items[0].node.snippet` directly for an exact
DOM node citation per page, since the wrapper script used here doesn't expose that specific
audit. This is a tooling gap, not a "no LCP element found" result.

---

## 2. Comparison against pre-migration baseline

Baseline (Vite SPA, pre-Astro-rewrite): mobile Performance 70 / desktop 95, mobile LCP 5.2s,
mobile FCP 4.3s, CLS 0.011, TBT 0ms, plus a 780ms redirect penalty (apex 307 → www).

| | Baseline (SPA) | Home (Astro) | Venues (Astro) | Lanzerac (Astro) | Blog (Astro) |
|---|---|---|---|---|---|
| Mobile Performance | 70 | **77 (+7)** | **74 (+4)** | **70 (±0)** | **72 (+2)** |
| Desktop Performance | 95 | **97 (+2)** | **75 (-20)** | **97 (+2)** | **97 (+2)** |
| Mobile LCP | 5.2 s | **4.3 s (-0.9s)** | **4.5 s (-0.7s)** | **4.9 s (-0.3s)** | **4.9 s (-0.3s)** |
| Mobile FCP | 4.3 s | **3.7 s (-0.6s)** | **3.9 s (-0.4s)** | **3.7 s (-0.6s)** | **3.7 s (-0.6s)** |
| CLS | 0.011 | 0 mobile / 0.000257 desktop | 0 mobile / **0.881 desktop** | 0 / 0.0035 | 0 / 0.000257 |
| TBT (mobile) | 0 ms | 0 ms | 0 ms | 110 ms | 85 ms |
| Redirect penalty | 780 ms (apex 307→www) | **Gone** — confirmed `curl -sI https://capevows.co.za/` → `HTTP 200` direct, `time_total` 0.198s; `curl -sI https://www.capevows.co.za/` → `HTTP 301` to apex | | | |

**Verdict: mixed, trending positive, with one clear regression.**

- **Genuinely better**: LCP and FCP have both improved meaningfully on mobile across all four
  URLs (LCP down 0.3-0.9s, FCP down 0.4-0.6s), the 780ms redirect tax is fully gone (confirmed
  live), and mobile Performance score is up on 3 of 4 pages (home +7, venues +4, blog +2;
  Lanzerac is flat at 70, the same score as the old baseline).
- **No page hits "Good" LCP yet.** Every mobile LCP result (4.3-4.9s) is still in the "Poor"
  band (>4.0s) per the 2026 CWV thresholds, and even the best of the four (home, 4.3s) is barely
  inside "Poor" rather than "Needs Improvement" (2.5-4.0s). The rewrite closed roughly 15-25% of
  the LCP gap but has not solved it.
- **Clear regression: `/venues` desktop CLS of 0.881**, more than 80x the old baseline's 0.011
  and 3.5x the "Poor" threshold of 0.25. This did not exist in the pre-migration SPA per the
  baseline figures given. This is the standout new defect from this audit (see Finding 1 above)
  and should be the top remediation priority alongside LCP.
- **Desktop performance score is down 20 points specifically on `/venues`** (75 vs baseline 95,
  and vs 97 on the other three Astro pages) — almost certainly driven by the same CLS blowout,
  since Lighthouse's Performance score is a weighted composite and CLS at score 0.03 drags the
  average down hard even though every other desktop metric on that page is excellent (LCP 0.8s,
  FCP 0.7s, TBT 47ms).
- Mobile TBT is no longer a flat 0ms everywhere (Lanzerac 110ms, blog 85ms) versus the baseline's
  0ms, though both remain far inside the INP-adjacent "Good" territory for main-thread blocking
  and are not a practical concern at these magnitudes.

---

## 3. CrUX field data availability

**Still unavailable for all four URLs tested** — no change from the pre-migration baseline,
which explicitly reported "insufficient Chrome traffic volume for eligibility." Exact API
responses:

- Home: `{"target": "https://capevows.co.za/", "metrics": {}, "collection_period": null, "form_factor": "ALL", "error": "No CrUX data for this origin. The site likely has insufficient Chrome traffic volume for eligibility."}`
- Venues: `"error": "No CrUX data for this URL. The site likely has insufficient Chrome traffic volume for eligibility."`
- Lanzerac: same error, URL-level.
- Blog post: same error, URL-level.

Both origin-level (home) and URL-level (the other three) CrUX lookups came back empty. This
means Google's actual Core Web Vitals assessment (the 75th-percentile field measurement that
feeds the Search Console Core Web Vitals report and any ranking signal) has no real-user data to
draw on yet for this site — everything in this audit is Lighthouse lab-only. Given GSC
impressions are still in the low hundreds per 28-day window (see GSC snapshot in the briefing),
this is expected and will likely remain the case for some time. Re-check with
`python scripts/crux_history.py <url> --json` periodically as traffic grows; do not expect CrUX
eligibility soon.

---

## 4. Total JS shipped per page (React islands + bundle sizes)

Cross-referenced `astro-build/src/pages/*.astro` and `astro-build/src/layouts/Base.astro` for
`client:*` directives against `astro-build/dist/_astro/*.js` file sizes (raw/uncompressed disk
size, not gzip — note PSI's own `total-byte-weight` audit reports slightly different
over-the-wire numbers per request, e.g. `client.DnM_O5Vj.js` shows as 58.7-59.7 KB over HTTP vs
184,048 bytes on disk — the gzip/br compression ratio in production is roughly 3:1, so treat the
dist file sizes below as an upper bound and the PSI byte counts as what the browser actually
downloads).

**Global, loaded on every page via `astro-build/src/layouts/Base.astro`:**
- `NavSavedBadge` (exported from `Favourites.jsx`, `Base.astro:123`, `client:load`) → shares the
  `Favourites.D8wkoEmT.js` chunk (1,725 bytes on disk)
- `CookieBanner` (`Base.astro:141`, `client:load`) → `CookieBanner.Bpjl71PW.js` (1,813 bytes)
- Shared Astro hydration runtime + React DOM/scheduler → `client.DnM_O5Vj.js` (184,048 bytes on
  disk / ~58.7-59.7 KB over the wire per PSI); confirmed by grepping the file for `react-dom`,
  `createRoot`, `hydrateRoot` — all present
- React core → `react.B3l9tXpq.js` (7,555 bytes)
- `jsx-runtime.DIiiIrYY.js` (424 bytes)

**Per-page additions** (`grep -rn "client:load\|client:visible" astro-build/src/pages astro-build/src/layouts`):

| Page | Route file | Islands (directive) | Extra chunk(s) | Extra bytes |
|---|---|---|---|---|
| Home `/` | `index.astro:118,247` | `Favourites` (`client:visible`, per venue card — same shared chunk, no extra download); `GetListedForm` (`client:visible`) | `GetListedForm.DYqDvG0s.js` | 3,356 |
| Venues `/venues` | `venues/index.astro:40` | `VenuesApp` (`client:load`) — imports `Favourites` and `constants.js` internally | `VenuesApp.BPeMOTau.js` + `constants.mhzUJjQR.js` | 5,470 + 974 = 6,444 |
| Venue detail `/venues/lanzerac-wine-estate` | `venues/[slug].astro:123,187,240` | `FaqAccordion` (`client:visible`); `EnquiryModal` (`client:load`, imports `constants.js`); `Favourites` (`client:visible`, shared chunk) | `FaqAccordion.DCW06Zdq.js` + `EnquiryModal.Cy5hI10T.js` + `constants.mhzUJjQR.js` | 863 + 5,618 + 974 = 7,455 |
| Blog post `/blog/wedding-venue-bottelary-road-stellenbosch` | `blog/[slug].astro` | **None** — no `client:*` directives found in the blog page templates at all | — | 0 |

**Approximate total on-disk JS per page** (global + page-specific, dedup'd — every page shares
the same global chunk set so only the first visit per session pays for all of it, subsequent
navigations within the site reuse cached chunks):

- Home: 184,048 + 7,555 + 424 + 1,725 + 1,813 + 3,356 = **198,921 bytes (~194.3 KB)**
- Venues: 184,048 + 7,555 + 424 + 1,725 + 1,813 + 5,470 + 974 = **202,009 bytes (~197.3 KB)**
- Lanzerac: 184,048 + 7,555 + 424 + 1,725 + 1,813 + 863 + 5,618 + 974 = **203,020 bytes (~198.3 KB)**
- Blog post: 184,048 + 7,555 + 424 + 1,725 + 1,813 = **195,565 bytes (~191.0 KB)**

Two other islands exist in the codebase but never load on these four URLs: `SavedVenues`
(`SavedVenues.BitWjRFn.js`, 19,990 bytes — only on `/venues/saved`) and `ResearchPanel`
(`ResearchPanel.DJ0HHczL.js`, 5,695 bytes — only on `/admin`, `noindex`). `VendorContactForm`
(3,224 bytes) only loads on `/vendors` (`noindex`). None of these inflate the four audited pages.

**Takeaway**: the blog post ships zero page-specific islands, yet still downloads the full
~191 KB global baseline (React + Astro hydration runtime) purely to hydrate `CookieBanner` and
`NavSavedBadge` in the nav. That global cost (184,048 bytes / ~58.7 KB gzipped for
`client.DnM_O5Vj.js` alone, per PSI's own byte count) is the single largest fixed JS tax on every
page load, including pages with no interactive content of their own.

---

## 5. Unused JavaScript, re-measured (vs. baseline)

Baseline (pre-migration Vite SPA): GTM 168 KB (70 KB unused), site bundle 84 KB (32 KB unused).

Current Astro build's `unused-javascript` opportunity, quoted directly from PSI JSON
(`totalBytes`/`wastedBytes` per script, identical two-entry shape on all four pages, only the
byte counts vary slightly per page/run):

| Page | GTM total / wasted | Site JS total / wasted (`client.DnM_O5Vj.js`) | Total opportunity (`savings_ms`, mobile) |
|---|---|---|---|
| Home | 171,463 B / 71,051 B wasted | 58,713 B / 31,159 B wasted | 550 ms |
| Venues | 171,464 B / 70,596 B wasted | 58,725 B / 30,632 B wasted | 530 ms |
| Lanzerac | 171,464 B / 71,051 B wasted | 58,725 B / 30,410 B wasted | 710 ms |
| Blog post | 171,460 B / 70,655 B wasted | 58,725 B / 31,165 B wasted | 900 ms |

Comparing like-for-like:

- **GTM is essentially unchanged**: baseline was "168 KB (70 KB unused)"; current measurement is
  ~171.5 KB total with 70.6-71.1 KB unused across all four pages. This is expected — GTM is a
  third-party script untouched by the Astro migration, and its unused-code ratio (~41%) is
  identical within rounding. **Confirmed, not improved or worsened** — GTM was never part of the
  migration's scope.
- **The old single site bundle (84 KB, 32 KB unused = 38% unused) has been replaced by the
  shared `client.DnM_O5Vj.js` runtime chunk (58.7-58.7 KB, 30.4-31.2 KB unused = ~52-53%
  unused)**, plus the small page-specific island chunks listed in Finding 4 above (which are not
  large enough individually to trigger their own `unused-javascript` line item in this report —
  PSI's opportunity threshold only flagged the two biggest scripts per page). In absolute terms
  the shared runtime chunk is *smaller* over the wire (58.7 KB vs 84 KB) but has a *higher*
  proportion unused (52-53% vs 38%), because it's a generic React+Astro hydration bundle that
  must ship `createRoot`/`hydrateRoot`/scheduler code paths regardless of which specific island
  uses them. **Net effect: the total unused-JS byte count is lower in absolute terms (~30-31 KB
  vs 32 KB, roughly flat) but the migration's split-into-many-small-islands architecture has NOT
  meaningfully reduced unused JS the way it theoretically could have** — the dominant cost is
  still one shared monolithic-ish runtime chunk, not per-island code. This is worth flagging:
  the architecture is set up correctly for future improvement (islands are genuinely separate,
  e.g. `FaqAccordion.js` is only 863 bytes and `CookieBanner.js` only 1,813 bytes), but the big
  win would come from reducing what's inside the shared `client.js` runtime itself (e.g.
  confirming tree-shaking is configured correctly for `react-dom/client`, or evaluating whether
  Preact-in-compat-mode could replace React for these small islands — that's a build-config
  question outside a live-site audit's scope, flagging for a follow-up).

---

## 6. Google Fonts render-blocking cost

Playfair Display, Cormorant Garamond and Jost are loaded via the Google Fonts CDN with
preconnect hints (`astro-build/src/layouts/Base.astro`). PSI's `render-blocking-insight`
diagnostic, quoted directly from the JSON response (mobile, all four pages return the same three
or two items):

**Home / Venues / Lanzerac** (three render-blocking requests):
```
{"url": "https://capevows.co.za/_astro/Base.CjP_8D5O.css", "totalBytes": 7123-7131, "wastedMs": 151-177}
{"url": "https://capevows.co.za/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js", "totalBytes": 1239-1241, "wastedMs": 451-527}
{"url": "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap", "totalBytes": 1837, "wastedMs": 751}
```

**Blog post** (two render-blocking requests — Cloudflare's email-decode script doesn't fire on
this page, likely because it has no obfuscated `mailto:` link in the rendered HTML):
```
{"url": "https://fonts.googleapis.com/css2?...", "totalBytes": 1837, "wastedMs": 752}
{"url": "https://capevows.co.za/_astro/Base.CjP_8D5O.css", "totalBytes": 7125, "wastedMs": 151}
```

**The Google Fonts CSS request is the single most expensive render-blocking resource on every
page audited — 751-752ms of wasted/blocking time**, more than the site's own CSS (`Base.css`,
151-177ms) and more than Cloudflare's email-decode script (451-527ms) combined with the CSS. The
`display=swap` parameter is already present in the font URL (confirmed in the query string
above), which prevents invisible-text (FOIT) but does not eliminate the render-blocking cost of
fetching the CSS file itself before the browser knows which `@font-face` rules apply. This is a
genuine, fully-attributable contributor to the mobile LCP/FCP gap noted in Finding 2 (all four
pages' FCP lands at 3.7-3.9s on mobile) since fonts.googleapis.com is a third-party round trip
that blocks style resolution before the critical rendering path can complete.

**Actionable fix** (does not require abandoning Google Fonts, which CLAUDE.md documents as an
intentional choice, only self-hosting or restructuring the load pattern): self-host the three
font families as local `.woff2` files served from `astro-build/public/`, replacing the
`fonts.googleapis.com` `<link>` in `Base.astro` with local `@font-face` declarations. This
removes the third-party DNS/TLS/request round trip entirely (the `preconnect` hints already
present only reduce, not eliminate, that cost) and is the highest-leverage single fix identified
in this audit for mobile FCP/LCP, ahead of image optimisation on the pages that even have
images.

---

## 7. Color-contrast accessibility failures — still present

**Confirmed still failing on all four URLs**, exactly as flagged in the briefing (`--gold
#A07840` on `--cream #FAF7F2` = 3.73:1, `--muted #7A7266` on cream = 4.43:1, both below the 4.5:1
WCAG AA target). Quoted directly from PSI's `accessibility_audits` array (mobile):

- **Home**: `{"id": "color-contrast", "title": "Background and foreground colors do not have a sufficient contrast ratio.", "score": 0, "display": ""}` — only accessibility failure on this page (score 95/100 overall).
- **Venues**: same `color-contrast` failure, PLUS three more not seen on other pages: `{"id": "label", "title": "Form elements do not have associated labels", "score": 0}`, `{"id": "select-name", "title": "Select elements do not have associated label elements.", "score": 0}`, `{"id": "landmark-one-main", "title": "Document does not have a main landmark.", "score": 0}` — this is why Venues scores markedly lower on accessibility (80/100) than the other three pages (91-95/100). The `label`/`select-name` failures point directly at the filter UI's unlabelled form controls (region/type/price/capacity dropdowns in `VenuesApp.jsx`) — worth a dedicated a11y follow-up beyond this performance audit's scope, flagging here since it was surfaced directly by this data pull.
- **Lanzerac**: `color-contrast` + `landmark-one-main` (score 93/100).
- **Blog post**: `color-contrast` + `landmark-one-main` (score 91/100).

The `color-contrast` audit returns `score: 0` (hard fail, not partial credit) on every single
page tested. The pre-migration baseline's 19 WCAG AA contrast failures (per the briefing) have
not been remediated by the Astro rewrite — this was a copy/design-token issue, not a
rendering/architecture issue, so the migration was never going to fix it incidentally. This
remains an open, unresolved, site-wide defect. The additional `landmark-one-main` failure
(missing `<main>` landmark) appearing on 3 of 4 pages but not the homepage is worth a quick
template check (compare `index.astro`'s top-level markup against `venues/[slug].astro` and
`blog/[slug].astro` for a missing `<main>` wrapper) — flagging as a finding here since it
surfaced in this data pull, though a full fix belongs to the accessibility specialist's report.

---

## Findings summary (severity-ranked)

**Critical (1)**
1. `/venues` desktop CLS = 0.881 (score 0.03) — more than 3.5x the "Poor" threshold (0.25) and
   80x worse than the pre-migration baseline (0.011). Directly tanks desktop Performance score
   on that page to 75 vs 97 on every other Astro page tested. Root cause likely the late-hydrating
   filter bar / `VenuesApp` `client:load` layout shift; needs a DevTools trace to confirm the
   exact shifting element. (Finding 1)

**High (3)**
2. No page achieves "Good" mobile LCP (all four: 4.3-4.9s, squarely in "Poor," >4.0s threshold)
   despite real improvement vs. baseline. (Finding 2)
3. Google Fonts CDN request is the single largest render-blocking resource on every page
   (751-752ms wasted, larger than the site's own CSS and Cloudflare's script combined) — highest
   ROI/effort fix identified in this audit (self-host fonts). (Finding 6)
4. `/venues` accessibility score (80) is dragged down by unlabelled filter form controls
   (`label`/`select-name` failures on region/type/price/capacity dropdowns), on top of the
   site-wide contrast failure. (Finding 7)

**Medium (2)**
5. Color-contrast WCAG AA failures (`--gold` 3.73:1, `--muted` 4.43:1) confirmed still failing
   (`score: 0`) on all four URLs post-migration — unresolved, pre-existing, not caused or fixed
   by the rewrite. (Finding 7)
6. `landmark-one-main` (missing `<main>` element) fails on 3 of 4 pages (Venues, Lanzerac, blog
   post) but not the homepage — template inconsistency worth a quick check. (Finding 7)

**Low / informational (3)**
7. CrUX field data still unavailable for all four URLs (origin and per-URL) — no change from
   baseline, expected given current traffic volume. Not a defect, a data-maturity gap. (Finding 3)
8. Unused JS: GTM unchanged (~171.5 KB total, ~70-71 KB unused, same ratio as baseline); the old
   single 84 KB/32 KB-unused site bundle is now a shared 58.7 KB/~30-31 KB-unused runtime chunk
   plus several small island chunks (863 B-5.6 KB each) that are individually too small to
   trigger PSI's opportunity threshold — net unused-byte reduction is real but modest, and the
   split-bundle architecture hasn't yet delivered its full theoretical benefit because the
   dominant cost is still the shared React/Astro runtime, not per-island code. (Finding 5)
9. LCP element could not be directly identified from the PSI JSON schema returned by this script
   (no `lcp-element` audit key present); best available evidence (`image-delivery-insight`)
   suggests the blog post's hero image is the true LCP element, while Home/Venues/Lanzerac (no
   large images on those specific pages, per `TYPE_GRADIENTS` design choice) most likely have a
   text/heading LCP element — recommend a direct `npx lighthouse` run for exact DOM node
   citations. (Finding 1, tooling-gap note)

---

## Files referenced

- `astro-build/src/layouts/Base.astro` (lines 3, 123, 141 — global island directives; font
  `<link>`)
- `astro-build/src/pages/index.astro` (lines 118, 247 — `Favourites`, `GetListedForm`)
- `astro-build/src/pages/venues/index.astro` (line 40 — `VenuesApp`)
- `astro-build/src/pages/venues/[slug].astro` (lines 123, 187, 240 — `FaqAccordion`,
  `EnquiryModal`, `Favourites`)
- `astro-build/src/components/Favourites.jsx` (line 80 — `NavSavedBadge` export, shared chunk)
- `astro-build/src/components/VenuesApp.jsx`, `SavedVenues.jsx`, `EnquiryModal.jsx` (imports of
  `constants.js`, shared chunk)
- `astro-build/dist/_astro/*.js` (built bundle sizes, all cited above)
