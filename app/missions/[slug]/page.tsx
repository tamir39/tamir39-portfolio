import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Orbit } from "lucide-react";
import { getProject, projects } from "@/lib/data/projects";
import { portfolioProjects } from "@/lib/data/portfolio-projects";
import { projectWorlds } from "@/lib/data/project-worlds";
import { ProjectVideo } from "@/components/ProjectVideo";
import { ProjectMockup } from "@/components/ProjectMockup";
import { AcademicMotionDemo } from "@/components/AcademicMotionDemo";
import { ProjectLogo } from "@/components/ProjectLogo";
import { ProjectRecognition } from "@/components/ProjectRecognition";

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.name} — Tamir` : "Project not found — Tamir", description: project?.tagline };
}

export default async function MissionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const motionKind = slug === "point-of-sale" || slug === "causasent" || slug === "lawmate" ? slug : null;
  const preview = portfolioProjects.find(item => item.slug === slug);
  const world = projectWorlds[slug];
  const collection = slug === "panic-hub" ? { href: "/#games", label: "game development" } : project.academic ? { href: "/#academic", label: "academic work" } : project.independent ? { href: "/#independent", label: "independent projects" } : { href: "/#work", label: "selected work" };
  const projectState = project.academic?.state ?? project.independent?.state ?? project.releaseState;
  const next = projects[(projects.findIndex(item => item.slug === slug) + 1) % projects.length];

  return <main id="main-content">
    <section className="project-detail-hero px-6 pb-12 pt-8 sm:px-10 lg:px-16 lg:pb-16">
      <div className="mx-auto max-w-[1312px]">
        <Link href={collection.href} className="mb-12 inline-flex min-h-11 items-center gap-3 text-xs text-muted hover:text-accent"><ArrowLeft size={15} aria-hidden="true" />Back to {collection.label}</Link>
        <div className={project.video || motionKind ? "project-intro-with-demo" : undefined}><div className="min-w-0">
        <p className="section-eyebrow"><Orbit size={15} aria-hidden="true" />{project.academic ? `Academic coursework · ${project.academic.course}` : project.deliverable ?? (project.competition ? "Hackathon project" : world?.name ?? "From my orbit")} / Project {project.id}</p>
        {project.academic && <p className="mb-5 text-sm font-medium text-muted">Computer Science · Ton Duc Thang University</p>}
        <div className="flex items-center gap-4"><ProjectLogo slug={project.slug} size={48} /><h1 className="min-w-0 max-w-4xl text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[1.08] tracking-[-0.06em]">{project.name}</h1></div>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{project.tagline}</p>
        {project.contribution && <div className="mt-8 max-w-3xl"><h2 className="text-xl font-semibold tracking-tight text-ink">{project.academic || project.independent ? "Project focus" : "What I built"}</h2><p className="mt-3 text-base leading-relaxed text-muted">{project.contribution}</p>{project.focus && <ul aria-label="Contribution focus" className="mt-5 flex flex-wrap gap-2">{project.focus.map(focus => <li key={focus} className="rounded-full border theme-border px-3 py-2 text-xs font-medium text-ink">{focus}</li>)}</ul>}</div>}
        {!!project.links?.length && <div className="mt-7 flex flex-wrap gap-3">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 rounded-full theme-button px-6 text-sm font-medium text-white ">{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}</div>}
        </div>{project.video ? <div className="project-intro-video min-w-0"><p className="section-eyebrow">Watch the project</p><ProjectVideo {...project.video} /></div> : motionKind ? <AcademicMotionDemo kind={motionKind} /> : null}</div>
        {(project.role || project.dates || projectState || project.stack.length > 0) && <dl className="mt-12 flex flex-wrap gap-x-16 gap-y-7 themed-panel border p-6 text-sm sm:p-8">{project.role && <div><dt className="mb-2 text-xs text-muted">{project.academic || project.independent ? "Context" : "My role"}</dt><dd>{project.role}</dd></div>}{project.dates && <div><dt className="mb-2 text-xs text-muted">Timeline</dt><dd>{project.dates}</dd></div>}{projectState && <div><dt className="mb-2 text-xs text-muted">Project status</dt><dd>{projectState}</dd></div>}{project.stack.length > 0 && <div><dt className="mb-2 text-xs text-muted">Tools & technologies</dt><dd>{project.stack.join(" · ")}</dd></div>}</dl>}
        {project.recognition && <ProjectRecognition recognition={project.recognition} />}
        {project.competition && <aside aria-labelledby="competition-heading" className="theme-border mt-8 border-t pt-7"><p className="section-eyebrow">The competition</p><h2 id="competition-heading" className="text-xl font-medium">{project.competition.name}</h2><p className="mt-3 text-sm leading-relaxed text-muted">Theme: {project.competition.theme}. Team {project.competition.team} · {project.competition.teamSize} members.</p><a href={project.competition.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs underline underline-offset-4">About the competition<ArrowUpRight size={14} aria-hidden="true" /></a></aside>}
        {project.video && motionKind && <AcademicMotionDemo kind={motionKind} />}
        {["selfnest", "enstudy-hub", "educata"].includes(slug) && <section aria-labelledby="mockup-heading" className="theme-border mt-12 grid items-start gap-8 border-t pt-10 lg:grid-cols-[1fr_1.5fr]"><div><p className="section-eyebrow">Try the interface</p><h2 id="mockup-heading" className="text-3xl font-semibold tracking-tight">A little of the app,<br /><span className="font-editorial font-normal italic text-accent">right here.</span></h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">An interactive mockup adapted from the project’s frontend. Explore the controls with sample data; reset to try the flow again.</p></div><ProjectMockup slug={project.slug} detail /></section>}

        {preview && <div className="mt-10 rounded-xl bg-white/45 p-3 sm:p-6"><Image src={slug === "panic-hub" ? preview.images.col1a : preview.images.col2} alt={`${project.name} interface overview`} width={1400} height={1000} priority sizes="(max-width: 767px) 90vw, 1150px" className="max-h-[620px] w-full rounded-lg object-contain" /></div>}
      </div>
    </section>
    <section className="mx-auto max-w-[1312px] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]"><div><p className="section-eyebrow">01 / The project</p><h2 className="text-3xl font-medium tracking-tight">{project.academic ? "The project" : "The experience"}<br /><span className="font-editorial font-normal italic text-accent">in context.</span></h2></div><p className="max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p></div>
      {project.journey && <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_2fr]"><div className="lg:col-start-2"><h3 className="mb-4 text-sm font-medium">The user flow</h3><ol className="flex max-w-2xl flex-wrap gap-2">{project.journey.map((step, index) => <li key={step} className="flex items-start gap-2 rounded-xl border theme-border px-3 py-2 text-sm leading-relaxed text-muted"><span className="shrink-0 pt-0.5 font-mono text-[10px] text-accent">{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol></div></div>}
      <div className="mt-16 grid gap-8 border-t theme-border pt-12 lg:grid-cols-[1fr_2fr]"><div><p className="section-eyebrow">02 / The making</p><h2 className="text-3xl font-medium tracking-tight">What went<br /><span className="font-editorial font-normal italic text-accent">into it.</span></h2></div><ol className="max-w-2xl space-y-10">{project.highlights.map((highlight,index) => <li key={highlight.title} className="flex gap-4 sm:gap-6"><span aria-hidden="true" className="shrink-0 pt-1.5 font-mono text-xs text-accent">{String(index+1).padStart(2,"0")}</span><div className="min-w-0"><h3 className="text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">{highlight.title}</h3><p className="mt-3 text-base leading-relaxed text-muted">{highlight.body}</p></div></li>)}</ol></div>
      {preview && <div className="mt-16 grid items-start gap-5 sm:grid-cols-2">{[preview.images.col1a,preview.images.col1b].map((src,index) => <figure key={src}><div className="rounded-xl theme-surface p-3 sm:p-5"><Image src={src} alt={`${project.name} additional view ${index+1}`} width={800} height={600} sizes="(max-width:639px) 90vw, 44vw" className="aspect-[4/3] w-full rounded-lg object-contain" /></div><figcaption className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted">Project view / 0{index+1}</figcaption></figure>)}</div>}
      {project.links && <div className="mt-12 flex flex-wrap gap-3">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-5 rounded-full border theme-outline px-6 text-sm transition-colors ">{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>}
      <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t theme-border pt-8"><Link href={collection.href} className="cosmic-text-link"><ArrowLeft size={15} aria-hidden="true" />All {collection.label}</Link><Link href={`/missions/${next.slug}`} className="cosmic-text-link">Next destination: {next.name}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </section>
  </main>;
}
