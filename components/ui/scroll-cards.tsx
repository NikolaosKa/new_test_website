"use client"

// Generic sticky-scroll card stack component.
// Each card occupies full viewport height and sticks at top-0 as user scrolls,
// creating a "card replaces card" effect.  Later cards have higher z-index so
// they slide up and cover the previous card.

interface CardItem {
  title: string
  description: string
  tag: string
  src: string
  link: string
  color: string
  textColor: string
}

interface CardProps extends Omit<CardItem, "src" | "link" | "tag"> {
  i: number
  src: string
}

const Card = ({ title, description, color, textColor, i, src }: CardProps) => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "sticky",
      top: 0,
      zIndex: i + 1,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "min(700px, 90vw)",
        height: "min(400px, 70vh)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        backgroundColor: color,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      {/* Text overlay */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <p style={{ fontFamily: "Syncopate, sans-serif", fontWeight: 700, fontSize: "clamp(2rem,5vw,4rem)", color: textColor, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {title}
        </p>
        {description && (
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "1rem", color: textColor, marginTop: "1rem", letterSpacing: "0.06em", lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>
    </div>
  </div>
)

interface CardsParallaxProps {
  items: CardItem[]
}

const CardsParallax = ({ items }: CardsParallaxProps) => (
  <div style={{ minHeight: "100vh" }}>
    {items.map((item, i) => (
      <Card key={`card_${i}`} {...item} i={i} />
    ))}
  </div>
)

export { CardsParallax, type CardItem }
