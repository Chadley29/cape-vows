import { useState } from "react";

// Extracted verbatim from src/App.jsx. The SPA passed onAddVenue/onAddVendor to
// push results into App-level state; the static admin page has no such store,
// so they default to no-ops and results stay session-local to this component.
export default function ResearchPanel({
  onAddVenue = () => {},
  onAddVendor = () => {},
}) {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("venue");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({});

  const research = async () => {
    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }
    setError("");
    setResult(null);
    setSaved(false);
    setLoading(true);
    const prompt =
      type === "venue"
        ? `You are a wedding venue researcher. URL: "${url}". Return ONLY valid JSON (no markdown):\n{"name":"","region":"Cape Winelands|Cape Town City|Atlantic Seaboard|Constantia Valley|Overberg|Garden Route|West Coast","type":"Wine Estate|Mountain Retreat|Beach & Coastal|Historic Manor|Garden Estate|Boutique Hotel|Farm & Country","capacity":"e.g. Up to 100","price":"Budget (< R50k)|Mid-Range (R50–150k)|Premium (R150–300k)|Luxury (R300k+)","address":"","phone":"","website":"${url}","description":"2-3 sentence description","highlight":"max 8 words","features":["f1","f2","f3","f4"]}`
        : `You are a wedding vendor researcher. URL: "${url}". Return ONLY valid JSON (no markdown):\n{"name":"","category":"Photography|Floristry|Catering|Entertainment|Coordination|Hair & Make-up|Décor & Hire|Cake & Desserts|Transport|Stationery","region":"Cape Winelands|Cape Town City|Atlantic Seaboard|Constantia Valley|Overberg|Garden Route|West Coast","description":"2-3 sentence description","priceRange":"","website":"${url}","phone":"","highlight":"max 8 words"}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content
        ?.map((b) => b.text || "")
        .filter(Boolean)
        .join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
      setForm(parsed);
    } catch {
      setError(
        "Could not extract details. Try another URL or fill in manually.",
      );
      const blank =
        type === "venue"
          ? {
              name: "",
              region: "Cape Winelands",
              type: "Wine Estate",
              capacity: "",
              price: "Mid-Range (R50–150k)",
              address: "",
              phone: "",
              website: url,
              description: "",
              highlight: "",
              features: [],
            }
          : {
              name: "",
              category: "Photography",
              region: "Cape Winelands",
              description: "",
              priceRange: "",
              website: url,
              phone: "",
              highlight: "",
            };
      setResult(blank);
      setForm(blank);
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    const entry = {
      id: Date.now(),
      ...form,
      features:
        typeof form.features === "string"
          ? form.features.split(",").map((s) => s.trim())
          : form.features || [],
    };
    type === "venue" ? onAddVenue(entry) : onAddVendor(entry);
    setSaved(true);
  };

  return (
    <div className="research-panel">
      <div className="research-title">🔍 AI Research Tool</div>
      <div className="research-sub">
        Paste any Western Cape venue or vendor URL and Claude will research and
        extract key details automatically.
      </div>
      <div className="research-input-row">
        <input
          className="research-url-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example-venue.co.za"
          onKeyDown={(e) => e.key === "Enter" && research()}
        />
        <select
          className="research-type-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="venue">Venue</option>
          <option value="vendor">Vendor</option>
        </select>
        <button
          className="btn btn-primary"
          onClick={research}
          disabled={loading}
          style={{ whiteSpace: "nowrap" }}
        >
          {loading ? "Researching…" : "Research & Extract"}
        </button>
      </div>
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontFamily: "var(--ff-sans)",
            fontSize: "0.85rem",
            color: "var(--muted)",
          }}
        >
          <div className="loading-bar" />
          Searching the web…
        </div>
      )}
      {error && <div className="error-notice">{error}</div>}
      {saved && (
        <div className="success-notice">
          ✓ Successfully added to the directory!
        </div>
      )}
      {result && (
        <div className="research-result">
          <div className="research-result-title">
            Extracted Details: Review & Edit Before Saving
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            {Object.entries(form).map(([key, val]) =>
              key === "id" ? null : (
                <div
                  className="research-field"
                  key={key}
                  style={{
                    gridColumn:
                      key === "description" || key === "features"
                        ? "1 / -1"
                        : undefined,
                  }}
                >
                  <label>{key}</label>
                  {key === "description" ? (
                    <textarea
                      value={val || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                    />
                  ) : key === "features" ? (
                    <input
                      value={Array.isArray(val) ? val.join(", ") : val || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      placeholder="Feature 1, Feature 2"
                    />
                  ) : key === "region" ? (
                    <select
                      value={val || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                    >
                      {[
                        "Cape Winelands",
                        "Cape Town City",
                        "Atlantic Seaboard",
                        "Constantia Valley",
                        "Overberg",
                        "Garden Route",
                        "West Coast",
                      ].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  ) : key === "type" && type === "venue" ? (
                    <select
                      value={val || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                    >
                      {[
                        "Wine Estate",
                        "Mountain Retreat",
                        "Beach & Coastal",
                        "Historic Manor",
                        "Garden Estate",
                        "Boutique Hotel",
                        "Farm & Country",
                      ].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  ) : key === "category" ? (
                    <select
                      value={val || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                    >
                      {[
                        "Photography",
                        "Floristry",
                        "Catering",
                        "Entertainment",
                        "Coordination",
                        "Hair & Make-up",
                        "Décor & Hire",
                        "Cake & Desserts",
                        "Transport",
                        "Stationery",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={val || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                    />
                  )}
                </div>
              ),
            )}
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button
              className="btn-green"
              style={{ width: "auto" }}
              onClick={save}
            >
              Add to Directory
            </button>
            <button
              className="btn-ghost"
              style={{ width: "auto" }}
              onClick={() => {
                setResult(null);
                setSaved(false);
              }}
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
