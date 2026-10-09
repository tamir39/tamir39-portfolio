"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { usePortfolioTheme } from "./providers/ThemeProvider";
import type { HeroScene } from "@/lib/hero-artwork";
import type { ThemeId } from "@/lib/themes";
import { useThemeViewportVisible } from "./ViewportThemeScope";

const treatments = {
  editorial: { name: "Floating paths", hint: "Move to bend · Click to send a wave", action: "Send a wave through the floating paths", response: "A soft wave flows through the paths." },
  swiss: { name: "Kinetic grid", hint: "Move to shift · Click to ripple", action: "Send a ripple through the kinetic grid", response: "A red ripple expands through the grid." },
  blueprint: { name: "Wireframe forms", hint: "Move to rotate · Click to change form", action: "Change the wireframe form", response: "" },
  play: { name: "A little room to play", hint: "Move to nudge · Click to scatter", action: "Scatter the floating spheres", response: "The spheres scatter, then float back together." },
  botanical: { name: "Living contours", hint: "Move to shape · Click to bloom", action: "Make the contour lines bloom", response: "The contours bloom outward." },
} satisfies Record<ThemeId, { name: string; hint: string; action: string; response: string }>;

export function HeroArtwork() {
  const [desktop, setDesktop] = useState(false);
  const { theme, resolvedAppearance, reduced } = usePortfolioTheme();
  const visible = useThemeViewportVisible();
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return desktop && visible ? <Artwork key={`${theme}-${resolvedAppearance}-${reduced}`} theme={theme} reduced={reduced} /> : null;
}

function Artwork({ theme, reduced }: { theme: ThemeId; reduced: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HeroScene | null>(null);
  const hintId = useId();
  const [response, setResponse] = useState("");
  const treatment = treatments[theme];

  useEffect(() => {
    let cancelled = false;
    // Keep the renderer out of the initial and mobile bundles. No WebGL dependency.
    import("@/lib/hero-artwork").then(({ createHeroScene }) => {
      if (cancelled || !canvas.current) return;
      scene.current = createHeroScene(canvas.current, theme, reduced);
    });
    return () => { cancelled = true; scene.current?.dispose(); scene.current = null; };
  }, [theme, reduced]);

  const activate = (event: MouseEvent<HTMLButtonElement>) => {
    if (!scene.current || reduced) return;
    const nextForm = scene.current.activate(event.detail ? { x: event.clientX, y: event.clientY } : undefined);
    if (theme === "blueprint") {
      setResponse(`${nextForm} wireframe. Move the pointer to rotate it.`);
    } else setResponse(treatment.response);
  };

  return <div className="hero-artwork" data-theme-cycle-ignore data-art-theme={theme}>
    <button type="button" className="hero-artwork-surface" disabled={reduced} aria-label={treatment.action} aria-describedby={hintId} onClick={activate}>
      <canvas ref={canvas} className="hero-artwork-canvas" aria-hidden="true" />
    </button>
    <span id={hintId} className="sr-only">{reduced ? "Motion paused" : treatment.hint}</span>
    <span className="sr-only" role="status">{response}</span>
  </div>;
}
