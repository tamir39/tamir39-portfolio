"use client";

import { Exploration } from "./Exploration";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { usePortfolioTheme } from "./providers/ThemeProvider";
import { DESKTOP_THEME_CYCLE_MEDIA, themes, themeTransition } from "@/lib/themes";
import { HeroArtwork } from "./HeroArtwork";
import { HeroHeading } from "./HeroHeading";
import { HeroIntro } from "./HeroIntro";
import { useHeroOpening } from "@/lib/hooks/useHeroOpening";

export function InteractionLab() {
  const hero = useRef<HTMLDivElement>(null);
  const { theme, setTheme, reduced } = usePortfolioTheme();
  const stage = useHeroOpening(hero, theme, reduced);
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
      <div ref={hero} className="hero-layout" data-hero-stage={stage} data-theme-cycle-ignore>
        <HeroArtwork />
        <div className="hero-atmosphere" aria-hidden="true"><i /><i /><i /></div>
        <div className="hero-index"><motion.span key={theme} initial={false} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={transition} className="hero-emblem" aria-hidden="true">{current.symbol}</motion.span><p className="section-eyebrow">Frontend & UI/UX / 2026</p></div>
        <HeroHeading key={theme} theme={theme} reduced={reduced} />
        <HeroIntro stage={stage} reduced={reduced} nextTheme={nextTheme} />
      </div>
      <a className="hero-studio-cue" href="#exploration"><span>Curiosity, in practice</span><span>Inside my studio<ArrowDown size={15} aria-hidden="true" /></span></a>
      <Exploration />
    </div>
  </section>;
}
