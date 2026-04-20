"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

const aboutProjectsData = [
  { title: "NEXT STATION",     href: "/projects/next-station",    cat: "SPATIAL SYSTEMS"    },
  { title: "WHITE LEAF",       href: "/projects/white-leaf",      cat: "SPATIAL SYSTEMS"    },
  { title: "LITHOS",           href: "/projects/lithos",          cat: "SPATIAL SYSTEMS"    },
  { title: "OH",               href: "/projects/oh",              cat: "SPATIAL SYSTEMS"    },
  { title: "SPATIAL SYSTEMS",  href: "/projects/spatial-systems", cat: "CATEGORY"           },
  { title: "CONTACT",          href: "/contact",                  cat: "PAGE"               },
];

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
// 18 pieces: left pole ×5, right pole ×5, left bar ×2, right bar ×2,
//            triangle ×4 (sub-divided).
// Pole pieces rotate ≈±64° so they land horizontally (like snapped rods).
// Bars already horizontal — small tilt ±10-14°.
// Triangle split into 4 sub-triangles — moderate rotations ±15-25°.
// Break order: top → bottom, one piece every ~0.20s.
// The "CLICK TO RESTORE" hint is rendered OUTSIDE the pieces container at high
// z-index so it always appears above the fallen geometry.

type LogoState = "idle" | "breaking" | "broken" | "assembling";

// SVG coordinate reference:
//   Left pole:  (203.23,1.08)→(54.64,310.53)  step dx=-29.718 dy=+61.89
//   Right pole: (136.85,22.02)→(237.45,235.98) step dx=+20.12  dy=+42.792
//   Left bar:   M0,211.47H126.29  split at x=63.15
//   Right bar:  M203.23,211.47H324.26 split at x=263.74
//   Triangle:   A(164.6,131.8) B(115.79,233.31) C(213.85,233.31)
//               midpoints M_AB(140.2,182.56) M_AC(189.23,182.56) M_BC(164.82,233.31)
//
// fallY: px the piece drops at ~211px render height. Target pile centre ≈175 px.
//   Formula: fallY = 175 - (svgCentreY × 211/311.61), clamped ≥ 5 px.
//
// rot: CSS rotation degrees at rest — pole pieces near ±64° to appear horizontal.
// origin: transform-origin = (svgCentreX/324.26 × 100%, svgCentreY/311.61 × 100%)
const PIECES = [
  // Left pole — 5 segments, rotate CW ~64° (pole goes down-left, becomes horiz)
  { id:"lp1", fallY:153, fallX:-2, rot: 64, breakDelay:0.00, asmDelay:0.66, breakDur:0.60, asmDur:0.82, origin:"58% 10%" },
  { id:"lp2", fallY:111, fallX: 0, rot: 66, breakDelay:0.60, asmDelay:0.53, breakDur:0.51, asmDur:0.80, origin:"49% 30%" },
  { id:"lp3", fallY: 69, fallX: 2, rot: 63, breakDelay:1.00, asmDelay:0.44, breakDur:0.40, asmDur:0.76, origin:"40% 50%" },
  { id:"lp4", fallY: 27, fallX:-1, rot: 65, breakDelay:2.55, asmDelay:0.10, breakDur:0.25, asmDur:0.70, origin:"31% 70%" },
  { id:"lp5", fallY:  5, fallX: 1, rot: 62, breakDelay:3.00, asmDelay:0.00, breakDur:0.20, asmDur:0.68, origin:"21% 90%" },

  // Right pole — 5 segments, rotate CCW ~-64° (pole goes down-right, becomes horiz)
  { id:"rp1", fallY:146, fallX: 2, rot:-64, breakDelay:0.20, asmDelay:0.62, breakDur:0.59, asmDur:0.82, origin:"45% 14%" },
  { id:"rp2", fallY:117, fallX:-1, rot:-66, breakDelay:0.40, asmDelay:0.57, breakDur:0.52, asmDur:0.80, origin:"52% 28%" },
  { id:"rp3", fallY: 88, fallX: 3, rot:-63, breakDelay:0.80, asmDelay:0.48, breakDur:0.45, asmDur:0.77, origin:"58% 41%" },
  { id:"rp4", fallY: 59, fallX:-2, rot:-65, breakDelay:1.40, asmDelay:0.35, breakDur:0.37, asmDur:0.73, origin:"64% 55%" },
  { id:"rp5", fallY: 30, fallX: 1, rot:-62, breakDelay:2.40, asmDelay:0.13, breakDur:0.27, asmDur:0.70, origin:"70% 69%" },

  // Left bar — 2 halves, already horizontal, small tilt
  { id:"lb1", fallY: 32, fallX:-3, rot:-14, breakDelay:1.80, asmDelay:0.26, breakDur:0.27, asmDur:0.70, origin:"10% 68%" },
  { id:"lb2", fallY: 32, fallX: 1, rot: 11, breakDelay:1.95, asmDelay:0.23, breakDur:0.27, asmDur:0.70, origin:"29% 68%" },

  // Right bar — 2 halves, already horizontal, small tilt
  { id:"rb1", fallY: 32, fallX:-1, rot: 13, breakDelay:2.10, asmDelay:0.20, breakDur:0.27, asmDur:0.70, origin:"72% 68%" },
  { id:"rb2", fallY: 32, fallX: 3, rot:-10, breakDelay:2.25, asmDelay:0.17, breakDur:0.27, asmDur:0.70, origin:"91% 68%" },

  // Triangle — 4 sub-triangles
  { id:"t1",  fallY: 63, fallX: 0, rot:-25, breakDelay:1.20, asmDelay:0.40, breakDur:0.38, asmDur:0.74, origin:"51% 53%" },
  { id:"t4",  fallY: 40, fallX: 1, rot: 15, breakDelay:1.60, asmDelay:0.31, breakDur:0.31, asmDur:0.71, origin:"51% 64%" },
  { id:"t2",  fallY: 28, fallX:-2, rot: 20, breakDelay:2.70, asmDelay:0.07, breakDur:0.26, asmDur:0.68, origin:"43% 69%" },
  { id:"t3",  fallY: 28, fallX: 2, rot:-18, breakDelay:2.85, asmDelay:0.03, breakDur:0.26, asmDur:0.68, origin:"58% 69%" },
] as const;

