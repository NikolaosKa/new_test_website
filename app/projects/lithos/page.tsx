"use client"

import Link from "next/link"
import { motion } from "motion/react"

// ── Asset paths ───────────────────────────────────────────────────────────────
const B = "/projects/Project_03/png"
const P1 = `${B}/Lithos%20Page_01`
const P2 = `${B}/Lithos%20Page_02`
const P3 = `${B}/Lithos%20Page_03`
const P4 = `${B}/Lithos%20Page_04`

// ── Section texts (from Info.txt) ─────────────────────────────────────────────
const TEXT1 = `A particularly challenging project involved the restoration of an old barn. The client requested two options: one to preserve the original building without any additions, and the second to include an extension.`
const TEXT2 = `In the first proposal, without the extension, we decided to maximize the use of space by creating a custom wooden structure with multiple purposes. This furniture serves as a bed, an office, extends into the living room as a sofa, and includes hidden storage space in its lower sections. The use of wood in darker tones complemented the exposed stone elements beautifully.`
const TEXT3 = `In the extension proposal, we aimed to keep the bedroom in the older part of the building, primarily because the dome ceiling provides a cozy feeling to the space. We wanted the extension to appear as though it wasn't overpowering the old structure, so we decided to use glass at the connection point. This creates the illusion that the new structure floats above the old roof while also introducing an additional spot for light to enter the living room.`
const TEXT4 = `At the entrance of the property, we decided to create a small "stoa" that connects the courtyard with the main entrance of the building. This design adds a second layer of privacy while also providing a sheltered space that protects against the natural elements before entering the house.`

// Helper for whileInView fade-up
const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.75 },
}

