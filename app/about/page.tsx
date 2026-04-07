"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const skills = [
  { name: "RHINO + GRASSHOPPER",   level: 92 },
  { name: "AUTOCAD",               level: 88 },
  { name: "ARCHICAD",              level: 80 },
  { name: "SKETCHUP + V-RAY",      level: 78 },
  { name: "LUMION / TWINMOTION",   level: 75 },
  { name: "BLENDER",               level: 68 },
  { name: "ADOBE CREATIVE SUITE",  level: 85 },
  { name: "PREMIERE PRO",          level: 72 },
  { name: "PHOTOGRAPHY",           level: 90 },
  { name: "DRONE OPERATION",       level: 85 },
  { name: "3D PRINTING",           level: 72 },
  { name: "MODEL MAKING",          level: 88 },
];

const experience = [
  {
    role:    "DESIGNER & PROJECT MANAGER",
    place:   "Tiny House Company — Kefalonia",
    period:  "ONGOING",
    desc:    "Leading design and management of prototype tiny houses. Passive home design focused on efficiency, affordability, and ecological sustainability — with a vision for an agritourism village complex.",
  },
  {
    role:    "ASSISTANT ARCHITECT",
    place:   "Four-Storey Apartment Building — Neapoli, Athens",
    period:  "2024",
    desc:    "Took over and completed an existing project, managing its architectural execution and aesthetics.",
  },
  {
    role:    "ARCHITECT & SITE SUPERVISOR",
    place:   "Apartment Renovation — Neo Heraklion",
    period:  "2024",
    desc:    "Designed and oversaw renovation of a small apartment including new fireplace integration.",
  },
  {
    role:    "SITE SUPERVISOR & DESIGNER",
    place:   "Two-Storey House Renovation — Chania",
    period:  "2020",
    desc:    "Supervised on-site construction and delivered comprehensive 3D designs for a 120 m² renovation.",
  },
];

// ── Logo break / assemble ─────────────────────────────────────────────────────
// The logo splits into 9 pieces. Break order: top → bottom, one piece every
// ~0.45 s (full sequence ≈ 3.5 s). Each piece has a custom keyframe with
// gravity easing + landing bounce.  All fall distances are calculated so the
// pile lands ABOVE "ARCHITECTURAL STUDIO" (pile visual ≈ 160–230 px from
// container top; text starts ≈ 251 px below container top at ~211 px height).
// Tiny rotations (±5°) and x-offsets (±4 px) keep the pile neat and linear.
// The clickable pile target is a dedicated div positioned at the pile location.

type LogoState = "idle" | "breaking" | "broken" | "assembling";

// fallY: CSS px the piece translates down (at ~211 px logo height).
//   Target pile centre = 195 px from container top.
//   Piece centre (px) comes from: svg_centre_y * (211/311.61).
//   fallY = 195 - piece_centre_px (clamped ≥ 12 px).
// breakDelay: seconds — staggered 0.45 s apart, top-first.
// asmDelay:   seconds — reverse order so bottom pieces reassemble first.
const PIECES = [
  //              fallY  fallX  rot  breakDelay asmDelay breakDur asmDur  origin
  { id:"lp1", fallY:159, fallX: 0, rot: -5, breakDelay:0.00, asmDelay:0.70, breakDur:0.65, asmDur:0.85, origin:"55% 17%" },
  { id:"rp1", fallY:156, fallX: 2, rot:  6, breakDelay:0.45, asmDelay:0.55, breakDur:0.64, asmDur:0.85, origin:"47% 19%" },
  { id:"lp2", fallY: 90, fallX: 3, rot:  4, breakDelay:0.90, asmDelay:0.30, breakDur:0.48, asmDur:0.78, origin:"40% 50%" },
  { id:"rp2", fallY:108, fallX:-3, rot: -5, breakDelay:1.35, asmDelay:0.22, breakDur:0.52, asmDur:0.78, origin:"58% 41%" },
  { id:"tri", fallY: 60, fallX: 1, rot: -4, breakDelay:1.70, asmDelay:0.35, breakDur:0.38, asmDur:0.75, origin:"51% 64%" },
  { id:"lp3", fallY: 20, fallX:-2, rot: -3, breakDelay:2.00, asmDelay:0.15, breakDur:0.25, asmDur:0.70, origin:"25% 83%" },
  { id:"rp3", fallY: 59, fallX: 1, rot:  4, breakDelay:2.35, asmDelay:0.10, breakDur:0.38, asmDur:0.75, origin:"68% 64%" },
  { id:"lb",  fallY: 52, fallX:-4, rot: -2, breakDelay:2.70, asmDelay:0.05, breakDur:0.36, asmDur:0.70, origin:"20% 68%" },
  { id:"rb",  fallY: 52, fallX: 4, rot:  3, breakDelay:3.00, asmDelay:0.00, breakDur:0.36, asmDur:0.70, origin:"81% 68%" },
] as const;

