"use client"

import Link from "next/link"
import { motion } from "motion/react"

const PROJECTS = [
  {
    id: "01",
    title: "PARAMETRIC FACADE",
    year: "2024",
    tag: "GENERATIVE DESIGN · GRASSHOPPER",
    img: "https://picsum.photos/seed/comp-facade/900/600",
    status: "COMING SOON",
  },
  {
    id: "02",
    title: "MESH STUDIES",
    year: "2023",
    tag: "STRUCTURAL OPTIMIZATION · KARAMBA",
    img: "https://picsum.photos/seed/comp-mesh/900/600",
    status: "COMING SOON",
  },
  {
    id: "03",
    title: "FABRICATION SERIES",
    year: "2023",
    tag: "DIGITAL FABRICATION · CNC",
    img: "https://picsum.photos/seed/comp-fab/900/600",
    status: "COMING SOON",
  },
  {
    id: "04",
    title: "ALGORITHMIC PLANNING",
    year: "2022",
    tag: "SPATIAL ANALYSIS · PYTHON",
    img: "https://picsum.photos/seed/comp-algo/900/600",
    status: "COMING SOON",
  },
]

export default function ComputationalDesignPage() {
  return (
    <main style={{ background: "#0a0a0a", color: "var(--silver)", minHeight: "100vh", fontFamily: "'Share Tech Mono', monospace" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,4rem)",
        background: "linear-gradient(to bottom,rgba(10,10,10,0.92) 0%,transparent 100%)",
        backdropFilter: "blur(4px)",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NK" style={{ height: "clamp(36px,4vw,52px)", width: "auto", filter: "invert(1) brightness(2)", mixBlendMode: "screen" }} />
          <span style={{ fontFamily: "Syncopate,sans-serif", fontWeight: 700, fontSize: "clamp(0.45rem,0.8vw,0.65rem)", letterSpacing: "0.08em", color: "var(--silver)", whiteSpace: "nowrap" }}>
            NIKOLAOS KALAITZIDIS
          </span>
        </Link>
        <Link
          href="/"
          style={{ fontFamily: "Syncopate,sans-serif", fontSize: "0.52rem", letterSpacing: "0.14em", color: "rgba(224,224,224,0.45)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(224,224,224,0.45)")}
        >← HOME</Link>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "60vh",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "clamp(6rem,12vw,10rem) clamp(1.5rem,6vw,6rem) clamp(3rem,5vw,5rem)",
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f0a0a 100%)",
      }}>
        {/* Accent grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: [
            "linear-gradient(rgba(255,60,0,0.025) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,60,0,0.025) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "60px 60px",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 60% at 0% 100%, rgba(255,60,0,0.06) 0%, transparent 65%)",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1.2rem" }}>
            02 / PROJECT CATEGORY
          </p>
          <h1 style={{
            fontFamily: "Syncopate,sans-serif", fontWeight: 700,
            fontSize: "clamp(2.2rem,6vw,6rem)", lineHeight: 0.9,
            letterSpacing: "-0.03em", color: "var(--silver)", marginBottom: "2rem",
          }}>
            COMPUTATIONAL<br />DESIGN
          </h1>
          <p style={{ fontSize: "0.7rem", lineHeight: 1.9, color: "rgba(224,224,224,0.45)", maxWidth: "520px" }}>
            Parametric tools, algorithmic workflows, and generative strategies — exploring the intersection of code, computation, and spatial form.
          </p>
          <div style={{ display: "flex", gap: "3rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {[
              ["SCOPE", "PARAMETRIC / FABRICATION"],
              ["TOOLS", "RHINO · GRASSHOPPER · PYTHON"],
              ["STATUS", "ONGOING"],
            ].map(([l, v]) => (
              <div key={l}>
                <p style={{ margin: 0, fontSize: "0.42rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.3)" }}>{l}</p>
                <p style={{ margin: 0, fontSize: "0.56rem", letterSpacing: "0.1em", color: "var(--silver)", marginTop: "0.25rem" }}>{v}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Projects Grid ───────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))", gap: "1px", background: "rgba(224,224,224,0.05)" }}>
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              style={{ background: "#0a0a0a", position: "relative", overflow: "hidden" }}
            >
              {/* Image */}
              <div style={{ aspectRatio: "3/2", overflow: "hidden", position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(0.4) brightness(0.6) contrast(1.1)" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                  <span style={{
                    fontFamily: "'Share Tech Mono',monospace", fontSize: "0.42rem", letterSpacing: "0.18em",
                    color: "rgba(224,224,224,0.6)", background: "rgba(10,10,10,0.7)", border: "1px solid rgba(224,224,224,0.12)",
                    padding: "0.25rem 0.6rem",
                  }}>
                    {p.status}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "1.4rem 1.6rem 1.8rem" }}>
                <p style={{ fontSize: "0.42rem", letterSpacing: "0.2em", color: "var(--accent)", marginBottom: "0.5rem" }}>
                  {p.id} · {p.year}
                </p>
                <h3 style={{ fontFamily: "Syncopate,sans-serif", fontWeight: 700, fontSize: "clamp(0.75rem,1.4vw,1.05rem)", letterSpacing: "0.01em", color: "var(--silver)", marginBottom: "0.5rem", lineHeight: 1.15 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: "0.5rem", letterSpacing: "0.12em", color: "rgba(224,224,224,0.3)", lineHeight: 1.6 }}>
                  {p.tag}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{
        padding: "2rem clamp(1.5rem,6vw,6rem)", borderTop: "1px solid rgba(224,224,224,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
        marginTop: "2rem",
      }}>
        <p style={{ margin: 0, fontSize: "0.5rem", letterSpacing: "0.14em", color: "rgba(224,224,224,0.2)" }}>
          NIKOLAOS KALAITZIDIS — PORTFOLIO 2025
        </p>
        <Link href="/#projects" style={{ fontFamily: "Syncopate,sans-serif", fontSize: "0.5rem", letterSpacing: "0.12em", color: "var(--accent)", textDecoration: "none", border: "1px solid rgba(255,60,0,0.25)", padding: "0.5rem 1rem" }}>
          ← ALL PROJECTS
        </Link>
      </footer>

    </main>
  )
}
