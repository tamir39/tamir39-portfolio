"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, GraduationCap, Leaf, Sparkles } from "lucide-react";
import { ProjectLogo } from "./ProjectLogo";
import { usePortfolioMotion } from "./providers/ThemeProvider";

type SlideProject = {
  slug: string;
  name: string;
  deliverable: string;
  state: string;
  description: string;
  focus: string[];
  websiteHref?: string;
};

/** Decorative editorial studies; the interactive app mockups stay on detail pages. */
function ProjectStudy({ slug }: { slug: string }) {
  if (slug === "moza") return <>
    <div className="study-copy"><span>Movement brings us together</span><p>Find your<br /><em>next move.</em></p></div>
    <svg className="study-court" viewBox="0 0 280 320" fill="none"><rect x="21" y="21" width="238" height="278" rx="3" /><path d="M21 160h238M140 21v278M21 100h238M21 220h238M65 100v120M215 100v120" /><circle cx="140" cy="160" r="25" /></svg>
    <div className="study-ball" />
    <div className="study-footnote"><span>Discover</span><i /><span>Connect</span><i /><span>Play</span></div>
  </>;
  if (slug === "selfnest") return <>
    <div className="study-copy"><span>Your daily landing place</span><p>A little<br /><em>more you.</em></p></div>
    <div className="study-nest"><div /><div /><div /><Leaf size={62} strokeWidth={1} /></div>
    <div className="study-ritual"><span><Check size={14} /> A quiet moment</span><span><Check size={14} /> A small routine</span><span><Sparkles size={14} /> A fresh start</span></div>
  </>;
  if (slug === "enstudy-hub") return <>
    <div className="study-copy"><span>A little learning, every day</span><p>Make room<br /><em>for curiosity.</em></p></div>
    <div className="study-flashcards"><div /><div /><div><BookOpen size={22} /><span>One word. A new possibility.</span><strong>curiosity</strong><small>/ ˌkjʊəriˈɒsəti /</small><p>The desire to know more.</p></div></div>
    <div className="study-footnote"><span>Collect</span><i /><span>Review</span><i /><span>Remember</span></div>
  </>;
  return <>
    <div className="study-copy"><span>Different roles. Shared progress.</span><p>Every step.<br /><em>A little further.</em></p></div>
    <div className="study-learning-path"><div><GraduationCap size={26} /><span>Interface design</span></div><ol><li><Check size={15} /><span>Foundations</span></li><li><span className="study-path-number">02</span><span>Visual hierarchy</span></li><li><span className="study-path-number">03</span><span>Interaction states</span></li></ol></div>
    <div className="study-footnote"><span>Student</span><i /><span>Teacher</span><i /><span>Admin</span></div>
  </>;
}

export function IndependentSlideshow({ projects }: { projects: SlideProject[] }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [announcement, setAnnouncement] = useState("");
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const { reduced } = usePortfolioMotion();
  const project = projects[active];
  if (!project) return null;

  function select(index: number, nextDirection = index > active ? 1 : -1) {
    const next = (index + projects.length) % projects.length;
    if (next === active) return;
    setDirection(nextDirection);
    setActive(next);
    setAnnouncement(`${projects[next].name}, project ${next + 1} of ${projects.length}`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target !== event.currentTarget && !target.closest("[data-slide-control]")) return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") select(0);
    else if (event.key === "End") select(projects.length - 1);
    else select(active + (event.key === "ArrowRight" ? 1 : -1), event.key === "ArrowRight" ? 1 : -1);
  }

  return <div className="independent-slideshow" style={{ "--slideshow-project-count": projects.length } as CSSProperties} role="region" aria-roledescription="carousel" aria-label="Independent projects" tabIndex={0} onKeyDown={onKeyDown}>
    <p className="sr-only">Use the project buttons or left and right arrow keys to browse. Swipe the visual preview on touch screens.</p>
    <div className="slideshow-toolbar">
      <p className="slideshow-caption">The independent collection <span aria-hidden="true">↗</span></p>
      <div className="slideshow-navigation" role="group" aria-label="Slideshow controls">
        <span className="slideshow-count" aria-hidden="true">{String(active + 1).padStart(2, "0")} <span>/ {String(projects.length).padStart(2, "0")}</span></span>
        <button type="button" data-slide-control aria-label="Previous project" onClick={() => select(active - 1, -1)}><ArrowLeft size={19} aria-hidden="true" /></button>
        <button type="button" data-slide-control aria-label="Next project" onClick={() => select(active + 1, 1)}><ArrowRight size={19} aria-hidden="true" /></button>
      </div>
    </div>
    <article id="independent-active-slide" className="slideshow-feature themed-panel" aria-roledescription="slide" aria-label={`${active + 1} of ${projects.length}: ${project.name}`}>
      <div className={`slideshow-visual study-${project.slug}`} aria-hidden="true"
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          dragStart.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { dragStart.current = null; }}
        onPointerUp={event => {
          const start = dragStart.current;
          dragStart.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) select(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        }}>
        <div className="study-masthead"><ProjectLogo slug={project.slug} size={28} /><span>{project.name}</span><span>Visual study / {String(active + 1).padStart(2, "0")}</span></div>
        <motion.div key={project.slug} className="study-scene" initial={reduced ? false : { opacity: 0, x: direction * 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}><ProjectStudy slug={project.slug} /></motion.div>
      </div>
      <div className="slideshow-story">
        <div className="slideshow-story-top"><span className="slideshow-state">{project.state}</span><span className="slideshow-large-index" aria-hidden="true">0{active + 1}</span></div>
        <p className="slideshow-deliverable">{project.deliverable}</p>
        <div className="slideshow-project-title"><ProjectLogo slug={project.slug} size={40} /><h3>{project.name}</h3></div>
        <p className="slideshow-description">{project.description}</p>
        <ul className="slideshow-focus" aria-label="Project focus">{project.focus.map(focus => <li key={focus}>{focus}</li>)}</ul>
        <div className="slideshow-actions">
          <Link href={`/missions/${project.slug}`} className="theme-button slideshow-project-link" aria-label={`Explore ${project.name}`}>Explore project<ArrowUpRight size={18} aria-hidden="true" /></Link>
          {project.websiteHref && <a href={project.websiteHref} target="_blank" rel="noopener noreferrer" className="slideshow-website-link" aria-label={`Visit ${project.name} website`}>Visit website<ArrowUpRight size={15} aria-hidden="true" /></a>}
        </div>
      </div>
    </article>
    <div className="slideshow-selectors" role="group" aria-label="Choose a project">
      {projects.map((item, index) => <button key={item.slug} type="button" data-slide-control aria-pressed={index === active} aria-controls="independent-active-slide" onClick={() => select(index)}>
        <span className="slideshow-selector-number" aria-hidden="true">0{index + 1}</span><ProjectLogo slug={item.slug} size={25} /><span>{item.name}</span><ArrowUpRight size={16} className="slideshow-selector-arrow" aria-hidden="true" />
      </button>)}
    </div>
    <p className="sr-only" role="status" aria-atomic="true">{announcement}</p>
  </div>;
}
