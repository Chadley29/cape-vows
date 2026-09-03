import { useState } from "react";

// Mirrors the track() helper in App.jsx: fire-and-forget GA4, no import.
function track(event, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvywnbp";
// Subject and type match the live App.jsx VendorsPage form so submissions stay
// consistent with what is already in the Formspree inbox.
const SUBJECT = "General Enquiry — Cape Vows";
const FORM_TYPE = "contact";

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

export default function VendorContactForm() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
    const data = new FormData(form);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
        track("contact_submit", { type: FORM_TYPE });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => setOpen(true)}
      >
        Get in Touch
      </button>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "1.5rem",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 4px 24px var(--shadow)",
      }}
    >
      {status === "sent" ? (
        <p
          style={{
            color: "var(--green)",
            fontFamily: "var(--ff-body)",
            fontSize: 17,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          ✓ Thank you! We'll be in touch shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="_subject" value={SUBJECT} />
          <input type="hidden" name="type" value={FORM_TYPE} />
          <input
            name="name"
            required
            placeholder="Your name"
            style={inputStyle}
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            style={inputStyle}
          />
          <textarea
            name="message"
            placeholder="How can we help?"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />

          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              cursor: "pointer",
              margin: "4px 0 14px",
            }}
          >
            <input
              type="checkbox"
              name="consent"
              required
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
              enquiry, in accordance with the{" "}
              <a
                href="/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--gold)", textDecoration: "underline" }}
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                background: "var(--green)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "11px 22px",
                fontFamily: "var(--ff-sans)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setStatus("idle");
              }}
              style={{
                background: "none",
                border: "none",
                fontFamily: "var(--ff-sans)",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted)",
                cursor: "pointer",
                padding: "0.5rem",
              }}
            >
              Cancel
            </button>
          </div>

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
  );
}
