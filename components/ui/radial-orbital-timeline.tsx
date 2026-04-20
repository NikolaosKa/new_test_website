"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap, Box, PenTool, Building2, Monitor, Play, Code, Film, Camera, Navigation, Printer, Scissors, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }>;
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
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableInteraction) return;
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    if (disableInteraction) return;
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulse: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);
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

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":   return "text-white bg-black border-white";
      case "in-progress": return "text-black bg-white border-black";
      case "pending":     return "text-white bg-black/40 border-white/50";
      default:            return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ height: containerHeight, background: "transparent" }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Centre orb */}
          <div
            className="absolute rounded-full flex items-center justify-center z-10"
            style={{ width: "3.5rem", height: "3.5rem", background: "radial-gradient(circle, rgba(255,60,0,0.7) 0%, rgba(255,60,0,0.15) 60%, transparent 100%)" }}
          >
            <div className="absolute animate-ping opacity-30 rounded-full"
              style={{ width: "4.5rem", height: "4.5rem", border: "1px solid rgba(255,60,0,0.4)" }} />
            <div className="absolute animate-ping opacity-15 rounded-full"
              style={{ width: "6rem", height: "6rem", border: "1px solid rgba(255,60,0,0.2)", animationDelay: "0.5s" }} />
            <div className="rounded-full"
              style={{ width: "1.5rem", height: "1.5rem", background: "rgba(255,60,0,0.9)", boxShadow: "0 0 16px rgba(255,60,0,0.6)" }} />
          </div>

          {/* Orbit ring */}
          <div className="absolute rounded-full pointer-events-none"
            style={{ width: "432px", height: "432px", border: "1px solid rgba(255,255,255,0.05)" }} />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                  cursor: disableInteraction ? "default" : "pointer",
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Glow halo */}
                <div
                  className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(255,60,0,0.12) 0%, transparent 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                {/* Node */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? "scale-150" : ""}`}
                  style={{
                    background: isExpanded ? "rgba(255,60,0,0.85)" : isRelated ? "rgba(255,60,0,0.25)" : "rgba(10,10,10,0.95)",
                    border: `2px solid ${isExpanded ? "rgba(255,60,0,1)" : isRelated ? "rgba(255,60,0,0.7)" : "rgba(255,255,255,0.18)"}`,
                    boxShadow: isExpanded ? "0 0 20px rgba(255,60,0,0.45)" : isRelated ? "0 0 8px rgba(255,60,0,0.25)" : "none",
                    color: isExpanded ? "#fff" : "rgba(224,224,224,0.6)",
                  }}
                >
                  <Icon size={14} />
                </div>

                {/* Label */}
                <div
                  className="absolute whitespace-nowrap transition-all duration-300"
                  style={{
                    top: "3rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.4rem",
                    letterSpacing: "0.14em",
                    color: isExpanded ? "rgba(255,60,0,0.9)" : "rgba(224,224,224,0.4)",
                  }}
                >
                  {item.title}
                </div>

                {/* Card popup */}
                {isExpanded && (
                  <Card
                    className="absolute top-20 left-1/2 -translate-x-1/2 w-64 overflow-visible"
                    style={{
                      background: "rgba(8,8,8,0.97)",
                      border: "1px solid rgba(255,60,0,0.2)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3"
                      style={{ background: "rgba(255,60,0,0.4)" }} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`px-2 ${getStatusStyles(item.status)}`}
                          style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.38rem", letterSpacing: "0.1em" }}
                        >
                          {item.status === "completed" ? "EXPERT" : item.status === "in-progress" ? "PROFICIENT" : "LEARNING"}
                        </Badge>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.42rem", color: "rgba(255,60,0,0.65)", letterSpacing: "0.08em" }}>
                          {item.date}
                        </span>
                      </div>
                      <CardTitle
                        style={{ fontFamily: "Syncopate, sans-serif", fontSize: "0.55rem", color: "var(--silver)", letterSpacing: "0.04em", marginTop: "0.5rem" }}
                      >
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.55)", lineHeight: 1.85 }}>
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="flex justify-between items-center mb-2"
                          style={{ fontSize: "0.46rem", color: "rgba(224,224,224,0.35)" }}>
                          <span className="flex items-center gap-1">
                            <Zap size={8} style={{ color: "rgba(255,60,0,0.7)" }} />
                            PROFICIENCY
                          </span>
                          <span style={{ color: "rgba(255,60,0,0.8)", fontWeight: 700 }}>{item.energy}%</span>
                        </div>
                        <div style={{ height: "2px", background: "rgba(255,255,255,0.07)", borderRadius: "1px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${item.energy}%`,
                            background: "linear-gradient(to right, rgba(255,60,0,0.9), rgba(255,60,0,0.35))",
                          }} />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                          <div className="flex items-center mb-2 gap-1"
                            style={{ color: "rgba(224,224,224,0.28)", fontSize: "0.4rem", letterSpacing: "0.12em" }}>
                            <Link size={8} />
                            RELATED SKILLS
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relId) => {
                              const rel = timelineData.find((i) => i.id === relId);
                              return (
                                <Button
                                  key={relId}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 py-0 rounded-none"
                                  style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.38rem", letterSpacing: "0.1em" }}
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relId); }}
                                >
                                  {rel?.title}
                                  <ArrowRight size={7} style={{ marginLeft: "3px", color: "rgba(255,60,0,0.6)" }} />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Skills data ───────────────────────────────────────────────────────────────
