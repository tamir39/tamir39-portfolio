import Link from "next/link";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { academicProjects } from "@/lib/data/academic-projects";

export function AcademicWork() {
  return (
    <section id="academic" aria-labelledby="academic-heading" className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1312px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="section-eyebrow">Academic projects</p>
            <h2 id="academic-heading" className="section-heading">From the classroom.<br /><span className="font-editorial font-normal italic text-accent">Into the interface.</span></h2>
          </div>
          <div className="max-w-sm"><p className="mb-3 flex items-center gap-2 text-sm font-semibold"><GraduationCap size={20} aria-hidden="true" />Ton Duc Thang University</p><p className="text-sm leading-relaxed text-muted">Coursework from my Computer Science studies, exploring application flows, analysis dashboards, and document workflows.</p></div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {academicProjects.filter(project => project.academic?.featured).map(project => (
            <article key={project.slug} className="themed-panel flex flex-col border p-6 sm:p-8">
              <p className="mb-3 text-xs font-semibold text-accent">Academic coursework</p>
              <p className="section-eyebrow">{project.academic!.course} · {project.academic!.state}</p>
              <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h3>
              <p className="mt-5 max-w-lg flex-1 text-sm leading-relaxed text-muted">{project.academic!.description}</p>
              <ul aria-label="Project focus" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-accent">{project.academic!.focus.map(focus => <li key={focus}>{focus}</li>)}</ul>
              <Link href={`/missions/${project.slug}`} className="theme-button mt-7 inline-flex min-h-11 w-fit items-center gap-4 px-5 py-3 text-xs font-medium" aria-label={`Explore ${project.name}`}>Explore project<ArrowUpRight size={15} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-x-10 md:grid-cols-2">
          {academicProjects.filter(project => !project.academic?.featured).map(project => (
            <article key={project.slug} className="theme-border border-t py-7">
              <p className="mb-2 text-xs font-semibold text-accent">Academic coursework</p>
              <p className="mb-3 text-xs text-muted">{project.academic!.course} · {project.academic!.state}</p>
              <h3 className="text-xl font-semibold tracking-tight"><Link href={`/missions/${project.slug}`} className="inline-flex min-h-11 items-center gap-3 underline decoration-transparent underline-offset-4 hover:decoration-current">{project.name}<ArrowUpRight size={16} aria-hidden="true" /></Link></h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{project.academic!.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
