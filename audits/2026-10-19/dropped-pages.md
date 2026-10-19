# Dropped and stale pages — detail

**Date:** 2026-10-19 · **Sources:** `_inspect_raw.json` (URL Inspection,
pulled 2026-10-19), `astro-build/dist/` (built 2026-09-25 12:58 local),
`astro-build/src/data/venues.js`, page-level impressions from
`_gsc_pages_raw.json`. No new API calls were made for this report. It
reports findings only and proposes no changes to venue facts.

## 1. Inspection status

| URL | `coverage_state` (exact) | `last_crawl_time` | `page_fetch_state` | `google_canonical` | `user_canonical` | Match |
|---|---|---|---|---|---|---|
| `/venues/belmond-mount-nelson` | Crawled - currently not indexed | 2026-08-23T14:58:41Z | SUCCESSFUL | `https://capevows.co.za/venues/belmond-mount-nelson` | `https://capevows.co.za/` | ✗ |
| `/venues/saronsberg-wine-estate` | Crawled - currently not indexed | 2026-09-05T16:16:45Z | SUCCESSFUL | `https://capevows.co.za/venues/saronsberg-wine-estate` | `https://capevows.co.za/venues/saronsberg-wine-estate` | ✓ |
| `/venues/la-petite-ferme` | Crawled - currently not indexed | 2026-09-04T08:45:39Z | SUCCESSFUL | `https://capevows.co.za/venues/la-petite-ferme` | `https://capevows.co.za/venues/la-petite-ferme` | ✓ |
| `/venues/lourensford-wine-estate` | Submitted and indexed | 2026-08-22T23:56:59Z | SUCCESSFUL | `https://capevows.co.za/venues/lourensford-wine-estate` | `https://capevows.co.za/` | ✗ |
| `/venues/elgin-vintners` | Redirect error | 2026-09-03T10:08:34Z | REDIRECT_ERROR | `null` | `null` | — |
| `/blog/wedding-venue-bottelary-road-stellenbosch` | Submitted and indexed | 2026-09-06T06:57:09Z | SUCCESSFUL | `https://capevows.co.za/blog/wedding-venue-bottelary-road-stellenbosch` | `https://capevows.co.za/blog/wedding-venue-bottelary-road-stellenbosch` | ✓ |

Other fields: all six are `robots_txt_state: ALLOWED` and `crawled_as:
MOBILE`. `indexing_state` is `INDEXING_ALLOWED` for five of them and
`INDEXING_STATE_UNSPECIFIED` for `elgin-vintners`, because Google never
got a fetched page to evaluate. Google-recorded `referring_urls` are empty
for the three dropped pages and Lourensford. For `elgin-vintners` it lists
`/blog/wedding-venue-prices-stellenbosch-winelands`, and for the Bottelary
post `/blog`.

**Canonical mismatches.** Belmond and Lourensford show `user_canonical =
https://capevows.co.za/`. That is the declared canonical *as of Google's
last crawl* (22–23 Aug), i.e. the pre-migration SPA whose canonical
pointed at the homepage. The built pages declare their own URL: both
`dist` files have `rel="canonical"` pointing at themselves. Google has not
fetched either page since the migration.

## 2. Which "not indexed" state

All three pages that dropped out read **"Crawled - currently not
indexed"**: Belmond Mount Nelson, Saronsberg Wine Estate, La Petite Ferme.
None reads "Discovered - currently not indexed" or "URL is unknown to
Google".

This means Google fetched each page successfully, has a copy, and chose
not to index it. It is not a discovery or fetch failure. All three were
"Submitted and indexed" in the 2026-09-18 inspection, with the same
`last_crawl_time` as now. They were dropped without being re-fetched.

Caveat for Belmond: the copy Google holds is from 2026-08-23, the old SPA
build, not the static page in `dist`. Saronsberg (5 Sep) and La Petite
Ferme (4 Sep) were crawled after the 3 Sep cutover, so Google's copy is
the static build.

## 3. Inbound internal links (from `astro-build/dist`)

Method: parsed every `.html` file in `dist` (41 pages) and counted
`<a href>` links resolving to each target, normalising
`https://capevows.co.za`, `.html` suffixes, query strings and fragments.
Self-links are excluded. I also searched for the slug anywhere else in the
HTML (e.g. island props or button handlers): there are no non-`<a>`
mentions for any target, so every link counted is a plain crawlable
anchor.

| Target | `<a>` links | Linking pages | Linked from |
|---|---:|---:|---|
| `/venues/belmond-mount-nelson` | 2 | 2 | `/venues`, `/venues/hawksmoor-house` |
| `/venues/saronsberg-wine-estate` | 2 | 2 | `/venues`, `/blog/mountain-backdrop-wedding-venues-western-cape` |
| `/venues/la-petite-ferme` | 2 | 2 | `/venues`, `/blog/wedding-venue-prices-stellenbosch-winelands` |
| `/venues/lourensford-wine-estate` | **1** | **1** | `/venues` |
| `/venues/elgin-vintners` | 2 | 2 | `/venues`, `/blog/wedding-venue-prices-stellenbosch-winelands` |
| `/blog/wedding-venue-bottelary-road-stellenbosch` | 3 | 3 | `/blog`, `/venues/eikenhof-estate`, `/venues/nooitgedacht-wine-estate` |

