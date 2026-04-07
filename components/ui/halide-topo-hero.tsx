"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const PDF_URL = "/projects/Old_Portfolio/Kalaitzidis%20Nikolaos%202025.pdf";

// Load Three.js scene client-side only (no SSR)
const Hero3DScene = dynamic(() => import("./hero-3d-scene"), { ssr: false });

export const HalideTopoHero = () => {
  const [pdfOpen, setPdfOpen] = useState(false);

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = pdfOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [pdfOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPdfOpen(false); };
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
              onClick={(e) => { e.preventDefault(); setPdfOpen(true); }}
            >
              VIEW PORTFOLIO
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-hint" />
      </section>

      {/* ── PDF Portfolio Overlay ─────────────────────────────────────────── */}
      {pdfOpen && (
        <>
          <style>{`
            @keyframes pdfFadeIn  { from { opacity:0; } to { opacity:1; } }
            @keyframes pdfSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
          `}</style>

          {/* Backdrop — click outside PDF to close */}
          <div
            onClick={() => setPdfOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 900,
              background: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              animation: "pdfFadeIn 0.35s ease",
            }}
          />

          {/* PDF frame — stops clicks from closing */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 901,
              width: "min(860px, 88vw)",
              height: "88vh",
              display: "flex",
              flexDirection: "column",
              animation: "pdfSlideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Top bar */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.6rem",
              paddingInline: "2px",
            }}>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                color: "rgba(224,224,224,0.35)",
              }}>
                KALAITZIDIS NIKOLAOS — PORTFOLIO 2025
              </span>
              <button
                onClick={() => setPdfOpen(false)}
                style={{
                  background: "none",
                  border: "1px solid rgba(224,224,224,0.2)",
                  color: "rgba(224,224,224,0.55)",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  padding: "0.3rem 0.75rem",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,60,0,0.6)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(224,224,224,0.2)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(224,224,224,0.55)";
                }}
              >
                CLOSE ×
              </button>
            </div>

            {/* PDF iframe */}
            <iframe
              src={`${PDF_URL}#view=FitH`}
              style={{
                flex: 1,
                border: "1px solid rgba(224,224,224,0.08)",
                background: "#0a0a0a",
              }}
              title="Portfolio PDF"
            />

            {/* Bottom hint */}
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.18em",
              color: "rgba(224,224,224,0.2)",
              textAlign: "center",
              marginTop: "0.5rem",
            }}>
              CLICK OUTSIDE TO CLOSE · SCROLL TO NAVIGATE PAGES · ESC TO EXIT
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default HalideTopoHero;
