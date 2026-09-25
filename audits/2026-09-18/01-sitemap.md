# Sitemap Architecture Audit — Cape Vows (capevows.co.za)
**Date:** 2026-09-18 · **Auditor:** Sitemap Architecture specialist

---

## 1. XML validity and live/repo drift

Fetched live `https://capevows.co.za/sitemap.xml` (HTTP 200, `Content-Type: application/xml`, served by Vercel/Cloudflare, `last-modified: Sat, 12 Sep 2026 13:42:00 GMT`).

Parsed with Python's `xml.etree.ElementTree` (a real XML parser, not regex):

```
WELL-FORMED XML: YES
Total <url> entries: 35
```

**Byte-for-byte comparison:** live sitemap is 7,115 bytes; both `astro-build/dist/sitemap.xml` and `astro-build/public/sitemap.xml` are 7,374 bytes. This looked like drift at first, but the delta (259 bytes) exactly equals the line count (259 lines) — the repo copies are CRLF (Windows line endings), the live-served copy is LF only. After normalizing (`tr -d '\r'`), `diff` between live, dist, and public source returns **exit code 0 — zero differences**. Content is identical; the only variance is line-ending normalization somewhere in the git→build→deploy pipeline (likely Vercel's static file serving or Cloudflare). **No content drift. Pass.**

---

## 2. Full sitemap contents (35 `<loc>` entries)

| URL | lastmod | changefreq | priority |
|---|---|---|---|
| `/` | 2026-05-10 | weekly | 1.0 |
| `/venues` | 2026-05-10 | weekly | 0.9 |
| `/blog` | 2026-05-10 | weekly | 0.8 |
| `/blog/best-wine-estate-venues-franschhoek` | 2026-05-10 | monthly | 0.8 |
| `/blog/budget-friendly-winelands-venues` | 2026-05-10 | monthly | 0.8 |
| `/blog/best-seasons-cape-wedding` | 2026-05-10 | monthly | 0.7 |
| `/blog/marriage-officer-guide-cape-weddings` | 2026-05-10 | monthly | 0.7 |
| `/blog/mountain-backdrop-wedding-venues-western-cape` | 2026-05-10 | monthly | 0.8 |
| `/blog/wedding-venue-bottelary-road-stellenbosch` | 2026-07-07 | monthly | 0.7 |
| `/blog/wedding-venue-prices-stellenbosch-winelands` | 2026-09-03 | monthly | 0.8 |
| `/blog/coastal-wedding-venues-cape-peninsula` | 2026-09-07 | monthly | 0.8 |
| `/venues/babylonstoren` | 2026-05-10 | monthly | 0.9 |
| `/venues/boschendal-wine-estate` | 2026-05-10 | monthly | 0.8 |
| `/venues/cavalli-estate` | 2026-05-10 | monthly | 0.8 |
| `/venues/groot-constantia` | 2026-05-10 | monthly | 0.8 |
| `/venues/hawksmoor-house` | 2026-05-10 | monthly | 0.8 |
| `/venues/nooitgedacht-wine-estate` | 2026-05-10 | monthly | 0.8 |
| `/venues/steenberg-farm` | 2026-05-10 | monthly | 0.8 |
| `/venues/zorgvliet-wines` | 2026-05-10 | monthly | 0.8 |
| `/venues/holden-manz` | 2026-05-10 | monthly | 0.8 |
| `/venues/la-cotte-farm` | 2026-05-10 | monthly | 0.8 |
| `/venues/la-paris-estate` | 2026-05-10 | monthly | 0.9 |
| `/venues/la-roche-estate` | 2026-05-10 | monthly | 0.8 |
| `/venues/mont-rochelle` | 2026-05-10 | monthly | 0.8 |
| `/venues/lanzerac-wine-estate` | 2026-05-10 | monthly | 0.8 |
| `/venues/vrede-en-lust` | 2026-05-10 | monthly | 0.8 |
| `/venues/the-cellars-hohenort` | 2026-05-10 | monthly | 0.8 |
| `/venues/belmond-mount-nelson` | 2026-05-10 | monthly | 0.8 |
| `/venues/the-12-apostles-hotel` | 2026-05-10 | monthly | 0.8 |
| `/venues/saronsberg-wine-estate` | 2026-05-10 | monthly | 0.8 |
| `/venues/cape-point-vineyards` | 2026-05-10 | monthly | 0.8 |
| `/venues/la-petite-ferme` | 2026-05-10 | monthly | 0.8 |
| `/venues/elgin-vintners` | 2026-09-02 | monthly | 0.8 |
| `/venues/lourensford-wine-estate` | 2026-05-10 | monthly | 0.8 |
| `/venues/eikenhof-estate` | 2026-05-10 | monthly | 0.9 |

---

## 3. Coverage cross-check: 35 sitemap URLs vs 39 built routes

39 built routes (per briefing, confirmed against `astro-build/dist/`): `/`, `/venues`, `/venues/saved`, 24× `/venues/<slug>`, `/blog`, 8× `/blog/<slug>`, `/vendors`, `/admin`, `/404`.

`dist/venues/` listing (25 files) and `dist/blog/` listing (8 files) both confirmed by directory read. All 24 slugs in `astro-build/src/data/venues.js` (grepped directly) match the 24 venue URLs in the sitemap exactly, one-for-one — no stale slugs, no missing venues, no extras.

**Routes correctly excluded from the sitemap (4):**
- `/venues/saved` — per-visitor localStorage view, no unique indexable content, correctly excluded
- `/vendors` — noindex per CLAUDE.md ("noindex meta injected while active; not in sitemap")
- `/admin` — noindex, internal tool, correctly excluded
- `/404` — noindex, no canonical, correctly excluded

39 − 4 = 35, matching the sitemap's actual `<url>` count exactly. **No other route is missing and nothing extra/erroneous is present.** Pass.

---

## 4. Lastmod accuracy

31 of 35 URLs (89%) share the identical generic date `2026-05-10` — almost certainly the original site launch date, not a per-page "last meaningfully changed" date. Only 4 URLs have a distinct lastmod:

- `elgin-vintners` → `2026-09-02` — plausible: this venue was renamed from `elgin-ridge-wines` and slug-migrated per CLAUDE.md's fact-check history
- `wedding-venue-bottelary-road-stellenbosch` → `2026-07-07`
- `wedding-venue-prices-stellenbosch-winelands` → `2026-09-03`
- `coastal-wedding-venues-cape-peninsula` → `2026-09-07`

Cross-checked against git history (`git log --follow -- astro-build/src/data/posts.js`):
```
2026-09-07 ab2ff42 fix: coastal post hero image, photographer credit, venue name consistency
2026-09-07 f94d6d4 feat: add coastal Cape Peninsula wedding venues blog post (post 8)
2026-09-03 2edc072 fix: update Stellenbosch post hero image to vineyard/mountain photo
2026-09-03 6cb0f18 feat: add Stellenbosch/Winelands venue pricing blog post (post 7)
2026-09-03 d2bb859 feat: Astro static build alongside Vite app (preview)
```
These three newest blog posts' lastmod dates (09-03, 09-07) **correctly match** their actual creation/edit commits — good practice here.

However, `astro-build/src/data/venues.js` shows only a single commit touching that file: `2026-09-03 d2bb859 feat: Astro static build alongside Vite app (preview)` (the Astro migration commit itself, which copied `VENUES[]` from the legacy `App.jsx`). That means **every one of the CLAUDE.md-documented fact-check corrections** — Lourensford capacity 120→200 + accommodation removal, La Paris capacity changed to "Contact venue", Eikenhof capacity corrected to "Up to 180", Nooitgedacht address/phone corrected, Zorgvliet's "Banghoek"→"Banhoek" fix — all landed inside that same single Astro-migration commit, pre-dating the current git history's granularity for `venues.js`. **Practical implication: the generic `2026-05-10` lastmod on all 23 non-Elgin venue pages is stale relative to the actual git history** (which shows 2026-09-03 as the last touch to the data file), but this is a case of the sitemap under-dating rather than mis-dating — it doesn't overclaim freshness. Still, it fails the "reflect real lastmod" check: **23 of 24 venue pages carry a lastmod that is ~4 months out of step with the file's real last-modified commit (2026-05-10 vs 2026-09-03).** Only `elgin-vintners` was hand-updated to reflect its slug-rename.

**Finding: LOW-MEDIUM severity.** `lastmod` accuracy has no direct Google ranking effect (Google has stated it mostly ignores unreliable lastmod), but an sitemap where 31/35 dates are identical is a classic signal of a generic/unmaintained field, and per the Validation Checks table this project's own rubric flags "All identical lastmod" as a **Low** severity item. Recommend regenerating `lastmod` from real file/data change dates (or dropping the tag if it can't be kept trustworthy — see priority/changefreq discussion below).

