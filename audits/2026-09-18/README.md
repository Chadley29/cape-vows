# Cape Vows SEO Audit — 2026-09-18

## Executive summary

This audit confirms the Astro migration (deployed ~3 Sept 2026) is working:
apex and www redirects are correct, all 24 venue pages serve full static
HTML, and 22 of 24 have been recrawled with the new canonical. The
migration's own falsification test — venue-page GSC impressions — moved
from 2/24 pre-migration to **8/24** this pull, a real if partial result;
16 pages remain invisible, so the test stays open for the 30-day recheck.

The single worst finding is new, not inherited: **`/venues` desktop Core
Web Vitals CLS of 0.881**, independently reproduced live, caused by the
entire page content popping in after `VenuesApp` hydrates rather than
reserving layout space. It's a small, well-scoped fix (Item 1). Three
independent audit passes converged on a live factual error costing real
credibility on the site's highest-traffic page: Eikenhof Estate's capacity
is stated as "80 guests" in one post against the correct "180" elsewhere
on the same site — also a one-line fix (Item 4). The GEO/AI-citation gap
flagged by two specialists (FAQ answer text missing from server-rendered
HTML, present only in JSON-LD) is real and fixable in one component.

The strategic question — build regional landing pages or expand the
24-venue directory — has a clear answer from the evidence: **build two
regional-hub enhancements to `/venues` first** (a Stellenbosch-specific
page is the single highest-confidence build in the whole audit per the
SXO analysis), and treat directory expansion as a separate, slower,
ongoing track gated by a confirmed absence of tooling (`/admin`'s venue
extractor has no working save path) and an existing 3-venue verification
backlog. Full reasoning in `02-action-plan.md`.

## Headline result: venue-page impressions

| | Pre-migration | This pull (28d, 21 Aug–15 Sep) |
|---|---:|---:|
| Venue pages with any GSC impressions | 2/24 | **8/24** |
| Top venue page | la-roche-estate (6 imp) | eikenhof-estate (137 imp) |
| Impressions with clicks | — | 1 (groot-constantia) |

Trending the right way, not yet proven. Re-check in 30 days — see the
measurement plan in `02-action-plan.md`.

## Top 5 actions

1. **Fix `/venues` desktop CLS (0.881 → target <0.1)** — reserve layout
   space before `VenuesApp` hydration. `astro-build/src/pages/venues/index.astro`
2. **Fix the meta-description overflow formula** (29/40 pages exceed 160
   chars from one hardcoded `.substring(0, 130)`). One line.
   `astro-build/src/pages/venues/[slug].astro:31`
3. **Make FAQ answers server-rendered text**, not JSON-LD-only.
   `astro-build/src/components/FaqAccordion.jsx`
4. **Correct Eikenhof Estate's capacity** in the site's top-traffic post
   ("80 guests" → "180 guests"), plus Nooitgedacht's mis-stated price
   tier in a second post. `astro-build/src/data/posts.js:100,327`
5. **Build the Stellenbosch regional hub** — the SXO audit's
   highest-confidence recommendation, backed by the Bottelary Road post
   already proving the narrow-page pattern works (site's best position,
   beating a named live competitor).

## All files produced

