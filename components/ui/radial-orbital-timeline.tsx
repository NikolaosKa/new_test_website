"use client";
import { useState, useEffect, useRef } from "react";
import { Zap, PenTool, Building2, Box, Play, Layers, Palette, Film, Camera, Wind, Printer, Wrench, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: LucideIcon;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export const skillsTimelineData: TimelineItem[] = [
  { id: 1,  title: "RHINO + GH",        date: "ONGOING", content: "Parametric modeling and computational design workflows for complex geometry generation and fabrication-ready output.", category: "PARAMETRIC", icon: Zap,       relatedIds: [2, 7],  status: "completed",   energy: 92 },
  { id: 2,  title: "AUTOCAD",           date: "ONGOING", content: "Technical drawing and 2D drafting for construction documentation, permits, and professional deliverables.",            category: "DRAFTING",   icon: PenTool,   relatedIds: [1, 3],  status: "completed",   energy: 88 },
  { id: 3,  title: "ARCHICAD",          date: "ONGOING", content: "BIM-based architectural design and full-cycle documentation for residential and commercial building projects.",         category: "BIM",        icon: Building2, relatedIds: [2, 4],  status: "completed",   energy: 80 },
  { id: 4,  title: "SKETCHUP + V-RAY",  date: "ONGOING", content: "3D concept modeling and photorealistic rendering for design visualization and client presentations.",                  category: "RENDER",     icon: Box,       relatedIds: [3, 5],  status: "completed",   energy: 78 },
  { id: 5,  title: "LUMION",            date: "ONGOING", content: "Real-time architectural visualization and animation for immersive design walkthroughs and competition submissions.",    category: "REALTIME",   icon: Play,      relatedIds: [4, 6],  status: "completed",   energy: 75 },
  { id: 6,  title: "BLENDER",           date: "ONGOING", content: "3D modeling, sculpting, and animation for architectural visualization and experimental design exploration.",            category: "3D",         icon: Layers,    relatedIds: [5, 7],  status: "in-progress", energy: 68 },
  { id: 7,  title: "ADOBE SUITE",       date: "ONGOING", content: "Graphic design, image post-processing, and portfolio production using Photoshop, Illustrator, and InDesign.",         category: "DESIGN",     icon: Palette,   relatedIds: [1, 8],  status: "completed",   energy: 85 },
  { id: 8,  title: "PREMIERE PRO",      date: "ONGOING", content: "Video editing and motion graphics for architectural films, drone footage post-production, and social content.",        category: "VIDEO",      icon: Film,      relatedIds: [7, 9],  status: "completed",   energy: 72 },
  { id: 9,  title: "PHOTOGRAPHY",       date: "ONGOING", content: "Analog and digital photography for architectural documentation and artistic long-term personal projects.",             category: "CRAFT",      icon: Camera,    relatedIds: [8, 10], status: "completed",   energy: 90 },
  { id: 10, title: "DRONE OPS",         date: "ONGOING", content: "Licensed drone pilot specializing in aerial cinematography and architectural site documentation from the air.",       category: "AERIAL",     icon: Wind,      relatedIds: [9, 11], status: "completed",   energy: 85 },
  { id: 11, title: "3D PRINTING",       date: "ONGOING", content: "Digital fabrication and rapid prototyping for architectural scale models and iterative design exploration.",           category: "FABRICATION",icon: Printer,   relatedIds: [10, 12], status: "completed",  energy: 72 },
  { id: 12, title: "MODEL MAKING",      date: "ONGOING", content: "Physical architectural model construction using laser cutting, CNC routing, and traditional hand-crafted techniques.", category: "FABRICATION",icon: Wrench,    relatedIds: [11, 1], status: "completed",   energy: 88 },
];

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click anywhere outside nodes → reset rotation
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isNode = Object.values(nodeRefs.current).some(
      (ref) => ref && (ref === target || ref.contains(target))
    );
    if (!isNode) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = (itemId: number): number[] => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  // Hover enter — show card
  const handleNodeEnter = (id: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setExpandedItems(() => {
      const newState: Record<number, boolean> = {};
      newState[id] = true;
      return newState;
    });
    setActiveNodeId(id);
    setAutoRotate(false);
    const related: Record<number, boolean> = {};
    getRelatedItems(id).forEach((relId) => { related[relId] = true; });
    setPulseEffect(related);
    const nodeIndex = timelineData.findIndex((item) => item.id === id);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  // Hover leave — small delay before collapsing (lets user move into card)
  const handleNodeLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }, 200);
  };

  // Keep card open when cursor enters the card itself
  const handleCardEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handleCardLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }, 120);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (autoRotate) {
      timer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
      }, 50);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [autoRotate]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusLabel = (status: TimelineItem["status"]): string => {
    if (status === "completed") return "COMPLETE";
    if (status === "in-progress") return "IN PROGRESS";
    return "PENDING";
  };

  const getStatusClass = (status: TimelineItem["status"]): string => {
    if (status === "completed") return "text-white bg-black border-white/30";
    if (status === "in-progress") return "text-black bg-white border-black";
    return "text-white/50 bg-black/40 border-white/20";
  };

  return (
    <div
      className="relative w-full overflow-visible"
      style={{ height: "520px", background: "transparent" }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Orbit ring */}
      <div
        ref={orbitRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "420px",
          height: "420px",
        }}
      >
        {/* Orbit circle */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.06)",
        }} />

        {/* Center core */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "48px", height: "48px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,60,0,0.6) 0%, rgba(255,60,0,0.15) 60%, transparent 100%)",
          border: "1px solid rgba(255,60,0,0.4)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "rgba(255,60,0,0.8)" }} />
          {/* Pulse rings */}
          <div style={{
            position: "absolute",
            inset: "-8px",
            borderRadius: "50%",
            border: "1px solid rgba(255,60,0,0.2)",
            animation: "orbPing 1.5s cubic-bezier(0,0,0.2,1) infinite",
          }} />
          <div style={{
            position: "absolute",
            inset: "-16px",
            borderRadius: "50%",
            border: "1px solid rgba(255,60,0,0.1)",
            animation: "orbPing 1.5s cubic-bezier(0,0,0.2,1) 0.5s infinite",
          }} />
        </div>

        {/* Nodes */}
        {timelineData.map((item, index) => {
          const pos = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              ref={(el) => { nodeRefs.current[item.id] = el; }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%))`,
                zIndex: isExpanded ? 200 : pos.zIndex,
                opacity: isExpanded ? 1 : pos.opacity,
                transition: "opacity 0.3s, z-index 0s",
                cursor: "pointer",
              }}
              onMouseEnter={() => handleNodeEnter(item.id)}
              onMouseLeave={handleNodeLeave}
            >
              {/* Glow aura */}
              <div style={{
                position: "absolute",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                width: `${item.energy * 0.5 + 32}px`,
                height: `${item.energy * 0.5 + 32}px`,
                left: `${-(item.energy * 0.5 + 32 - 40) / 2}px`,
                top: `${-(item.energy * 0.5 + 32 - 40) / 2}px`,
                animation: isPulsing ? "orbPulse 1s ease-in-out infinite" : "none",
              }} />

              {/* Node icon button */}
              <div style={{
                width: "36px", height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isExpanded ? "#fff" : isRelated ? "rgba(255,255,255,0.35)" : "rgba(10,10,10,0.9)",
                border: `1.5px solid ${isExpanded ? "#fff" : isRelated ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)"}`,
                color: isExpanded ? "#000" : "#fff",
                transform: isExpanded ? "scale(1.4)" : "scale(1)",
                transition: "all 0.3s",
                boxShadow: isExpanded ? "0 0 20px rgba(255,255,255,0.3)" : "none",
              }}>
                <Icon size={14} />
              </div>

              {/* Label */}
              <div style={{
                position: "absolute",
                top: "42px",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.42rem",
                letterSpacing: "0.12em",
                color: isExpanded ? "#fff" : "rgba(224,224,224,0.55)",
                transition: "color 0.3s",
                textAlign: "center",
              }}>
                {item.title}
              </div>

              {/* Expanded card */}
              {isExpanded && (
                <Card
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                  style={{
                    position: "absolute",
                    top: "52px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "220px",
                    background: "rgba(8,8,8,0.96)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
                  }}>
                  {/* Connector line */}
                  <div style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "1px",
                    height: "10px",
                    background: "rgba(255,255,255,0.3)",
                  }} />
                  <CardHeader style={{ padding: "12px 14px 8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <Badge className={getStatusClass(item.status)} style={{ fontSize: "0.38rem", letterSpacing: "0.1em", padding: "2px 6px" }}>
                        {getStatusLabel(item.status)}
                      </Badge>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.42rem", color: "var(--accent)", letterSpacing: "0.1em" }}>
                        {item.category}
                      </span>
                    </div>
                    <CardTitle style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.6rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.04em" }}>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent style={{ padding: "0 14px 12px" }}>
                    <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.52rem", lineHeight: 1.7, color: "rgba(224,224,224,0.6)" }}>
                      {item.content}
                    </p>
                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.42rem", color: "rgba(224,224,224,0.4)", letterSpacing: "0.08em" }}>
                          PROFICIENCY
                        </span>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.44rem", color: "var(--accent)" }}>
                          {item.energy}%
                        </span>
                      </div>
                      <div style={{ height: "2px", background: "rgba(255,255,255,0.08)", borderRadius: "1px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${item.energy}%`,
                          background: "linear-gradient(to right, var(--accent), rgba(255,60,0,0.5))",
                        }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes orbPing {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
