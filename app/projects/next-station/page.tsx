"use client"

import Link from "next/link"
import { motion } from "motion/react"

// ── Asset paths ───────────────────────────────────────────────────────────────
const BASE     = "/projects/Project_01"
const B        = "Booklet_LS_SJ%5B1%5D_Page_"  // encoded [1]

const COVER    = `${BASE}/06_Cover_Images/Cover%20Page.png`

const RENDERS  = [
  `${BASE}/02_Renders/${B}48.jpg`,
  `${BASE}/02_Renders/${B}49.jpg`,
  `${BASE}/02_Renders/${B}64.jpg`,
  `${BASE}/02_Renders/${B}65.jpg`,
  `${BASE}/02_Renders/${B}78.jpg`,
  `${BASE}/02_Renders/${B}79.jpg`,
]

const GIF_FRAMES = [
  `${BASE}/04_Final_Gifs/${B}42.jpg`,
  `${BASE}/04_Final_Gifs/${B}43.jpg`,
  `${BASE}/04_Final_Gifs/${B}44.jpg`,
  `${BASE}/04_Final_Gifs/${B}45.jpg`,
]

const DRAWINGS = [
  `${BASE}/03_Drawings/${B}07.jpg`,
  `${BASE}/03_Drawings/${B}08.jpg`,
  `${BASE}/03_Drawings/${B}09.jpg`,
  `${BASE}/03_Drawings/${B}12.jpg`,
  `${BASE}/03_Drawings/${B}13.jpg`,
  `${BASE}/03_Drawings/${B}34.jpg`,
  `${BASE}/03_Drawings/${B}41.jpg`,
  `${BASE}/03_Drawings/${B}46.jpg`,
]

const DIAGRAMS = [
  `${BASE}/05_Diagrams/${B}30.jpg`,
  `${BASE}/05_Diagrams/${B}31.jpg`,
]

const MODEL = `${BASE}/01_Physical_Models/WhatsApp%20Image%202025-12-17%20at%2018.14.24_b54ad23b.jpg`

// ── Abstract text ─────────────────────────────────────────────────────────────
const ABSTRACT = `It is rare for a city to lose a vast system of buildings and land. However, today in 2025, in the midst of climate change and industrial shifts, it is possible to imagine a near-future scenario where the urban gasoline stations distributed across our cities steadily become obsolete and abandoned. In Catalonia, this phenomenon can already be observed.`

const ABSTRACT_2 = `Through multidisciplinary research methods focussing on oil leakage, soil contamination, urban policy, and material reuse, this project redesigned 3 gas stations in Barcelona while imagining future pathways for the network of 79 gas stations within the city.`

