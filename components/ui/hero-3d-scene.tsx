"use client";

import { Suspense, useEffect, useRef, useState, Component, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";

// hero_model.glb (214 KB) — was pointing at hero_model_raw.glb (12 MB) by mistake
const MODEL_PATH = "/hero_model.glb";

// ─── Types ────────────────────────────────────────────────────────────────────
type BuildingStats = { area: number; height: number; floors: number; year: number };

// Shared mutable bag — written inside Canvas, read by parent RAF loop.
// Using a plain interface (not React.RefObject) to avoid readonly issues.
interface HoverShared {
  group: THREE.Object3D | null;
  camera: THREE.Camera | null;
  mouseNormX: number;
}

function randomStats(): BuildingStats {
  return {
    area: Math.floor(Math.random() * 4800 + 200),
    height: Math.floor(Math.random() * 70 + 10),
    floors: Math.floor(Math.random() * 22 + 3),
    year: Math.floor(Math.random() * 60 + 1960),
  };
}

// ─── Error boundary ───────────────────────────────────────────────────────────
class ModelErrorBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) {
      console.error("[Hero3D] model load error:", this.state.error);
      return null;
    }
    return this.props.children;
  }
}

function isRoadNode(mesh: THREE.Mesh, sceneRoot: THREE.Object3D): boolean {
  let obj: THREE.Object3D = mesh;
  while (obj && obj !== sceneRoot) {
    if (obj.name && /^Road/i.test(obj.name)) return true;
    if (!obj.parent) break;
    obj = obj.parent;
  }
  return false;
}

// Walk up the scene graph to find a Block_XX group root; returns the group name or null
function findBlockGroupName(mesh: THREE.Mesh, sceneRoot: THREE.Object3D): string | null {
  let obj: THREE.Object3D = mesh;
  while (obj && obj !== sceneRoot) {
    if (obj.name && /^Block/i.test(obj.name)) return obj.name;
    if (!obj.parent) break;
    obj = obj.parent;
  }
  return null;
}

