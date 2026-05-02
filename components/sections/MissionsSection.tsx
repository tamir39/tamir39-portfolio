import { SectionHeader } from "@/components/hud/SectionHeader";
import { MissionGrid } from "@/components/missions/MissionGrid";

export function MissionsSection() {
  return (
    <section
      id="missions"
      aria-labelledby="missions-heading"
      className="relative px-6 pb-32 pt-12 md:px-16 lg:px-32"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <SectionHeader channel="LOG_02 :: MISSION ARCHIVE" title="MISSION LOGS" />
        <p className="max-w-2xl text-sm leading-relaxed text-text-dim">
          Selected logs from the field. Each entry expands into a full debrief —
          objectives, tools, and what was learned shipping it.
        </p>
        <MissionGrid />
      </div>
    </section>
  );
}
