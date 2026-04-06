"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const skills = [
  { name: "RHINOCEROS 3D",         level: 95 },
  { name: "GRASSHOPPER",           level: 88 },
  { name: "AUTOCAD",               level: 90 },
  { name: "REVIT",                 level: 72 },
  { name: "ADOBE CREATIVE SUITE",  level: 82 },
  { name: "3DS MAX / V-RAY",       level: 68 },
  { name: "UNREAL ENGINE",         level: 60 },
  { name: "DRONE OPERATION",       level: 85 },
];

export default function AboutPage() {
  const skillsRef  = useRef<HTMLDivElement>(null);
  const [skillsOn, setSkillsOn] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setMounted(true);
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSkillsOn(true); },
      { threshold: 0.15 }
    );
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .about-page {
          opacity: 0;
          transition: opacity 0.7s ease;
        }
        .about-page.ready {
          opacity: 1;
        }
        @keyframes breathe {
          0%,100% { transform: scale(1);    opacity: 0.8; }
          50%      { transform: scale(1.04); opacity: 1;   }
        }
        @keyframes flow {
          0%,100% { transform: scaleY(0); transform-origin: top; }
          50%      { transform: scaleY(1); transform-origin: top; }
          51%      { transform: scaleY(1); transform-origin: bottom; }
        }
        .about-nav-link {
          font-family: Syncopate, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          color: rgba(224,224,224,0.65);
          text-decoration: none;
          transition: color 0.2s;
        }
        .about-nav-link:hover { color: var(--accent); }
        .about-nav-link.active { color: var(--accent); }
        .bio-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
        }
        .pursuits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .ig-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
        }
        @media (max-width: 900px) {
          .bio-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .ig-grid  { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .pursuits-grid { grid-template-columns: 1fr !important; }
          .ig-grid       { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <main
        className={`about-page${mounted ? " ready" : ""}`}
        style={{ background: "var(--bg)", color: "var(--silver)", minHeight: "100vh" }}
      >

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,4rem)",
          background: "linear-gradient(to bottom,rgba(10,10,10,0.92) 0%,transparent 100%)",
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="NK" style={{ height: "clamp(44px,5vw,64px)", width: "auto", filter: "invert(1) brightness(2)", mixBlendMode: "screen" }} />
            <span style={{ fontFamily: "Syncopate,sans-serif", fontWeight: 700, fontSize: "clamp(0.5rem,0.9vw,0.72rem)", letterSpacing: "0.08em", color: "var(--silver)", whiteSpace: "nowrap" }}>
              NIKOLAOS KALAITZIDIS
            </span>
          </Link>
          <div style={{ display: "flex", gap: "clamp(1rem,2.5vw,2.5rem)", alignItems: "center" }}>
            <Link href="/"        className="about-nav-link">WORK</Link>
            <Link href="/about"   className="about-nav-link active">ABOUT</Link>
            <Link href="/#contact" className="about-nav-link">CONTACT</Link>
            <a href="#" style={{
              border: "1px solid rgba(224,224,224,0.4)", color: "var(--silver)",
              padding: "0.55rem 1.2rem", textDecoration: "none",
              fontFamily: "Syncopate,sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em",
            }}>BOOK APPOINTMENT</a>
          </div>
        </nav>

        {/* ── Logo hero ───────────────────────────────────────────────────── */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Subtle radial glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,60,0,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Nikolaos Kalaitzidis"
            style={{
              width: "clamp(100px,16vw,220px)", height: "auto",
              filter: "invert(1) brightness(2)",
              animation: "breathe 5s ease-in-out infinite",
            }}
          />
          <p style={{
            fontFamily: "Share Tech Mono,monospace", fontSize: "0.62rem",
            letterSpacing: "0.28em", color: "rgba(224,224,224,0.28)",
            marginTop: "2.5rem", textTransform: "uppercase",
          }}>
            ARCHITECTURAL STUDIO
          </p>

          {/* Scroll cue */}
          <div style={{
            position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem",
          }}>
            <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.52rem", letterSpacing: "0.22em", color: "rgba(224,224,224,0.2)" }}>SCROLL</span>
            <div style={{ width: "1px", height: "50px", background: "linear-gradient(to bottom,var(--silver),transparent)", animation: "flow 2s infinite ease-in-out" }} />
          </div>
        </section>

        {/* ── Bio ─────────────────────────────────────────────────────────── */}
        <section style={{
          padding: "clamp(5rem,10vw,10rem) clamp(1.5rem,6vw,6rem)",
          maxWidth: "1400px", margin: "0 auto",
        }}>
          <div className="bio-grid">
            {/* Photo */}
            <div style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile.webp"
                alt="Nikolaos Kalaitzidis"
                style={{
                  width: "100%", maxWidth: "480px", display: "block",
                  filter: "grayscale(0.1) contrast(1.05)",
                }}
              />
              {/* Accent corner */}
              <div style={{
                position: "absolute", bottom: 0, left: 0,
                width: "40%", height: "3px",
                background: "var(--accent)",
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0,
                width: "3px", height: "30%",
                background: "var(--accent)",
              }} />
            </div>

            {/* Text */}
            <div>
              <p style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1.4rem" }}>
                001 / ABOUT ME
              </p>
              <h1 style={{
                fontFamily: "Syncopate,sans-serif", fontWeight: 700,
                fontSize: "clamp(1.8rem,3.5vw,3rem)", lineHeight: 0.95,
                letterSpacing: "-0.03em", marginBottom: "2.5rem", color: "var(--silver)",
              }}>
                NIKOLAOS<br />KALAITZIDIS
              </h1>
              <p style={{
                fontFamily: "Share Tech Mono,monospace", fontSize: "0.82rem",
                lineHeight: 1.95, color: "rgba(224,224,224,0.65)", marginBottom: "1.4rem",
              }}>
                Architect and computational designer working at the intersection of digital fabrication, parametric thinking, and spatial experience. Every project begins as a question — about material, light, and how a building negotiates with its context.
              </p>
              <p style={{
                fontFamily: "Share Tech Mono,monospace", fontSize: "0.82rem",
                lineHeight: 1.95, color: "rgba(224,224,224,0.42)",
              }}>
                My practice spans architecture, urban design, and experimental installations, always guided by precision, curiosity, and a deep respect for the intelligence embedded in site.
              </p>

              {/* Stats */}
              <div style={{ marginTop: "3.5rem", display: "flex", gap: "3.5rem", flexWrap: "wrap" }}>
                {[["5+", "YEARS EXP."], ["30+", "PROJECTS"], ["GR / EU", "BASED"]].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: "Syncopate,sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "var(--silver)", letterSpacing: "-0.02em" }}>{val}</div>
                    <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.3)", marginTop: "0.4rem" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Skills ──────────────────────────────────────────────────────── */}
        <section
          ref={skillsRef}
          style={{
            padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)",
            borderTop: "1px solid rgba(224,224,224,0.06)",
            maxWidth: "1400px", margin: "0 auto",
          }}
        >
          <p style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1.2rem" }}>
            002 / EXPERTISE
          </p>
          <h2 style={{
            fontFamily: "Syncopate,sans-serif", fontWeight: 700,
            fontSize: "clamp(1.5rem,3vw,2.5rem)", letterSpacing: "-0.03em",
            marginBottom: "4rem", color: "var(--silver)", lineHeight: 0.95,
          }}>
            SKILLS &amp;<br />TOOLS
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}>
            {skills.map(({ name, level }, i) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                  <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.68rem", letterSpacing: "0.15em", color: "var(--silver)" }}>{name}</span>
                  <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(224,224,224,0.3)" }}>{level}%</span>
                </div>
                {/* Track */}
                <div style={{ height: "2px", background: "rgba(224,224,224,0.07)", position: "relative", overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to right, var(--accent), rgba(255,60,0,0.35))",
                    transformOrigin: "left center",
                    transform: `scaleX(${skillsOn ? level / 100 : 0})`,
                    transition: `transform 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Other pursuits ───────────────────────────────────────────────── */}
        <section style={{
          padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)",
          borderTop: "1px solid rgba(224,224,224,0.06)",
        }}>
          <p style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1.2rem" }}>
            003 / BEYOND ARCHITECTURE
          </p>
          <h2 style={{
            fontFamily: "Syncopate,sans-serif", fontWeight: 700,
            fontSize: "clamp(1.5rem,3vw,2.5rem)", letterSpacing: "-0.03em",
            marginBottom: "4rem", color: "var(--silver)", lineHeight: 0.95,
          }}>
            OTHER<br />PURSUITS
          </h2>

          {[
            { label: "PHOTOGRAPHY",       tag: "ANALOG / DIGITAL"   },
            { label: "DRONE VIDEOGRAPHY", tag: "AERIAL / CINEMATIC" },
          ].map(({ label, tag }) => (
            <div key={label} style={{ marginBottom: "4.5rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem", marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: "Syncopate,sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "var(--silver)", letterSpacing: "0.06em" }}>{label}</span>
                <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.58rem", letterSpacing: "0.14em", color: "rgba(224,224,224,0.28)" }}>{tag}</span>
              </div>
              <div className="pursuits-grid">
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{
                    aspectRatio: "4/3",
                    background: "#0d0d0d",
                    border: "1px solid rgba(224,224,224,0.07)",
                    overflow: "hidden",
                    position: "relative",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://placehold.co/600x450/0d0d0d/1a1a1a"
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.55rem", letterSpacing: "0.18em", color: "rgba(224,224,224,0.2)" }}>
                        COMING SOON
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── Instagram placeholder banner ─────────────────────────────────── */}
        <section style={{
          borderTop: "1px solid rgba(224,224,224,0.06)",
          background: "#080808",
          padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,6rem)",
        }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.8rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="var(--accent)" stroke="none"/>
              </svg>
              <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--silver)" }}>
                @NIKOLAOSKALAITZIDIS
              </span>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "Syncopate,sans-serif", fontSize: "0.55rem", letterSpacing: "0.14em",
                color: "var(--accent)", textDecoration: "none",
                border: "1px solid rgba(255,60,0,0.35)", padding: "0.45rem 1rem",
                transition: "background 0.2s",
              }}
            >
              FOLLOW ↗
            </a>
          </div>

          {/* Placeholder grid */}
          <div className="ig-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                aspectRatio: "1/1", background: "#0d0d0d",
                border: "1px solid rgba(224,224,224,0.05)",
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://placehold.co/300x300/0d0d0d/141414" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(224,224,224,0.12)" strokeWidth="1.2">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="rgba(224,224,224,0.12)" stroke="none"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: "Share Tech Mono,monospace", fontSize: "0.55rem",
            letterSpacing: "0.14em", color: "rgba(224,224,224,0.18)",
            marginTop: "1.4rem", textAlign: "center",
          }}>
            [ LIVE INSTAGRAM FEED — COMING SOON ]
          </p>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer style={{
          padding: "2rem clamp(1.5rem,6vw,6rem)",
          borderTop: "1px solid rgba(224,224,224,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
        }}>
          <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.12em" }}>
            © {new Date().getFullYear()} NIKOLAOS KALAITZIDIS
          </span>
          <Link href="/" style={{ fontFamily: "Syncopate,sans-serif", fontSize: "0.55rem", letterSpacing: "0.12em", color: "var(--accent)", textDecoration: "none" }}>
            BACK TO HOME ↑
          </Link>
        </footer>

      </main>
    </>
  );
}
