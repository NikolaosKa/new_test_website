"use client";
import { useState, useEffect, useRef } from "react";
import { Zap, ArrowRight, Link as LinkIcon, Box, PenTool, Building2, Monitor, Play, Code, Film, Camera, Navigation, Printer, Scissors, Layers } from "lucide-react";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  disableInteraction?: boolean;
  containerHeight?: string;
}

export default function RadialOrbitalTimeline({
  timelineData,
  disableInteraction = false,
  containerHeight = "100vh",
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableInteraction) return;
    if (e.target === containerRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    if (disableInteraction) return;
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      Object.keys(prev).forEach((k) => { newState[parseInt(k)] = false; });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relPulse: Record<number, boolean> = {};
        const cur = timelineData.find((i) => i.id === id);
        cur?.relatedIds.forEach((r) => { relPulse[r] = true; });
        setPulseEffect(relPulse);
        // Rotate so clicked node comes to top
        const idx = timelineData.findIndex((i) => i.id === id);
        setRotationAngle(270 - (idx / timelineData.length) * 360);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const nodePos = (index: number) => {
    const angle = ((index / timelineData.length) * 360 + rotationAngle) % 360;
    const rad = (angle * Math.PI) / 180;
    const radius = 200;
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
      zIndex: Math.round(100 + 50 * Math.cos(rad)),
      opacity: Math.max(0.35, Math.min(1, 0.35 + 0.65 * ((1 + Math.sin(rad)) / 2))),
    };
  };

  const isRelated = (id: number) => {
    if (!activeNodeId) return false;
    return (timelineData.find((i) => i.id === activeNodeId)?.relatedIds ?? []).includes(id);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        width: "100%",
        height: containerHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        position: "relative",
        background: "transparent",
      }}
    >
      {/* ── Orbit ring ──────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        width: "430px",
        height: "430px",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.05)",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />

      {/* ── Centre orb ──────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,60,0,0.75) 0%, rgba(255,60,0,0.12) 60%, transparent 100%)",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "rgba(255,60,0,0.9)",
          boxShadow: "0 0 18px rgba(255,60,0,0.65)",
        }} />
      </div>

      {/* ── Nodes ───────────────────────────────────────────────────── */}
      {timelineData.map((item, index) => {
        const pos = nodePos(index);
        const expanded = !!expandedItems[item.id];
        const related = isRelated(item.id);
        const pulsing = !!pulseEffect[item.id];
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              /* offset by half node size (20px) so the node centre lands on the orbit point */
              transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
              zIndex: expanded ? 200 : pos.zIndex,
              opacity: expanded ? 1 : pos.opacity,
              cursor: disableInteraction ? "default" : "pointer",
              transition: "opacity 0.4s ease, z-index 0s",
            }}
          >
            {/* Glow halo */}
            {pulsing && (
              <div style={{
                position: "absolute",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,60,0,0.18) 0%, transparent 70%)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                animation: "orbPulse 1.5s ease-in-out infinite",
                pointerEvents: "none",
              }} />
            )}

            {/* Node circle */}
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: expanded ? "rgba(255,60,0,0.85)" : related ? "rgba(255,60,0,0.22)" : "rgba(10,10,10,0.95)",
              border: `2px solid ${expanded ? "rgba(255,60,0,1)" : related ? "rgba(255,60,0,0.65)" : "rgba(255,255,255,0.18)"}`,
              boxShadow: expanded ? "0 0 22px rgba(255,60,0,0.5)" : related ? "0 0 10px rgba(255,60,0,0.28)" : "none",
              transform: expanded ? "scale(1.5)" : "scale(1)",
              transition: "transform 0.3s ease, background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease",
              color: expanded ? "#fff" : "rgba(224,224,224,0.65)",
              flexShrink: 0,
            }}>
              <Icon size={14} />
            </div>

            {/* Label */}
            <div style={{
              position: "absolute",
              top: "46px",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.38rem",
              letterSpacing: "0.14em",
              color: expanded ? "rgba(255,60,0,0.9)" : "rgba(224,224,224,0.42)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              transition: "color 0.3s ease",
            }}>
              {item.title}
            </div>

            {/* Expanded card */}
            {expanded && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: "64px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "260px",
                  background: "rgba(8,8,8,0.97)",
                  border: "1px solid rgba(255,60,0,0.22)",
                  backdropFilter: "blur(20px)",
                  zIndex: 300,
                  animation: "cardIn 0.22s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {/* Connector line */}
                <div style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "1px",
                  height: "12px",
                  background: "rgba(255,60,0,0.4)",
                }} />

                {/* Header */}
                <div style={{ padding: "1rem 1rem 0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.36rem",
                      letterSpacing: "0.14em",
                      padding: "0.2rem 0.55rem",
                      border: item.status === "completed" ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(0,0,0,0.5)",
                      background: item.status === "completed" ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
                      color: item.status === "completed" ? "#fff" : "#000",
                    }}>
                      {item.status === "completed" ? "EXPERT" : item.status === "in-progress" ? "PROFICIENT" : "LEARNING"}
                    </span>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.4rem", color: "rgba(255,60,0,0.65)", letterSpacing: "0.08em" }}>
                      {item.date}
                    </span>
                  </div>
                  <div style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.52rem", color: "var(--silver)", letterSpacing: "0.04em", lineHeight: 1.3 }}>
                    {item.title}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "0 1rem 1rem" }}>
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.56rem", color: "rgba(224,224,224,0.52)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
                    {item.content}
                  </p>

                  {/* Proficiency bar */}
                  <div style={{ marginBottom: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.44rem", color: "rgba(224,224,224,0.32)" }}>
                        <Zap size={8} style={{ color: "rgba(255,60,0,0.7)" }} />
                        PROFICIENCY
                      </span>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.44rem", color: "rgba(255,60,0,0.8)", fontWeight: 700 }}>
                        {item.energy}%
                      </span>
                    </div>
                    <div style={{ height: "2px", background: "rgba(255,255,255,0.07)", borderRadius: "1px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${item.energy}%`, background: "linear-gradient(to right, rgba(255,60,0,0.9), rgba(255,60,0,0.35))" }} />
                    </div>
                  </div>

                  {/* Related skills */}
                  {item.relatedIds.length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "0.5rem", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.38rem", letterSpacing: "0.12em", color: "rgba(224,224,224,0.25)" }}>
                        <LinkIcon size={8} />
                        RELATED SKILLS
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {item.relatedIds.map((relId) => {
                          const rel = timelineData.find((i) => i.id === relId);
                          return (
                            <button
                              key={relId}
                              onClick={(e) => { e.stopPropagation(); toggleItem(relId); }}
                              style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: "0.36rem",
                                letterSpacing: "0.1em",
                                padding: "0.22rem 0.55rem",
                                border: "1px solid rgba(255,255,255,0.15)",
                                background: "transparent",
                                color: "rgba(224,224,224,0.6)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                transition: "border-color 0.2s, color 0.2s",
                              }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,60,0,0.5)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,60,0,0.9)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(224,224,224,0.6)"; }}
                            >
                              {rel?.title}
                              <ArrowRight size={7} style={{ color: "rgba(255,60,0,0.55)" }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes orbPulse {
          0%,100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 0.2; transform: translate(-50%,-50%) scale(1.4); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Skills data ───────────────────────────────────────────────────────────────
export const skillsTimelineData: TimelineItem[] = [
  { id:1,  title:"RHINO + GRASSHOPPER", date:"PARAMETRIC",   content:"Primary parametric modeling and computational design tool. Grasshopper scripting for generative workflows and architectural optimization.", category:"Design",       icon:Box,       relatedIds:[2,3],   status:"completed",   energy:92 },
  { id:2,  title:"AUTOCAD",             date:"DRAFTING",      content:"Technical drafting and construction documentation. Precision 2D/3D drawing for architectural deliverables.",                               category:"Design",       icon:PenTool,   relatedIds:[1,3],   status:"completed",   energy:88 },
  { id:3,  title:"ARCHICAD",            date:"BIM",           content:"Building Information Modeling for integrated design and documentation. Full project lifecycle management.",                                   category:"Design",       icon:Building2, relatedIds:[1,2],   status:"completed",   energy:80 },
  { id:4,  title:"SKETCHUP + V-RAY",    date:"VISUALIZATION", content:"Conceptual modeling with high-quality photorealistic rendering. Rapid design exploration and client presentation.",                           category:"Visualization",icon:Layers,    relatedIds:[5,1],   status:"in-progress", energy:78 },
  { id:5,  title:"LUMION / TWINMOTION", date:"RENDERING",     content:"Real-time architectural visualization and walkthrough animations. Immersive environment rendering for presentations.",                         category:"Visualization",icon:Play,      relatedIds:[4,6],   status:"in-progress", energy:75 },
  { id:6,  title:"BLENDER",             date:"3D MODELING",   content:"Advanced 3D modeling, sculpting, and animation for complex organic forms and environmental visualization.",                                    category:"3D",           icon:Code,      relatedIds:[5,11],  status:"in-progress", energy:68 },
  { id:7,  title:"ADOBE SUITE",         date:"CREATIVE",      content:"Photoshop, Illustrator, InDesign for presentation layouts, image editing, and graphic communication.",                                        category:"Media",        icon:Monitor,   relatedIds:[8,9],   status:"completed",   energy:85 },
  { id:8,  title:"PREMIERE PRO",        date:"VIDEO",         content:"Video editing and post-production for architectural films, drone footage, and project documentation reels.",                                   category:"Media",        icon:Film,      relatedIds:[7,10],  status:"in-progress", energy:72 },
  { id:9,  title:"PHOTOGRAPHY",         date:"VISUAL",        content:"Architectural and landscape photography — composition, lighting, and post-processing for documentary and portfolio work.",                     category:"Media",        icon:Camera,    relatedIds:[7,10],  status:"completed",   energy:90 },
  { id:10, title:"DRONE OPERATION",     date:"AERIAL",        content:"Licensed drone pilot. Aerial photography and videography for site surveys, construction documentation, and cinematic footage.",               category:"Media",        icon:Navigation,relatedIds:[8,9],   status:"completed",   energy:85 },
  { id:11, title:"3D PRINTING",         date:"FABRICATION",   content:"FDM and resin 3D printing for architectural scale models, prototypes, and fabrication studies.",                                              category:"Fabrication",  icon:Printer,   relatedIds:[6,12],  status:"in-progress", energy:72 },
  { id:12, title:"MODEL MAKING",        date:"CRAFT",         content:"Hand-crafted architectural scale models. Precision cutting, material exploration, and physical prototype development.",                         category:"Fabrication",  icon:Scissors,  relatedIds:[11,3],  status:"completed",   energy:88 },
];
