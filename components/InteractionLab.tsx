"use client";

import { Portrait } from "./Portrait";
import { Exploration } from "./Exploration";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Repeat2 } from "lucide-react";
import { usePortfolioTheme } from "./providers/ThemeProvider";
import { DESKTOP_THEME_CYCLE_MEDIA, themes, themeTransition } from "@/lib/themes";
import { currentRole } from "@/lib/data/profile";
import { HeroArtwork } from "./HeroArtwork";

export function InteractionLab() {
  const hero = useRef<HTMLDivElement>(null);
  const introPointer = useRef<{ x: number; y: number } | null>(null);
  const { theme, setTheme, reduced } = usePortfolioTheme();
  const current = themes.find(item => item.id === theme)!;
  const transition = themeTransition(theme, reduced);
  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    element.setAttribute("data-hero-ready", "");
    return () => { element.removeAttribute("data-hero-ready"); };
  }, []);
  const nextTheme = () => {
    if (!window.matchMedia(DESKTOP_THEME_CYCLE_MEDIA).matches) return;
    const liveTheme = document.documentElement.dataset.theme;
    setTheme(themes[(themes.findIndex(item => item.id === liveTheme) + 1) % themes.length].id);
  };
  return <section id="lab" className="portfolio-hero px-6 pb-20 sm:px-10 lg:px-16">
    <div className="mx-auto max-w-[1312px]">
      <div ref={hero} className="hero-layout" data-theme-cycle-ignore>
        <HeroArtwork />
        <div className="hero-atmosphere" aria-hidden="true"><i /><i /><i /></div>
        <div className="hero-index"><motion.span key={theme} initial={false} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={transition} className="hero-emblem" aria-hidden="true">{current.symbol}</motion.span><p className="section-eyebrow">Frontend & UI/UX / 2026</p></div>
        <h1 className="hero-title">
          <span>{current.title[0]}</span>
          <span className="hero-title-accent">{current.title[1]}</span>
        </h1>
        <div className="hero-intro" data-theme-cycle-ignore onPointerDown={event => {
          introPointer.current = event.isPrimary && event.button === 0 ? { x: event.clientX, y: event.clientY } : null;
        }} onPointerMove={event => {
          if (introPointer.current && Math.hypot(event.clientX - introPointer.current.x, event.clientY - introPointer.current.y) > 8) introPointer.current = null;
        }} onPointerCancel={() => { introPointer.current = null; }} onPointerLeave={() => { introPointer.current = null; }} onClick={event => {
          const click = introPointer.current;
          introPointer.current = null;
          if (event.detail > 0 && !click) return;
          if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || window.getSelection()?.isCollapsed === false || !(event.target instanceof Element) || event.target.closest('a,button,input,select,textarea,label,[contenteditable="true"]')) return;
          nextTheme();
        }}>
        <div className="hero-profile"><Portrait className="portrait-frame size-20 border-4 shadow-sm" sizes="90px" priority /><div className="min-w-0"><p className="text-lg font-medium">Hi, I’m Tamir.</p><p className="mt-2 text-sm font-medium leading-relaxed">{currentRole.title}</p><p className="mt-1 text-xs text-muted">at {currentRole.company}</p></div></div>
        <p className="hero-description text-base leading-relaxed text-muted">I turn ideas into digital experiences that feel as good as they work. I bring design and code together to make every interaction clear, intuitive, and memorable.</p>
        <div className="hero-intro-actions"><a href="#work" className="hero-projects-link theme-button inline-flex min-h-12 items-center gap-3 px-6 text-sm font-medium">Explore my projects<ArrowUpRight size={16} aria-hidden="true" /></a><button type="button" className="hero-theme-hint" onClick={nextTheme}><Repeat2 size={12} aria-hidden="true" /><span>Tap to change theme</span></button></div>
        </div>
      </div>
      <a className="hero-studio-cue" href="#exploration"><span>Curiosity, in practice</span><span>Inside my studio<ArrowDown size={15} aria-hidden="true" /></span></a>
      <Exploration />
    </div>
  </section>;
}
