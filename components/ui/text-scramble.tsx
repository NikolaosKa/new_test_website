"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*"

interface TextScrambleProps {
  text: string
  className?: string
  style?: React.CSSProperties
  /** trigger on "click" (default) or "hover" */
  trigger?: "click" | "hover"
  /** color of scrambling characters — defaults to var(--accent) */
  scrambleColor?: string
}

export function TextScramble({
  text,
  className = "",
  style,
  trigger = "click",
  scrambleColor = "var(--accent)",
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameRef = useRef(0)

  const scramble = useCallback(() => {
    if (isScrambling) return
    setIsScrambling(true)
    frameRef.current = 0
    const duration = text.length * 3

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      frameRef.current++
      const progress = frameRef.current / duration
      const revealedLength = Math.floor(progress * text.length)

      const newText = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " "
          if (i < revealedLength) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join("")

      setDisplayText(newText)

      if (frameRef.current >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsScrambling(false)
      }
    }, 30)
  }, [text, isScrambling])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const handlers =
    trigger === "hover"
      ? { onMouseEnter: scramble }
      : { onClick: scramble }

  return (
    <span
      className={className}
      style={{ cursor: "pointer", ...style }}
      {...handlers}
    >
      {displayText.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            transition: "color 0.1s, transform 0.15s",
            transitionDelay: `${i * 8}ms`,
            color:
              isScrambling && char !== text[i]
                ? scrambleColor
                : "inherit",
            transform:
              isScrambling && char !== text[i]
                ? "scaleY(1.12)"
                : "scaleY(1)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}
