import { projects } from "@/lib/data/projects";
import { MissionCard } from "./MissionCard";

export function MissionGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
      {projects.map((p, i) => (
        <MissionCard key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}
