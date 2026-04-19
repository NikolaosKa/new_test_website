"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { HoverGlowCard } from "@/components/ui/hover-glow-card"
import { useIsMobile } from "@/lib/hooks/use-is-mobile"

// ── Asset paths ────────────────────────────────────────────────────────────────
const C1 = "/projects/Project_01"
const C2 = "/projects/Project_02"
const C3 = "/projects/Project_03/png"

interface Banner {
  title: string
  year: string
  tag: string
  img: string
  href: string | null
}

interface Category {
  id: string
  title: string
  tag: string
  graphic: string
  graphicFilter: string
  banners: Banner[]
}

const categories: Category[] = [
  {
    id: "01",
    title: "SPATIAL\nSYSTEMS",
    tag: "ARCHITECTURE / INTERIORS",
    graphic: "/explo.png",
    graphicFilter: "brightness(0.82) contrast(1.12) saturate(1.15)",
    banners: [
      {
        title: "NEXT STATION",
        year: "2025",
        tag: "URBAN MOBILITY DESIGN",
        img: `${C1}/06_Cover_Images/Cover%20Page.png`,
        href: "/projects/next-station",
      },
      {
        title: "WHITE LEAF",
        year: "2020",
        tag: "RESIDENTIAL RESTORATION",
        img: `${C2}/06_Cover_Images/P10.jpg`,
        href: "/projects/white-leaf",
      },
      {
        title: "LITHOS",
        year: "2021",
        tag: "BARN RESTORATION · STONE ARCHITECTURE",
        img: `${C3}/Lithos%20Page_03/Entrance.png`,
        href: "/projects/lithos",
      },
    ],
  },
  {
    id: "02",
    title: "COMPUTATIONAL\nDESIGN",
    tag: "PARAMETRIC / FABRICATION",
    graphic: "/comp.jpg",
    graphicFilter: "brightness(0.7) contrast(1.2) saturate(1.1)",
    banners: [
      {
        title: "PARAMETRIC FACADE",
        year: "2024",
        tag: "GENERATIVE DESIGN · GRASSHOPPER",
        img: "https://placehold.co/900x260/0d0d0d/1a1a1a",
        href: null,
      },
      {
        title: "MESH STUDIES",
        year: "2023",
        tag: "STRUCTURAL OPTIMIZATION · KARAMBA",
        img: "https://placehold.co/900x260/0d0d0d/1a1a1a",
        href: null,
      },
      {
        title: "FABRICATION SERIES",
        year: "2023",
        tag: "DIGITAL FABRICATION · CNC",
        img: "https://placehold.co/900x260/0d0d0d/1a1a1a",
        href: null,
      },
    ],
  },
  {
    id: "03",
    title: "DIGITAL TO\nPHYSICAL",
    tag: "PROTOTYPING / INSTALLATION",
    graphic: "/digital.jpg",
    graphicFilter: "brightness(0.68) contrast(1.15) saturate(0.95)",
    banners: [
      {
        title: "PROTOTYPE 01",
        year: "2024",
        tag: "3D PRINTING · ROBOTIC ASSEMBLY",
        img: "https://placehold.co/900x260/0d0d0d/1a1a1a",
        href: null,
      },
      {
        title: "INSTALLATION",
        year: "2023",
        tag: "INTERACTIVE ENVIRONMENT · SENSORS",
        img: "https://placehold.co/900x260/0d0d0d/1a1a1a",
        href: null,
      },
      {
        title: "MATERIAL RESEARCH",
        year: "2022",
        tag: "MATERIAL SYSTEMS · COMPOSITE",
        img: "https://placehold.co/900x260/0d0d0d/1a1a1a",
        href: null,
      },
    ],
  },
]