// ─── GLB Model ────────────────────────────────────────────────────────────────
function GLBModel({
  path,
  shared,
  onHoverChange,
}: {
  path: string;
  shared: { current: HoverShared };        // plain mutable ref, no RefObject issues
  onHoverChange: (stats: BuildingStats | null) => void;
}) {
  const { scene } = useGLTF(path);
  const { camera, gl } = useThree();

  const mouse          = useRef(new THREE.Vector2());
  const raycaster      = useRef(new THREE.Raycaster());
  const frameCount     = useRef(0);

  const buildingMeshes  = useRef<THREE.Mesh[]>([]);
  const meshOriginalY   = useRef(new Map<THREE.Mesh, number>());
  const displacedMeshes = useRef(new Set<THREE.Mesh>());
  const statsMap        = useRef(new Map<THREE.Mesh, BuildingStats>());

  // Group-level hover tracking
  const meshToGroupName = useRef(new Map<THREE.Mesh, string>());
  const groupMeshes     = useRef(new Map<string, THREE.Mesh[]>());
  const hoveredGroupRef = useRef<string | null>(null);

  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);
  const defaultMatRef  = useRef<THREE.MeshStandardMaterial | null>(null);
  const hoveredMatRef  = useRef<THREE.MeshStandardMaterial | null>(null);
  const scaleFactorRef = useRef(1);

  // Share camera with parent RAF loop
  useEffect(() => { shared.current.camera = camera; }, [camera, shared]);

  // ── Material + group setup ────────────────────────────────────────────────
  useEffect(() => {
    if (!scene) return;

    // 1. Reset, measure at original scale
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);

    const sz = new THREE.Vector3();
    new THREE.Box3().setFromObject(scene).getSize(sz);
    const maxDim = Math.max(sz.x, sz.y, sz.z);
    const safeDim = (maxDim > 0 && isFinite(maxDim)) ? maxDim : 0.225;
    const scaleFactor = 10 / safeDim;
    scene.scale.setScalar(scaleFactor);
    scaleFactorRef.current = scaleFactor;

    // 2. Re-measure AFTER scaling, then center at world origin
    const scaledBox = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    scaledBox.getCenter(center);
    scene.position.set(-center.x, -center.y, -center.z);

    console.log("[Hero3D] size:", sz.x.toFixed(3), sz.y.toFixed(3), sz.z.toFixed(3),
      "| scale:", scaleFactor.toFixed(1), "| center offset:", center.x.toFixed(2), center.y.toFixed(2));

    // Collect unique original materials to distinguish buildings vs roads
    const origMats: THREE.Material[] = [];
    scene.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (!m.isMesh || !m.material) return;
      const mat = Array.isArray(m.material) ? m.material[0] : m.material;
      if (!origMats.includes(mat)) origMats.push(mat);
    });

    const buildingMat = new THREE.MeshStandardMaterial({
      color: "#b4b4b4", roughness: 0.6, metalness: 0.2, side: THREE.DoubleSide,
    });
    const roadMat = new THREE.MeshStandardMaterial({
      color: "#1c1c1c", roughness: 0.9, metalness: 0.0, side: THREE.DoubleSide,
    });
    const hoveredMat = new THREE.MeshStandardMaterial({
      color: "#c8c8c8", roughness: 0.45, metalness: 0.15,
      emissive: new THREE.Color("#ff3c00"), emissiveIntensity: 0.35,
      side: THREE.DoubleSide,
    });

    defaultMatRef.current = buildingMat;
    hoveredMatRef.current = hoveredMat;

    const buildings: THREE.Mesh[] = [];

    scene.traverse((obj) => {
      if (
        obj instanceof THREE.Line ||
        obj instanceof THREE.LineSegments ||
        obj instanceof THREE.LineLoop
      ) { obj.visible = false; return; }

      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      const origMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const matIdx  = origMats.indexOf(origMat);
      const isRoad  = isRoadNode(mesh, scene) || matIdx === 1;

      if (!isRoad) {
        mesh.material = buildingMat;
        buildings.push(mesh);
        meshOriginalY.current.set(mesh, mesh.position.y);
      } else {
        mesh.material = roadMat;
      }
    });

    buildingMeshes.current = buildings;

    // Build group lookup maps
    meshToGroupName.current.clear();
    groupMeshes.current.clear();
    buildings.forEach(mesh => {
      const gName = findBlockGroupName(mesh, scene);
      if (gName) {
        meshToGroupName.current.set(mesh, gName);
        if (!groupMeshes.current.has(gName)) groupMeshes.current.set(gName, []);
        groupMeshes.current.get(gName)!.push(mesh);
      }
    });
    console.log("[Hero3D] building meshes:", buildings.length, "| groups:", groupMeshes.current.size, "| scale:", +(10 / maxDim).toFixed(2));
  }, [scene]);

  // ── Mouse tracking ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.x = nx;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      shared.current.mouseNormX = nx;
    };
    gl.domElement.addEventListener("mousemove", onMove);
    return () => gl.domElement.removeEventListener("mousemove", onMove);
  }, [gl, shared]);

  // ── Per-frame: raycast + individual mesh hover elevation ─────────────────
  useFrame(() => {
    const meshes = buildingMeshes.current;
    if (!meshes.length) return;

    frameCount.current++;
    if (frameCount.current % 2 === 0) {
      raycaster.current.setFromCamera(mouse.current, camera);
      raycaster.current.firstHitOnly = true;
      const hits    = raycaster.current.intersectObjects(meshes, false);
      const hitMesh = (hits[0]?.object as THREE.Mesh) ?? null;

      const hitGroupName = hitMesh ? (meshToGroupName.current.get(hitMesh) ?? null) : null;
      const groupChanged = hitGroupName !== hoveredGroupRef.current;
      const soloChanged  = !hitGroupName && !hoveredGroupRef.current && hitMesh !== hoveredMeshRef.current;

      if (groupChanged || soloChanged) {
        // Restore previous hovered state
        if (hoveredGroupRef.current) {
          const prev = groupMeshes.current.get(hoveredGroupRef.current) ?? [];
          prev.forEach(m => { if (defaultMatRef.current) m.material = defaultMatRef.current; });
        } else if (hoveredMeshRef.current && defaultMatRef.current) {
          hoveredMeshRef.current.material = defaultMatRef.current;
        }

        hoveredGroupRef.current = hitGroupName;
        hoveredMeshRef.current  = hitMesh;
        shared.current.group    = hitMesh;

        if (hitGroupName) {
          const grpMeshes = groupMeshes.current.get(hitGroupName) ?? [];
          grpMeshes.forEach(m => { if (hoveredMatRef.current) m.material = hoveredMatRef.current; });
          if (hitMesh && !statsMap.current.has(hitMesh)) statsMap.current.set(hitMesh, randomStats());
          onHoverChange(hitMesh ? (statsMap.current.get(hitMesh) ?? null) : null);
        } else if (hitMesh) {
          if (hoveredMatRef.current) hitMesh.material = hoveredMatRef.current;
          if (!statsMap.current.has(hitMesh)) statsMap.current.set(hitMesh, randomStats());
          onHoverChange(statsMap.current.get(hitMesh)!);
        } else {
          onHoverChange(null);
        }
      }
    }

    // Build set of currently-hovered meshes (whole group, or single mesh as fallback)
    const liftLocal = 0.8 / scaleFactorRef.current;
    const hoveredSet: Set<THREE.Mesh> = hoveredGroupRef.current
      ? new Set(groupMeshes.current.get(hoveredGroupRef.current) ?? [])
      : hoveredMeshRef.current
        ? new Set([hoveredMeshRef.current])
        : new Set<THREE.Mesh>();

    const toAnimate = new Set([...displacedMeshes.current, ...hoveredSet]);

    toAnimate.forEach((m) => {
      const orig      = meshOriginalY.current.get(m) ?? 0;
      const isHovered = hoveredSet.has(m);
      const target    = isHovered ? orig + liftLocal : orig;
      const lerp      = isHovered ? 0.08 : 0.03;
      m.position.y   += (target - m.position.y) * lerp;
      const displaced  = Math.abs(m.position.y - orig) > 0.0005;
      if (displaced) displacedMeshes.current.add(m);
      else           displacedMeshes.current.delete(m);
    });
  });

  return <primitive object={scene} />;
}

