"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback } from "react";

// Portfolio images P1–P24
const PORTFOLIO_IMAGES = Array.from({ length: 24 }, (_, i) => `/projects/Old_Portfolio/Images/P${i + 1}.jpg`);

// Load Three.js scene client-side only (no SSR)
const Hero3DScene = dynamic(() => import("./hero-3d-scene"), { ssr: false });

export const HalideTopoHero = () => {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardElemsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCarouselOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(1.2rem, 3vw, 2rem) clamp(1.5rem, 4vw, 4rem)",
          background: "linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, transparent 100%)",
        }}
      >
        {/* Brand logo */}
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Nikolaos Kalaitzidis logo"
            style={{
              height: "clamp(44px, 5vw, 64px)",
              width: "auto",
              filter: "invert(1) brightness(2)",
              mixBlendMode: "screen",
            }}
          />
          <span
            style={{
              fontFamily: "Syncopate, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(0.5rem, 0.9vw, 0.72rem)",
              letterSpacing: "0.08em",
              color: "var(--silver)",
              whiteSpace: "nowrap",
            }}
          >
            NIKOLAOS KALAITZIDIS
          </span>
        </a>

        {/* Links */}
        <div style={{ display: "flex", gap: "clamp(1rem, 2.5vw, 2.5rem)", alignItems: "center" }}>
          {[
            { label: "WORK",    href: "#projects" },
            { label: "ABOUT",   href: "/about"    },
            { label: "CONTACT", href: "#contact"  },
          ].map(({ label, href }) => (
            label === "ABOUT" ? (
              <Link
                key={label}
                href={href}
                style={{
                  fontFamily: "Syncopate, sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.12em",
                  color: "rgba(224,224,224,0.65)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(224,224,224,0.65)"; }}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: "Syncopate, sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.12em",
                  color: "rgba(224,224,224,0.65)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = "rgba(224,224,224,0.65)"; }}
              >
                {label}
              </a>
            )
          ))}
          <a href="#" className="book-btn">
            BOOK APPOINTMENT
          </a>
        </div>
      </nav>

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
