// Extracted verbatim from src/App.jsx for Astro build-time use.
// Pure data and pure functions only: no React, no browser APIs.
// Source of truth remains src/App.jsx until the migration completes.


export const toSlug = (n) =>
  n
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const TYPE_GRADIENTS = {
  "Wine Estate":
    "linear-gradient(145deg, #3D1A1A 0%, #6B2E20 45%, #A07840 100%)",
  "Historic Manor":
    "linear-gradient(145deg, #1C2A3D 0%, #2D4060 45%, #5A7090 100%)",
  "Boutique Hotel":
    "linear-gradient(145deg, #1E1C18 0%, #3A332A 45%, #8B6B4A 100%)",
  "Farm & Country":
    "linear-gradient(145deg, #1E2E1E 0%, #2D4A2A 45%, #6B8A50 100%)",
  "Garden Estate":
    "linear-gradient(145deg, #1E3028 0%, #2D5040 45%, #6AAA80 100%)",
  "Beach & Coastal":
    "linear-gradient(145deg, #1A2A38 0%, #1E4A5A 45%, #4090A8 100%)",
  "Mountain Retreat":
    "linear-gradient(145deg, #282830 0%, #3A3848 45%, #7878A0 100%)",
};
export const getGradient = (type) =>
  TYPE_GRADIENTS[type] || "linear-gradient(145deg, #2D4A3E 0%, #3D6356 100%)";
