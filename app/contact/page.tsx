"use client"

import Link from "next/link"
import { useState } from "react"

// Monochromatic brand icons as inline SVG
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

// ── Vintage Rotary Phone SVG ──────────────────────────────────────────────────
function VintagePhone() {
  const [lifted, setLifted] = useState(false)

  // 10 dial holes at radius 36 from center (cx=120, cy=196)
  const dialHoles = Array.from({ length: 10 }, (_, i) => {
    // Start at -100° and sweep 288° (leaving a gap at the bottom-right for the finger stop)
    const angleDeg = -100 + (i / 10) * 288
    const rad = (angleDeg * Math.PI) / 180
    return {
      cx: 120 + 36 * Math.cos(rad),
      cy: 196 + 36 * Math.sin(rad),
      label: i === 9 ? "0" : String(i + 1),
    }
  })

  return (
    <div
      style={{ display: "inline-block", cursor: "pointer", userSelect: "none" }}
      onMouseEnter={() => setLifted(true)}
      onMouseLeave={() => setLifted(false)}
      title="Hover to pick up"
    >
      <svg
        viewBox="0 0 240 310"
        width="200"
        height="258"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: lifted
            ? "drop-shadow(0 0 22px rgba(255,60,0,0.45)) drop-shadow(0 8px 32px rgba(0,0,0,0.6))"
            : "drop-shadow(0 0 8px rgba(255,60,0,0.15)) drop-shadow(0 4px 20px rgba(0,0,0,0.5))",
          transition: "filter 0.45s ease",
        }}
      >
        <defs>
          <linearGradient id="pgWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#221108" />
            <stop offset="35%" stopColor="#3a1d0c" />
            <stop offset="65%" stopColor="#2e1509" />
            <stop offset="100%" stopColor="#1a0d06" />
          </linearGradient>
          <linearGradient id="pgDial" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1e1e" />
            <stop offset="100%" stopColor="#080808" />
          </linearGradient>
          <linearGradient id="pgHandset" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#111111" />
          </linearGradient>
          <radialGradient id="pgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,60,0,0.6)" />
            <stop offset="100%" stopColor="rgba(255,60,0,0)" />
          </radialGradient>
        </defs>

        {/* ── Phone body ─────────────────────────────── */}
        <rect x="22" y="62" width="196" height="232" rx="10" ry="10"
          fill="url(#pgWood)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Wood grain lines */}
        {[78, 98, 122, 150, 178, 208, 236, 262, 278].map((y, i) => (
          <line key={i} x1="24" y1={y} x2="216" y2={y + (i % 2 === 0 ? 1 : -1)}
            stroke="rgba(0,0,0,0.22)" strokeWidth="0.7" />
        ))}

        {/* Top speaker grille (3 horizontal slots) */}
        <rect x="90" y="75" width="60" height="2.5" rx="1.2" fill="rgba(255,255,255,0.12)" />
        <rect x="90" y="82" width="60" height="2.5" rx="1.2" fill="rgba(255,255,255,0.09)" />
        <rect x="90" y="89" width="60" height="2.5" rx="1.2" fill="rgba(255,255,255,0.06)" />

        {/* Cradle bracket — left */}
        <path d="M38 68 Q36 58 46 56 L60 56 Q68 56 68 64 L68 72 Q68 78 60 78 L46 78 Q38 78 38 68 Z"
          fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        {/* Cradle bracket — right */}
        <path d="M202 68 Q202 58 194 56 L180 56 Q172 56 172 64 L172 72 Q172 78 180 78 L194 78 Q202 78 202 68 Z"
          fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />

        {/* Rotary dial outer ring */}
        <circle cx="120" cy="196" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        {/* Rotary dial face */}
        <circle cx="120" cy="196" r="52" fill="url(#pgDial)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />

        {/* Dial holes */}
        {dialHoles.map(({ cx, cy, label }, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5.8" fill="#060606" stroke="rgba(255,255,255,0.22)" strokeWidth="0.9" />
            <text x={cx} y={cy + 0.6} textAnchor="middle" dominantBaseline="middle"
              fontSize="3.8" fill="rgba(255,255,255,0.38)" fontFamily="monospace" letterSpacing="0">
              {label}
            </text>
          </g>
        ))}

        {/* Finger stop (small arc at gap) */}
        <path d="M 148 218 A 36 36 0 0 1 158 208" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />

        {/* Dial center cap */}
        <circle cx="120" cy="196" r="11" fill="#111" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {/* Accent dot in center */}
        <circle cx="120" cy="196" r="3.5" fill="url(#pgGlow)" />

        {/* Bottom chrome strip */}
        <rect x="22" y="278" width="196" height="14" rx="0"
          fill="rgba(255,255,255,0.03)" stroke="none" />
        <rect x="50" y="284" width="140" height="1.5" rx="0.75"
          fill="rgba(255,255,255,0.07)" />

        {/* ── Handset (lifts on hover) ──────────────── */}
        <g
          style={{
            transform: lifted
              ? "translateY(-16px) rotate(-7deg)"
              : "translateY(0px) rotate(0deg)",
            transformOrigin: "120px 65px",
            transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Handset body — curved handle */}
          <path
            d="M 46 65 Q 47 52 56 50 L 78 50 Q 89 50 93 60 Q 100 72 120 72 Q 140 72 147 60 Q 151 50 162 50 L 184 50 Q 193 50 194 65 L 194 75 Q 193 84 184 82 L 162 82 Q 151 82 147 72 Q 140 62 120 64 Q 100 66 93 74 Q 89 82 78 82 L 56 82 Q 47 82 46 75 Z"
            fill="url(#pgHandset)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />

          {/* Earpiece speaker holes — 3×3 grid */}
          {[-4, 0, 4].flatMap(dx => [-4, 0, 4].map(dy => (
            <circle key={`e${dx}${dy}`} cx={65 + dx} cy={66 + dy} r="1.4"
              fill="rgba(255,255,255,0.18)" />
          )))}

          {/* Mouthpiece speaker holes — 3×3 grid */}
          {[-4, 0, 4].flatMap(dx => [-4, 0, 4].map(dy => (
            <circle key={`m${dx}${dy}`} cx={175 + dx} cy={66 + dy} r="1.4"
              fill="rgba(255,255,255,0.18)" />
          )))}

          {/* Earpiece outline highlight */}
          <ellipse cx="65" cy="66" rx="14" ry="10" fill="none"
            stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
          <ellipse cx="175" cy="66" rx="14" ry="10" fill="none"
            stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        </g>

        {/* Coiled cord (visible at bottom of handset when lifted) */}
        {lifted && (
          <g style={{ opacity: 0.5 }}>
            <path d="M 70 82 Q 72 92 68 98 Q 64 104 68 110 Q 72 116 68 122"
              fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText("n.kalaitzidis.arch@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main style={{ background: "#0a0a0a", color: "var(--silver)", minHeight: "100vh", fontFamily: "'Share Tech Mono', monospace" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
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
          <Link href="/" style={{ fontFamily: "Syncopate,sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(224,224,224,0.65)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(224,224,224,0.65)")}>
            WORK
          </Link>
          <Link href="/about" style={{ fontFamily: "Syncopate,sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(224,224,224,0.65)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(224,224,224,0.65)")}>
            ABOUT
          </Link>
          <Link href="/contact" style={{ fontFamily: "Syncopate,sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", color: "var(--accent)", textDecoration: "none" }}>
            CONTACT
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "clamp(7rem,12vw,10rem) clamp(1.5rem,6vw,6rem) clamp(4rem,6vw,6rem)",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: [
            "linear-gradient(rgba(224,224,224,0.03) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(224,224,224,0.03) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "56px 56px",
        }} />
        {/* Glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(255,60,0,0.07) 0%, transparent 65%)",
        }} />

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(2rem,4vw,3rem)" }}>
          {/* Vintage phone */}
          <VintagePhone />

          {/* Copy */}
          <div style={{ maxWidth: "520px" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1.2rem" }}>
              005 / GET IN TOUCH
            </p>
            <h1 style={{
              fontFamily: "Syncopate,sans-serif", fontWeight: 700,
              fontSize: "clamp(1.7rem,4.2vw,4.8rem)", lineHeight: 0.9,
              letterSpacing: "-0.03em", color: "var(--silver)",
              marginBottom: "1.8rem",
            }}>
              LET&apos;S<br />BUILD<br />SOMETHING.
            </h1>
            <p style={{ fontSize: "0.75rem", lineHeight: 1.95, color: "rgba(224,224,224,0.5)", marginBottom: "2.5rem" }}>
              I am currently open to new opportunities — whether that&apos;s a full-time position, a freelance commission, a joint architectural or photography project, or an Instagram creative collaboration. If you have something interesting in mind, I want to hear about it.
            </p>

            {/* Email CTA */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href="mailto:n.kalaitzidis.arch@gmail.com"
                style={{
                  fontFamily: "Syncopate,sans-serif", fontWeight: 700,
                  fontSize: "clamp(0.55rem,1vw,0.75rem)", letterSpacing: "0.1em",
                  color: "#0a0a0a", background: "var(--silver)",
                  padding: "0.9rem 1.8rem", textDecoration: "none",
                  clipPath: "polygon(0 0,100% 0,100% 70%,92% 100%,0 100%)",
                  transition: "background 0.25s, transform 0.25s",
                  display: "inline-block",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--silver)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
              >
                SEND AN EMAIL ↗
              </a>
              <button
                onClick={copyEmail}
                style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: "0.58rem",
                  letterSpacing: "0.15em", color: copied ? "var(--accent)" : "rgba(224,224,224,0.4)",
                  background: "none", border: "1px solid rgba(224,224,224,0.12)",
                  padding: "0.75rem 1.4rem", cursor: "pointer",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,60,0,0.4)"; }}
                onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(224,224,224,0.12)"; }}
              >
                {copied ? "COPIED ✓" : "COPY EMAIL"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Availability ────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)", borderTop: "1px solid rgba(224,224,224,0.06)" }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>
          OPEN FOR
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "rgba(224,224,224,0.06)" }}>
          {[
            { label: "JOB OFFERS",      desc: "Full-time or part-time positions in architecture studios, design firms, or interdisciplinary practices." },
            { label: "NEW CLIENTS",     desc: "Residential, commercial, or renovation projects — from concept to construction documentation." },
            { label: "COLLABORATIONS",  desc: "Joint creative projects, Instagram content, architectural photography, or drone videography work." },
            { label: "PHOTOGRAPHY",     desc: "Architectural, landscape, or editorial photography — analog and digital, drone included." },
          ].map(({ label, desc }) => (
            <div key={label} style={{ padding: "2.4rem 2rem", background: "#0a0a0a" }}>
              <div style={{ width: "8px", height: "1px", background: "var(--accent)", marginBottom: "1.4rem" }} />
              <h3 style={{ fontFamily: "Syncopate,sans-serif", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.06em", color: "var(--silver)", marginBottom: "0.9rem", lineHeight: 1.3 }}>
                {label}
              </h3>
              <p style={{ fontSize: "0.62rem", lineHeight: 1.85, color: "rgba(224,224,224,0.4)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social links ────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)", borderTop: "1px solid rgba(224,224,224,0.06)" }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>
          FIND ME ON
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          {[
            {
              icon: <InstagramIcon />,
              label: "INSTAGRAM",
              handle: "@NIKOS__KA",
              href: "https://www.instagram.com/nikos__ka",
              desc: "Architecture, photography, aerial shots and daily creative work.",
            },
            {
              icon: <LinkedInIcon />,
              label: "LINKEDIN",
              handle: "NIKOLAOS KALAITZIDIS",
              href: "https://linkedin.com/in/kontalis-nikos",
              desc: "Professional background, projects, and network.",
            },
          ].map(({ icon, label, handle, href, desc }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "2rem 0", borderBottom: "1px solid rgba(224,224,224,0.06)",
                textDecoration: "none", gap: "1rem",
                transition: "padding-left 0.3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0.5rem"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
                {/* Monochromatic icon */}
                <span style={{ color: "rgba(224,224,224,0.35)", flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "Syncopate,sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "var(--silver)", letterSpacing: "0.06em" }}>{label}</span>
                    <span style={{ fontSize: "0.54rem", letterSpacing: "0.14em", color: "var(--accent)" }}>{handle}</span>
                  </div>
                  <p style={{ fontSize: "0.6rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.08em" }}>{desc}</p>
                </div>
              </div>
              <span style={{ fontSize: "1.2rem", color: "rgba(224,224,224,0.2)", flexShrink: 0 }}>↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{ padding: "2rem clamp(1.5rem,6vw,6rem)", borderTop: "1px solid rgba(224,224,224,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <span style={{ fontSize: "0.55rem", letterSpacing: "0.14em", color: "rgba(224,224,224,0.2)" }}>
          © {new Date().getFullYear()} NIKOLAOS KALAITZIDIS
        </span>
        <Link href="/" style={{ fontFamily: "Syncopate,sans-serif", fontSize: "0.55rem", letterSpacing: "0.12em", color: "var(--accent)", textDecoration: "none" }}>
          BACK TO HOME ↑
        </Link>
      </footer>

    </main>
  )
}
