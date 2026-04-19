"use client"

import Link from "next/link"
import { useState } from "react"

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
        justifyContent: "flex-end", padding: "clamp(5rem,10vw,10rem) clamp(1.5rem,6vw,6rem) clamp(3rem,6vw,6rem)",
        position: "relative", overflow: "hidden",
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
          background: "radial-gradient(ellipse 70% 50% at 20% 90%, rgba(255,60,0,0.06) 0%, transparent 65%)",
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "1.5rem" }}>
            005 / GET IN TOUCH
          </p>
          <h1 style={{
            fontFamily: "Syncopate,sans-serif", fontWeight: 700,
            fontSize: "clamp(2.8rem,7vw,8rem)", lineHeight: 0.88,
            letterSpacing: "-0.04em", color: "var(--silver)",
            marginBottom: "3rem",
          }}>
            LET&apos;S<br />BUILD<br />SOMETHING.
          </h1>
          <p style={{ fontSize: "0.78rem", lineHeight: 1.95, color: "rgba(224,224,224,0.5)", maxWidth: "520px", marginBottom: "3.5rem" }}>
            I am currently open to new opportunities — whether that&apos;s a full-time position, a freelance commission, a joint architectural or photography project, or an Instagram creative collaboration. If you have something interesting in mind, I want to hear about it.
          </p>
          {/* Email CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <a
              href="mailto:n.kalaitzidis.arch@gmail.com"
              style={{
                fontFamily: "Syncopate,sans-serif", fontWeight: 700,
                fontSize: "clamp(0.55rem,1vw,0.75rem)", letterSpacing: "0.1em",
                color: "#0a0a0a", background: "var(--silver)",
                padding: "1rem 2rem", textDecoration: "none",
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
      </section>

      {/* ── Availability ────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)", borderTop: "1px solid rgba(224,224,224,0.06)" }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--accent)", marginBottom: "3rem" }}>
          OPEN FOR
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "rgba(224,224,224,0.06)" }}>
          {[
            { label: "JOB OFFERS", desc: "Full-time or part-time positions in architecture studios, design firms, or interdisciplinary practices." },
            { label: "NEW CLIENTS", desc: "Residential, commercial, or renovation projects — from concept to construction documentation." },
            { label: "COLLABORATIONS", desc: "Joint creative projects, Instagram content, architectural photography, or drone videography work." },
            { label: "PHOTOGRAPHY", desc: "Architectural, landscape, or editorial photography — analog and digital, drone included." },
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
              label: "INSTAGRAM",
              handle: "@NIKOS__KA",
              href: "https://www.instagram.com/nikos__ka",
              desc: "Architecture, photography, aerial shots and daily creative work.",
            },
            {
              label: "LINKEDIN",
              handle: "NIKOLAOS KALAITZIDIS",
              href: "https://linkedin.com/in/kontalis-nikos",
              desc: "Professional background, projects, and network.",
            },
          ].map(({ label, handle, href, desc }) => (
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
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "Syncopate,sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "var(--silver)", letterSpacing: "0.06em" }}>{label}</span>
                  <span style={{ fontSize: "0.54rem", letterSpacing: "0.14em", color: "var(--accent)" }}>{handle}</span>
                </div>
                <p style={{ fontSize: "0.6rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.08em" }}>{desc}</p>
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
