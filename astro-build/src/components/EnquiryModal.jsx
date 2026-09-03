import { useState, useEffect } from "react";
import { getGradient } from "../data/constants.js";

// Mirrors the track() helper in App.jsx: fire-and-forget GA4, no import.
function track(event, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvywnbp";

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  marginBottom: 12,
  border: "1px solid var(--border)",
  borderRadius: 6,
  fontFamily: "var(--ff-body)",
  fontSize: 16,
  background: "#fff",
  color: "var(--text)",
};

export default function EnquiryModal({ venue, onClose, showTrigger = false }) {
  // showTrigger=true: self-contained (renders its own mobile bar, starts closed).
  // showTrigger=false: parent controls mounting, so the modal shows immediately.
  const [open, setOpen] = useState(!showTrigger);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle");

  function close() {
    setOpen(false);
    if (onClose) onClose();
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Static [data-enquire] triggers live in the Astro page, outside this React
  // tree, so they are bound imperatively after hydration.
  useEffect(() => {
    const triggers = document.querySelectorAll("[data-enquire]");
    const onClick = (e) => {
      e.preventDefault();
      setOpen(true);
      track("enquiry_open", { venue_name: venue.name, source: "sidebar" });
    };
    triggers.forEach((el) => el.addEventListener("click", onClick));
    return () =>
      triggers.forEach((el) => el.removeEventListener("click", onClick));
  }, [venue.name]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!consent) return;
    setStatus("submitting");

    const data = new FormData();
    data.append("_subject", `Venue Enquiry — ${venue.name} — Cape Vows`);
    data.append("type", "venue_enquiry");
    data.append("venue", venue.name);
    data.append("region", venue.region);
    data.append("name", name);
    data.append("email", email);
    data.append("phone", phone);
    data.append("date", date);
    data.append("guests", guests);
    data.append("message", message);
    data.append("consent", "yes");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        track("venue_enquiry", {
          venue_name: venue.name,
          venue_region: venue.region,
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {showTrigger && (
        <div className="mobile-enquiry-bar">
          <button
            className="btn-green"
            type="button"
            style={{
              width: "100%",
              maxWidth: 400,
              fontSize: "0.72rem",
              padding: "0.85rem 1.5rem",
            }}
            onClick={() => {
              setOpen(true);
              track("enquiry_open", {
                venue_name: venue.name,
                source: "mobile_bar",
              });
            }}
          >
            Enquire About This Venue
          </button>
        </div>
      )}

      {open && (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          className="modal-hero"
          style={{ background: getGradient(venue.type), height: 140 }}
        >
          <div className="modal-hero-overlay" />
          <span className="modal-badge">{venue.type}</span>
          <button
            className="modal-close"
            onClick={close}
            aria-label="Close enquiry form"
            type="button"
          >
            ✕
          </button>
          <div className="modal-hero-text">{venue.name}</div>
        </div>

        <div className="modal-body">
          <div className="modal-eyebrow">
            {venue.region} · Western Cape
          </div>

          {status === "success" ? (
            <div>
              <p
                style={{
                  color: "var(--green)",
                  fontFamily: "var(--ff-body)",
                  fontSize: 18,
                  lineHeight: 1.6,
                  marginBottom: "0.5rem",
                }}
              >
                ✓ Enquiry sent for {venue.name}!
              </p>
              <p
                style={{
                  fontFamily: "var(--ff-sans)",
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                }}
              >
                We typically respond within 1–2 business days.
              </p>
              <a
                className="btn-green"
                href={`/venues?region=${encodeURIComponent(venue.region)}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Browse more venues in {venue.region}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
              <input
                name="date"
                type="date"
                placeholder="Preferred date (optional)"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />
              <input
                name="guests"
                type="number"
                min="1"
                placeholder="Approximate guest count (optional)"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                style={inputStyle}
              />
              <textarea
                name="message"
                placeholder="Tell us about your wedding: date, guest count, any questions"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <label
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  cursor: "pointer",
                  margin: "14px 0 4px",
                }}
              >
                <input
                  type="checkbox"
                  name="consent"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{
                    marginTop: 3,
                    flexShrink: 0,
                    accentColor: "var(--green)",
                    width: 15,
                    height: 15,
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--ff-sans)",
                    fontSize: "0.7rem",
                    color: "var(--muted)",
                    lineHeight: 1.55,
                  }}
                >
                  I consent to Cape Vows processing my details to handle this
                  venue enquiry, in accordance with the{" "}
                  <a
                    href="/privacy-policy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--gold)",
                      textDecoration: "underline",
                    }}
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={!consent || status === "submitting"}
                style={{
                  background: "var(--green)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "12px 24px",
                  width: "100%",
                  fontFamily: "var(--ff-sans)",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: !consent ? "not-allowed" : "pointer",
                  opacity: !consent ? 0.55 : 1,
                  marginTop: 10,
                }}
              >
                {status === "submitting" ? "Sending…" : "Send Enquiry"}
              </button>

              {status === "error" && (
                <p
                  style={{
                    color: "#c83c3c",
                    fontSize: 13,
                    marginTop: 8,
                    fontFamily: "var(--ff-sans)",
                  }}
                >
                  Something went wrong. Email us at hello@capevows.co.za
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
      )}
    </>
  );
}
