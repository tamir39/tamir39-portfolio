import type { Metadata } from "next";
import { SectionHeader } from "@/components/hud/SectionHeader";
import { MissionGrid } from "@/components/missions/MissionGrid";

export const metadata: Metadata = {
  title: "MISSIONS // TAMIR.OS",
  description: "Mission logs — projects shipped by tamir39 across game AI, Unity, and full-stack delivery.",
};

export default function MissionsPage() {
  return (
    <main className="px-6 pb-32 pt-32 md:px-16 lg:px-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <SectionHeader channel="LOG_02 :: MISSION ARCHIVE" title="MISSION LOGS" />
        <p className="max-w-2xl text-sm leading-relaxed text-text-dim">
          Selected logs from the field. Each entry expands into a full debrief —
          objectives, tools, and what was learned shipping it.
        </p>
        <MissionGrid />
      </div>
    </main>
  );
}
