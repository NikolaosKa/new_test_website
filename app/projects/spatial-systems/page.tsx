"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { TextScramble } from "@/components/ui/text-scramble"

// ── Images ────────────────────────────────────────────────────────────────────
const P = "/projects/Old_Portfolio/Images"
const C1 = "/projects/Project_01"
const C2 = "/projects/Project_02"
const C3 = "/projects/Project_03/png/Lithos%20Page_03"
const C4 = "/projects/Project_04/png/OH_Page_01"

const images = [
  { url: `${C1}/06_Cover_Images/Cover%20Page.png`, alt: "Next Station", name: "NEXT STATION", year: "2025", href: "/projects/next-station" },
  { url: `${C2}/06_Cover_Images/P10.jpg`, alt: "White Leaf", name: "WHITE LEAF", year: "2020", href: "/projects/white-leaf" },
  { url: `${C3}/Entrance.png`, alt: "Lithos", name: "LITHOS", year: "2021", href: "/projects/lithos" },
  { url: `${C4}/Image.png`, alt: "OH", name: "OH", year: "2022", href: "/projects/oh" },
  { url: `${P}/P15.jpg`, alt: "Study 05", name: "COMING SOON", year: "—", href: null },
  { url: `${P}/P18.jpg`, alt: "Study 06", name: "COMING SOON", year: "—", href: null },
  { url: `${P}/P21.jpg`, alt: "Study 07", name: "COMING SOON", year: "—", href: null },
  { url: `${P}/P24.jpg`, alt: "Study 08", name: "COMING SOON", year: "—", href: null },
]

const details = [
  { label: "CATEGORY", value: "ARCHITECTURE / INTERIORS" },
  { label: "SCOPE",    value: "DESIGN + EXECUTION" },
  { label: "LOCATION", value: "GREECE / EU" },
  { label: "STATUS",   value: "ONGOING" },
]

// ── Layout — positions keep images away from centre title zone ────────────────
const layout = [
  { img: 0, depth: 1.2, top: "3%",  left: "18%", w: "clamp(130px,13vw,210px)", h: "clamp(130px,13vw,210px)" },
  { img: 1, depth: 2.0, top: "1%",  left: "50%", w: "clamp(115px,11vw,180px)", h: "clamp(145px,15vw,230px)" },
  { img: 2, depth: 0.8, top: "4%",  left: "72%", w: "clamp(145px,14vw,220px)", h: "clamp(100px,10vw,160px)" },
  { img: 3, depth: 1.5, top: "34%", left: "2%",  w: "clamp(130px,13vw,205px)", h: "clamp(175px,18vw,285px)" },
  { img: 4, depth: 0.6, top: "32%", left: "82%", w: "clamp(135px,13vw,210px)", h: "clamp(175px,18vw,280px)" },
  { img: 5, depth: 2.5, top: "72%", left: "16%", w: "clamp(145px,14vw,225px)", h: "clamp(100px,10vw,165px)" },
  { img: 6, depth: 1.0, top: "70%", left: "50%", w: "clamp(120px,12vw,190px)", h: "clamp(120px,12vw,190px)" },
  { img: 7, depth: 1.8, top: "68%", left: "75%", w: "clamp(130px,13vw,205px)", h: "clamp(160px,16vw,255px)" },
]

// Slight nudge toward viewport centre on hover
function getTranslate(top: string, left: string) {
  const t = parseFloat(top)
  const l = parseFloat(left)
  const x = l < 35 ? 22 : l > 65 ? -22 : 0
  const y = t < 35 ? 18 : t > 65 ? -18 : 0
  return { x, y }
}

// ── FloatingImage component ───────────────────────────────────────────────────
interface FIProps {
  src: string; alt: string; name: string; year: string; href: string | null
  w: string; h: string
  isHovered: boolean; isDesaturated: boolean
  translateOnHover: { x: number; y: number }
  annotationBelow: boolean
  onHover: () => void; onLeave: () => void
}

