import { SectionHeader } from "@/components/hud/SectionHeader";
import { GlassPanel } from "@/components/hud/GlassPanel";
import { BioPanel } from "@/components/profile/BioPanel";
import { StatReadout } from "@/components/profile/StatReadout";
import { Timeline } from "@/components/profile/Timeline";
import { SkillsGrid } from "@/components/profile/SkillsGrid";
import { LanguageBars } from "@/components/profile/LanguageBars";
import { softSkills } from "@/lib/data/skills";

export function ProfileSection() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="relative px-6 pb-32 pt-32 md:px-16 lg:px-32"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
        <SectionHeader channel="LOG_01 :: OPERATOR PROFILE" title="OPERATOR DOSSIER" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <BioPanel />
          <GlassPanel className="px-6 py-5">
            <span className="mb-3 block text-hud-label text-cyan">// READOUTS</span>
            <div className="grid grid-cols-2 gap-4">
              <StatReadout label="GPA" value={7.62} decimals={2} />
              <StatReadout label="Recent Sem" value={8.21} decimals={2} />
              <StatReadout label="Missions" value={3} />
              <StatReadout label="Year Out" value={2027} />
            </div>
          </GlassPanel>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="flex flex-col gap-6">
            <span className="text-hud-label text-cyan">// LOG_01.A :: TIMELINE</span>
            <Timeline />
          </div>

          <div className="flex flex-col gap-10">
            <LanguageBars />
            <div className="flex flex-col gap-3">
              <span className="text-hud-label text-cyan">// SOFT-SKILL ARRAY</span>
              <ul className="flex flex-wrap gap-2">
                {softSkills.map((s) => (
                  <li
                    key={s}
                    className="border border-stroke px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim transition-colors hover:border-violet hover:text-text"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <span className="text-hud-label text-cyan">// LOG_01.B :: SKILL MATRIX</span>
          <SkillsGrid />
        </div>
      </div>
    </section>
  );
}
