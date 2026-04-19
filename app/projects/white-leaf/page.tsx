"use client"

import Link from "next/link"
import { motion } from "motion/react"

const BASE  = "/projects/Project_02"
const COVER = `${BASE}/06_Cover_Images/P10.jpg`

const DRAWINGS = [
  { src: `${BASE}/03_Drawings/P5.jpg`,  label: "OVERVIEW",              bg: "#f5f4f0" },
  { src: `${BASE}/03_Drawings/P6.jpg`,  label: "CONCEPT",               bg: "#1a1a1a" },
  { src: `${BASE}/03_Drawings/P7.jpg`,  label: "MASTERPLAN",            bg: "#f5f4f0" },
  { src: `${BASE}/03_Drawings/P8.jpg`,  label: "SECTIONS + PLANS",      bg: "#eceae4" },
  { src: `${BASE}/03_Drawings/P9.jpg`,  label: "STUDENT BUILDING",      bg: "#eceae4" },
  { src: `${BASE}/03_Drawings/P10.jpg`, label: "AUDITORIUM PERSPECTIVE", bg: "#f5f4f0" },
]

const ABSTRACT  = `The element of wandering was important to be created in the user in order to make the transition from the urban landscape smoother. The aim of the project is to create a bond between the coastline and the urban environment.`
const ABSTRACT2 = `"White Leaf" combines the School of Fine Arts with a public theater — a campus where art, performance, and public life converge at the edge of Heraklion's historic port.`

