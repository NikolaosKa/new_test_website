import HalideTopoHero from "@/components/ui/halide-topo-hero";

const projects = [
  {
    id: "01",
    title: "SPATIAL SYSTEMS",
    tag: "ARCHITECTURE / INTERIORS",
    image: "/explo.png",
    blend: "screen" as const,
    filter: "brightness(0.85) contrast(1.1) saturate(1.2)",
    hoverFilter: "brightness(1.05) contrast(1.15) saturate(1.4)",
  },
  {
    id: "02",
    title: "COMPUTATIONAL DESIGN",
    tag: "PARAMETRIC / FABRICATION",
    image: "/comp.jpg",
    blend: "normal" as const,
    filter: "brightness(0.75) contrast(1.2) saturate(1.1)",
    hoverFilter: "brightness(0.9) contrast(1.25) saturate(1.3)",
  },
  {
    id: "03",
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
          {projects.map((project) => (
            <article key={project.id} className="project-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                style={{
                  filter: project.filter,
                  mixBlendMode: project.blend,
                }}
                className="project-img"
              />
              <div className="project-card-overlay">
                <span className="project-number">{project.id} /</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-tag">{project.tag}</p>
              </div>
            </article>
          ))}
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