---

## 5. Priority logic assessment

Actual priority values in use: **1.0, 0.9, 0.8, 0.7**.

Scheme, as observed:
- `/` = 1.0 (homepage highest — correct)
- `/venues` = 0.9 (hub page — correct, second-highest)
- `/blog` = 0.8 (blog hub)
- Individual venue pages = 0.8, **except** `babylonstoren`, `la-paris-estate`, and `eikenhof-estate` = 0.9 (elevated above their peers, and above `/blog` at 0.8)
- Individual blog posts = 0.8 (5 of 8) or 0.7 (`best-seasons-cape-wedding`, `marriage-officer-guide-cape-weddings`, `wedding-venue-bottelary-road-stellenbosch`)

This is a coherent tier structure at the top (homepage > venues hub > blog hub > detail pages), but two things undercut it:

1. **Google Search has explicitly ignored the `<priority>` tag for years** (confirmed current as of this audit — Google's own sitemap documentation states priority and changefreq are not used in ranking or crawl-prioritization decisions). Per the project's own Validation Checks table, `priority`/`changefreq` are correctly marked **Info / "Can remove"**. Maintaining a granular 4-tier priority scheme that Google does not consume is engineering effort with zero SEO payoff.
2. **The 3 venues elevated to 0.9 (babylonstoren, la-paris-estate, eikenhof-estate) have no documented rationale visible in the sitemap file or CLAUDE.md** — it doesn't correspond to the price-tier groupings, the fact-check-verified set, or the GSC-impression leaders (eikenhof-estate is the GSC leader at 137 impressions and its 0.9 makes sense post-hoc, but babylonstoren and la-paris-estate are not GSC leaders per the briefing's snapshot — la-paris-estate has 11 impressions, babylonstoren has 2, both far below cape-point-vineyards, la-roche-estate, groot-constantia, boschendal at 0.8). This reads as either a stale manual decision or an inconsistency, not a live-data-driven scheme.

