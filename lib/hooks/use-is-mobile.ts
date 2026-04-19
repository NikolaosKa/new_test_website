"use client"

import { useEffect, useState } from "react"

/**
 * Returns true when the viewport is narrower than `breakpoint` px.
 * Starts as `false` (safe SSR default) then corrects on first client paint.
 * Also updates on resize / orientation change.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [breakpoint])

  return isMobile
}

/**
 * Returns true when the primary input is touch (no fine pointer / hover).
 * Use this to disable hover-only effects.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches)
  }, [])
  return isTouch
}
