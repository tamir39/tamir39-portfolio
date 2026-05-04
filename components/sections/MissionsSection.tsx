import { SectionHeader } from "@/components/hud/SectionHeader";
import { MissionGrid } from "@/components/missions/MissionGrid";

export function MissionsSection() {
  return (
    <section
      id="missions"
      aria-labelledby="missions-heading"
      className="relative px-6 pb-32 pt-32 md:px-16 md:pt-40 lg:px-32"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <SectionHeader channel="02 — Work" title="Selected Work" />
        <p className="max-w-2xl text-sm leading-relaxed text-text-dim">
          Active builds first, then archived work. Each entry opens a case study —
          context, stack, and what was learned shipping it.
        </p>
        <MissionGrid />
      </div>
    </section>
  );
}
