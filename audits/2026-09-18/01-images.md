# 01 — Image SEO & Optimization

**Method:** Parsed every `<img>` tag across all 40 files in `astro-build/dist/`
via script (`_images_raw.json` has the full dataset), plus direct byte
inspection of `og-image.jpg` and the favicon set in `astro-build/public/`.

## Summary

| Check | Result |
|---|---|
| Total `<img>` tags site-wide | **44** |
| Images with missing/empty `alt` | **0** |
| Images with `width`/`height` attributes | **0 of 44** |
| Images with `loading="lazy"` | 26 of 44 (the 18 without are all blog-post hero images — see Finding 2, this is correct) |
| Distinct source images | **8** (all Unsplash, all blog hero photos) |
| Local/self-hosted `<img>` content images | **0** — every content image is a remote Unsplash URL |
| og-image.jpg | 1200×630px, 88.7 KB, JPEG |
| Favicon set | 6 files, 476 B – 23.9 KB, all present |

## Finding 1 — Zero images across the entire site have explicit `width`/`height`

Every single `<img>` tag in the built HTML (44 of 44) omits both `width` and
`height` attributes. This is the modern-day CLS risk pattern: without
intrinsic dimensions (either HTML attributes or a CSS `aspect-ratio`), the
browser can't reserve layout space before the image downloads, which is one
of the most common causes of layout shift.

**Confirmed, not just suspected:** [`astro-build/src/styles/global.css:116`](astro-build/src/styles/global.css#L116)
sets `.blog-card-img { width: 100%; height: 200px; object-fit: cover; }`
and [`global.css:125`](astro-build/src/styles/global.css#L125) sets
`.blog-post-hero { width: 100%; height: 380px; object-fit: cover; }`
(240px on mobile per the media query at line 146). Every one of the 44
`<img>` tags site-wide falls into one of these two classes, so every
single one already has a hardcoded pixel height from CSS regardless of the
missing HTML attributes — this is exactly why the pre-migration PageSpeed
baseline measured CLS at **0.011** (excellent; Google's "Good" threshold is
<0.1) despite no image having explicit `width`/`height`. **Re-verify CLS
on the new Astro build in `01-performance.md`** rather than assuming the
old number still holds, but there is no structural reason it would have
changed — the CSS driving this behaviour is unmodified by the migration.

Recommended fix regardless: add explicit `width="1400" height="933"` (or
the correct aspect ratio for each Unsplash crop) to every blog hero `<img>`
tag. This is defence-in-depth — it makes the layout-stability guarantee
explicit in HTML rather than implicit in CSS that a future refactor could
silently break, and it's a Lighthouse "Image elements do not have explicit
width and height" flag either way, worth clearing for a clean audit even
though it isn't visibly broken today.

## Finding 2 — `loading="lazy"` pattern is correct, not a bug

18 of 44 `<img>` tags lack `loading="lazy"` — every one of them is a blog
post's own hero image, rendered on that post's own page
(`blog/<slug>.html`). This is the right call: that hero image is very
likely the LCP (Largest Contentful Paint) element for a blog post page
(large, above-the-fold, first meaningful content), and lazy-loading an LCP
candidate actively *delays* LCP by deferring the fetch until the browser
resolves layout — the opposite of what you want. The 26 tags that *do* have
`loading="lazy"` are all instances of the same 8 images re-used as
below-the-fold thumbnails: on `/blog` (listing cards), the homepage teaser
grid, and inside "Related Reading" blocks on venue pages. Correctly lazy in
all three contexts.

**No change recommended for this pattern** — it's already doing the right
thing. Confirm in `01-performance.md`'s PageSpeed run which element is
actually flagged as LCP per template to be certain.

## Finding 3 — every content image is a remote Unsplash fetch, zero local/optimized images

This is a known, deliberate choice (CLAUDE.md: *"Do not replace gradients
with stock images — this was a deliberate brand decision"* for venue
cards specifically), but it's worth stating precisely what it means in
practice for the 8 blog hero images that DO use stock photography:

- All 8 are fetched live from `images.unsplash.com` at request time —
  Cape Vows has no control over their format (Unsplash serves whatever the
  `?w=`/`?fit=` query params request, typically JPEG) or caching beyond
  whatever Unsplash's CDN does.
- **No WebP/AVIF opportunity exists on the Cape Vows side** for these
  images specifically, because they're not self-hosted — the format is
  entirely Unsplash's choice. If Cape Vows wanted WebP/AVIF for these, the
  only path is downloading and re-hosting the 8 images locally (which
  trades "always fresh, zero storage cost" for "one-time optimization,
  ongoing hosting"). Given this is a solo-operator project with 8 total
  hero images, re-hosting is a low-effort, one-time task if desired — not
  urgent, backlog-tier.
- Venue cards (`.card-banner`) use CSS gradients (`TYPE_GRADIENTS`) per
  the explicit brand decision — genuinely zero image weight there, which
  is a performance positive worth stating plainly: 24 venue cards ship
  with **no image bytes at all** for their banner art.

## Finding 4 — `og-image.jpg`

1200×630px — this is the canonical recommended OG image size (Facebook,
LinkedIn, and Twitter/X's `summary_large_image` card all use this ratio
natively, no cropping). 88.7 KB is a reasonable file size for a 1200×630
JPEG; not flagged as needing compression. CLAUDE.md's own note ("check if
it has a count baked into the graphic... likely fine") is unresolved here
because it requires visual inspection, not byte inspection — I can confirm
the file exists, is the right dimensions, and is a reasonable size, but
cannot confirm what text is rendered inside it without viewing the image
directly. Flagging as unresolved rather than guessing.

## Finding 5 — Favicon set is complete

| File | Size |
|---|---:|
| `favicon.svg` | 476 B |
| `favicon-96x96.png` | 3,233 B |
| `favicon.ico` | 15,086 B |
| `apple-touch-icon.png` | 6,521 B |
| `web-app-manifest-192x192.png` | 7,044 B |
| `web-app-manifest-512x512.png` | 23,910 B |

All 6 standard sizes present, all referenced from `Base.astro`'s `<head>`
(confirmed in the on-page audit's raw HTML dump — every page links
`favicon-96x96.png`, `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`,
plus `site.webmanifest` referencing the two web-app-manifest PNGs). No gaps.

## Not applicable / no findings

- **Alt text coverage: 100%, zero missing or empty `alt` attributes** —
  genuinely clean, nothing to flag.
- **Broken image links:** not tested live (would require fetching all 8
  Unsplash URLs) — low risk given these are stable, long-standing Unsplash
  CDN URLs already verified reachable in earlier sessions when each post
  was authored.
