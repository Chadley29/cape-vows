# Cape Vows — Design, UX & Conversion Audit

*Evaluation only. No code changed. Prepared against the codebase at `main`, the `frontend-design` skill principles, and the constraints in `CLAUDE.md`.*

---

## Executive Summary

**This site does not need a redesign, and I want to say that plainly before the criticism starts: the design system is genuinely good.** The Playfair / Cormorant / Jost pairing, the cream-green-gold palette, and the italic-`<em>` motif are deliberate, cohesive, and already clear of the generic "AI slop" the frontend-design skill warns against. An overhaul would throw away a real asset and burn time you don't have.

The problem is not *how it looks* — it's that **the site doesn't sell, and it doesn't prove.** A wedding-venue directory is an emotional, photo-driven, trust-driven purchase, and this site is currently winning on neither axis: there is **zero venue photography** (gradients stand in everywhere except the blog) and **zero third-party trust signal** (no testimonials, no reviews, no "no ads, no fees" anywhere a couple actually sees it). On top of that, the **single most valuable action — enquire — is buried below the fold on mobile**, which is your primary audience.

**Verdict: targeted incremental improvements, not an overhaul.** The highest-ROI work is conversion and trust plumbing that costs hours, not weeks. The one genuinely hard problem — real photography — is already on your roadmap and is correctly the strategic #1. Everything else in this document is a quick or moderate win that compounds on the design you already have.

---

## Prioritised Issue Table

Ranked by **impact-to-effort ratio (best ROI first)**. Effort: **Quick** = under a half-day, single-file edits · **Moderate** = half-day to ~2 days · **Major** = multi-day, external dependency, or architectural.

| # | Issue | Dimension | Impact | Effort | ROI |
|---|-------|-----------|:------:|:------:|:---:|
| 1 | "No ads, no fees" + verification promise never shown to couples | Conversion / Trust | High | Quick | ★★★★★ |
| 2 | No social proof anywhere (testimonials, reviews, counts) | Conversion | High | Quick–Mod | ★★★★★ |
| 3 | Mobile: primary "Enquire" CTA sits below all content, no sticky | UX / Conversion | High | Quick–Mod | ★★★★★ |
| 4 | Homepage over-indexes on vendor/owner CTAs vs. couples | Conversion / IA | Med–High | Quick | ★★★★☆ |
| 5 | Enquiry success state is a dead end (peak-end rule) | Conversion | Med | Quick | ★★★★☆ |
| 6 | Vendors page is a "Coming Soon" dead-end in primary nav | UX / IA | Med | Quick | ★★★★☆ |
| 7 | No ethical scarcity (peak-season booking urgency) on venue pages | Conversion | Med | Quick | ★★★★☆ |
| 8 | Scroll reveals absent; card hover (`scale 1.01`) imperceptible | Modern Web | Med | Quick | ★★★★☆ |
| 9 | Cookie banner: "Dismiss" silently *accepts* (mild dark pattern) | Trust / Compliance | Med | Quick | ★★★★☆ |
| 10 | Sub-44px tap targets + 0.62rem labels (mobile a11y) | UX / Mobile | Med | Quick | ★★★★☆ |
| 11 | Filters don't persist in URL (no share, no back, no SEO landing) | UX / SEO | Med | Moderate | ★★★☆☆ |
| 12 | Fonts/CSS injected at runtime — FOUT, JS-blocked first paint | Performance | Med | Quick–Mod | ★★★☆☆ |
| 13 | No "About / How we verify" page (E-E-A-T, GEO, trust) | Trust / SEO | Med | Moderate | ★★★☆☆ |
| 14 | Venue detail page: thin main column, wall of green feature chips | Visual / UX | Low–Med | Quick–Mod | ★★★☆☆ |
| 15 | Regional map navigation opportunity (SVG, **not** D3) | Modern Web / IA | Med | Moderate | ★★★☆☆ |
| 16 | Dead `VENDORS` dataset (with unverified data) shipped in bundle | Code / Risk | Low–Med | Quick | ★★★☆☆ |
| **S1** | **No real venue photography (gradients everywhere)** | **Visual / Conversion** | **Highest** | **Major** | **Strategic #1** |
| S2 | Client-only render limits AI-crawler / GEO citation | SEO / GEO | Med–High | Major | Strategic |