**Finding: INFO severity** (per the project's own rubric). Functionally harmless since Google ignores it, but recommend either (a) removing `priority`/`changefreq` entirely to reduce manual-maintenance surface, or (b) if kept for non-Google consumers (some smaller crawlers/tools do read it), re-deriving the 0.9 venue tier from a real, documented signal (e.g. GSC impressions or the "Contact Venue"-tier exclusion) rather than leaving it unexplained.

---

## 6. elgin-ridge-wines stale slug check

```
$ grep -c "elgin-ridge-wines" live_sitemap.xml
0
```

Zero matches in the live sitemap. The correct current slug `elgin-vintners` is present with its own distinct `lastmod` (2026-09-02, see §4). **Confirmed fixed.**

---

## 7. Manual sitemap vs `@astrojs/sitemap` integration

Checked `astro-build/astro.config.mjs`:
```js
integrations: [react()],
output: 'static',
site: 'https://capevows.co.za',
trailingSlash: 'never',
build: { format: 'file' }
```
No `@astrojs/sitemap` integration is installed; the sitemap is the hand-maintained file at `astro-build/public/sitemap.xml`.

**Recommendation: keep the manual file.** Reasoning:
- `@astrojs/sitemap` auto-discovers routes from the file-based router and would **automatically include `/venues/saved`, `/vendors`, and `/admin`** unless explicitly configured with a `filter` function to exclude them — that's a real regression risk (indexable-surface increase) for a small team to remember to configure correctly and keep in sync every time a new noindex route is added.
- Auto-generation does **not** produce meaningful `lastmod` by default (it stamps build time, i.e. every URL gets the same value on every deploy — arguably worse than the current "mostly-2026-05-10" situation, since it would make ALL 35 URLs identical and change on every single deploy regardless of whether that page's content changed).
- Given §5's finding that `priority`/`changefreq` are Google-ignored anyway, the integration's main theoretical benefit (auto-sync as routes are added/removed) is real but modest at this site's scale (24 venues, 8 posts, additions are infrequent and already require a manual `venues.js`/`posts.js` edit in the same PR).
- The manual file's actual weak point isn't "manual" — it's that `lastmod` isn't being regenerated on each content edit as a matter of process. That's a process fix (update the 1-2 relevant `<lastmod>` lines whenever `venues.js`/`posts.js` changes), not a tooling fix.
- If venue/post count grows substantially (dozens more), reconsider — but at 32 content URLs, manual maintenance with a `filter` discipline is lower-risk than trusting an integration to correctly exclude 3 noindex routes forever.

**Verdict: keep manual `sitemap.xml`.** Tighten process instead: add a one-line reminder to CLAUDE.md's "When adding new venues" checklist to also bump that venue's/post's `<lastmod>` in `sitemap.xml` when its data is edited (not just when it's added) — this is the actual gap, not the manual-vs-automated question.

---

## 8. robots.txt Sitemap directive (live check)

```
$ curl -s https://capevows.co.za/robots.txt
...
Sitemap: https://capevows.co.za/sitemap.xml
```

Confirmed present on the **live** site (not just the repo copy). Full live robots.txt also confirms `User-agent: *` → `Allow: /` and explicit `Allow: /` for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bingbot — consistent with CLAUDE.md's documented GEO/AI-citation strategy. **Pass.**

---

## 9. URL-per-file limit (check #5, scope item 5)

35 URLs total, far below the 50,000-per-file limit. No sitemap index needed at current or realistically foreseeable scale. **Pass, no action.**

---

## 10. Location-page quality gate (per this specialist's standing brief)

Cape Vows' 24 venue pages are **not programmatic city/location-swapped doorway pages** — each has a distinct name, address, factual description (many now source-verified per CLAUDE.md's fact-check pass), and type/region-specific FAQ content generated from real per-venue data fields (`getVenueFaqs`). This is well under the 30-page WARNING threshold in volume regardless, and qualitatively these read as the "Safe at Scale" pattern (real specs, not thin templated swaps), not the "Penalty Risk" pattern. **No quality gate triggered, no action needed.**