export default function LithosPage() {
  return (
    <main style={{ background: "#0d0b09", color: "#e8e0d5", fontFamily: "'Share Tech Mono', monospace", minHeight: "100vh" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,4rem)",
        background: "linear-gradient(to bottom, rgba(13,11,9,0.95) 0%, transparent 100%)",
        backdropFilter: "blur(6px)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="logo" style={{ height: "clamp(36px,4vw,52px)", width: "auto", filter: "invert(1) brightness(1.8)", mixBlendMode: "screen" }} />
          <span style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(0.45rem,0.8vw,0.65rem)", letterSpacing: "0.08em", color: "#e8e0d5", whiteSpace: "nowrap" }}>
            NIKOLAOS KALAITZIDIS
          </span>
        </Link>
        <Link
          href="/projects/spatial-systems"
          style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.52rem", letterSpacing: "0.14em", color: "rgba(232,224,213,0.45)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#ff3c00" }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(232,224,213,0.45)" }}
        >
          ← SPATIAL SYSTEMS
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", background: "#0d0b09" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${P3}/Entrance.png`}
          alt="Lithos — Entrance View"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 40%",
            filter: "brightness(0.55) contrast(1.1) sepia(0.18)",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(13,11,9,0.2) 0%, rgba(13,11,9,0.0) 35%, rgba(13,11,9,0.75) 100%)",
        }} />

        {/* Orange accent mark */}
        <motion.div
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            position: "absolute", top: "clamp(5.5rem,11vw,9rem)", left: "clamp(1.5rem,4vw,4rem)",
            width: "3px", height: "clamp(55px,8vh,90px)",
            background: "#ff3c00", transformOrigin: "top",
          }}
        />

        {/* Definition card — Greek etymology */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            position: "absolute",
            top: "clamp(5.5rem,11vw,9rem)", left: "clamp(1.5rem,4vw,4rem)",
            paddingLeft: "1.4rem",
          }}
        >
          <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(0.38rem,0.65vw,0.52rem)", letterSpacing: "0.2em", color: "#ff3c00", margin: 0 }}>
            PROJECT 03
          </p>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ position: "absolute", bottom: "clamp(2rem,5vw,4.5rem)", left: "clamp(1.5rem,4vw,4rem)" }}
        >
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.22em", color: "rgba(232,224,213,0.45)", margin: "0 0 0.5rem", fontStyle: "italic" }}>
            ακρογωνιαίος λίθος / cornerstone
          </p>
          <h1 style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(3rem,8vw,7rem)", lineHeight: 0.88, letterSpacing: "-0.02em", color: "#e8e0d5", margin: "0 0 1.4rem" }}>
            LITHOS
          </h1>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { label: "TYPE",     value: "RESTORATION / INTERIORS" },
              { label: "LOCATION", value: "GREECE" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ margin: 0, fontSize: "0.42rem", letterSpacing: "0.2em", color: "rgba(232,224,213,0.35)" }}>{label}</p>
                <p style={{ margin: 0, fontSize: "0.54rem", letterSpacing: "0.1em", color: "#e8e0d5", marginTop: "0.2rem" }}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div style={{ position: "absolute", bottom: "clamp(2rem,4vw,3rem)", right: "clamp(1.5rem,4vw,4rem)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.4rem", letterSpacing: "0.22em", color: "rgba(232,224,213,0.25)", writingMode: "vertical-rl" }}>SCROLL</span>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(232,224,213,0.25), transparent)" }} />
        </div>
      </section>

      {/* ── Vision / Page 01 ─────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,4vw,4rem)", background: "#0d0b09" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,4vw,5rem)", alignItems: "start", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Text */}
          <motion.div {...fadeUp}>
            <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.48rem", letterSpacing: "0.22em", color: "#ff3c00", marginBottom: "1.8rem" }}>
              [ VISION ]
            </p>
            <p style={{ fontSize: "clamp(0.9rem,1.8vw,1.2rem)", lineHeight: 1.78, color: "#e8e0d5" }}>
              {TEXT1}
            </p>
          </motion.div>

          {/* Cornerstone definition image */}
          <motion.div {...fadeUp} transition={{ duration: 0.75, delay: 0.15 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P1}/Paper.png`}
              alt="Cornerstone definition"
              style={{ width: "100%", display: "block", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            />
          </motion.div>
        </div>

        {/* Survey + Courtyard wide images */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "clamp(3rem,5vw,5rem)", maxWidth: "1200px", margin: "clamp(3rem,5vw,5rem) auto 0" }}>
          {[
            { src: `${P1}/Internal%20Courtyard%20View.png`, alt: "Internal Courtyard View" },
            { src: `${P1}/Survey.png`, alt: "Survey" },
          ].map(({ src, alt }) => (
            <motion.div key={alt} {...fadeUp} style={{ background: "#fff" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} loading="eager" style={{ width: "100%", display: "block", boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Furniture proposal — Page 02 ─────────────────────────────────────── */}
      <section style={{ padding: "0 clamp(1.5rem,4vw,4rem) clamp(4rem,8vw,8rem)", background: "#0d0b09" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Wide west view */}
          <motion.div {...fadeUp}>
            <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.46rem", letterSpacing: "0.2em", color: "rgba(232,224,213,0.3)", marginBottom: "1.2rem" }}>
              WEST VIEW — SECTION
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P2}/West_View.png`}
              alt="West View"
              loading="eager"
              style={{ width: "100%", display: "block", background: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,0.4)", marginBottom: "clamp(3rem,5vw,5rem)" }}
            />
          </motion.div>

          {/* Text + furniture grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,4vw,4rem)", alignItems: "start" }}>
            <motion.div {...fadeUp}>
              <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.46rem", letterSpacing: "0.2em", color: "#ff3c00", marginBottom: "1.2rem" }}>
                PROPOSAL A — WITHOUT EXTENSION
              </p>
              <p style={{ fontSize: "clamp(0.82rem,1.5vw,1rem)", lineHeight: 1.8, color: "rgba(232,224,213,0.75)" }}>
                {TEXT2}
              </p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { src: `${P2}/Furniture_Layout.png`, alt: "Furniture Layout" },
                { src: `${P2}/Sketches.png`,         alt: "Sketches" },
                { src: `${P2}/Office.png`,            alt: "Office View" },
                { src: `${P2}/Katopsi.png`,           alt: "Floor Plan" },
              ].map(({ src, alt }) => (
                <motion.div key={alt} {...fadeUp} style={{ background: "#fff" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} loading="eager" style={{ width: "100%", display: "block", boxShadow: "0 8px 28px rgba(0,0,0,0.3)" }} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tomi A — floor plan full width */}
          <motion.div {...fadeUp} style={{ marginTop: "3rem", background: "#fff" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P2}/Tomi%20A.png`} alt="Section A" loading="eager" style={{ width: "100%", display: "block", boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }} />
          </motion.div>
        </div>
      </section>

      {/* ── Extension proposal — Page 03 ─────────────────────────────────────── */}
      <section style={{ padding: "0 clamp(1.5rem,4vw,4rem) clamp(4rem,8vw,8rem)", background: "#100e0c" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,4vw,4rem)", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { src: `${P3}/North_View.png`,  alt: "North View" },
                { src: `${P3}/Section_B.png`,   alt: "Section B" },
              ].map(({ src, alt }) => (
                <motion.div key={alt} {...fadeUp} style={{ background: "#fff" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} loading="eager" style={{ width: "100%", display: "block", boxShadow: "0 10px 32px rgba(0,0,0,0.35)" }} />
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeUp}>
              <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.46rem", letterSpacing: "0.2em", color: "#ff3c00", marginBottom: "1.2rem" }}>
                PROPOSAL B — WITH EXTENSION
              </p>
              <p style={{ fontSize: "clamp(0.82rem,1.5vw,1rem)", lineHeight: 1.8, color: "rgba(232,224,213,0.75)", marginBottom: "2rem" }}>
                {TEXT3}
              </p>
              <motion.div {...fadeUp} style={{ background: "#fff" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${P3}/Katopsi.png`} alt="Floor Plan" loading="eager" style={{ width: "100%", display: "block", boxShadow: "0 8px 28px rgba(0,0,0,0.3)" }} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Entrance / Stoa — Page 04 ────────────────────────────────────────── */}
      <section style={{ padding: "0 clamp(1.5rem,4vw,4rem) clamp(4rem,8vw,8rem)", background: "#0d0b09" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,4vw,4rem)", alignItems: "start" }}>
            <motion.div {...fadeUp}>
              <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.46rem", letterSpacing: "0.2em", color: "#ff3c00", marginBottom: "1.2rem" }}>
                ENTRANCE — STOA
              </p>
              <p style={{ fontSize: "clamp(0.82rem,1.5vw,1rem)", lineHeight: 1.8, color: "rgba(232,224,213,0.75)" }}>
                {TEXT4}
              </p>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { src: `${P4}/Detail_01.png`,   alt: "Detail 01" },
                { src: `${P4}/Detail_02.png`,   alt: "Detail 02" },
                { src: `${P4}/Section_A.png`,   alt: "Section A" },
              ].map(({ src, alt }) => (
                <motion.div key={alt} {...fadeUp} style={{ background: "#fff" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} loading="eager" style={{ width: "100%", display: "block", boxShadow: "0 8px 28px rgba(0,0,0,0.3)" }} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Construction photo */}
          <motion.div {...fadeUp} style={{ marginTop: "3rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P4}/137257012_429744071703712_6715410902036526154_n.png`}
              alt="Construction site"
              loading="eager"
              style={{ width: "100%", maxHeight: "60vh", objectFit: "cover", display: "block", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Credits ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,4vw,4rem)", background: "#080806" }}>
        <motion.div {...fadeUp} style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.48rem", letterSpacing: "0.2em", color: "#ff3c00", marginBottom: "2rem" }}>
            CREDITS
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "2rem" }}>
            {[
              { role: "ARCHITECT", name: "Nikolaos Kalaitzidis" },
              { role: "TYPE",      name: "Restoration + Interiors" },
              { role: "LOCATION",  name: "Greece" },
            ].map(({ role, name }) => (
              <div key={role}>
                <p style={{ margin: "0 0 0.4rem", fontSize: "0.4rem", letterSpacing: "0.2em", color: "rgba(232,224,213,0.3)" }}>{role}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#e8e0d5", letterSpacing: "0.04em" }}>{name}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(232,224,213,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ margin: 0, fontSize: "0.44rem", letterSpacing: "0.15em", color: "rgba(232,224,213,0.2)" }}>
              NIKOLAOS KALAITZIDIS — PORTFOLIO 2025
            </p>
            <Link
              href="/#projects"
              style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.48rem", letterSpacing: "0.15em", color: "rgba(232,224,213,0.35)", textDecoration: "none", border: "1px solid rgba(232,224,213,0.12)", padding: "0.5rem 1rem", transition: "color 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#ff3c00"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,60,0,0.4)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(232,224,213,0.35)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,224,213,0.12)" }}
            >
              ← ALL PROJECTS
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