// Per-piece CSS keyframes.
// break: ease-in (gravity) with 5% Y-overshoot at 72% + 2% bounce at 86%.
//        Rotation also overshoots 12% at 72%, undershoots 7% at 86%, settles.
// assemble: spring return — starts from broken position, 7px overshoot at 85%.
const PIECE_KEYFRAMES = PIECES.map(p => {
  const oy  = p.fallY + Math.round(p.fallY * 0.055);
  const uy  = p.fallY - Math.round(p.fallY * 0.020);
  const or_ = +(p.rot * 1.12).toFixed(1);
  const ur_ = +(p.rot * 0.93).toFixed(1);
  return `
    @keyframes break-${p.id} {
      0%   { transform: translateY(0px)          translateX(0px)          rotate(0deg);        }
      72%  { transform: translateY(${oy}px)      translateX(${p.fallX}px) rotate(${or_}deg);   }
      86%  { transform: translateY(${uy}px)      translateX(${p.fallX}px) rotate(${ur_}deg);   }
      100% { transform: translateY(${p.fallY}px) translateX(${p.fallX}px) rotate(${p.rot}deg); }
    }
    @keyframes assemble-${p.id} {
      from { transform: translateY(${p.fallY}px) translateX(${p.fallX}px) rotate(${p.rot}deg); }
      85%  { transform: translateY(-7px)          translateX(0px)          rotate(0deg);         }
      100% { transform: translateY(0px)           translateX(0px)          rotate(0deg);         }
    }`;
}).join('\n');

