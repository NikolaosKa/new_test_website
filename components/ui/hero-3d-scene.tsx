"use client";

import { Suspense, useEffect, useRef, useState, Component, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/hero_model_raw.glb";

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

// ─── Walk up from a mesh to find its named Block_XX or Road group ancestor ────
function findGroupRoot(mesh: THREE.Mesh, sceneRoot: THREE.Object3D): THREE.Object3D {
  let obj: THREE.Object3D = mesh;
  while (obj && obj !== sceneRoot) {
    if (obj.name && /^(Block_|Road)/i.test(obj.name)) return obj;
    if (!obj.parent) break;
    obj = obj.parent;
  }
  // Fallback: one level up if it's a small group, else the mesh itself
  const parent = mesh.parent;
  if (!parent || parent === sceneRoot) return mesh;
  const meshChildCount = parent.children.filter((c) => (c as THREE.Mesh).isMesh).length;
  return meshChildCount <= 200 ? parent : mesh;
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

  const mouse       = useRef(new THREE.Vector2());
  const raycaster   = useRef(new THREE.Raycaster());
  const frameCount  = useRef(0);

  const buildingMeshes  = useRef<THREE.Mesh[]>([]);
  const meshToGroup     = useRef(new Map<THREE.Mesh, THREE.Object3D>());
  const groupMeshes     = useRef(new Map<THREE.Object3D, THREE.Mesh[]>());
  const groupOriginalY  = useRef(new Map<THREE.Object3D, number>());
  const allGroups       = useRef<THREE.Object3D[]>([]);
  const statsMap        = useRef(new Map<THREE.Object3D, BuildingStats>());

  const hoveredGroupRef  = useRef<THREE.Object3D | null>(null);
  const defaultMatRef    = useRef<THREE.MeshStandardMaterial | null>(null);
  const hoveredMatRef    = useRef<THREE.MeshStandardMaterial | null>(null);
  // group → timestamp when it should begin descending (Date.now() + delay ms)
  const elevatedGroups   = useRef(new Map<THREE.Object3D, number>());

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
      // Hide edge lines
      if (
        obj instanceof THREE.Line ||
        obj instanceof THREE.LineSegments ||
        obj instanceof THREE.LineLoop
      ) { obj.visible = false; return; }

      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      // Prefer name-based classification (Block_XX = building, Road = road)
      // Fall back to material index for un-named meshes
      const origMat  = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const matIdx   = origMats.indexOf(origMat);
      const isRoad   = isRoadNode(mesh, scene) || matIdx === 1;

      if (!isRoad) {
        mesh.material = buildingMat;
        buildings.push(mesh);

        const root = findGroupRoot(mesh, scene);
        meshToGroup.current.set(mesh, root);
        if (!groupMeshes.current.has(root)) {
          groupMeshes.current.set(root, []);
          groupOriginalY.current.set(root, root.position.y);
          allGroups.current.push(root);
        }
        groupMeshes.current.get(root)!.push(mesh);
      } else {
        mesh.material = roadMat;
      }
    });

    buildingMeshes.current = buildings;
    console.log(
      "[Hero3D] building meshes:", buildings.length,
      "| groups:", allGroups.current.length,
      "| scale:", +(10 / maxDim).toFixed(2),
    );
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

  // ── Per-frame: raycast + trigger elevation ───────────────────────────────
  useFrame(() => {
    const meshes = buildingMeshes.current;
    if (!meshes.length) return;

    frameCount.current++;
    if (frameCount.current % 2 === 0) {
      raycaster.current.setFromCamera(mouse.current, camera);
      raycaster.current.firstHitOnly = true;
      const hits     = raycaster.current.intersectObjects(meshes, false);
      const hitMesh  = (hits[0]?.object as THREE.Mesh) ?? null;
      const hitGroup = hitMesh ? (meshToGroup.current.get(hitMesh) ?? hitMesh) : null;

      if (hitGroup !== hoveredGroupRef.current) {
        hoveredGroupRef.current = hitGroup;
        shared.current.group    = hitGroup;

        if (hitGroup) {
          // Trigger elevation only if this block is not already elevated
          if (!elevatedGroups.current.has(hitGroup)) {
            elevatedGroups.current.set(hitGroup, Date.now() + 3000); // hold 3 s
            if (hoveredMatRef.current) {
              (groupMeshes.current.get(hitGroup) ?? [])
                .forEach((m) => { m.material = hoveredMatRef.current!; });
            }
          }
          if (!statsMap.current.has(hitGroup)) statsMap.current.set(hitGroup, randomStats());
          onHoverChange(statsMap.current.get(hitGroup)!);
        } else {
          onHoverChange(null);
        }
      }
    }

    // Animate all groups — hold elevated until timer expires, then descend
    const now = Date.now();
    allGroups.current.forEach((g) => {
      const orig      = groupOriginalY.current.get(g) ?? 0;
      const returnAt  = elevatedGroups.current.get(g);
      const elevated  = returnAt !== undefined && now < returnAt;
      const target    = elevated ? orig + 0.25 : orig;

      g.position.y += (target - g.position.y) * 0.03;

      // Once fully descended, restore material and clear the entry
      if (!elevated && returnAt !== undefined && Math.abs(g.position.y - orig) < 0.005) {
        g.position.y = orig;
        elevatedGroups.current.delete(g);
        if (defaultMatRef.current) {
          (groupMeshes.current.get(g) ?? [])
            .forEach((m) => { m.material = defaultMatRef.current!; });
        }
      }
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Hero3DScene() {
  // Plain mutable object — shared between Canvas (GLBModel) and RAF loop
  const shared = useRef<HoverShared>({ group: null, camera: null, mouseNormX: 0 });

  // React state — controls annotation visibility + content (updated on hover change)
  const [hoverStats, setHoverStats] = useState<BuildingStats | null>(null);

  // DOM refs for RAF position updates — typed as plain objects to avoid RefObject quirks
  const lineRef  = useRef<SVGLineElement   | null>(null);
  const dotRef   = useRef<SVGCircleElement | null>(null);
  const panelRef = useRef<HTMLDivElement   | null>(null);

  // ── RAF loop: update line/dot/panel POSITION only (visibility via React state)
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const { group, camera, mouseNormX } = shared.current;
      const line  = lineRef.current;
      const dot   = dotRef.current;
      const panel = panelRef.current;

      if (group && camera && line && dot && panel) {
        // World-space top-center of the elevated building group
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

        // Panel side follows mouse X — left half → left, right half → right
        const isRight = mouseNormX >= 0;
        const panelX  = isRight ? W - PANEL_MARGIN - PANEL_W : PANEL_MARGIN;
        const panelY  = Math.max(80, Math.min(H - 170, sy - 60));

        // Update panel position
        panel.style.left = `${panelX}px`;
        panel.style.top  = `${panelY}px`;

        // Update connecting line
        const lineEndX = isRight ? panelX : panelX + PANEL_W;
        const lineEndY = panelY + 60;
        line.setAttribute("x1", String(sx));
        line.setAttribute("y1", String(sy));
        line.setAttribute("x2", String(lineEndX));
        line.setAttribute("y2", String(lineEndY));

        // Update dot at building top
        dot.setAttribute("cx", String(sx));
        dot.setAttribute("cy", String(sy));
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 8, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
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

if (MODEL_PATH) useGLTF.preload(MODEL_PATH);
