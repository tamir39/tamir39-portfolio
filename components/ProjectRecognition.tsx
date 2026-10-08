import { ArrowUpRight, Trophy } from "lucide-react";
import type { Project } from "@/lib/data/projects";

type Props = {
  recognition: Project["recognition"];
  compact?: boolean;
};

export function ProjectRecognition({ recognition, compact = false }: Props) {
  if (!recognition) return null;
  if (compact) return <a href={recognition.href} target="_blank" rel="noopener noreferrer" className="theme-border mt-4 inline-flex min-h-11 items-start gap-3 border-t pt-4 text-xs leading-relaxed">
    <Trophy size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
    <span><strong className="font-semibold">{recognition.title} · {recognition.partner}</strong><span className="mt-1 block text-[11px] text-muted">Team {recognition.team} · {recognition.event}</span></span>
    <ArrowUpRight size={13} className="mt-1 shrink-0" aria-hidden="true" />
  </a>;

  return <aside aria-labelledby="recognition-heading" className="themed-panel mt-8 flex items-start gap-4 border p-5 sm:p-6">
    <Trophy size={24} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
    <div className="min-w-0"><p className="section-eyebrow mb-2">Team recognition / {recognition.partner}</p><h2 id="recognition-heading" className="text-xl font-semibold tracking-tight">{recognition.title}</h2><p className="mt-2 text-sm leading-relaxed text-muted">Part of the winning {recognition.team} team at {recognition.event}. Organized by {recognition.organizer}, with {recognition.partner} as the F&B track partner.</p><a href={recognition.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs underline underline-offset-4">View the organizer’s announcement<ArrowUpRight size={14} aria-hidden="true" /></a></div>
  </aside>;
}
