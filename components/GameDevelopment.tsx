import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gamepad2 } from "lucide-react";
import { escapeTheBelt } from "@/lib/data/game-projects";
import { getProject } from "@/lib/data/projects";
import { ProjectVideo } from "./ProjectVideo";

export function GameDevelopment() {
  const panicHub = getProject("panic-hub");
  if (!panicHub?.competition || !panicHub.video) return null;

  return <section id="games" aria-labelledby="games-heading" className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-[1312px]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-7 lg:mb-14">
        <div>
          <p className="section-eyebrow"><Gamepad2 size={16} aria-hidden="true" /> Game development</p>
          <h2 id="games-heading" className="section-heading">Built to be played.<br /><span className="font-editorial font-normal italic text-accent">Unity & Godot.</span></h2>
        </div>
        <p className="max-w-[350px] text-sm leading-relaxed text-muted">My game development experience across Unity and Godot, from arcade survival to a city shaped by player decisions.</p>
      </div>
      <div className="game-projects">
        <article id="panic-hub" aria-labelledby="panic-hub-heading" className="game-project-card game-project-feature themed-panel" data-theme-cycle-ignore>
          <div className="game-project-body">
            <p className="game-project-label"><span>Godot</span>Crisis simulation · Hackathon</p>
            <h3 id="panic-hub-heading" className="font-editorial italic">Panic Hub</h3>
            <p className="game-project-description">A mayor, 50 AI-driven citizens, and an economy under pressure. I built the Godot interface for live city metrics, policy decisions, and their consequences.</p>
            <dl className="game-project-role"><dt>My role</dt><dd>{panicHub.role}</dd></dl>
            <p className="game-project-source"><a href={panicHub.competition.href} target="_blank" rel="noopener noreferrer">{panicHub.competition.name}<ArrowUpRight size={12} aria-hidden="true" /></a></p>
            <div className="game-project-actions">
              <Link href="/missions/panic-hub" className="theme-button">Explore Panic Hub<ArrowUpRight size={16} aria-hidden="true" /></Link>
              <a href={`https://www.youtube.com/watch?v=${panicHub.video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="game-project-secondary">Watch trailer<ArrowUpRight size={13} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="game-project-media game-project-trailer"><ProjectVideo {...panicHub.video} showCaption={false} /></div>
        </article>
        <article id="escape-the-belt" aria-labelledby="escape-the-belt-heading" className="game-project-card game-project-companion" data-theme-cycle-ignore>
          <a href={escapeTheBelt.href} target="_blank" rel="noopener noreferrer" aria-label="Play Escape the Belt on Unity" className="game-project-media"><Image src="/projects/escape-the-belt/gameplay.png" alt="Escape the Belt gameplay: a spacecraft navigating an asteroid field" width={694} height={478} sizes="(min-width: 1024px) 240px, (min-width: 640px) 180px, 90vw" /></a>
          <div className="game-project-body">
            <p className="game-project-label"><span>{escapeTheBelt.engine}</span>{escapeTheBelt.context}</p>
            <h3 id="escape-the-belt-heading" className="font-editorial italic">{escapeTheBelt.name}</h3>
            <p className="game-project-description">{escapeTheBelt.description}</p>
            <p className="game-project-source">Built from <a href={escapeTheBelt.foundation.href} target="_blank" rel="noopener noreferrer">{escapeTheBelt.foundation.name}<ArrowUpRight size={12} aria-hidden="true" /></a></p>
          </div>
          <div className="game-project-actions"><a href={escapeTheBelt.href} target="_blank" rel="noopener noreferrer" className="theme-button">Play on Unity<Gamepad2 size={16} aria-hidden="true" /></a></div>
        </article>
      </div>
    </div>
  </section>;
}