// SVG content for each piece
function PieceContent({ id }: { id: string }) {
  const sm = { strokeMiterlimit: 10 } as const;

  // Left pole — 5 segments
  if (id === "lp1") return <line {...sm} x1="203.23" y1="1.08"   x2="173.51" y2="62.97"  stroke="#fff" strokeWidth="5" fill="none" />;
  if (id === "lp2") return <line {...sm} x1="173.51" y1="62.97"  x2="143.79" y2="124.86" stroke="#fff" strokeWidth="5" fill="none" />;
  if (id === "lp3") return <line {...sm} x1="143.79" y1="124.86" x2="114.07" y2="186.75" stroke="#fff" strokeWidth="5" fill="none" />;
  if (id === "lp4") return <line {...sm} x1="114.07" y1="186.75" x2="84.35"  y2="248.64" stroke="#fff" strokeWidth="5" fill="none" />;
  if (id === "lp5") return <line {...sm} x1="84.35"  y1="248.64" x2="54.64"  y2="310.53" stroke="#fff" strokeWidth="5" fill="none" />;

  // Right pole — 5 segments
  if (id === "rp1") return <line {...sm} x1="136.85" y1="22.02"  x2="156.97" y2="64.81"  stroke="#fff" strokeWidth="4" fill="none" />;
  if (id === "rp2") return <line {...sm} x1="156.97" y1="64.81"  x2="177.09" y2="107.60" stroke="#fff" strokeWidth="4" fill="none" />;
  if (id === "rp3") return <line {...sm} x1="177.09" y1="107.60" x2="197.21" y2="150.39" stroke="#fff" strokeWidth="4" fill="none" />;
  if (id === "rp4") return <line {...sm} x1="197.21" y1="150.39" x2="217.33" y2="193.18" stroke="#fff" strokeWidth="4" fill="none" />;
  if (id === "rp5") return <line {...sm} x1="217.33" y1="193.18" x2="237.45" y2="235.98" stroke="#fff" strokeWidth="4" fill="none" />;

  // Left bar — 2 halves
  if (id === "lb1") return <line {...sm} x1="0"     y1="211.47" x2="63.15"  y2="211.47" stroke="#fff" strokeWidth="6" fill="none" />;
  if (id === "lb2") return <line {...sm} x1="63.15" y1="211.47" x2="126.29" y2="211.47" stroke="#fff" strokeWidth="6" fill="none" />;

  // Right bar — 2 halves
  if (id === "rb1") return <line {...sm} x1="203.23" y1="211.47" x2="263.74" y2="211.47" stroke="#fff" strokeWidth="6" fill="none" />;
  if (id === "rb2") return <line {...sm} x1="263.74" y1="211.47" x2="324.26" y2="211.47" stroke="#fff" strokeWidth="6" fill="none" />;

  // Triangle — 4 sub-triangles sharing the same gradient
  const gradId = `triG-${id}`;
  const gradDef = (
    <linearGradient id={gradId} x1="142.73" y1="251.49" x2="205.05" y2="159.09" gradientUnits="userSpaceOnUse">
      <stop offset="0"   stopColor="#fff"    stopOpacity="1"  />
      <stop offset=".33" stopColor="#f4f4f4" stopOpacity=".95"/>
      <stop offset=".55" stopColor="#d5d4d4" stopOpacity=".81"/>
      <stop offset=".74" stopColor="#9f9d9e" stopOpacity=".57"/>
      <stop offset=".91" stopColor="#535051" stopOpacity=".22"/>
      <stop offset="1"   stopColor="#231f20" stopOpacity="0"  />
    </linearGradient>
  );
  // t1 = apex triangle, t2 = bottom-left, t3 = bottom-right, t4 = center
  if (id === "t1") return (
    <><defs>{gradDef}</defs>
    <polygon {...sm} points="164.6,131.8 140.2,182.56 189.23,182.56"
      fill={`url(#${gradId})`} stroke="#fff" strokeWidth="2.5" /></>
  );
  if (id === "t2") return (
    <><defs>{gradDef}</defs>
    <polygon {...sm} points="140.2,182.56 115.79,233.31 164.82,233.31"
      fill={`url(#${gradId})`} stroke="#fff" strokeWidth="2.5" /></>
  );
  if (id === "t3") return (
    <><defs>{gradDef}</defs>
    <polygon {...sm} points="189.23,182.56 164.82,233.31 213.85,233.31"
      fill={`url(#${gradId})`} stroke="#fff" strokeWidth="2.5" /></>
  );
  if (id === "t4") return (
    <><defs>{gradDef}</defs>
    <polygon {...sm} points="140.2,182.56 189.23,182.56 164.82,233.31"
      fill={`url(#${gradId})`} stroke="#fff" strokeWidth="2.5" /></>
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

  const pieceAnim = (p: typeof PIECES[number]) => {
    if (logoState === "breaking" || logoState === "broken")
      return `break-${p.id} ${p.breakDur}s ease-in ${p.breakDelay}s both`;
    if (logoState === "assembling")
      return `assemble-${p.id} ${p.asmDur}s cubic-bezier(0.16,1,0.3,1) ${p.asmDelay}s both`;
    return "none";
  };

  return (
    // Outer wrapper — position:relative so we can absolutely-place the hint inside it
    <div style={{ position: "relative", display: "inline-block" }}>
      <style>{PIECE_KEYFRAMES}</style>

      {/* ── Idle logo (draw animation) ─────────────────────────────────────── */}
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

      {/* ── Pieces layer (breaking / broken / assembling) ──────────────────── */}
      {showPieces && (
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

          {/* Invisible pile click zone — covers the landing area (70-100% of container).
              zIndex:100 ensures it renders above animated pieces. */}
          <div
            onClick={logoState === "broken" ? onPileClick : undefined}
            style={{
              position: "absolute",
              top: "68%",
              left: 0,
              width: "100%",
              height: "120px",
              cursor: logoState === "broken" ? "pointer" : "default",
              zIndex: 100,
            }}
          />
        </div>
      )}

      {/* ── CLICK TO RESTORE hint — outside pieces container at high z-index ── */}
      {/* Rendered at top:44% of the outer wrapper = ~93px from container top.
          Pile visually lands at ~175px from container top → hint is ~82px above pile. */}
      {logoState === "broken" && (
        <div
          style={{
            position: "absolute",
            top: "44%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 200,
            pointerEvents: "none",
            animation: "alFadeIn 0.6s ease 0.4s both",
          }}
        >
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.44rem",
            letterSpacing: "0.22em",
            color: "rgba(224,224,224,0.45)",
            whiteSpace: "nowrap",
          }}>
            ↓ CLICK PILE TO RESTORE
          </span>
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

  // Nav overlay state
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = searchQuery.trim().length > 0
    ? aboutProjectsData.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.cat.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
    else setSearchQuery("");
  }, [searchOpen]);

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
    // Last piece (lp5) lands at 3.00 + 0.20 = 3.20 s → broken at 3.4 s
    logoTimerRef.current = setTimeout(() => setLogoState("broken"), 3400);
  };

  const handleLogoAssemble = () => {
    if (logoState !== "broken") return;
    setLogoState("assembling");
    // Last piece (lp1) finishes at 0.66 + 0.82 = 1.48 s → idle at 1.65 s
    logoTimerRef.current = setTimeout(() => setLogoState("idle"), 1650);
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
          <div style={{ display:"flex", gap:"clamp(0.8rem,2vw,2rem)", alignItems:"center" }}>
            <div className="nav-links" style={{ display:"flex", gap:"clamp(1rem,2.5vw,2.5rem)", alignItems:"center" }}>
              <Link href="/"       className="about-nav-link">WORK</Link>
              <Link href="/about"  className="about-nav-link active">ABOUT</Link>
              <Link href="/contact" className="about-nav-link">CONTACT</Link>
            </div>
            <button onClick={() => { setSearchOpen(v => !v); setMenuOpen(false); }}
              style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(224,224,224,0.6)", padding:"4px", display:"flex", alignItems:"center", transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color="var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color=searchOpen?"var(--accent)":"rgba(224,224,224,0.6)")}>
              <Search size={16} />
            </button>
            <button onClick={() => { setMenuOpen(v => !v); setSearchOpen(false); }}
              style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(224,224,224,0.6)", padding:"4px", display:"flex", alignItems:"center", transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color="var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color=menuOpen?"var(--accent)":"rgba(224,224,224,0.6)")}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* ── Hamburger overlay ───────────────────────────────────────────── */}
        {menuOpen && (
          <div style={{ position:"fixed", inset:0, zIndex:45, background:"rgba(6,6,6,0.97)", backdropFilter:"blur(12px)", display:"flex", flexDirection:"column", padding:"clamp(6rem,10vw,8rem) clamp(1.5rem,6vw,6rem) 3rem", overflowY:"auto", animation:"menuSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
            <style>{`@keyframes menuSlideIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.54rem", letterSpacing:"0.22em", color:"var(--accent)", marginBottom:"3rem" }}>NAVIGATE</p>
            <div style={{ display:"flex", flexDirection:"column" }}>
              {[{ label:"WORK", href:"/", isLink:true },{ label:"ABOUT", href:"/about", isLink:true },{ label:"CONTACT", href:"/contact", isLink:true }].map(({ label, href }) => (
                <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{ fontFamily:"Syncopate,sans-serif", fontWeight:700, fontSize:"clamp(1.6rem,5vw,4rem)", letterSpacing:"-0.02em", color:"rgba(224,224,224,0.8)", textDecoration:"none", padding:"0.6rem 0", borderBottom:"1px solid rgba(224,224,224,0.06)", transition:"color 0.2s, padding-left 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="#fff"; (e.currentTarget as HTMLAnchorElement).style.paddingLeft="0.5rem"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="rgba(224,224,224,0.8)"; (e.currentTarget as HTMLAnchorElement).style.paddingLeft="0"; }}>
                  {label}
                </Link>
              ))}
            </div>
            <div style={{ marginTop:"3rem" }}>
              <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.52rem", letterSpacing:"0.2em", color:"rgba(224,224,224,0.3)", marginBottom:"1.5rem" }}>PROJECTS</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
                {aboutProjectsData.filter(p => p.cat !== "PAGE").map(p => (
                  <Link key={p.title} href={p.href} onClick={() => setMenuOpen(false)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", textDecoration:"none", padding:"0.6rem 0", borderBottom:"1px solid rgba(224,224,224,0.04)", gap:"1rem", transition:"padding-left 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.paddingLeft="0.4rem"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.paddingLeft="0"; }}>
                    <span style={{ fontFamily:"Syncopate,sans-serif", fontSize:"clamp(0.65rem,1.2vw,0.85rem)", letterSpacing:"0.04em", color:"rgba(224,224,224,0.7)" }}>{p.title}</span>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.46rem", letterSpacing:"0.14em", color:"rgba(224,224,224,0.25)" }}>{p.cat}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Search overlay ───────────────────────────────────────────────── */}
        {searchOpen && (
          <div style={{ position:"fixed", inset:0, zIndex:46, background:"rgba(6,6,6,0.95)", backdropFilter:"blur(16px)", display:"flex", flexDirection:"column", alignItems:"center", padding:"clamp(6rem,10vw,8rem) clamp(1.5rem,6vw,6rem) 3rem", animation:"menuSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ width:"100%", maxWidth:"680px", position:"relative", marginBottom:"3rem" }}>
              <Search size={16} style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", color:"rgba(224,224,224,0.3)", pointerEvents:"none" }} />
              <input ref={searchInputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="SEARCH PROJECTS, PAGES..."
                style={{ width:"100%", background:"none", border:"none", borderBottom:"1px solid rgba(224,224,224,0.2)", padding:"1rem 1rem 1rem 2rem", fontFamily:"Syncopate,sans-serif", fontSize:"clamp(1rem,2.5vw,1.5rem)", letterSpacing:"0.04em", color:"var(--silver)", outline:"none" }} />
            </div>
            {searchQuery.trim().length > 0 && (
              <div style={{ width:"100%", maxWidth:"680px" }}>
                {searchResults.length === 0
                  ? <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.6rem", color:"rgba(224,224,224,0.3)", letterSpacing:"0.18em" }}>NO RESULTS FOUND</p>
                  : <div style={{ display:"flex", flexDirection:"column" }}>
                      {searchResults.map(p => (
                        <Link key={p.title} href={p.href} onClick={() => setSearchOpen(false)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.2rem 0", borderBottom:"1px solid rgba(224,224,224,0.06)", textDecoration:"none", gap:"1rem", transition:"padding-left 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.paddingLeft="0.5rem")}
                          onMouseLeave={e => (e.currentTarget.style.paddingLeft="0")}>
                          <div>
                            <div style={{ fontFamily:"Syncopate,sans-serif", fontSize:"clamp(0.75rem,1.5vw,1rem)", letterSpacing:"0.04em", color:"var(--silver)", marginBottom:"0.3rem" }}>{p.title}</div>
                            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.48rem", letterSpacing:"0.14em", color:"rgba(224,224,224,0.3)" }}>{p.cat}</div>
                          </div>
                          <span style={{ color:"var(--accent)", fontSize:"1rem" }}>→</span>
                        </Link>
                      ))}
                    </div>
                }
              </div>
            )}
            {searchQuery.trim().length === 0 && (
              <div style={{ width:"100%", maxWidth:"680px" }}>
                <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.52rem", color:"rgba(224,224,224,0.25)", letterSpacing:"0.18em", marginBottom:"2rem" }}>QUICK ACCESS</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"0.6rem" }}>
                  {aboutProjectsData.map(p => (
                    <Link key={p.title} href={p.href} onClick={() => setSearchOpen(false)} style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.5rem", letterSpacing:"0.14em", color:"rgba(224,224,224,0.5)", border:"1px solid rgba(224,224,224,0.1)", padding:"0.4rem 0.9rem", textDecoration:"none", transition:"border-color 0.2s, color 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,60,0,0.4)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="rgba(224,224,224,0.5)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(224,224,224,0.1)"; }}>
                      {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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

          {/* Text pointer-events off when broken so pile clicks pass through */}
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
              <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.65rem", letterSpacing:"0.18em", color:"var(--silver)" }}>@NIKOS__KA</span>
            </div>
            <a href="https://www.instagram.com/nikos__ka?igsh=d2o0NTkwczFud2l2" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"Syncopate,sans-serif", fontSize:"0.55rem", letterSpacing:"0.14em", color:"var(--accent)", textDecoration:"none", border:"1px solid rgba(255,60,0,0.35)", padding:"0.45rem 1rem" }}>FOLLOW ↗</a>
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
            <a href="https://www.instagram.com/nikos__ka?igsh=d2o0NTkwczFud2l2" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.58rem", color:"rgba(224,224,224,0.3)", letterSpacing:"0.1em", textDecoration:"none" }}>INSTAGRAM ↗</a>
          </div>
          <Link href="/" style={{ fontFamily:"Syncopate,sans-serif", fontSize:"0.55rem", letterSpacing:"0.12em", color:"var(--accent)", textDecoration:"none" }}>
            BACK TO HOME ↑
          </Link>
        </footer>

      </main>
    </>
  );
}