// ── Banner card ────────────────────────────────────────────────────────────────
function BannerCard({ banner, index }: { banner: Banner; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  // Mobile: simple fade-up, no horizontal slide (prevents layout shift jank)
  // Desktop: slide in from left with stagger
  const animProps = isMobile
    ? {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-20px" },
        transition: { duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] as const },
      }
    : {
        initial: { opacity: 0, x: -64 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.68, delay: 0.18 + index * 0.16, ease: [0.16, 1, 0.3, 1] as const },
      }

  const inner = (
    <motion.div {...animProps}>
      <HoverGlowCard
        style={{
          width: "100%",
          position: "relative",
          aspectRatio: isMobile ? "16 / 6" : "16 / 5",
          overflow: "hidden",
          border: `1px solid ${hovered && banner.href ? "rgba(255,60,0,0.35)" : "rgba(224,224,224,0.07)"}`,
          transition: "border-color 0.3s ease",
        }}
        onClick={undefined}
      >
        {/* Background image — lazy loaded (below the fold) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner.img}
          alt={banner.title}
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // Only scale on desktop — GPU transform on mobile causes compositing layers
            transform: (!isMobile && hovered) ? "scale(1.04)" : "scale(1.0)",
            transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            filter: "brightness(0.72) contrast(1.08)",
          }}
        />

        {/* Left-to-right gradient */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(6,6,6,0.92) 0%, rgba(6,6,6,0.55) 55%, rgba(6,6,6,0.72) 100%)",
        }} />

        {/* Left accent bar */}
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "2px",
          background: hovered && banner.href
            ? "linear-gradient(to bottom, var(--accent), rgba(255,60,0,0.2))"
            : "linear-gradient(to bottom, rgba(224,224,224,0.15), transparent)",
          transition: "background 0.3s ease",
        }} />

        {/* Content row */}
        <div style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.2rem, 2.5vw, 2.4rem)",
          gap: "1rem",
        }}>
          {/* Left: title + tag */}
          <div>
            <h4 style={{
              fontFamily: "Syncopate, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(0.7rem, 1.3vw, 1rem)",
              letterSpacing: "0.02em",
              color: hovered && banner.href ? "#fff" : "var(--silver)",
              transition: "color 0.25s ease",
              lineHeight: 1.1,
              marginBottom: "0.4rem",
            }}>
              {banner.title}
            </h4>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.52rem",
              letterSpacing: "0.14em",
              color: "rgba(224,224,224,0.38)",
              lineHeight: 1,
            }}>
              {banner.tag}
            </p>
          </div>

          {/* Right: year + arrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexShrink: 0 }}>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              color: hovered && banner.href ? "var(--accent)" : "rgba(224,224,224,0.3)",
              transition: "color 0.25s ease",
            }}>
              {banner.year}
            </span>
            {banner.href && (
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.6rem",
                color: "var(--accent)",
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateX(0)" : "translateX(-8px)",
                transition: "opacity 0.25s ease, transform 0.25s ease",
              }}>
                →
              </span>
            )}
            {!banner.href && (
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.44rem",
                letterSpacing: "0.18em",
                color: "rgba(224,224,224,0.18)",
                border: "1px solid rgba(224,224,224,0.1)",
                padding: "0.2rem 0.5rem",
              }}>
                SOON
              </span>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: hovered && banner.href ? "100%" : "30%",
          height: "1px",
          background: "linear-gradient(to right, rgba(255,60,0,0.6), transparent)",
          transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </HoverGlowCard>
    </motion.div>
  )

  return banner.href ? (
    <Link
      href={banner.href}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </Link>
  ) : (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {inner}
    </div>
  )
}

// ── Category row ───────────────────────────────────────────────────────────────
function CategoryRow({ cat }: { cat: Category }) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        display: "grid",
        // Mobile: single column — Left info on top, banners below
        // Desktop: 40/60 split with sticky left
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0,4fr) minmax(0,6fr)",
        gap: isMobile ? "2rem" : "clamp(2rem, 4vw, 5rem)",
        alignItems: "start",
        borderTop: "1px solid rgba(224,224,224,0.06)",
        paddingTop: "clamp(2.5rem, 6vw, 6.5rem)",
        paddingBottom: "clamp(2.5rem, 6vw, 6.5rem)",
      }}
    >
      {/* ── Left column — sticky on desktop, static on mobile ── */}
      <motion.div
        initial={{ opacity: 0, y: isMobile ? 20 : 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: isMobile ? 0.5 : 0.75, ease: [0.16, 1, 0.3, 1] as const }}
        style={isMobile ? {} : { position: "sticky", top: "18vh" }}
      >
        {/* Number */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.22em",
          color: "var(--accent)",
          marginBottom: "0.75rem",
        }}>
          {cat.id} /
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "Syncopate, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1.4rem, 2.8vw, 2.6rem)",
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
          color: "var(--silver)",
          whiteSpace: "pre-line",
          marginBottom: "0.7rem",
        }}>
          {cat.title}
        </h3>

        {/* Tag */}
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.54rem",
          letterSpacing: "0.15em",
          color: "rgba(224,224,224,0.3)",
          marginBottom: "2rem",
        }}>
          {cat.tag}
        </p>

        {/* Graphic */}
        <div style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: "4 / 3",
          background: "#060606",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cat.graphic}
            alt={cat.title}
            loading="eager"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: cat.graphicFilter,
            }}
          />
          {/* Corner accent */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to top, rgba(8,8,8,0.85), transparent)",
          }} />
          <div style={{
            position: "absolute",
            bottom: "0.8rem",
            left: "0.9rem",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.44rem",
            letterSpacing: "0.18em",
            color: "rgba(224,224,224,0.3)",
          }}>
            {cat.banners.length} PROJECTS
          </div>
        </div>
      </motion.div>

      {/* ── Right column: banner stack ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.8rem, 1.5vw, 1.2rem)" }}>
        {cat.banners.map((banner, i) => (
          <BannerCard key={i} banner={banner} index={i} />
        ))}
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────
export function ProjectsSection() {
  return (
    <>
      <section
        id="projects"
        className="projects-section"
        style={{ padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 6vw, 6rem)" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ marginBottom: "clamp(2rem, 4vw, 4rem)" }}
        >
          <p className="section-label">002 / SELECTED WORK</p>
          <h2 className="section-heading">
            PROJECT
            <br />
            CATEGORIES
          </h2>
        </motion.div>

        {/* Category rows */}
        {categories.map((cat) => (
          <CategoryRow key={cat.id} cat={cat} />
        ))}

        {/* Footer */}
        <div style={{
          marginTop: "5rem",
          borderTop: "1px solid rgba(224,224,224,0.08)",
          paddingTop: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Nikolaos Kalaitzidis"
              style={{ height: "36px", width: "auto", filter: "invert(1) brightness(2)", mixBlendMode: "screen", opacity: 0.5 }}
            />
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.62rem",
              color: "rgba(224,224,224,0.25)",
              letterSpacing: "0.15em",
            }}>
              © {new Date().getFullYear()} NIKOLAOS KALAITZIDIS
            </span>
          </div>
          <a
            href="#"
            style={{
              fontFamily: "Syncopate, sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            BACK TO TOP ↑
          </a>
        </div>
      </section>
    </>
  )
}

export default ProjectsSection
