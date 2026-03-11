import { useState, useEffect, useRef } from "react";

// ─── Google Fonts ──────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ─── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cream:    #FAF7F2;
    --cream2:   #F3EDE3;
    --green:    #2D4A3E;
    --green2:   #3D6356;
    --gold:     #B8895A;
    --gold2:    #D4A87A;
    --blush:    #E8CFC2;
    --blush2:   #F2E4DC;
    --text:     #1C1C1A;
    --muted:    #7A7266;
    --border:   #DDD4C8;
    --shadow:   rgba(45,74,62,0.10);
    --ff-serif: 'Playfair Display', Georgia, serif;
    --ff-body:  'Cormorant Garamond', Georgia, serif;
    --ff-sans:  'Jost', sans-serif;
  }
  body { background: var(--cream); color: var(--text); font-family: var(--ff-body); font-size: 18px; line-height: 1.6; }
  
  /* Nav */
  nav { position: sticky; top: 0; z-index: 100; background: rgba(250,247,242,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 2.5rem; height: 64px; }
  .nav-logo { font-family: var(--ff-serif); font-size: 1.25rem; color: var(--green); font-style: italic; font-weight: 600; letter-spacing: 0.02em; cursor: pointer; }
  .nav-logo span { color: var(--gold); }
  .nav-links { display: flex; gap: 0; }
  .nav-link { font-family: var(--ff-sans); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.5rem 1rem; color: var(--muted); cursor: pointer; border: none; background: none; transition: color 0.2s; }
  .nav-link:hover, .nav-link.active { color: var(--green); }
  .nav-link.cta { background: var(--green); color: #fff; border-radius: 2px; padding: 0.4rem 1rem; }
  .nav-link.cta:hover { background: var(--green2); color: #fff; }

  /* Hero */
  .hero { position: relative; min-height: 88vh; display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--green); }
  .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1a2e26 0%, #2D4A3E 40%, #3d6356 70%, #8a6b4a 100%); }
  .hero-pattern { position: absolute; inset: 0; opacity: 0.08; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 20px 20px; }
  .hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 60% 50%, rgba(184,137,90,0.15) 0%, transparent 60%); }
  .hero-content { position: relative; z-index: 2; text-align: center; padding: 2rem; max-width: 780px; }
  .hero-eyebrow { font-family: var(--ff-sans); font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold2); margin-bottom: 1.5rem; }
  .hero-title { font-family: var(--ff-serif); font-size: clamp(2.8rem, 7vw, 5.5rem); color: #fff; line-height: 1.1; font-weight: 700; margin-bottom: 0.5rem; }
  .hero-title em { font-style: italic; color: var(--gold2); }
  .hero-sub { font-family: var(--ff-body); font-size: clamp(1.1rem, 2vw, 1.4rem); color: rgba(255,255,255,0.75); font-weight: 300; margin: 1.5rem 0 2.5rem; letter-spacing: 0.02em; }
  .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; border: none; cursor: pointer; transition: all 0.25s; border-radius: 2px; padding: 0.85rem 2rem; }
  .btn-primary { background: var(--gold); color: #fff; }
  .btn-primary:hover { background: var(--gold2); transform: translateY(-1px); }
  .btn-outline { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.4); }
  .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.7); }
  .hero-stats { position: absolute; bottom: 2.5rem; left: 0; right: 0; display: flex; justify-content: center; gap: 3rem; z-index: 2; }
  .hero-stat { text-align: center; color: rgba(255,255,255,0.8); }
  .hero-stat-n { font-family: var(--ff-serif); font-size: 2rem; color: var(--gold2); display: block; }
  .hero-stat-l { font-family: var(--ff-sans); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.7; }

  /* Section */
  section { padding: 5rem 2.5rem; max-width: 1200px; margin: 0 auto; }
  .section-eyebrow { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.75rem; }
  .section-title { font-family: var(--ff-serif); font-size: clamp(2rem, 4vw, 3rem); color: var(--green); line-height: 1.2; margin-bottom: 1rem; }
  .section-title em { font-style: italic; }
  .section-desc { font-family: var(--ff-body); font-size: 1.1rem; color: var(--muted); max-width: 560px; line-height: 1.7; }
  .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3rem; flex-wrap: wrap; gap: 1.5rem; }

  /* Filter bar */
  .filter-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; padding: 1.25rem 1.5rem; background: #fff; border: 1px solid var(--border); border-radius: 4px; box-shadow: 0 2px 12px var(--shadow); }
  .filter-group { display: flex; flex-direction: column; gap: 0.3rem; min-width: 140px; }
  .filter-label { font-family: var(--ff-sans); font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
  .filter-select { font-family: var(--ff-sans); font-size: 0.85rem; color: var(--text); border: 1px solid var(--border); background: var(--cream); padding: 0.45rem 0.75rem; border-radius: 2px; cursor: pointer; appearance: none; }
  .filter-select:focus { outline: 2px solid var(--gold); outline-offset: 1px; }
  .filter-search { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 0.3rem; }
  .filter-input { font-family: var(--ff-sans); font-size: 0.9rem; color: var(--text); border: 1px solid var(--border); background: var(--cream); padding: 0.45rem 0.75rem; border-radius: 2px; }
  .filter-input:focus { outline: 2px solid var(--gold); outline-offset: 1px; }
  .filter-clear { font-family: var(--ff-sans); font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0.3rem 0.5rem; margin-top: auto; transition: color 0.2s; }
  .filter-clear:hover { color: var(--green); }

  /* Cards */
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 12px var(--shadow); }
  .card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px var(--shadow); border-color: var(--gold); }
  .card-img { width: 100%; height: 220px; position: relative; overflow: hidden; background: var(--green); }
  .card-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .card:hover .card-img img { transform: scale(1.04); }
  .card-img-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--ff-serif); font-size: 3rem; color: rgba(255,255,255,0.3); font-style: italic; }
  .card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 50%); pointer-events: none; }
  .card-badge { position: absolute; top: 1rem; right: 1rem; font-family: var(--ff-sans); font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; background: var(--gold); color: #fff; padding: 0.25rem 0.6rem; border-radius: 1px; }
  .card-body { padding: 1.5rem; }
  .card-region { font-family: var(--ff-sans); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.4rem; }
  .card-title { font-family: var(--ff-serif); font-size: 1.3rem; color: var(--green); margin-bottom: 0.5rem; line-height: 1.2; }
  .card-desc { font-family: var(--ff-body); font-size: 0.95rem; color: var(--muted); line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .card-meta { display: flex; gap: 1rem; flex-wrap: wrap; }
  .card-pill { font-family: var(--ff-sans); font-size: 0.65rem; letter-spacing: 0.08em; background: var(--cream2); color: var(--muted); padding: 0.25rem 0.65rem; border-radius: 12px; }
  .card-pill.green { background: rgba(45,74,62,0.08); color: var(--green); }
  .card-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-price { font-family: var(--ff-serif); font-size: 1rem; color: var(--green); font-style: italic; }
  .card-link { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); font-weight: 600; }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(20,30,25,0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--cream); border-radius: 8px; max-width: 780px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 30px 80px rgba(0,0,0,0.3); animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-hero { width: 100%; height: 300px; background: var(--green); position: relative; overflow: hidden; }
  .modal-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .modal-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,35,28,0.65) 0%, rgba(0,0,0,0.15) 60%, transparent 100%); }
  .modal-hero-text { position: absolute; bottom: 1.5rem; left: 2rem; font-family: var(--ff-serif); font-size: 1.75rem; color: rgba(255,255,255,0.9); font-style: italic; font-weight: 600; text-shadow: 0 2px 12px rgba(0,0,0,0.4); }
  .modal-badge { position: absolute; top: 1.5rem; left: 1.5rem; font-family: var(--ff-sans); font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; background: var(--gold); color: #fff; padding: 0.3rem 0.8rem; border-radius: 2px; }
  .modal-close { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(0,0,0,0.4); border: none; color: #fff; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .modal-close:hover { background: rgba(0,0,0,0.7); }
  .modal-body { padding: 2rem 2.5rem; }
  .modal-eyebrow { font-family: var(--ff-sans); font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
  .modal-title { font-family: var(--ff-serif); font-size: 2rem; color: var(--green); margin-bottom: 1rem; line-height: 1.15; }
  .modal-desc { font-family: var(--ff-body); font-size: 1.05rem; color: var(--muted); line-height: 1.75; margin-bottom: 2rem; }
  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 2rem; margin-bottom: 2rem; }
  .modal-detail { border-bottom: 1px solid var(--border); padding-bottom: 0.6rem; }
  .modal-detail-label { font-family: var(--ff-sans); font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.2rem; }
  .modal-detail-value { font-family: var(--ff-body); font-size: 1rem; color: var(--text); font-weight: 400; }
  .modal-actions { display: flex; gap: 1rem; flex-wrap: wrap; padding: 1.5rem 2.5rem 2rem; border-top: 1px solid var(--border); }
  .btn-green { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; background: var(--green); color: #fff; border: none; cursor: pointer; padding: 0.85rem 1.75rem; border-radius: 2px; transition: all 0.2s; }
  .btn-green:hover { background: var(--green2); }
  .btn-ghost { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; background: transparent; color: var(--green); border: 1.5px solid var(--green); cursor: pointer; padding: 0.85rem 1.75rem; border-radius: 2px; transition: all 0.2s; }
  .btn-ghost:hover { background: var(--cream2); }

  /* Admin / Research */
  .research-panel { background: #fff; border: 1px solid var(--border); border-radius: 6px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 16px var(--shadow); }
  .research-title { font-family: var(--ff-serif); font-size: 1.5rem; color: var(--green); margin-bottom: 0.5rem; }
  .research-sub { font-family: var(--ff-body); font-size: 0.95rem; color: var(--muted); margin-bottom: 1.5rem; }
  .research-input-row { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .research-url-input { flex: 1; min-width: 250px; font-family: var(--ff-sans); font-size: 0.9rem; border: 1.5px solid var(--border); border-radius: 3px; padding: 0.65rem 1rem; background: var(--cream); color: var(--text); }
  .research-url-input:focus { outline: 2px solid var(--gold); outline-offset: 1px; border-color: var(--gold); }
  .research-type-select { font-family: var(--ff-sans); font-size: 0.85rem; border: 1.5px solid var(--border); border-radius: 3px; padding: 0.65rem 1rem; background: var(--cream); color: var(--text); min-width: 130px; }
  .research-result { background: var(--cream2); border: 1px solid var(--border); border-radius: 4px; padding: 1.5rem; margin-top: 1.5rem; }
  .research-result-title { font-family: var(--ff-sans); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; }
  .research-field { margin-bottom: 1rem; }
  .research-field label { font-family: var(--ff-sans); font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 0.25rem; }
  .research-field input, .research-field textarea, .research-field select { width: 100%; font-family: var(--ff-sans); font-size: 0.9rem; border: 1.5px solid var(--border); border-radius: 3px; padding: 0.6rem 0.85rem; background: #fff; color: var(--text); }
  .research-field textarea { resize: vertical; min-height: 80px; font-family: var(--ff-body); font-size: 0.95rem; line-height: 1.5; }
  .loading-dots { display: inline-flex; gap: 4px; }
  .loading-dots span { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; animation: bounce 1.2s infinite; }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

  /* Tabs */
  .tabs { display: flex; gap: 0; border-bottom: 2px solid var(--border); margin-bottom: 2rem; }
  .tab { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; padding: 0.75rem 1.5rem; cursor: pointer; border: none; background: none; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
  .tab.active { color: var(--green); border-bottom-color: var(--green); }
  .tab:hover { color: var(--green); }

  /* Tags / chips */
  .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .tag { font-family: var(--ff-sans); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.3rem 0.75rem; border-radius: 12px; cursor: pointer; border: 1px solid var(--border); background: var(--cream2); color: var(--muted); transition: all 0.2s; }
  .tag.active { background: var(--green); color: #fff; border-color: var(--green); }
  .tag:hover:not(.active) { border-color: var(--green); color: var(--green); }

  /* Empty state */
  .empty { text-align: center; padding: 4rem 2rem; }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
  .empty-title { font-family: var(--ff-serif); font-size: 1.5rem; color: var(--green); margin-bottom: 0.5rem; }
  .empty-sub { font-family: var(--ff-body); color: var(--muted); }

  /* Footer */
  footer { background: var(--green); color: rgba(255,255,255,0.7); text-align: center; padding: 3rem 2rem; margin-top: 4rem; }
  .footer-logo { font-family: var(--ff-serif); font-size: 1.5rem; color: var(--gold2); font-style: italic; margin-bottom: 0.75rem; }
  .footer-sub { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.5; }

  /* Utility */
  .divider { border: none; border-top: 1px solid var(--border); margin: 2.5rem 0; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .results-count { font-family: var(--ff-sans); font-size: 0.75rem; color: var(--muted); letter-spacing: 0.05em; }
  .notice { background: rgba(184,137,90,0.1); border-left: 3px solid var(--gold); padding: 0.75rem 1rem; border-radius: 0 3px 3px 0; font-family: var(--ff-sans); font-size: 0.82rem; color: var(--text); margin-bottom: 1.5rem; }
  .error-notice { background: rgba(200,60,60,0.08); border-left: 3px solid #c83c3c; padding: 0.75rem 1rem; border-radius: 0 3px 3px 0; font-family: var(--ff-sans); font-size: 0.82rem; color: #8a2222; margin-bottom: 1.5rem; }
  .success-notice { background: rgba(45,74,62,0.08); border-left: 3px solid var(--green); padding: 0.75rem 1rem; border-radius: 0 3px 3px 0; font-family: var(--ff-sans); font-size: 0.82rem; color: var(--green); margin-bottom: 1.5rem; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ─── Data ──────────────────────────────────────────────────────────────────────
const REGIONS = ["All Regions", "Cape Winelands", "Cape Town City", "Atlantic Seaboard", "Constantia Valley", "Overberg", "Garden Route", "West Coast"];
const VENUE_TYPES = ["All Types", "Wine Estate", "Mountain Retreat", "Beach & Coastal", "Historic Manor", "Garden Estate", "Boutique Hotel", "Farm & Country"];
const CAPACITIES = ["Any Capacity", "Up to 50", "50–100", "100–200", "200+"];
const PRICE_RANGES = ["Any Budget", "Budget (< R50k)", "Mid-Range (R50–150k)", "Premium (R150–300k)", "Luxury (R300k+)"];

const VENDOR_CATS = ["All", "Photography", "Floristry", "Catering", "Entertainment", "Coordination", "Hair & Make-up", "Décor & Hire", "Cake & Desserts", "Transport", "Stationery"];

const VENUES = [
  { id: 1, img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80", name: "Babylonstoren", region: "Cape Winelands", type: "Wine Estate", capacity: "150", price: "Luxury (R300k+)", address: "Babylonstoren Farm, Simondium, Franschhoek", phone: "+27 21 863 3852", website: "https://babylonstoren.com", description: "A magnificently restored Cape Dutch farm with a historic homestead, eight themed gardens and breathtaking Simonsberg Mountain views. The estate offers an unparalleled setting for bespoke weddings in one of South Africa's most celebrated wine regions.", features: ["Wine Tasting", "On-site Accommodation", "Farm-to-Table Catering", "Bridal Suite", "Mountain Views", "Outdoor Ceremony"], highlight: "Eight iconic heritage gardens" },
  { id: 2, img: "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?auto=format&fit=crop&w=800&q=80", name: "Boschendal Wine Estate", region: "Cape Winelands", type: "Wine Estate", capacity: "200+", price: "Premium (R150–300k)", address: "Pniel Road, Groot Drakenstein, Franschhoek", phone: "+27 21 870 4200", website: "https://boschendal.com", description: "One of South Africa's oldest wine farms, dating back to 1685. Boschendal's iconic Cape Dutch manor house and sprawling grounds provide a timeless backdrop against the Drakenstein Mountains.", features: ["Cape Dutch Architecture", "Award-winning Wines", "Multiple Venues", "Accommodation", "Gourmet Catering", "Heritage Gardens"], highlight: "Founded in 1685 — over 300 years of history" },
  { id: 3, img: "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?auto=format&fit=crop&w=800&q=80", name: "Cavalli Estate", region: "Cape Winelands", type: "Wine Estate", capacity: "200+", price: "Luxury (R300k+)", address: "R44, Somerset West, Helderberg", phone: "+27 21 855 3218", website: "https://cavalliwines.co.za", description: "An ultra-modern equestrian wine estate where equine elegance meets contemporary luxury. Cavalli features a striking glass-and-steel venue with panoramic vineyard and mountain views, plus a working stud farm.", features: ["Modern Architecture", "Equestrian Setting", "Fine Dining", "Wine & Art", "Helicopter Access", "Bridal Suite"], highlight: "Stunning glass venue overlooking the Helderberg" },
  { id: 4, img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80", name: "La Motte Wine Estate", region: "Cape Winelands", type: "Wine Estate", capacity: "100–200", price: "Premium (R150–300k)", address: "R45, Main Road, Franschhoek", phone: "+27 21 876 8000", website: "https://la-motte.com", description: "Nestled in the heart of Franschhoek Valley, La Motte combines exceptional wine, art, and heritage. The estate's beautifully restored homestead and museum create an intimate, cultured wedding atmosphere.", features: ["Art Museum On-site", "Heritage Homestead", "Award-winning Restaurant", "Wine Pairing", "Fynbos Gardens", "Intimate Ceremony Spaces"], highlight: "Where wine, art, and heritage intertwine" },
  { id: 5, img: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=800&q=80", name: "Clouds Estate", region: "Cape Winelands", type: "Mountain Retreat", capacity: "50–100", price: "Premium (R150–300k)", address: "Helshoogte Pass, Stellenbosch", phone: "+27 21 880 0575", website: "https://cloudsestate.co.za", description: "Perched on Helshoogte Pass with breathtaking valley views, Clouds Estate offers an intimate, exclusive wedding experience. Luxurious guest suites allow the bridal party to stay on-site in total privacy.", features: ["360° Mountain Views", "Exclusive-use Venue", "Luxury Guest Suites", "Vineyard Setting", "On-site Sommelier", "Private Chef"], highlight: "Exclusive-use boutique estate with valley vistas" },
  { id: 6, img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80", name: "Zorgvliet Wines", region: "Cape Winelands", type: "Farm & Country", capacity: "100–200", price: "Mid-Range (R50–150k)", address: "Banhoek Valley, Stellenbosch", phone: "+27 21 885 1399", website: "https://zorgvliet.com", description: "Hidden in the lush Banhoek Valley between Stellenbosch and Franschhoek, Zorgvliet is a tranquil wine farm offering a beautifully intimate setting with magnificent mountain surrounds and indigenous gardens.", features: ["Banhoek Valley Setting", "Indigenous Gardens", "River Views", "Rustic Barn Venue", "Wine Tasting", "Country Charm"], highlight: "Secret valley charm with mountain backdrops" },
  { id: 7, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", name: "The Roundhouse Restaurant", region: "Atlantic Seaboard", type: "Historic Manor", capacity: "50–100", price: "Premium (R150–300k)", address: "Roundhouse Rd, Camps Bay, Cape Town", phone: "+27 21 438 4347", website: "https://theroundhouserestaurant.com", description: "A storied 18th-century hunting lodge perched above Camps Bay with unparalleled views of the Atlantic Ocean and Lion's Head. The Roundhouse is iconic Cape Town heritage at its finest.", features: ["Atlantic Ocean Views", "18th-Century Heritage", "Gourmet Cuisine", "Intimate Setting", "Lion's Head Backdrop", "Sunset Ceremonies"], highlight: "Atlantic sunset ceremonies above Camps Bay" },
  { id: 8, img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80", name: "Nooitgedacht Wine Estate", region: "Cape Winelands", type: "Garden Estate", capacity: "200+", price: "Mid-Range (R50–150k)", address: "Nooitgedacht Farm, Koelenhof, Stellenbosch", phone: "+27 21 865 2495", website: "https://nooitgedacht.co.za", description: "A sprawling Stellenbosch estate with beautiful rose gardens, a restored manor house, and charming farm atmosphere. Nooitgedacht offers a versatile setting for both intimate garden ceremonies and large celebrations.", features: ["Rose Gardens", "Manor House", "Large Capacity", "Multiple Reception Areas", "Flexible Packages", "On-site Catering"], highlight: "Famous rose gardens in full bloom" },
  { id: 9, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", name: "Groot Constantia", region: "Constantia Valley", type: "Historic Manor", capacity: "100–200", price: "Premium (R150–300k)", address: "Groot Constantia Rd, Constantia, Cape Town", phone: "+27 21 794 5128", website: "https://grootconstantia.co.za", description: "South Africa's oldest wine estate, founded in 1685 by Simon van der Stel. The National Monument manor house and ancient oak trees create an incomparably historic wedding setting in the Constantia valley.", features: ["National Monument", "Oldest Wine Farm", "Oak-lined Avenues", "Museum On-site", "Multiple Restaurants", "Heritage Cellar"], highlight: "South Africa's oldest wine estate — est. 1685" },
  { id: 10, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", name: "The Conservatory at Steenberg", region: "Constantia Valley", type: "Boutique Hotel", capacity: "50–100", price: "Luxury (R300k+)", address: "Steenberg Road, Tokai, Cape Town", phone: "+27 21 713 2222", website: "https://steenberghotel.com", description: "The elegant Steenberg Hotel sits on a historic 1682 farm in Constantia. The Conservatory venue features soaring glass ceilings and vineyard views, with 5-star hotel amenities for the perfect luxury wedding weekend.", features: ["5-Star Hotel", "Glass Conservatory", "Golf Course", "Vineyard Views", "Full Accommodation", "Spa & Wellness"], highlight: "5-star luxury on a 1682 historic farm" },
  { id: 11, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", name: "Hawksmoor House", region: "Cape Town City", type: "Historic Manor", capacity: "50–100", price: "Premium (R150–300k)", address: "14 Hawksmoor Way, Bishopscourt, Cape Town", phone: "+27 21 797 7200", website: "https://hawksmoorhouse.co.za", description: "A beautiful Victorian manor house in the leafy suburb of Bishopscourt, with manicured gardens, a sparkling pool, and the sense of stepping back in time. Exclusive-use venue with full hospitality.", features: ["Victorian Architecture", "Manicured Gardens", "Exclusive-use", "Swimming Pool", "Full Catering", "Bridal Suite"], highlight: "Victorian elegance in Cape Town's leafy south" },
  { id: 12, img: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80", name: "Stanford Valley Guest Farm", region: "Overberg", type: "Farm & Country", capacity: "50–100", price: "Mid-Range (R50–150k)", address: "R326, Stanford, Western Cape", phone: "+27 28 341 0860", website: "https://stanfordvalley.com", description: "A magical fynbos and wheat-field farm near the Klein River, where countryside simplicity meets romantic charm. Stanford Valley offers rustic farm weddings with a genuine Overberg backdrop.", features: ["Fynbos Setting", "Rustic Farm Aesthetic", "River Views", "Country Accommodation", "Klein River Access", "Farm Activities"], highlight: "Authentic fynbos countryside near the ocean" },
];

const VENDORS = [
  { id: 101, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80", name: "Lad & Lass Photography", category: "Photography", region: "Cape Winelands", description: "Award-winning wedding photographers with over 10 years documenting love stories across the Western Cape wine estates. Known for a romantic, editorial style.", priceRange: "R20 000–R45 000", website: "https://ladandlass.co.za", phone: "+27 72 123 4567", highlight: "Editorial & Fine Art Style" },
  { id: 102, img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80", name: "Jean-Pierre Uys Photography", category: "Photography", region: "Cape Town City", description: "Cape Town-based destination wedding photographer. Natural light specialist known for timeless, emotion-driven imagery on South Africa's most beautiful locations.", priceRange: "R25 000–R60 000", website: "#", phone: "+27 82 987 6543", highlight: "Destination & Natural Light" },
  { id: 103, img: "https://images.unsplash.com/photo-1490750967868-88df5691cc47?auto=format&fit=crop&w=800&q=80", name: "The Floristry by Claire", category: "Floristry", region: "Cape Winelands", description: "Bespoke floral design for discerning Cape brides. Specialising in lush, garden-gathered arrangements using local proteas, fynbos, and seasonal blooms.", priceRange: "R15 000–R80 000", website: "#", phone: "+27 83 234 5678", highlight: "Fynbos & Protea Specialists" },
  { id: 104, img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", name: "Petal & Stem Floral Design", category: "Floristry", region: "Cape Town City", description: "Contemporary floral studio creating bold, sculptural installations for modern Cape weddings. Featured in Brides SA and Style Me Pretty.", priceRange: "R20 000–R120 000", website: "#", phone: "+27 71 345 6789", highlight: "Sculptural Installations" },
  { id: 105, img: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=800&q=80", name: "Nicolette Weddings & Events", category: "Coordination", region: "Cape Winelands", description: "Full-service wedding planning and coordination based in Stellenbosch. Over 200 weddings planned across the Cape. COZA-certified planner.", priceRange: "R35 000–R85 000", website: "#", phone: "+27 82 456 7890", highlight: "200+ Weddings Planned" },
  { id: 106, img: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80", name: "Confetti & Cake", category: "Cake & Desserts", region: "Constantia Valley", description: "Artisan wedding cakes and dessert tables handcrafted in Cape Town. Known for intricate sugar-flower work and flavour-forward designs that taste as good as they look.", priceRange: "R8 000–R35 000", website: "#", phone: "+27 79 567 8901", highlight: "Sugar Flower Artistry" },
  { id: 107, img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80", name: "Cape String Quartet", category: "Entertainment", region: "Cape Town City", description: "Professional string ensemble performing classical to contemporary, perfect for ceremonies and cocktail hours. Customisable repertoire from Bach to Beyoncé.", priceRange: "R12 000–R28 000", website: "#", phone: "+27 83 678 9012", highlight: "Classical to Contemporary" },
  { id: 108, img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80", name: "DJ André Visser", category: "Entertainment", region: "Cape Winelands", description: "Top Cape wedding DJ with over 15 years experience keeping dance floors packed. Specialises in seamless transitions and reading the energy of the room.", priceRange: "R15 000–R30 000", website: "#", phone: "+27 72 789 0123", highlight: "15+ Years Experience" },
  { id: 109, img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", name: "The Wedding Table Co.", category: "Décor & Hire", region: "Cape Winelands", description: "Premium furniture, linen, and tableware hire for Western Cape weddings. From rustic farm tables to crystal-and-gold luxury, we dress your dream reception.", priceRange: "R20 000–R100 000+", website: "#", phone: "+27 83 890 1234", highlight: "Full Luxury Linen & Furniture" },
  { id: 110, img: "https://images.unsplash.com/photo-1522844990619-4951c40f7eda?auto=format&fit=crop&w=800&q=80", name: "Glow & Grace Beauty Studio", category: "Hair & Make-up", region: "Atlantic Seaboard", description: "Bridal beauty team led by senior artist Mia Joubert. On-location services across the Western Cape, specialising in airbrush make-up and long-lasting bridal looks.", priceRange: "R5 500–R18 000", website: "#", phone: "+27 71 901 2345", highlight: "On-Location Airbrush Artistry" },
  { id: 111, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80", name: "Winelands Catering Co.", category: "Catering", region: "Cape Winelands", description: "Bespoke catering for wine estate weddings. Farm-to-fork menus designed around seasonal Western Cape produce, with a team of chefs trained at world-class restaurants.", priceRange: "R650–R1800 per head", website: "#", phone: "+27 82 012 3456", highlight: "Farm-to-Fork Seasonal Menus" },
  { id: 112, img: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=800&q=80", name: "Classic Wedding Cars Cape Town", category: "Transport", region: "Cape Town City", description: "A fleet of classic and vintage vehicles including Rolls-Royce Silver Shadow, Bentley, and 1960s Mercedes. Chauffeur-driven transfers across the Cape Peninsula and Winelands.", priceRange: "R4 500–R15 000", website: "#", phone: "+27 83 123 6789", highlight: "Rolls-Royce & Vintage Fleet" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const gradients = [
  "linear-gradient(135deg, #2D4A3E 0%, #3d6356 50%, #8a6b4a 100%)",
  "linear-gradient(135deg, #3d2f4a 0%, #5c4475 50%, #8a6b9a 100%)",
  "linear-gradient(135deg, #4a2d2d 0%, #754444 50%, #9a8068 100%)",
  "linear-gradient(135deg, #2d3d4a 0%, #3d5a75 50%, #6a8a9a 100%)",
  "linear-gradient(135deg, #3a4a2d 0%, #567544 50%, #8a9a6a 100%)",
];
const getGradient = (id) => gradients[id % gradients.length];

// ─── Components ────────────────────────────────────────────────────────────────
function VenueCard({ venue, onClick }) {
  return (
    <div className="card" onClick={() => onClick(venue)}>
      <div className="card-img">
        {venue.img
          ? <img src={venue.img} alt={venue.name} loading="lazy" />
          : <span className="card-img-placeholder">{venue.name[0]}</span>
        }
        <div className="card-img-overlay" />
        <span className="card-badge">{venue.type}</span>
      </div>
      <div className="card-body">
        <div className="card-region">{venue.region}</div>
        <div className="card-title">{venue.name}</div>
        <div className="card-desc">{venue.description}</div>
        <div className="card-meta">
          <span className="card-pill">👥 {venue.capacity}</span>
          <span className="card-pill green">✦ {venue.highlight}</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="card-price">{venue.price}</span>
        <span className="card-link">View Details →</span>
      </div>
    </div>
  );
}

function VendorCard({ vendor, onClick }) {
  return (
    <div className="card" onClick={() => onClick(vendor)}>
      <div className="card-img" style={{ height: "180px" }}>
        {vendor.img
          ? <img src={vendor.img} alt={vendor.name} loading="lazy" />
          : <span className="card-img-placeholder">{vendor.name[0]}</span>
        }
        <div className="card-img-overlay" />
        <span className="card-badge">{vendor.category}</span>
      </div>
      <div className="card-body">
        <div className="card-region">{vendor.region}</div>
        <div className="card-title">{vendor.name}</div>
        <div className="card-desc">{vendor.description}</div>
        <div className="card-meta">
          <span className="card-pill green">✦ {vendor.highlight}</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="card-price" style={{ fontSize: "0.85rem" }}>{vendor.priceRange}</span>
        <span className="card-link">View Details →</span>
      </div>
    </div>
  );
}

function VenueModal({ venue, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-hero">
          {venue.img
            ? <img src={venue.img} alt={venue.name} />
            : <div style={{ background: getGradient(venue.id), width: "100%", height: "100%" }} />
          }
          <div className="modal-hero-overlay" />
          <span className="modal-hero-text">{venue.name}</span>
          <span className="modal-badge">{venue.type}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-eyebrow">{venue.region}</div>
          <div className="modal-title">{venue.name}</div>
          <div className="modal-desc">{venue.description}</div>
          <div className="modal-grid">
            <div className="modal-detail"><div className="modal-detail-label">Capacity</div><div className="modal-detail-value">{venue.capacity} guests</div></div>
            <div className="modal-detail"><div className="modal-detail-label">Price Range</div><div className="modal-detail-value">{venue.price}</div></div>
            <div className="modal-detail"><div className="modal-detail-label">Address</div><div className="modal-detail-value">{venue.address}</div></div>
            <div className="modal-detail"><div className="modal-detail-label">Phone</div><div className="modal-detail-value">{venue.phone}</div></div>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <div className="modal-detail-label" style={{ marginBottom: "0.75rem" }}>Features & Inclusions</div>
            <div className="tags" style={{ marginBottom: 0 }}>
              {venue.features.map(f => <span key={f} className="tag active">{f}</span>)}
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <a href={venue.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button className="btn-green">Visit Official Website</button>
          </a>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function VendorModal({ vendor, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-hero" style={{ height: "220px" }}>
          {vendor.img
            ? <img src={vendor.img} alt={vendor.name} />
            : <div style={{ background: getGradient(vendor.id), width: "100%", height: "100%" }} />
          }
          <div className="modal-hero-overlay" />
          <span className="modal-hero-text">{vendor.name}</span>
          <span className="modal-badge">{vendor.category}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-eyebrow">{vendor.region} · {vendor.category}</div>
          <div className="modal-title">{vendor.name}</div>
          <div className="modal-desc">{vendor.description}</div>
          <div className="modal-grid">
            <div className="modal-detail"><div className="modal-detail-label">Price Range</div><div className="modal-detail-value">{vendor.priceRange}</div></div>
            <div className="modal-detail"><div className="modal-detail-label">Phone</div><div className="modal-detail-value">{vendor.phone}</div></div>
            <div className="modal-detail"><div className="modal-detail-label">Speciality</div><div className="modal-detail-value">{vendor.highlight}</div></div>
            <div className="modal-detail"><div className="modal-detail-label">Region</div><div className="modal-detail-value">{vendor.region}</div></div>
          </div>
        </div>
        <div className="modal-actions">
          <a href={vendor.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button className="btn-green">Visit Website</button>
          </a>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── AI Research Panel ─────────────────────────────────────────────────────────
function ResearchPanel({ onAddVenue, onAddVendor }) {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("venue");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({});

  const research = async () => {
    if (!url.trim()) { setError("Please enter a website URL."); return; }
    setError(""); setResult(null); setSaved(false); setLoading(true);

    const prompt = type === "venue"
      ? `You are a wedding venue researcher. The user has provided this URL: "${url}". Based on your knowledge of this venue or what you can infer about it, extract structured info and return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "name": "Venue Name",
  "region": "one of: Cape Winelands | Cape Town City | Atlantic Seaboard | Constantia Valley | Overberg | Garden Route | West Coast",
  "type": "one of: Wine Estate | Mountain Retreat | Beach & Coastal | Historic Manor | Garden Estate | Boutique Hotel | Farm & Country",
  "capacity": "e.g. 100-200",
  "price": "one of: Budget (< R50k) | Mid-Range (R50–150k) | Premium (R150–300k) | Luxury (R300k+)",
  "address": "Full address",
  "phone": "Phone number",
  "website": "${url}",
  "description": "2-3 sentence evocative description",
  "highlight": "One key selling point, max 8 words",
  "features": ["feature1", "feature2", "feature3", "feature4"]
}`
      : `You are a wedding vendor researcher. The user has provided this URL: "${url}". Based on your knowledge or reasonable inference, extract structured info and return ONLY valid JSON (no markdown) in this format:
{
  "name": "Vendor Name",
  "category": "one of: Photography | Floristry | Catering | Entertainment | Coordination | Hair & Make-up | Décor & Hire | Cake & Desserts | Transport | Stationery",
  "region": "one of: Cape Winelands | Cape Town City | Atlantic Seaboard | Constantia Valley | Overberg | Garden Route | West Coast",
  "description": "2-3 sentence description",
  "priceRange": "estimated price range",
  "website": "${url}",
  "phone": "Phone if known or 'Contact via website'",
  "highlight": "One key selling point, max 8 words"
}`;

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
      const text = data.content?.map(b => b.text || "").filter(Boolean).join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setForm(parsed);
    } catch (e) {
      setError("Could not extract venue info. Try a well-known Western Cape venue URL, or fill in the form manually below.");
      const blank = type === "venue"
        ? { name: "", region: "Cape Winelands", type: "Wine Estate", capacity: "", price: "Mid-Range (R50–150k)", address: "", phone: "", website: url, description: "", highlight: "", features: [] }
        : { name: "", category: "Photography", region: "Cape Winelands", description: "", priceRange: "", website: url, phone: "", highlight: "" };
      setResult(blank); setForm(blank);
    } finally { setLoading(false); }
  };

  const save = () => {
    const newEntry = { id: Date.now(), ...form, features: typeof form.features === "string" ? form.features.split(",").map(s => s.trim()) : form.features || [] };
    type === "venue" ? onAddVenue(newEntry) : onAddVendor(newEntry);
    setSaved(true);
  };

  return (
    <div className="research-panel">
      <div className="research-title">🔍 AI Research Tool</div>
      <div className="research-sub">Paste any Western Cape venue or vendor website URL and Claude will research and extract the key details automatically.</div>

      <div className="research-input-row">
        <input className="research-url-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example-venue.co.za" onKeyDown={e => e.key === "Enter" && research()} />
        <select className="research-type-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="venue">Venue</option>
          <option value="vendor">Vendor</option>
        </select>
        <button className="btn btn-primary" onClick={research} disabled={loading} style={{ whiteSpace: "nowrap" }}>
          {loading ? "Researching…" : "Research & Extract"}
        </button>
      </div>

      {loading && <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0", fontFamily: "var(--ff-sans)", fontSize: "0.85rem", color: "var(--muted)" }}>
        <div className="loading-dots"><span /><span /><span /></div> Searching the web and extracting details…
      </div>}

      {error && <div className="error-notice">{error}</div>}
      {saved && <div className="success-notice">✓ Successfully added to the directory!</div>}

      {result && (
        <div className="research-result">
          <div className="research-result-title">Extracted Details — Review & Edit Before Saving</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {Object.entries(form).map(([key, val]) => key === "id" ? null : (
              <div className="research-field" key={key} style={{ gridColumn: key === "description" || key === "features" ? "1 / -1" : undefined }}>
                <label>{key}</label>
                {key === "description" ? (
                  <textarea value={val || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                ) : key === "features" ? (
                  <input value={Array.isArray(val) ? val.join(", ") : val || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="Feature 1, Feature 2, Feature 3" />
                ) : key === "region" ? (
                  <select value={val || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}>
                    {["Cape Winelands","Cape Town City","Atlantic Seaboard","Constantia Valley","Overberg","Garden Route","West Coast"].map(r => <option key={r}>{r}</option>)}
                  </select>
                ) : key === "type" && type === "venue" ? (
                  <select value={val || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}>
                    {["Wine Estate","Mountain Retreat","Beach & Coastal","Historic Manor","Garden Estate","Boutique Hotel","Farm & Country"].map(t => <option key={t}>{t}</option>)}
                  </select>
                ) : key === "category" ? (
                  <select value={val || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}>
                    {["Photography","Floristry","Catering","Entertainment","Coordination","Hair & Make-up","Décor & Hire","Cake & Desserts","Transport","Stationery"].map(c => <option key={c}>{c}</option>)}
                  </select>
                ) : (
                  <input value={val || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button className="btn-green" onClick={save}>Add to Directory</button>
            <button className="btn-ghost" onClick={() => { setResult(null); setSaved(false); }}>Discard</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pages ─────────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <>
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">Western Cape, South Africa</div>
          <h1 className="hero-title">Your Perfect<br /><em>Cape Wedding</em><br />Awaits</h1>
          <p className="hero-sub">The definitive directory of venues & vendors across the Cape Winelands, Cape Town, and beyond — curated in one elegant place.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setPage("venues")}>Explore Venues</button>
            <button className="btn btn-outline" onClick={() => setPage("vendors")}>Find Vendors</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><span className="hero-stat-n">12</span><span className="hero-stat-l">Venues Listed</span></div>
          <div className="hero-stat"><span className="hero-stat-n">12</span><span className="hero-stat-l">Vendors Listed</span></div>
          <div className="hero-stat"><span className="hero-stat-n">8</span><span className="hero-stat-l">Regions Covered</span></div>
        </div>
      </div>

      <section>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Curated Selection</div>
            <h2 className="section-title">Featured <em>Venues</em></h2>
            <p className="section-desc">From historic Cape Dutch wine estates to dramatic coastal retreats, these are the Western Cape's most celebrated wedding destinations.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setPage("venues")}>View All Venues</button>
        </div>
        <div className="cards-grid">
          {VENUES.slice(0, 3).map(v => <VenueCard key={v.id} venue={v} onClick={() => {}} />)}
        </div>
      </section>

      <div style={{ background: "var(--green)", padding: "4rem 2.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--ff-sans)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold2)", marginBottom: "1rem" }}>Wedding Suppliers</div>
          <h2 style={{ fontFamily: "var(--ff-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", marginBottom: "1rem", lineHeight: 1.2 }}>Every Expert You <em>Need</em></h2>
          <p style={{ fontFamily: "var(--ff-body)", color: "rgba(255,255,255,0.7)", marginBottom: "2.5rem", fontSize: "1.1rem" }}>Photographers, florists, caterers, DJs, planners and more — all hand-selected for the Western Cape market.</p>
          <button className="btn btn-primary" onClick={() => setPage("vendors")}>Browse All Vendors</button>
        </div>
      </div>

      <section>
        <div style={{ background: "var(--cream2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "2.5rem", display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div className="section-eyebrow">For Venue Owners & Vendors</div>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>List Your <em>Business</em></h2>
            <p className="section-desc" style={{ fontSize: "1rem" }}>Are you a venue or wedding supplier in the Western Cape? Get your business discovered by engaged couples planning their big day.</p>
          </div>
          {/* ── CHANGE 3: "Submit a Listing" button removed from public homepage ── */}
          <div>
            <p style={{ fontFamily: "var(--ff-sans)", fontSize: "0.8rem", color: "var(--muted)" }}>Contact us to get listed →<br />hello@capevows.co.za</p>
          </div>
        </div>
      </section>
    </>
  );
}

function VenuesPage({ extraVenues }) {
  const [region, setRegion] = useState("All Regions");
  const [type, setType] = useState("All Types");
  const [cap, setCap] = useState("Any Capacity");
  const [price, setPrice] = useState("Any Budget");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const all = [...VENUES, ...extraVenues];

  const filtered = all.filter(v => {
    if (region !== "All Regions" && v.region !== region) return false;
    if (type !== "All Types" && v.type !== type) return false;
    if (price !== "Any Budget" && v.price !== price) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section style={{ paddingTop: "3rem" }}>
      {selected && <VenueModal venue={selected} onClose={() => setSelected(null)} />}
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Western Cape</div>
          <h1 className="section-title">Wedding <em>Venues</em></h1>
          <p className="section-desc">Browse {all.length} curated venues across the Western Cape — filter by region, style, size and budget.</p>
        </div>
      </div>
      <div className="filter-bar">
        <div className="filter-search">
          <div className="filter-label">Search</div>
          <input className="filter-input" placeholder="Search by name or keyword…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-group">
          <div className="filter-label">Region</div>
          <select className="filter-select" value={region} onChange={e => setRegion(e.target.value)}>
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <div className="filter-label">Venue Type</div>
          <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
            {VENUE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <div className="filter-label">Budget</div>
          <select className="filter-select" value={price} onChange={e => setPrice(e.target.value)}>
            {PRICE_RANGES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <button className="filter-clear" onClick={() => { setRegion("All Regions"); setType("All Types"); setCap("Any Capacity"); setPrice("Any Budget"); setSearch(""); }}>Clear All</button>
      </div>
      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <span className="results-count">{filtered.length} venue{filtered.length !== 1 ? "s" : ""} found</span>
      </div>
      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🌿</div>
          <div className="empty-title">No venues match your filters</div>
          <div className="empty-sub">Try broadening your search criteria</div>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map(v => <VenueCard key={v.id} venue={v} onClick={setSelected} />)}
        </div>
      )}
    </section>
  );
}

function VendorsPage({ extraVendors }) {
  const [cat, setCat] = useState("All");
  const [region, setRegion] = useState("All Regions");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const all = [...VENDORS, ...extraVendors];

  const filtered = all.filter(v => {
    if (cat !== "All" && v.category !== cat) return false;
    if (region !== "All Regions" && v.region !== region) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section style={{ paddingTop: "3rem" }}>
      {selected && <VendorModal vendor={selected} onClose={() => setSelected(null)} />}
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Wedding Suppliers</div>
          <h1 className="section-title">Cape <em>Vendors</em></h1>
          <p className="section-desc">Discover {all.length} trusted wedding vendors across the Western Cape, from photographers to florists.</p>
        </div>
      </div>
      <div className="tags">
        {VENDOR_CATS.map(c => <span key={c} className={`tag${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>{c}</span>)}
      </div>
      <div className="filter-bar" style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className="filter-search">
          <div className="filter-label">Search vendors</div>
          <input className="filter-input" placeholder="Search by name or specialty…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-group">
          <div className="filter-label">Region</div>
          <select className="filter-select" value={region} onChange={e => setRegion(e.target.value)}>
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <button className="filter-clear" onClick={() => { setCat("All"); setRegion("All Regions"); setSearch(""); }}>Clear</button>
      </div>
      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <span className="results-count">{filtered.length} vendor{filtered.length !== 1 ? "s" : ""} found</span>
      </div>
      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🌸</div>
          <div className="empty-title">No vendors match your search</div>
          <div className="empty-sub">Try a different category or region</div>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map(v => <VendorCard key={v.id} vendor={v} onClick={setSelected} />)}
        </div>
      )}
    </section>
  );
}

function AdminPage({ onAddVenue, onAddVendor, extraVenues, extraVendors }) {
  const [tab, setTab] = useState("research");
  return (
    <section style={{ paddingTop: "3rem" }}>
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Site Management</div>
          <h1 className="section-title">Admin <em>Panel</em></h1>
          <p className="section-desc">Add and manage venues and vendors. Use the AI Research Tool to auto-extract details from official websites.</p>
        </div>
      </div>
      <div className="notice">💡 Tip: Paste any venue or vendor URL from across the Western Cape and Claude will automatically research and extract the key details for you to review and save.</div>
      <div className="tabs">
        <button className={`tab${tab === "research" ? " active" : ""}`} onClick={() => setTab("research")}>AI Research Tool</button>
        <button className={`tab${tab === "added" ? " active" : ""}`} onClick={() => setTab("added")}>Added Listings ({extraVenues.length + extraVendors.length})</button>
      </div>
      {tab === "research" && <ResearchPanel onAddVenue={onAddVenue} onAddVendor={onAddVendor} />}
      {tab === "added" && (
        <div>
          {extraVenues.length === 0 && extraVendors.length === 0 ? (
            <div className="empty"><div className="empty-icon">📋</div><div className="empty-title">No listings added yet</div><div className="empty-sub">Use the AI Research Tool to add new venues and vendors</div></div>
          ) : (
            <>
              {extraVenues.length > 0 && <><div style={{ fontFamily: "var(--ff-serif)", fontSize: "1.3rem", color: "var(--green)", marginBottom: "1rem" }}>Added Venues</div><div className="cards-grid" style={{ marginBottom: "2rem" }}>{extraVenues.map(v => <VenueCard key={v.id} venue={v} onClick={() => {}} />)}</div></>}
              {extraVendors.length > 0 && <><div style={{ fontFamily: "var(--ff-serif)", fontSize: "1.3rem", color: "var(--green)", marginBottom: "1rem" }}>Added Vendors</div><div className="cards-grid">{extraVendors.map(v => <VendorCard key={v.id} vendor={v} onClick={() => {}} />)}</div></>}
            </>
          )}
        </div>
      )}
    </section>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  // ── CHANGE 1: Read hash on load — go to admin only if URL ends in #admin ──
  const [page, setPage] = useState(
    window.location.hash === "#admin" ? "admin" : "home"
  );
  const [extraVenues, setExtraVenues] = useState([]);
  const [extraVendors, setExtraVendors] = useState([]);

  const addVenue = (v) => setExtraVenues(e => [...e, v]);
  const addVendor = (v) => setExtraVendors(e => [...e, v]);

  return (
    <div>
      <nav>
        <div className="nav-logo" onClick={() => setPage("home")}>Cape <span>Vows</span></div>
        <div className="nav-links">
          <button className={`nav-link${page === "home" ? " active" : ""}`} onClick={() => setPage("home")}>Home</button>
          <button className={`nav-link${page === "venues" ? " active" : ""}`} onClick={() => setPage("venues")}>Venues</button>
          <button className={`nav-link${page === "vendors" ? " active" : ""}`} onClick={() => setPage("vendors")}>Vendors</button>
          {/* ── CHANGE 2: "+ Add Listing" button removed — access via capevows.co.za/#admin ── */}
        </div>
      </nav>

      {page === "home" && <HomePage setPage={setPage} />}
      {page === "venues" && <VenuesPage extraVenues={extraVenues} />}
      {page === "vendors" && <VendorsPage extraVendors={extraVendors} />}
      {page === "admin" && <AdminPage onAddVenue={addVenue} onAddVendor={addVendor} extraVenues={extraVenues} extraVendors={extraVendors} />}

      <footer>
        <div className="footer-logo">Cape Vows</div>
        <div className="footer-sub">The Western Cape Wedding Directory · South Africa</div>
      </footer>
    </div>
  );
}
