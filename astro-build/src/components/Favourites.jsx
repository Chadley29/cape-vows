import { useState, useEffect } from "react";

const STORAGE_KEY = "cv_saved";

// Mirrors the track() helper in App.jsx: fire-and-forget GA4, no import.
function track(event, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSaved(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode, blocked cookies) */
  }
}

export default function Favourites({ slug, className = "" }) {
  const [isSaved, setIsSaved] = useState(false);

  // localStorage is not available during SSR, so initial state is read on mount.
  useEffect(() => {
    setIsSaved(readSaved().includes(slug));
  }, [slug]);

  function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    const current = readSaved();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    writeSaved(next);
    setIsSaved(next.includes(slug));
    track("venue_save_toggle", { venue_slug: slug, saved: next.includes(slug) });
    window.dispatchEvent(new CustomEvent("cv-saved-changed"));
  }

  return (
    <button
      className={`card-save-btn${isSaved ? " saved" : ""}${className ? " " + className : ""}`}
      onClick={toggle}
      type="button"
      aria-label={isSaved ? "Remove from saved" : "Save venue"}
      title={isSaved ? "Remove from saved" : "Save venue"}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill={isSaved ? "#A07840" : "none"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 12S1.5 8.5 1.5 4.5a3 3 0 015.5-1.67A3 3 0 0112.5 4.5C12.5 8.5 7 12 7 12z"
          stroke={isSaved ? "#A07840" : "rgba(255,255,255,0.9)"}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// The badge span lives in Base.astro's nav, outside this React tree, so it is
// updated imperatively rather than rendered.
export function NavSavedBadge() {
  useEffect(() => {
    const el = document.getElementById("nav-saved-badge");
    if (!el) return;

    const sync = () => {
      const count = readSaved().length;
      el.textContent = count > 0 ? String(count) : "";
      el.style.display = count > 0 ? "inline-flex" : "none";
    };

    sync();
    window.addEventListener("cv-saved-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cv-saved-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return null;
}
