"use client"

import { useEffect } from "react"
import { motion, stagger, useAnimate } from "motion/react"
import Link from "next/link"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"

// Architecture / spatial images from Unsplash
const images = [
  { url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format&fit=crop&q=80", alt: "Brutalist architecture facade" },
  { url: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=600&auto=format&fit=crop&q=80", alt: "Geometric building lines" },
  { url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&auto=format&fit=crop&q=80", alt: "Modern architectural structure" },
  { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80", alt: "Interior spatial study" },
  { url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&auto=format&fit=crop&q=80", alt: "Urban spatial context" },
  { url: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=600&auto=format&fit=crop&q=80", alt: "Architectural elevation" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80", alt: "Material and texture study" },
  { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80", alt: "Residential architecture" },
]

const details = [
  { label: "CATEGORY",  value: "ARCHITECTURE / INTERIORS" },
  { label: "SCOPE",     value: "DESIGN + EXECUTION" },
  { label: "LOCATION",  value: "GREECE / EU" },
  { label: "STATUS",    value: "ONGOING" },
]

export default function SpatialSystemsPage() {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate(
      "img",
      { opacity: [0, 1] },
      { duration: 0.6, delay: stagger(0.12) }
    )
  }, [])

  return (
    <main
      style={{
        background: "var(--bg)",
        color: "var(--silver)",
        minHeight: "100vh",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* ── Minimal nav ──────────────────────────────────────────────────── */}
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
          padding: "clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,4rem)",
          background: "linear-gradient(to bottom,rgba(10,10,10,0.92) 0%,transparent 100%)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NK" style={{ height: "clamp(36px,4vw,52px)", width: "auto", filter: "invert(1) brightness(2)", mixBlendMode: "screen" }} />
        </Link>
        <Link
          href="/"
          style={{
            fontFamily: "Syncopate, sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.15em",
            color: "rgba(224,224,224,0.45)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(224,224,224,0.45)")}
        >
          ← BACK
        </Link>
      </nav>

      {/* ── Hero — parallax floating gallery ─────────────────────────────── */}
      <div
        ref={scope}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          background: "#050505",
        }}
      >
        {/* Radial accent glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(255,60,0,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        {/* Floating images */}
        <Floating sensitivity={-0.8} easingFactor={0.04}>

          {/* Top-left cluster */}
          <FloatingElement depth={0.4} className="top-[6%] left-[4%]">
            <motion.img initial={{ opacity: 0 }} src={images[0].url} alt={images[0].alt}
              style={{ width: "clamp(80px,9vw,140px)", height: "clamp(100px,12vw,180px)", objectFit: "cover", filter: "grayscale(0.2) contrast(1.1)" }} />
          </FloatingElement>

          <FloatingElement depth={1.2} className="top-[2%] left-[22%]">
            <motion.img initial={{ opacity: 0 }} src={images[1].url} alt={images[1].alt}
              style={{ width: "clamp(60px,7vw,110px)", height: "clamp(60px,7vw,110px)", objectFit: "cover", filter: "grayscale(0.3) contrast(1.15)" }} />
          </FloatingElement>

          {/* Top-right cluster */}
          <FloatingElement depth={2} className="top-[1%] left-[58%]">
            <motion.img initial={{ opacity: 0 }} src={images[2].url} alt={images[2].alt}
              style={{ width: "clamp(90px,10vw,160px)", height: "clamp(120px,14vw,210px)", objectFit: "cover", filter: "grayscale(0.15) contrast(1.1)" }} />
          </FloatingElement>

          <FloatingElement depth={0.8} className="top-[5%] left-[80%]">
            <motion.img initial={{ opacity: 0 }} src={images[3].url} alt={images[3].alt}
              style={{ width: "clamp(70px,8vw,120px)", height: "clamp(70px,8vw,120px)", objectFit: "cover", filter: "grayscale(0.25) contrast(1.2)" }} />
          </FloatingElement>

          {/* Mid left */}
          <FloatingElement depth={1.5} className="top-[42%] left-[1%]">
            <motion.img initial={{ opacity: 0 }} src={images[4].url} alt={images[4].alt}
              style={{ width: "clamp(80px,9vw,145px)", height: "clamp(80px,9vw,145px)", objectFit: "cover", filter: "grayscale(0.2) contrast(1.1)" }} />
          </FloatingElement>

          {/* Mid right */}
          <FloatingElement depth={0.6} className="top-[38%] left-[83%]">
            <motion.img initial={{ opacity: 0 }} src={images[5].url} alt={images[5].alt}
              style={{ width: "clamp(70px,8vw,130px)", height: "clamp(90px,11vw,170px)", objectFit: "cover", filter: "grayscale(0.3) contrast(1.15)" }} />
          </FloatingElement>

          {/* Bottom cluster */}
          <FloatingElement depth={2.5} className="top-[68%] left-[8%]">
            <motion.img initial={{ opacity: 0 }} src={images[6].url} alt={images[6].alt}
              style={{ width: "clamp(100px,11vw,175px)", height: "clamp(65px,7vw,115px)", objectFit: "cover", filter: "grayscale(0.2) contrast(1.1)" }} />
          </FloatingElement>

          <FloatingElement depth={1} className="top-[72%] left-[62%]">
            <motion.img initial={{ opacity: 0 }} src={images[7].url} alt={images[7].alt}
              style={{ width: "clamp(75px,8vw,130px)", height: "clamp(75px,8vw,130px)", objectFit: "cover", filter: "grayscale(0.25) contrast(1.2)" }} />
          </FloatingElement>

        </Floating>

        {/* Centre title */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            pointerEvents: "none",
            textAlign: "center",
            gap: "1.2rem",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              color: "var(--accent)",
            }}
          >
            01 / PROJECT CATEGORY
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "Syncopate, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.4rem,7vw,7rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: "var(--silver)",
            }}
          >
            SPATIAL<br />SYSTEMS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              color: "rgba(224,224,224,0.35)",
              maxWidth: "36ch",
              lineHeight: 1.8,
            }}
          >
            ARCHITECTURE · INTERIORS · SPATIAL STUDIES
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.22em", color: "rgba(224,224,224,0.2)" }}>SCROLL</span>
          <div style={{ width: "1px", height: "42px", background: "linear-gradient(to bottom, var(--silver), transparent)", animation: "flowDown 2s ease-in-out infinite" }} />
        </motion.div>
      </div>

      <style>{`
        @keyframes flowDown {
          0%,100% { transform: scaleY(0); transform-origin: top; }
          50%      { transform: scaleY(1); transform-origin: top; }
          51%      { transform: scaleY(1); transform-origin: bottom; }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Project overview ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,6rem)",
          maxWidth: "1400px",
          margin: "0 auto",
          borderTop: "1px solid rgba(224,224,224,0.06)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}
          className="sp-grid">

          {/* Left — description */}
          <div>
            <p style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1.4rem" }}>
              OVERVIEW
            </p>
            <h2 style={{
              fontFamily: "Syncopate, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem,2.8vw,2.6rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "var(--silver)",
              marginBottom: "2.5rem",
            }}>
              DESIGNING<br />SPACE AS<br />EXPERIENCE
            </h2>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.95, color: "rgba(224,224,224,0.6)", marginBottom: "1.4rem" }}>
              Spatial Systems encompasses a broad approach to architecture and interior design, treating each project as a three-dimensional study in human experience. From concept to construction, every decision is made with the occupant&apos;s perception in mind.
            </p>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.95, color: "rgba(224,224,224,0.38)" }}>
              The work ranges from residential interventions to larger-scale spatial strategies — all united by a rigorous design process grounded in materiality, light, and program.
            </p>
          </div>

          {/* Right — project details */}
          <div style={{ paddingTop: "3.5rem" }}>
            {details.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "1.1rem 0",
                  borderBottom: "1px solid rgba(224,224,224,0.06)",
                  gap: "1rem",
                }}
              >
                <span style={{ fontSize: "0.56rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.28)" }}>{label}</span>
                <span style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "var(--silver)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery grid ─────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "0 clamp(1.5rem,6vw,6rem) clamp(6rem,10vw,9rem)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <p style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>
          SELECTED IMAGES
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3px" }} className="sp-gallery">
          {images.map((img, i) => (
            <div
              key={i}
              style={{
                aspectRatio: i % 3 === 1 ? "3/4" : "4/3",
                overflow: "hidden",
                background: "#0d0d0d",
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "grayscale(0.15) contrast(1.05)",
                  transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
                  (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0) contrast(1.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0.15) contrast(1.05)";
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(224,224,224,0.06)",
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <div>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(224,224,224,0.28)", marginBottom: "0.8rem" }}>INTERESTED IN COLLABORATING?</p>
          <h3 style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem,2.5vw,2.2rem)", letterSpacing: "-0.02em", color: "var(--silver)", lineHeight: 1 }}>
            LET&apos;S BUILD<br />SOMETHING TOGETHER
          </h3>
        </div>
        <a
          href="mailto:nika-nikolaos@hotmail.com"
          style={{
            fontFamily: "Syncopate, sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "var(--bg)",
            background: "var(--silver)",
            padding: "1rem 2.2rem",
            textDecoration: "none",
            display: "inline-block",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)";
            (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "var(--silver)";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--bg)";
          }}
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
