"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight, Pause, Play, Sparkles } from "lucide-react";
import { universeChapters } from "@/lib/data/universe-chapters";

const CosmicCanvas = dynamic(() => import("./CosmicCanvas"), { ssr: false });

function Chapter({ index, progress, moving, active }: { index: number; progress: MotionValue<number>; moving: boolean; active: boolean }) {
  const chapter = universeChapters[index];
  const start = index / 5;
  const end = (index + 1) / 5;
  const opacity = useTransform(progress, index === 0 ? [0, end - 0.055, end - 0.012] : index === 4 ? [start - 0.025, start + 0.015, 1] : [start - 0.025, start + 0.015, end - 0.055, end - 0.012], index === 0 ? [1, 1, 0] : index === 4 ? [0, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, [start - 0.025, start + 0.02, end - 0.05, end], [25, 0, 0, -25]);
  const heading = <>{chapter.title[0]}<br />{chapter.title[1]}<br /><span className="font-editorial font-normal italic" style={{ color: chapter.color }}>{chapter.emphasis}</span></>;
  return <motion.div className="universe-chapter" aria-hidden={!active} style={{ opacity, y: moving ? y : 0, pointerEvents: active ? "auto" : "none" }}>
    <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#655c7e] sm:text-xs">{chapter.coordinate}</p>
    {index === 0 ? <h1 className="universe-heading">{heading}</h1> : <h2 className="universe-heading">{heading}</h2>}
    <p className="mt-6 max-w-[340px] text-sm leading-relaxed text-[#655c7e] sm:text-base">{chapter.text}</p>
    <Link href={chapter.href} tabIndex={active ? 0 : -1} className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-full border border-[#655c7e]/25 bg-white/35 px-5 text-xs font-semibold text-[#504571] backdrop-blur-sm transition-colors hover:bg-white/70">{chapter.link}<ArrowUpRight size={14} aria-hidden="true" /></Link>
  </motion.div>;
}

export function CosmicJourney() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [active, setActive] = useState(0);
  const onUnavailable = useCallback(() => setFallback(true), []);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const progressWidth = useTransform(scrollYProgress, value => `${Math.max(2, value * 100)}%`);
  const moving = ready && reduced === false && !paused;
  useEffect(() => {
    setReady(true);
    const update = (value: number) => setActive(Math.min(4, Math.floor(value * 5 + 0.08)));
    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress]);

  return <section ref={section} className="cosmic-journey" style={{ position: "relative" }} aria-label="Five universes of design, development, and play">
    <div className="cosmic-stage" data-universe={universeChapters[active].id}>
      <div className="cosmic-sky" aria-hidden="true"><div className="cosmic-fallback-planet" /><div className="cosmic-orbit" /><div className="cosmic-fallback-comet" /><div className="cosmic-star star-one">✦</div><div className="cosmic-star star-two">✧</div><div className="cosmic-star star-three">✦</div></div>
      {ready && !fallback && <CosmicCanvas progress={scrollYProgress} moving={moving} onUnavailable={onUnavailable} />}
      <div className="cosmic-haze" aria-hidden="true" />
      <div className="absolute inset-x-0 top-5 z-20 mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 sm:px-10 lg:px-16"><span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#655c7e] sm:text-xs"><Sparkles size={14} aria-hidden="true" /> A universe of possibilities</span><a href="#work" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#504571] hover:underline">Skip to projects<ArrowUpRight size={14} aria-hidden="true" /></a></div>
      <div className="cosmic-story mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">{universeChapters.map((chapter, index) => <Chapter key={chapter.id} index={index} progress={scrollYProgress} moving={moving} active={index === active} />)}</div>
      <div className="cosmic-scene-label" aria-hidden="true"><span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em]">Universe 0{active + 1} / 05</span><span className="font-editorial text-xl italic">{universeChapters[active].caption}</span></div>
      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-[1440px] px-6 pb-5 sm:px-10 lg:px-16">
        <div className="mb-3 flex items-center justify-between gap-3"><nav aria-label="Universe navigation" className="flex flex-wrap gap-1 sm:gap-2">{universeChapters.map((chapter, index) => <a key={chapter.id} href={`#universe-${chapter.id}`} aria-label={`Go to universe ${index + 1}: ${chapter.name}`} aria-current={active === index ? "step" : undefined} className={`universe-nav-link ${active === index ? "is-current" : ""}`}><span className="font-mono text-[10px]">0{index + 1}</span><span className="hidden text-xs sm:inline">{chapter.name}</span></a>)}</nav><button type="button" onClick={() => setPaused(value => !value)} disabled={!!reduced || fallback} aria-pressed={paused || !!reduced} aria-label={reduced ? "Animation disabled by your system preference" : paused ? "Resume scene motion" : "Pause scene motion"} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#9188aa]/35 bg-white/30 px-3 text-xs text-[#504571] backdrop-blur-sm disabled:cursor-default">{moving ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}<span className="hidden md:inline">{moving ? "Pause motion" : "Motion off"}</span></button></div>
        <div className="mb-3 flex items-center justify-between text-[10px] text-[#655c7e]"><span className="flex items-center gap-2"><ArrowDown size={12} aria-hidden="true" />Scroll to travel between worlds</span><span>{String(active + 1).padStart(2,"0")} / 05</span></div>
        <div className="h-px overflow-hidden bg-[#9487b2]/20"><motion.div className="h-full bg-[#8676b5]" style={{ width: progressWidth }} /></div>
      </div>
    </div>
    {universeChapters.map((chapter, index) => <span key={chapter.id} id={`universe-${chapter.id}`} className="universe-anchor" style={{ top: index === 0 ? 0 : `calc(${index * 20 + 4}% - ${index * 20 + 4}svh + 55px)` }} />)}
  </section>;
}