const FloatingImage = ({
  src, alt, name, year, href,
  w, h, isHovered, isDesaturated,
  translateOnHover, annotationBelow,
  onHover, onLeave,
}: FIProps) => {
  const inner = (
    <div
      style={{
        position: "relative",
        cursor: href ? "pointer" : "default",
        // move slightly toward centre on hover
        transform: isHovered
          ? `translate(${translateOnHover.x}px,${translateOnHover.y}px)`
          : "translate(0,0)",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Image frame — overflow:hidden isolates the scale zoom */}
      <div style={{ width: w, height: h, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            filter: isDesaturated
              ? "grayscale(1) brightness(0.5)"
              : "grayscale(0.1) contrast(1.08)",
            transform: isHovered ? "scale(1.14)" : "scale(1)",
            transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1), filter 0.65s ease",
          }}
        />
      </div>

      {/* Annotation — rendered OUTSIDE the image frame so it's not clipped */}
      <div style={{
        position: "absolute",
        ...(annotationBelow
          ? { top: "100%", paddingTop: "0.55rem" }
          : { bottom: "100%", paddingBottom: "0.55rem" }),
        left: 0,
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? "translateY(0)" : `translateY(${annotationBelow ? "-6px" : "6px"})`,
        transition: "opacity 0.28s ease, transform 0.28s ease",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}>
        <p style={{
          fontFamily: "Syncopate, sans-serif", fontSize: "0.5rem",
          letterSpacing: "0.14em", color: "#fff", marginBottom: "0.2rem", lineHeight: 1.1,
        }}>{name}</p>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: "0.44rem",
          letterSpacing: "0.1em", color: "var(--accent)",
        }}>{year}</p>
      </div>
    </div>
  )

  return href
    ? <Link href={href} style={{ textDecoration: "none" }}>{inner}</Link>
    : inner
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SpatialSystemsPage() {
  const [hoveredIdx, setHoveredIdx]       = useState<number | null>(null)
  const [grayscaleActive, setGrayscale]   = useState(false)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleHover = (idx: number) => {
    setHoveredIdx(idx)
    setGrayscale(false)
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = setTimeout(() => setGrayscale(true), 800)
  }
  const handleLeave = () => {
    setHoveredIdx(null)
    setGrayscale(false)
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
  }
  useEffect(() => () => { if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current) }, [])

  return (
    <main style={{ background: "var(--bg)", color: "var(--silver)", minHeight: "100vh", fontFamily: "'Share Tech Mono', monospace" }}>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,4rem)",
        background: "linear-gradient(to bottom,rgba(10,10,10,0.92) 0%,transparent 100%)",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NK" style={{ height: "clamp(36px,4vw,52px)", width: "auto", filter: "invert(1) brightness(2)", mixBlendMode: "screen" }} />
        </Link>
        <Link href="/"
          style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", color: "rgba(224,224,224,0.45)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(224,224,224,0.45)")}
        >← BACK</Link>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#050505" }}>

        {/* Accent glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 45% at 50% 52%, rgba(255,60,0,0.055) 0%, transparent 68%)", pointerEvents: "none", zIndex: 1 }} />

        {/* Floating images */}
        <Floating sensitivity={-0.7} easingFactor={0.045}>
          {layout.map(({ img, depth, top, left, w, h }, i) => {
            const translate   = getTranslate(top, left)
            const annoBelow   = parseFloat(top) < 50
            const isHov       = hoveredIdx === i
            const isDesat     = grayscaleActive && hoveredIdx !== null && hoveredIdx !== i
            return (
              <FloatingElement key={i} depth={depth} style={{ top, left }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: i * 0.08 }}>
                  <FloatingImage
                    src={images[img].url}     alt={images[img].alt}
                    name={images[img].name}   year={images[img].year}
                    href={images[img].href}
                    w={w} h={h}
                    isHovered={isHov}         isDesaturated={isDesat}
                    translateOnHover={translate}
                    annotationBelow={annoBelow}
                    onHover={() => handleHover(i)}
                    onLeave={handleLeave}
                  />
                </motion.div>
              </FloatingElement>
            )
          })}
        </Floating>

        {/* Centre title — pointer-events:none so hover on images works */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 10,
          textAlign: "center", gap: "1rem", pointerEvents: "none",
        }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.28em", color: "var(--accent)" }}
          >01 / PROJECT CATEGORY</motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "Syncopate, sans-serif", fontWeight: 700,
              fontSize: "clamp(1.4rem,2.8vw,2.8rem)",
              lineHeight: 1.05, letterSpacing: "-0.01em", color: "var(--silver)",
              userSelect: "none", display: "flex", flexDirection: "column",
              alignItems: "center", gap: "0.15em", pointerEvents: "auto",
            }}
          >
            <TextScramble text="SPATIAL" style={{ display: "block" }} />
            <TextScramble text="SYSTEMS" style={{ display: "block" }} />
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.18em", color: "rgba(224,224,224,0.28)" }}
          >ARCHITECTURE · INTERIORS · SPATIAL STUDIES</motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.6 }}
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.42rem", letterSpacing: "0.18em", color: "rgba(224,224,224,0.16)", marginTop: "0.3rem" }}
          >[ HOVER TO EXPLORE · CLICK TO OPEN PROJECT ]</motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
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

      {/* Overview */}
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

      {/* Gallery */}
      <section style={{ padding: "0 clamp(1.5rem,6vw,6rem) clamp(6rem,10vw,9rem)", maxWidth: "1400px", margin: "0 auto" }}>
        <p style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>SELECTED IMAGES</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "3px" }} className="sp-gallery">
          {images.map((img, i) => (
            <div key={i} style={{ aspectRatio: i % 3 === 1 ? "3/4" : "4/3", overflow: "hidden", background: "#0d0d0d" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(0.15) contrast(1.05)", transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0) contrast(1.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0.15) contrast(1.05)"; }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
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
        >GET IN TOUCH</a>
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