| File | Contents |
|---|---|
| `00-gsc.md` | Search Console: 3-pull comparison, venue-page impressions, full 42-URL Inspection table, striking distance, brand-confusion quantification, GEO signal note |
| `01-technical.md` | Crawlability, redirects, 404s, canonicals, JS-rendering gaps (worktree-recovered) |
| `01-onpage.md` | Title/description/H1 inventory across all 40 built pages, duplicate check, per-page table |
| `01-schema.md` | JSON-LD validation across all schema types, CLAUDE.md documentation-drift notes |
| `01-content-eeat.md` | Full em-dash/SA-English scan of all 8 posts, factual cross-check of every venueLinks claim against `venues.js` |
| `01-images.md` | Image inventory, alt coverage, CLS-safety confirmation, og-image/favicon check |
| `01-sitemap.md` | XML validation, live/repo drift check, lastmod accuracy, priority logic |
| `01-local.md` | NAP consistency, regional content-depth gaps, GBP open question (worktree-recovered) |
| `01-geo.md` | AI-crawler readiness, FAQ-answer visibility (critical finding), llms.txt draft, passage citability |
| `01-sxo.md` | 10-query SERP-intent analysis, regional-hub verdict (worktree-recovered) |
| `01-performance.md` | PageSpeed mobile+desktop on 4 URLs vs. pre-migration baseline, CLS regression discovery |
| `01-backlinks.md` | Free-tier backlink check (null result, honestly reported), 15-item SA directory target list (worktree-recovered) |
| `02-action-plan.md` | Master ranked action table, em-dash inventory + CLAUDE.md contradiction, contrast-fix proposal with ΔE2000, strategic recommendation, 30/60/90-day measurement plan |
| ~~`Cape-Vows-SEO-Report-2026-09-18.pdf`~~ | **Not produced — see below.** |

## Where tools ran degraded

- **GA4:** not configured (no property ID) — every GA4-dependent check
  across all reports explicitly states this rather than fabricating
  numbers.
- **DataForSEO:** not installed — all specialist audits used free-tier
  fallbacks only (Common Crawl, live `curl`, PageSpeed/CrUX via the
  configured API key, `WebSearch` for SXO's SERP checks).
- **Backlinks:** Tier 0 only (no Moz/Bing key). Common Crawl returned a
  genuine null result (`in_crawl: false`) rather than data — reported
  honestly in `01-backlinks.md`, not padded.
- **SXO SERP fetches:** direct Google SERP fetch was blocked; the SXO
  agent used `WebSearch` as a labeled proxy instead, disclosed explicitly
  in that report.
- **Local/GBP:** whether a Google Business Profile already exists for
  Cape Vows could not be determined from the repo — flagged as an open
  question for the operator, not guessed at.
- **7 of 9 Phase 1 specialist agents hit their per-turn budget mid-task**
  and required an explicit resume instruction to finish; all 9 ultimately
  completed. 3 agents (technical, local, sxo) wrote their final reports
  into isolated git worktrees rather than the shared `audits/` directory
  due to a tool-level path restriction — I detected this by checking each
  file's actual location after every completion notification (not
  trusting the agent's own self-reported path) and copied the three
  affected files into the canonical location before this synthesis. All
  12 files are confirmed present in `audits/2026-09-18/` as of this
  writing.
- **Four specific factual/technical claims were independently
  re-verified** rather than taken at face value: the Eikenhof capacity
  and Nooitgedacht tier errors (direct grep against source), the `/venues`
  CLS number (independently re-run against the live PageSpeed API), and
  the `elgin-vintners` "Redirect error" (live `curl` check). All four
  held up.
- **The PDF report was not produced.** `scripts/google_report.py`
  imports WeasyPrint unconditionally for PDF rendering, and WeasyPrint
  requires native GTK/Pango libraries (`libgobject-2.0-0` and friends)
  that aren't installed on this machine — it fails at import time with an
  `OSError` before reaching any report logic. Installing system-level
  native libraries is outside this task's authorized scope (writes were
  limited to `audits/2026-09-18/` and `astro-build/dist/`), so I did not
  attempt it. All findings that would have gone into the PDF are fully
  captured in the 13 markdown files above — nothing was lost, only the
  PDF rendering step itself didn't run. To produce it: install the GTK3
  runtime for Windows (e.g. via MSYS2: `pacman -S mingw-w64-x86_64-gtk3`,
  with that MSYS2 `bin/` directory on `PATH`), then re-run
  `python scripts/google_report.py --domain capevows.co.za --output-dir
  audits/2026-09-18` from `C:/Users/chadl/.claude/skills/seo`.
