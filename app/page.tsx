import Link from "next/link";
import HalideTopoHero from "@/components/ui/halide-topo-hero";

// href: route to navigate when the card is clicked (null = coming soon)
const projects = [
  {
    id: "01",
    href: "/projects/spatial-systems",
    title: "SPATIAL SYSTEMS",
    tag: "ARCHITECTURE / INTERIORS",
    image: "/explo.png",
    blend: "screen" as const,
    filter: "brightness(0.85) contrast(1.1) saturate(1.2)",
    hoverFilter: "brightness(1.05) contrast(1.15) saturate(1.4)",
  },
  {
    id: "02",
    href: null,
    title: "COMPUTATIONAL DESIGN",
    tag: "PARAMETRIC / FABRICATION",
    image: "/comp.jpg",
    blend: "normal" as const,
    filter: "brightness(0.75) contrast(1.2) saturate(1.1)",
    hoverFilter: "brightness(0.9) contrast(1.25) saturate(1.3)",
  },
  {
    id: "03",
    href: null,
    title: "DIGITAL TO PHYSICAL",
    tag: "PROTOTYPING / INSTALLATION",
    image: "/digital.jpg",
    blend: "normal" as const,
    filter: "brightness(0.7) contrast(1.15) saturate(0.9)",
    hoverFilter: "brightness(0.85) contrast(1.2) saturate(1.1)",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero — full screen with 3D parallax */}
      <HalideTopoHero />

      {/* Projects section */}
      <section id="projects" className="projects-section">
        <p className="section-label">002 / SELECTED WORK</p>
        <h2 className="section-heading">
          PROJECT
          <br />
          CATEGORIES
        </h2>

        <div className="projects-grid">
          {projects.map((project) => {
            const card = (
              <article key={project.id} className="project-card" style={{ cursor: project.href ? "pointer" : "default" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  style={{ filter: project.filter, mixBlendMode: project.blend }}
                  className="project-img"
                />
                <div className="project-card-overlay">
                  <span className="project-number">{project.id} /</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-tag">{project.tag}</p>
                </div>
              </article>
            );
            return project.href ? (
              <Link key={project.id} href={project.href} style={{ textDecoration: "none" }}>
                {card}
              </Link>
            ) : card;
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "5rem",
            borderTop: "1px solid rgba(224,224,224,0.08)",
            paddingTop: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          {/* Logo + copyright */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Nikolaos Kalaitzidis"
              style={{
                height: "36px",
                width: "auto",
                filter: "invert(1) brightness(2)",
                mixBlendMode: "screen",
                opacity: 0.5,
              }}
            />
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.62rem",
                color: "rgba(224,224,224,0.25)",
                letterSpacing: "0.15em",
              }}
            >
              © {new Date().getFullYear()} NIKOLAOS KALAITZIDIS
            </span>
          </div>
          <a
            href="#"
            style={{
              fontFamily: "Syncopate, sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            BACK TO TOP ↑
          </a>
        </div>
      </section>
    </main>
  );
}