export default function WhiteLeafPage() {
  return (
    <main style={{ background: "#f5f4f0", color: "#1a1a1a", fontFamily: "'Share Tech Mono', monospace", minHeight: "100vh" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,4rem)",
        background: "linear-gradient(to bottom, rgba(245,244,240,0.95) 0%, transparent 100%)",
        backdropFilter: "blur(6px)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="logo" style={{ height: "clamp(36px,4vw,52px)", width: "auto" }} />
          <span style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(0.45rem,0.8vw,0.65rem)", letterSpacing: "0.08em", color: "#1a1a1a", whiteSpace: "nowrap" }}>
            NIKOLAOS KALAITZIDIS
          </span>
        </Link>
        <Link
          href="/projects/spatial-systems"
          style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.52rem", letterSpacing: "0.14em", color: "rgba(26,26,26,0.5)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#c0460a" }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(26,26,26,0.5)" }}
        >
          ← SPATIAL SYSTEMS
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", background: "#e8e5df" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={COVER}
          alt="White Leaf — Auditorium"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(245,244,240,0.1) 0%, rgba(245,244,240,0.0) 40%, rgba(245,244,240,0.72) 100%)",
        }} />

        {/* Orange accent bar */}
        <motion.div
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            position: "absolute",
            top: "clamp(5rem,10vw,8rem)", left: "clamp(1.5rem,4vw,4rem)",
            width: "3px", height: "clamp(60px,10vh,100px)",
            background: "#c0460a", transformOrigin: "top",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ position: "absolute", top: "clamp(5rem,10vw,8rem)", left: "clamp(1.5rem,4vw,4rem)", paddingLeft: "1.2rem" }}
        >
          <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(0.4rem,0.7vw,0.55rem)", letterSpacing: "0.2em", color: "#c0460a", margin: 0 }}>
            PROJECT 02
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ position: "absolute", bottom: "clamp(2rem,5vw,4rem)", left: "clamp(1.5rem,4vw,4rem)", maxWidth: "min(560px,55vw)" }}
        >
          <h1 style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(2.4rem,6vw,5.5rem)", lineHeight: 0.92, letterSpacing: "-0.01em", color: "#1a1a1a", margin: "0 0 1.2rem" }}>
            WHITE<br />LEAF
          </h1>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { label: "TYPE",     value: "ART SCHOOL + THEATER" },
              { label: "LOCATION", value: "HERAKLION, CRETE"     },
              { label: "YEAR",     value: "2020"                  },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ margin: 0, fontSize: "0.44rem", letterSpacing: "0.2em", color: "rgba(26,26,26,0.4)" }}>{label}</p>
                <p style={{ margin: 0, fontSize: "0.56rem", letterSpacing: "0.1em", color: "#1a1a1a", marginTop: "0.2rem" }}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div style={{ position: "absolute", bottom: "clamp(2rem,4vw,3rem)", right: "clamp(1.5rem,4vw,4rem)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.4rem", letterSpacing: "0.22em", color: "rgba(26,26,26,0.3)", writingMode: "vertical-rl" }}>SCROLL</span>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(26,26,26,0.3), transparent)" }} />
        </div>
      </section>

      {/* ── Abstract ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
        style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,4vw,4rem)", maxWidth: "900px", margin: "0 auto" }}
      >
        <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.5rem", letterSpacing: "0.22em", color: "#c0460a", marginBottom: "1.8rem" }}>
          [ VISION ]
        </p>
        <p style={{ fontSize: "clamp(1rem,2.2vw,1.4rem)", lineHeight: 1.72, color: "#1a1a1a", marginBottom: "1.4rem" }}>
          {ABSTRACT}
        </p>
        <p style={{ fontSize: "clamp(0.8rem,1.5vw,1rem)", lineHeight: 1.8, color: "rgba(26,26,26,0.6)", borderLeft: "2px solid #c0460a", paddingLeft: "1.2rem" }}>
          {ABSTRACT2}
        </p>
      </motion.section>

      {/* ── Drawings ─────────────────────────────────────────────────────────── */}
      {DRAWINGS.map((d, i) => (
        <motion.section
          key={i}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
          style={{ background: d.bg, padding: "clamp(3rem,6vw,6rem) clamp(1.5rem,4vw,4rem)" }}
        >
          <p style={{
            fontFamily: "Syncopate, sans-serif", fontSize: "0.46rem", letterSpacing: "0.2em",
            color: d.bg === "#1a1a1a" ? "#c0460a" : "rgba(26,26,26,0.35)",
            marginBottom: "1.2rem",
          }}>
            {d.label}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={d.src}
            alt={d.label}
            loading="eager"
            style={{
              width: "100%", display: "block",
              background: d.bg === "#1a1a1a" ? "transparent" : "#fff",
              boxShadow: d.bg === "#1a1a1a"
                ? "0 24px 60px rgba(0,0,0,0.4)"
                : "0 12px 48px rgba(0,0,0,0.06)",
            }}
          />
        </motion.section>
      ))}

      {/* ── Credits ───────────────────────────────────────────────────────────── */}
      <section style={{ background: "#1a1a1a", padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,4vw,4rem)", color: "#f5f4f0" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.48rem", letterSpacing: "0.2em", color: "#c0460a", marginBottom: "2rem" }}>
            CREDITS
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "2rem" }}>
            {[
              { role: "STUDENT",     name: "Nikolaos Kalaitzidis" },
              { role: "INSTITUTION", name: "School of Architecture" },
              { role: "YEAR",        name: "2020" },
              { role: "LOCATION",    name: "Heraklion, Crete" },
            ].map(({ role, name }) => (
              <div key={role}>
                <p style={{ margin: "0 0 0.4rem", fontSize: "0.4rem", letterSpacing: "0.2em", color: "rgba(245,244,240,0.35)" }}>{role}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#f5f4f0", letterSpacing: "0.04em" }}>{name}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(245,244,240,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ margin: 0, fontSize: "0.44rem", letterSpacing: "0.15em", color: "rgba(245,244,240,0.25)" }}>
              NIKOLAOS KALAITZIDIS — PORTFOLIO 2025
            </p>
            <Link
              href="/#projects"
              style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.48rem", letterSpacing: "0.15em", color: "rgba(245,244,240,0.4)", textDecoration: "none", border: "1px solid rgba(245,244,240,0.15)", padding: "0.5rem 1rem", transition: "color 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#c0460a"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(192,70,10,0.4)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,244,240,0.4)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(245,244,240,0.15)" }}
            >
              ← ALL PROJECTS
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
