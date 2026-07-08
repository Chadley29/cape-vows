# Cape Vows — Fact-Check Report

**Scope:** Every entry in `VENUES[]` and `POSTS[]` in `src/App.jsx`, checked against source material in `/_local/venue-details/` (8 markdown reference docs + 13 PDF brochures, PDFs extracted to text via `_extracted-text/` for this pass). No edits have been made to `App.jsx` — this is a report only.

---

## 1. Executive summary

- **21 of 24 venues** have source material available (8 via markdown, 13 via PDF). **3 venues have no source**: Hawksmoor House, The Cellars-Hohenort, Belmond Mount Nelson — see note below, this differs from the task brief's "20 of 24 / 2 no-source" framing.
- **6 confirmed corrections** (unambiguous, explicit source support, safe to apply directly).
- **~20 discrepancies flagged for manual review** (ambiguous, judgment-call, or only partially supported by source).
- **3 stale-source flags** (Lanzerac, Steenberg Farm, Cape Point Vineyards), as instructed.
- **1 PDF (nooitgedacht.pdf) is effectively a captions-only lookbook** — no usable brochure facts extracted, flagged separately.
- **Accommodation Set check**: 6 mismatches found against `VENUES_WITH_ACCOMMODATION`, including one high-confidence case (Lourensford/Laurent) where the source explicitly states the opposite of what the Set implies.

### A note on the file-count discrepancy

The task brief stated "20 of 24 venues" have source material and named 2 no-source venues (The Cellars-Hohenort, Belmond Mount Nelson). My mapping of the 21 files in `/_local/venue-details/` to the 24 `VENUES[]` slugs found **21 distinct venues covered, not 20**, leaving **3** without source material — Hawksmoor House is also uncovered. I'm surfacing this transparently rather than silently reconciling it either way; see Section 5.

---

## 2. Confirmed corrections

These are unambiguous — explicit, directly-stated source facts that contradict the current site text with no material judgment call required.

| # | Venue | Field | Current site text | Source says | Correct text |
|---|---|---|---|---|---|
| 1 | `elgin-ridge-wines` | `name` / `slug` | "Elgin Ridge Wines" / `elgin-ridge-wines` | `elgin-vintners.pdf` — the venue's own brochure calls itself "Elgin Vintners" throughout; the `website` field in `VENUES` already points to `elginvintners.co.za` | Rename to "Elgin Vintners" (slug `elgin-vintners`) |
| 2 | `la-cotte-farm` | `capacity` | "Up to 100" | La Cotte Farm markdown source states two separate, explicitly labelled figures: "Venue capacity: 80 guests" and "Accommodation: 104 guests" | "Up to 80" (100 appears to conflate the 104-guest accommodation figure with venue/event capacity) |
| 3 | `lourensford-wine-estate` | `capacity` | "Up to 120" | `lourensford-laurent.pdf`: "Capacity - 200 Guests" and "a grand celebration of up to 200 guests," stated twice, unambiguously | "Up to 200" |
| 4 | `lourensford-wine-estate` | `VENUES_WITH_ACCOMMODATION` membership | Included in the Set (implies "Yes" on accommodation FAQ) | `lourensford-laurent.pdf`, verbatim: **"Although Laurent does not offer on-site accommodation, your guests can extend the celebration with an overnight stay at one of our trusted accommodation partners"** | Remove `lourensford-wine-estate` from the Set |
| 5 | `elgin-ridge-wines` (→ `elgin-vintners`) | `VENUES_WITH_ACCOMMODATION` membership | Not in the Set | `elgin-vintners.pdf`: every package (Bronze/Silver/Gold) includes accommodation — "1 x night Stay + Breakfast in our Honeymoon Suite" or, for Gold, "use of the guesthouse for 2 nights, self-catering (sleeps ten people)" | Add `elgin-vintners` to the Set |
| 6 | `la-paris-estate` | `VENUES_WITH_ACCOMMODATION` membership | Not in the Set | `la-paris-estate.pdf`: the standard package explicitly includes "One Night's Accommodation for 21 Guests (Night of the Wedding)" | Add `la-paris-estate` to the Set |

---

## 3. Discrepancies needing manual review

Grouped by venue. Confidence reflects how directly the source supports the flag, not how likely a correction is "right" — per instructions, ambiguous items are flagged rather than asserted.

