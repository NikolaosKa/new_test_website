"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { TextScramble } from "@/components/ui/text-scramble"

// ── Cover images ──────────────────────────────────────────────────────────────
// SOURCE RULE: always pull from /projects/Project_XX/06_Cover_Images/
// Add files named 01.jpg, 02.jpg … to that folder and update the urls below.
// Until images are added, Unsplash placeholders are used.
const COVER_BASE = "/projects/Project_01/06_Cover_Images"
const images = [
  { url: `${COVER_BASE}/01.jpg`, fallback: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format&fit=crop&q=80", alt: "Spatial study 01" },
  { url: `${COVER_BASE}/02.jpg`, fallback: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=500&auto=format&fit=crop&q=80", alt: "Spatial study 02" },
  { url: `${COVER_BASE}/03.jpg`, fallback: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&auto=format&fit=crop&q=80", alt: "Spatial study 03" },
  { url: `${COVER_BASE}/04.jpg`, fallback: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500&auto=format&fit=crop&q=80", alt: "Spatial study 04" },
  { url: `${COVER_BASE}/05.jpg`, fallback: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&auto=format&fit=crop&q=80", alt: "Spatial study 05" },
  { url: `${COVER_BASE}/06.jpg`, fallback: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=500&auto=format&fit=crop&q=80", alt: "Spatial study 06" },
  { url: `${COVER_BASE}/07.jpg`, fallback: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=80", alt: "Spatial study 07" },
  { url: `${COVER_BASE}/08.jpg`, fallback: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=80", alt: "Spatial study 08" },
]

const details = [
  { label: "CATEGORY",  value: "ARCHITECTURE / INTERIORS" },
  { label: "SCOPE",     value: "DESIGN + EXECUTION" },
  { label: "LOCATION",  value: "GREECE / EU" },
  { label: "STATUS",    value: "ONGOING" },
]

// Image layout — positions keep images clear of the central title zone.
// Inline styles guarantee correct rendering regardless of Tailwind compilation.
const layout = [
  // ── Top row ──────────────────────────────────────────────────────────────
  { img: 0, depth: 1.2,  top: "3%",  left: "18%", w: "clamp(130px,13vw,210px)",  h: "clamp(130px,13vw,210px)" },
  { img: 1, depth: 2.0,  top: "1%",  left: "50%", w: "clamp(115px,11vw,180px)",  h: "clamp(145px,15vw,230px)" },
  { img: 2, depth: 0.8,  top: "4%",  left: "72%", w: "clamp(145px,14vw,220px)",  h: "clamp(100px,10vw,160px)" },
  // ── Left side ────────────────────────────────────────────────────────────
  { img: 3, depth: 1.5,  top: "34%", left: "2%",  w: "clamp(130px,13vw,205px)",  h: "clamp(175px,18vw,285px)" },
  // ── Right side ───────────────────────────────────────────────────────────
  { img: 4, depth: 0.6,  top: "32%", left: "82%", w: "clamp(135px,13vw,210px)",  h: "clamp(175px,18vw,280px)" },
  // ── Bottom row ───────────────────────────────────────────────────────────
  { img: 5, depth: 2.5,  top: "72%", left: "16%", w: "clamp(145px,14vw,225px)",  h: "clamp(100px,10vw,165px)" },
  { img: 6, depth: 1.0,  top: "70%", left: "50%", w: "clamp(120px,12vw,190px)",  h: "clamp(120px,12vw,190px)" },
  { img: 7, depth: 1.8,  top: "68%", left: "75%", w: "clamp(130px,13vw,205px)",  h: "clamp(160px,16vw,255px)" },
]

// Floating image with hover: zoom + caption overlay
const FloatingImage = ({ src, fallback, alt, w, h }: { src: string; fallback: string; alt: string; w: string; h: string }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ position: "relative", width: w, height: h, overflow: "hidden", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          filter: "grayscale(0.2) contrast(1.08)",
          transform: hovered ? "scale(1.18)" : "scale(1)",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <div style={{
        position: "absolute",
        inset: 0,
        background: hovered ? "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 55%)" : "transparent",
        transition: "background 0.35s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0.55rem 0.65rem",
      }}>
        {hovered && (
          <>
            <p style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.42rem", letterSpacing: "0.12em", color: "#fff", marginBottom: "0.18rem", lineHeight: 1.2 }}>
              SPATIAL SYSTEMS
            </p>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.38rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)" }}>
              2024 / ONGOING
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function SpatialSystemsPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--silver)", minHeight: "100vh", fontFamily: "'Share Tech Mono', monospace" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,4rem)",
        background: "linear-gradient(to bottom,rgba(10,10,10,0.92) 0%,transparent 100%)",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NK" style={{ height: "clamp(36px,4vw,52px)", width: "auto", filter: "invert(1) brightness(2)", mixBlendMode: "screen" }} />
        </Link>
        <Link href="/"
          style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", color: "rgba(224,224,224,0.45)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(224,224,224,0.45)")}
        >
          ← BACK
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#050505" }}>

        {/* Accent glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 45% at 50% 52%, rgba(255,60,0,0.055) 0%, transparent 68%)", pointerEvents: "none", zIndex: 1 }} />

        {/* Floating images — positioned with inline styles, clear of title zone */}
        <Floating sensitivity={-0.7} easingFactor={0.045}>
          {layout.map(({ img, depth, top, left, w, h }, i) => (
            <FloatingElement key={i} depth={depth} style={{ top, left }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: i * 0.08 }}>
                <FloatingImage src={images[img].url} fallback={images[img].fallback} alt={images[img].alt} w={w} h={h} />
              </motion.div>
            </FloatingElement>
          ))}
        </Floating>

        {/* Centre title — click to scramble */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 10, textAlign: "center", gap: "1rem",
        }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.28em", color: "var(--accent)" }}
          >
            01 / PROJECT CATEGORY
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "Syncopate, sans-serif", fontWeight: 700,
              fontSize: "clamp(1.4rem,2.8vw,2.8rem)",
              lineHeight: 1.05, letterSpacing: "-0.01em",
              color: "var(--silver)",
              userSelect: "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15em",
            }}
          >
            <TextScramble text="SPATIAL" style={{ display: "block" }} />
            <TextScramble text="SYSTEMS" style={{ display: "block" }} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.18em", color: "rgba(224,224,224,0.28)" }}
          >
            ARCHITECTURE · INTERIORS · SPATIAL STUDIES
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.42rem", letterSpacing: "0.18em", color: "rgba(224,224,224,0.16)", marginTop: "0.3rem" }}
          >
            [ HOVER OR TAP TO DECODE ]
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
          style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", zIndex: 10, pointerEvents: "none" }}
        >
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.46rem", letterSpacing: "0.22em", color: "rgba(224,224,224,0.18)" }}>SCROLL</span>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(224,224,224,0.4), transparent)", animation: "flowDown 2s ease-in-out infinite" }} />
        </motion.div>
      </div>

      <style>{`
        @keyframes flowDown {
          0%,100% { transform: scaleY(0); transform-origin: top; }
          50%      { transform: scaleY(1); transform-origin: top; }
          51%      { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,6rem)", maxWidth: "1400px", margin: "0 auto", borderTop: "1px solid rgba(224,224,224,0.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }} className="sp-grid">
          <div>
            <p style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1.4rem" }}>OVERVIEW</p>
            <h2 style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem,2.8vw,2.6rem)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--silver)", marginBottom: "2.5rem" }}>
              DESIGNING<br />SPACE AS<br />EXPERIENCE
            </h2>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.95, color: "rgba(224,224,224,0.6)", marginBottom: "1.4rem" }}>
              Spatial Systems encompasses a broad approach to architecture and interior design, treating each project as a three-dimensional study in human experience. From concept to construction, every decision is made with the occupant&apos;s perception in mind.
            </p>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.95, color: "rgba(224,224,224,0.38)" }}>
              The work ranges from residential interventions to larger-scale spatial strategies — all united by a rigorous design process grounded in materiality, light, and program.
            </p>
          </div>
          <div style={{ paddingTop: "3.5rem" }}>
            {details.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "1.1rem 0", borderBottom: "1px solid rgba(224,224,224,0.06)", gap: "1rem" }}>
                <span style={{ fontSize: "0.56rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.28)" }}>{label}</span>
                <span style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "var(--silver)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 clamp(1.5rem,6vw,6rem) clamp(6rem,10vw,9rem)", maxWidth: "1400px", margin: "0 auto" }}>
        <p style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>SELECTED IMAGES</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "3px" }} className="sp-gallery">
          {images.map((img, i) => (
            <div key={i} style={{ aspectRatio: i % 3 === 1 ? "3/4" : "4/3", overflow: "hidden", background: "#0d0d0d" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = img.fallback; }}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(0.15) contrast(1.05)", transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0) contrast(1.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0.15) contrast(1.05)"; }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(224,224,224,0.06)", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.28)", marginBottom: "0.8rem" }}>INTERESTED IN COLLABORATING?</p>
          <h3 style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem,2.5vw,2.2rem)", letterSpacing: "-0.02em", color: "var(--silver)", lineHeight: 1 }}>
            LET&apos;S BUILD<br />SOMETHING TOGETHER
          </h3>
        </div>
        <a href="mailto:nika-nikolaos@hotmail.com"
          style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--bg)", background: "var(--silver)", padding: "1rem 2.2rem", textDecoration: "none", display: "inline-block", transition: "background 0.2s, color 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--silver)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--bg)"; }}
        >
          GET IN TOUCH
        </a>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .sp-grid    { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .sp-gallery { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .sp-gallery { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
