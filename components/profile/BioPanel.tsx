import { GlassPanel } from "@/components/hud/GlassPanel";

export function BioPanel() {
  return (
    <GlassPanel className="px-6 py-5">
      <div className="flex flex-col gap-3">
        <span className="text-hud-label text-cyan">// BIOGRAPHY</span>
        <p className="text-base leading-relaxed text-text">
          A computer-science undergrad in Ho Chi Minh City who builds at the
          seam of code and play. I write Python and C# for game systems —
          A* searches, physics-driven survival loops — and ship product on
          Agile teams when the work calls for coordination over solo craft.
        </p>
        <p className="text-base leading-relaxed text-text-dim">
          Currently focused on game AI, real-time interaction, and the small
          set of details that make a thing feel alive instead of merely
          working.
        </p>
      </div>
    </GlassPanel>
  );
}