### Babylonstoren
- **Mountain name conflict.** Current description: "breathtaking Simonsberg Mountain views." `babylonstoren.pdf` explicitly names a different range: "sun-dappled, green lawns overlooking the vineyards and the majestic **Drakenstein Mountains**." No mention of Simonsberg anywhere in the brochure. **Medium-high confidence** — the source is specific and the two ranges are distinct.
- Phone (021 863 3852) not confirmed or denied — source only lists an email address. Unconfirmed, low risk.

### Boschendal Wine Estate
- **Price tier may only reflect the top-end package.** Current tier: "Luxury (R300k+)." Source shows three very different packages: Rhône Homestead R100k–R130k (Mid-Range), Olive Press R195k–R280.5k (Premium/low-Luxury), The Retreat R350k–R630k (Luxury). Only the largest package clears R300k. **Medium confidence** — not wrong exactly, but the single tier undersells the venue's actual range, particularly the Rhône Homestead option.
- Capacity "Up to 200" matches the Olive Press figure specifically (200 PAX); Rhône Homestead is 40 indoor/80 outdoor, The Retreat is 72 (with a 250-pax lawn-only extension). Consistent with the site's max-figure convention, but worth noting the site is citing one specific space's number, not a single estate-wide max.

### Cavalli Estate
- **"Equestrian setting" / "equestrian elegance" claim not corroborated.** The wedding brochure describes "110 hectares of meticulously farmed vineyards," "modern and luxurious architecture," and "the first Green Star rated restaurant... in South Africa" — no mention of horses, a stud farm, or equestrian facilities anywhere in this document. **Medium confidence flag** — Cavalli is publicly known to have an equestrian centre, so this may be accurate from a source outside this brochure, but this specific document doesn't support it.
- "Wine & Art" and "Bridal Suite" features are not evidenced in this source. Low confidence, unconfirmed rather than contradicted.
- Capacity "Up to 400" matches the Sunken Garden's standing-room figure (300 cinema-style / 400 standing) — the single highest number in the brochure, but it's a standing/one-space figure, not the main venue's seated max (350 seated / 300 with a dance floor).

### Groot Constantia
- **Phone number mismatch.** Current site: "021 794 5128." Source gives two different numbers for two different facilities: Simon's Restaurant "021 794 1143," Jonkershuis "021 794 6255." Neither matches the current listing. **Medium-high confidence** the current number needs checking — it may be a since-changed main estate line not captured by the source.
- Capacity "Up to 200" is defensible (matches the upper end of Jonkershuis's range) but the source describes multiple sub-venues with different capacities (Jonkershuis 20–200, Simon's terrace 100–180, picnic 80–160, restaurant 100, mezzanine 70) rather than one authoritative estate max.
- "Founded in 1685 by Simon van der Stel" — source confirms "oldest wine-producing estate (300+ years)" but doesn't independently verify the specific date/founder detail.
- **Accommodation Set concern — see Section 7.**

