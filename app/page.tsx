import HalideTopoHero from "@/components/ui/halide-topo-hero";
import { ProjectsSection } from "@/components/ui/projects-section";

export default function Home() {
  return (
    <main>
      {/* Hero — full screen with 3D parallax */}
      <HalideTopoHero />

      {/* Projects — left/right split with scroll animations */}
      <ProjectsSection />
    </main>
  );
}
