import { useState, useEffect } from "react";
import Favourites from "./Favourites.jsx";
import { VENUES } from "../data/venues.js";
import {
  getGradient,
  getAccent,
  displayCapacity,
  displayPrice,
} from "../data/constants.js";

const STORAGE_KEY = "cv_saved";

function readSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function SavedVenues() {
  const [saved, setSaved] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readSaved());
    sync();
    setReady(true);
    window.addEventListener("cv-saved-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cv-saved-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!ready) return null;

  const savedVenues = VENUES.filter((v) => saved.includes(v.slug));

  if (savedVenues.length === 0) {
    return (
      <div className="saved-empty">
        <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.25 }}>
          ♡
        </div>
        <div
          style={{
            fontFamily: "var(--ff-serif)",
            fontSize: "1.5rem",
            color: "var(--green)",
            marginBottom: "0.75rem",
          }}
        >
          No venues saved yet
        </div>
        <p
          style={{
            fontFamily: "var(--ff-body)",
            color: "var(--muted)",
            marginBottom: "2rem",
          }}
        >
          Tap the heart icon on any venue card to build your shortlist.
        </p>
        <a
          className="btn btn-primary"
          href="/venues"
          style={{ textDecoration: "none" }}
        >
          Browse Venues
        </a>
      </div>
    );
  }

  return (
    <>
      <p
        style={{
          fontFamily: "var(--ff-body)",
          fontSize: "1rem",
          color: "var(--muted)",
          marginBottom: "2.5rem",
        }}
      >
        {savedVenues.length} venue{savedVenues.length !== 1 ? "s" : ""} saved.
        Tap a card to view details, or ♡ to remove.
      </p>

      <div className="cards-grid">
        {savedVenues.map((v) => (
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
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
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
    </>
  );
}
