"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "motion/react"

const B = "/projects/Project_04/png"
const P1 = `${B}/OH_Page_01`
const P2 = `${B}/OH_Page_02`
const P3 = `${B}/OH_Page_03`
const P4 = `${B}/OH_Page_04`
const P5 = `${B}/OH_Page_05`
const P6 = `${B}/OH_Page_06`

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}

export default function OHPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onScroll = () => {
      const y = window.scrollY
      el.style.transform = `translateY(${y * 0.35}px)`
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <main style={{ background: "#090c0a", color: "#dce8e0", minHeight: "100vh", fontFamily: "Syncopate, sans-serif" }}>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(1.2rem, 3vw, 2rem) clamp(1.5rem, 4vw, 4rem)",
        background: "linear-gradient(to bottom, rgba(9,12,10,0.95) 0%, transparent 100%)",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NK logo" style={{ height: "clamp(36px, 4vw, 52px)", width: "auto", filter: "invert(1) brightness(2)", mixBlendMode: "screen" }} />
          <span style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(0.45rem, 0.8vw, 0.65rem)", letterSpacing: "0.08em", color: "#dce8e0", whiteSpace: "nowrap" }}>
            NIKOLAOS KALAITZIDIS
          </span>
        </Link>
        <Link href="/#projects" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "rgba(220,232,224,0.45)", textDecoration: "none" }}>
          ← BACK
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <div ref={heroRef} style={{ position: "absolute", inset: "-10%", willChange: "transform" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${P1}/Image.png`}
            alt="OH — exterior render"
            loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5) contrast(1.15) saturate(0.8)" }}
          />
        </div>
        {/* green accent overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(30,70,45,0.25) 0%, transparent 60%)", mixBlendMode: "screen" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #090c0a 0%, rgba(9,12,10,0.5) 40%, transparent 70%)" }} />

        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "clamp(2rem, 5vw, 5rem) clamp(1.5rem, 5vw, 5rem)",
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.22em", color: "rgba(120,200,140,0.7)", marginBottom: "1rem" }}>
            [ PROJECT 04 — MICRO DWELLING ]
          </div>
          <h1 style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(4rem, 14vw, 12rem)", lineHeight: 0.85, letterSpacing: "-0.03em", color: "#dce8e0", marginBottom: "0.5rem" }}>
            OH
          </h1>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.18em", color: "rgba(220,232,224,0.4)", marginTop: "1.2rem" }}>
            MOBILE ARCHITECTURE / 2022
          </p>
        </div>
      </section>

      {/* Vision */}
      <section style={{ padding: "clamp(5rem, 10vw, 10rem) clamp(1.5rem, 8vw, 10rem)", maxWidth: "1400px", margin: "0 auto" }}>
        <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.22em", color: "rgba(120,200,140,0.65)", marginBottom: "0.8rem" }}>
              01 / VISION
            </div>
            <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(1.2rem, 2.5vw, 2rem)", fontWeight: 700, lineHeight: 1.1, color: "#dce8e0" }}>
              FREEDOM<br />IN MOTION
            </div>
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", lineHeight: 1.9, color: "rgba(220,232,224,0.55)", letterSpacing: "0.04em" }}>
            <p>
              OH is a compact dwelling designed for mobility — a tiny house on wheels that challenges the conventional boundaries of home. The project explores how a minimal footprint can deliver maximum spatial quality, integrating sleeping, working, cooking, and bathing into a unified 20m² shell.
            </p>
            <p style={{ marginTop: "1.2rem" }}>
              Every element serves double or triple duty. Every dimension was negotiated between comfort and compactness. The result is an architecture that moves with its inhabitant — anchored only by choice, not by foundation.
            </p>
          </div>
        </motion.div>

        {/* Floor plan */}
        <motion.div {...fadeUp} style={{ marginTop: "6rem" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(120,200,140,0.5)", marginBottom: "1.5rem" }}>
            FLOOR PLAN
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${P1}/Katopsi.png`}
            alt="OH floor plan"
            loading="eager"
            style={{ width: "100%", maxWidth: "700px", display: "block", background: "#fff", padding: "1.5rem", boxSizing: "border-box" }}
          />
        </motion.div>
      </section>

      {/* Isometrics */}
      <section style={{ background: "#060907", padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 8vw, 10rem)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <motion.div {...fadeUp}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.22em", color: "rgba(120,200,140,0.65)", marginBottom: "0.8rem" }}>
              02 / FORM + STRUCTURE
            </div>
            <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(1rem, 2vw, 1.6rem)", fontWeight: 700, color: "#dce8e0", marginBottom: "3rem" }}>
              ASSEMBLED LOGIC
            </div>
          </motion.div>

          {/* Large isometric */}
          <motion.div {...fadeUp}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P2}/Isometric.png`}
              alt="OH isometric view"
              loading="eager"
              style={{ width: "100%", display: "block", background: "#fff", padding: "2rem", boxSizing: "border-box", marginBottom: "1.5rem" }}
            />
          </motion.div>

          {/* Exploded iso + section */}
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {[
              { src: `${P2}/Explo_iso.png`, alt: "Exploded isometric" },
              { src: `${P2}/Section_Iso.png`, alt: "Section isometric" },
            ].map(({ src, alt }) => (
              <div key={alt} style={{ background: "#fff", padding: "1.5rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} loading="eager" style={{ width: "100%", display: "block" }} />
              </div>
            ))}
          </motion.div>

          {/* Iso_02 + Plan */}
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {[
              { src: `${P2}/Iso_02.png`, alt: "Isometric 02" },
              { src: `${P2}/Plan.png`, alt: "Plan drawing" },
            ].map(({ src, alt }) => (
              <div key={alt} style={{ background: "#fff", padding: "1.5rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} loading="eager" style={{ width: "100%", display: "block" }} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interior */}
      <section style={{ padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 8vw, 10rem)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <motion.div {...fadeUp}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.22em", color: "rgba(120,200,140,0.65)", marginBottom: "0.8rem" }}>
              03 / INTERIOR
            </div>
            <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(1rem, 2vw, 1.6rem)", fontWeight: 700, color: "#dce8e0", marginBottom: "3rem" }}>
              COMPRESSED LIVING
            </div>
          </motion.div>

          {/* Interior renders */}
          <motion.div {...fadeUp}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P3}/Image01.png`}
              alt="OH interior 01"
              loading="eager"
              style={{ width: "100%", display: "block", marginBottom: "1.5rem", filter: "brightness(0.9) contrast(1.05)" }}
            />
          </motion.div>
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {[`${P3}/Image02.png`, `${P3}/Image03.png`].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`OH interior ${i + 2}`} loading="eager" style={{ width: "100%", display: "block", filter: "brightness(0.9) contrast(1.05)" }} />
            ))}
          </motion.div>

          {/* Section + detail */}
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
            <div style={{ background: "#fff", padding: "1.5rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${P3}/Section.png`} alt="OH section" loading="eager" style={{ width: "100%", display: "block" }} />
            </div>
            <div style={{ background: "#fff", padding: "1.5rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${P3}/Detail.png`} alt="OH detail" loading="eager" style={{ width: "100%", display: "block" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section style={{ background: "#060907", padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 8vw, 10rem)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <motion.div {...fadeUp}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.22em", color: "rgba(120,200,140,0.65)", marginBottom: "0.8rem" }}>
              04 / DETAILS
            </div>
            <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(1rem, 2vw, 1.6rem)", fontWeight: 700, color: "#dce8e0", marginBottom: "3rem" }}>
              CRAFTED PRECISION
            </div>
          </motion.div>

          {/* Bathroom + cabinet */}
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {[
              { src: `${P4}/Bathroom.png`, alt: "Bathroom detail" },
              { src: `${P4}/cabinet.png`, alt: "Cabinet detail" },
            ].map(({ src, alt }) => (
              <div key={alt} style={{ background: "#fff", padding: "1.5rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} loading="eager" style={{ width: "100%", display: "block" }} />
              </div>
            ))}
          </motion.div>

          {/* Cabinet iso + top + interior renders */}
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {[
              { src: `${P4}/cabinet_iso.png`, alt: "Cabinet isometric" },
              { src: `${P4}/top.png`, alt: "Top view" },
              { src: `${P4}/image_01.png`, alt: "Interior detail 01" },
            ].map(({ src, alt }) => (
              <div key={alt} style={{ background: "#fff", padding: "1rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} loading="eager" style={{ width: "100%", display: "block" }} />
              </div>
            ))}
          </motion.div>

          {/* Sections */}
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {[
              { src: `${P4}/Section_01.png`, alt: "Section 01" },
              { src: `${P4}/Section_02.png`, alt: "Section 02" },
            ].map(({ src, alt }) => (
              <div key={alt} style={{ background: "#fff", padding: "1.5rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} loading="eager" style={{ width: "100%", display: "block" }} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Physical Model */}
      <section style={{ padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 8vw, 10rem)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <motion.div {...fadeUp}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.22em", color: "rgba(120,200,140,0.65)", marginBottom: "0.8rem" }}>
              05 / PHYSICAL MODEL
            </div>
            <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(1rem, 2vw, 1.6rem)", fontWeight: 700, color: "#dce8e0", marginBottom: "3rem" }}>
              BUILT AT SCALE
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P5}/Image%2001.png`}
              alt="Physical model 01"
              loading="eager"
              style={{ width: "100%", display: "block", marginBottom: "1.5rem" }}
            />
          </motion.div>
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {["Image%2002.png", "Image%2003.png"].map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={`${P5}/${f}`} alt={`Physical model ${i + 2}`} loading="eager" style={{ width: "100%", display: "block" }} />
            ))}
          </motion.div>
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {["Image%2004.png", "Image%2005.png"].map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={`${P5}/${f}`} alt={`Physical model ${i + 4}`} loading="eager" style={{ width: "100%", display: "block" }} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photography */}
      <section style={{ background: "#060907", padding: "clamp(5rem, 10vw, 9rem) clamp(1.5rem, 8vw, 10rem)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <motion.div {...fadeUp}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.22em", color: "rgba(120,200,140,0.65)", marginBottom: "0.8rem" }}>
              06 / DOCUMENTATION
            </div>
            <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(1rem, 2vw, 1.6rem)", fontWeight: 700, color: "#dce8e0", marginBottom: "3rem" }}>
              IN THE FIELD
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P6}/Image_01.png`} alt="Documentation 01" loading="eager" style={{ width: "100%", display: "block", marginBottom: "1.5rem", filter: "brightness(0.88) contrast(1.05)" }} />
          </motion.div>
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {["Image_02.png", "Image_03.png"].map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={`${P6}/${f}`} alt={`Documentation ${i + 2}`} loading="eager" style={{ width: "100%", display: "block", filter: "brightness(0.88) contrast(1.05)" }} />
            ))}
          </motion.div>
          <motion.div {...fadeUp} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {["Image_04.png", "Image_05.png", "Image_06.png", "Image_07.png"].map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={`${P6}/${f}`} alt={`Documentation ${i + 4}`} loading="eager" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block", filter: "brightness(0.88) contrast(1.05)" }} />
            ))}
          </motion.div>
          {/* Last image full width */}
          <motion.div {...fadeUp} style={{ marginTop: "1rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P6}/Image_08.png`} alt="Documentation 08" loading="eager" style={{ width: "100%", display: "block", filter: "brightness(0.88) contrast(1.05)" }} />
          </motion.div>
        </div>
      </section>

      {/* Credits footer */}
      <footer style={{ padding: "5rem clamp(1.5rem, 8vw, 10rem) 4rem", borderTop: "1px solid rgba(120,200,140,0.1)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: "clamp(1.5rem, 4vw, 3rem)", fontWeight: 700, color: "#dce8e0", lineHeight: 0.9 }}>OH</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.18em", color: "rgba(220,232,224,0.3)", marginTop: "0.8rem" }}>
              MOBILE ARCHITECTURE — 2022
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.15em", color: "rgba(220,232,224,0.25)", lineHeight: 1.8 }}>
              <p>DESIGN: NIKOLAOS KALAITZIDIS</p>
              <p>TYPE: MICRO DWELLING / MOBILE</p>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1400px", margin: "3rem auto 0", textAlign: "center" }}>
          <Link
            href="/#projects"
            style={{
              fontFamily: "Syncopate, sans-serif", fontSize: "0.55rem", letterSpacing: "0.18em",
              color: "rgba(120,200,140,0.5)", textDecoration: "none", borderBottom: "1px solid rgba(120,200,140,0.2)",
              paddingBottom: "0.2rem", transition: "color 0.2s",
            }}
          >
            ← ALL PROJECTS
          </Link>
        </div>
      </footer>

    </main>
  )
}