// Per-piece CSS keyframes injected into <style> at render time.
// break-*: gravity easing with 5% overshoot + 2% undershoot (landing bounce).
// assemble-*: spring return with 7px upward overshoot at 85%.
const PIECE_KEYFRAMES = PIECES.map(p => {
  const oy  = p.fallY + Math.round(p.fallY * 0.055); // overshoot
  const uy  = p.fallY - Math.round(p.fallY * 0.020); // undershoot
  const or_ = +(p.rot * 1.12).toFixed(1);
  const ur_ = +(p.rot * 0.93).toFixed(1);
  return `
    @keyframes break-${p.id} {
      0%   { transform: translateY(0px)          translateX(0px)       rotate(0deg);      }
      72%  { transform: translateY(${oy}px)      translateX(${p.fallX}px) rotate(${or_}deg); }
      86%  { transform: translateY(${uy}px)      translateX(${p.fallX}px) rotate(${ur_}deg); }
      100% { transform: translateY(${p.fallY}px) translateX(${p.fallX}px) rotate(${p.rot}deg); }
    }
    @keyframes assemble-${p.id} {
      from { transform: translateY(${p.fallY}px) translateX(${p.fallX}px) rotate(${p.rot}deg); }
      85%  { transform: translateY(-7px)          translateX(0px)          rotate(0deg);         }
      100% { transform: translateY(0px)           translateX(0px)          rotate(0deg);         }
    }`;
}).join('\n');

// SVG element rendered inside each piece's viewBox-matched SVG
function PieceContent({ id }: { id: string }) {
  const sm = { strokeMiterlimit: 10 } as const;
  if (id === "lp1") return <line {...sm} x1="203.23" y1="1.08"   x2="153.70" y2="104.23" stroke="#fff" strokeWidth="5" />;
  if (id === "lp2") return <line {...sm} x1="153.70" y1="104.23" x2="104.17" y2="207.38" stroke="#fff" strokeWidth="5" />;
  if (id === "lp3") return <line {...sm} x1="104.17" y1="207.38" x2="54.64"  y2="310.53" stroke="#fff" strokeWidth="5" />;
  if (id === "rp1") return <line {...sm} x1="136.85" y1="22.02"  x2="170.38" y2="93.34"  stroke="#fff" strokeWidth="4" />;
  if (id === "rp2") return <line {...sm} x1="170.38" y1="93.34"  x2="203.91" y2="164.66" stroke="#fff" strokeWidth="4" />;
  if (id === "rp3") return <line {...sm} x1="203.91" y1="164.66" x2="237.45" y2="235.98" stroke="#fff" strokeWidth="4" />;
  if (id === "lb")  return <path {...sm} d="M126.29,211.47H0"        stroke="#fff" strokeWidth="6" fill="none" />;
  if (id === "rb")  return <path {...sm} d="M203.23,211.47h121.02"   stroke="#fff" strokeWidth="6" fill="none" />;
  if (id === "tri") return (
    <>
      <defs>
        <linearGradient id="triGradP" x1="142.73" y1="251.49" x2="205.05" y2="159.09" gradientUnits="userSpaceOnUse">
          <stop offset="0"   stopColor="#fff"    stopOpacity="1"  />
          <stop offset=".2"  stopColor="#fcfcfc" stopOpacity=".99"/>
          <stop offset=".33" stopColor="#f4f4f4" stopOpacity=".95"/>
          <stop offset=".45" stopColor="#e7e7e7" stopOpacity=".89"/>
          <stop offset=".55" stopColor="#d5d4d4" stopOpacity=".81"/>
          <stop offset=".65" stopColor="#bdbbbc" stopOpacity=".7" />
          <stop offset=".74" stopColor="#9f9d9e" stopOpacity=".57"/>
          <stop offset=".83" stopColor="#7c7a7a" stopOpacity=".41"/>
          <stop offset=".91" stopColor="#535051" stopOpacity=".22"/>
          <stop offset=".99" stopColor="#272324" stopOpacity=".02"/>
          <stop offset="1"   stopColor="#231f20" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon {...sm} points="164.6,131.8 115.79,233.31 213.85,233.31"
        fill="url(#triGradP)" stroke="#fff" strokeWidth="3" />
    </>
  );
  return null;
}