export const getAccent = (type) => {
  const m = getGradient(type).match(/#[0-9a-fA-F]{6}/g);
  return m ? m[1] || m[0] : "#A07840";
};

export const displayCapacity = (c) =>
  c === "Contact venue" ? "Enquire for capacity" : `${c} guests`;
export const displayPrice = (p) => (p === "Contact Venue" ? "Enquire for pricing" : p);

// Standard ISO 8601 week number (1-53), used as the rotation seed below.
export const getISOWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

// Deterministic weekly rotation for the homepage's "A Few We'd Start With"
// section. No randomness, no backend: venues are grouped into a lower-tier
// bucket (Budget/Mid-Range), a higher-tier bucket (Premium/Luxury), and an
// "other" bucket (Contact Venue), then the ISO week number picks one venue
// from each bucket (offset per bucket so the three picks don't move in
// lockstep). Same week always produces the same 3 venues; different weeks
// produce different, budget-balanced combinations. The "other" pick nudges
// away from a region already used by the first two, where the bucket allows it.
export const getFeaturedVenues = (venues, date = new Date()) => {
  const week = getISOWeek(date);
  const lowerTier = venues.filter(
    (v) => v.price.startsWith("Budget") || v.price.startsWith("Mid-Range"),
  );
  const higherTier = venues.filter(
    (v) => v.price.startsWith("Premium") || v.price.startsWith("Luxury"),
  );
  const otherTier = venues.filter((v) => v.price === "Contact Venue");
  if (!lowerTier.length || !higherTier.length || !otherTier.length) return [];

  const lowPick = lowerTier[week % lowerTier.length];
  const highPick = higherTier[(week + 3) % higherTier.length];

  const usedRegions = new Set([lowPick.region, highPick.region]);
  let otherPick = otherTier[(week + 6) % otherTier.length];
  for (let i = 0; i < otherTier.length; i++) {
    const candidate = otherTier[(week + 6 + i) % otherTier.length];
    if (!usedRegions.has(candidate.region)) {
      otherPick = candidate;
      break;
    }
  }

  return [lowPick, highPick, otherPick];
};

export const PRICE_RANGES = [
  "Any Budget",
  "Budget (< R50k)",
  "Mid-Range (R50–150k)",
  "Premium (R150–300k)",
  "Luxury (R300k+)",
];

export const REGION_CONTEXT = {
  "Cape Winelands": {
    desc: "the Cape Winelands",
    distance:
      "between 45 minutes and 1.5 hours from Cape Town CBD, depending on whether the estate is closer to Stellenbosch (≈45 min), Franschhoek (≈75 min), or further afield like Tulbagh (≈90 min)",
    character:
      "rolling vineyards, Cape Dutch architecture, and mountain backdrops that the Winelands are famous for",
  },
  "Constantia Valley": {
    desc: "the Constantia Wine Valley",
    distance:
      "roughly 20–25 minutes from Cape Town CBD, in the leafy southern suburbs",
    character:
      "established wine farms, towering oaks, and a quieter, more residential feel compared to the busier Winelands",
  },
  "Cape Town City": {
    desc: "Cape Town City",
    distance:
      "in or immediately adjacent to the Cape Town city bowl: no travel from the city required",
    character:
      "urban sophistication, Table Mountain as a backdrop, and proximity to hotels, restaurants, and the V&A Waterfront",
  },
  "Atlantic Seaboard": {
    desc: "the Cape Peninsula's Atlantic Seaboard",
    distance:
      "20–40 minutes from Cape Town CBD, depending on the exact location",
    character:
      "dramatic ocean views, the Twelve Apostles mountain range, and the rugged beauty of the Cape Peninsula coast",
  },
  Overberg: {
    desc: "the Overberg region",
    distance:
      "approximately 60–90 minutes from Cape Town, over the Hottentots Holland Mountains",
    character:
      "cool-climate valleys, fynbos-covered hillsides, apple orchards, and a noticeably quieter, more off-the-beaten-track atmosphere",
  },
  "Garden Route": {
    desc: "the Garden Route",
    distance:
      "roughly 4–5 hours from Cape Town by road, or accessible via George Airport",
    character:
      "indigenous forests, lagoons, and lush coastal scenery that make it a popular destination wedding choice",
  },
  "West Coast": {
    desc: "the West Coast",
    distance: "about 60–90 minutes north of Cape Town along the R27",
    character:
      "wild flowers in spring, a windswept coastline, and a more rugged, unspoiled character compared to the Winelands",
  },
};

export const VENUES_WITH_ACCOMMODATION = new Set([
  "babylonstoren",
  "boschendal-wine-estate",
  "steenberg-farm",
  "holden-manz",
  "mont-rochelle",
  "lanzerac-wine-estate",
  "vrede-en-lust",
  "the-cellars-hohenort",
  "belmond-mount-nelson",
  "the-12-apostles-hotel",
  "la-petite-ferme",
  "eikenhof-estate",
  "zorgvliet-wines",
  "la-cotte-farm",
  "saronsberg-wine-estate",
  "groot-constantia",
  "hawksmoor-house",
  "elgin-vintners",
  "la-paris-estate",
]);

export function getVenueFaqs(venue) {
  const cap =
    venue.capacity === "Contact venue"
      ? null
      : venue.capacity.replace("Up to ", "");
  const price = venue.price === "Contact Venue" ? null : venue.price;
  const region = REGION_CONTEXT[venue.region] || {
    desc: venue.region,
    distance: "within the Western Cape",
    character: "the natural beauty of the Western Cape",
  };
  const hasAccomm =
    VENUES_WITH_ACCOMMODATION.has(venue.slug) ||
    venue.features.some((f) =>
      /accommodation|suite|hotel|chalet|lodge|room/i.test(f),
    );
  const featureList = venue.features.slice(0, 4).join(", ");

  return [
    {
      q: `How many guests can ${venue.name} accommodate?`,
      a: cap
        ? `${venue.name} can accommodate up to ${cap} guests. Exact numbers can vary depending on the ceremony layout, whether you're using indoor or outdoor spaces, and the time of year. It's worth calling the venue directly to confirm what works for your specific guest count and format.`
        : `${venue.name} does not advertise a fixed guest capacity: available numbers depend on the specific event layout and space configuration. Contact the venue directly to discuss what's possible for your wedding size.`,
    },
    {
      q: `Where is ${venue.name} located?`,
      a: `${venue.name} is situated in ${region.desc}, Western Cape, at ${venue.address}. It is ${region.distance}, making it ${venue.region === "Cape Town City" ? "ideal for couples wanting a city wedding with easy access for all guests" : "accessible as a day trip or weekend destination from Cape Town"}. The setting is defined by ${region.character}.`,
    },
    {
      q: `What type of venue is ${venue.name}?`,
      a: `${venue.name} is a ${venue.type.toLowerCase()} in ${region.desc}. Key features include ${featureList}. ${venue.highlight}. This makes it particularly well-suited to couples who want ${venue.type === "Wine Estate" ? "a vineyard setting with estate wines on the day" : venue.type === "Boutique Hotel" ? "full hotel amenities and overnight accommodation for the wedding party" : venue.type === "Historic Manor" ? "a venue with genuine Cape heritage and architectural character" : venue.type === "Farm & Country" ? "an intimate, farm-style atmosphere with a relaxed, personal feel" : "a beautiful and distinct wedding setting in the Western Cape"}.`,
    },
    {
      q: `What is the price range for a wedding at ${venue.name}?`,
      a: price
        ? `${venue.name} is categorised in the ${price} tier. This is a broad guide: your actual spend will depend on guest numbers, the season (December and April tend to be peak months), day of the week, and which catering and décor packages you select. We recommend contacting the venue for a personalised quote based on your specific requirements.`
        : `${venue.name} does not publish a standard price list: costs are quoted on enquiry and vary based on guest count, date, and package selections. Contact the venue directly for a tailored quote.`,
    },
    {
      q: `Does ${venue.name} have on-site accommodation?`,
      a: hasAccomm
        ? `Yes, ${venue.name} offers on-site accommodation, which is a significant practical advantage for wedding weekends. Guests and the wedding party can stay on the estate, removing the need for late-night transport arrangements and allowing the celebration to extend into the following morning.`
        : `${venue.name} does not list on-site accommodation as a standard offering. However, the ${region.desc} area has a wide range of guesthouses, boutique hotels, and self-catering options within a short distance. It's worth discussing transport and nearby stay options with the venue when you enquire.`,
    },
  ];
}
