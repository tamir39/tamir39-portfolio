import { SectionHeader } from "@/components/hud/SectionHeader";
import { BioPanel } from "@/components/profile/BioPanel";
import { StatReadout } from "@/components/profile/StatReadout";
import { Timeline } from "@/components/profile/Timeline";
import { SkillsGrid } from "@/components/profile/SkillsGrid";
import { LanguageBars } from "@/components/profile/LanguageBars";
import { softSkills } from "@/lib/data/skills";
import { projects } from "@/lib/data/projects";

export function ProfileSection() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="relative px-6 pb-32 pt-32 md:px-16 md:pt-40 lg:px-32"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-20">
        <SectionHeader channel="01 — Profile" title="About me" />

        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <BioPanel />
          <div className="relative border-l border-cyan/30 px-6 py-2">
            <span className="mb-4 block text-hud-label text-cyan">▸ At a glance</span>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <StatReadout label="GPA" value={7.62} decimals={2} />
              <StatReadout label="Recent Sem" value={8.21} decimals={2} />
              <StatReadout label="Projects" value={projects.length} />
              <StatReadout label="Graduates" value={2027} tone="violet" />
            </div>
          </div>
        </div>

        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="flex flex-col gap-5">
            <span className="text-hud-label text-cyan">▸ Timeline</span>
            <Timeline />
          </div>

          <div className="flex flex-col gap-10">
            <LanguageBars />
            <div className="flex flex-col gap-3">
              <span className="text-hud-label text-cyan">▸ Soft skills</span>
              <ul className="flex flex-wrap gap-2">
                {softSkills.map((s) => (
                  <li
                    key={s}
                    className="border border-stroke-bright px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-soft transition-colors hover:border-violet hover:text-text"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <span className="text-hud-label text-cyan">▸ Skills</span>
          <SkillsGrid />
        </div>
      </div>
    </section>
  );
}