No nav or footer link points at any of the six.

**For comparison: the five venue pages with the most impressions**

| Venue | Page impressions (21 Sep–16 Oct) | `<a>` links | Linking pages |
|---|---:|---:|---:|
| eikenhof-estate | 834 | 7 | 6 |
| la-paris-estate | 284 | 4 | 4 |
| lanzerac-wine-estate | 122 | 6 | 6 |
| babylonstoren | 91 | 19 | 18 |
| boschendal-wine-estate | 91 | 18 | 18 |

**Why the counts are lopsided.** The "More venues in [region]" block on
each venue page (`astro-build/src/pages/venues/[slug].astro:36-38`) links
to the **first three same-region venues in `VENUES[]` array order**:

- **Cape Winelands (16 venues).** The first three are Babylonstoren,
  Boschendal and Cavalli. Every Winelands venue page links to those three,
  which is where Babylonstoren's and Boschendal's 16 venue-page links come
  from. Saronsberg (#13 in that region's order), La Petite Ferme (#14) and
  Lourensford (#15) never appear in another venue page's region block.
  Eikenhof (#16) doesn't either; its links all come from blog posts, the
  homepage and `/venues`.
- **Cape Town City (2 venues: Hawksmoor House, Belmond Mount Nelson).**
  Belmond gets exactly one region link, from Hawksmoor.
- **Overberg (1 venue: Elgin Vintners).** No region siblings, so it gets no
  region links.

The homepage's "A Few We'd Start With" links (Eikenhof and Babylonstoren
in this build) come from the weekly rotation, frozen at the 2026-09-25
build, so they change with each deploy.

## 4. Description word counts

Word count of the `description` field in `venues.js`. I confirmed the same
text appears in each `dist` page, so the build matches the source. For
context, I also give the whole-page word count excluding `<nav>`,
`<footer>`, `<script>` and `<style>`. That figure includes the templated
FAQ, details card, region block and related reading.

| Venue | Status | Page impressions | Description words | Whole-page words |
|---|---|---:|---:|---:|
| belmond-mount-nelson | Crawled - currently not indexed | 6 | **42** | 491 |
| saronsberg-wine-estate | Crawled - currently not indexed | 2 | **38** | 663 |
| la-petite-ferme | Crawled - currently not indexed | 6 | **46** | 663 |
| eikenhof-estate | Indexed | 834 | 47 | 736 |
| la-paris-estate | Indexed | 284 | 33 | 730 |
| lanzerac-wine-estate | Indexed | 122 | 40 | 789 |
| babylonstoren | Indexed | 91 | 36 | 621 |
| boschendal-wine-estate | Indexed | 91 | 28 | 647 |
| *Top-5 mean* | | | *36.8* | *705* |

All three dropped pages have **longer descriptions than the top-5 mean**.
La Petite Ferme (46) and Belmond (42) are longer than every top-5 venue
except Eikenhof (47). Description length does not separate the indexed
pages from the dropped ones.

Whole-page length is close too. Saronsberg and La Petite Ferme (663) fall
inside the top-5 range (621–789). Belmond (491) is the shortest, consistent
with having only one region sibling and no Related Reading block. But
Google's copy of Belmond is the 23 Aug SPA build, not this page, so its
`dist` word count isn't what Google evaluated.

Every venue page carries the same fixed structure: 6 `features[]`, a
one-line `highlight`, and 5 generated FAQs. Descriptions across all 24
venues range from 26 to 47 words. The distinctive per-venue text is
therefore roughly 40–60 words in a ~500–800-word page that is otherwise
templated, and that holds for indexed and dropped pages alike.

## Summary of what the data shows

- All three drops are **"Crawled - currently not indexed"**, recorded
  without a recrawl. Google re-evaluated copies it already held.
- **Internal links are the clearest difference.** The three dropped pages,
  Lourensford and Elgin Vintners each have 1–2 inbound links. The five
  highest-impression venue pages have 4–18 linking pages. The gap comes
  from array order in the region block, not from editorial choice.
- **Description length is not the difference.** The dropped pages have
  longer descriptions than the top-5 average.
- **Belmond and Lourensford** are still judged on the pre-migration SPA
  copy (homepage canonical). Belmond has been dropped; Lourensford, also
  stale and with a single inbound link, is still indexed as of this
  inspection.
- **The Bottelary post** is indexed with a matching canonical and three
  inbound links. Its last crawl (2026-09-06) predates the September edits
  and the 2026-09-25 build.
