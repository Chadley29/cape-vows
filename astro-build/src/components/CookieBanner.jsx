import { useState, useEffect } from "react";

const STORAGE_KEY = "cv_cookies";
const LEGACY_KEY = "cv_cookies_accepted";

// Mirrors the track() helper in App.jsx: fire-and-forget GA4, no import.
function track(event, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value === "accepted" || value === "declined") {
        setShow(false);
        return;
      }
      // Migrate the Vite app's key forward so prior consent is not re-prompted.
      if (localStorage.getItem(LEGACY_KEY) === "true") {
        localStorage.setItem(STORAGE_KEY, "accepted");
        setShow(false);
        return;
      }
      setShow(true);
    } catch {
      // Storage unavailable (private mode, blocked cookies): show the banner
      // rather than silently assuming consent.
      setShow(true);
    }
  }, []);

  function persist(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage unavailable */
    }
    setShow(false);
  }

  function accept() {
    persist("accepted");
    track("cookie_consent_given");
  }

  // Decline is a genuine decline: it records the choice and fires nothing.
  function decline() {
    persist("declined");
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "var(--green)",
        padding: "1rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--ff-sans)",
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.8)",
          margin: 0,
          flex: 1,
          minWidth: "220px",
          lineHeight: 1.6,
        }}
      >
        We use cookies to understand how visitors use Cape Vows.{" "}
        <a
          href="/privacy-policy.html"
          style={{ color: "var(--gold2)", textDecoration: "underline" }}
        >
          Privacy Policy
        </a>
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={decline}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--ff-sans)",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            padding: "0.5rem 0.5rem",
            minHeight: 44,
          }}
        >
          Decline
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={accept}
          style={{ padding: "0.5rem 1.25rem", fontSize: "0.68rem" }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
