"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { themes } from "@/lib/themes";
import { CAT_THEME_TOUR_EVENT, CAT_HERO_TRAVEL_MS, CAT_PICKER_GUIDE_MS, catThemeTourPlan, catThemePlayPlan, catThemePlayOverridden, runCatThemeTour, runCatHeroTour, type CatTourDockState, type CatTourPhase, type CatTourStep } from "@/lib/cat-theme-tour";
import { themeControlAtPoint } from "@/lib/theme-reveal";

type TourState = { kind: "tour" | "play"; phase: CatTourPhase; step: CatTourStep | null; text: string };
type TourOptions = {
  prepared: boolean;
  enabled: boolean;
  onActive: (active: boolean, outcome?: { kind: "tour" | "play"; interrupted: boolean; visitor: boolean }) => void;
  onMove: (button: HTMLButtonElement, duration?: number) => void;
  onTap: (button: HTMLButtonElement) => void;
  onHeroMove: (step: CatTourStep) => void;
  onHeroTap: (step: CatTourStep) => void;
  onHeroChange: (step: CatTourStep) => void;
  onOverride: () => void;
};

function dock(detail: CatTourDockState) {
  window.dispatchEvent(new CustomEvent(CAT_THEME_TOUR_EVENT, { detail }));
}

function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const abort = () => { window.clearTimeout(timer); reject(signal.reason); };
    const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, milliseconds);
    signal.addEventListener("abort", abort, { once: true });
  });
}

function headingVisible() {
  const box = document.querySelector("h1.hero-title")?.getBoundingClientRect();
  return Boolean(box && box.top >= 80 && box.bottom <= window.innerHeight - 12);
}

function waitForHeading(step: CatTourStep, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const observer = new MutationObserver(check);
    const clean = () => { observer.disconnect(); window.clearTimeout(timer); signal.removeEventListener("abort", abort); };
    const abort = () => { clean(); reject(signal.reason); };
    function check() {
      const heading = document.querySelector<HTMLElement>("h1.hero-title");
      if (heading?.dataset.heroTheme !== step.theme || heading.dataset.heroReveal !== "complete" || document.documentElement.dataset.themeReveal === "true") return;
      clean(); resolve();
    }
    // Also recover if a browser cannot run its transition or animation frames.
    const timer = window.setTimeout(() => { clean(); resolve(); }, 4000);
    observer.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["data-hero-reveal", "data-theme-reveal"] });
    signal.addEventListener("abort", abort, { once: true });
    check();
  });
}

function returnToHeading(signal: AbortSignal): Promise<void> {
  if (headingVisible()) return Promise.resolve();
  const heading = document.querySelector("h1.hero-title")?.getBoundingClientRect();
  if (heading) {
    const top = Math.min(window.innerWidth < 900 ? 260 : 310, window.innerHeight - heading.height - 12);
    window.scrollTo({ top: Math.max(0, window.scrollY + heading.top - top), behavior: "smooth" });
  }
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    let frame = 0, lastY = window.scrollY, settledAt = performance.now();
    const startedAt = settledAt;
    const abort = () => { cancelAnimationFrame(frame); reject(signal.reason); };
    const tick = (now: number) => {
      if (window.scrollY !== lastY) { lastY = window.scrollY; settledAt = now; }
      if (headingVisible() && now - settledAt >= 140) { signal.removeEventListener("abort", abort); resolve(); return; }
      if (now - startedAt > 3000) { signal.removeEventListener("abort", abort); reject(new Error("Hero heading unavailable")); return; }
      frame = requestAnimationFrame(tick);
    };
    signal.addEventListener("abort", abort, { once: true });
    frame = requestAnimationFrame(tick);
  });
}

