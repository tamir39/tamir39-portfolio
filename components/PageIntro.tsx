"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandScene } from "./BrandScene";
import { waitForHeroReadiness } from "@/lib/hero-readiness";

/** Initial loading screen, then the identity intro, then the complete page. */
export function PageIntro() {
  const surface = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const enter = useRef<HTMLButtonElement>(null);
  const finish = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const overlay = surface.current;
    if (!overlay) return;
    if (pathname !== "/" || document.querySelector(".page-state")) {
      root.dataset.pageIntro = "complete";
      return;
    }
    if (root.dataset.pageIntro !== "loading") {
      // Anchor visits intentionally skip the intro; publish their ready state too.
      root.dataset.pageIntro = "complete";
      return;
    }

    let disposed = false;
    let complete = false;
    const controller = new AbortController();
    const animations = new Set<Animation>();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canAnimate = () => root.dataset.motion !== "off" && !media.matches;
    const previousFocus = document.activeElement;
    const releaseFocus = () => {
      if (!overlay.contains(document.activeElement)) return;
      if (previousFocus instanceof HTMLElement && previousFocus !== document.body && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
      else (document.activeElement as HTMLElement | null)?.blur();
    };
    const stop = () => {
      if (complete) return;
      complete = true;
      controller.abort();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      root.dataset.pageIntro = "complete";
      releaseFocus();
      window.clearTimeout(fallback);
      window.clearTimeout(minimum);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("pagehide", stop);
      media.removeEventListener("change", onMotionChange);
      stateObserver.disconnect();
    };
    finish.current = stop;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") stop();
      if (event.key === "Tab" && !overlay.contains(document.activeElement)) {
        event.preventDefault();
        (root.dataset.pageIntro === "loading" ? enter.current : skip.current)?.focus({ preventScroll: true });
      }
    };
    const onMotionChange = () => {
      if (["playing", "exiting"].includes(root.dataset.pageIntro ?? "") && !canAnimate()) stop();
    };
    const stateObserver = new MutationObserver(() => {
      if (root.dataset.pageIntro === "complete") stop();
      else onMotionChange();
    });
    stateObserver.observe(root, { attributes: true, attributeFilter: ["data-page-intro", "data-motion"] });
    document.addEventListener("keydown", onKey);
    window.addEventListener("pagehide", stop);
    media.addEventListener("change", onMotionChange);
    // Keep a broken asset or interrupted animation from trapping the visitor.
    const fallback = window.setTimeout(stop, 20000);
    let minimum: number;
    const minimumLoading = new Promise<void>(resolve => { minimum = window.setTimeout(resolve, 650); });

    const play = async () => {
      await Promise.all([waitForHeroReadiness(controller.signal), minimumLoading]);
      if (disposed || complete) return;
      if (!canAnimate()) { stop(); return; }
      root.dataset.pageIntro = "playing";
      const identity = overlay.querySelector(".page-intro-identity");
      await Promise.all(identity?.getAnimations({ subtree: true }).map(animation => animation.finished) ?? []);
      if (disposed || complete) return;
      const curtain = overlay.animate([
        { clipPath: "inset(0 0 0 0)" },
        { clipPath: "inset(0 0 0 100%)" },
      ], { duration: 500, delay: 180, easing: "cubic-bezier(.76,0,.24,1)", fill: "both" });
      animations.add(curtain);
      // The page is already in its final state; only the intro curtain moves.
      root.dataset.pageIntro = "exiting";
      await curtain.finished;
      if (!disposed) stop();
    };
    void play().catch(() => { if (!disposed) stop(); });

    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(fallback);
      window.clearTimeout(minimum);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("pagehide", stop);
      media.removeEventListener("change", onMotionChange);
      stateObserver.disconnect();
      animations.forEach(animation => animation.cancel());
      releaseFocus();
      // Strict Mode replays setup while the same first visit is still loading.
      root.dataset.pageIntro = complete || window.location.pathname !== "/" ? "complete" : "loading";
      finish.current = () => {};
    };
  }, [pathname]);

  return <div ref={surface} className="page-intro" data-theme-cycle-ignore>
    <div className="page-intro-loader">
      <BrandScene loading={!paused} variant="loading" />
      <span className="sr-only" role="status">Loading page…</span>
      <button type="button" className="page-intro-skip page-loader-pause" onClick={() => setPaused(value => !value)}>{paused ? "Resume animation" : "Pause animation"}</button>
      <button ref={enter} type="button" className="page-intro-skip page-loader-enter" onClick={() => finish.current()}>Enter site <span aria-hidden="true">↗</span></button>
    </div>
    <div className="page-intro-identity"><BrandScene /></div>
    <button ref={skip} type="button" className="page-intro-skip page-identity-skip" onClick={() => finish.current()}>Skip intro <span aria-hidden="true">↗</span></button>
  </div>;
}
