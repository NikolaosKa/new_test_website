"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Load Three.js scene client-side only (no SSR)
const Hero3DScene = dynamic(() => import("./hero-3d-scene"), { ssr: false });

export const HalideTopoHero = () => {
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
          {["WORK", "ABOUT", "CONTACT"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontFamily: "Syncopate, sans-serif",
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                color: "rgba(224,224,224,0.65)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = "rgba(224,224,224,0.65)";
              }}
            >
              {link}
            </a>
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
            <a href="#projects" className="cta-button" style={{ pointerEvents: "auto" }}>
              VIEW PORTFOLIO
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-hint" />
      </section>
    </>
  );
};

export default HalideTopoHero;
