import { useState, useEffect } from "react";
import Favourites from "./Favourites.jsx";
import {
  PRICE_RANGES,
  getGradient,
  getAccent,
  displayCapacity,
  displayPrice,
} from "../data/constants.js";

// Mirrors the track() helper in App.jsx: fire-and-forget GA4, no import.
function track(event, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

function capNum(c) {
  const n = parseInt(String(c).replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export default function VenuesApp() {
  const [venues, setVenues] = useState([]);
  const [region, setRegion] = useState("All Regions");
  const [type, setType] = useState("All Types");
  const [price, setPrice] = useState("Any Budget");
  const [search, setSearch] = useState("");
  const [minGuests, setMinGuests] = useState(0);
  const [ready, setReady] = useState(false);

  // Venue data is embedded in the page as a JSON script tag by venues/index.astro,
  // so the island does not re-download or re-bundle the dataset.
  useEffect(() => {
    const el = document.getElementById("venues-data");
    let list = [];
    if (el) {
      try {
        list = JSON.parse(el.textContent);
      } catch {
        list = [];
      }
    }
    setVenues(list);

    // URL params replace the sessionStorage filter hand-off used by the SPA.
    const p = new URLSearchParams(window.location.search);
    const r = p.get("region");
    const t = p.get("type");
    const pr = p.get("price");
    const q = p.get("search") || p.get("q");
    if (r && list.some((v) => v.region === r)) setRegion(r);
    if (t && list.some((v) => v.type === t)) setType(t);
    if (pr && list.some((v) => v.price === pr)) setPrice(pr);
    if (q) setSearch(q);
    setReady(true);
  }, []);

  const availableRegions = [
    "All Regions",
    ...Array.from(new Set(venues.map((v) => v.region))).sort(),
  ];
  const availableTypes = [
    "All Types",
    ...Array.from(new Set(venues.map((v) => v.type))).sort(),
  ];
  const availablePrices = [
    "Any Budget",
    ...PRICE_RANGES.slice(1).filter((p) => venues.some((v) => v.price === p)),
  ];

  const filtered = venues.filter((v) => {
    if (region !== "All Regions" && v.region !== region) return false;
    if (type !== "All Types" && v.type !== type) return false;
    if (price !== "Any Budget" && v.price !== price) return false;
    if (minGuests > 0 && capNum(v.capacity) < minGuests) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = [v.name, v.region, v.type, v.description, v.highlight]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  function clearAll() {
    setRegion("All Regions");
    setType("All Types");
    setPrice("Any Budget");
    setSearch("");
    setMinGuests(0);
  }

  if (!ready) return null;

  return (
    <>
      <div className="filter-bar">
        <div className="filter-search">
          <div className="filter-label">Search</div>
          <input
            className="filter-input"
            placeholder="Search by name or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-label">Region</div>
          <select
            className="filter-select"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              if (e.target.value !== "All Regions")
                track("filter_used", {
                  filter_type: "region",
                  value: e.target.value,
                });
            }}
          >
            {availableRegions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Venue Type</div>
          <select
            className="filter-select"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              if (e.target.value !== "All Types")
                track("filter_used", {
                  filter_type: "venue_type",
                  value: e.target.value,
                });
            }}
          >
            {availableTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Budget</div>
          <select
            className="filter-select"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (e.target.value !== "Any Budget")
                track("filter_used", {
                  filter_type: "budget",
                  value: e.target.value,
                });
            }}
          >
            {availablePrices.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="filter-slider-group">
          <div className="filter-label">Min. Guests</div>
          <div className="filter-slider-val">
            {minGuests === 0 ? "Any size" : `${minGuests}+ guests`}
          </div>
          <input
            type="range"
            className="cap-slider"
            min={0}
            max={400}
            step={25}
            value={minGuests}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMinGuests(v);
              if (v > 0)
                track("filter_used", { filter_type: "min_guests", value: v });
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--ff-sans)",
              fontSize: "0.68rem",
              color: "var(--muted)",
              letterSpacing: "0.06em",
              marginTop: "2px",
            }}
          >
            <span>Any</span>
            <span>400+</span>
          </div>
        </div>

        <button className="filter-clear" type="button" onClick={clearAll}>
          Clear All
        </button>
      </div>

      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <span className="results-count">
          {sorted.length} venue{sorted.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🌿</div>
          <div className="empty-title">No venues match your filters</div>
          <div className="empty-sub">Try broadening your search criteria</div>
        </div>
      ) : (
        <div className="cards-grid">
          {sorted.map((v) => (
            <div
              className="card"
              key={v.slug}
              style={{ "--card-accent": getAccent(v.type), position: "relative" }}
            >
              <div
                className="card-banner"
                style={{ background: getGradient(v.type) }}
              >
                <div className="card-banner-overlay" />
                <span className="card-banner-badge">{v.type}</span>
                <Favourites slug={v.slug} />
              </div>
              <a
                href={`/venues/${v.slug}`}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
                onClick={() =>
                  track("venue_card_click", { venue_name: v.name })
                }
              >
                <div className="card-body">
                  <div className="card-region">{v.region}</div>
                  <div className="card-title">{v.name}</div>
                  <div className="card-desc">{v.description}</div>
                  <div className="card-meta">
                    <span className="card-pill">
                      👥 {displayCapacity(v.capacity)}
                    </span>
                    <span className="card-pill green">✦ {v.highlight}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="card-price">{displayPrice(v.price)}</span>
                  <span className="card-link">View Details →</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