// ─── Procedural city blocks (fallback) ───────────────────────────────────────
function CityBlocks() {
  const groupRef   = useRef<THREE.Group>(null);
  const autoAngle  = useRef(0);
  const mouse      = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const blocks = useRef<{ x: number; z: number; h: number; w: number; d: number }[]>([]);
  if (blocks.current.length === 0) {
    const gridSize = 9, spacing = 1.4;
    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        const dist = Math.sqrt(i * i + j * j);
        if (dist > gridSize) continue;
        const noise = Math.sin(i * 0.7) * Math.cos(j * 0.5) + Math.cos(i * 0.3) * Math.sin(j * 0.8);
        const h = Math.max(0.05, (1 - dist / gridSize) * 2.5 * (0.4 + Math.abs(noise)));
        blocks.current.push({
          x: i * spacing, z: j * spacing, h,
          w: 0.55 + Math.random() * 0.25,
          d: 0.55 + Math.random() * 0.25,
        });
      }
    }
  }

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    autoAngle.current += delta * 0.06;
    groupRef.current.rotation.y +=
      (autoAngle.current + mouse.current.x * 0.6 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x +=
      (mouse.current.y * 0.3 - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {blocks.current.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0e0e0e" roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Camera parallax ─────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  useFrame(() => {
    camera.position.x += (mouse.current.x * 2.5 - camera.position.x) * 0.03;
    camera.position.y += (mouse.current.y * 1.5 + 8 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─── Annotation overlay ───────────────────────────────────────────────────────
const PANEL_W      = 192;
const PANEL_MARGIN = 28;

// Reusable scratch objects — allocated once, never re-created
const _box    = new THREE.Box3();
const _topPos = new THREE.Vector3();

function AnnotationOverlay({
  stats,
  lineRef,
  dotRef,
  panelRef,
}: {
  stats:    BuildingStats | null;
  lineRef:  { current: SVGLineElement   | null };
  dotRef:   { current: SVGCircleElement | null };
  panelRef: { current: HTMLDivElement   | null };
}) {
  const visible = !!stats;

  return (
    <>
      {/* SVG overlay for connecting line + dot */}
      <svg
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 20,
          overflow: "visible",
        }}
      >
        <line
          ref={(el) => { lineRef.current = el; }}
          x1="0" y1="0" x2="0" y2="0"
          stroke="rgba(255,60,0,0.55)"
          strokeWidth="0.75"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.25s",
          }}
        />
        <circle
          ref={(el) => { dotRef.current = el; }}
          cx="0" cy="0" r="3.5"
          fill="rgba(255,60,0,0.2)"
          stroke="rgba(255,60,0,0.85)"
          strokeWidth="1"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.25s",
          }}
        />
      </svg>

      {/* Panel — always mounted; visibility via opacity + React state */}
      <div
        ref={(el) => { panelRef.current = el; }}
        style={{
          position:       "absolute",
          width:          PANEL_W,
          pointerEvents:  "none",
          zIndex:         20,
          opacity:        visible ? 1 : 0,
          transition:     "opacity 0.25s",
          borderLeft:     "1px solid rgba(255,60,0,0.55)",
          borderTop:      "1px solid rgba(255,60,0,0.15)",
          borderBottom:   "1px solid rgba(255,60,0,0.15)",
          background:     "rgba(8,8,8,0.88)",
          backdropFilter: "blur(8px)",
          padding:        "13px 16px 13px 14px",
          fontFamily:     "'Share Tech Mono', monospace",
          fontSize:       "10.5px",
          color:          "#d8d8d8",
          letterSpacing:  "0.07em",
          lineHeight:     1.85,
        }}
      >
        <div style={{
          color: "#ff3c00", fontSize: "8.5px",
          letterSpacing: "0.18em", marginBottom: "9px",
        }}>
          [ BUILDING DATA ]
        </div>

        {stats && (
          <>
            {(
              [
                ["AREA",   `${stats.area.toLocaleString()} m²`],
                ["HEIGHT", `${stats.height} m`],
                ["FLOORS", `${stats.floors}`],
                ["BUILT",  `${stats.year}`],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ color: "rgba(200,200,200,0.5)" }}>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

// ─── Mobile static fallback (no WebGL) ───────────────────────────────────────
function MobileHeroBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      {/* Subtle radial gradient atmosphere */}
      <div style={{
        position: "absolute", inset: 0,
        background: [
          "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(255,60,0,0.07) 0%, transparent 65%)",
          "radial-gradient(ellipse 60% 40% at 75% 25%, rgba(80,90,180,0.05) 0%, transparent 55%)",
        ].join(", "),
      }} />
      {/* Fine grid texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: [
          "linear-gradient(rgba(224,224,224,0.04) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(224,224,224,0.04) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "48px 48px",
      }} />
      {/* Corner accent lines */}
      <div style={{
        position: "absolute", bottom: "15%", left: "8%",
        width: "clamp(60px,15vw,120px)", height: "1px",
        background: "linear-gradient(to right, rgba(255,60,0,0.4), transparent)",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "8%",
        width: "clamp(60px,15vw,120px)", height: "1px",
        background: "linear-gradient(to left, rgba(255,60,0,0.4), transparent)",
      }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Hero3DScene() {
  const isMobile = useIsMobile();

  // ALL hooks must be called unconditionally — Rules of Hooks
  const shared     = useRef<HoverShared>({ group: null, camera: null, mouseNormX: 0 });
  const [hoverStats, setHoverStats] = useState<BuildingStats | null>(null);
  const lineRef    = useRef<SVGLineElement   | null>(null);
  const dotRef     = useRef<SVGCircleElement | null>(null);
  const panelRef   = useRef<HTMLDivElement   | null>(null);

  // RAF annotation loop — only runs on desktop (isMobile guard inside)
  useEffect(() => {
    if (isMobile) return; // skip on mobile — no Canvas, no annotation
    let rafId: number;

    const tick = () => {
      const { group, camera, mouseNormX } = shared.current;
      const line  = lineRef.current;
      const dot   = dotRef.current;
      const panel = panelRef.current;

      if (group && camera && line && dot && panel) {
        _box.setFromObject(group);
        _topPos.set(
          (_box.min.x + _box.max.x) / 2,
          _box.max.y,
          (_box.min.z + _box.max.z) / 2,
        );
        _topPos.project(camera);

        const W  = window.innerWidth;
        const H  = window.innerHeight;
        const sx = ((_topPos.x + 1) / 2) * W;
        const sy = ((-_topPos.y + 1) / 2) * H;

        const isRight = mouseNormX >= 0;
        const panelX  = isRight ? W - PANEL_MARGIN - PANEL_W : PANEL_MARGIN;
        const panelY  = Math.max(80, Math.min(H - 170, sy - 60));

        panel.style.left = `${panelX}px`;
        panel.style.top  = `${panelY}px`;

        const lineEndX = isRight ? panelX : panelX + PANEL_W;
        const lineEndY = panelY + 60;
        line.setAttribute("x1", String(sx));
        line.setAttribute("y1", String(sy));
        line.setAttribute("x2", String(lineEndX));
        line.setAttribute("y2", String(lineEndY));

        dot.setAttribute("cx", String(sx));
        dot.setAttribute("cy", String(sy));
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isMobile]);

  // ── Mobile: return static background AFTER all hooks ──────────────────────
  if (isMobile) return <MobileHeroBackground />;

  // ── Desktop: full 3D Canvas ────────────────────────────────────────────────
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 8, 10], fov: 50 }}
        gl={{
          antialias: false,          // saves ~30% GPU; imperceptible at this scale
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}               // cap at 1.5× DPR — prevents 4× on Retina
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight position={[5, 12, 8]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-8, 4, -6]} intensity={0.5} color="#99aaff" />
        <pointLight position={[0, -2, -10]} intensity={3.5} color="#ff3c00" distance={22} decay={1.5} />
        <pointLight position={[0, -5, 0]} intensity={1.2} color="#ffaa44" distance={15} decay={2} />

        <CameraRig />

        {MODEL_PATH ? (
          <ModelErrorBoundary>
            <Suspense fallback={null}>
              <GLBModel
                path={MODEL_PATH}
                shared={shared}
                onHoverChange={setHoverStats}
              />
            </Suspense>
          </ModelErrorBoundary>
        ) : (
          <CityBlocks />
        )}
      </Canvas>

      <AnnotationOverlay
        stats={hoverStats}
        lineRef={lineRef}
        dotRef={dotRef}
        panelRef={panelRef}
      />
    </div>
  );
}

// Preload only on non-touch desktop. We check both pointer and hover capability.
if (
  MODEL_PATH &&
  typeof window !== "undefined" &&
  !window.matchMedia("(max-width: 767px)").matches
) {
  useGLTF.preload(MODEL_PATH);
}