---

## Findings summary by severity

| Severity | Count | Findings |
|---|---|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | — |
| Low | 1 | §4 — 23 of 24 venue pages carry a generic/stale `lastmod` (2026-05-10) that doesn't reflect the actual 2026-09-03 last-touch commit to `venues.js`; only `elgin-vintners` was hand-corrected |
| Info | 2 | §5 — priority scheme's 0.9 tier (babylonstoren, la-paris-estate, eikenhof-estate) has no documented/current rationale (Google ignores priority regardless, so this is informational, not a ranking risk); §7 — recommend keeping manual sitemap but tightening the lastmod-update step in the content-edit process |
| Pass (confirmed, no issue) | 6 | XML well-formed; live/dist/public byte-identical (line-ending only diff); 35/35 URL coverage exactly matches 39 routes − 4 correctly-excluded; zero `elgin-ridge-wines` references; live robots.txt has correct `Sitemap:` directive and AI-crawler allowlist; well under 50k URL limit; no location-page doorway pattern |

**Items not independently re-checked per briefing instructions:** GSC URL Inspection batch (`_inspect_raw.json`) was still running in the background per the briefing and was not polled for this report — if it has since landed, cross-referencing GSC's own "discovered sitemap" status against this file's 35 URLs would be a good follow-up but was out of the time budget for this pass.

---

**File:** `C:\Users\chadl\Documents\GitHub\cape-vows\audits\2026-09-18\01-sitemap.md`
