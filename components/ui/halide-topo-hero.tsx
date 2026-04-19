"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Search } from "lucide-react";

// ── Projects data for search ──────────────────────────────────────────────────
const projectsData = [
  { title: "NEXT STATION",     category: "SPATIAL SYSTEMS",    keywords: ["urban", "mobility", "metro", "barcelona", "gas station", "adaptive reuse"], href: "/projects/next-station" },
  { title: "WHITE LEAF",       category: "SPATIAL SYSTEMS",    keywords: ["school", "fine arts", "theater", "heraklion", "campus", "coastal"], href: "/projects/white-leaf" },
  { title: "LITHOS",           category: "SPATIAL SYSTEMS",    keywords: ["barn", "restoration", "stone", "wood", "vernacular", "kefalonia"], href: "/projects/lithos" },
  { title: "OH",               category: "SPATIAL SYSTEMS",    keywords: ["housing", "minimal", "concrete", "form", "residential"], href: "/projects/oh" },
  { title: "SPATIAL SYSTEMS",  category: "CATEGORY",           keywords: ["architecture", "interiors", "design", "projects"], href: "/projects/spatial-systems" },
  { title: "ABOUT",            category: "PAGE",               keywords: ["bio", "skills", "experience", "profile"], href: "/about" },
  { title: "CONTACT",          category: "PAGE",               keywords: ["email", "hire", "collaboration", "photography", "instagram"], href: "/contact" },
];

// Portfolio images P1–P24
const PORTFOLIO_IMAGES = Array.from({ length: 24 }, (_, i) => `/projects/Old_Portfolio/Images/P${i + 1}.jpg`);

// Load Three.js scene client-side only (no SSR)
const Hero3DScene = dynamic(() => import("./hero-3d-scene"), { ssr: false });