### Holden Manz
- Capacity "Contact venue" is a reasonable, conservative choice; source's only figure (120 pax, a crockery/catering proxy) isn't a stated max. Low confidence, not an error.
- **Accommodation Set concern — see Section 7** (source doesn't mention accommodation at all, though this may simply be page scope).

### La Roche Estate
- No corrections needed on capacity ("Up to 180" correctly matches the Festival Hall's stated max; Sanctuary is 120 seated / 100 standing) or phone (071 761 1354 matches source's +27 71 761 1354 exactly).
- **Possible accommodation Set omission — see Section 7** (low-medium confidence, source mention is a brief, ambiguous aside).

### Mont Rochelle
- "Award-winning Restaurant" feature: source substantiates "award-winning wines" but does not separately call MIKO restaurant award-winning. **Low confidence** — can't rule out a separate award, but this source only supports the wine claim.
- Capacity, price positioning, and Virgin Limited Edition ownership all check out cleanly against source.

### Vrede en Lust
- No corrections needed — capacity, phone, and accommodation all confirmed against source (see Section 7).
- Note the per-space nuance: source gives 120 indoor / 150 outdoor; the site's "Up to 150" reflects the outdoor max, consistent with how other multi-space venues are handled.

### Zorgvliet Wines
- **Capacity unconfirmable.** Source explicitly notes no guest capacity figure appears anywhere on the source page; current site "Up to 140" cannot be checked against this source.
- **Internal spelling inconsistency: "Banhoek" vs "Banghoek."** `VENUES.zorgvliet-wines.address` reads "Banhoek Valley" (no g). The blog post `mountain-backdrop-wedding-venues-western-cape` uses "Banghoek Valley" (with g) twice. The source's own facility name is "The Banghoek Room" (with g), and the source's fact-check note also uses "Banghoek." So two site texts disagree with each other, and the source only weakly supports the "g" spelling (a room name, not a confirmed geographic-name authority — the commonly used spelling for the wine-route valley itself is typically "Banhoek"). **Medium confidence** — flagging as an internal consistency issue needing a standardisation decision, not asserting which spelling is objectively correct.
- **Feature list drift.** Current feature "Rustic Barn Venue" is not supported — source names "The Oak Room" and "Chapel" as the actual facilities, no "barn" anywhere. "River Views" is also unconfirmed — source mentions valley, mountain, and garden views, no river.
- Accommodation confirmed correct (see Section 7).

### Cape Point Vineyards
*(Treat all findings here as provisional — source is a partial 2025-dated extract, Package 1 missing.)*
- Capacity "Up to 200" doesn't match the only capacity figure in the source (Main Deck: 100 seated / 180 standing). Since other spaces (Vineyard/Courtyard Lawns, Tasting Room/Deck, Private Dining Room) aren't capacity-detailed in this partial extract, 200 could plausibly reflect combined ceremony + reception space not captured here. **Low-medium confidence, provisional.**
- Price tier "Mid-Range (R50–150k)" is well supported for Packages 2 and 3 (R65k–R120k), the two packages most likely to be the "main" wedding offering. Package 4 (R8k–R15k) is a small private-dining add-on, not comparable. **Good match**, caveated by the partial-source flag.

### Steenberg Farm — *see also Section 4, stale source*
- **Reception capacity appears much smaller than the ceremony figure the site cites.** Source shows Manor Lawn ceremony seats up to 100 (matching current "Up to 100"), but the *reception* space seats only up to 40 (60 standing canapé-style). The site's headline capacity may overstate what a full wedding (not just the ceremony) can actually accommodate. **Medium-high confidence.**
- "1682 historic farm" — source calls it "the Cape's oldest farm" but doesn't state a specific year; the "1682" detail is unconfirmed by this source.
- "Golf Course" and "Glass Conservatory" features are not mentioned in this wedding-specific brochure — unconfirmed (may be documented elsewhere on the property), low risk.

### La Paris Estate — *featured venue on homepage*
- **Capacity figure only corroborated for a much smaller "Intimate Wedding Package."** Source (`la-paris-estate.pdf`, titled "Intimate Wedding Packages, valid 2027–2028") explicitly states "Applicable for up to 50 guests," with pricing R187,000 (mid-week) / R214,000 (weekend), inclusive of VAT. Current site: capacity "Up to 200." Because the source's own title flags it as an "intimate" package, it's plausible La Paris has separate, larger packages not captured in this document (comparable to the Cape Point partial-extract situation) — **not treated as a confirmed correction**, but flagged as needing manual review at **medium-high confidence** given how directly this contradicts the stated capacity.
- Price tier "Premium (R150–300k)" is actually well supported by the documented pricing (R187k–R214k), so no concern there.
- Address and phone both match source exactly (Wemmershoek Road/R301, Franschhoek, 7600; 021 867 0171).
- **Accommodation Set — confirmed correction, see Section 2.**

### Lanzerac Wine Estate — *see also Section 4, stale source*
- **Price tier reflects venue-hire fee only, not the mandatory accompanying accommodation cost.** Venue hire options run R28k–R105k (within "Mid-Range"), but every option except the smallest (Option D) requires booking a block of 23 or 54 hotel rooms on top of the venue fee — a substantial additional mandatory cost not reflected in the Mid-Range tier. **Medium confidence** this undersells the real cost of a Lanzerac wedding, though the venue-fee-only comparison is technically accurate.
- Capacity "Up to 250" matches the Manor House Lawns max exactly; Cellar Hall tops out at 150 (140 with a dance floor) — consistent per-space nuance, no correction needed.
- Address, phone, and 1692 heritage claim ("over 300 years" per source) are all consistent, no conflict.

### The 12 Apostles Hotel
- Site's "Contact venue" / "Contact Venue" (no committed capacity or price figure) is a defensible, conservative choice. The only source available (`the-12-apostles-hotel.pdf`) documents a small "Destination Wedding Package" explicitly capped at 25 guests (R19,260–R46,495 depending on tier) — clearly a narrow elopement-style offering, not representative of the hotel's full wedding capacity. **No correction recommended** — flagging only to note the source's limited scope.

### Saronsberg Wine Estate
- **Address discrepancy.** Current site: "Saronsberg Rd, Tulbagh." Source (a signed wedding contract template) states: "Waveren Road, Tulbagh." **Medium-high confidence** — the source is an explicit legal/contract document, though it's possible "Saronsberg Rd" is a commonly used informal name for the same access road.
- Capacity ("Up to 120") and phone (023 230 0707) match the source exactly. Price (R70,000 flat fee) sits well within "Mid-Range."

### La Petite Ferme
- **Price tier may undersell high-season/exclusive-use total cost.** Source shows a Restaurant Venue Fee of R130,000 (summer/high season, full-day) plus a R950pp menu fee — for the max 45 guests, that's ~R173k in venue + catering alone before accommodation, which would exceed the current "Mid-Range (R50–150k)" ceiling. Winter pricing (R40,000 venue fee) stays comfortably within Mid-Range. **Medium confidence** — the tier is accurate for winter bookings, understated for summer/peak exclusive-use bookings.
- Capacity ("Up to 45"), address, and phone all match the source exactly.
- "Guest Chalets" feature: source describes 15 individually designed hotel-style suites (Manor House, Vineyard, Winery), not specifically "chalets" — a minor terminology note, not a factual error.

### Elgin Vintners (post-rename correction)
- **Price tier likely too high for two of three published packages.** Source: Bronze R15,000 (up to 20 guests), Silver R30,000 (21–40 guests), Gold R60,000 (41–50 guests). Only Gold touches the "Mid-Range (R50–150k)" floor; Bronze and Silver sit in "Budget (<R50k)" territory. **Medium-high confidence** given explicit, unambiguous source pricing across all three tiers.
- Capacity "Up to 50" matches the top of the Gold package exactly — no issue.
- Phone (021 848 9587) matches source exactly — notable, since the name was wrong but the phone number was already correct.
- "Award-winning Wines" feature is not confirmed by this source (source only says "a complete range of wines," no awards claim). Low risk.
- **Accommodation Set — confirmed correction, see Section 2.**

### Eikenhof Estate — *featured venue on homepage*
- **Capacity figure doesn't match any single figure in the source, and every documented figure is higher.** Current site: "Up to 80." Source gives: Pergola ceremony 100, Manor House Lawns ceremony 130, Cap Classique reception 120 indoor (with dance floor) / 180 on the lawns. No figure in the brochure is as low as 80. **High confidence there's a discrepancy** — flagged as needs-review rather than confirmed correction because which figure should replace it (100? 120? 180?) is a judgment call similar to other multi-space venues, not a single stated number the way La Cotte Farm's correction was.
- Price tier "Mid-Range (R50–150k)": venue-hire-only rates are Budget-tier (R18k–R30.3k depending on season/2024–2027), but adding catering (Silver ~R545–790pp, Gold higher) for 80 guests pushes an all-in estimate into the R80k–R150k range — Mid-Range is defensible if the tier represents all-in cost rather than venue hire alone. **Medium confidence**, more of an interpretation question than an error.
- "Wine and olive farm" claim: source doesn't explicitly mention olives — unconfirmed by this brochure specifically (not contradicted).
- Address and phone match source exactly.

---

## 4. Stale-source flags

Per instructions, these three sources are dated a season (or more) behind the others and should be treated as "pricing/season may be stale, recommend requesting an updated brochure" rather than as current fact:

| Source | Dating | Note |
|---|---|---|
| `lanzerac.pdf` | "August 2025 – July 2026" season | One year behind sources like `la-paris-estate.pdf` (2027–2028) and `lourensford-laurent.pdf` (2027). Capacity and accommodation-structure facts are likely stable; pricing should be re-quoted. |
| `steenberg-farm.pdf` | August 2024 | The oldest of all 21 sources by a clear margin. Capacity figures in particular (see Section 3) should be re-verified directly with the venue, not just pricing. |
| `cape-point-vineyards.md` | Canva deck titled "Wedding Packages with Rates 2025"; Package 1 pricing missing entirely from the extract | Treat all capacity/price comparisons for this venue as provisional (per instructions) — both because of the dating and the incomplete extraction. |

---

## 5. No-source venues

Per instructions, these are listed plainly with no attempt to guess or web-search:

- **The Cellars-Hohenort** (`the-cellars-hohenort`) — unverified, no source available
- **Belmond Mount Nelson Hotel** (`belmond-mount-nelson`) — unverified, no source available
- **Hawksmoor House** (`hawksmoor-house`) — unverified, no source available *(not named in the original task brief's "2 no-source venues" framing — see Section 1 note. No `/_local/venue-details/` file maps to this slug.)*

---

## 6. Blog post (`POSTS[]`) findings

### `best-wine-estate-venues-franschhoek`
- Repeats "capacity for up to 200 guests" for La Paris Estate — same flag as the VENUES entry (Section 3): only directly corroborated for a 50-guest "Intimate Package" in the available source. If the VENUES capacity is revisited, this line should be updated in parallel.
- La Roche Estate ("up to 180 guests") and Mont Rochelle ("up to 80 guests") both check out cleanly against source.

### `budget-friendly-winelands-venues`
- **Nooitgedacht Wine Estate labelled "(Paarl)" and described as "Located just outside Paarl on the R44"** — conflicts with the `VENUES.nooitgedacht-wine-estate.address` field, which reads "Nooitgedacht Farm, Koelenhof, **Stellenbosch**." `nooitgedacht.pdf` (see Section 6a below) has no address content to resolve this either way. This is an internal site inconsistency (blog vs. VENUES array) that predates and is independent of the source-availability problem. **Needs manual review, cannot be resolved from available sources.**
- Eikenhof Estate and Lanzerac Wine Estate mentions are consistent in framing with their VENUES entries; the same price-tier nuances noted in Section 3 apply here (venue-hire-only vs. all-in cost for Eikenhof; venue-fee-only vs. mandatory accommodation cost for Lanzerac).

### `best-seasons-cape-wedding`
- La Paris Estate and Lanzerac Wine Estate mentions are general/descriptive (tree cover, indoor event spaces) with no new numeric claims beyond what's already covered above.

### `marriage-officer-guide-cape-weddings`
- Per instructions, not re-researched against the underlying law. Checked only for internal consistency: citations to the Marriage Act 25 of 1961, Civil Union Act 17 of 2006, Home Affairs forms (BI-30, BI-31, BI-130), the Hague Apostille Convention, and DIRCO legalisation are all used consistently across the post with no contradictions between sections. No drift detected.
- Incidentally, `the-12-apostles-hotel.pdf` independently references the same Apostille/Hague Convention mechanism for international couples in its own destination-wedding terms — consistent with, not contradictory to, this post's explanation.

### `mountain-backdrop-wedding-venues-western-cape`
- **"Banghoek Valley" (with g)** used twice — see the Zorgvliet Wines spelling-inconsistency flag in Section 3 (`VENUES.zorgvliet-wines.address` uses "Banhoek," no g).
- **"Blue Ridge mountain views"** claimed for Zorgvliet Wines — not mentioned anywhere in the Zorgvliet source (which references mountain and valley views generally, no "Blue Ridge" name). **Low confidence, unconfirmed** — could be a real hyperlocal name not covered by this source, or a drift error.
- The 12 Apostles Hotel, Lanzerac, Saronsberg, and Cape Point Vineyards mountain/valley descriptions all check out against their respective sources (Twelve Apostles range + Atlantic; Jonkershoek; Tulbagh with Saronsberg Mountain views, though "Obiqua and Winterhoek" specifically isn't named in the source; Chapman's Peak/Noordhoek, caveated by the Cape Point partial-extract flag).

### `wedding-venue-bottelary-road-stellenbosch`
- Repeats "up to 80 guests" for Eikenhof Estate — same flag as the VENUES entry (Section 3): no figure in the source is as low as 80. Should be updated in parallel with any VENUES correction.
- "Mid-range venue (roughly R50k to R150k)" for Eikenhof — same all-in-vs-venue-hire nuance as Section 3.
- Claims "capacity for up to 300 guests" for Nooitgedacht Wine Estate — **cannot be verified**, `nooitgedacht.pdf` contains no guest-capacity figures at all (see Section 6a).

### 6a. Note on `nooitgedacht.pdf`
This PDF is a "Look Book" consisting almost entirely of image slides; text extraction yielded only facility-name captions (Manor House, Bridal Suite, Guestrooms, Cottages, Lane/Chapel/Lawn Ceremony, Grand Hall) and a contact email/website — **no capacity, price, address, or phone content is present in extractable form**. This is functionally close to an image-based PDF for fact-checking purposes, even though the extraction technically returned some text. All Nooitgedacht claims in both `VENUES` and the two blog posts that reference it are therefore **unverifiable against this source** and should be manually re-sourced if precision matters (the site's address claim of Paarl vs. Stellenbosch is a good example of exactly the kind of question this source can't settle).

---

## 7. `VENUES_WITH_ACCOMMODATION` Set verification

Checked against every venue with source material (21 of 24). ✓ = Set membership matches source; ⚠ = mismatch or unconfirmed.

| Venue | In Set? | Source says | Status |
|---|---|---|---|
| babylonstoren | Yes | Confirms (Koornhuis cottage, 9-bedroom Farmhouse, Manor House) | ✓ Confirmed correct |
| boschendal-wine-estate | Yes | Confirms strongly ("cottages provide accommodation for up to 216 guests") | ✓ Confirmed correct |
| steenberg-farm | Yes | Confirms strongly (Steenberg Hotel & Spa rooms required for ceremony bookings) | ✓ Confirmed correct |
| holden-manz | Yes | Source (wedding page specifically) doesn't mention accommodation at all | ⚠ Unconfirmed — likely just page scope, **low confidence** |
| mont-rochelle | Yes | Confirms (Virgin Limited Edition hospitality brand, hotel) | ✓ Confirmed correct |
| lanzerac-wine-estate | Yes | Confirms strongly (23–54 rooms depending on package) | ✓ Confirmed correct |
| vrede-en-lust | Yes | Confirms explicitly ("Accommodation: up to 40 guests on the estate") | ✓ Confirmed correct |
| the-cellars-hohenort | Yes | No source available | Unverifiable |
| belmond-mount-nelson | Yes | No source available | Unverifiable |
| the-12-apostles-hotel | Yes | Confirms (hotel; package requires booking a Luxury Room or higher) | ✓ Confirmed correct |
| la-petite-ferme | Yes | Confirms strongly (15 suites, mandatory 2-night booking for evening weddings) | ✓ Confirmed correct |
| eikenhof-estate | Yes | Confirms strongly (2 retreats, 9 rooms total) | ✓ Confirmed correct |
| zorgvliet-wines | Yes | Confirms ("Country Lodge — on-site accommodation, walking distance") | ✓ Confirmed correct |
| la-cotte-farm | Yes | Confirms explicitly ("Accommodation: 104 guests") | ✓ Confirmed correct |
| saronsberg-wine-estate | Yes | Confirms strongly (16 cottages, up to 50 guests, + Honeymoon Cottage) | ✓ Confirmed correct |
| lourensford-wine-estate | Yes | **Explicitly contradicts**: "Laurent does not offer on-site accommodation" | ⚠ **Confirmed error — remove from Set** (see Section 2) |
| groot-constantia | Yes | No accommodation evidence in source; features list has no matching keyword either | ⚠ Needs manual review, **moderate-to-high concern** — this is the sole driver of a "Yes" FAQ answer with no source backing |
| hawksmoor-house | Yes | No source available | Unverifiable |
| la-roche-estate | **No** | Ambiguous mention: "Solar-powered electricity (Festival Hall + accommodation)" in an inclusions list | ⚠ Possible omission, **low-medium confidence** (could refer to staff accommodation, not guest lodging) |
| cape-point-vineyards | **No** | No accommodation offering evident (day-wedding venue only) | ✓ Confirmed correct (correctly excluded) |
| cavalli-estate | **No** | No accommodation offering evident | ✓ Confirmed correct (correctly excluded) |
| nooitgedacht-wine-estate | **No** | Thin source lists "Guestrooms" and "Cottages" as named facilities | ⚠ Possible omission, **low-medium confidence** given how thin the source is |
| la-paris-estate | **No** | **Explicitly includes** "One Night's Accommodation for 21 Guests" in the standard package | ⚠ **Confirmed error — add to Set** (see Section 2) |
| elgin-ridge-wines (→ elgin-vintners) | **No** | **Explicitly includes** accommodation in every package tier | ⚠ **Confirmed error — add to Set** (see Section 2) |

---

## Summary of confirmed corrections to apply (once reviewed)

1. Rename `elgin-ridge-wines` → `elgin-vintners` (name + slug)
2. `la-cotte-farm.capacity`: "Up to 100" → "Up to 80"
3. `lourensford-wine-estate.capacity`: "Up to 120" → "Up to 200"
4. Remove `lourensford-wine-estate` from `VENUES_WITH_ACCOMMODATION`
5. Add `elgin-vintners` (post-rename) to `VENUES_WITH_ACCOMMODATION`
6. Add `la-paris-estate` to `VENUES_WITH_ACCOMMODATION`

No `App.jsx` edits have been made. Awaiting review before any changes are applied.
