"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Repeat2 } from "lucide-react";
import { Portrait } from "./Portrait";
import { currentRole } from "@/lib/data/profile";

export type HeroOpeningStage = "showcase" | "settling" | "revealing" | "ready";

const copy = [
  "Hi, I’m Tamir.",
  currentRole.title,
  `at ${currentRole.company}`,
  "I turn ideas into digital experiences that feel as good as they work. I bring design and code together to make every interaction clear, intuitive, and memorable.",
];
const length = copy.join("").length;

function IntroCopy({ part, revealed }: { part: number; revealed: number }) {
  let cursor = copy.slice(0, part).join("").length;
  return <><span className="sr-only">{copy[part]}</span><span aria-hidden="true">{copy[part].split(/(\s+)/).map((word, index) => {
    if (!word.trim()) { cursor += word.length; return word; }
    return <span className="hero-intro-word" key={index}>{Array.from(word).map((letter, letterIndex) =>
      <span key={letterIndex} className="hero-intro-letter" style={{ opacity: cursor++ < revealed ? 1 : 0 }}>{letter}</span>
    )}</span>;
  })}</span></>;
}

/** Reveal once after the opening; theme changes retain the complete profile. */
export function HeroIntro({ stage, reduced, nextTheme }: { stage: HeroOpeningStage; reduced: boolean; nextTheme: () => void }) {
  const introPointer = useRef<{ x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (stage === "showcase") { setRevealed(0); return; }
    if (stage !== "revealing") return;
    const root = document.documentElement;
    const complete = () => { root.dataset.heroOpening = "ready"; };
    if (reduced || document.hidden) { complete(); return; }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      setRevealed(Math.floor(progress * length));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else complete();
    };
    const skip = (event: Event) => { if (event.isTrusted) complete(); };
    const hide = () => { if (document.hidden) complete(); };
    frame = requestAnimationFrame(tick);
    document.addEventListener("pointerdown", skip, true);
    document.addEventListener("keydown", skip, true);
    window.addEventListener("scroll", skip, { passive: true });
    document.addEventListener("visibilitychange", hide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", skip, true);
      document.removeEventListener("keydown", skip, true);
      window.removeEventListener("scroll", skip);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [stage, reduced]);
  const hidden = stage === "showcase" || stage === "settling";
  const visible = stage === "ready" || reduced ? length : hidden ? 0 : revealed;
  return <div className="hero-intro" data-hero-profile={stage} inert={hidden} data-theme-cycle-ignore onPointerDown={event => {
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
    <div className="hero-profile"><Portrait className="portrait-frame size-20 border-4 shadow-sm" sizes="90px" priority /><div className="min-w-0"><p className="text-lg font-medium"><IntroCopy part={0} revealed={visible} /></p><p className="mt-2 text-sm font-medium leading-relaxed"><IntroCopy part={1} revealed={visible} /></p><p className="mt-1 text-xs text-muted"><IntroCopy part={2} revealed={visible} /></p></div></div>
    <p className="hero-description text-base leading-relaxed text-muted"><IntroCopy part={3} revealed={visible} /></p>
    <div className="hero-intro-actions"><a href="#work" className="hero-projects-link theme-button inline-flex min-h-12 items-center gap-3 px-6 text-sm font-medium">Explore my projects<ArrowUpRight size={16} aria-hidden="true" /></a><button type="button" className="hero-theme-hint" onClick={nextTheme}><Repeat2 size={12} aria-hidden="true" /><span>Tap to change theme</span></button></div>
  </div>;
}