/** The tour owns movement and speech until it completes or the visitor takes over. */
export function useCatThemeTour(options: TourOptions) {
  const latest = useRef(options);
  latest.current = options;
  const [state, setState] = useState<TourState | null>(null);
  const active = useRef(false);
  const run = useRef<AbortController | null>(null);
  const consumed = useRef(false);
  const openingPending = useRef(true);
  const keepDockOpen = useRef(false);
  const visitorStopped = useRef(false);
  const playfulChoice = useRef<{ step: CatTourStep; at: number } | null>(null);
  const pendingReply = useRef(false);
  const [requested, setRequested] = useState<"tour" | "play" | null>(null);
  const preparation = useRef<AbortController | null>(null);

  const finishOpening = useCallback((animate = false) => {
    if (!openingPending.current) return;
    openingPending.current = false;
    // A cramped viewport or a deliberate interruption may have already shown it.
    if (document.documentElement.dataset.heroOpening !== "ready") document.documentElement.dataset.heroOpening = animate ? "settling" : "ready";
  }, []);

  const stop = useCallback((keepOpen = false, visitor = false) => {
    keepDockOpen.current = keepOpen;
    visitorStopped.current ||= visitor;
    run.current?.abort();
    preparation.current?.abort();
    setRequested(null);
  }, []);

  const start = useCallback((kind: "tour" | "play" = "tour") => {
    if (active.current || !latest.current.enabled || document.hidden || document.documentElement.dataset.pageIntro !== "complete") return;
    if (kind === "tour" && !headingVisible()) return;
    const abort = new AbortController();
    run.current = abort;
    active.current = true;
    consumed.current = true;
    keepDockOpen.current = false;
    visitorStopped.current = false;
    playfulChoice.current = null;
    pendingReply.current = false;
    document.documentElement.dataset.catThemeTour = "running";
    if (kind === "tour" && openingPending.current && document.documentElement.dataset.heroOpening !== "ready") document.documentElement.dataset.heroOpening = "showcase";
    latest.current.onActive(true);
    setState({ kind, phase: "inviting", step: null, text: kind === "tour" ? "" : "This picker looks suspiciously paw-sized. One tiny experiment." });
    dock({ active: kind === "play" });
    const original = themes.find(item => item.id === document.documentElement.dataset.theme)?.id ?? "editorial";
    const appearance = document.documentElement.dataset.appearance === "dark" ? "dark" : "light";
    const plan = kind === "tour" ? catThemeTourPlan(themes, original) : catThemePlayPlan(themes, original, appearance);
    const getButton = (step: CatTourStep) => {
      abort.signal.throwIfAborted();
      const button = document.querySelector<HTMLButtonElement>(`.appearance-dock [data-${step.mode ? `mode-option="${step.mode}"` : `theme-option="${step.theme}"`}]`);
      if (!button || button.closest("[inert]")) throw new Error("Theme controls unavailable");
      return button;
    };
    const ports = {
      signal: abort.signal,
      wait: (milliseconds: number) => wait(milliseconds, abort.signal),
      visit: async (step: CatTourStep) => {
        if (kind === "tour") {
          if (!document.querySelector(".hero-title")) throw new Error("Hero heading unavailable");
          setState({ kind, phase: "moving", step, text: "" });
          latest.current.onHeroMove(step);
          await wait(CAT_HERO_TRAVEL_MS, abort.signal);
          return;
        }
        dock({ active: true, theme: step.theme, mode: step.mode });
        playfulChoice.current = { step, at: performance.now() };
        setState({ kind, phase: "moving", step, text: `${step.name} next. Follow my paw.` });
        latest.current.onMove(getButton(step));
        await wait(1000, abort.signal);
      },
      tap: (step: CatTourStep) => {
        if (kind === "tour") {
          setState({ kind, phase: "tapping", step, text: step.text });
          latest.current.onHeroTap(step);
          return;
        }
        const button = getButton(step);
        latest.current.onTap(button);
        setState({ kind, phase: "tapping", step, text: step.text });
        if (kind === "play") playfulChoice.current = { step, at: performance.now() };
        dock({ active: true, theme: step.theme, mode: step.mode, tapping: true });
        // Use the real control's handler, so the tour and visitor share one theme path.
        button.click();
      },
      show: (step: CatTourStep) => {
        setState({ kind, phase: "showing", step, text: kind === "tour" ? "" : step.text });
        if (kind === "play") dock({ active: true, theme: step.theme, mode: step.mode });
      },
    };
    const sequence = kind === "tour" ? runCatHeroTour(plan, { ...ports,
      speak: step => setState({ kind, phase: "inviting", step, text: step.text }),
      change: step => latest.current.onHeroChange(step),
      reveal: step => waitForHeading(step, abort.signal), guide: async () => {
      abort.signal.throwIfAborted();
      const trigger = document.querySelector<HTMLButtonElement>(".appearance-dock-trigger");
      if (!trigger) throw new Error("Theme picker unavailable");
      setState({ kind, phase: "moving", step: null, text: "" });
      latest.current.onMove(trigger, CAT_HERO_TRAVEL_MS);
      await wait(CAT_HERO_TRAVEL_MS, abort.signal);
      abort.signal.throwIfAborted();
      dock({ active: true });
      setState({ kind, phase: "guiding", step: null, text: "Your turn. Change the look—or the lights—right here." });
      await wait(CAT_PICKER_GUIDE_MS, abort.signal);
    } }) : runCatThemeTour(plan, ports);
    void sequence.catch(() => { /* Visitor interaction, route changes, or unavailable controls end the tour. */ }).finally(() => {
      if (run.current !== abort) return;
      run.current = null;
      active.current = false;
      document.documentElement.dataset.catThemeTour = abort.signal.aborted ? "skipped" : "complete";
      if (kind === "tour") finishOpening(!abort.signal.aborted);
      dock({ active: false, keepOpen: keepDockOpen.current });
      setState(null);
      latest.current.onActive(false, { kind, interrupted: abort.signal.aborted, visitor: visitorStopped.current });
      if (pendingReply.current) { pendingReply.current = false; latest.current.onOverride(); }
    });
  }, [finishOpening]);

  // Explicit menu requests wait for the closed menu's render and enabled state.
  // Returning to the hero happens before the tour owns scroll cancellation.
  useEffect(() => {
    if (!requested || !options.enabled) return;
    const abort = new AbortController();
    preparation.current = abort;
    const prepare = requested === "tour" ? (async () => {
      await returnToHeading(abort.signal);
      abort.signal.throwIfAborted();
      openingPending.current = true;
      document.documentElement.dataset.heroOpening = "pending";
      // Let the centered layout finish measuring before the cat samples its arc.
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      abort.signal.throwIfAborted();
    })() : Promise.resolve();
    void prepare.then(() => {
      abort.signal.throwIfAborted();
      start(requested);
      if (!active.current && requested === "tour") finishOpening();
    }).catch(() => {}).finally(() => {
      if (preparation.current === abort) { preparation.current = null; setRequested(null); }
    });
    return () => { abort.abort(); };
  }, [requested, options.enabled, start, finishOpening]);

  useEffect(() => {
    // Observe the existing intro instead of adding another intro or loading timer.
    const root = document.documentElement;
    let timer = 0;
    const check = () => {
      if (!options.prepared || root.dataset.pageIntro !== "complete" || timer) return;
      if (consumed.current) { if (!active.current) finishOpening(); return; }
      // A reduced-motion, hidden, or sleeping companion never auto-tours.
      if (!latest.current.enabled || document.hidden || root.dataset.heroOpening === "ready") { finishOpening(); return; }
      timer = window.setTimeout(() => { timer = 0; if (!consumed.current) { start(); if (!active.current) finishOpening(); } }, 800);
    };
    const observer = new MutationObserver(check);
    observer.observe(root, { attributes: true, attributeFilter: ["data-page-intro"] });
    check();
    return () => { observer.disconnect(); window.clearTimeout(timer); };
  }, [start, options.prepared, options.enabled, finishOpening]);

  useEffect(() => {
    if (!options.enabled) stop();
  }, [options.enabled, stop]);

  useEffect(() => {
    const takeOver = (event: Event) => {
      if (!event.isTrusted) return;
      if (!active.current) {
        // Programmatic return-to-hero scroll is expected; deliberate input cancels it.
        if (preparation.current && event.type !== "scroll") stop();
        if (document.documentElement.dataset.pageIntro === "complete") { consumed.current = true; finishOpening(); }
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const paletteHit = event instanceof PointerEvent && target === document.documentElement && document.documentElement.dataset.themeReveal === "true" && themeControlAtPoint({ x: event.clientX, y: event.clientY });
      stop(Boolean(target?.closest(".appearance-dock") || paletteHit), event.type !== "resize");
    };
    const visibility = () => { if (document.hidden) stop(); };
    const chose = (event: MouseEvent) => {
      if (!event.isTrusted) return;
      const recent = playfulChoice.current;
      if (!recent || performance.now() - recent.at > 25_000) return;
      const target = event.target instanceof Element ? event.target : null;
      const captured = target === document.documentElement && document.documentElement.dataset.themeReveal === "true" ? themeControlAtPoint({ x: event.clientX, y: event.clientY }) : null;
      const button = captured ?? target?.closest<HTMLElement>("[data-theme-option],[data-mode-option]");
      if (!button) return;
      playfulChoice.current = null;
      if (!catThemePlayOverridden(recent.step, { theme: button.dataset.themeOption, mode: button.dataset.modeOption })) return;
      if (active.current) { pendingReply.current = true; stop(true); }
      else latest.current.onOverride();
    };
    // Hovering is welcome; clicking, typing, scrolling, or resizing takes control back.
    document.addEventListener("pointerdown", takeOver, true);
    document.addEventListener("keydown", takeOver, true);
    document.addEventListener("click", chose, true);
    window.addEventListener("wheel", takeOver, { passive: true });
    window.addEventListener("scroll", takeOver, { passive: true });
    window.addEventListener("resize", takeOver);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("pointerdown", takeOver, true);
      document.removeEventListener("keydown", takeOver, true);
      document.removeEventListener("click", chose, true);
      window.removeEventListener("wheel", takeOver);
      window.removeEventListener("scroll", takeOver);
      window.removeEventListener("resize", takeOver);
      document.removeEventListener("visibilitychange", visibility);
      run.current?.abort();
      preparation.current?.abort();
      run.current = null;
      active.current = false;
      dock({ active: false });
    };
  }, [stop, finishOpening]);

  const play = useCallback(() => start("play"), [start]);
  const request = useCallback((kind: "tour" | "play") => { consumed.current = true; setRequested(kind); }, []);
  return { state, active, start, play, stop, request };
}