export default function NextStationPage() {
  return (
    <main style={{ background: "#050505", color: "var(--silver)", fontFamily: "'Share Tech Mono', monospace" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,4rem)",
        background: "linear-gradient(to bottom,rgba(5,5,5,0.95) 0%,transparent 100%)",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NK" style={{ height: "clamp(36px,4vw,52px)", width: "auto", filter: "invert(1) brightness(2)", mixBlendMode: "screen" }} />
        </Link>
        <Link href="/projects/spatial-systems"
          style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", color: "rgba(224,224,224,0.45)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(224,224,224,0.45)")}
        >← SPATIAL SYSTEMS</Link>
      </nav>

      {/* ── Hero — full viewport cover image ────────────────────────────────── */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={COVER}
          alt="Next Station cover"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Gradient veil */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.5) 55%, rgba(5,5,5,0.97) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(5,5,5,0.55) 0%, transparent 60%)" }} />

        {/* Title block — bottom-left */}
        <div style={{ position: "absolute", bottom: "clamp(4rem,8vw,8rem)", left: "clamp(1.5rem,6vw,6rem)" }}>
          <motion.p
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.28em", color: "var(--accent)", marginBottom: "1.2rem" }}
          >01 / SPATIAL SYSTEMS</motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "Syncopate, sans-serif", fontWeight: 700,
              fontSize: "clamp(2.8rem,7vw,8rem)",
              lineHeight: 0.92, letterSpacing: "-0.02em", color: "#fff",
              marginBottom: "1.8rem",
            }}
          >NEXT<br />STATION</motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}
          >
            {[
              ["LOCATION", "BARCELONA, ES"],
              ["YEAR",     "2025"],
              ["TEAM",     "IAAC MAA01"],
              ["TYPE",     "ADAPTIVE REUSE"],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{ fontSize: "0.44rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", marginBottom: "0.3rem" }}>{label}</p>
                <p style={{ fontSize: "0.58rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.8)" }}>{val}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: "2rem", right: "clamp(1.5rem,4vw,4rem)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.44rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)", writingMode: "vertical-rl" }}>SCROLL</span>
          <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)", animation: "nsFlowDown 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ── Abstract ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(6rem,12vw,10rem) clamp(1.5rem,6vw,6rem)", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "6rem", alignItems: "start" }} className="ns-2col">
          <div>
            <p style={{ fontSize: "0.56rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1rem" }}>ABSTRACT</p>
            <h2 style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem,2.2vw,2rem)", lineHeight: 1, letterSpacing: "-0.02em", color: "var(--silver)" }}>
              THE CITY<br />AFTER<br />PETROL
            </h2>
          </div>
          <div>
            <p style={{ fontSize: "0.82rem", lineHeight: 2.0, color: "rgba(224,224,224,0.65)", marginBottom: "1.6rem" }}>{ABSTRACT}</p>
            <p style={{ fontSize: "0.82rem", lineHeight: 2.0, color: "rgba(224,224,224,0.4)" }}>{ABSTRACT_2}</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(224,224,224,0.06)", maxWidth: "1400px", margin: "0 auto" }} />

      {/* ── Renders ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,6rem)", maxWidth: "1400px", margin: "0 auto" }}>
        <p style={{ fontSize: "0.56rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>02 / RENDERS</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" }} className="ns-renders">
          {RENDERS.map((src, i) => (
            <div key={i} style={{
              aspectRatio: "16/10",
              overflow: "hidden",
              background: "#0a0a0a",
              ...(i === 0 ? { gridColumn: "1 / -1", aspectRatio: "21/9" } : {}),
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Render ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.03)"}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Process Animation (GIF simulation) ──────────────────────────────── */}
      <section style={{ padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,6rem)", maxWidth: "1400px", margin: "0 auto", borderTop: "1px solid rgba(224,224,224,0.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }} className="ns-2col">
          <div>
            <p style={{ fontSize: "0.56rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1rem" }}>03 / PROCESS</p>
            <h2 style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem,2.2vw,2rem)", lineHeight: 1, letterSpacing: "-0.02em", color: "var(--silver)", marginBottom: "2rem" }}>
              PHASES OF<br />TRANSFORMATION
            </h2>
            <p style={{ fontSize: "0.78rem", lineHeight: 1.95, color: "rgba(224,224,224,0.5)" }}>
              From abandonment through soil remediation to adaptive reuse — each gas station undergoes a multi-year transformation sequence. The animation cycles through the four key phases of the process.
            </p>
          </div>

          {/* Animated frame stack */}
          <div style={{ position: "relative", aspectRatio: "4/3", background: "#0a0a0a", overflow: "hidden" }}>
            {GIF_FRAMES.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Phase ${i + 1}`}
                style={{
                  position: i === 0 ? "relative" : "absolute",
                  inset: 0, width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                  animation: `nsGifFrame 6s ${i * 1.5}s infinite both`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Drawings ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,6rem)", maxWidth: "1400px", margin: "0 auto", borderTop: "1px solid rgba(224,224,224,0.06)" }}>
        <p style={{ fontSize: "0.56rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>04 / DRAWINGS & PLANS</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "3px" }} className="ns-drawings">
          {DRAWINGS.map((src, i) => (
            <div key={i} style={{
              aspectRatio: "4/3",
              overflow: "hidden",
              background: "#f5f4f0",
              // span 2 cols for first and fifth drawings
              ...(i === 0 || i === 4 ? { gridColumn: "span 2", aspectRatio: "16/9" } : {}),
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Drawing ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: "0.5rem", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.03)"}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Diagrams ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,6rem)", maxWidth: "1400px", margin: "0 auto", borderTop: "1px solid rgba(224,224,224,0.06)" }}>
        <p style={{ fontSize: "0.56rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>05 / DIAGRAMS</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" }} className="ns-2col-equal">
          {DIAGRAMS.map((src, i) => (
            <div key={i} style={{ aspectRatio: "16/10", overflow: "hidden", background: "#f5f4f0" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Diagram ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: "1rem", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Physical Model ───────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,6rem)", maxWidth: "1400px", margin: "0 auto", borderTop: "1px solid rgba(224,224,224,0.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "6rem", alignItems: "center" }} className="ns-2col">
          <div>
            <p style={{ fontSize: "0.56rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1rem" }}>06 / PHYSICAL MODEL</p>
            <h3 style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(1.2rem,1.8vw,1.6rem)", lineHeight: 1, letterSpacing: "-0.02em", color: "var(--silver)", marginBottom: "1.6rem" }}>
              BARCELONA<br />CITY FABRIC
            </h3>
            <p style={{ fontSize: "0.76rem", lineHeight: 1.95, color: "rgba(224,224,224,0.45)" }}>
              1:1000 scale model of the Eixample district showing the dense urban grid of Barcelona and the distributed network of gas station sites targeted for adaptive reuse.
            </p>
          </div>
          <div style={{ aspectRatio: "1", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MODEL}
              alt="Physical model"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)" }}
              onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"}
              onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
            />
          </div>
        </div>
      </section>

      {/* ── Credits + CTA ────────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(224,224,224,0.06)", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)", maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }} className="ns-2col">
        <div>
          <p style={{ fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.28)", marginBottom: "1.4rem" }}>TEAM</p>
          {["Avish Garg", "Hasan Hırp", "Nikos Kalaitzidis", "Seju Park"].map(name => (
            <p key={name} style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "rgba(224,224,224,0.6)", marginBottom: "0.5rem" }}>{name}</p>
          ))}
          <p style={{ fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.28)", marginTop: "2rem", marginBottom: "0.8rem" }}>FACULTY</p>
          {["Gabriele Jureviciute", "Jasser Salas", "Vinayak Tiwari"].map(name => (
            <p key={name} style={{ fontSize: "0.68rem", letterSpacing: "0.06em", color: "rgba(224,224,224,0.4)", marginBottom: "0.4rem" }}>{name}</p>
          ))}
          <p style={{ fontSize: "0.5rem", letterSpacing: "0.12em", color: "rgba(224,224,224,0.2)", marginTop: "1.2rem" }}>
            IAAC — Introductory Studio G2<br />Master in Advanced Architecture 2025–2026
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.28)", marginBottom: "0.8rem" }}>INTERESTED IN THIS PROJECT?</p>
            <a href="mailto:nika-nikolaos@hotmail.com"
              style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--bg)", background: "var(--silver)", padding: "0.85rem 2rem", textDecoration: "none", display: "inline-block", transition: "background 0.2s, color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--silver)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--bg)"; }}
            >GET IN TOUCH</a>
          </div>
          <Link href="/projects/spatial-systems"
            style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.56rem", letterSpacing: "0.12em", color: "rgba(224,224,224,0.35)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(224,224,224,0.35)")}
          >← ALL PROJECTS</Link>
        </div>
      </section>

      <style>{`
        @keyframes nsFlowDown {
          0%,100% { transform: scaleY(0); transform-origin: top; }
          50%      { transform: scaleY(1); transform-origin: top; }
          51%      { transform: scaleY(1); transform-origin: bottom; }
        }
        /* GIF cycle: each frame visible for 25% of 6s = 1.5s */
        @keyframes nsGifFrame {
          0%   { opacity: 0; }
          4%   { opacity: 1; }
          21%  { opacity: 1; }
          25%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @media (max-width: 900px) {
          .ns-2col        { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .ns-renders     { grid-template-columns: 1fr !important; }
          .ns-drawings    { grid-template-columns: repeat(2,1fr) !important; }
          .ns-2col-equal  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