> The two **S** items have outsized strategic impact but high effort, so they rank low on pure ROI math. Don't let the ratio fool you — **S1 is the real ceiling on this business** and is addressed in the action sequence.

---

## 1. Visual Design & Brand

### What's working (don't touch it)
- **The type system is the star.** Playfair Display for display, Cormorant Garamond for body, Jost for labels is a confident editorial pairing that reads as *designed*, not defaulted. The italic gold `<em>` highlight running through every title is a genuine brand signature. This is exactly the "distinctive, characterful font choice" the skill asks for.
- **Palette is cohesive and on-brand.** Cream/green/gold is unmistakably Cape winelands. CSS variables are used consistently; I found no hardcoded hex in the JSX. Good discipline.
- **Spacing and rhythm are mostly clean** — consistent `rem` scale, considered letter-spacing on eyebrows.

### S1 — The gradient banners are the single biggest weakness *(Impact: Highest · Effort: Major)*
- **Problem:** Every venue card and every venue detail page uses a type-keyed CSS gradient where a photograph should be. Real imagery appears *only* in the blog. A couple browsing 24 venues sees 24 abstract colour washes.
- **Why it matters:** Wedding venues are chosen on aspiration and emotion. This is the core job-to-be-done, and the [Peak-End Rule] plus basic [Visual Salience] both say the image *is* the product here. A venue directory with no venue photos is a restaurant menu with no food photos — the gradients, however tasteful, read unmistakably as placeholders and quietly signal "unfinished." This is the ceiling on every conversion metric you have.
- **Constraint respected:** `CLAUDE.md` rules out *stock* imagery as a deliberate brand decision, and I agree — generic stock would cheapen the brand. This is **not** a recommendation to add stock. It is a recommendation to treat *real, venue-supplied photography* (your pending item #3) as the highest-priority business task, not a someday-nice-to-have.
- **Pragmatic fix (in priority order):**
  1. Get **one** real hero photo for each of the **3 featured venues** and the venue *detail* page hero first — highest-traffic, highest-intent surfaces. Don't wait for a complete 24-venue set. *(Moderate, gated on outreach.)*
  2. Keep gradients as the **card** fallback during rollout — a mixed state is fine and normal.
  3. Until photos land, add a small honest affordance to gradient banners (e.g. a faint venue-type wordmark or a "Photography coming soon" micro-label) so they read as *intentional*, not *broken*. *(Quick.)*

### The hero is more law-firm than wedding *(Impact: Med · Effort: Quick–Mod)*
- **Problem:** The hero is a dark green diagonal-striped gradient box with centered type. The romance lives entirely in the words ("You've Found Each Other") — the *visual* is sober and corporate.
- **Why it matters:** The hero is your 3-second first-impression test (see below). Right now it communicates *competence* but not *celebration*. For the audience and price of the purchase, it under-delivers on emotion.
- **Fix:** When a flagship venue photo exists, run it as a darkened hero background behind the existing type (the white-on-dark treatment already works for it). Interim quick win: warm the gradient slightly and lift the overlay so it feels less heavy. *(Quick now, Moderate when photo lands.)*

### Smaller visual notes
- **Card hover `scale(1.01)` is imperceptible** — at 1% it may as well not fire. Tune to ~1.02–1.03 with the shadow lift. *(Quick — see §4.)*
- **"Everything is an eyebrow."** Uppercase letter-spaced Jost labels appear on eyebrows, pills, badges, nav, buttons, chips. Cohesive, but the relentless repetition flattens hierarchy — when every small element shouts in the same voice, none of them lead. Consider letting some secondary labels drop the uppercase/tracking. *(Quick, optional.)*
- **0.62rem (~10px) feature-title label** at `App.jsx:184` is below comfortable reading size, especially on mobile. *(Quick — see §10.)*

---

## 2. UX & Information Architecture

### What's working
- **Filtering is genuinely strong.** Region, type, budget, a min-guests slider, sort, free-text search, and clear-all — that's a real browsing tool, and the slider is a nice touch most directories skip. [Cognitive load] is kept low.
- **Navigation is clean and conventional** — sticky, blurred, clear active states, sensible mobile collapse (logo carries the home affordance under 600px). The route-match ordering (`/venues/saved` before the slug regex) is correct.
- **The save/shortlist feature is right for a considered purchase** — localStorage favourites with a nav badge. Good instinct.

### #3 — Mobile: the money button is below the fold *(Impact: High · Effort: Quick–Mod)*
- **Problem:** The enquiry CTA lives only inside the sidebar card. On `≤960px` the layout collapses to a single column (`App.jsx:264-267`) and the sidebar drops *below* the description and the full feature list. On a phone, the user must scroll past everything to find "Enquire."
- **Why it matters:** This is a **mobile-first audience** (your own framing) and the primary conversion action isn't persistently reachable. Every extra scroll between intent and action sheds conversions.
- **Fix:** Add a **sticky bottom enquiry bar on mobile** (venue name + "Enquire" button, `position: fixed; bottom: 0`) that opens the existing modal. Pure CSS/JSX, no new deps. Highest-leverage UX change in this document. *(Quick–Moderate.)*

### #6 — Vendors is a dead-end in primary nav *(Impact: Med · Effort: Quick)*
- **Problem:** "Vendors" sits in the top nav with equal weight to Venues and Blog, but the page is a "Coming Soon" placeholder. A primary-nav click that lands on "not built yet" is a small but real letdown — and it repeats on the homepage's "Every Expert You Need" section.
- **Why it matters:** Dead-ends in the *primary* nav erode the "is this site finished?" judgment that underpins trust. You're spending a prime nav slot on a non-feature.
- **Fix:** Either (a) demote Vendors to the footer until it ships, or (b) keep it but add a small "Soon" badge so expectations are set before the click. *(Quick.)* See also #16 — there's a full vendor dataset sitting unused behind this.

### #11 — Filters don't survive the URL *(Impact: Med · Effort: Moderate)*
- **Problem:** Filter state is React state only. Filter to "Franschhoek + Luxury," refresh or share the link, and it's gone. The back button can't restore a filtered view.
- **Why it matters:** Couples compare in multiple tabs and share links with a partner — [shareability] is part of a considered purchase. It also forfeits filtered **SEO landing pages** ("Franschhoek wedding venues"), which is squarely aligned with your GEO strategy.
- **Fix:** Mirror filters to query params (`?region=…&price=…`) and hydrate from them on mount. Works within `useRouter` — no React Router needed. *(Moderate.)*

### Smaller IA / UX notes
- **Breadcrumbs exist in JSON-LD but aren't rendered** as UI on venue pages — a missed orientation and internal-link cue. *(Quick.)*
- **No nudge to use the shortlist.** The save feature is invisible until discovered. A one-line "♡ Save to compare" hint on cards would activate it. *(Quick — see §3.)*
- **Empty/`NotFound` states are friendly and on-brand.** Good.

---

## 3. Behavioural Economics & Conversion

This is where the site leaves the most on the table. The design earns attention; it doesn't yet convert it.

### #1 — Your best trust line is hidden *(Impact: High · Effort: Quick)*
- **Problem:** "No ads, no fees · hand-verified" is in your `index.html` meta and your marketing doc — but it appears **nowhere a couple actually reads it** in the app. I checked the whole homepage; it's not there.
- **Why it matters:** That line is your entire differentiation and a [reciprocity]/[trust] signal in one. Burying it is the single cheapest conversion loss on the site.
- **Fix:** Put it in the hero sub-line or a thin trust strip directly under the hero. One sentence. *(Quick.)*

### #2 — No social proof at all *(Impact: High · Effort: Quick–Mod)*
- **Problem:** Zero testimonials, reviews, ratings, "featured in," venue logos, or enquiry counts. "24 hand-verified venues" is the only trust claim and it's entirely self-asserted.
- **Why it matters:** [Social proof] (Cialdini) is the highest-impact persuasion lever after the photography gap, *especially* for a directory whose whole pitch is trust. Right now nothing outside your own voice corroborates the promise.
- **Fix:** Even minimal proof helps — one or two real couple quotes, or a founder's note explaining *who verifies and how* (doubles as [authority] and E-E-A-T). If you have any enquiry volume, "Couples have enquired about venues across all 8 regions" is honest and concrete. *(Quick–Moderate; gated on having a real quote.)*

### #4 — The homepage works for the wrong audience *(Impact: Med–High · Effort: Quick)*
- **Problem:** Below the hero, the homepage gives two of its ~four sections to **vendor/owner** acquisition ("Every Expert You Need," "List Your Business"). Your paying attention-economy audience is **couples**.
- **Why it matters:** The most valuable page is spending half its real estate talking to the wrong people. That's [misallocated salience].
- **Fix:** Lead couple-first — featured venues, the trust strip, a "browse by region" block, social proof. Demote the vendor/owner CTAs to a single slim band lower down or the footer. *(Quick.)*

### #5 — The enquiry journey ends flat *(Impact: Med · Effort: Quick)*
- **Problem:** On success the modal shows "Enquiry sent! We'll be in touch shortly" — then nothing. No response-time expectation, no next step.
- **Why it matters:** [Peak-End Rule] — the final moment disproportionately shapes memory of the whole experience, and this is the most important moment in your funnel.
- **Fix:** Add expectation-setting ("We typically reply within 1–2 days") and a forward path ("Browse more venues in {region}" / "Save this to your shortlist"). *(Quick.)*

### #7 — Honest scarcity is sitting unused *(Impact: Med · Effort: Quick)*
- **Problem:** Your own blog states peak season books 12–18 months out, but venue pages carry no urgency cue.
- **Why it matters:** [Loss aversion]/[scarcity] — but it must stay **ethical**. Date-driven booking is *real* scarcity, not manufactured. No fake "3 people viewing."
- **Fix:** A factual line on venue pages: "Peak dates (Oct–Apr) are typically booked 12–18 months ahead — enquire early." True, useful, motivating. *(Quick.)*

### #9 — The cookie banner is mildly deceptive *(Impact: Med · Effort: Quick)*
- **Problem:** "Got it" and "Dismiss" both call `acceptCookies()`. "Dismiss" implies *decline* but silently consents.
- **Why it matters:** It's a small [dark pattern], and on a site that sells itself on trust + POPIA compliance, the inconsistency is off-brand and arguably non-compliant.
- **Fix:** Either make "Dismiss" a genuine decline (don't set analytics consent) or remove the second button and keep a single honest "Got it." *(Quick.)*

### Other levers
- **Von Restorff / isolation:** featured and premium venues look identical to every other card — nothing makes the ones you *want* clicked pop. A subtle "Featured" ribbon or border would help. *(Quick.)*
- **Choice architecture is handled well** — 24 venues, 3 featured, strong filters. [Paradox of choice] is not a problem here. Credit where due.

---

## 4. Modern Web Experience

You asked for an explicit worth-it / decoration verdict per technique, weighed against: solo operator, limited time, budget-conscious, single-file, understated elegance. Dependencies confirmed minimal (`react`, `react-dom`, `vite` only — no animation library).

| Technique | Verdict | Why |
|-----------|:------:|-----|
| **Scroll-triggered reveals** (staggered fade+rise on cards/sections) | ✅ **Worth it** | ~15 lines: one `IntersectionObserver` hook + CSS transition. No deps, negligible perf cost, and *subtle* reveals are exactly the "understated elegance" register. Highest polish-per-hour. **Quick.** |
| **Tuned card / hover micro-interactions** | ✅ **Worth it** | Current `scale(1.01)` is invisible. Lift to ~1.02–1.03 + shadow, add image zoom-on-hover once photos exist. **Quick.** |
| **Page transition fade** between routes | ✅ Worth it (optional) | SPA route changes are instant/jarring. A 150–200ms keyed fade raises perceived quality and supports peak-end. CSS + a keyed wrapper, no deps. **Quick–Moderate.** |
| **Regional map navigation (SVG)** | ⚠️ Worth it — but **not D3** | Geography *is* your product, so a clickable Western Cape map that sets the region filter is genuinely on-brand and useful. **D3 is the wrong tool** — heavy dep, conflicts with the single-file/minimal ethos, and overkill. Hand-draw a simple SVG of the 8 regions with clickable hotspots instead → ~80% of the value, no dependency. **Moderate.** |
| **Parallax** | ❌ Decoration | Cliché, janky on mobile, motion-sickness/a11y cost, and it fights refined elegance. Skip. |
| **Custom cursor / grain / heavy effects** | ❌ Decoration | Off-register for a wedding brand and pure maintenance burden. Skip. |
| **Motion / animation library** | ❌ Not needed | Everything above is achievable in CSS + one tiny hook. Adding a dep violates "no new deps without asking" for no gain. |

### Performance findings *(#12 — Impact: Med · Effort: Quick–Mod)*
- **Fonts and the entire stylesheet are injected at runtime** via `document.createElement` in module scope. First paint therefore waits on the JS bundle, and Google Fonts loads with **no `preconnect`/`preload`** → visible FOUT and delayed render.
  - **Fix:** Add `<link rel="preconnect">` for `fonts.googleapis.com` / `fonts.gstatic.com` in `index.html`, and consider inlining the critical CSS (or shipping it as a real `<link>` stylesheet) so first paint isn't JS-gated. *(Quick–Moderate.)*
- **Blog Unsplash images** use lazy-loading (good) but inconsistent width params and no responsive `srcset`. Minor. *(Quick.)*
- The single un-split bundle is **fine** at this content size — do not prematurely code-split.

---

## 5. The Big Question — Overhaul, Incremental, or Polish?

**Targeted incremental improvements. Not an overhaul. Justified plainly:**

1. **The foundation is sound.** The type system, palette, component structure, filtering, SEO/JSON-LD scaffolding, and POPIA plumbing are all competent and already clear of generic-AI aesthetics. There is nothing here worth tearing down — an overhaul would destroy value and consume the one resource a solo operator can't spare: time.

2. **The gaps are additive, not structural.** Photography, social proof, a surfaced trust line, a mobile sticky CTA, peak-end polish, scroll reveals — every one of these *adds to* the existing design rather than replacing it. That's the definition of incremental-wins territory.

3. **The ROI math is lopsided.** A redesign is weeks of work for uncertain gain on a design that's already good. The list in §3 is *hours* of work aimed straight at the conversion and trust deficits that are actually costing you enquiries. For a budget-conscious solo operator, that's not a close call.

4. **The one hard problem is a sourcing problem, not a design problem.** Real venue photography (S1) is your true ceiling — and it's solved by outreach, not by a rebuild.

**If I'm wrong about anything, it's that I may be *understating* how much the photography gap holds everything else back.** You can execute every quick win in this document flawlessly and still be capped until real images land. Treat S1 as the parallel track that runs underneath all the incremental work.

---

## Recommended Action Sequence

### First — Trust & conversion quick wins (a day or two, all single-file)
1. Surface **"No ads, no fees · hand-verified"** in the hero/trust strip *(#1)*.
2. Add a **mobile sticky "Enquire" bar** on venue pages *(#3)*.
3. **Rebalance the homepage** to lead couple-first; demote vendor/owner CTAs *(#4)*.
4. Upgrade the **enquiry success state** with response time + next step *(#5)*.
5. Add the **honest peak-season scarcity** line to venue pages *(#7)*.
6. Fix the **cookie banner** "Dismiss" honesty *(#9)*.
7. Resolve the **Vendors dead-end** (footer or "Soon" badge) and delete the unused `VENDORS` data *(#6, #16)*.

### Second — Polish & mobile hardening (a few days)
8. **Scroll reveals + tuned hovers + optional page-fade** *(#8)*.
9. **Tap-target and font-size** mobile a11y pass *(#10)*.
10. **Font preconnect/preload** and critical-CSS fix *(#12)*.
11. Add at least one or two **real testimonials / a founder verification note** *(#2)* as soon as you can source them.

### Third — Strategic / bigger bets (plan deliberately)
12. **S1 — Real venue photography**, starting with the 3 featured venues and the venue-detail hero. This runs in parallel with everything above and is the real unlock.
13. **Filters-in-URL** *(#11)* and an **"About / How we verify"** page *(#13)* — both feed your SEO/GEO strategy.
14. Evaluate the **regional SVG map** *(#15)* once photography is flowing.
15. Longer-term, weigh **pre-rendering/SSG** *(S2)* for AI-crawler citation — meaningful for GEO, but a build-architecture decision to make on its own.

---

*Prepared as evaluation only — no files other than this audit were modified. Recommendations respect the single-file architecture, the custom router, the CSS-in-template-literal pattern, and the South African terminology, per `CLAUDE.md`.*