// ── AnimatedLogo ──────────────────────────────────────────────────────────────
function AnimatedLogo({
  trigger, logoState, onDoubleClick, onPileClick,
}: {
  trigger: boolean;
  logoState: LogoState;
  onDoubleClick: () => void;
  onPileClick: () => void;
}) {
  const showPieces = logoState !== "idle";
  const logoW = "clamp(100px,16vw,220px)";

  // Piece animation string per state
  const pieceAnim = (p: typeof PIECES[number]) => {
    if (logoState === "breaking" || logoState === "broken")
      return `break-${p.id} ${p.breakDur}s ease-in ${p.breakDelay}s both`;
    if (logoState === "assembling")
      return `assemble-${p.id} ${p.asmDur}s cubic-bezier(0.16,1,0.3,1) ${p.asmDelay}s both`;
    return "none";
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Inject per-piece keyframes */}
      <style>{PIECE_KEYFRAMES}</style>

      {/* ── Original logo (idle only) ──────────────────────────────────── */}
      {!showPieces && (
        <div
          onDoubleClick={onDoubleClick}
          title="Double-click to break"
          style={{
            cursor: "crosshair",
            animation: trigger ? "alBreathe 4s ease-in-out 2s infinite" : "none",
          }}
        >
          <svg viewBox="0 0 324.26 311.61" xmlns="http://www.w3.org/2000/svg"
            style={{ width: logoW, height: "auto", overflow: "visible" }}
            aria-label="Nikolaos Kalaitzidis logo"
          >
            <defs>
              <linearGradient id="alGrad" x1="142.73" y1="251.49" x2="205.05" y2="159.09" gradientUnits="userSpaceOnUse">
                <stop offset="0"   stopColor="#fff"    stopOpacity="1"  />
                <stop offset=".2"  stopColor="#fcfcfc" stopOpacity=".99"/>
                <stop offset=".33" stopColor="#f4f4f4" stopOpacity=".95"/>
                <stop offset=".45" stopColor="#e7e7e7" stopOpacity=".89"/>
                <stop offset=".55" stopColor="#d5d4d4" stopOpacity=".81"/>
                <stop offset=".65" stopColor="#bdbbbc" stopOpacity=".7" />
                <stop offset=".74" stopColor="#9f9d9e" stopOpacity=".57"/>
                <stop offset=".83" stopColor="#7c7a7a" stopOpacity=".41"/>
                <stop offset=".91" stopColor="#535051" stopOpacity=".22"/>
                <stop offset=".99" stopColor="#272324" stopOpacity=".02"/>
                <stop offset="1"   stopColor="#231f20" stopOpacity="0" />
              </linearGradient>
              <style>{`
                .al-line { stroke-dasharray:1; stroke-dashoffset:1; fill:none; }
                .al-tri  { opacity:0; }
                ${trigger ? `
                  .al-p1 { animation: alDraw 1.2s cubic-bezier(0.16,1,0.3,1) 0.05s forwards; }
                  .al-p2 { animation: alDraw 1.0s cubic-bezier(0.16,1,0.3,1) 0.15s forwards; }
                  .al-b1 { animation: alDraw 0.7s cubic-bezier(0.16,1,0.3,1) 0.75s forwards; }
                  .al-b2 { animation: alDraw 0.7s cubic-bezier(0.16,1,0.3,1) 0.75s forwards; }
                  .al-tri{ animation: alFade 0.9s ease 1.1s forwards; }
                  @keyframes alDraw { to { stroke-dashoffset:0; } }
                  @keyframes alFade { to { opacity:1; } }
                ` : ""}
                @keyframes alBreathe {
                  0%,100% { transform:scale(1);     }
                  50%     { transform:scale(1.045); }
                }
              `}</style>
            </defs>
            <line className="al-line al-p1" pathLength="1" x1="203.23" y1="1.08"  x2="54.64"  y2="310.53" stroke="#fff" strokeWidth="5" strokeMiterlimit="10"/>
            <line className="al-line al-p2" pathLength="1" x1="136.85" y1="22.02" x2="237.45" y2="235.98" stroke="#fff" strokeWidth="4" strokeMiterlimit="10"/>
            <path className="al-line al-b1" pathLength="1" d="M126.29,211.47H0"        stroke="#fff" strokeWidth="6" strokeMiterlimit="10"/>
            <path className="al-line al-b2" pathLength="1" d="M203.23,211.47h121.02"   stroke="#fff" strokeWidth="6" strokeMiterlimit="10"/>
            <polygon className="al-tri" points="164.6,131.8 115.79,233.31 213.85,233.31"
              fill="url(#alGrad)" stroke="#fff" strokeWidth="3" strokeMiterlimit="10"/>
          </svg>
        </div>
      )}

      {/* ── Pieces layer (breaking / broken / assembling) ──────────────── */}
      {showPieces && (
        // Container matches the logo bounds exactly; overflow:visible lets
        // pieces render below (pile zone). Pointer-events on pieces are off
        // so clicks reach the dedicated pile click target below.
        <div style={{ position: "relative", width: logoW, aspectRatio: "324.26 / 311.61" }}>
          {PIECES.map(piece => (
            <div
              key={piece.id}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                transformOrigin: piece.origin,
                animation: pieceAnim(piece),
              }}
            >
              <svg viewBox="0 0 324.26 311.61" style={{ width: "100%", height: "100%" }} overflow="visible">
                <PieceContent id={piece.id} />
              </svg>
            </div>
          ))}

          {/* ── Pile click target — sits at the pile location (below logo) ── */}
          {/* Positioned at top:78% (≈164 px) with height 55px → covers 164–219 px.
              The pile visual is ≈160–230 px from container top, text at ≈251 px. */}
          <div
            onClick={logoState === "broken" ? onPileClick : undefined}
            style={{
              position: "absolute",
              top: "78%",
              left: "10%",
              width: "80%",
              height: "55px",
              cursor: logoState === "broken" ? "pointer" : "default",
              zIndex: 10,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "4px",
            }}
          >
            {/* Restore hint — fades in after all pieces have landed (~3.5 s) */}
            {logoState === "broken" && (
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.44rem",
                letterSpacing: "0.22em",
                color: "rgba(224,224,224,0.25)",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                animation: "alFadeIn 0.5s ease 0.3s both",
              }}>
                ↑ CLICK TO RESTORE
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const droneImages = [
  "/Drone/01_Images/DJI_0239.webp",
  "/Drone/01_Images/DJI_0248.webp",
  "/Drone/01_Images/dji_fly_20230614_211442_3_1686770081335_photo.webp",
  "/Drone/01_Images/dji_fly_20230626_210950_441_1687805033544_photo.webp",
];

export default function AboutPage() {
  const skillsRef = useRef<HTMLDivElement>(null);
  const [skillsReady, setSkillsReady] = useState(false);
  const [skillsFill,  setSkillsFill]  = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [logoState,   setLogoState]   = useState<LogoState>("idle");
  const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
          obs.disconnect();
          setSkillsReady(true);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setSkillsFill(true));
          });
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => {
      obs.disconnect();
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    };
  }, []);

  const handleLogoBreak = () => {
    if (logoState !== "idle") return;
    setLogoState("breaking");
    // Last piece lands at 3.0 + 0.36 = 3.36 s → switch to broken at 3.55 s
    logoTimerRef.current = setTimeout(() => setLogoState("broken"), 3550);
  };

  const handleLogoAssemble = () => {
    if (logoState !== "broken") return;
    setLogoState("assembling");
    // Last piece finishes at asmDelay 0.70 + asmDur 0.85 = 1.55 s → idle at 1.75 s
    logoTimerRef.current = setTimeout(() => setLogoState("idle"), 1750);
  };

  return (
    <>
      <style>{`
        .about-page { opacity:0; transition: opacity 0.7s ease; }
        .about-page.ready { opacity:1; }
        @keyframes alFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes flow {
          0%,100% { transform:scaleY(0); transform-origin:top; }
          50%     { transform:scaleY(1); transform-origin:top; }
          51%     { transform:scaleY(1); transform-origin:bottom; }
        }
        .about-nav-link {
          font-family: Syncopate, sans-serif; font-size:0.58rem;
          letter-spacing:0.12em; color:rgba(224,224,224,0.65);
          text-decoration:none; transition:color 0.2s;
        }
        .about-nav-link:hover  { color:var(--accent); }
        .about-nav-link.active { color:var(--accent); }
        .bio-grid      { display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:center; }
        .exp-grid      { display:grid; grid-template-columns:1fr 1fr; gap:2px; }
        .pursuits-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
        .ig-grid       { display:grid; grid-template-columns:repeat(6,1fr); gap:4px; }
        .skill-bar-fill {
          position:absolute; inset:0;
          background:linear-gradient(to right, var(--accent), rgba(255,60,0,0.38));
          transform-origin:left center; will-change:transform;
        }
        @media (max-width:900px) {
          .bio-grid { grid-template-columns:1fr !important; gap:3rem !important; }
          .exp-grid  { grid-template-columns:1fr !important; }
          .ig-grid   { grid-template-columns:repeat(3,1fr) !important; }
        }
        @media (max-width:600px) {
          .pursuits-grid { grid-template-columns:1fr !important; }
          .ig-grid       { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>

      <main
        className={`about-page${mounted ? " ready" : ""}`}
        style={{ background: "var(--bg)", color: "var(--silver)", minHeight: "100vh" }}
      >

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:50,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,4rem)",
          background:"linear-gradient(to bottom,rgba(10,10,10,0.92) 0%,transparent 100%)",
        }}>
          <Link href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:"0.75rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="NK" style={{ height:"clamp(44px,5vw,64px)", width:"auto", filter:"invert(1) brightness(2)", mixBlendMode:"screen" }} />
            <span style={{ fontFamily:"Syncopate,sans-serif", fontWeight:700, fontSize:"clamp(0.5rem,0.9vw,0.72rem)", letterSpacing:"0.08em", color:"var(--silver)", whiteSpace:"nowrap" }}>
              NIKOLAOS KALAITZIDIS
            </span>
          </Link>
          <div style={{ display:"flex", gap:"clamp(1rem,2.5vw,2.5rem)", alignItems:"center" }}>
            <Link href="/"         className="about-nav-link">WORK</Link>
            <Link href="/about"    className="about-nav-link active">ABOUT</Link>
            <Link href="/#contact" className="about-nav-link">CONTACT</Link>
            <a href="mailto:nika-nikolaos@hotmail.com" style={{
              border:"1px solid rgba(224,224,224,0.4)", color:"var(--silver)",
              padding:"0.55rem 1.2rem", textDecoration:"none",
              fontFamily:"Syncopate,sans-serif", fontSize:"0.6rem", letterSpacing:"0.1em",
              transition:"border-color 0.2s, color 0.2s",
            }}>BOOK APPOINTMENT</a>
          </div>
        </nav>

        {/* ── Logo hero ───────────────────────────────────────────────────── */}
        <section style={{
          minHeight:"100vh", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", position:"relative",
        }}>
          <div style={{
            position:"absolute", inset:0,
            background:"radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,60,0,0.05) 0%, transparent 70%)",
            pointerEvents:"none",
          }} />

          <AnimatedLogo
            trigger={mounted}
            logoState={logoState}
            onDoubleClick={handleLogoBreak}
            onPileClick={handleLogoAssemble}
          />

          {/* Text pointer-events off when broken so it doesn't block pile clicks */}
          <p style={{
            fontFamily:"Share Tech Mono,monospace", fontSize:"0.62rem",
            letterSpacing:"0.28em", color:"rgba(224,224,224,0.28)", marginTop:"2.5rem",
            pointerEvents: logoState === "broken" ? "none" : "auto",
          }}>ARCHITECTURAL STUDIO</p>

          <div style={{
            position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)",
            display:"flex", flexDirection:"column", alignItems:"center", gap:"0.6rem",
          }}>
            <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.52rem", letterSpacing:"0.22em", color:"rgba(224,224,224,0.2)" }}>SCROLL</span>
            <div style={{ width:"1px", height:"50px", background:"linear-gradient(to bottom,var(--silver),transparent)", animation:"flow 2s infinite ease-in-out" }} />
          </div>
        </section>

        {/* ── Bio ─────────────────────────────────────────────────────────── */}
        <section style={{ padding:"clamp(5rem,10vw,10rem) clamp(1.5rem,6vw,6rem)", maxWidth:"1400px", margin:"0 auto" }}>
          <div className="bio-grid">
            <div style={{ position:"relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/profile.webp" alt="Nikolaos Kalaitzidis" style={{ width:"100%", maxWidth:"480px", display:"block", filter:"grayscale(0.1) contrast(1.05)" }} />
              <div style={{ position:"absolute", bottom:0, left:0, width:"38%", height:"3px", background:"var(--accent)" }} />
              <div style={{ position:"absolute", bottom:0, left:0, width:"3px", height:"28%", background:"var(--accent)" }} />
            </div>
            <div>
              <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.62rem", letterSpacing:"0.22em", color:"var(--accent)", marginBottom:"1.4rem" }}>001 / ABOUT ME</p>
              <h1 style={{ fontFamily:"Syncopate,sans-serif", fontWeight:700, fontSize:"clamp(1.8rem,3.5vw,3rem)", lineHeight:0.95, letterSpacing:"-0.03em", marginBottom:"2.5rem", color:"var(--silver)" }}>
                NIKOLAOS<br />KALAITZIDIS
              </h1>
              <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.82rem", lineHeight:1.95, color:"rgba(224,224,224,0.65)", marginBottom:"1.4rem" }}>
                Architectural engineer based in Athens, Greece. Friendly, versatile, and motivated — broadening my skills and seeking new opportunities to express creativity is my main drive. I enjoy working as part of a team on projects that push the boundaries of design.
              </p>
              <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.82rem", lineHeight:1.95, color:"rgba(224,224,224,0.42)" }}>
                Graduated from the Technical University of Crete in Architectural Engineering. Extended my studies at TU Wien through Erasmus+, in collaboration with the AIT Advanced Institute of Technology and CIL City Intelligent Lab.
              </p>
              <div style={{ marginTop:"3.5rem", display:"flex", gap:"3.5rem", flexWrap:"wrap" }}>
                {[["6+","YEARS EXP."],["10+","PROJECTS"],["GR / EU","BASED"]].map(([val,label]) => (
                  <div key={label}>
                    <div style={{ fontFamily:"Syncopate,sans-serif", fontWeight:700, fontSize:"1.6rem", color:"var(--silver)", letterSpacing:"-0.02em" }}>{val}</div>
                    <div style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.52rem", letterSpacing:"0.2em", color:"rgba(224,224,224,0.3)", marginTop:"0.4rem" }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:"2.5rem", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                {[["EMAIL","nika-nikolaos@hotmail.com"],["TEL","+30 693 959 8454"],["BASED","Athens, Greece"]].map(([label,val]) => (
                  <div key={label} style={{ display:"flex", gap:"1.2rem" }}>
                    <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.58rem", letterSpacing:"0.15em", color:"rgba(224,224,224,0.28)", minWidth:"52px" }}>{label}</span>
                    <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.58rem", color:"rgba(224,224,224,0.55)" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Skills ──────────────────────────────────────────────────────── */}
        <section ref={skillsRef} style={{ padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)", borderTop:"1px solid rgba(224,224,224,0.06)", maxWidth:"1400px", margin:"0 auto" }}>
          <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.62rem", letterSpacing:"0.22em", color:"var(--accent)", marginBottom:"1.2rem" }}>002 / EXPERTISE</p>
          <h2 style={{ fontFamily:"Syncopate,sans-serif", fontWeight:700, fontSize:"clamp(1.5rem,3vw,2.5rem)", letterSpacing:"-0.03em", marginBottom:"4rem", color:"var(--silver)", lineHeight:0.95 }}>
            SKILLS &amp;<br />TOOLS
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:"2.4rem" }}>
            {skills.map(({ name, level }, i) => (
              <div key={name}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.65rem" }}>
                  <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.68rem", letterSpacing:"0.15em", color:"var(--silver)" }}>{name}</span>
                  <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.62rem", letterSpacing:"0.1em", color:"rgba(224,224,224,0.3)" }}>{level}%</span>
                </div>
                <div style={{ height:"2px", background:"rgba(224,224,224,0.07)", position:"relative", overflow:"hidden" }}>
                  <div className="skill-bar-fill" style={{
                    transform: skillsFill ? `scaleX(${level/100})` : "scaleX(0)",
                    transition: skillsReady ? `transform 1.5s cubic-bezier(0.16,1,0.3,1) ${i*0.1}s` : "none",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Experience ──────────────────────────────────────────────────── */}
        <section style={{ padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)", borderTop:"1px solid rgba(224,224,224,0.06)" }}>
          <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.62rem", letterSpacing:"0.22em", color:"var(--accent)", marginBottom:"1.2rem" }}>003 / EXPERIENCE</p>
          <h2 style={{ fontFamily:"Syncopate,sans-serif", fontWeight:700, fontSize:"clamp(1.5rem,3vw,2.5rem)", letterSpacing:"-0.03em", marginBottom:"4rem", color:"var(--silver)", lineHeight:0.95 }}>
            SELECTED<br />WORK
          </h2>
          <div className="exp-grid">
            {experience.map(({ role, place, period, desc }) => (
              <div key={role} style={{ padding:"2.2rem", borderTop:"1px solid rgba(224,224,224,0.08)", borderLeft:"1px solid rgba(224,224,224,0.04)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem", gap:"1rem" }}>
                  <span style={{ fontFamily:"Syncopate,sans-serif", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.04em", color:"var(--silver)", lineHeight:1.4 }}>{role}</span>
                  <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.58rem", letterSpacing:"0.1em", color:"var(--accent)", whiteSpace:"nowrap" }}>{period}</span>
                </div>
                <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.62rem", letterSpacing:"0.08em", color:"rgba(224,224,224,0.38)", marginBottom:"1rem" }}>{place}</p>
                <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", lineHeight:1.85, color:"rgba(224,224,224,0.5)" }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop:"3rem", padding:"2rem", border:"1px solid rgba(224,224,224,0.06)" }}>
            <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.58rem", letterSpacing:"0.2em", color:"rgba(224,224,224,0.28)", marginBottom:"1.4rem" }}>WORKSHOPS &amp; EXHIBITIONS</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {[
                ["2023",'Rolex Arts Festival — PlayStreet Athens (Mentor: Gloria Cabral / presented to Anne Lacaton)'],
                ["2021",'UPDATE MY CITY — Chania Public Space, with UN-HABITAT & Center of Mediterranean Architecture'],
                ["2019",'Athina Poli Exhibition, Heraklion — Selected among 50 students to represent TUC'],
              ].map(([yr,desc]) => (
                <div key={yr} style={{ display:"flex", gap:"2rem", alignItems:"baseline" }}>
                  <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.6rem", color:"var(--accent)", minWidth:"36px" }}>{yr}</span>
                  <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.68rem", lineHeight:1.8, color:"rgba(224,224,224,0.5)" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Other pursuits ──────────────────────────────────────────────── */}
        <section style={{ padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)", borderTop:"1px solid rgba(224,224,224,0.06)" }}>
          <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.62rem", letterSpacing:"0.22em", color:"var(--accent)", marginBottom:"1.2rem" }}>004 / BEYOND ARCHITECTURE</p>
          <h2 style={{ fontFamily:"Syncopate,sans-serif", fontWeight:700, fontSize:"clamp(1.5rem,3vw,2.5rem)", letterSpacing:"-0.03em", marginBottom:"4rem", color:"var(--silver)", lineHeight:0.95 }}>
            OTHER<br />PURSUITS
          </h2>
          <div style={{ marginBottom:"4.5rem" }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:"1.2rem", marginBottom:"1.5rem" }}>
              <span style={{ fontFamily:"Syncopate,sans-serif", fontSize:"0.75rem", fontWeight:700, color:"var(--silver)", letterSpacing:"0.06em" }}>PHOTOGRAPHY</span>
              <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.58rem", letterSpacing:"0.14em", color:"rgba(224,224,224,0.28)" }}>ANALOG / DIGITAL</span>
            </div>
            <div className="pursuits-grid">
              {[1,2,3].map(n => (
                <div key={n} style={{ aspectRatio:"4/3", background:"#0d0d0d", border:"1px solid rgba(224,224,224,0.07)", overflow:"hidden", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://placehold.co/600x450/0d0d0d/1a1a1a" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.3 }} />
                  <span style={{ position:"absolute", fontFamily:"Share Tech Mono,monospace", fontSize:"0.55rem", letterSpacing:"0.18em", color:"rgba(224,224,224,0.18)" }}>COMING SOON</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:"4.5rem" }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:"1.2rem", marginBottom:"1.5rem" }}>
              <span style={{ fontFamily:"Syncopate,sans-serif", fontSize:"0.75rem", fontWeight:700, color:"var(--silver)", letterSpacing:"0.06em" }}>DRONE VIDEOGRAPHY</span>
              <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.58rem", letterSpacing:"0.14em", color:"rgba(224,224,224,0.28)" }}>AERIAL / CINEMATIC</span>
            </div>
            <div className="pursuits-grid">
              {droneImages.map((src,i) => (
                <div key={i} style={{ aspectRatio:"4/3", background:"#0d0d0d", border:"1px solid rgba(224,224,224,0.07)", overflow:"hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Drone shot ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                    onMouseEnter={e => (e.currentTarget.style.transform="scale(1.04)")}
                    onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Instagram placeholder ───────────────────────────────────────── */}
        <section style={{ borderTop:"1px solid rgba(224,224,224,0.06)", background:"#080808", padding:"clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,6rem)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.8rem", flexWrap:"wrap", gap:"1rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.85rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="var(--accent)" stroke="none"/>
              </svg>
              <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.65rem", letterSpacing:"0.18em", color:"var(--silver)" }}>@NK_DESIGNS</span>
            </div>
            <a href="https://instagram.com/NK_Designs" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"Syncopate,sans-serif", fontSize:"0.55rem", letterSpacing:"0.14em", color:"var(--accent)", textDecoration:"none", border:"1px solid rgba(255,60,0,0.35)", padding:"0.45rem 1rem" }}>FOLLOW ↗</a>
          </div>
          <div className="ig-grid">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} style={{ aspectRatio:"1/1", background:"#0d0d0d", border:"1px solid rgba(224,224,224,0.05)", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://placehold.co/300x300/0d0d0d/141414" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(224,224,224,0.1)" strokeWidth="1.2">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="rgba(224,224,224,0.1)" stroke="none"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.55rem", letterSpacing:"0.14em", color:"rgba(224,224,224,0.18)", marginTop:"1.4rem", textAlign:"center" }}>
            [ LIVE INSTAGRAM FEED — COMING SOON ]
          </p>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer style={{ padding:"2rem clamp(1.5rem,6vw,6rem)", borderTop:"1px solid rgba(224,224,224,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
          <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap" }}>
            <a href="https://linkedin.com/in/kontalis-nikos" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.58rem", color:"rgba(224,224,224,0.3)", letterSpacing:"0.1em", textDecoration:"none" }}>LINKEDIN ↗</a>
            <a href="https://instagram.com/NK_Designs" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.58rem", color:"rgba(224,224,224,0.3)", letterSpacing:"0.1em", textDecoration:"none" }}>INSTAGRAM ↗</a>
          </div>
          <Link href="/" style={{ fontFamily:"Syncopate,sans-serif", fontSize:"0.55rem", letterSpacing:"0.12em", color:"var(--accent)", textDecoration:"none" }}>
            BACK TO HOME ↑
          </Link>
        </footer>

      </main>
    </>
  );
}
