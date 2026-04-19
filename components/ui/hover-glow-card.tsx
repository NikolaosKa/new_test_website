"use client"

import { useRef, useEffect, MouseEvent, ReactNode } from "react"
import { useIsTouch } from "@/lib/hooks/use-is-mobile"

interface HoverGlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export function HoverGlowCard({
  children,
  className = "",
  glowColor = "rgba(255,60,0,0.55)",
  style,
  onClick,
}: HoverGlowCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef      = useRef<HTMLDivElement>(null)
  const isTouch      = useIsTouch()

  // On touch devices the glow div is never shown — skip listeners entirely.
  // On desktop, we write directly to the DOM so React never re-renders on mousemove.
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !glowRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    // Direct DOM mutation — no setState, no reconciliation, no re-render
    glowRef.current.style.left = `${e.clientX - r.left}px`
    glowRef.current.style.top  = `${e.clientY - r.top}px`
  }

  const onEnter = () => { if (glowRef.current) glowRef.current.style.opacity = "0.55" }
  const onLeave = () => { if (glowRef.current) glowRef.current.style.opacity = "0"    }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", cursor: "pointer", ...style }}
      onMouseMove={isTouch ? undefined : onMove}
      onMouseEnter={isTouch ? undefined : onEnter}
      onMouseLeave={isTouch ? undefined : onLeave}
      onClick={onClick}
    >
      {/* Glow orb — rendered only on non-touch devices */}
      {!isTouch && (
        <div
          ref={glowRef}
          aria-hidden
          style={{
            position:     "absolute",
            width:        "340px",
            height:       "340px",
            borderRadius: "50%",
            pointerEvents: "none",
            transform:    "translate(-50%, -50%)",
            left:         "50%",
            top:          "50%",
            background:   `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            opacity:      "0",
            transition:   "opacity 0.35s ease",
            zIndex:       20,
            mixBlendMode: "screen",
            willChange:   "left, top",
          }}
        />
      )}
      {children}
    </div>
  )
}

export default HoverGlowCard