export const HalideTopoHero = () => {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardElemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Search filter
  const searchResults = searchQuery.trim().length > 0
    ? projectsData.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // Direct-DOM scroll handler — no re-renders, smooth fade between cards
  const handleCarouselScroll = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;
    const s = container.scrollTop;
    const vh = container.clientHeight;
    const fadeRange = vh * 0.3;
    cardElemsRef.current.forEach((el, i) => {
      if (!el) return;
      let opacity: number;
      if (i === 0) {
        // First card: fade out as second card fades in
        const exit = vh - fadeRange;
        opacity = s < exit ? 1 : Math.max(0, 1 - (s - exit) / fadeRange);
      } else {
        const entry = i * vh;
        if (s < entry - fadeRange) opacity = 0;
        else if (s < entry) opacity = (s - (entry - fadeRange)) / fadeRange;
        else if (s < entry + vh - fadeRange) opacity = 1;
        else opacity = Math.max(0, 1 - (s - (entry + vh - fadeRange)) / fadeRange);
      }
      el.style.opacity = String(Math.min(1, Math.max(0, opacity)));
    });
  }, []);

  // Wire up scroll listener when carousel opens; reset to top
  useEffect(() => {
    if (!carouselOpen) return;
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTop = 0;
    // Reset all opacities: first card visible, rest hidden
    cardElemsRef.current.forEach((card, i) => {
      if (card) card.style.opacity = i === 0 ? "1" : "0";
    });
    el.addEventListener("scroll", handleCarouselScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleCarouselScroll);
  }, [carouselOpen, handleCarouselScroll]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCarouselOpen(false);
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  return (
    <>
      {/* SVG Grain Filter */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <defs>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* Fixed grain overlay */}
      <div className="halide-grain" style={{ filter: "url(#grain)" }} />

      {/* Fixed top navigation */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(1.2rem, 3vw, 2rem) clamp(1.5rem, 4vw, 4rem)",
        background: "linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, transparent 100%)",
      }}>
        {/* Brand logo */}
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Nikolaos Kalaitzidis logo" style={{ height: "clamp(44px, 5vw, 64px)", width: "auto", filter: "invert(1) brightness(2)", mixBlendMode: "screen" }} />
          <span style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(0.5rem, 0.9vw, 0.72rem)", letterSpacing: "0.08em", color: "var(--silver)", whiteSpace: "nowrap" }}>
            NIKOLAOS KALAITZIDIS
          </span>
        </a>

        {/* Right side — links + icons */}
        <div style={{ display: "flex", gap: "clamp(0.8rem, 2vw, 2rem)", alignItems: "center" }}>
          {/* Text links — hidden on mobile */}
          <div className="nav-links" style={{ display: "flex", gap: "clamp(1rem, 2.5vw, 2.5rem)", alignItems: "center" }}>
            {[
              { label: "WORK",    href: "#projects", isLink: false },
              { label: "ABOUT",   href: "/about",    isLink: true  },
              { label: "CONTACT", href: "/contact",  isLink: true  },
            ].map(({ label, href, isLink }) =>
              isLink ? (
                <Link key={label} href={href} style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(224,224,224,0.65)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(224,224,224,0.65)"; }}>
                  {label}
                </Link>
              ) : (
                <a key={label} href={href} style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(224,224,224,0.65)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(224,224,224,0.65)"; }}>
                  {label}
                </a>
              )
            )}
          </div>

          {/* Search icon */}
          <button onClick={() => { setSearchOpen(v => !v); setMenuOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(224,224,224,0.6)", padding: "4px", display: "flex", alignItems: "center", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = searchOpen ? "var(--accent)" : "rgba(224,224,224,0.6)")}>
            <Search size={16} />
          </button>

          {/* Hamburger icon */}
          <button onClick={() => { setMenuOpen(v => !v); setSearchOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(224,224,224,0.6)", padding: "4px", display: "flex", alignItems: "center", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = menuOpen ? "var(--accent)" : "rgba(224,224,224,0.6)")}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ── Hamburger dropdown menu ──────────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 45,
          background: "rgba(6,6,6,0.97)", backdropFilter: "blur(12px)",
          display: "flex", flexDirection: "column",
          padding: "clamp(6rem,10vw,8rem) clamp(1.5rem,6vw,6rem) 3rem",
          overflowY: "auto",
          animation: "menuSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <style>{`@keyframes menuSlideIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }`}</style>
          <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.54rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>NAVIGATE</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { label: "WORK",        href: "#projects", isLink: false },
              { label: "ABOUT",       href: "/about",    isLink: true  },
              { label: "CONTACT",     href: "/contact",  isLink: true  },
            ].map(({ label, href, isLink }) =>
              isLink ? (
                <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{ fontFamily: "Syncopate,sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem,5vw,4rem)", letterSpacing: "-0.02em", color: "rgba(224,224,224,0.8)", textDecoration: "none", padding: "0.6rem 0", borderBottom: "1px solid rgba(224,224,224,0.06)", transition: "color 0.2s, padding-left 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0.5rem"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(224,224,224,0.8)"; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0"; }}>
                  {label}
                </Link>
              ) : (
                <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ fontFamily: "Syncopate,sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem,5vw,4rem)", letterSpacing: "-0.02em", color: "rgba(224,224,224,0.8)", textDecoration: "none", padding: "0.6rem 0", borderBottom: "1px solid rgba(224,224,224,0.06)", transition: "color 0.2s, padding-left 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0.5rem"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(224,224,224,0.8)"; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0"; }}>
                  {label}
                </a>
              )
            )}
          </div>
          <div style={{ marginTop: "3rem" }}>
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.3)", marginBottom: "1.5rem" }}>PROJECTS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {projectsData.filter(p => p.category !== "PAGE").map(p => (
                <Link key={p.title} href={p.href} onClick={() => setMenuOpen(false)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", padding: "0.6rem 0", borderBottom: "1px solid rgba(224,224,224,0.04)", gap: "1rem" }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.paddingLeft = "0.4rem"; (el.querySelector(".proj-title") as HTMLElement | null)?.style && ((el.querySelector(".proj-title") as HTMLElement).style.color = "var(--accent)"); }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.paddingLeft = "0"; (el.querySelector(".proj-title") as HTMLElement | null)?.style && ((el.querySelector(".proj-title") as HTMLElement).style.color = "rgba(224,224,224,0.7)"); }}>
                  <span className="proj-title" style={{ fontFamily: "Syncopate,sans-serif", fontSize: "clamp(0.65rem,1.2vw,0.85rem)", letterSpacing: "0.04em", color: "rgba(224,224,224,0.7)", transition: "color 0.2s" }}>{p.title}</span>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.46rem", letterSpacing: "0.14em", color: "rgba(224,224,224,0.25)" }}>{p.category}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Search overlay ───────────────────────────────────────────────────── */}
      {searchOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 46,
          background: "rgba(6,6,6,0.95)", backdropFilter: "blur(16px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "clamp(6rem,10vw,8rem) clamp(1.5rem,6vw,6rem) 3rem",
          animation: "menuSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* Search input */}
          <div style={{ width: "100%", maxWidth: "680px", position: "relative", marginBottom: "3rem" }}>
            <Search size={16} style={{ position: "absolute", left: "0", top: "50%", transform: "translateY(-50%)", color: "rgba(224,224,224,0.3)", pointerEvents: "none" }} />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH PROJECTS, PAGES..."
              style={{
                width: "100%", background: "none",
                border: "none", borderBottom: "1px solid rgba(224,224,224,0.2)",
                padding: "1rem 1rem 1rem 2rem",
                fontFamily: "Syncopate,sans-serif", fontSize: "clamp(1rem,2.5vw,1.5rem)",
                letterSpacing: "0.04em", color: "var(--silver)",
                outline: "none",
              }}
            />
          </div>
          {/* Results */}
          {searchQuery.trim().length > 0 && (
            <div style={{ width: "100%", maxWidth: "680px" }}>
              {searchResults.length === 0 ? (
                <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.18em" }}>NO RESULTS FOUND</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {searchResults.map(p => (
                    <Link key={p.title} href={p.href} onClick={() => setSearchOpen(false)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 0", borderBottom: "1px solid rgba(224,224,224,0.06)", textDecoration: "none", gap: "1rem", transition: "padding-left 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.paddingLeft = "0.5rem")}
                      onMouseLeave={e => (e.currentTarget.style.paddingLeft = "0")}>
                      <div>
                        <div style={{ fontFamily: "Syncopate,sans-serif", fontSize: "clamp(0.75rem,1.5vw,1rem)", letterSpacing: "0.04em", color: "var(--silver)", marginBottom: "0.3rem" }}>{p.title}</div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.48rem", letterSpacing: "0.14em", color: "rgba(224,224,224,0.3)" }}>{p.category}</div>
                      </div>
                      <span style={{ color: "var(--accent)", fontSize: "1rem" }}>→</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {searchQuery.trim().length === 0 && (
            <div style={{ width: "100%", maxWidth: "680px" }}>
              <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.18em", marginBottom: "2rem" }}>QUICK ACCESS</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                {projectsData.map(p => (
                  <Link key={p.title} href={p.href} onClick={() => setSearchOpen(false)} style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", letterSpacing: "0.14em", color: "rgba(224,224,224,0.5)", border: "1px solid rgba(224,224,224,0.1)", padding: "0.4rem 0.9rem", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,60,0,0.4)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(224,224,224,0.5)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(224,224,224,0.1)"; }}>
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero section — full viewport */}
      <section
        className={cn("relative")}
        style={{ height: "100vh", backgroundColor: "var(--bg)", overflow: "hidden" }}
      >
        {/* ── Interactive 3D scene (replaces old CSS layers) ── */}
        <Hero3DScene />

        {/* Hero content overlay — scoped to section */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "clamp(1.5rem, 4vw, 4rem)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto 1fr auto",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {/* Spacer for nav */}
          <div style={{ gridColumn: "1 / -1", height: "clamp(3rem, 6vw, 5rem)" }} />

          {/* Empty middle — 3D model fills this space */}
          <div style={{ gridColumn: "1 / -1" }} />

          {/* Bottom row */}
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.72rem",
                color: "rgba(224,224,224,0.5)",
                letterSpacing: "0.12em",
                lineHeight: 1.8,
              }}
            >
              <p style={{ color: "var(--accent)" }}>[ ARCHITECTURAL STUDIO ]</p>
              <p>WE DESIGN YOUR DREAMS</p>
            </div>
            <a
              href="#projects"
              className="cta-button"
              style={{ pointerEvents: "auto" }}
              onClick={(e) => { e.preventDefault(); setCarouselOpen(true); }}
            >
              VIEW PORTFOLIO
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-hint" />

        {/* Gradient fade into projects section below — eliminates harsh divider */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "14rem",
          background: "linear-gradient(to bottom, transparent 0%, rgba(8,8,8,0.7) 60%, #080808 100%)",
          zIndex: 8,
          pointerEvents: "none",
        }} />
      </section>

      {/* ── Portfolio Image Carousel Overlay ──────────────────────────────── */}
      {carouselOpen && (
        <>
          <style>{`
            @keyframes carouselFadeIn { from { opacity: 0; } to { opacity: 1; } }
          `}</style>

          {/* Scrollable full-screen overlay — sticky cards work inside a scroll container */}
          <div
            ref={carouselRef}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 900,
              overflowY: "scroll",
              background: "#050505",
              animation: "carouselFadeIn 0.4s ease",
            }}
          >
            {/* Fixed UI chrome — close button + label */}
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 910, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 2rem", background: "linear-gradient(to bottom, rgba(5,5,5,0.95) 0%, transparent 100%)", pointerEvents: "none" }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.22em", color: "rgba(224,224,224,0.3)" }}>
                KALAITZIDIS NIKOLAOS — PORTFOLIO 2025
              </span>
              <button
                onClick={() => setCarouselOpen(false)}
                style={{
                  pointerEvents: "auto",
                  background: "none",
                  border: "1px solid rgba(224,224,224,0.18)",
                  color: "rgba(224,224,224,0.5)",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.56rem",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  padding: "0.35rem 0.8rem",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,60,0,0.6)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(224,224,224,0.18)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(224,224,224,0.5)"; }}
              >
                CLOSE ×
              </button>
            </div>

            {/* Sticky-scroll image stack */}
            <div style={{ minHeight: `${PORTFOLIO_IMAGES.length * 100}vh` }}>
              {PORTFOLIO_IMAGES.map((src, i) => (
                <div
                  key={i}
                  ref={el => { cardElemsRef.current[i] = el; }}
                  style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    zIndex: i + 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#050505",
                    opacity: i === 0 ? 1 : 0,
                    transition: "opacity 0.05s linear",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Portfolio page ${i + 1}`}
                    style={{
                      maxWidth: "92vw",
                      maxHeight: "88vh",
                      objectFit: "contain",
                      display: "block",
                      boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
                    }}
                  />
                  {/* Page counter */}
                  <div style={{ position: "absolute", bottom: "1.8rem", left: "50%", transform: "translateX(-50%)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.22em", color: "rgba(224,224,224,0.22)" }}>
                    {String(i + 1).padStart(2, "0")} / {String(PORTFOLIO_IMAGES.length).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll hint at bottom of first viewport */}
            <div style={{ position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", zIndex: 910, pointerEvents: "none" }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.44rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.18)" }}>SCROLL TO BROWSE · ESC TO EXIT</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HalideTopoHero;