export const skillsTimelineData: TimelineItem[] = [
  {
    id: 1, title: "RHINO + GRASSHOPPER", date: "PARAMETRIC",
    content: "Primary parametric modeling and computational design tool. Grasshopper scripting for generative workflows and architectural optimization.",
    category: "Design", icon: Box, relatedIds: [2, 3],
    status: "completed", energy: 92,
  },
  {
    id: 2, title: "AUTOCAD", date: "DRAFTING",
    content: "Technical drafting and construction documentation. Precision 2D and 3D drawing for architectural deliverables.",
    category: "Design", icon: PenTool, relatedIds: [1, 3],
    status: "completed", energy: 88,
  },
  {
    id: 3, title: "ARCHICAD", date: "BIM",
    content: "Building Information Modeling for integrated design and documentation. Full project lifecycle management.",
    category: "Design", icon: Building2, relatedIds: [1, 2],
    status: "completed", energy: 80,
  },
  {
    id: 4, title: "SKETCHUP + V-RAY", date: "VISUALIZATION",
    content: "Conceptual modeling with high-quality photorealistic rendering. Rapid design exploration and client presentation.",
    category: "Visualization", icon: Layers, relatedIds: [5, 1],
    status: "in-progress", energy: 78,
  },
  {
    id: 5, title: "LUMION / TWINMOTION", date: "RENDERING",
    content: "Real-time architectural visualization and walkthrough animations. Immersive environment rendering for presentations.",
    category: "Visualization", icon: Play, relatedIds: [4, 6],
    status: "in-progress", energy: 75,
  },
  {
    id: 6, title: "BLENDER", date: "3D MODELING",
    content: "Advanced 3D modeling, sculpting, and animation for complex organic forms and environmental visualization.",
    category: "3D", icon: Code, relatedIds: [5, 11],
    status: "in-progress", energy: 68,
  },
  {
    id: 7, title: "ADOBE SUITE", date: "CREATIVE",
    content: "Photoshop, Illustrator, InDesign for presentation layouts, image editing, and graphic communication.",
    category: "Media", icon: Monitor, relatedIds: [8, 9],
    status: "completed", energy: 85,
  },
  {
    id: 8, title: "PREMIERE PRO", date: "VIDEO",
    content: "Video editing and post-production for architectural films, drone footage, and project documentation reels.",
    category: "Media", icon: Film, relatedIds: [7, 10],
    status: "in-progress", energy: 72,
  },
  {
    id: 9, title: "PHOTOGRAPHY", date: "VISUAL",
    content: "Architectural and landscape photography — composition, lighting, and post-processing for documentary and portfolio work.",
    category: "Media", icon: Camera, relatedIds: [7, 10],
    status: "completed", energy: 90,
  },
  {
    id: 10, title: "DRONE OPERATION", date: "AERIAL",
    content: "Licensed drone pilot. Aerial photography and videography for site surveys, construction documentation, and cinematic footage.",
    category: "Media", icon: Navigation, relatedIds: [8, 9],
    status: "completed", energy: 85,
  },
  {
    id: 11, title: "3D PRINTING", date: "FABRICATION",
    content: "FDM and resin 3D printing for architectural scale models, prototypes, and fabrication studies.",
    category: "Fabrication", icon: Printer, relatedIds: [6, 12],
    status: "in-progress", energy: 72,
  },
  {
    id: 12, title: "MODEL MAKING", date: "CRAFT",
    content: "Hand-crafted architectural scale models. Precision cutting, material exploration, and physical prototype development.",
    category: "Fabrication", icon: Scissors, relatedIds: [11, 3],
    status: "completed", energy: 88,
  },
];
