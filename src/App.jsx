import { useState, useEffect, useCallback } from "react";

// ─── Google Fonts ──────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ─── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cream:    #FAF7F2;
    --cream2:   #F3EDE3;
    --green:    #2D4A3E;
    --green2:   #3D6356;
    --gold:     #A07840;
    --gold2:    #C49A5A;
    --blush:    #E8CFC2;
    --text:     #1C1C1A;
    --muted:    #7A7266;
    --border:   #DDD4C8;
    --shadow:   rgba(45,74,62,0.10);
    --ff-serif: 'Playfair Display', Georgia, serif;
    --ff-body:  'Cormorant Garamond', Georgia, serif;
    --ff-sans:  'Jost', sans-serif;
  }
  body { background: var(--cream); color: var(--text); font-family: var(--ff-body); font-size: 18px; line-height: 1.6; }

  nav { position: sticky; top: 0; z-index: 100; background: rgba(250,247,242,0.96); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 2.5rem; height: 64px; }
  .nav-logo { font-family: var(--ff-serif); font-size: 1.25rem; color: var(--green); font-style: italic; font-weight: 600; letter-spacing: 0.02em; cursor: pointer; text-decoration: none; }
  .nav-logo span { color: var(--gold); }
  .nav-links { display: flex; }
  .nav-link { font-family: var(--ff-sans); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.5rem 1rem; color: var(--muted); cursor: pointer; border: none; background: none; transition: color 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
  .nav-link:hover, .nav-link.active { color: var(--green); }

  .hero { position: relative; min-height: 88vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; background: var(--green); padding-bottom: 3rem; }
  .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1a2e26 0%, #2D4A3E 40%, #3d6356 70%, #8a6b4a 100%); }
  .hero-pattern { position: absolute; inset: 0; opacity: 0.08; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 20px 20px; }
  .hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 60% 50%, rgba(160,120,64,0.15) 0%, transparent 60%); }
  .hero-content { position: relative; z-index: 2; text-align: center; padding: 2rem; max-width: 780px; }
  .hero-title { font-family: var(--ff-serif); font-size: clamp(2.8rem, 7vw, 5.5rem); color: #fff; line-height: 1.1; font-weight: 700; margin-bottom: 0.5rem; }
  .hero-title em { font-style: italic; color: var(--gold2); }
  .hero-sub { font-family: var(--ff-body); font-size: clamp(1.1rem, 2vw, 1.4rem); color: rgba(255,255,255,0.75); font-weight: 300; margin: 1.5rem 0 2.5rem; letter-spacing: 0.02em; }
  .hero-sub em { font-style: italic; color: var(--gold2); font-weight: 500; }
  .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; border: none; cursor: pointer; transition: all 0.25s; border-radius: 2px; padding: 0.85rem 2rem; }
  .btn-primary { background: var(--gold); color: #fff; }
  .btn-primary:hover { background: var(--gold2); transform: translateY(-1px); }
  .btn:focus-visible { outline: 2px solid var(--gold2); outline-offset: 2px; }
  .btn-green:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
  .btn-ghost:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }
  .btn-outline { background: transparent; color: rgba(255,255,255,0.65); border: 1px solid rgba(255,255,255,0.25); font-size: 0.68rem; padding: 0.8rem 1.5rem; }
  .btn-outline:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.45); color: rgba(255,255,255,0.9); }
  .hero-scroll { position: relative; z-index: 2; margin-top: 3rem; padding-bottom: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .hero-scroll-label { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.35); }
  .hero-scroll-line { width: 1px; height: 36px; background: linear-gradient(to bottom, rgba(255,255,255,0.35), transparent); animation: scrollPulse 2.2s ease-in-out infinite; }
  @keyframes scrollPulse { 0%, 100% { opacity: 0.35; transform: scaleY(1); } 55% { opacity: 0.7; transform: scaleY(1.12); } }

  section { padding: 5rem 2.5rem; max-width: 1200px; margin: 0 auto; }
  .section-eyebrow { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.75rem; }
  .section-title { font-family: var(--ff-serif); font-size: clamp(2rem, 4vw, 3rem); color: var(--green); line-height: 1.2; margin-bottom: 1rem; }
  .section-title em { font-style: italic; }
  .section-desc { font-family: var(--ff-body); font-size: 1.1rem; color: var(--muted); max-width: 560px; line-height: 1.7; }
  .section-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 3rem; flex-wrap: wrap; gap: 1.5rem; }
  .section-header > .btn, .section-header > .btn-green, .section-header > a { margin-top: 0.5rem; }

  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 12px var(--shadow); display: flex; flex-direction: column; }
  .card:hover { transform: scale(1.01); box-shadow: 0 8px 28px var(--shadow); border-color: var(--gold); }
  .card-banner { width: 100%; height: 140px; position: relative; display: flex; align-items: flex-end; padding: 0.9rem 1.25rem 0.8rem; flex-shrink: 0; }
  .card-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.06) 60%, transparent 100%); }
  .card-banner-badge { position: absolute; top: 0.9rem; right: 0.9rem; font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; background: rgba(255,255,255,0.17); backdrop-filter: blur(4px); color: rgba(255,255,255,0.92); padding: 0.22rem 0.55rem; border-radius: 2px; border: 1px solid rgba(255,255,255,0.24); z-index: 1; }
  .card-banner-name { font-family: var(--ff-serif); font-size: 1.3rem; font-style: italic; color: rgba(255,255,255,0.93); font-weight: 600; line-height: 1.2; text-shadow: 0 1px 6px rgba(0,0,0,0.28); z-index: 1; }
  .card-body { padding: 1.15rem 1.5rem 0.85rem; flex: 1; }
  .card-region { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.45rem; }
  .card-title { font-family: var(--ff-serif); font-size: 1.2rem; color: var(--green); margin-bottom: 0.45rem; line-height: 1.2; }
  .card-desc { font-family: var(--ff-body); font-size: 0.94rem; color: var(--muted); line-height: 1.55; margin-bottom: 0.9rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .card-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .card-pill { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.06em; background: var(--cream2); color: var(--muted); padding: 0.2rem 0.6rem; border-radius: 10px; }
  .card-pill.green { background: rgba(45,74,62,0.08); color: var(--green); }
  .card-footer { padding: 0.8rem 1.5rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-price { font-family: var(--ff-serif); font-size: 1rem; color: var(--green); font-style: italic; }
  .card-link { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); font-weight: 600; }

  .card-save-btn { position: absolute; top: 0.75rem; left: 0.75rem; z-index: 2; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.28); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s, transform 0.15s; padding: 0; }
  .card-save-btn:hover { background: rgba(255,255,255,0.32); transform: scale(1.12); }
  .card-save-btn svg { transition: fill 0.2s, stroke 0.2s; }
  .card-save-btn.saved { background: rgba(255,255,255,0.92); }
  .nav-badge { display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px; border-radius: 50%; background: var(--gold); color: #fff; font-family: var(--ff-sans); font-size: 0.68rem; font-weight: 600; margin-left: 4px; line-height: 1; }

  .filter-slider-group { display: flex; flex-direction: column; gap: 0.3rem; min-width: 180px; }
  .filter-slider-val { font-family: var(--ff-body); font-size: 0.9rem; color: var(--text); font-style: italic; }
  .cap-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 3px; border-radius: 2px; background: var(--border); outline: none; cursor: pointer; }
  .cap-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--green); border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.18); cursor: pointer; transition: transform 0.15s; }
  .cap-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
  .cap-slider::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: var(--green); border: 2px solid #fff; cursor: pointer; }

  .blog-page { max-width: 1200px; margin: 0 auto; padding: 3rem 2.5rem 5rem; }
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem; margin-top: 2.5rem; }
  .blog-card { background: #fff; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; display: flex; flex-direction: column; }
  .blog-card:hover { box-shadow: 0 8px 32px var(--shadow); transform: translateY(-2px); }
  .blog-card-img { width: 100%; height: 200px; object-fit: cover; display: block; background: var(--cream2); }
  .blog-card-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
  .blog-card-cat { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
  .blog-card-title { font-family: var(--ff-serif); font-size: 1.2rem; color: var(--green); line-height: 1.35; margin-bottom: 0.6rem; }
  .blog-card-summary { font-family: var(--ff-body); font-size: 0.95rem; color: var(--muted); line-height: 1.65; flex: 1; }
  .blog-card-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border); font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.06em; color: var(--muted); display: flex; align-items: center; justify-content: space-between; }
  .blog-card-read { color: var(--gold); font-weight: 500; }

  .blog-post { max-width: 780px; margin: 0 auto; padding: 3rem 2.5rem 5rem; }
  .blog-post-hero { width: 100%; height: 380px; object-fit: cover; border-radius: 4px; margin-bottom: 0.6rem; display: block; background: var(--cream2); }
  .blog-hero-credit { font-family: var(--ff-sans); font-size: 0.68rem; color: var(--muted); letter-spacing: 0.06em; margin-bottom: 2rem; }
  .blog-post-cat { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.6rem; }
  .blog-post-title { font-family: var(--ff-serif); font-size: 2.2rem; color: var(--green); line-height: 1.2; margin-bottom: 1rem; }
  .blog-post-meta { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
  .blog-post-intro { font-family: var(--ff-body); font-size: 1.1rem; color: var(--text); line-height: 1.8; margin-bottom: 2rem; }
  .blog-post-h2 { font-family: var(--ff-serif); font-size: 1.45rem; color: var(--green); margin: 2.25rem 0 0.75rem; line-height: 1.3; }
  .blog-post-p { font-family: var(--ff-body); font-size: 1rem; color: var(--text); line-height: 1.8; margin-bottom: 1.1rem; }
  .blog-post-list { list-style: none; padding: 0; margin: 0.5rem 0 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .blog-post-li { background: var(--cream2); border-left: 3px solid var(--gold); padding: 1rem 1.25rem; border-radius: 0 3px 3px 0; }
  .blog-post-li strong { font-family: var(--ff-serif); font-size: 1.05rem; color: var(--green); display: block; margin-bottom: 0.25rem; }
  .blog-post-li span { font-family: var(--ff-body); font-size: 0.95rem; color: var(--text); line-height: 1.65; }
  .blog-venue-btn { display: flex; align-items: center; justify-content: flex-end; gap: 0.35rem; width: 100%; font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--green); cursor: pointer; background: none; border: none; padding: 0.55rem 0 0; margin-top: 0.65rem; transition: color 0.2s; font-weight: 500; }
  .blog-venue-btn:hover { color: var(--gold); }
  .blog-venue-link { background: none; border: none; padding: 0; color: var(--green); font-family: inherit; font-size: inherit; cursor: pointer; text-decoration: underline; text-decoration-color: var(--gold); text-underline-offset: 3px; transition: color 0.2s; font-style: inherit; }
  .blog-venue-link:hover { color: var(--gold); }
  .blog-post-notice { background: rgba(160,120,64,0.09); border-left: 3px solid var(--gold); padding: 1rem 1.25rem; border-radius: 0 3px 3px 0; font-family: var(--ff-body); font-size: 0.93rem; color: var(--text); line-height: 1.7; margin: 1.5rem 0; }
  .blog-post-cta { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--border); }
  @media (max-width: 480px) {
    .blog-post { padding: 2rem 1rem 4rem; }
    .blog-post-title { font-size: 1.65rem; }
    .blog-post-hero { height: 240px; }
    .blog-page { padding: 2rem 1rem 4rem; }
    .blog-grid { grid-template-columns: 1fr; }
  }
  .faq-section { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--border); margin-bottom: 2.5rem; }
  .faq-title { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.85rem; }
  .faq-item { border-bottom: 1px solid var(--border); }
  .faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 0; background: none; border: none; cursor: pointer; text-align: left; font-family: var(--ff-body); font-size: 1rem; color: var(--green); font-weight: 500; line-height: 1.4; transition: color 0.2s; }
  .faq-q:hover { color: var(--gold); }
  .faq-chevron { flex-shrink: 0; transition: transform 0.25s; color: var(--gold); }
  .faq-chevron.open { transform: rotate(180deg); }
  .faq-a { font-family: var(--ff-body); font-size: 0.97rem; color: var(--muted); line-height: 1.7; padding-bottom: 0.9rem; }

  .saved-page { max-width: 1200px; margin: 0 auto; padding: 3rem 2.5rem 5rem; }
  .saved-empty { text-align: center; padding: 5rem 2rem; }

  .venue-back { display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); cursor: pointer; margin-bottom: 1.25rem; transition: gap 0.2s, color 0.2s; background: none; border: none; padding: 0; }
  .venue-back:hover { color: var(--green); gap: 0.6rem; }
  .venue-back svg { flex-shrink: 0; }

  .venue-page { max-width: 1200px; margin: 0 auto; padding: 3rem 2.5rem 5rem; }

  .venue-banner { width: 100%; border-radius: 6px; padding: 2.25rem 2.5rem 2rem; margin-bottom: 2.5rem; position: relative; overflow: hidden; }
  .venue-banner::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.2) 100%); pointer-events: none; }
  .venue-banner-eyebrow { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.68); margin-bottom: 0.55rem; position: relative; z-index: 1; }
  .venue-banner-title { font-family: var(--ff-serif); font-size: clamp(1.9rem, 5vw, 3rem); color: #fff; font-weight: 700; font-style: italic; line-height: 1.1; margin-bottom: 1.2rem; text-shadow: 0 2px 14px rgba(0,0,0,0.22); position: relative; z-index: 1; }
  .venue-banner-chips { display: flex; gap: 0.55rem; flex-wrap: wrap; position: relative; z-index: 1; }
  .venue-banner-chip { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.28rem 0.75rem; border-radius: 2px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.24); color: rgba(255,255,255,0.92); }

  .venue-page-layout { display: grid; grid-template-columns: 1fr 310px; gap: 2.5rem; align-items: start; }
  .venue-main { min-width: 0; }
  .venue-sidebar { position: sticky; top: 80px; }
  .venue-details-card { background: #fff; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; box-shadow: 0 4px 24px var(--shadow); }
  .venue-details-card-header { padding: 1.2rem 1.5rem 1rem; border-bottom: 1px solid var(--border); }
  .venue-details-card-name { font-family: var(--ff-serif); font-size: 1.15rem; color: var(--green); font-style: italic; line-height: 1.2; margin-bottom: 0.2rem; }
  .venue-details-card-region { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); }
  .venue-details-rows { padding: 0 1.5rem; }
  .venue-detail-row { display: flex; justify-content: space-between; align-items: baseline; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
  .venue-detail-row:last-of-type { border-bottom: none; }
  .venue-detail-label { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); flex-shrink: 0; }
  .venue-detail-value { font-family: var(--ff-body); font-size: 0.97rem; color: var(--text); text-align: right; }
  .venue-detail-value.enquire { font-style: italic; color: var(--green); }
  .venue-detail-value.phone a { color: var(--green); text-decoration: none; }
  .venue-detail-value.phone a:hover { text-decoration: underline; }
  .venue-cta-group { padding: 1.2rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; }
  .btn-green { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; background: var(--green); color: #fff; border: none; cursor: pointer; padding: 0.85rem 1.75rem; border-radius: 2px; transition: all 0.2s; width: 100%; text-align: center; text-decoration: none; display: block; }
  .btn-green:hover { background: var(--green2); }
  .btn-ghost { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; background: transparent; color: var(--green); border: 1.5px solid var(--green); cursor: pointer; padding: 0.85rem 1.75rem; border-radius: 2px; transition: all 0.2s; width: 100%; text-align: center; }
  .btn-ghost:hover { background: var(--cream2); }
  .venue-desc { font-family: var(--ff-body); font-size: 1.1rem; color: var(--muted); line-height: 1.85; margin-bottom: 2rem; }
  .venue-features-title { font-family: var(--ff-sans); font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; }
  .related-section { margin-top: 4rem; padding-top: 3rem; border-top: 1px solid var(--border); }
  .related-title { font-family: var(--ff-serif); font-size: 1.5rem; color: var(--green); margin-bottom: 1.75rem; }
  .related-title em { font-style: italic; }

  .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .tag { font-family: var(--ff-sans); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.3rem 0.75rem; border-radius: 12px; border: 1px solid var(--border); background: var(--cream2); color: var(--muted); }
  .tag.active { background: var(--green); color: #fff; border-color: var(--green); }

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

  .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(20,30,25,0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--cream); border-radius: 8px; max-width: 780px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 30px 80px rgba(0,0,0,0.3); animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-hero { width: 100%; height: 220px; background: var(--green); position: relative; overflow: hidden; }
  .modal-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .modal-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,35,28,0.65) 0%, rgba(0,0,0,0.15) 60%, transparent 100%); }
  .modal-hero-text { position: absolute; bottom: 1.5rem; left: 2rem; font-family: var(--ff-serif); font-size: 1.75rem; color: rgba(255,255,255,0.9); font-style: italic; font-weight: 600; text-shadow: 0 2px 12px rgba(0,0,0,0.4); }
  .modal-badge { position: absolute; top: 1.5rem; left: 1.5rem; font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; background: var(--gold); color: #fff; padding: 0.3rem 0.8rem; border-radius: 2px; }
  .modal-close { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(0,0,0,0.4); border: none; color: #fff; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .modal-close:hover { background: rgba(0,0,0,0.7); }
  .modal-body { padding: 2rem 2.5rem; }
  .modal-eyebrow { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
  .modal-title { font-family: var(--ff-serif); font-size: 2rem; color: var(--green); margin-bottom: 1rem; line-height: 1.15; }
  .modal-desc { font-family: var(--ff-body); font-size: 1.05rem; color: var(--muted); line-height: 1.75; margin-bottom: 2rem; }
  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 2rem; margin-bottom: 2rem; }
  .modal-detail { border-bottom: 1px solid var(--border); padding-bottom: 0.6rem; }
  .modal-detail-label { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.2rem; }
  .modal-detail-value { font-family: var(--ff-body); font-size: 1rem; color: var(--text); }
  .modal-actions { display: flex; gap: 1rem; flex-wrap: wrap; padding: 1.5rem 2.5rem 2rem; border-top: 1px solid var(--border); }
  .modal-actions .btn-green, .modal-actions .btn-ghost { width: auto; }

  .research-panel { background: #fff; border: 1px solid var(--border); border-radius: 6px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 16px var(--shadow); }
  .research-title { font-family: var(--ff-serif); font-size: 1.5rem; color: var(--green); margin-bottom: 0.5rem; }
  .research-sub { font-family: var(--ff-body); font-size: 0.95rem; color: var(--muted); margin-bottom: 1.5rem; }
  .research-input-row { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .research-url-input { flex: 1; min-width: 250px; font-family: var(--ff-sans); font-size: 0.9rem; border: 1.5px solid var(--border); border-radius: 3px; padding: 0.65rem 1rem; background: var(--cream); color: var(--text); }
  .research-url-input:focus { outline: 2px solid var(--gold); outline-offset: 1px; border-color: var(--gold); }
  .research-type-select { font-family: var(--ff-sans); font-size: 0.85rem; border: 1.5px solid var(--border); border-radius: 3px; padding: 0.65rem 1rem; background: var(--cream); color: var(--text); min-width: 130px; }
  .research-result { background: var(--cream2); border: 1px solid var(--border); border-radius: 4px; padding: 1.5rem; margin-top: 1.5rem; }
  .research-result-title { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; }
  .research-field { margin-bottom: 1rem; }
  .research-field label { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 0.25rem; }
  .research-field input, .research-field textarea, .research-field select { width: 100%; font-family: var(--ff-sans); font-size: 0.9rem; border: 1.5px solid var(--border); border-radius: 3px; padding: 0.6rem 0.85rem; background: #fff; color: var(--text); }
  .research-field textarea { resize: vertical; min-height: 80px; font-family: var(--ff-body); font-size: 0.95rem; line-height: 1.5; }
  .loading-bar { height: 2px; background: var(--gold); border-radius: 1px; animation: loadPulse 1.4s ease-in-out infinite; }
  @keyframes loadPulse { 0%, 100% { width: 24px; opacity: 0.35; } 50% { width: 48px; opacity: 1; } }

  .tabs { display: flex; border-bottom: 2px solid var(--border); margin-bottom: 2rem; }
  .tab { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; padding: 0.75rem 1.5rem; cursor: pointer; border: none; background: none; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
  .tab.active { color: var(--green); border-bottom-color: var(--green); }
  .tab:hover { color: var(--green); }

  .empty { text-align: center; padding: 4rem 2rem; }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
  .empty-title { font-family: var(--ff-serif); font-size: 1.5rem; color: var(--green); margin-bottom: 0.5rem; }
  .empty-sub { font-family: var(--ff-body); color: var(--muted); }
  .flex-between { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .results-count { font-family: var(--ff-sans); font-size: 0.75rem; color: var(--muted); letter-spacing: 0.05em; }
  .notice { background: rgba(160,120,64,0.1); border-left: 3px solid var(--gold); padding: 0.75rem 1rem; border-radius: 0 3px 3px 0; font-family: var(--ff-sans); font-size: 0.82rem; color: var(--text); margin-bottom: 1.5rem; }
  .error-notice { background: rgba(200,60,60,0.08); border-left: 3px solid #c83c3c; padding: 0.75rem 1rem; border-radius: 0 3px 3px 0; font-family: var(--ff-sans); font-size: 0.82rem; color: #8a2222; margin-bottom: 1.5rem; }
  .success-notice { background: rgba(45,74,62,0.08); border-left: 3px solid var(--green); padding: 0.75rem 1rem; border-radius: 0 3px 3px 0; font-family: var(--ff-sans); font-size: 0.82rem; color: var(--green); margin-bottom: 1.5rem; }

  footer { background: var(--green); color: rgba(255,255,255,0.7); text-align: center; padding: 3rem 1rem; margin-top: 4rem; width: 100%; }
  .footer-logo { font-family: var(--ff-serif); font-size: 1.5rem; color: var(--gold2); font-style: italic; margin-bottom: 0.75rem; }
  .footer-sub { font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.5; }
  .footer-nav { display: flex; justify-content: center; gap: 1.75rem; flex-wrap: wrap; margin-top: 1.25rem; }
  .footer-nav-link { font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.38); text-decoration: none; transition: color 0.2s; cursor: pointer; background: none; border: none; padding: 0; }
  .footer-nav-link:hover { color: rgba(255,255,255,0.72); }

  @media (max-width: 960px) {
    .venue-page-layout { grid-template-columns: 1fr; }
    .venue-sidebar { position: static; }
  }
  @media (max-width: 600px) {
    .nav-link-home { display: none; }
    .nav-link { padding: 0.5rem 0.5rem; font-size: 0.64rem; letter-spacing: 0.06em; }
  }
  @media (max-width: 480px) {
    nav { padding: 0 1rem; }
    .nav-logo { font-size: 1.05rem; }
    .hero-content { padding: 2rem 1rem; }
    section { padding: 3rem 1rem; }
    .venue-page { padding: 2rem 1rem 4rem; }
    .venue-banner { padding: 1.75rem 1.25rem 1.25rem; border-radius: 4px; }
    .venue-banner-title { font-size: 1.75rem; }
    .filter-bar { padding: 1rem; }
    .modal-body { padding: 1.25rem 1rem; }
    .modal-actions { padding: 1rem 1rem 1.5rem; }
    .modal-grid { grid-template-columns: 1fr; }
    .cards-grid { grid-template-columns: 1fr; }
    .section-header { flex-direction: column; align-items: flex-start; }
    .hero-actions { flex-direction: column; align-items: center; }
  }
  @media (max-width: 360px) {
    body { font-size: 16px; overflow-x: hidden; }
    .nav-logo { font-size: 1rem; }
    .nav-link { padding: 0.5rem 0.6rem; font-size: 0.68rem; letter-spacing: 0.06em; }
    .btn { padding: 0.75rem 1.25rem; font-size: 0.65rem; }
    section { padding: 2.5rem 0.75rem; }
    .research-input-row { flex-direction: column; }
    .research-url-input { min-width: unset; width: 100%; }
  }
`;
const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ─── Analytics ────────────────────────────────────────────────────────────────
const track = (e, p = {}) => {
  if (typeof window.gtag === "function") window.gtag("event", e, p);
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const toSlug = (n) =>
  n
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const TYPE_GRADIENTS = {
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
const getGradient = (type) =>
  TYPE_GRADIENTS[type] || "linear-gradient(145deg, #2D4A3E 0%, #3D6356 100%)";

const displayCapacity = (c) =>
  c === "Contact venue" ? "Enquire for capacity" : `${c} guests`;
const displayPrice = (p) => (p === "Contact Venue" ? "Enquire for pricing" : p);

const PRICE_RANGES = [
  "Any Budget",
  "Budget (< R50k)",
  "Mid-Range (R50–150k)",
  "Premium (R150–300k)",
  "Luxury (R300k+)",
];

// ─── Favourites hook ───────────────────────────────────────────────────────────
function useFavourites() {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cv_saved") || "[]");
    } catch {
      return [];
    }
  });
  const toggle = (slug) => {
    setSaved((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      localStorage.setItem("cv_saved", JSON.stringify(next));
      return next;
    });
  };
  return { saved, toggle };
}

// ─── Per-venue FAQ generator ───────────────────────────────────────────────────
const REGION_CONTEXT = {
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
      "in or immediately adjacent to the Cape Town city bowl — no travel from the city required",
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

const VENUES_WITH_ACCOMMODATION = new Set([
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
  "lourensford-wine-estate",
  "groot-constantia",
  "hawksmoor-house",
]);

function getVenueFaqs(venue) {
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
        : `${venue.name} does not advertise a fixed guest capacity — available numbers depend on the specific event layout and space configuration. Contact the venue directly to discuss what's possible for your wedding size.`,
    },
    {
      q: `Where is ${venue.name} located?`,
      a: `${venue.name} is situated in ${region.desc}, Western Cape, at ${venue.address}. It is ${region.distance} — making it ${venue.region === "Cape Town City" ? "ideal for couples wanting a city wedding with easy access for all guests" : "accessible as a day trip or weekend destination from Cape Town"}. The setting is defined by ${region.character}.`,
    },
    {
      q: `What type of venue is ${venue.name}?`,
      a: `${venue.name} is a ${venue.type.toLowerCase()} in ${region.desc}. Key features include ${featureList}. ${venue.highlight}. This makes it particularly well-suited to couples who want ${venue.type === "Wine Estate" ? "a vineyard setting with estate wines on the day" : venue.type === "Boutique Hotel" ? "full hotel amenities and overnight accommodation for the wedding party" : venue.type === "Historic Manor" ? "a venue with genuine Cape heritage and architectural character" : venue.type === "Farm & Country" ? "an intimate, farm-style atmosphere with a relaxed, personal feel" : "a beautiful and distinct wedding setting in the Western Cape"}.`,
    },
    {
      q: `What is the price range for a wedding at ${venue.name}?`,
      a: price
        ? `${venue.name} is categorised in the ${price} tier. This is a broad guide — your actual spend will depend on guest numbers, the season (December and April tend to be peak months), day of the week, and which catering and décor packages you select. We recommend contacting the venue for a personalised quote based on your specific requirements.`
        : `${venue.name} does not publish a standard price list — costs are quoted on enquiry and vary based on guest count, date, and package selections. Contact the venue directly for a tailored quote.`,
    },
    {
      q: `Does ${venue.name} have on-site accommodation?`,
      a: hasAccomm
        ? `Yes — ${venue.name} offers on-site accommodation, which is a significant practical advantage for wedding weekends. Guests and the wedding party can stay on the estate, removing the need for late-night transport arrangements and allowing the celebration to extend into the following morning.`
        : `${venue.name} does not list on-site accommodation as a standard offering. However, the ${region.desc} area has a wide range of guesthouses, boutique hotels, and self-catering options within a short distance. It's worth discussing transport and nearby stay options with the venue when you enquire.`,
    },
  ];
}

// ─── Venue Data ────────────────────────────────────────────────────────────────
const VENUES = [
  {
    id: 1,
    slug: "babylonstoren",
    name: "Babylonstoren",
    region: "Cape Winelands",
    type: "Wine Estate",
    capacity: "Up to 100",
    price: "Luxury (R300k+)",
    address: "Babylonstoren Farm, Simondium, Franschhoek",
    phone: "021 863 3852",
    website: "https://babylonstoren.com/weddings",
    description:
      "A magnificently restored Cape Dutch farm with a historic homestead, eight themed gardens and breathtaking Simonsberg Mountain views. The estate offers an unparalleled setting for bespoke weddings in one of South Africa's most celebrated wine regions.",
    features: [
      "Wine Tasting",
      "On-site Accommodation",
      "Farm-to-Table Catering",
      "Bridal Suite",
      "Mountain Views",
      "Outdoor Ceremony",
    ],
    highlight: "Eight iconic heritage gardens",
  },
  {
    id: 2,
    slug: "boschendal-wine-estate",
    name: "Boschendal Wine Estate",
    region: "Cape Winelands",
    type: "Wine Estate",
    capacity: "Up to 200",
    price: "Luxury (R300k+)",
    address: "Pniel Road, Groot Drakenstein, Franschhoek",
    phone: "021 870 4200",
    website: "https://boschendal.com/events/wedding-venues/",
    description:
      "One of South Africa's oldest wine farms, dating back to 1685. Boschendal's iconic Cape Dutch manor house and sprawling grounds provide a timeless backdrop against the Drakenstein Mountains.",
    features: [
      "Cape Dutch Architecture",
      "Award-winning Wines",
      "Multiple Venues",
      "Accommodation",
      "Gourmet Catering",
      "Heritage Gardens",
    ],
    highlight: "Founded in 1685 — over 300 years of history",
  },
  {
    id: 3,
    slug: "cavalli-estate",
    name: "Cavalli Estate",
    region: "Cape Winelands",
    type: "Wine Estate",
    capacity: "Up to 400",
    price: "Mid-Range (R50–150k)",
    address: "R44, Somerset West, Helderberg",
    phone: "021 855 3218",
    website: "https://cavalliestate.com/functions-weddings/main-venue/",
    description:
      "An ultra-modern equestrian wine estate where equine elegance meets contemporary luxury. Cavalli features a striking glass-and-steel venue with panoramic vineyard and mountain views, plus a working stud farm.",
    features: [
      "Modern Architecture",
      "Equestrian Setting",
      "Fine Dining",
      "Wine & Art",
      "Helicopter Access",
      "Bridal Suite",
    ],
    highlight: "Stunning glass venue overlooking the Helderberg",
  },
  {
    id: 4,
    slug: "groot-constantia",
    name: "Groot Constantia",
    region: "Constantia Valley",
    type: "Historic Manor",
    capacity: "Up to 200",
    price: "Contact Venue",
    address: "Groot Constantia Rd, Constantia, Cape Town",
    phone: "021 794 5128",
    website:
      "https://grootconstantia.co.za/groot-constantia-jewel-in-the-capes-wedding-venue-crown/",
    description:
      "South Africa's oldest wine estate, founded in 1685 by Simon van der Stel. The National Monument manor house and ancient oak trees create an incomparably historic wedding setting in the Constantia valley.",
    features: [
      "National Monument",
      "Oldest Wine Farm",
      "Oak-lined Avenues",
      "Museum On-site",
      "Multiple Restaurants",
      "Heritage Cellar",
    ],
    highlight: "South Africa's oldest wine estate — est. 1685",
  },
  {
    id: 5,
    slug: "hawksmoor-house",
    name: "Hawksmoor House",
    region: "Cape Town City",
    type: "Historic Manor",
    capacity: "Up to 150",
    price: "Mid-Range (R50–150k)",
    address: "14 Hawksmoor Way, Bishopscourt, Cape Town",
    phone: "021 884 4815",
    website: "https://hawksmoor.co.za/weddings-and-occasions/weddings/",
    description:
      "A beautiful Victorian manor house in the leafy suburb of Bishopscourt, with manicured gardens, a sparkling pool, and the sense of stepping back in time. Exclusive-use venue with full hospitality.",
    features: [
      "Victorian Architecture",
      "Manicured Gardens",
      "Exclusive-use",
      "Swimming Pool",
      "Full Catering",
      "Bridal Suite",
    ],
    highlight: "Victorian elegance in Cape Town's leafy south",
  },
  {
    id: 6,
    slug: "nooitgedacht-wine-estate",
    name: "Nooitgedacht Wine Estate",
    region: "Cape Winelands",
    type: "Garden Estate",
    capacity: "Up to 300",
    price: "Contact Venue",
    address: "Nooitgedacht Farm, Koelenhof, Stellenbosch",
    phone: "021 865 2495",
    website: "https://www.nooitgedachtestate.co.za/weddings",
    description:
      "A sprawling Stellenbosch estate with beautiful rose gardens, a restored manor house, and charming farm atmosphere. Nooitgedacht offers a versatile setting for both intimate garden ceremonies and large celebrations.",
    features: [
      "Rose Gardens",
      "Manor House",
      "Large Capacity",
      "Multiple Reception Areas",
      "Flexible Packages",
      "On-site Catering",
    ],
    highlight: "Famous rose gardens in full bloom",
  },
  {
    id: 7,
    slug: "steenberg-farm",
    name: "Steenberg Farm",
    region: "Constantia Valley",
    type: "Boutique Hotel",
    capacity: "Up to 100",
    price: "Contact Venue",
    address: "Steenberg Road, Tokai, Cape Town",
    phone: "021 713 2222",
    website: "https://steenbergfarm.com/weddings/",
    description:
      "The elegant Steenberg Hotel sits on a historic 1682 farm in Constantia. The Conservatory venue features soaring glass ceilings and vineyard views, with 5-star hotel amenities for the perfect luxury wedding weekend.",
    features: [
      "5-Star Hotel",
      "Glass Conservatory",
      "Golf Course",
      "Vineyard Views",
      "Full Accommodation",
      "Spa & Wellness",
    ],
    highlight: "5-star luxury on a 1682 historic farm",
  },
  {
    id: 8,
    slug: "zorgvliet-wines",
    name: "Zorgvliet Wines",
    region: "Cape Winelands",
    type: "Farm & Country",
    capacity: "Up to 140",
    price: "Premium (R150–300k)",
    address: "Banhoek Valley, Stellenbosch",
    phone: "021 885 1399",
    website: "https://zorgvliet.com/weddings/",
    description:
      "Hidden in the lush Banhoek Valley between Stellenbosch and Franschhoek, Zorgvliet is a tranquil wine farm offering a beautifully intimate setting with magnificent mountain surrounds and indigenous gardens.",
    features: [
      "Banhoek Valley Setting",
      "Indigenous Gardens",
      "River Views",
      "Rustic Barn Venue",
      "Wine Tasting",
      "Country Charm",
    ],
    highlight: "Secret valley charm with mountain backdrops",
  },
  {
    id: 9,
    slug: "holden-manz",
    name: "Holden Manz",
    region: "Cape Winelands",
    type: "Boutique Hotel",
    capacity: "Contact venue",
    price: "Contact Venue",
    address: "Green Valley Rd, Franschhoek",
    phone: "021 876 2738",
    website: "https://holdenmanz.com/pages/weddings",
    description:
      "An intimate Franschhoek boutique wine estate where award-winning wines meet luxurious hospitality. Holden Manz offers an exclusive, personalised wedding experience surrounded by vineyards and mountain vistas.",
    features: [
      "Boutique Wine Estate",
      "Award-winning Wines",
      "Intimate Setting",
      "Mountain Views",
      "Luxury Accommodation",
      "Personalised Service",
    ],
    highlight: "Intimate boutique estate in Franschhoek",
  },
  {
    id: 10,
    slug: "la-cotte-farm",
    name: "La Cotte Farm",
    region: "Cape Winelands",
    type: "Farm & Country",
    capacity: "Up to 100",
    price: "Luxury (R300k+)",
    address: "24 La Cotte St, Franschhoek",
    phone: "021 309 2709",
    website: "https://www.lacottefarm.com/weddings",
    description:
      "A beautifully preserved historic farm in the heart of Franschhoek, offering rustic elegance in a setting steeped in Cape Winelands heritage. La Cotte combines farm authenticity with refined wedding hospitality.",
    features: [
      "Historic Farm Setting",
      "Franschhoek Valley Views",
      "Rustic Elegance",
      "Heritage Character",
      "Outdoor Ceremony Spaces",
      "Catering On-site",
    ],
    highlight: "Historic Franschhoek farm with rustic elegance",
  },
  {
    id: 11,
    slug: "la-paris-estate",
    name: "La Paris Estate",
    region: "Cape Winelands",
    type: "Wine Estate",
    capacity: "Up to 200",
    price: "Premium (R150–300k)",
    address: "La Paris Estate, Wemmershoek Rd, R301, Franschhoek",
    phone: "021 867 0171",
    website: "https://www.laparis.co.za/weddings",
    description:
      "Nestled in the breathtaking Wemmershoek Valley, La Paris Estate offers sweeping mountain views, manicured grounds and a refined Cape Winelands setting. An elegant backdrop for both intimate and large-scale celebrations.",
    features: [
      "Wemmershoek Valley Views",
      "Mountain Backdrop",
      "Manicured Gardens",
      "Large Capacity",
      "Wine Estate Setting",
      "Outdoor Ceremonies",
    ],
    highlight: "Sweeping Wemmershoek Valley views",
  },
  {
    id: 12,
    slug: "la-roche-estate",
    name: "La Roche Estate",
    region: "Cape Winelands",
    type: "Wine Estate",
    capacity: "Up to 180",
    price: "Contact Venue",
    address: "Robertsvlei Rd, Franschhoek",
    phone: "071 761 1354",
    website: "https://www.larocheestate.com/weddings",
    description:
      "A serene Franschhoek wine estate set against dramatic mountain scenery. La Roche offers a timeless Cape Winelands backdrop with the intimacy of a private estate, ideal for medium to large celebrations.",
    features: [
      "Mountain Scenery",
      "Private Estate Feel",
      "Wine Estate Setting",
      "Franschhoek Location",
      "Ceremony & Reception",
      "Vineyard Views",
    ],
    highlight: "Dramatic mountain scenery in Franschhoek",
  },
  {
    id: 13,
    slug: "mont-rochelle",
    name: "Mont Rochelle Hotel & Vineyard",
    region: "Cape Winelands",
    type: "Boutique Hotel",
    capacity: "Up to 80",
    price: "Luxury (R300k+)",
    address: "1412/9 Dassenberg Rd, Franschhoek",
    phone: "021 876 2770",
    website:
      "https://www.virginlimitededition.com/mont-rochelle/celebrations/weddings/",
    description:
      "Sir Richard Branson's Virgin Limited Edition property in Franschhoek — a luxury boutique hotel and vineyard with panoramic valley views. Mont Rochelle offers an exclusive, world-class wedding experience in the Cape Winelands.",
    features: [
      "Virgin Limited Edition",
      "Panoramic Valley Views",
      "Boutique Luxury Hotel",
      "Award-winning Restaurant",
      "Exclusive-use Option",
      "Vineyard Setting",
    ],
    highlight: "Sir Richard Branson's Franschhoek luxury estate",
  },
  {
    id: 14,
    slug: "lanzerac-wine-estate",
    name: "Lanzerac Wine Estate",
    region: "Cape Winelands",
    type: "Wine Estate",
    capacity: "Up to 250",
    price: "Mid-Range (R50–150k)",
    address: "1 Lanzerac Rd, Stellenbosch",
    phone: "021 887 1132",
    website: "https://lanzerac.co.za/weddings/",
    description:
      "A stately Cape Dutch manor at the foot of the Jonkershoek Mountains in Stellenbosch, with roots tracing back to 1692. The 5-star hotel and wine estate offers multiple event spaces, manicured gardens, and all the grandeur of Cape Winelands heritage.",
    features: [
      "5-Star Hotel",
      "Cape Dutch Manor",
      "Jonkershoek Views",
      "Multiple Event Spaces",
      "Estate Wines",
      "Accommodation",
    ],
    highlight: "Iconic Stellenbosch estate since 1692",
  },
  {
    id: 15,
    slug: "vrede-en-lust",
    name: "Vrede en Lust Wine Estate",
    region: "Cape Winelands",
    type: "Wine Estate",
    capacity: "Up to 150",
    price: "Contact Venue",
    address: "Intersection R45 & Simondium-Klapmuts Rd, Simondium, Franschhoek",
    phone: "021 874 1611",
    website: "https://www.vnl.co.za/weddings-conferences/weddings/",
    description:
      "A family-owned wine estate at the foot of the Simonsberg in the Simondium Valley, where Franschhoek meets Stellenbosch. Vrede en Lust offers an authentic Cape Winelands character — restored Cape Dutch farmstead, sweeping vineyard views, and warm family hospitality.",
    features: [
      "Family-owned Estate",
      "Cape Dutch Farmstead",
      "Simonsberg Views",
      "Vineyard Setting",
      "Wine Tasting",
      "Franschhoek Vicinity",
    ],
    highlight: "Family-owned estate in the Simondium Valley",
  },
  {
    id: 16,
    slug: "the-cellars-hohenort",
    name: "The Cellars-Hohenort",
    region: "Constantia Valley",
    type: "Boutique Hotel",
    capacity: "Up to 50",
    price: "Contact Venue",
    address: "93 Brommersvlei Rd, Constantia",
    phone: "021 794 2137",
    website: "https://the-cellars-hohenort.our-venue.com/",
    description:
      "Two magnificently restored Cape Dutch manor houses set within manicured gardens in the heart of the Constantia Wine Valley. Part of the celebrated Liz McGrath hotel collection, The Cellars-Hohenort combines boutique luxury with a rare sense of quiet, graceful intimacy.",
    features: [
      "Two Historic Manors",
      "Constantia Wine Valley",
      "Manicured Gardens",
      "Boutique Hotel",
      "Fine Dining",
      "Spa On-site",
    ],
    highlight: "Liz McGrath's exquisite Constantia manor",
  },
  {
    id: 17,
    slug: "belmond-mount-nelson",
    name: "Belmond Mount Nelson Hotel",
    region: "Cape Town City",
    type: "Boutique Hotel",
    capacity: "Contact venue",
    price: "Contact Venue",
    address: "76 Orange St, Cape Town",
    phone: "021 483 1000",
    website:
      "https://www.belmond.com/hotels/africa/south-africa/cape-town/belmond-mount-nelson-hotel/weddings",
    description:
      "Cape Town's legendary 'Pink Lady' hotel has defined gracious hospitality since 1899. Set in seven acres of heritage gardens at the foot of Table Mountain, the Belmond Mount Nelson pairs iconic architecture with impeccable service for a truly grand Cape Town wedding.",
    features: [
      "Heritage Hotel Since 1899",
      "Table Mountain Views",
      "Seven Acres of Gardens",
      "Iconic Pink Facade",
      "Belmond Group",
      "City Bowl Location",
    ],
    highlight: "Cape Town's legendary Pink Lady since 1899",
  },
  {
    id: 18,
    slug: "the-12-apostles-hotel",
    name: "The 12 Apostles Hotel",
    region: "Atlantic Seaboard",
    type: "Boutique Hotel",
    capacity: "Contact venue",
    price: "Contact Venue",
    address: "Victoria Rd, Camps Bay, Cape Town",
    phone: "021 437 9000",
    website: "https://12apostleshotel.com/events/weddings",
    description:
      "Set dramatically between the Twelve Apostles Mountain Range and the Atlantic Ocean on the Camps Bay coastal drive, this luxury hotel offers an extraordinary natural setting. Every ceremony here is framed by the meeting of mountains and ocean.",
    features: [
      "Atlantic Ocean Views",
      "Twelve Apostles Mountain",
      "Luxury Hotel & Spa",
      "Camps Bay Setting",
      "World-class Service",
      "Unique Coastal Venue",
    ],
    highlight: "Dramatic setting between mountains and ocean",
  },
  {
    id: 19,
    slug: "saronsberg-wine-estate",
    name: "Saronsberg Wine Estate",
    region: "Cape Winelands",
    type: "Wine Estate",
    capacity: "Up to 120",
    price: "Mid-Range (R50–150k)",
    address: "Saronsberg Rd, Tulbagh",
    phone: "023 230 0707",
    website: "https://www.saronsberg.com/saronsberg-weddings",
    description:
      "A passionate boutique wine estate in the scenic Tulbagh Valley, cradled by the dramatic Obiqua and Winterhoek Mountains. Saronsberg offers a quietly extraordinary wedding experience off the beaten Winelands trail — exceptional wines, magnificent mountain scenery, and warm hospitality.",
    features: [
      "Tulbagh Valley",
      "Mountain Panorama",
      "Award-winning Wines",
      "Intimate Setting",
      "Off the Beaten Track",
      "Country Hospitality",
    ],
    highlight: "Mountain-framed gem in the Tulbagh Valley",
  },
  {
    id: 20,
    slug: "cape-point-vineyards",
    name: "Cape Point Vineyards",
    region: "Atlantic Seaboard",
    type: "Wine Estate",
    capacity: "Up to 200",
    price: "Mid-Range (R50–150k)",
    address: "Silvermine Rd, Noordhoek",
    phone: "021 789 0900",
    website: "https://cpv.co.za/events/weddings/",
    description:
      "A working vineyard on the slopes of the Cape Peninsula at Noordhoek, with sweeping panoramic views of Chapman's Peak, the Noordhoek Valley, and the Atlantic Ocean. Cape Point Vineyards is a uniquely positioned venue where wine estate character meets the raw beauty of the Cape Peninsula coast.",
    features: [
      "Chapman's Peak Views",
      "Atlantic Ocean Backdrop",
      "Table Mountain Park",
      "Working Vineyard",
      "Noordhoek Valley",
      "Outdoor Ceremonies",
    ],
    highlight: "Chapman's Peak views in Noordhoek",
  },
  {
    id: 21,
    slug: "la-petite-ferme",
    name: "La Petite Ferme",
    region: "Cape Winelands",
    type: "Farm & Country",
    capacity: "Up to 45",
    price: "Mid-Range (R50–150k)",
    address: "Pass Rd, Franschhoek",
    phone: "021 876 3016",
    website:
      "https://lapetiteferme.co.za/la-petite-ferme-franschhoek-weddings-functions/",
    description:
      "Perched high on the Franschhoek Mountain Pass with arguably the finest vineyard views in the Cape Winelands, La Petite Ferme is a beloved Franschhoek institution. With an award-winning restaurant, its own wine label, and charming guest chalets, it is perfect for an intimate, deeply personal wedding.",
    features: [
      "Franschhoek Pass Views",
      "Award-winning Restaurant",
      "Own Wine Label",
      "Guest Chalets",
      "Intimate Scale",
      "Farm-to-table Dining",
    ],
    highlight: "Spectacular views from the Franschhoek Pass",
  },
  {
    id: 22,
    slug: "elgin-ridge-wines",
    name: "Elgin Ridge Wines",
    region: "Overberg",
    type: "Wine Estate",
    capacity: "Up to 50",
    price: "Mid-Range (R50–150k)",
    address: "Elgin Valley, Overberg",
    phone: "021 848 9587",
    website: "https://elginvintners.co.za/experiences/weddings-functions/",
    description:
      "A characterful wine estate in the cool-climate Elgin Valley, set amid rolling apple orchards and indigenous fynbos in the Overberg. Elgin Ridge offers a tranquil, unhurried wedding experience well away from the Winelands crowds — award-winning cool-climate wines and an authentically pastoral atmosphere.",
    features: [
      "Elgin Valley Setting",
      "Cool-climate Estate",
      "Apple Orchards",
      "Fynbos Landscape",
      "Award-winning Wines",
      "Overberg Tranquillity",
    ],
    highlight: "Cool-climate Elgin Valley in the Overberg",
  },
  {
    id: 23,
    slug: "lourensford-wine-estate",
    name: "Lourensford Wine Estate",
    region: "Cape Winelands",
    type: "Garden Estate",
    capacity: "Up to 120",
    price: "Luxury (R300k+)",
    address: "Lourensford Rd, Somerset West",
    phone: "064 782 9864",
    website: "https://www.laurent.co.za/packages/",
    description:
      "A magnificent large-scale wine estate at the foot of the Hottentots Holland Mountains in Somerset West. Lourensford combines award-winning wines, beautiful gardens, and well-appointed event facilities — making it one of the Cape's premier choices for a grand, luxurious wedding celebration.",
    features: [
      "Hottentots Holland Views",
      "Expansive Estate",
      "Award-winning Wines",
      "Beautiful Gardens",
      "Multiple Venues",
      "Somerset West",
    ],
    highlight: "Grand estate under the Hottentots Holland",
  },
  {
    id: 24,
    slug: "eikenhof-estate",
    name: "Eikenhof Estate",
    region: "Cape Winelands",
    type: "Farm & Country",
    capacity: "Up to 80",
    price: "Mid-Range (R50–150k)",
    address: "Fischers Rd, Bottelary Hills, Stellenbosch Farms",
    phone: "021 204 9383",
    website: "https://www.eikenhofestate.co.za/weddings/",
    description:
      "A privately-owned wine and olive farm nestled in the scenic Bottelary Hills between Stellenbosch and Cape Town. Eikenhof offers an exclusive-use farm wedding experience on a working estate — combining the warmth of Cape Winelands farm life with beautifully maintained event spaces and views across the rolling hills.",
    features: [
      "Exclusive-use Venue",
      "Bottelary Hills Views",
      "Wine & Olive Farm",
      "Working Farm",
      "Stellenbosch Area",
      "Private Setting",
    ],
    highlight: "Exclusive farm in the Bottelary Hills",
  },
];

const VENDORS = [
  {
    id: 101,
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    name: "Lad & Lass Photography",
    category: "Photography",
    region: "Cape Winelands",
    description:
      "Award-winning wedding photographers with over 10 years documenting love stories across the Western Cape wine estates. Known for a romantic, editorial style.",
    priceRange: "R20 000–R45 000",
    website: "https://ladandlass.co.za",
    phone: "+27 72 123 4567",
    highlight: "Editorial & Fine Art Style",
  },
  {
    id: 102,
    img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80",
    name: "Jean-Pierre Uys Photography",
    category: "Photography",
    region: "Cape Town City",
    description:
      "Cape Town-based destination wedding photographer. Natural light specialist known for timeless, emotion-driven imagery.",
    priceRange: "R25 000–R60 000",
    website: "#",
    phone: "+27 82 987 6543",
    highlight: "Destination & Natural Light",
  },
  {
    id: 103,
    img: "https://images.unsplash.com/photo-1490750967868-88df5691cc47?auto=format&fit=crop&w=800&q=80",
    name: "The Floristry by Claire",
    category: "Floristry",
    region: "Cape Winelands",
    description:
      "Bespoke floral design for discerning Cape brides. Specialising in lush, garden-gathered arrangements using local proteas, fynbos, and seasonal blooms.",
    priceRange: "R15 000–R80 000",
    website: "#",
    phone: "+27 83 234 5678",
    highlight: "Fynbos & Protea Specialists",
  },
  {
    id: 104,
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    name: "Petal & Stem Floral Design",
    category: "Floristry",
    region: "Cape Town City",
    description:
      "Contemporary floral studio creating bold, sculptural installations for modern Cape weddings. Featured in Brides SA and Style Me Pretty.",
    priceRange: "R20 000–R120 000",
    website: "#",
    phone: "+27 71 345 6789",
    highlight: "Sculptural Installations",
  },
  {
    id: 105,
    img: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=800&q=80",
    name: "Nicolette Weddings & Events",
    category: "Coordination",
    region: "Cape Winelands",
    description:
      "Full-service wedding planning and coordination based in Stellenbosch. Over 200 weddings planned across the Cape. COZA-certified planner.",
    priceRange: "R35 000–R85 000",
    website: "#",
    phone: "+27 82 456 7890",
    highlight: "200+ Weddings Planned",
  },
  {
    id: 106,
    img: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80",
    name: "Confetti & Cake",
    category: "Cake & Desserts",
    region: "Constantia Valley",
    description:
      "Artisan wedding cakes and dessert tables handcrafted in Cape Town. Known for intricate sugar-flower work and flavour-forward designs.",
    priceRange: "R8 000–R35 000",
    website: "#",
    phone: "+27 79 567 8901",
    highlight: "Sugar Flower Artistry",
  },
  {
    id: 107,
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
    name: "Cape String Quartet",
    category: "Entertainment",
    region: "Cape Town City",
    description:
      "Professional string ensemble performing classical to contemporary, perfect for ceremonies and cocktail hours. Customisable repertoire from Bach to Beyoncé.",
    priceRange: "R12 000–R28 000",
    website: "#",
    phone: "+27 83 678 9012",
    highlight: "Classical to Contemporary",
  },
  {
    id: 108,
    img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
    name: "DJ André Visser",
    category: "Entertainment",
    region: "Cape Winelands",
    description:
      "Top Cape wedding DJ with over 15 years experience keeping dance floors packed. Specialises in seamless transitions and reading the energy of the room.",
    priceRange: "R15 000–R30 000",
    website: "#",
    phone: "+27 72 789 0123",
    highlight: "15+ Years Experience",
  },
  {
    id: 109,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    name: "The Wedding Table Co.",
    category: "Décor & Hire",
    region: "Cape Winelands",
    description:
      "Premium furniture, linen, and tableware hire for Western Cape weddings. From rustic farm tables to crystal-and-gold luxury, we dress your dream reception.",
    priceRange: "R20 000–R100 000+",
    website: "#",
    phone: "+27 83 890 1234",
    highlight: "Full Luxury Linen & Furniture",
  },
  {
    id: 110,
    img: "https://images.unsplash.com/photo-1522844990619-4951c40f7eda?auto=format&fit=crop&w=800&q=80",
    name: "Glow & Grace Beauty Studio",
    category: "Hair & Make-up",
    region: "Atlantic Seaboard",
    description:
      "Bridal beauty team led by senior artist Mia Joubert. On-location services across the Western Cape, specialising in airbrush make-up and long-lasting bridal looks.",
    priceRange: "R5 500–R18 000",
    website: "#",
    phone: "+27 71 901 2345",
    highlight: "On-Location Airbrush Artistry",
  },
  {
    id: 111,
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    name: "Winelands Catering Co.",
    category: "Catering",
    region: "Cape Winelands",
    description:
      "Bespoke catering for wine estate weddings. Farm-to-fork menus designed around seasonal Western Cape produce, with a team of chefs trained at world-class restaurants.",
    priceRange: "R650–R1800 per head",
    website: "#",
    phone: "+27 82 012 3456",
    highlight: "Farm-to-Fork Seasonal Menus",
  },
  {
    id: 112,
    img: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=800&q=80",
    name: "Classic Wedding Cars CT",
    category: "Transport",
    region: "Cape Town City",
    description:
      "A fleet of classic and vintage vehicles including Rolls-Royce Silver Shadow, Bentley, and 1960s Mercedes. Chauffeur-driven transfers across the Cape Peninsula and Winelands.",
    priceRange: "R4 500–R15 000",
    website: "#",
    phone: "+27 83 123 6789",
    highlight: "Rolls-Royce & Vintage Fleet",
  },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────
const POSTS = [
  {
    slug: "best-wine-estate-venues-franschhoek",
    title: "5 Best Wine Estate Venues in Franschhoek",
    category: "Venue Guides",
    date: "May 2026",
    summary:
      "Franschhoek is widely considered the wedding capital of the Western Cape. These five hand-verified estates cover a range of capacities and price points — all set against the Drakenstein Mountains.",
    heroImg:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1400&q=80",
    heroCredit: "Photo: Roberta Sorge / Unsplash",
    metaDesc:
      "Discover the best wine estate wedding venues in Franschhoek. Hand-verified picks for your Western Cape wedding, from heritage farms to luxury hillside estates.",
    intro:
      "You've likely seen the photos: long banquet tables stretching under ancient oaks, a glass of MCC in hand, the sun dipping behind jagged peaks. Franschhoek isn't just a town — it's a global wedding destination. But with dozens of estates to consider, narrowing down the right fit for your guest list and budget takes local knowledge.",
    sections: [
      {
        h2: "What Makes Franschhoek Different",
        paras: [
          "Franschhoek venues are known for their all-in-one approach. Most offer on-site chapels, luxury accommodation for the bridal party, and catering that leans heavily into local produce. As a tourism hub, the valley also means your guests have their pick of boutique guesthouses and world-class restaurants for the rest of the weekend.",
        ],
      },
      {
        h2: "Our Five Verified Picks",
        items: [
          {
            title: "Boschendal Wine Estate",
            slug: "boschendal-wine-estate",
            desc: "Ideal for heritage lovers. Multiple event spaces on one estate — from the grand Olive Press to the intimate Rhône Homestead — make it one of the most versatile venues in the valley, with exceptional farm-to-table dining.",
          },
          {
            title: "La Paris Estate",
            slug: "la-paris-estate",
            desc: "Best for larger celebrations. With capacity for up to 200 guests, sweeping Wemmershoek Valley views, and manicured grounds, La Paris handles scale without losing its Winelands character.",
          },
          {
            title: "La Roche Estate",
            slug: "la-roche-estate",
            desc: "A serene, private estate on Robertsvlei Road with dramatic mountain scenery and an intimate feel. Well-suited to medium to large celebrations (up to 180 guests) that want exclusivity without the main-road traffic.",
          },
          {
            title: "Mont Rochelle Hotel & Vineyard",
            slug: "mont-rochelle",
            desc: "Sir Richard Branson's Virgin Limited Edition property on the Franschhoek hillside. Panoramic valley views, boutique hotel amenities, and an exclusive-use option for up to 80 guests who want a genuinely world-class experience.",
          },
          {
            title: "Vrede en Lust Wine Estate",
            slug: "vrede-en-lust",
            desc: "A family-owned estate at the foot of the Simonsberg in the Simondium Valley. Authentic Cape Dutch character, sweeping vineyard views, and warm hospitality — ideal for couples who value genuine farm estate atmosphere over hotel polish.",
          },
        ],
      },
      {
        h2: "Planning Tips for Franschhoek",
        venueLinks: [{ name: "La Paris Estate", slug: "la-paris-estate" }],
        paras: [
          "Book well in advance — peak season (October to April) fills up 12–18 months out for the best estates. If your date is flexible, consider autumn (March–May) for the best light, milder temperatures, and the golden vineyard harvest backdrop. Many estates also offer meaningful discounts for winter weddings.",
        ],
      },
    ],
    cta: {
      label: "Browse Cape Winelands Venues",
      path: "/venues",
      filters: { region: "Cape Winelands" },
    },
  },
  {
    slug: "budget-friendly-winelands-venues",
    title:
      "Getting Value in the Winelands: More Accessible Cape Wedding Venues",
    category: "Budget Planning",
    date: "May 2026",
    summary:
      "A Winelands wedding doesn't have to mean a seven-figure price tag. These mid-range venues offer genuine Cape character — mountain views, estate wines, and well-equipped event spaces — at more accessible price points.",
    heroImg:
      "https://images.unsplash.com/photo-1704037178699-8d9d9bedcb52?auto=format&fit=crop&w=1400&q=80",
    heroCredit:
      "Photo: Matthias Wesselmann / Unsplash — Delheim Wine Estate, Stellenbosch",
    metaDesc:
      "Planning a Winelands wedding on a tighter budget? Here are our verified mid-range Cape venues that offer excellent value without sacrificing mountain views or Cape character.",
    intro:
      "Let's be honest: 'Winelands' and 'budget' don't often appear in the same sentence. Most estates in Franschhoek and Stellenbosch fall in the mid-range to luxury tier. But with the right knowledge — and a bit of flexibility on date and format — you can get a genuine Cape Winelands wedding without overspending.",
    sections: [
      {
        h2: "How to Stretch Your Rands",
        paras: [
          "Timing is the most powerful lever. Winter weddings (June–August) typically attract off-peak pricing — sometimes significantly reduced from peak rates. A Tuesday or Thursday date can also unlock discounts that a Saturday won't.",
          "Look for venues that allow you to bring your own wine or charge a reasonable corkage. On a 100-guest wedding, the difference between in-house pricing and BYO can run to tens of thousands of rands.",
        ],
      },
      {
        h2: "Three Verified Mid-Range Venues Worth Considering",
        items: [
          {
            title: "Nooitgedacht Wine Estate (Paarl)",
            slug: "nooitgedacht-wine-estate",
            desc: "A Mid-Range wine estate with genuine Cape Dutch charm, rustic barn spaces, and a relaxed atmosphere that keeps décor costs down — the setting does much of the work. Located just outside Paarl on the R44.",
          },
          {
            title: "Eikenhof Estate (Stellenbosch / Bottelary Hills)",
            slug: "eikenhof-estate",
            desc: "A privately-owned exclusive-use wine and olive farm in the Bottelary Hills, sitting at the Mid-Range tier. You get the whole property — ideal for couples who want a private farm feel without the premium estate price.",
          },
          {
            title: "Lanzerac Wine Estate (Stellenbosch)",
            slug: "lanzerac-wine-estate",
            desc: "A 5-star Cape Dutch manor at the foot of the Jonkershoek Mountains, priced in the Mid-Range tier. Heritage dating to 1692, multiple event spaces, and Stellenbosch's most iconic mountain backdrop — at a more accessible price point than many comparable properties.",
          },
        ],
      },
      {
        h2: "A Realistic Note on Pricing",
        paras: [
          "Our Mid-Range tier covers venues where total venue costs typically fall between R50,000 and R150,000. Your full wedding budget — including catering, décor, photography, flowers, and transport — will be higher. Venue costs are typically 20–35% of a total wedding spend. Use our venue tiers as a starting point, then contact each venue for a detailed quote based on your specific date and guest count.",
        ],
        notice:
          "Venue pricing changes seasonally and annually. Always request a current quote directly from the venue — our tiers are a guide, not a guarantee.",
      },
    ],
    cta: {
      label: "Browse Mid-Range Venues",
      path: "/venues",
      filters: { price: "Mid-Range (R50–150k)" },
    },
  },
  {
    slug: "best-seasons-cape-wedding",
    title:
      "Best Seasons for a Cape Wedding: Light, Wind & What No One Tells You",
    category: "Planning Guides",
    date: "May 2026",
    summary:
      "In the Western Cape, your wedding date affects your photos, your guests' comfort, and your budget. Here's an honest breakdown of what each season actually delivers.",
    heroImg:
      "https://images.unsplash.com/photo-1553783075-906930b08f36?auto=format&fit=crop&w=1400&q=80",
    heroCredit:
      "Photo: Mpho Mojapelo / Unsplash — Hidden Valley Wine Estate, Stellenbosch",
    metaDesc:
      "When is the best time for a Western Cape wedding? From summer winds to winter mountain mists, here's what each season means for your Cape wedding day.",
    intro:
      "Your wedding date doesn't just determine which flowers are in season — in the Western Cape, it shapes the quality of light in your photographs, the comfort of your guests, and how much you'll pay for the same venue. Here's what each season genuinely looks like.",
    sections: [
      {
        h2: "Summer (December – February): Golden but Windy",
        venueLinks: [{ name: "La Paris Estate", slug: "la-paris-estate" }],
        paras: [
          "Long evenings, warm temperatures, and sunsets as late as 8:00 PM make summer visually spectacular. The Cape's infamous South-Easterly wind — the 'Cape Doctor' — is, however, at its most persistent during these months.",
          "If you're considering a coastal venue on the Atlantic Seaboard, ensure there is a solid indoor alternative. Inland Winelands estates are generally more sheltered, but wind can still be a factor in exposed valley locations. La Paris Estate is a good example of a Winelands venue with enough mature tree cover and garden structure to soften the breeze.",
        ],
      },
      {
        h2: "Autumn (March – May): The Photographer's Season",
        paras: [
          "March and April are widely considered the best months in the Cape for photography. The South-Easterly dies down, temperatures are mild, and vineyards shift from green to amber and gold. If you have any flexibility in your dates, this is the window most local wedding photographers prefer.",
        ],
      },
      {
        h2: "Winter (June – August): Underrated and Underpriced",
        venueLinks: [
          { name: "Lanzerac Wine Estate", slug: "lanzerac-wine-estate" },
        ],
        paras: [
          "Winter rainfall increases, but the mountains look their most dramatic — often snow-capped from June onwards, and frequently shrouded in mist. Winter weddings in the Cape have a genuinely different aesthetic: moody, intimate, and warm inside.",
          "Lanzerac Wine Estate in Stellenbosch is a strong choice for a winter wedding. As a 5-star hotel with multiple indoor event spaces and a setting at the foot of the Jonkershoek Mountains, it offers the drama of a winter Cape backdrop with the comfort of a fully enclosed venue.",
        ],
      },
      {
        h2: "Spring (September – November): Blooming but Booked",
        paras: [
          "Spring in the Western Cape is spectacular — wildflowers, fresh green vineyard growth, and clear mountain air. It is also when the competition for popular dates intensifies sharply. If spring is your target, start the venue search at least 12–18 months out.",
        ],
      },
    ],
    cta: { label: "Browse All Venues", path: "/venues" },
  },
  {
    slug: "marriage-officer-guide-cape-weddings",
    title:
      "Marriage Officer Guide: The Legalities of Getting Married in the Cape",
    category: "Legal & Practical",
    date: "May 2026",
    summary:
      "Getting legally married in South Africa requires a registered Marriage Officer, specific documentation, and some forward planning. Here's what you need to know — with links to the official sources.",
    heroImg:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1400&q=80",
    heroCredit: "Photo: Zoriana Stakhniv / Unsplash",
    metaDesc:
      "A practical guide to the legal requirements for getting married in South Africa — covering Marriage Officers, documentation, and what international couples need to know.",
    intro:
      "Between choosing flowers and tasting Sauvignon Blancs, the legal side of your wedding can feel like a chore. But ensuring your marriage is legally valid in South Africa requires specific steps — and missing any of them can cause real problems later. Here's what you need, based on the Marriage Act 25 of 1961 and the Civil Union Act 17 of 2006.",
    sections: [
      {
        h2: "Who Can Legally Marry You?",
        paras: [
          "In South Africa, only a registered Marriage Officer can make your union legally binding. Marriage Officers fall into three categories: Home Affairs officials, designated religious ministers (registered with the Department of Home Affairs), and private civil Marriage Officers registered under the Civil Union Act. The last category includes secular officiants — useful for couples who want a non-religious ceremony.",
          "Always ask to see your officiant's appointment certificate (Form BI-30) before the ceremony. This confirms their authority covers your type of marriage — civil, civil union, or customary. Source: Gawie le Roux Institute of Law / DHA.",
        ],
        notice:
          "⚠️ If a person performs your ceremony without proper DHA registration, your marriage may not be legally valid — regardless of how meaningful the ceremony was.",
      },
      {
        h2: "What Documents Do You Need?",
        items: [
          {
            title: "South African citizens",
            desc: "Your SA green ID book or Smart ID Card. If previously married, the original decree of divorce or death certificate of former spouse.",
          },
          {
            title: "Foreign nationals",
            desc: "Valid passport with entry stamp. A completed BI-31 form (Declaration for the Purpose of Marriage / Letter of No Impediment). If one partner is SA and one is foreign, both passports are required.",
          },
          {
            title: "Two witnesses",
            desc: "Any two adults of any nationality must be present to sign the marriage register immediately after the ceremony. There is no requirement for them to be SA citizens.",
          },
        ],
      },
      {
        h2: "The Home Affairs Route vs. Private Marriage Officers",
        paras: [
          "If you use a Home Affairs official, you must give formal written notice of intention to marry at a Home Affairs office at least three months before your ceremony. Private marriage officers typically handle this notice process on your behalf, making them far more practical for venue weddings.",
          "Importantly, you can have your meaningful ceremony at your chosen venue and use a private Marriage Officer — no requirement to appear at Home Affairs on your wedding day.",
        ],
      },
      {
        h2: "Antenuptial Contracts: Read This Before You Sign",
        paras: [
          "South African marriages are automatically 'in community of property' unless you sign an Antenuptial Contract (ANC) with a notary before the ceremony. In community of property means all assets and debts from both partners are joined into a shared estate. If either partner has debts, the other becomes liable. An ANC must be signed and registered at the Deeds Office before your wedding day — it cannot be done retroactively.",
        ],
        notice:
          "If you intend to marry 'out of community of property,' consult an attorney to draw up your ANC before the wedding date. This is one of the most financially consequential decisions you will make.",
      },
      {
        h2: "For International Couples: Getting Your Marriage Recognised Abroad",
        paras: [
          "After your ceremony, you can apply for an Unabridged Marriage Certificate from Home Affairs (form BI-130). This typically takes six to eight weeks and is the document most foreign countries require to register your marriage abroad.",
          "For most countries, this certificate will then need to be authenticated. South Africa is a signatory to the Hague Convention Abolishing the Requirement of Legalisation — meaning an Apostille stamp is the correct authentication route for countries also party to this convention. For countries not party to the Hague Convention, full legalisation through the Legalisation Section of the Department of International Relations and Cooperation (DIRCO) is required. Check which process applies to your home country before your wedding date.",
        ],
      },
    ],
    cta: { label: "Browse All Venues", path: "/venues" },
  },
  {
    slug: "mountain-backdrop-wedding-venues-western-cape",
    title:
      "Mountain Wedding Venues in the Western Cape: From Table Mountain to Tulbagh",
    category: "Venue Guides",
    date: "May 2026",
    summary:
      "If there is one thing that defines a Cape wedding, it's the mountains. Here are our verified venues where the landscape isn't just a backdrop — it's the main event.",
    heroImg:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1400&q=80",
    heroCredit: "Photo: Tobias Reich / Unsplash",
    metaDesc:
      "Looking for a mountain backdrop for your Cape wedding? Our verified picks include venues with views of Table Mountain, the Twelve Apostles, Jonkershoek, and the Winterhoek range.",
    intro:
      "In the Western Cape, mountains are never far from view. But there's a difference between a venue that happens to have mountains nearby and one where the peaks are genuinely central to the experience. These are the verified Cape Vows venues where the landscape earns its place.",
    sections: [
      {
        h2: "Atlantic Drama: The Twelve Apostles Mountain Range",
        venueLinks: [
          { name: "The 12 Apostles Hotel", slug: "the-12-apostles-hotel" },
        ],
        paras: [
          "For the full Cape Town postcard moment — mountains meeting the Atlantic — the Atlantic Seaboard is unmatched. The 12 Apostles Hotel in Camps Bay sits between the Twelve Apostles range and the ocean, with a ceremony space that frames both. It is one of the few venues in the world where you can have mountains and ocean in the same photograph.",
        ],
      },
      {
        h2: "Winelands Intimacy: The Banghoek Valley",
        venueLinks: [{ name: "Zorgvliet Wines", slug: "zorgvliet-wines" }],
        paras: [
          "The mountains around Stellenbosch feel closer and steeper than the wider Cape landscape — particularly in the Banghoek Valley east of the town, where the peaks turn a deep purple as the sun drops.",
          "Zorgvliet Wines sits in this valley, tucked away with Blue Ridge mountain views on multiple sides. It is a deliberately off-the-main-road estate — the kind of venue where the mountain setting feels private rather than panoramic.",
        ],
      },
      {
        h2: "Hidden Valleys: The Jonkershoek and Tulbagh Ranges",
        venueLinks: [
          { name: "Lanzerac Wine Estate", slug: "lanzerac-wine-estate" },
          { name: "Saronsberg Wine Estate", slug: "saronsberg-wine-estate" },
        ],
        paras: [
          "For couples who want genuine mountain drama without the Stellenbosch crowds, the Jonkershoek Valley offers some of the most dramatic peak-to-valley scenery in the province. Lanzerac Wine Estate sits at the foot of the Jonkershoek Mountains — a 5-star heritage property where the mountain wall behind the estate is hard to ignore.",
          "Further north, Saronsberg Wine Estate in the Tulbagh Valley is cradled by the Obiqua and Winterhoek mountain ranges — a genuinely remote location with a 360-degree mountain panorama that most Winelands venues simply cannot offer. It is one of our strongest recommendations for couples who want their venue to feel discovered.",
        ],
      },
      {
        h2: "Peninsula Views: Chapman's Peak and Beyond",
        venueLinks: [
          { name: "Cape Point Vineyards", slug: "cape-point-vineyards" },
        ],
        paras: [
          "Cape Point Vineyards at Noordhoek sits on the slopes of the Cape Peninsula, with views of Chapman's Peak and the Noordhoek Valley that are unlike anything in the Winelands. This is the venue for couples who want Table Mountain National Park on one side and the Atlantic on the other.",
        ],
      },
    ],
    cta: { label: "Browse Venues with a View", path: "/venues" },
  },
];

function linkifyVenues(text, venueLinks, navigate) {
  if (!venueLinks || !venueLinks.length) return text;
  let parts = [text];
  venueLinks.forEach(({ name, slug }) => {
    parts = parts.flatMap((part) => {
      if (typeof part !== "string") return [part];
      const segments = part.split(name);
      return segments.flatMap((s, i) =>
        i < segments.length - 1
          ? [
              s,
              <button
                key={`${slug}-${i}`}
                className="blog-venue-link"
                onClick={() => navigate(`/venues/${slug}`)}
              >
                {name}
              </button>,
            ]
          : [s],
      );
    });
  });
  return parts;
}

// ─── Blog Components ──────────────────────────────────────────────────────────
function BlogPage({ navigate }) {
  return (
    <div className="blog-page">
      <div className="section-eyebrow">Cape Vows</div>
      <h1 className="section-title">
        Wedding <em>Planning</em> Guides
      </h1>
      <p className="section-desc" style={{ maxWidth: 600 }}>
        Honest, local advice for planning your Western Cape wedding — venue
        guides, seasonal tips, and the legal information no one explains
        clearly.
      </p>
      <div className="blog-grid">
        {POSTS.map((post) => (
          <div
            className="blog-card"
            key={post.slug}
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            <img
              className="blog-card-img"
              src={post.heroImg}
              alt={post.title}
              loading="lazy"
            />
            <div className="blog-card-body">
              <div className="blog-card-cat">{post.category}</div>
              <div className="blog-card-title">{post.title}</div>
              <div className="blog-card-summary">{post.summary}</div>
            </div>
            <div className="blog-card-footer">
              <span>{post.date}</span>
              <span className="blog-card-read">Read more →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogPostPage({ post, navigate }) {
  useEffect(() => {
    document.title = `${post.title} | Cape Vows`;
    let m = document.querySelector("meta[name='description']");
    if (!m) {
      m = document.createElement("meta");
      m.name = "description";
      document.head.appendChild(m);
    }
    m.content = post.metaDesc;
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "blog-jsonld";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDesc,
      image: post.heroImg,
      datePublished: post.date,
      publisher: {
        "@type": "Organization",
        name: "Cape Vows",
        url: "https://capevows.co.za",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://capevows.co.za/blog/${post.slug}`,
      },
    });
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById("blog-jsonld");
      if (el) el.remove();
    };
  }, [post]);

  return (
    <div className="blog-post">
      <button className="venue-back" onClick={() => navigate("/blog")}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M9 2L4 7L9 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        All Articles
      </button>
      <div className="blog-post-cat">{post.category}</div>
      <h1 className="blog-post-title">{post.title}</h1>
      <div className="blog-post-meta">{post.date} · Cape Vows Editorial</div>
      <img className="blog-post-hero" src={post.heroImg} alt={post.title} />
      <div className="blog-hero-credit">{post.heroCredit}</div>
      <p className="blog-post-intro">{post.intro}</p>
      {post.sections.map((sec, i) => (
        <div key={i}>
          <h2 className="blog-post-h2">{sec.h2}</h2>
          {sec.notice && <div className="blog-post-notice">{sec.notice}</div>}
          {sec.paras &&
            sec.paras.map((p, j) => (
              <p className="blog-post-p" key={j}>
                {linkifyVenues(p, sec.venueLinks, navigate)}
              </p>
            ))}
          {sec.items && (
            <ul className="blog-post-list">
              {sec.items.map((item, k) => (
                <li className="blog-post-li" key={k}>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                  {item.slug && (
                    <button
                      className="blog-venue-btn"
                      onClick={() => navigate(`/venues/${item.slug}`)}
                    >
                      View venue →
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <div className="blog-post-cta">
        <button
          className="btn btn-primary"
          onClick={() => {
            if (post.cta.filters)
              sessionStorage.setItem(
                "cv_pending_filters",
                JSON.stringify(post.cta.filters),
              );
            navigate(post.cta.path);
          }}
        >
          {post.cta.label}
        </button>
      </div>
    </div>
  );
}

// ─── Router ────────────────────────────────────────────────────────────────────
function useRouter() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const h = () => setPath(window.location.pathname);
    window.addEventListener("popstate", h);
    return () => window.removeEventListener("popstate", h);
  }, []);
  const navigate = useCallback((to) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "instant" });
    track("page_view", { page_path: to });
  }, []);
  return { path, navigate };
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqAccordion({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-section">
      <div className="faq-title">Frequently Asked Questions</div>
      {faqs.map((faq, i) => (
        <div className="faq-item" key={i}>
          <button
            className="faq-q"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{faq.q}</span>
            <svg
              className={`faq-chevron${open === i ? " open" : ""}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {open === i && <div className="faq-a">{faq.a}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── VenueCard ────────────────────────────────────────────────────────────────
function VenueCard({ venue, navigate, isSaved, onToggleSave }) {
  return (
    <div
      className="card"
      onClick={() => {
        track("venue_card_click", { venue_name: venue.name });
        navigate(`/venues/${venue.slug}`);
      }}
    >
      <div
        className="card-banner"
        style={{ background: getGradient(venue.type) }}
      >
        <div className="card-banner-overlay" />
        <span className="card-banner-badge">{venue.type}</span>
        {onToggleSave && (
          <button
            className={`card-save-btn${isSaved ? " saved" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(venue.slug);
              track("venue_save_toggle", {
                venue_name: venue.name,
                saved: !isSaved,
              });
            }}
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
        )}
      </div>
      <div className="card-body">
        <div className="card-region">{venue.region}</div>
        <div className="card-title">{venue.name}</div>
        <div className="card-desc">{venue.description}</div>
        <div className="card-meta">
          <span className="card-pill">
            👥 {displayCapacity(venue.capacity)}
          </span>
          <span className="card-pill green">✦ {venue.highlight}</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="card-price">{displayPrice(venue.price)}</span>
        <span className="card-link">View Details →</span>
      </div>
    </div>
  );
}

// ─── VendorCard ───────────────────────────────────────────────────────────────
function VendorCard({ vendor, onClick }) {
  return (
    <div
      className="card"
      onClick={() => {
        track("vendor_card_click", { vendor_name: vendor.name });
        onClick(vendor);
      }}
    >
      <div
        className="card-banner"
        style={{
          background:
            "linear-gradient(145deg, #1E2A22 0%, #2D4A3E 50%, #3D6356 100%)",
        }}
      >
        <div className="card-banner-overlay" />
        <span className="card-banner-badge">{vendor.category}</span>
        <span className="card-banner-name">{vendor.name}</span>
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
        <span className="card-price">{vendor.priceRange}</span>
        <span className="card-link">View Details →</span>
      </div>
    </div>
  );
}

// ─── VendorModal ──────────────────────────────────────────────────────────────
function VendorModal({ vendor, onClose }) {
  useEffect(() => {
    track("vendor_modal_open", { vendor_name: vendor.name });
  }, []);
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-hero">
          <img src={vendor.img} alt={vendor.name} />
          <div className="modal-hero-overlay" />
          <span className="modal-hero-text">{vendor.name}</span>
          <span className="modal-badge">{vendor.category}</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-eyebrow">
            {vendor.region} · {vendor.category}
          </div>
          <div className="modal-title">{vendor.name}</div>
          <div className="modal-desc">{vendor.description}</div>
          <div className="modal-grid">
            <div className="modal-detail">
              <div className="modal-detail-label">Price Range</div>
              <div className="modal-detail-value">{vendor.priceRange}</div>
            </div>
            <div className="modal-detail">
              <div className="modal-detail-label">Phone</div>
              <div className="modal-detail-value">{vendor.phone}</div>
            </div>
            <div className="modal-detail">
              <div className="modal-detail-label">Speciality</div>
              <div className="modal-detail-value">{vendor.highlight}</div>
            </div>
            <div className="modal-detail">
              <div className="modal-detail-label">Region</div>
              <div className="modal-detail-value">{vendor.region}</div>
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button className="btn-green" style={{ width: "auto" }}>
              Visit Website
            </button>
          </a>
          <button
            className="btn-ghost"
            style={{ width: "auto" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Venue Detail Page ─────────────────────────────────────────────────────────
// CHANGED: Added Formspree enquiry modal. Primary CTA is now "Enquire About This Venue".
// "Visit Official Website" demoted to ghost button.
// www removed from all JSON-LD URLs for canonical consistency.
// Formspree endpoint: https://formspree.io/f/mwvywnbp
function VenuePage({ venue, navigate, allVenues, isSaved, onToggleSave }) {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState("idle"); // idle | sending | sent | error

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

  async function handleEnquiry(e) {
    e.preventDefault();
    setEnquiryStatus("sending");
    const form = e.target;
    const data = new FormData(form);
    data.append("venue", venue.name);
    data.append("region", venue.region);
    try {
      const res = await fetch("https://formspree.io/f/mwvywnbp", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setEnquiryStatus("sent");
        form.reset();
        track("venue_enquiry", {
          venue_name: venue.name,
          venue_region: venue.region,
        });
      } else {
        setEnquiryStatus("error");
      }
    } catch {
      setEnquiryStatus("error");
    }
  }

  useEffect(() => {
    document.title = `${venue.name} Wedding Venue — ${venue.region} | Cape Vows`;
    const m = document.querySelector('meta[name="description"]');
    if (m)
      m.setAttribute(
        "content",
        `${venue.name} is a ${venue.type.toLowerCase()} wedding venue in ${venue.region}, Western Cape. ${venue.description.substring(0, 130)}...`,
      );
    return () => {
      document.title = "Cape Vows | Western Cape Wedding Directory";
      if (m)
        m.setAttribute(
          "content",
          `Browse ${VENUES.length} hand-verified wedding venues in the Western Cape — Franschhoek, Stellenbosch, Cape Town and beyond.`,
        );
    };
  }, [venue]);

  useEffect(() => {
    const faqs = getVenueFaqs(venue);
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "venue-jsonld";
    s.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "EventVenue",
        name: venue.name,
        description: venue.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: venue.address,
          addressRegion: "Western Cape",
          addressCountry: "ZA",
        },
        telephone: venue.phone,
        url: venue.website,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://capevows.co.za/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Venues",
            item: "https://capevows.co.za/venues",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: venue.name,
            item: `https://capevows.co.za/venues/${venue.slug}`,
          },
        ],
      },
    ]);
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById("venue-jsonld");
      if (el) el.remove();
    };
  }, [venue]);

  const related = allVenues
    .filter((v) => v.id !== venue.id && v.region === venue.region)
    .slice(0, 3);
  const enquireCap = venue.capacity === "Contact venue";
  const enquirePrice = venue.price === "Contact Venue";

  return (
    <div className="venue-page">
      <button
        className="venue-back"
        onClick={() => navigate("/venues")}
        aria-label="Back to venues"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 2L4 7L9 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        All Venues
      </button>

      <div
        className="venue-banner"
        style={{ background: getGradient(venue.type) }}
      >
        <div className="venue-banner-eyebrow">
          {venue.region} · Western Cape
        </div>
        <h1 className="venue-banner-title">{venue.name}</h1>
        <div className="venue-banner-chips">
          <span className="venue-banner-chip">{venue.type}</span>
          <span className="venue-banner-chip">
            {enquireCap ? "Enquire for capacity" : `${venue.capacity} guests`}
          </span>
          <span className="venue-banner-chip">
            {enquirePrice ? "Enquire for pricing" : venue.price}
          </span>
        </div>
      </div>

      <div className="venue-page-layout">
        <div className="venue-main">
          <p className="venue-desc">{venue.description}</p>
          <div className="venue-features-title">Features &amp; Inclusions</div>
          <div className="tags" style={{ marginBottom: "1rem" }}>
            {venue.features.map((f) => (
              <span key={f} className="tag active">
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="venue-sidebar">
          <div className="venue-details-card">
            <div
              className="venue-details-card-header"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div>
                <div className="venue-details-card-name">{venue.name}</div>
                <div className="venue-details-card-region">{venue.region}</div>
              </div>
              {onToggleSave && (
                <button
                  onClick={() => {
                    onToggleSave(venue.slug);
                    track("venue_save_toggle", {
                      venue_name: venue.name,
                      saved: !isSaved,
                    });
                  }}
                  aria-label={isSaved ? "Remove from saved" : "Save venue"}
                  title={
                    isSaved ? "Saved — click to remove" : "Save this venue"
                  }
                  style={{
                    flexShrink: 0,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 0 0",
                    lineHeight: 1,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 14 14"
                    fill={isSaved ? "var(--gold)" : "none"}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transition: "fill 0.2s" }}
                  >
                    <path
                      d="M7 12S1.5 8.5 1.5 4.5a3 3 0 015.5-1.67A3 3 0 0112.5 4.5C12.5 8.5 7 12 7 12z"
                      stroke={isSaved ? "var(--gold)" : "var(--muted)"}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="venue-details-rows">
              <div className="venue-detail-row">
                <span className="venue-detail-label">Type</span>
                <span className="venue-detail-value">{venue.type}</span>
              </div>
              <div className="venue-detail-row">
                <span className="venue-detail-label">Capacity</span>
                <span
                  className={`venue-detail-value${enquireCap ? " enquire" : ""}`}
                >
                  {displayCapacity(venue.capacity)}
                </span>
              </div>
              <div className="venue-detail-row">
                <span className="venue-detail-label">Pricing</span>
                <span
                  className={`venue-detail-value${enquirePrice ? " enquire" : ""}`}
                >
                  {displayPrice(venue.price)}
                </span>
              </div>
              <div className="venue-detail-row">
                <span className="venue-detail-label">Address</span>
                <span
                  className="venue-detail-value"
                  style={{ fontSize: "0.87rem" }}
                >
                  {venue.address}
                </span>
              </div>
              <div className="venue-detail-row">
                <span className="venue-detail-label">Phone</span>
                <span className="venue-detail-value phone">
                  <a href={`tel:${venue.phone.replace(/\s/g, "")}`}>
                    {venue.phone}
                  </a>
                </span>
              </div>
            </div>
            <div className="venue-cta-group">
              {/* PRIMARY: Enquiry modal — keeps users on capevows.co.za */}
              <button
                className="btn-green"
                onClick={() => {
                  setShowEnquiry(true);
                  track("enquiry_open", { venue_name: venue.name });
                }}
              >
                Enquire About This Venue
              </button>
              {/* SECONDARY: Official website */}
              <a
                href={venue.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                }}
                onClick={() =>
                  track("outbound_click", { venue_name: venue.name })
                }
              >
                Visit Official Website
              </a>
            </div>
          </div>
        </div>
      </div>

      <FaqAccordion faqs={getVenueFaqs(venue)} />

      {related.length > 0 && (
        <div className="related-section">
          <h2 className="related-title">
            More venues in <em>{venue.region}</em>
          </h2>
          <div className="cards-grid">
            {related.map((v) => (
              <VenueCard key={v.id} venue={v} navigate={navigate} />
            ))}
          </div>
        </div>
      )}

      {/* ── Enquiry Modal ─────────────────────────────────────────────────────── */}
      {showEnquiry && (
        <div
          onClick={() => setShowEnquiry(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "var(--cream)",
              borderRadius: 12,
              padding: 32,
              width: "100%",
              maxWidth: 460,
              boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
            }}
          >
            {/* X close button — top right */}
            <button
              onClick={() => {
                setShowEnquiry(false);
                setEnquiryStatus("idle");
              }}
              aria-label="Close enquiry form"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "var(--cream2)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "var(--muted)",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
            <h3
              style={{
                fontFamily: "var(--ff-serif)",
                color: "var(--green)",
                marginTop: 0,
                marginBottom: "0.2rem",
              }}
            >
              Enquire — {venue.name}
            </h3>
            <p
              style={{
                fontFamily: "var(--ff-sans)",
                fontSize: "0.72rem",
                color: "var(--gold)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              {venue.region} · Western Cape
            </p>

            {enquiryStatus === "sent" ? (
              <p
                style={{
                  color: "var(--green)",
                  fontFamily: "var(--ff-body)",
                  fontSize: 18,
                  lineHeight: 1.6,
                }}
              >
                ✓ Enquiry sent! We'll be in touch shortly.
              </p>
            ) : (
              <form onSubmit={handleEnquiry}>
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
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone (optional)"
                  style={inputStyle}
                />
                <textarea
                  name="message"
                  placeholder="Tell us about your wedding — date, guest count, any questions"
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                {/* Consent checkbox — required for GDPR (EU users) and POPIA compliance */}
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
                  disabled={enquiryStatus === "sending"}
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
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                >
                  {enquiryStatus === "sending" ? "Sending…" : "Send Enquiry"}
                </button>
                {enquiryStatus === "error" && (
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
      )}
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
            Extracted Details — Review & Edit Before Saving
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

// ─── Pages ─────────────────────────────────────────────────────────────────────
function HomePage({ navigate, allVenues }) {
  const featuredSlugs = ["eikenhof-estate", "la-paris-estate", "babylonstoren"];
  const featured = featuredSlugs
    .map((s) => allVenues.find((v) => v.slug === s))
    .filter(Boolean);

  return (
    <>
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            You've Found
            <br />
            <em>Each Other.</em>
            <br />
            Now Find the <em>Venue.</em>
          </h1>
          <p className="hero-sub">
            24 hand-researched venues across the Western Cape — from
            sun-drenched Winelands estates to hidden fynbos retreats, verified
            and curated for your Cape wedding.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                track("hero_cta_click", { button: "explore_venues" });
                navigate("/venues");
              }}
            >
              Browse Venues
            </button>
          </div>
        </div>
        <div className="hero-scroll">
          <span className="hero-scroll-label">Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </div>

      <section>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Curated Selection</div>
            <h2 className="section-title">
              Featured <em>Venues</em>
            </h2>
            <p className="section-desc">
              From historic Cape Dutch wine estates to dramatic coastal
              retreats, the Western Cape's most celebrated wedding destinations.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              track("cta_click", { button: "view_all_venues" });
              navigate("/venues");
            }}
          >
            View All Venues
          </button>
        </div>
        <div className="cards-grid">
          {featured.map((v) => (
            <VenueCard key={v.id} venue={v} navigate={navigate} />
          ))}
        </div>
      </section>

      <div
        style={{
          background: "var(--green)",
          padding: "4rem 2.5rem",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "var(--ff-sans)",
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold2)",
              marginBottom: "1rem",
            }}
          >
            Wedding Suppliers
          </div>
          <h2
            style={{
              fontFamily: "var(--ff-serif)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#fff",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Every Expert You <em>Need</em>
          </h2>
          <p
            style={{
              fontFamily: "var(--ff-body)",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2.5rem",
              fontSize: "1.1rem",
            }}
          >
            Photographers, florists, caterers, DJs, planners and more — all
            hand-selected for the Western Cape market. Vendor profiles coming
            soon.
          </p>
          <a
            href="mailto:hello@capevows.co.za?subject=Vendor Listing Enquiry"
            style={{ textDecoration: "none" }}
            onClick={() =>
              track("email_cta_click", { button: "register_interest" })
            }
          >
            <button className="btn btn-primary">Register Your Interest</button>
          </a>
        </div>
      </div>

      <section>
        <div
          style={{
            background: "var(--cream2)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "2.5rem",
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div className="section-eyebrow">For Venue Owners & Vendors</div>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>
              List Your <em>Business</em>
            </h2>
            <p className="section-desc" style={{ fontSize: "1rem" }}>
              Are you a venue or wedding supplier in the Western Cape? Get
              discovered by engaged couples planning their big day.
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--ff-sans)",
                fontSize: "0.8rem",
                color: "var(--muted)",
                marginBottom: "1rem",
              }}
            >
              Contact us to get listed
            </p>
            <a
              href="mailto:hello@capevows.co.za?subject=Listing Enquiry"
              style={{ textDecoration: "none" }}
              onClick={() => track("email_cta_click", { button: "get_listed" })}
            >
              <button className="btn-green" style={{ width: "auto" }}>
                hello@capevows.co.za
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function VenuesPage({ allVenues, navigate, saved, onToggleSave }) {
  const [region, setRegion] = useState(() => {
    try {
      const f = JSON.parse(
        sessionStorage.getItem("cv_pending_filters") || "{}",
      );
      return f.region || "All Regions";
    } catch {
      return "All Regions";
    }
  });
  const [type, setType] = useState("All Types");
  const [price, setPrice] = useState(() => {
    try {
      const f = JSON.parse(
        sessionStorage.getItem("cv_pending_filters") || "{}",
      );
      return f.price && PRICE_RANGES.includes(f.price) ? f.price : "Any Budget";
    } catch {
      return "Any Budget";
    }
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Name: A–Z");
  const [minGuests, setMinGuests] = useState(0);

  useEffect(() => {
    sessionStorage.removeItem("cv_pending_filters");
  }, []);

  const availableRegions = [
    "All Regions",
    ...Array.from(new Set(allVenues.map((v) => v.region))).sort(),
  ];
  const availableTypes = [
    "All Types",
    ...Array.from(new Set(allVenues.map((v) => v.type))).sort(),
  ];
  const availablePrices = [
    "Any Budget",
    ...PRICE_RANGES.slice(1).filter((p) =>
      allVenues.some((v) => v.price === p),
    ),
  ];
  const priceOrder = {
    "Budget (< R50k)": 1,
    "Mid-Range (R50–150k)": 2,
    "Premium (R150–300k)": 3,
    "Luxury (R300k+)": 4,
  };
  const capNum = (c) => parseInt((c || "0").replace(/\D/g, "")) || 0;

  const filtered = allVenues.filter((v) => {
    if (region !== "All Regions" && v.region !== region) return false;
    if (type !== "All Types" && v.type !== type) return false;
    if (price !== "Any Budget" && v.price !== price) return false;
    if (
      search &&
      !v.name.toLowerCase().includes(search.toLowerCase()) &&
      !v.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (
      minGuests > 0 &&
      v.capacity !== "Contact venue" &&
      capNum(v.capacity) < minGuests
    )
      return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Price: Low to High")
      return (priceOrder[a.price] || 0) - (priceOrder[b.price] || 0);
    if (sort === "Price: High to Low")
      return (priceOrder[b.price] || 0) - (priceOrder[a.price] || 0);
    if (sort === "Capacity: Low to High")
      return capNum(a.capacity) - capNum(b.capacity);
    if (sort === "Capacity: High to Low")
      return capNum(b.capacity) - capNum(a.capacity);
    return a.name.localeCompare(b.name);
  });

  return (
    <section style={{ paddingTop: "3rem" }}>
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Western Cape</div>
          <h1 className="section-title">
            Wedding <em>Venues</em>
          </h1>
          <p className="section-desc">
            Browse {allVenues.length} hand-verified venues across the Western
            Cape — filter by region, style, size and budget.
          </p>
        </div>
      </div>
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
        <div className="filter-group">
          <div className="filter-label">Sort By</div>
          <select
            className="filter-select"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              if (e.target.value !== "Name: A–Z")
                track("sort_used", { sort_value: e.target.value });
            }}
          >
            {[
              "Name: A–Z",
              "Price: Low to High",
              "Price: High to Low",
              "Capacity: Low to High",
              "Capacity: High to Low",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          className="filter-clear"
          onClick={() => {
            setRegion("All Regions");
            setType("All Types");
            setPrice("Any Budget");
            setSearch("");
            setSort("Name: A–Z");
            setMinGuests(0);
          }}
        >
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
            <VenueCard
              key={v.id}
              venue={v}
              navigate={navigate}
              isSaved={saved.includes(v.slug)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function VendorsPage() {
  const [selected, setSelected] = useState(null);
  return (
    <section style={{ paddingTop: "3rem" }}>
      {selected && (
        <VendorModal vendor={selected} onClose={() => setSelected(null)} />
      )}
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Wedding Suppliers</div>
          <h1 className="section-title">
            Cape <em>Vendors</em>
          </h1>
          <p className="section-desc">
            Photographers, florists, caterers, planners and more — all
            hand-selected for the Western Cape market.
          </p>
        </div>
      </div>
      <div
        style={{
          background: "var(--cream2)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "4rem 2.5rem",
          textAlign: "center",
          margin: "2rem 0",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "1.25rem" }}>✦</div>
        <div
          style={{
            fontFamily: "var(--ff-sans)",
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "0.75rem",
          }}
        >
          Coming Soon
        </div>
        <h2
          style={{
            fontFamily: "var(--ff-serif)",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            color: "var(--green)",
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}
        >
          Our Vendor Directory
          <br />
          <em>Is on Its Way</em>
        </h2>
        <p
          style={{
            fontFamily: "var(--ff-body)",
            fontSize: "1.05rem",
            color: "var(--muted)",
            maxWidth: "480px",
            margin: "0 auto 2rem",
            lineHeight: 1.75,
          }}
        >
          We're carefully curating the Western Cape's best photographers,
          florists, caterers, planners and more. Check back soon.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            "Photography",
            "Floristry",
            "Catering",
            "Coordination",
            "Entertainment",
            "Hair & Make-up",
            "Décor & Hire",
            "Cake & Desserts",
          ].map((cat) => (
            <span
              key={cat}
              style={{
                fontFamily: "var(--ff-sans)",
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "#fff",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                padding: "0.3rem 0.75rem",
                borderRadius: "12px",
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          background: "var(--green)",
          borderRadius: "6px",
          padding: "2rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--ff-sans)",
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold2)",
              marginBottom: "0.5rem",
            }}
          >
            Are you a wedding supplier?
          </div>
          <div
            style={{
              fontFamily: "var(--ff-serif)",
              fontSize: "1.3rem",
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Get listed when we launch <em>vendor profiles</em>
          </div>
        </div>
        <a
          href="mailto:hello@capevows.co.za?subject=Vendor Listing Enquiry"
          style={{ textDecoration: "none" }}
          onClick={() => track("email_cta_click", { button: "get_in_touch" })}
        >
          <button className="btn btn-primary">Get in Touch</button>
        </a>
      </div>
    </section>
  );
}

function SavedPage({ allVenues, navigate, saved, onToggleSave }) {
  const savedVenues = allVenues.filter((v) => saved.includes(v.slug));
  return (
    <div className="saved-page">
      <button
        className="venue-back"
        onClick={() => navigate("/venues")}
        aria-label="Back to venues"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M9 2L4 7L9 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        All Venues
      </button>
      <div className="section-eyebrow" style={{ marginBottom: "0.5rem" }}>
        Your Shortlist
      </div>
      <h1 className="section-title" style={{ marginBottom: "0.5rem" }}>
        Saved <em>Venues</em>
      </h1>
      {savedVenues.length === 0 ? (
        <div className="saved-empty">
          <div
            style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.25 }}
          >
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
          <button
            className="btn btn-primary"
            onClick={() => navigate("/venues")}
          >
            Browse Venues
          </button>
        </div>
      ) : (
        <>
          <p
            style={{
              fontFamily: "var(--ff-body)",
              fontSize: "1rem",
              color: "var(--muted)",
              marginBottom: "2.5rem",
            }}
          >
            {savedVenues.length} venue{savedVenues.length !== 1 ? "s" : ""}{" "}
            saved — tap a card to view details, or ♡ to remove.
          </p>
          <div className="cards-grid">
            {savedVenues.map((v) => (
              <VenueCard
                key={v.id}
                venue={v}
                navigate={navigate}
                isSaved={true}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AdminPage({
  onAddVenue,
  onAddVendor,
  extraVenues,
  extraVendors,
  navigate,
}) {
  const [tab, setTab] = useState("research");
  return (
    <section style={{ paddingTop: "3rem" }}>
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Site Management</div>
          <h1 className="section-title">
            Admin <em>Panel</em>
          </h1>
          <p className="section-desc">
            Add and manage venues and vendors using the AI Research Tool.
          </p>
        </div>
      </div>
      <div className="notice">
        💡 Paste any venue or vendor URL and Claude will research and extract
        the key details for you to review and save.
      </div>
      <div className="tabs">
        <button
          className={`tab${tab === "research" ? " active" : ""}`}
          onClick={() => setTab("research")}
        >
          AI Research Tool
        </button>
        <button
          className={`tab${tab === "added" ? " active" : ""}`}
          onClick={() => setTab("added")}
        >
          Added Listings ({extraVenues.length + extraVendors.length})
        </button>
      </div>
      {tab === "research" && (
        <ResearchPanel onAddVenue={onAddVenue} onAddVendor={onAddVendor} />
      )}
      {tab === "added" && (
        <div>
          {extraVenues.length === 0 && extraVendors.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📋</div>
              <div className="empty-title">No listings added yet</div>
              <div className="empty-sub">
                Use the AI Research Tool to add new venues and vendors
              </div>
            </div>
          ) : (
            <>
              {extraVenues.length > 0 && (
                <>
                  <div
                    style={{
                      fontFamily: "var(--ff-serif)",
                      fontSize: "1.3rem",
                      color: "var(--green)",
                      marginBottom: "1rem",
                    }}
                  >
                    Added Venues
                  </div>
                  <div className="cards-grid" style={{ marginBottom: "2rem" }}>
                    {extraVenues.map((v) => (
                      <VenueCard key={v.id} venue={v} navigate={navigate} />
                    ))}
                  </div>
                </>
              )}
              {extraVendors.length > 0 && (
                <>
                  <div
                    style={{
                      fontFamily: "var(--ff-serif)",
                      fontSize: "1.3rem",
                      color: "var(--green)",
                      marginBottom: "1rem",
                    }}
                  >
                    Added Vendors
                  </div>
                  <div className="cards-grid">
                    {extraVendors.map((v) => (
                      <VendorCard key={v.id} vendor={v} onClick={() => {}} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

function NotFound({ navigate }) {
  return (
    <div className="empty" style={{ padding: "8rem 2rem" }}>
      <div className="empty-icon">🌿</div>
      <div className="empty-title">Venue not found</div>
      <div className="empty-sub" style={{ marginBottom: "2rem" }}>
        This page doesn't exist or the venue may have moved.
      </div>
      <button className="btn btn-primary" onClick={() => navigate("/venues")}>
        Browse All Venues
      </button>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const { path, navigate } = useRouter();
  const [extraVenues, setExtraVenues] = useState([]);
  const [extraVendors, setExtraVendors] = useState([]);
  const [showCookieBanner, setShowCookieBanner] = useState(
    () => !localStorage.getItem("cv_cookies_accepted"),
  );
  const { saved, toggle: toggleSave } = useFavourites();

  // Global schema — www removed for canonical consistency
  useEffect(() => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "global-jsonld";
    s.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Cape Vows",
        url: "https://capevows.co.za",
        logo: "https://capevows.co.za/og-image.jpg",
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@capevows.co.za",
          contactType: "customer support",
        },
        sameAs: [
          "https://www.instagram.com/capevows",
          "https://www.pinterest.com/capevows",
        ],
        description:
          "Cape Vows is South Africa's Western Cape wedding venue directory — 24 hand-verified venues across Franschhoek, Stellenbosch, Cape Town, Constantia and the Overberg.",
        areaServed: {
          "@type": "State",
          name: "Western Cape",
          containedInPlace: { "@type": "Country", name: "South Africa" },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Cape Vows",
        url: "https://capevows.co.za",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://capevows.co.za/venues?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ]);
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById("global-jsonld");
      if (el) el.remove();
    };
  }, []);

  const allVenues = [...VENUES, ...extraVenues];
  const addVenue = (v) =>
    setExtraVenues((e) => [...e, { ...v, slug: toSlug(v.name) }]);
  const addVendor = (v) => setExtraVendors((e) => [...e, v]);
  const acceptCookies = () => {
    localStorage.setItem("cv_cookies_accepted", "true");
    setShowCookieBanner(false);
  };

  const venueSlugMatch = path.match(/^\/venues\/([^/]+)$/);
  const blogSlugMatch = path.match(/^\/blog\/([^/]+)$/);
  const activeVenue = venueSlugMatch
    ? allVenues.find((v) => v.slug === venueSlugMatch[1])
    : null;
  const activePost = blogSlugMatch
    ? POSTS.find((p) => p.slug === blogSlugMatch[1])
    : null;
  const currentPage =
    path === "/"
      ? "home"
      : path === "/venues"
        ? "venues"
        : path === "/venues/saved"
          ? "saved"
          : path === "/vendors"
            ? "vendors"
            : path === "/blog"
              ? "blog"
              : path === "/admin"
                ? "admin"
                : venueSlugMatch
                  ? "venue"
                  : blogSlugMatch
                    ? "blogpost"
                    : "home";

  return (
    <div>
      <nav>
        <a
          className="nav-logo"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Cape <span>Vows</span>
        </a>
        <div className="nav-links">
          <a
            className={`nav-link nav-link-home${currentPage === "home" ? " active" : ""}`}
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Home
          </a>
          <a
            className={`nav-link${currentPage === "venues" || currentPage === "venue" ? " active" : ""}`}
            href="/venues"
            onClick={(e) => {
              e.preventDefault();
              navigate("/venues");
            }}
          >
            Venues
          </a>
          <a
            className={`nav-link${currentPage === "vendors" ? " active" : ""}`}
            href="/vendors"
            onClick={(e) => {
              e.preventDefault();
              navigate("/vendors");
            }}
          >
            Vendors
          </a>
          <a
            className={`nav-link${currentPage === "blog" || currentPage === "blogpost" ? " active" : ""}`}
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              navigate("/blog");
            }}
          >
            Blog
          </a>
          <a
            className={`nav-link${currentPage === "saved" ? " active" : ""}`}
            href="/venues/saved"
            onClick={(e) => {
              e.preventDefault();
              navigate("/venues/saved");
            }}
            title="Saved venues"
            style={{ gap: "2px" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill={saved.length > 0 ? "var(--gold)" : "none"}
              style={{ transition: "fill 0.2s" }}
            >
              <path
                d="M7 12S1.5 8.5 1.5 4.5a3 3 0 015.5-1.67A3 3 0 0112.5 4.5C12.5 8.5 7 12 7 12z"
                stroke={saved.length > 0 ? "var(--gold)" : "currentColor"}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {saved.length > 0 && (
              <span className="nav-badge">{saved.length}</span>
            )}
          </a>
        </div>
      </nav>

      {currentPage === "home" && (
        <HomePage navigate={navigate} allVenues={allVenues} />
      )}
      {currentPage === "venues" && (
        <VenuesPage
          allVenues={allVenues}
          navigate={navigate}
          saved={saved}
          onToggleSave={toggleSave}
        />
      )}
      {currentPage === "saved" && (
        <SavedPage
          allVenues={allVenues}
          navigate={navigate}
          saved={saved}
          onToggleSave={toggleSave}
        />
      )}
      {currentPage === "vendors" && <VendorsPage />}
      {currentPage === "blog" && <BlogPage navigate={navigate} />}
      {currentPage === "blogpost" && activePost && (
        <BlogPostPage post={activePost} navigate={navigate} />
      )}
      {currentPage === "blogpost" && !activePost && (
        <NotFound navigate={navigate} />
      )}
      {currentPage === "admin" && (
        <AdminPage
          onAddVenue={addVenue}
          onAddVendor={addVendor}
          extraVenues={extraVenues}
          extraVendors={extraVendors}
          navigate={navigate}
        />
      )}
      {currentPage === "venue" && activeVenue && (
        <VenuePage
          venue={activeVenue}
          navigate={navigate}
          allVenues={allVenues}
          isSaved={saved.includes(activeVenue.slug)}
          onToggleSave={toggleSave}
        />
      )}
      {currentPage === "venue" && !activeVenue && (
        <NotFound navigate={navigate} />
      )}

      <footer>
        <div className="footer-logo">Cape Vows</div>
        <div className="footer-sub">
          The Western Cape Wedding Directory · South Africa
        </div>
        <div className="footer-nav">
          <button className="footer-nav-link" onClick={() => navigate("/venues")}>Venues</button>
          <button className="footer-nav-link" onClick={() => navigate("/vendors")}>Vendors</button>
          <button className="footer-nav-link" onClick={() => navigate("/blog")}>Blog</button>
          <a href="/privacy-policy.html" className="footer-nav-link">Privacy Policy</a>
          <a href="mailto:hello@capevows.co.za" className="footer-nav-link">Contact</a>
        </div>
      </footer>

      {showCookieBanner && (
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
              className="btn btn-primary"
              onClick={acceptCookies}
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.68rem" }}
            >
              Got it
            </button>
            <button
              onClick={acceptCookies}
              style={{
                fontFamily: "var(--ff-sans)",
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "transparent",
                color: "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
