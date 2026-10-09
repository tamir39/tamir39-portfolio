"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Palette, Pause, Play, Sun } from "lucide-react";
import { themes } from "@/lib/themes";
import { darkSwatches } from "@/lib/appearance";
import { usePortfolioTheme } from "./providers/ThemeProvider";
import { CAT_THEME_TOUR_EVENT, type CatTourDockState } from "@/lib/cat-theme-tour";

const modes = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceDock() {
  const { theme, setTheme, appearance, resolvedAppearance, setAppearance, motionPaused, toggleMotion, reduced } = usePortfolioTheme();
  const [open, setOpen] = useState(false);
  const [tour, setTour] = useState<CatTourDockState>({ active: false });
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = themes.find(item => item.id === theme)!;
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const close = () => { cancelClose(); setOpen(false); };
  useEffect(() => {
    const guide = (event: Event) => {
      const next = (event as CustomEvent<CatTourDockState>).detail;
      if (!next) return;
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setTour(next);
      setOpen(next.active || next.keepOpen === true);
    };
    window.addEventListener(CAT_THEME_TOUR_EVENT, guide);
    return () => window.removeEventListener(CAT_THEME_TOUR_EVENT, guide);
  }, []);
  useEffect(() => {
    if (!open || tour.active) return;
    const outside = (event: PointerEvent) => {
      if (document.documentElement.dataset.themeReveal === "true" && event.target === document.documentElement) return;
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, tour.active]);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  return <div ref={root} className="appearance-dock" data-open={open} data-cat-tour={tour.active || undefined}
    onPointerEnter={event => { cancelClose(); if (event.pointerType === "mouse" && window.matchMedia("(min-width: 900px) and (hover: hover)").matches) setOpen(true); }}
    onPointerLeave={event => { if (!tour.active && document.documentElement.dataset.themeReveal !== "true" && event.pointerType === "mouse" && !root.current?.querySelector(":focus-visible")) closeTimer.current = setTimeout(() => setOpen(false), 250); }}
    onBlurCapture={event => { if (!tour.active && document.documentElement.dataset.themeReveal !== "true" && !event.currentTarget.contains(event.relatedTarget)) close(); }}
    onKeyDown={event => { if (event.key !== "Escape" || !open) return; event.preventDefault(); close(); trigger.current?.focus(); }}>
    <button ref={trigger} type="button" className="appearance-dock-trigger" aria-label={`Appearance, current style: ${current.name}`} aria-expanded={open} aria-controls="appearance-fan" onClick={event => { cancelClose(); if (event.detail > 0 && window.matchMedia("(min-width: 900px) and (hover: hover)").matches) setOpen(true); else if (open) close(); else setOpen(true); }}><Palette size={20} aria-hidden="true" /></button>
    <div id="appearance-fan" className="appearance-fan" role="region" aria-label="Appearance" inert={!open} aria-hidden={!open}>
      <div className="dock-styles" role="group" aria-label="Visual style">{themes.map((item, index) => {
        const swatch = resolvedAppearance === "dark" ? darkSwatches[item.id] : { ink: item.color, paper: item.paper };
        return <button key={item.id} type="button" className="dock-style" data-theme-option={item.id} data-cat-target={tour.active && !tour.mode && tour.theme === item.id || undefined} data-cat-tap={tour.active && !tour.mode && tour.theme === item.id && tour.tapping || undefined} aria-label={`${item.name} style`} aria-pressed={theme === item.id} onClick={() => { cancelClose(); setTheme(item.id); }} style={{ "--swatch-ink": swatch.ink, "--swatch-paper": swatch.paper, "--dock-order": index } as React.CSSProperties}><span className={`dock-symbol dock-symbol-${item.id}`} aria-hidden="true">{item.symbol}{theme === item.id && <Check size={11} className="dock-style-check" />}</span><span className="dock-style-label">{item.name}</span></button>;
      })}</div>
      <div className="dock-preferences" role="group" aria-label="Display preferences">
        <div className="dock-modes" role="group" aria-label="Color mode">{modes.map(mode => <button key={mode.id} type="button" className="dock-mode" data-mode-option={mode.id} data-cat-target={tour.active && tour.mode === mode.id || undefined} data-cat-tap={tour.active && tour.mode === mode.id && tour.tapping || undefined} aria-label={`${mode.label} color mode`} aria-pressed={appearance === mode.id} onClick={() => setAppearance(mode.id)}><mode.icon size={17} aria-hidden="true" /><span className="dock-preference-label" aria-hidden="true">{mode.label}</span></button>)}</div>
        <button type="button" className="dock-motion" aria-label="Animations" aria-pressed={!motionPaused} onClick={toggleMotion}>{motionPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}<span className="dock-preference-label" aria-hidden="true">{motionPaused ? "Motion off" : reduced ? "Reduced motion" : "Motion on"}</span></button>
      </div>
      <p className="sr-only" role="status">{current.name}, {appearance === "system" ? `system ${resolvedAppearance}` : resolvedAppearance}</p>
    </div>
  </div>;
}
